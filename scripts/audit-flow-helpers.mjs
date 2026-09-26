/** Existing CI journeys must choose a product through the visible interface. */
export async function chooseAuditMassProduct(page, scope = page) {
  await scope.getByRole('combobox', { name: 'Product', exact: true }).click();
  const picker = page.getByRole('dialog', { name: 'Choose your product', exact: true });
  await picker.getByRole('searchbox', { name: 'Search products', exact: true }).fill('BPC-157');
  await picker.getByRole('option', { name: 'BPC-157', exact: true }).click();
}
export async function openAuditOptional(page, label) {
  const summary = page.locator('summary').filter({ hasText: label }).first();
  const open = await summary.evaluate(node => node.parentElement.hasAttribute('open'));
  if (!open) await summary.click();
}
/** Walk the homepage's real product-first questions, without seeding storage. */
export async function completeAuditHero(page, scope, {vial='12', amount='0.3', volume='4', review=true} = {}) {
  await chooseAuditMassProduct(page, scope);
  await scope.getByRole('button', {name:'Continue',exact:true}).click();
  await scope.getByLabel('Amount in vial',{exact:true}).fill(vial);
  await scope.getByRole('button', {name:'Continue',exact:true}).click();
  await scope.getByLabel('Amount for one time',{exact:true}).fill(amount);
  await scope.getByRole('button', {name:'Continue',exact:true}).click();
  await scope.getByLabel('Final liquid volume',{exact:true}).fill(volume);
  if(review) {
    await scope.getByRole('button', {name:'Continue',exact:true}).click();
    await scope.getByRole('button', {name:'Review result',exact:true}).click();
  }
}
