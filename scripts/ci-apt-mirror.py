"""Avoid the diagnosed slow Azure mirror on the disposable Hero CI runner.

Keep the runner's existing Ubuntu fallback, APT sources and signature checks.
No cache, new repository, signing key, package or timeout is introduced.
"""
from pathlib import Path
from urllib.parse import urlsplit
import sys


def without_azure_mirror(text):
    lines = text.splitlines(keepends=True)
    def host(line):
        return urlsplit(line.strip().split()[0]).hostname if line.strip() else None
    if not any(host(line) == "archive.ubuntu.com" for line in lines):
        raise ValueError("Expected existing archive.ubuntu.com fallback; refusing to change mirrors")
    return "".join(line for line in lines if host(line) != "azure.archive.ubuntu.com")


if __name__ == "__main__":
    path = Path(sys.argv[1] if len(sys.argv) > 1 else "/etc/apt/apt-mirrors.txt")
    original = path.read_text()
    updated = without_azure_mirror(original)
    path.write_text(updated)
    print("Using existing Ubuntu fallback mirrors; APT authentication and sources unchanged.")
    print(updated)
