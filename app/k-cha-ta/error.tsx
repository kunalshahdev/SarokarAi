"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-kct-background px-6 text-center">
      <p className="text-5xl mb-4">😵</p>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        K cha bhane...
      </h2>
      <p className="text-sm text-kct-muted mb-6 max-w-md">
        Something broke. Not your fault though.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-kct-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-kct-accent-hover"
        >
          Try again
        </button>
        <Link
          href="/k-cha-ta"
          className="rounded-lg border-2 border-kct-border px-5 py-2.5 text-sm font-semibold text-kct-muted transition-colors hover:text-foreground"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
