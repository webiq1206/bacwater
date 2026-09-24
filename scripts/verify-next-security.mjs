import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';

// GHSA-vcvr-r3jv-pc5j (CVE-2026-94545), patched September 22, 2026.
// A clean npm audit alone is not a substitute for checking the patched version.
// Re-review this exact pin and the font compatibility patch for future updates.
const PATCHED_VERSION='16.3.6';
const require=createRequire(import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
const lock=JSON.parse(fs.readFileSync(new URL('../package-lock.json',import.meta.url),'utf8'));
const installed=require('next/package.json');
const message='Install the reviewed Next.js security patch. Package manifest, lockfile and installed package must agree.';
assert.equal(manifest.dependencies.next,PATCHED_VERSION,message);
assert.equal(lock.packages?.['']?.dependencies?.next,PATCHED_VERSION,message);
assert.equal(lock.packages?.['node_modules/next']?.version,PATCHED_VERSION,message);
assert.equal(installed.version,PATCHED_VERSION,message);

for(const [name,version]of Object.entries({...installed.dependencies,...installed.optionalDependencies})){
 if(!name.startsWith('@next/'))continue;
 const entry=lock.packages[`node_modules/${name}`];
 assert.ok(entry,`Missing locked framework companion: ${name}`);
 assert.equal(entry.version,version,`Framework companion differs from Next's declared version: ${name}`);
 assert.ok(entry.integrity,`Missing package integrity: ${name}`);
}
for(const [path,entry]of Object.entries(lock.packages)){
 if(/(?:^|\/)node_modules\/next$/.test(path))assert.equal(entry.version,PATCHED_VERSION,`Unexpected nested Next.js version: ${path}`);
}
assert.ok(lock.packages['node_modules/next'].integrity,'Missing Next.js package integrity.');
assert.ok(!JSON.stringify(lock).includes('next-16.3.5.tgz'),'The blocked Next.js tarball remains in the lockfile.');
console.log(`PASS Next.js security release: ${PATCHED_VERSION}; manifest, lockfile, installed package and framework companions agree.`);
