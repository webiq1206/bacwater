import assert from "node:assert/strict";
import { convertMassText } from "../src/lib/calc/mass-text";
import { scaleConversion, switchMassDirection, switchScaleDirection } from "../src/lib/calc/conversion-direction";
import { editMassField, switchMassField, syncMassField } from "../src/lib/calc/mass-field";
import { productCalculation, emptyProductValues } from "../src/lib/partners/product-calculation";
import { SUPPLIER_PRODUCTS } from "../src/lib/partners/supplier-catalog";

for(const text of ["0","0.125","12","0.000000001","123456789.987654321","1e-80","1e80"]){
 const start={unit:"mg" as const,text},swapped=switchMassDirection(start,"mcg");
 assert.ok(swapped);
 assert.deepEqual(convertMassText(swapped.text,swapped.unit),convertMassText(text,"mg"));
 const restored=switchMassDirection(swapped,"mg");assert.ok(restored);
 assert.deepEqual(convertMassText(restored.text,"mg"),convertMassText(text,"mg"));
}
for(const text of ["0","25","0.1","200","123456789.987654321","1e-80","1e80"]){
 const start={direction:"units" as const,text},swapped=switchScaleDirection(start,"ml");assert.ok(swapped);
 assert.deepEqual(scaleConversion(swapped),scaleConversion(start));
 assert.deepEqual(scaleConversion(switchScaleDirection(swapped,"units")!),scaleConversion(start));
}
assert.deepEqual(scaleConversion({direction:"ml",text:"0.29"}),{kind:"value",units:"29",ml:"0.29"});
assert.deepEqual(switchMassDirection({unit:"mg",text:""},"mcg"),{unit:"mcg",text:""});
assert.deepEqual(switchScaleDirection({direction:"units",text:""},"ml"),{direction:"ml",text:""});
for(const text of ["-1","1,000","3mg","NaN","Infinity","1e101","0x10","1e","."]){
 assert.equal(switchMassDirection({unit:"mg",text},"mcg"),null);
 assert.equal(switchScaleDirection({direction:"units",text},"ml"),null);
}
let field={unit:"mg" as const,text:"0.5",canonical:"0.5"};
const switched=switchMassField(field,"mcg")!;
assert.equal(switched.text,"500");assert.equal(switched.canonical,"0.5");
const edited=editMassField(switched,"750","mg");assert.equal(edited.canonical,"0.75");
assert.equal(syncMassField(edited,"1.25","mg").text,"1250");
assert.equal(syncMassField(edited,"","mg").text,"");
const partial=editMassField(field,"1.","mg");assert.equal(syncMassField(partial,"1","mg").text,"1.");
assert.equal(editMassField(field,"invalid","mg").canonical,"invalid");
assert.equal(switchMassField(editMassField(field,"1e","mg"),"mcg"),null);
const glow=SUPPLIER_PRODUCTS.find(p=>p.id==="glow")!;
const canonical=editMassField({unit:"mcg",text:"",canonical:""},"5000","mg").canonical;
assert.deepEqual(productCalculation(glow,{...emptyProductValues(glow),total:canonical,volume:"2"}),productCalculation(glow,{...emptyProductValues(glow),total:"5",volume:"2"}));
assert.equal(editMassField({unit:"mg",text:"",canonical:""},"0.3","mcg").canonical,"300");
console.log("PASS bidirectional mass/U-100 conversion, exact round trips, invalid input, editable decimals, field continuity and blend equivalence.");
