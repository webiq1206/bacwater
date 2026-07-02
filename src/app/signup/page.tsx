import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = { title: "Create your account", robots: { index: false, follow: false } };

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 pt-20 sm:pt-28 pb-24 sm:pb-32">
      <div className="eyebrow text-center">Sign up</div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-medium tracking-tight text-center">Create your free account</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Save your plans, download PDFs, print vial labels, and track your orders.
      </p>
      <div className="mt-6 border border-border p-8">
        <SignUpForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="text-foreground font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
