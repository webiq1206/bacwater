/** Original mathematical reference cards. No stock imagery or generated arithmetic. */
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const slidesOut = process.env.GROWTH_SLIDES_DIR || join(tmpdir(), 'bacwater-growth-video-slides');
const out = 'public/growth';
await fs.mkdir(out, {recursive:true});
const logo = (await fs.readFile('public/brand/bacwater-wordmark.svg','utf8')).replace(/<svg[^>]*>/,'').replace('</svg>','');
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text = (s,x,y,size=34,extra='') => `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(s)}</text>`;
const cards = [
  {id:'mg-to-mcg', title:['mg and mcg.','Same mass.'], equation:['1 mg','1,000 mcg'], formula:'mg × 1,000 = mcg', example:['Example: 0.125 mg = 125 mcg','To go back, divide mcg by 1,000.'], note:['Mass alone cannot tell you mL.','For that, you also need concentration.'], url:'bacwater.ai/tools/mg-to-mcg'},
  {id:'u100-to-ml', title:['U-100 units','and mL.'], equation:['100 units','1 mL'], formula:'U-100 units ÷ 100 = mL', example:['Example: 25 units = 0.25 mL','This relationship is for a U-100 scale.'], note:['Syringe markings are not mg or product IU.','Check the actual device scale and capacity.'], url:'bacwater.ai/tools/syringe-units'},
  {id:'concentration', title:['Mass ÷ volume.','Concentration.'], equation:['12 mg ÷ 4 mL','3 mg/mL'], formula:'mass in mg ÷ final volume in mL', example:['12 mg in a final volume of 4 mL','contains 3 mg in each mL.'], note:['Use the final solution volume.','This is not a preparation instruction.'], url:'bacwater.ai/tools/bac-water'},
];
for (const c of cards) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500" role="img" aria-labelledby="card-title card-desc"><title id="card-title">${esc(c.title.join(' '))}</title><desc id="card-desc">${esc(c.example.join(' '))} Arithmetic illustration only.</desc><rect width="1000" height="1500" fill="#f7f8f2"/><g transform="translate(64 58) scale(1.55)">${logo}</g><g fill="#18382d" font-family="DejaVu Sans,Arial,sans-serif">${text('A SMALL GUIDE TO CLEARER MATH',64,215,22,'letter-spacing="3"')}${c.title.map((s,i)=>text(s,64,325+i*88,70,'font-family="DejaVu Serif,Georgia,serif"')).join('')}<rect x="64" y="490" width="872" height="360" rx="28" fill="#eaf0dd"/>${text(c.equation[0],100,595,c.id==='concentration'?62:78)}${text('=',100,678,52)}${text(c.equation[1],100,786,78)}${text(c.formula,64,928,34,'font-weight="600"')}${c.example.map((s,i)=>text(s,64,1010+i*48,33)).join('')}<line x1="64" y1="1115" x2="936" y2="1115" stroke="#bdcbb3"/>${c.note.map((s,i)=>text(s,64,1180+i*44,29)).join('')}${text('Arithmetic examples, not dosing advice.',64,1310,26)}${text(c.url,64,1410,30,'font-weight="600"')}</g></svg>`;
  await fs.writeFile(`${out}/${c.id}.svg`,svg);
  await sharp(Buffer.from(svg)).png().toFile(`${out}/${c.id}.png`);
}
// Landscape slides for a captioned educational video, not a simulated UI recording.
const slides = [
  ['mg to mcg','Two units for the same mass.','A free calculation guide from BACwater.ai'],
  ['1 mg = 1,000 mcg','Multiply milligrams by 1,000.','The unit changes. The mass stays the same.'],
  ['0.125 mg = 125 mcg','0.125 × 1,000 = 125','To reverse it: 125 ÷ 1,000 = 0.125 mg'],
  ['Try your own numbers.','bacwater.ai/tools/mg-to-mcg','Mass conversion only. No dose is selected.'],
];
await fs.mkdir(slidesOut,{recursive:true});
for (let i=0;i<slides.length;i++) {
  const s=slides[i];
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="#f7f8f2"/><g transform="translate(70 45) scale(1.3)">${logo}</g><g fill="#18382d" font-family="DejaVu Sans,Arial,sans-serif">${text('CALCULATOR NOTES / MASS',70,188,22)}<rect x="50" y="235" width="1180" height="300" rx="28" fill="#eaf0dd"/>${text(s[0],85,350,s[0].length>20?64:76,'font-weight="600"')}${text(s[1],85,453,36)}${text(s[2],70,618,30)}${text(`${i+1} / 4`,1150,670,20)}</g></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`${slidesOut}/${i+1}.png`);
}
console.log('Created three original reference cards and four video slides.');
