"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-midnight px-6 text-center">
      <p className="eyebrow text-gold">A spell went awry</p>
      <h1 className="mt-4 font-cinzel text-3xl text-parchment">Something went wrong</h1>
      <p className="mt-4 max-w-md font-fell text-lg text-parchment/70 italic">Please try again — the magic usually returns on a second attempt.</p>
      <button type="button" onClick={reset} className="btn-spell mt-8">
        Try again
      </button>
    </main>
  );
}
