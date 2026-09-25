import { withSocialMetadata } from "@/lib/seo/social-metadata";
// Preserve old links and entered-plan flow while consolidating the identical builder.
export { default } from "../page";
export const metadata = withSocialMetadata({
  title: "Peptide Reconstitution Plan Builder",
  description: "Enter the stated amount, final liquid volume and measurement from your instructions. Check the arithmetic and save your calculation.",
  alternates: { canonical: "/plan" },
  openGraph: { title: "Peptide Reconstitution Plan Builder", description: "Check the arithmetic from your own product instructions.", url: "/plan", type: "website" },
});
