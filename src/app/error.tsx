"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home, ChefHat } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging / monitoring.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(252,249,245)] px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-brand-700">FreshPlate</span>
        </div>

        <div className="bg-white border border-[rgb(235,227,215)] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-base font-bold text-[rgb(28,22,16)]">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mt-2">
            We hit a snag loading this page. Give it another try — your plan and pantry data are safe.
          </p>
          {error?.digest && (
            <p className="text-[10px] text-gray-300 mt-3 font-mono">Ref: {error.digest}</p>
          )}

          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-1.5 w-full bg-brand-500 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-brand-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Try again
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 w-full text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors"
            >
              <Home className="w-4 h-4" /> Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
