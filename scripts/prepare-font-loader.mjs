import fs from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const version=require('next/package.json').version;
// Reviewed against packages/font/src/google/loader.ts at the v16.3.6 tag.
// That release still assumes every upstream font URL ends with a file extension.
// Keep download/self-hosting unchanged; derive the extension from the font header.
// This narrow compatibility patch never touches next/og or security dependencies.
export function fontExtension(buffer){
 if(!Buffer.isBuffer(buffer)||buffer.length<4)throw new Error('Invalid font response: missing binary header.');
 const tag=buffer.subarray(0,4).toString('ascii');
 if(tag==='wOF2')return 'woff2';
 if(tag==='wOFF')return 'woff';
 if(tag==='OTTO')return 'otf';
 if(buffer.readUInt32BE(0)===0x00010000||tag==='true')return 'ttf';
 throw new Error('Unsupported font response. No font was emitted.');
}
for(const [tag,ext]of [['wOF2','woff2'],['wOFF','woff'],['OTTO','otf'],['true','ttf']])assert.equal(fontExtension(Buffer.from(tag)),ext);
assert.equal(fontExtension(Buffer.from([0,1,0,0])),'ttf');
assert.throws(()=>fontExtension(Buffer.from('<htm')));
assert.throws(()=>fontExtension(Buffer.alloc(0)));
assert.equal(version,'16.3.6','Next version changed. Review the pinned font compatibility patch and the security release before installing.');
const file=require.resolve('next/dist/compiled/@next/font/dist/google/loader.js');
const old='const ext = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1];';
const marker='// BAC-FONT-HEADER-COMPAT';
const text=fs.readFileSync(file,'utf8');
if(text.includes(marker)){console.log('Font response compatibility is already installed.');}
else{
 assert.equal(text.split(old).length,2,'Unexpected font loader source. Review the pinned compatibility patch before installing.');
 const replacement=`${marker}\n            const ext = (${fontExtension.toString()})(fontFileBuffer);`;
 fs.writeFileSync(file,text.replace(old,replacement));
 console.log('Installed tested font-header compatibility for Next 16.3.6. Font files, families and hosting are unchanged.');
}
