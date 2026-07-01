import { ContactForm } from "@/components/common/contact-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Contact BACWater.ai",
  description: "Reach the BACWater.ai team about orders, calculations, or partnerships.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight">Contact us</h1>
      <p className="mt-3 text-muted-foreground">
        Questions about an order, a plan, or wholesale? Send us a note.
      </p>
      <Card className="mt-8">
        <CardContent className="p-8">
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}
