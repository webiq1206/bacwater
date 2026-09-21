export function ShelfLifeTimeline({ dateMixed }: { peptideName: string | null; shelfDays: number | null; dateMixed: string | null }) {
  return <div className="space-y-3 text-sm leading-relaxed">
    <p className="font-medium">A calculation cannot establish shelf life.</p>
    {dateMixed && <p>Recorded mixing date: {new Date(dateMixed).toLocaleDateString("en-US")}</p>}
    <p>Follow the specific product label and instructions from the responsible pharmacist or manufacturer. The discard guidance for an opened diluent vial is not proof of a mixed compound&apos;s stability.</p>
    <a className="underline underline-offset-4" href="/learn/bac-water-shelf-life">Read the distinction between diluent and mixed-product storage</a>
  </div>;
}
