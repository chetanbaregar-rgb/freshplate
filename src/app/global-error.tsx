"use client";

// Root-level error boundary. Per Next.js convention this replaces the entire
// root layout when a catastrophic error occurs above it, so it must render
// its own <html> and <body> tags and stay self-contained (no next/font, no
// importing the normal layout).
import "./globals.css";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(252,249,245)] px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">FP</span>
              </div>
              <span className="text-lg font-bold text-brand-700">FreshPlate</span>
            </div>

            <div className="bg-white border border-[rgb(235,227,215)] rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h1 className="text-base font-bold text-[rgb(28,22,16)]">Something went wrong</h1>
              <p className="text-sm text-muted-foreground mt-2">
                A critical error occurred and the app couldn&apos;t recover on its own. Please try again.
              </p>
              {error?.digest && (
                <p className="text-[10px] text-gray-300 mt-3 font-mono">Ref: {error.digest}</p>
              )}

              <button
                onClick={() => reset()}
                className="flex items-center justify-center gap-1.5 w-full bg-brand-500 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-brand-600 transition-colors mt-6"
              >
                <RotateCcw className="w-4 h-4" /> Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
