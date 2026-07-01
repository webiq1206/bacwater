import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 pt-16 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight text-center">Welcome back</h1>
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
