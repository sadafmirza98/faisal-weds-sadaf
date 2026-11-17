import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-midnight px-6 text-center">
      <p className="eyebrow text-gold">Mischief managed</p>
      <h1 className="mt-4 font-cinzel text-4xl text-parchment">This corridor doesn’t exist</h1>
      <p className="mt-4 max-w-md font-fell text-lg text-parchment/70 italic">The staircases must have moved. Let us guide you back to the Great Hall.</p>
      <Link href="/" className="btn-spell mt-8">
        Return to the invitation
      </Link>
    </main>
  );
}
