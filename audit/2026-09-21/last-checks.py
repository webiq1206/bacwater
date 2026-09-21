from pathlib import Path
r=Path('.')
p=r/'src/components/plan/plan-form.tsx';s=p.read_text().replace('disabled={saving}', 'disabled={saving || !hasValidInputs || result.errors.length > 0}')
s=s.replace('    : "Saves your plan with a shareable link, downloadable PDF, and printable vial labels.";', '    : !hasValidInputs || result.errors.length > 0\n      ? "Enter the compound, vial amount, amount to measure and final liquid volume before saving."\n      : "Saves your calculation with a shareable link, downloadable PDF and printable labels.";')
p.write_text(s)
p=r/'src/app/page.tsx';p.write_text(p.read_text().replace('className="mt-8 flex gap-3"','className="mt-8 flex flex-wrap gap-3"'))
p=r/'src/components/plan/plan-pdf.tsx';s=p.read_text()
s=s.replace('Keep it cold. Refrigerate as soon as it is mixed.', 'Follow the storage temperature stated for the exact formulation.')
s=s.replace('Keep it dark. Store in the box or wrap the vial in foil.', 'Use the product-specific light protection and packaging instructions.')
s=s.replace('Freezing can damage many peptides. Check your product&apos;s instructions.', 'Do not infer freeze tolerance or a safe discard date from this calculation.')
s=s.replace('and the shelf life comes from research. This plan does not decide how much to use,', 'but cannot establish shelf life. This plan does not decide how much to use,')
p.write_text(s)
p=r/'scripts/audit-journeys.mjs';s=p.read_text()
if 'Deleted account session never reveals another account' not in s:
    index=s.index("  await step('No browser runtime errors occurred during these journeys'")
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
old='''      const response=await c.request.get(`${origin}/plan/${publicId}/pdf`);assert.equal(response.status(),200);
      const bytes=await response.body();assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
      assert.ok(response.headers()['cache-control']?.includes('no-store'));assert.ok(response.headers()['x-robots-tag']?.includes('noindex'));
      await fs.writeFile(`${out}/${name}.pdf`,bytes);'''
new='''      // Use an actual browser request. APIRequestContext applies different Secure-cookie
      // handling to loopback HTTP than Chromium's trustworthy loopback context.
      const viewer=await c.newPage();await viewer.goto(`${origin}/plan/${publicId}`);
      const response=await viewer.evaluate(async(url)=>{
        const r=await fetch(url,{credentials:'include'});
        return {status:r.status,headers:Object.fromEntries(r.headers),bytes:Array.from(new Uint8Array(await r.arrayBuffer()))};
      },`${origin}/plan/${publicId}/pdf`);
      assert.equal(response.status,200);
      const bytes=Buffer.from(response.bytes);assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
      assert.ok(response.headers['cache-control']?.includes('no-store'));assert.ok(response.headers['x-robots-tag']?.includes('noindex'));
      await fs.writeFile(`${out}/${name}.pdf`,bytes);await viewer.close();'''
if old in s:s=s.replace(old,new)
elif 'actual browser request' not in s:raise RuntimeError('PDF test baseline not found')
p.write_text(s)
p=r/'.replit';p.write_text(p.read_text().replace('npm install --include=dev && npx prisma generate', 'npm ci --include=dev && npx prisma generate'))
print('Save state, small-screen actions, PDF copy and browser PDF verification updated.')
