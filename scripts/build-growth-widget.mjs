import { build } from 'esbuild';
await build({entryPoints:['src/lib/growth/widget-entry.ts'],bundle:true,format:'iife',platform:'browser',target:'es2020',minify:true,outfile:'public/embed/mass-converter.js'});
console.log('Built the standalone converter from shared calculation source.');
