import base64
import hashlib
import json
import os
import pathlib
import urllib.request
REPO = 'webiq1206/bacwater'
PAYLOAD = '91f0feb2c45813546813a933549b88a92a398dda'
assert os.environ.get('GITHUB_REPOSITORY') == REPO
assert os.environ.get('GITHUB_REF') == 'refs/heads/delivery/session-objects-20260924'
def sha(data):
    return hashlib.sha1(('blob %d\0' % len(data)).encode() + data).hexdigest()
def api(path, data=None):
    assert path == '/git/blobs' or path.startswith('/git/blobs/')
    request = urllib.request.Request('https://api.github.com/repos/' + REPO + path,
        data=json.dumps(data).encode() if data is not None else None,
        headers={'Authorization':'Bearer '+os.environ['GH_TOKEN'], 'Accept':'application/vnd.github+json',
                 'Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'})
    with urllib.request.urlopen(request, timeout=45) as r:
        return json.load(r)
def get_blob(blob):
    result=api('/git/blobs/'+blob)
    data=base64.b64decode(result['content'])
    assert sha(data)==blob
    return data
rows=json.loads(get_blob(PAYLOAD))
assert len(rows)==5
prepared=[]
for path, old, expected, edits in rows:
    assert path.startswith('scripts/audit-') or path=='src/components/partners/calculator-products.tsx'
    text=get_blob(old).decode('utf-8')
    last=len(text)
    for start,end,replacement in reversed(edits):
        assert 0<=start<=end<=last
        text=text[:start]+replacement+text[end:]
        last=start
    data=text.encode('utf-8')
    assert sha(data)==expected,path
    assert b'<<<<<<< session' not in data
    prepared.append((path,expected,data))
report=[]
for path,expected,data in prepared:
    response=api('/git/blobs',{'encoding':'base64','content':base64.b64encode(data).decode()})
    assert response['sha']==expected
    report.append({'path':path,'sha':expected})
pathlib.Path('/tmp/session-merge-objects.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
