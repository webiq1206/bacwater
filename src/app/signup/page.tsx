import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Create your account", robots: { index: false, follow: false } };

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 pt-20 sm:pt-28 pb-24 sm:pb-32">
      <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-center">Create your account</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Save your plans, get PDFs, and track your orders.
      </p>
      <Card className="mt-6">
        <CardContent className="p-8">
          <SignUpForm />
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="text-brand font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
