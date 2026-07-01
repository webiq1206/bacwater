import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About BACWater.ai",
  description:
    "BACWater.ai builds the most accurate, calmest utility for peptide reconstitution — plus the supplies you need to do it right.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight">About BACWater.ai</h1>
      <div className="mt-6 space-y-5 text-lg text-foreground/90 leading-relaxed">
        <p>
          BACWater.ai is a small, focused utility platform. We built it because
          the existing reconstitution calculators feel like homework — busy, ad-cluttered,
          full of jargon, or hidden behind email signup walls.
        </p>
        <p>
          Our approach is different. Every calculation runs through a deterministic
          math library. Every result is explained in plain English. Every
          plan can be saved, printed, and shared with a single link.
        </p>
        <p>
          We also sell the supplies you need — BAC water, syringes, alcohol
          prep pads — because when the plan says you need three of something,
          we&apos;d rather help you get them in one click than send you to a
          different site.
        </p>
        <p>
          We do <b>not</b> provide medical advice. We do not diagnose,
          prescribe, or recommend specific medical treatment. If your
          reconstitution is for anything other than research or education,
          please consult a qualified professional.
        </p>
      </div>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="brand"><Link href="/plan">Build a plan</Link></Button>
        <Button asChild variant="outline"><Link href="/shop">Shop supplies</Link></Button>
      </div>
    </div>
  );
}
