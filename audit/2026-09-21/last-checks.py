from pathlib import Path
r=Path('.')
p=r/'src/components/plan/plan-form.tsx';s=p.read_text().replace('disabled={saving}', 'disabled={saving || !hasValidInputs || result.errors.length > 0}')
s=s.replace('    : "Saves your plan with a shareable link, downloadable PDF, and printable vial labels.";', '    : !hasValidInputs || result.errors.length > 0\n      ? "Enter the compound, vial amount, amount to measure and final liquid volume before saving."\n      : "Saves your calculation with a shareable link, downloadable PDF and printable labels.";')
p.write_text(s)
p=r/'scripts/audit-journeys.mjs';s=p.read_text()
if 'Deleted account session never reveals another account' not in s:
    marker="  await step('No browser runtime errors occurred during these journeys'"
    index=s.index(marker)
    s=s[:index]+'''  await step('Deleted account session never reveals another account or admin records', async()=>{
    const other = await prisma.user.create({data:{name:'Foreign fixture',email:`foreign-${email}`,role:'user'}});
    userIds.push(other.id);
    const original = await prisma.plan.findUniqueOrThrow({where:{publicId}});
    const { id, createdAt, updatedAt, ...copy } = original;
    const foreignId = `foreign${Date.now()}`;
    await prisma.plan.create({data:{...copy,publicId:foreignId,userId:other.id,name:'FOREIGN_PRIVATE_ACCOUNT_MARKER',notes:'FOREIGN_PRIVATE_NOTES',claimToken:null}});
    planIds.push(foreignId);
    await prisma.user.delete({where:{id:userIds[0]}});
    await page.goto(`${origin}/plans`);
    assert.equal((await page.content()).includes('FOREIGN_PRIVATE_ACCOUNT_MARKER'),false);
    assert.equal((await page.content()).includes('FOREIGN_PRIVATE_NOTES'),false);
    await page.goto(`${origin}/admin/users`);
    await expect(page).not.toHaveURL(/\\/admin/);
  });
''' + s[index:]
    s=s.replace('await prisma.user.deleteMany({where:{email}});','await prisma.user.deleteMany({where:{OR:[{email},{id:{in:userIds}}]}});')
p.write_text(s)
print('Save-state and deleted-session regressions applied.')
