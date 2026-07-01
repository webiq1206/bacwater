import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 pt-20 sm:pt-28 pb-24 sm:pb-32">
      <div className="eyebrow text-center">Sign in</div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-medium tracking-tight text-center">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Sign in to access your saved plans and order history.
      </p>
      <Card className="mt-6">
        <CardContent className="p-8">
          <Suspense fallback={null}>
            <SignInForm />
          </Suspense>
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="text-brand font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
