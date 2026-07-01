import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  title: "Supply Calculator - What You Need for a Cycle",
  description:
    "Enter your peptide, dose, and cycle length to get a complete shopping list with exact quantities of BAC water, syringes, and alcohol prep pads.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="Supply Calculator"
        description="Enter your peptide, dose, and cycle length to get a complete shopping list with exact quantities of BAC water, syringes, and alcohol prep pads."
        url="/tools/supplies"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Supply Calculator", url: "/tools/supplies" },
        ]}
      />
      {children}
    </>
  );
}
