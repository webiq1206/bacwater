import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
const title = "Free Printable Peptide Vial Labels: Small Label PDFs";
const description = "Make small vial labels from a saved calculation. Choose label dimensions, record concentration and dates, then download a PDF or print at actual size.";
export const metadata = withSocialMetadata({ title, description, alternates: { canonical: "/tools/vial-labels" }, openGraph: { title, description, url: "/tools/vial-labels", type: "website" } });
const faqs = [
  { q: "What appears on the small vial label?", a: "The product name, concentration, mix date and use-by date. Missing dates are shown as not set. The full calculation and QR code stay on the separate plan PDF, where they have enough room to be readable." },
  { q: "Does the tool decide a peptide's shelf life?", a: "No. Enter the whole-day period from the exact product's instructions. The tool performs calendar arithmetic from your mix date and limits the result to an earlier original expiry when you provide one. It cannot establish stability or sterility. For deadlines shorter than a day, follow the exact product instructions." },
  { q: "What label sizes and paper formats are available?", a: "Presets are 25 × 13 mm, 30 × 15 mm and 40 × 20 mm. Custom dimensions are supported from 22 to 80 mm wide and 12 to 40 mm high. Choose Letter, A4 or individual label paper. Measure your actual label area and test on plain paper first." },
  { q: "Are the labels free, and is an account required?", a: "The label tool is free. Create and save a calculation to open its label sheet. A public calculation can be created without an account; an account lets you organize saved plans and print labels for several plans together." },
];
export default function VialLabelsPage() {
  return <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
    <WebPageJsonLd name={title} description={description} url="/tools/vial-labels" breadcrumb={[{ name: "Home", url: "/" }, { name: "Tools", url: "/tools" }, { name: "Vial labels", url: "/tools/vial-labels" }]}/>
    <FaqJsonLd items={faqs}/><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Vial labels", href: "/tools/vial-labels" }]}/>
    <p className="eyebrow">Free label tool</p><h1 className="mt-2 text-4xl sm:text-5xl font-serif tracking-tight">Printable peptide vial labels that fit.</h1>
    <p className="mt-5 text-lg leading-relaxed">Turn a saved calculation into small labels with the product name, concentration and dates. Choose dimensions for your vial, check the preview, then download a fixed-size PDF or print directly.</p>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">For organizing research materials. The label records your inputs; it does not verify contents or determine a suitable preparation, dose or storage period.</p>
    <Button asChild variant="brand" className="mt-6"><Link href="/plan">Build a calculation for your labels</Link></Button>
    <section className="mt-10 space-y-4"><h2 className="text-2xl font-serif">Choose what fits your vial</h2><p>Start with the default 30 × 15 mm label, about 1.18 × 0.59 inches. Smaller 25 × 13 mm and roomier 40 × 20 mm presets are available, along with custom dimensions. If the name or dates do not fit, printing is paused until you choose more space.</p><p>Small labels keep the essentials readable. Use the separate plan PDF for the full calculation and QR code. A shared plan link is readable by anyone who has it, so share it only with intended recipients.</p></section>
    <section className="mt-10 space-y-4"><h2 className="text-2xl font-serif">From calculation to printed label</h2><ol className="list-decimal space-y-3 pl-5"><li>Enter the stated amount and final liquid volume in the <Link className="underline" href="/plan">Plan Builder</Link>. Check the result before saving.</li><li>Open the saved plan's label tool. Choose the label dimensions, paper format and number of labels.</li><li>Add the mix date. If known, enter the whole-day period from the exact product's instructions and its original printed expiry. No shelf-life period is supplied by default.</li><li>Check every preview. Download the label PDF or choose Print labels. Use Actual size or 100%, turn off Fit to page, and measure a plain-paper test before using label stock.</li></ol></section>
    <section className="mt-10 space-y-4"><h2 className="text-2xl font-serif">Keep dates separate from calculation results</h2><p>A concentration does not establish a use-by date. An opened water container and a mixed product can have different instructions. Read the <Link className="underline" href="/learn/bac-water-shelf-life">storage and shelf-life guide</Link> before transferring any date to a label.</p><p>If you have no verified date or period, leave it unset. The printed label will say so instead of supplying a guess.</p></section>
    <section className="mt-10"><h2 className="text-2xl font-serif">Label questions</h2><dl className="mt-5 space-y-6">{faqs.map(item=><div key={item.q}><dt className="font-medium">{item.q}</dt><dd className="mt-2 leading-relaxed text-muted-foreground">{item.a}</dd></div>)}</dl></section>
    <div className="mt-10 flex flex-wrap gap-3"><Button asChild variant="brand"><Link href="/plan">Create your labels</Link></Button><Button asChild variant="outline"><Link href="/tools">Explore all tools</Link></Button></div>
  </article>;
}
