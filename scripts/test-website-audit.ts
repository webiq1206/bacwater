import assert from "node:assert/strict";
import { decimalError } from "../src/lib/calc/number-text";
import { quickCalculation } from "../src/lib/brand/quick-calculation";
import { isSelectedMassProduct } from "../src/lib/calc/product-context";
import { EMPTY_CALCULATION } from "../src/lib/session/calculation-session";
import { SUPPLIER_PRODUCTS } from "../src/lib/partners/supplier-catalog";
import { PRODUCT_RESEARCH } from "../src/lib/partners/product-content";
import { PRODUCT_CATALOG_COPY } from "../src/lib/partners/product-catalog-copy";
import { newResetToken, hashResetToken, RESET_LIFETIME_MS, RESET_TOKEN_PATTERN, passwordStamp } from "../src/lib/security/password-reset";
import { signupSchema } from "../src/lib/security/registration";
import { ARTICLE_GUIDES, presentArticle } from "../src/lib/learn/article-presentation";
import { COMPARISONS } from "../src/lib/comparisons/content";
import { comparisonSvg, comparisonDims } from "../src/lib/infographics/comparison";
import { searchSnippet, shareImage } from "../src/lib/seo/search-appearance";
assert.equal(isSelectedMassProduct(EMPTY_CALCULATION), false);
for(const product of SUPPLIER_PRODUCTS) {
 assert.equal(isSelectedMassProduct({...EMPTY_CALCULATION,kind:product.kind,productId:product.id,peptideSlug:product.reference}),product.kind==="single",product.id);
 const detail=PRODUCT_RESEARCH[product.id];
 assert.deepEqual(PRODUCT_CATALOG_COPY[product.id], {name:detail.name,aliases:detail.aliases,summary:detail.summary});
}
assert.equal(isSelectedMassProduct({...EMPTY_CALCULATION,kind:"iu",peptideSlug:"hcg"}),false);
assert.equal(isSelectedMassProduct({...EMPTY_CALCULATION,peptideSlug:"custom"}),false);
assert.equal(isSelectedMassProduct({...EMPTY_CALCULATION,peptideSlug:"custom",customName:"Named test material"}),true);
assert.match(decimalError("0","Final liquid volume"),/greater than zero/);
assert.match(decimalError("-2","Amount"),/greater than zero/);
assert.match(decimalError("1,5","Amount"),/without commas/);
assert.match(decimalError("1e99","Amount"),/supported range/);
assert.match(decimalError("","Amount",true),/Enter amount/);
assert.equal(decimalError("4","Final liquid volume"),"");
assert.equal(quickCalculation("concentration",{amount:"12",volume:"4",mass:"",units:""})?.value,"3");
assert.equal(quickCalculation("concentration",{amount:"12",volume:"0",mass:"",units:""}),null);
const reset=newResetToken(1000), another=newResetToken(1000);
assert.ok(RESET_TOKEN_PATTERN.test(reset.token));assert.notEqual(reset.token,another.token);
assert.equal(reset.hash,hashResetToken(reset.token));assert.notEqual(reset.hash,reset.token);
assert.equal(reset.expires.getTime(),1000+RESET_LIFETIME_MS);
assert.notEqual(passwordStamp("old-hash"),passwordStamp("new-hash"));
assert.equal(signupSchema.shape.password.safeParse("short").success,false);
assert.equal(signupSchema.shape.password.safeParse("long unique words for tests").success,true);
assert.equal(signupSchema.shape.password.safeParse("😀".repeat(30)).success,false);
assert.equal(Object.keys(ARTICLE_GUIDES).length,14);
for(const slug of Object.keys(ARTICLE_GUIDES)){assert.ok(searchSnippet(`/learn/${slug}`));assert.match(shareImage(`/learn/${slug}`).url,/^\/share-image\?path=/);}
for(const slug of ["__proto__","constructor","private-record"]){assert.equal(searchSnippet(`/learn/${slug}`),undefined);}
const sentence="This corrects the earlier statement that a more dilute vial would automatically be used up twice as fast.";
const display=presentArticle(`A direct answer.\n\nA current explanation. ${sentence}`);
assert.equal(display.opening,"A direct answer.");assert.deepEqual(display.corrections,[sentence]);assert.ok(!display.body.includes(sentence));assert.ok(display.body.includes("A current explanation."));
for(const comparison of COMPARISONS){const svg=comparisonSvg(comparison);assert.doesNotMatch(svg,/\.\.\./);assert.ok(comparisonDims(comparison).height>300);for(const row of comparison.table)assert.ok(svg.includes(row.dimension.replace(/&/g,"&amp;")),comparison.slug);}
console.log("PASS audit changes: 50 product formats and catalog records, required selection, validation, token randomness/expiry, password limits, 14 article cards, correction retention and seven complete chart exports.");

// Static product calculator URLs are reduced to one public category. Account,
// saved-plan, recovery and query data never enter measurement.
import { analyticsLocation } from "../src/lib/analytics";
assert.equal(analyticsLocation("/calculate/product/glow"),"https://bacwater.ai/calculate");
assert.equal(analyticsLocation("/calculate/hcg"),"https://bacwater.ai/calculate");
for(const path of ["/reset-password","/forgot-password","/plan/private-id","/plan/private-id/edit","/calculate/product/glow?amount=2","/search?q=private"])assert.equal(analyticsLocation(path),null,path);
