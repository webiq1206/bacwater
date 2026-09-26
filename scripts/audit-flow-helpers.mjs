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
