"""One-time exact source transfer. Does not execute application code or update refs."""
import base64
import hashlib
import json
import os
import pathlib
import subprocess
import urllib.request

REPO = 'webiq1206/bacwater'
BASE = '070f21e76c996672d91934fe4fa0593f1b1d13eb'
BASE_TREE = 'ccd5cdd1c8c1f13bb778c642ca845a60b49e591b'
TARGET = 'bdf272c68cae7dc261cdfd74405b64abc8e52f25'
PAYLOAD_HASH = '65254756afea82a752357e05521b2f337b36415c30f6660ff16de66c832d2372'
CHUNKS = [
'd43c55c5ef290a059011b6624852ff7f649bdcb0',
'f17e1f56f861ad3004818b0de52e7303809b8950',
'a983c98faf968ae919fb2f5c3cf8e868cca36961',
'8f902d34b01e150cd18ac5307223f19813ca43b2',
'd829e3c39e9b6939f80416d41858554e1085dc4b',
'69906b39ebc789784ca74ce200a8a0d8d5d1296d',
'd62771aa45c39133d8c8e404f09e8c258229b915',
'accb096b478781c0113f4b215414de44c77482de',
'af400f9c8f05ea7609447c6c60db88b2c0407aef',
'2fc31b22005e3210086d4e928bc1e20c02b30276',
'e85ea4a6b01a95e149e6604daf47568dd39baa6b',
'45d34f1fad73d3065c42cc80974b6d9eb3f492b3',
'91f8a3bbdd69f5ad3aa44b8b015f7a0b8dd15d15',
]
assert os.environ.get('GITHUB_REPOSITORY') == REPO
assert os.environ.get('GITHUB_REF') == 'refs/heads/delivery/session-objects-20260924'

def api(path, body=None):
    assert path.startswith('/git/blobs') or path == '/git/trees'
    request = urllib.request.Request('https://api.github.com/repos/' + REPO + path,
        data=json.dumps(body).encode() if body is not None else None,
        headers={'Authorization': 'Bearer ' + os.environ['GH_TOKEN'],
                 'Accept': 'application/vnd.github+json',
                 'Content-Type': 'application/json',
                 'X-GitHub-Api-Version': '2022-11-28'})
    with urllib.request.urlopen(request, timeout=45) as response:
        return json.load(response)

def git(*args, data=None):
    return subprocess.run(['git', *args], input=data, check=True, stdout=subprocess.PIPE).stdout

def blob_sha(data):
    return hashlib.sha1(('blob %d\0' % len(data)).encode() + data).hexdigest()

parts = []
for sha in CHUNKS:
    obj = api('/git/blobs/' + sha)
    raw = base64.b64decode(obj['content'])
    assert blob_sha(raw) == sha
    parts.append(raw)
payload = b''.join(parts)
assert hashlib.sha256(payload).hexdigest() == PAYLOAD_HASH
entries = json.loads(payload)
assert len(entries) == 49
assert git('rev-parse', BASE + '^{tree}').decode().strip() == BASE_TREE
seen = set()
prepared = []
for path, old_sha, expected_sha, edits in entries:
    pp = pathlib.PurePosixPath(path)
    assert not pp.is_absolute() and '..' not in pp.parts and path not in seen
    assert path.startswith(('src/', 'scripts/', 'audit/')) or path in ['package.json', '.github/workflows/master-audit.yml']
    seen.add(path)
    if old_sha is None:
        assert not git('ls-tree', BASE, path).strip()
        before = b''
    else:
        before = git('show', BASE + ':' + path)
        assert blob_sha(before) == old_sha, path
    text = before.decode('utf-8')
    last = len(text)
    for start, end, replacement in reversed(edits):
        assert 0 <= start <= end <= last
        text = text[:start] + replacement + text[end:]
        last = start
    after = text.encode('utf-8')
    assert blob_sha(after) == expected_sha, path
    actual = git('hash-object', '-w', '--stdin', data=after).decode().strip()
    assert actual == expected_sha
    prepared.append((path, expected_sha, after))
# The whole source tree must equal the independently reviewed package before any upload.
os.environ['GIT_INDEX_FILE'] = '/tmp/bacwater-session-review.index'
git('read-tree', BASE)
for path, sha, _ in prepared:
    git('update-index', '--add', '--cacheinfo', '100644,' + sha + ',' + path)
assert git('write-tree').decode().strip() == TARGET
uploaded = []
for path, expected_sha, after in prepared:
    # Workflow updates are supplied directly through the authorized connector.
    if path.startswith('.github/'):
        continue
    response = api('/git/blobs', {'content': base64.b64encode(after).decode(), 'encoding': 'base64'})
    assert response['sha'] == expected_sha, path
    uploaded.append({'path': path, 'mode': '100644', 'type': 'blob', 'sha': expected_sha})
source_tree = api('/git/trees', {'base_tree': BASE_TREE, 'tree': uploaded})['sha']
report = {'baseline': BASE, 'reviewed_target_tree': TARGET, 'source_tree_without_workflow': source_tree,
          'uploaded_files': len(uploaded), 'entries': uploaded,
          'pending_workflow_blob': '14f4530b207fd6b031f3df9140fad01cd4d7d495',
          'branch_updates_performed': False, 'application_code_executed': False}
pathlib.Path('/tmp/bacwater-session-objects.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report))
