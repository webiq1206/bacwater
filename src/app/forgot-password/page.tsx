import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";
export const metadata = { title: "Reset your password", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default function Page() { return <div className="mx-auto max-w-md px-4 py-16"><h1 className="text-3xl font-serif">Reset your password</h1><p className="mt-3 leading-relaxed">Enter your account email to request a password reset link.</p><div className="mt-6 rounded-xl border p-5"><PasswordRecoveryForm reset={false}/></div></div>; }
