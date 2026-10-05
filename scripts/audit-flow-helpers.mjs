/** Browser journeys use only the actual visible calculator controls. */
import { expect } from '@playwright/test';
export async function chooseAuditMassProduct(page, scope = page) {
  await scope.getByRole('combobox', { name: 'Product', exact: true }).click();
  const picker = page.getByRole('dialog', { name: 'Choose your product', exact: true });
  await picker.getByRole('searchbox', { name: 'Search products', exact: true }).fill('BPC-157');
  await picker.getByRole('option', { name: 'BPC-157', exact: true }).click();
}
export async function openAuditOptional(page, label) {
  const summary = page.locator('summary').filter({ hasText: label }).first();
  if (!await summary.evaluate(node => node.parentElement.hasAttribute('open'))) await summary.click();
}
export async function selectAuditOption(page, scope, label, option) {
  const trigger=scope.getByRole('combobox', {name:label,exact:true});
  await trigger.click();
  await page.getByRole('option', {name:option,exact:true}).click();
  await page.getByRole('listbox').waitFor({state:'hidden'});
  await expect(trigger).toBeFocused();
}
export async function nextQuestion(scope) { await scope.getByRole('button',{name:'Next',exact:true}).click(); }
export async function goQuestion(scope, target) {
  for (let i=0;i<24;i++) {
    const root=scope.locator('[data-guided-step]'), current=await root.getAttribute('data-guided-step');
    if(current===target)return;
    const order=['product','name','vial-unit','vial','second-product','second-name','second-unit','second-amount','basis','amount-unit','amount','schedule','custom-schedule','volume','device','review'];
    if(order.indexOf(current)>order.indexOf(target))await scope.getByRole('button',{name:'Back',exact:true}).click();
    else await nextQuestion(scope);
  }
  throw new Error(`Could not reach question ${target}`);
}
export async function completeAuditHero(page, scope, {vial='12', amount='0.3', volume='4', review=true} = {}) {
  await chooseAuditMassProduct(page,scope);
  await nextQuestion(scope);await nextQuestion(scope);
  await scope.getByLabel('Amount in vial',{exact:true}).fill(vial);await nextQuestion(scope);
  await nextQuestion(scope);await nextQuestion(scope);
  await scope.getByLabel(/^Amount for one time/).fill(amount);await nextQuestion(scope);await nextQuestion(scope);
  await scope.getByLabel('Final liquid volume',{exact:true}).fill(volume);
  if(review){await nextQuestion(scope);await nextQuestion(scope);}
}
/** Walk each product format, including every named blend component, through real UI. */
export async function completeAuditProduct(page, values = {}) {
  for(let turn=0;turn<32;turn++) {
    const step=await page.locator('[data-guided-step]').getAttribute('data-guided-step');
    if(step==='review')return;
    const area=page.locator('[data-step-scroll]'),combo=area.getByRole('combobox'),input=area.getByRole('textbox');
    let option;
    if(step==='mode')option=values.blendMode==='ingredients'?'Each ingredient':values.blendMode==='one'?'One named ingredient':values.blendMode==='total'?'The whole premixed blend':undefined;
    if(step==='sample-choice'&&values.amount!==undefined)option=values.concentrationOnly?'Concentration only':values.single?'Liquid volume for an amount':'Amount in a liquid sample';
    if(step.endsWith('-unit')&&step!=='amount-unit'&&values.unit)option=values.unit;
    if(step==='amount-unit'&&values.amountUnit)option=values.amountUnit;
    if(step==='schedule')option=values.schedule||'One calculation. No schedule.';
    if(option) { await combo.click();await page.getByRole('option',{name:option,exact:true}).click(); }
    let value=values[step];
    const ingredient=step.match(/^ingredient-(\d+)$/);
    if(ingredient)value=values.ingredients?.[Number(ingredient[1])];
    if(await input.count()===1&&value!==undefined)await input.fill(String(value));
    await nextQuestion(page);
  }
  throw new Error('Product questions did not reach result');
}

export async function editProductQuestion(page, target) {
  await openAuditOptional(page,'Review or change answers');
  await page.locator(`[data-edit-question="${target}"]`).click();
}
