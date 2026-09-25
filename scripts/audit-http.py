"""Read-only complete public HTTP inventory. No credentials or form submissions."""
import argparse, concurrent.futures, hashlib, json, re, time
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit, parse_qs
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import xml.etree.ElementTree as ET

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=[]; self.h1=[]; self.headings=[]; self.links=[]; self.images=[]; self.ids=[]; self.meta={}; self.canonical=None; self.text=[]; self.main=0; self.skip=0; self.heading=None; self.in_title=False; self.svg=0; self.schema=[]; self.json_text=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if tag=='main': self.main+=1
        if tag in ('script','style'): self.skip+=1
        if tag=='script' and a.get('type')=='application/ld+json': self.json_text=[]
        if tag=='svg': self.svg+=1
        if tag=='title' and not self.svg: self.in_title=True
        if tag in ('h1','h2','h3','h4'): self.heading={'level':tag,'text':[]}
        if tag=='meta': self.meta[a.get('name',a.get('property','')).lower()]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag=='a' and a.get('href'): self.links.append({'href':a['href'],'rel':a.get('rel','')})
        if tag=='img': self.images.append({k:a.get(k) for k in ('src','alt','width','height','loading')})
    def handle_endtag(self, tag):
        if tag=='main': self.main=max(0,self.main-1)
        if tag=='title': self.in_title=False
        if tag=='svg': self.svg=max(0,self.svg-1)
        if tag in ('script','style'): self.skip=max(0,self.skip-1)
        if tag=='script' and self.json_text is not None:
            try: self.schema.append(json.loads(''.join(self.json_text)))
            except Exception: self.schema.append({'parseError':True})
            self.json_text=None
        if self.heading and tag==self.heading['level']:
            h={**self.heading,'text':' '.join(self.heading['text']).strip()};self.headings.append(h)
            if tag=='h1':self.h1.append(h['text'])
            self.heading=None
    def handle_data(self, data):
        t=' '.join(data.split())
        if self.json_text is not None:self.json_text.append(data)
        if self.in_title:self.title.append(t)
        if self.heading:self.heading['text'].append(t)
        if self.main and not self.skip and not self.svg and t:self.text.append(t)

def run(origin, out, extra):
    out=Path(out);(out/'html').mkdir(parents=True,exist_ok=True)
    host=urlsplit(origin).netloc; queue=[]; known={}; visited={}; endpoints=[]
    def add(url, source):
        url=urljoin(origin,url);u=urlsplit(url);q=parse_qs(u.query)
        if u.netloc!=host or u.scheme not in ('http','https'):return
        if re.match(r'^/(api|admin)(/|$)',u.path) or re.search(r'\.(?:svg|png|jpe?g|webp|ico|pdf|css|js|xml|txt)$',u.path):return
        if u.path.startswith('/plan/') and u.path not in ('/plan/new','/plan/advanced'):return
        if u.query and not (u.path=='/learn' and len(q)==1 and set(q)<= {'type','topic','peptide'}):return
        url=urlunsplit((u.scheme,u.netloc,u.path or '/',u.query,''))
        if url not in known: known[url]=[];queue.append(url)
        if source not in known[url]:known[url].append(source)
    def get(url):
        start=time.monotonic();row={'url':url}
        try:
            try:r=urlopen(Request(url,headers={'User-Agent':'BACwater authorized read-only audit/1.0'}),timeout=25)
            except HTTPError as e:r=e
            raw=r.read();body=raw.decode('utf-8','replace');row.update(status=r.status,final_url=r.url,headers=dict(r.headers),bytes=len(raw),elapsed_ms=round((time.monotonic()-start)*1000),body=body)
        except Exception as e:row['error']=str(e)
        return row
    def sitemap(url):
        row=get(url);endpoints.append(row)
        try:
            root=ET.fromstring(row.get('body',''))
            locs=[e.text for e in root.iter() if e.tag.endswith('}loc')]
            for loc in locs:
                if root.tag.endswith('sitemapindex'):sitemap(loc)
                else:add(loc,'sitemap')
        except Exception:pass
    sitemap(origin+'/sitemap.xml')
    for path in ['/','/sitemap','/search','/signin','/signup','/plans','/plans/labels','/plan','/plan/new','/recommendations']+extra:add(path,'source/history')
    while queue:
        batch=queue[:4];del queue[:4]
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            for row in pool.map(get,batch):
                url=row['url'];body=row.pop('body','');p=Page()
                if 'text/html' in row.get('headers',{}).get('Content-Type',''):p.feed(body)
                for a in p.links:add(a['href'],url)
                key=hashlib.sha256(url.encode()).hexdigest()[:16];(out/'html'/f'{key}.html').write_text(body)
                row.update(title=' '.join(p.title),description=p.meta.get('description'),robots=p.meta.get('robots'),canonical=p.canonical,h1=p.h1,headings=p.headings,main_text='\n'.join(p.text),links=p.links,ids=p.ids,images=p.images,schema=p.schema,sources=known[url],html=f'html/{key}.html')
                visited[url]=row
        (out/'crawl.json').write_text(json.dumps({'origin':origin,'captured_at':datetime.now(timezone.utc).isoformat(),'pages':list(visited.values()),'remaining':queue,'endpoints':endpoints},indent=2))
        print(f'Checked {len(visited)} URLs; {len(queue)} discovered URLs remain.',flush=True)
    for path in ['/robots.txt','/llms.txt','/version.json','/does-not-exist-audit','/peptides/does-not-exist-audit','/learn/does-not-exist-audit','/calculate/product/does-not-exist-audit']:
        endpoints.append(get(origin+path))
    report={'origin':origin,'captured_at':datetime.now(timezone.utc).isoformat(),'pages':list(visited.values()),'remaining':queue,'endpoints':endpoints}
    (out/'crawl.json').write_text(json.dumps(report,indent=2))
    print(json.dumps({'pages':len(visited),'errors':[{'url':r['url'],'status':r.get('status'),'error':r.get('error')} for r in visited.values() if r.get('status')!=200]},indent=2))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--origin',default='https://bacwater.ai');p.add_argument('--out',default='audit-evidence/http');p.add_argument('--extra',nargs='*',default=[]);a=p.parse_args();run(a.origin.rstrip('/'),a.out,a.extra)
