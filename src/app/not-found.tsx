import Link from "next/link";
import { ChefHat, Home, Search } from "lucide-react";

export default function NotFound() {
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
          <div className="w-14 h-14 mx-auto mb-4 bg-brand-50 rounded-2xl flex items-center justify-center">
            <Search className="w-7 h-7 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-[rgb(28,22,16)]">404</h1>
          <p className="text-sm font-medium text-gray-600 mt-1">Page not found</p>
          <p className="text-sm text-muted-foreground mt-2">
            We couldn&apos;t find what you&apos;re looking for. It may have been moved, or the link might be off.
          </p>

          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 w-full bg-brand-500 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-brand-600 transition-colors mt-6"
          >
            <Home className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
