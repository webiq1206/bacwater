import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About BACwater.ai",
  description:
    "BACwater.ai is the most beginner-friendly utility for peptide reconstitution. Exact math, plain-English explanations, and premium supplies in one place.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="eyebrow">About</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        A calmer way to reconstitute
      </h1>
      <div className="mt-6 space-y-5 text-lg text-foreground/90 leading-relaxed">
        <p>
          We built BACwater.ai because every other reconstitution calculator felt
          like homework: cluttered with ads, filled with jargon, or locked
          behind signup walls.
        </p>
        <p>
          Our approach is different. Every calculation shows exactly how the
          answer was reached, in plain English. Every result can be saved,
          printed, or shared with a single link. And every tool is designed for
          people who are doing this for the very first time.
        </p>
        <p>
          We also sell the supplies you need: BAC water, syringes, and alcohol prep
          pads. When your plan says you need three of something, we&apos;d
          rather help you get them in one click than send you somewhere else.
        </p>
        <p>
          We do <b>not</b> provide medical advice. We do not diagnose, prescribe,
          or recommend treatment. Our products are sold for research and
          educational purposes only. Always consult a qualified professional for
          medical guidance.
        </p>
      </div>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="brand"><Link href="/plan">Build a plan</Link></Button>
        <Button asChild variant="outline"><Link href="/shop">Shop supplies</Link></Button>
      </div>
    </div>
  );
}
