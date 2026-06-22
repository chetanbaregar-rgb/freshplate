"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ShoppingCart, Package, User, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/calendar", label: "Plan", icon: CalendarDays },
  { href: "/shopping", label: "Shop", icon: ShoppingCart },
  { href: "/pantry", label: "Pantry", icon: Package },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="flex min-h-screen bg-[rgb(252,249,245)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[rgb(235,227,215)] sticky top-0 h-screen">
        <div className="p-6 border-b border-[rgb(235,227,215)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-700">FreshPlate</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Weekly Meal Planner</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-5 h-5", active ? "text-brand-600" : "text-gray-400")} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[rgb(235,227,215)]">
          <div className="text-xs text-muted-foreground text-center">
            Powered by Zepto & Swiggy MCPs
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[rgb(235,227,215)] safe-bottom z-50">
        <div className="flex items-center justify-around h-16">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors",
                  active ? "text-brand-600" : "text-gray-400"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
