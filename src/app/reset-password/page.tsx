import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";
export const metadata = { title: "Choose a new passphrase", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default function Page() { return <div className="mx-auto max-w-md px-4 py-16"><h1 className="text-3xl font-serif">Choose a new passphrase</h1><p className="mt-3 leading-relaxed">Use the link from your reset email. Links can be used once and expire after 30 minutes.</p><div className="mt-6 rounded-xl border p-5"><PasswordRecoveryForm reset={true}/></div></div>; }
