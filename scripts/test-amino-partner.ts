import "./test-product-presentation";
import "./test-affiliate-directory";
import assert from "node:assert/strict";
import { SUPPLIER_PRODUCTS, getSupplierPartner, validateSupplierLink } from "../src/lib/partners/supplier-catalog";
const product = SUPPLIER_PRODUCTS[0];
// These values exist only in local tests. They are never real referral codes.
const valid = product.sourceUrl + "?ref=LOCAL_FIXTURE_NOT_A_REAL_CODE";
const settings = { AMINO_CLUB_ENABLED: "true", AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED: "true", AMINO_CLUB_PRODUCT_LINKS_JSON: JSON.stringify({ [product.id]: valid }) };
let count = 0;
function check(name: string, fn: () => void) { fn(); console.log("PASS " + name); count++; }
check("explicit empty settings fail closed", () => assert.equal(getSupplierPartner({}).active, false));
check("explicit approval required for custom settings", () => assert.equal(getSupplierPartner({ ...settings, AMINO_CLUB_APPROVAL_AND_LINKS_VERIFIED: "false" }).active, false));
check("exact validated URL retained unchanged", () => assert.equal(validateSupplierLink(valid, product), valid));
check("correct product mapping retained", () => { const p=getSupplierPartner(settings); assert.ok(p.active); assert.equal(p.products[0].id, product.id); assert.equal(p.products[0].affiliateUrl, valid); });
check("no links means no paid referral links", () => assert.equal(getSupplierPartner({ ...settings, AMINO_CLUB_PRODUCT_LINKS_JSON: "{}" }).active, false));
check("unrecognized product rejected", () => assert.equal(getSupplierPartner({ ...settings, AMINO_CLUB_PRODUCT_LINKS_JSON: '{"unknown":"https://www.aminoclub.com/"}' }).active, false));
for (const [name,value] of Object.entries({
  "plain non-referral URL": product.sourceUrl,
  "wrong compound": SUPPLIER_PRODUCTS[1].sourceUrl + "?ref=fixture",
  "hostname suffix trick": "https://www.aminoclub.com.attacker.invalid/us/products/amino-h2o?ref=fixture",
  "credentials": "https://login:password@www.aminoclub.com/us/products/amino-h2o?ref=fixture",
  "wrong scheme": valid.replace("https:", "http:"),
  "non-web scheme": "javascript:alert(1)",
  "redirect param": valid + "&redirect=https://example.invalid",
  "email param": valid + "&email=hello%40example.test",
  "tracking token": valid + "&session=fixture",
  "duplicate keys": valid + "&ref=other",
  "fragment": valid + "#auth",
  "port": valid.replace(".com/", ".com:444/"),
  "backslash": valid.replace(".com/", ".com\\"),
  "whitespace": valid + " ",
  "encoded slash": valid.replace("amino-h2o", "amino-h2o%2f"),
  "search click identifier": valid + "&srsltid=fixture",
  "newlines": valid + "\n",
  "encoded email in value": valid + "&tag=hello%40example.test",
})) check(name, () => assert.equal(validateSupplierLink(value, product), null));
for (const value of ["null", "[]", "42", '"text"', "{", "x".repeat(13000)]) check("malformed config " + value.slice(0,12), () => assert.equal(getSupplierPartner({ ...settings, AMINO_CLUB_PRODUCT_LINKS_JSON:value }).active, false));
check("one invalid configured link disables all paid links", () => assert.equal(getSupplierPartner({ ...settings, AMINO_CLUB_PRODUCT_LINKS_JSON: JSON.stringify({ [product.id]: valid, "bpc-157":"https://example.invalid" }) }).active, false));
check("all curated products accepted with exact fixtures", () => { const state=getSupplierPartner({ ...settings, AMINO_CLUB_PRODUCT_LINKS_JSON:JSON.stringify(Object.fromEntries(SUPPLIER_PRODUCTS.map(p=>[p.id,p.sourceUrl+"?ref=LOCAL_FIXTURE_NOT_A_REAL_CODE"]))) }); assert.ok(state.active); assert.equal(state.products.length, SUPPLIER_PRODUCTS.length); });
console.log(`${count} partner configuration checks passed. These checks do not verify actual vendor attribution.`);
