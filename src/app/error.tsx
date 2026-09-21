"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="mx-auto max-w-xl px-5 py-16" role="alert"><h1 className="text-2xl font-semibold">This page could not load.</h1><p className="mt-3">Your saved plans have not been deleted. Retry the page or return to the calculators.</p><div className="mt-6 flex flex-wrap gap-4"><button type="button" onClick={reset} className="min-h-11 rounded-lg border px-5">Try again</button><a href="/tools" className="inline-flex min-h-11 items-center underline">Open calculators</a></div></section>;
}
