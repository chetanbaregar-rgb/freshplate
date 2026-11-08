"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import AppShell from "@/components/layout/AppShell";
import { ShoppingCart, Package, Check, Zap, RefreshCw, ChevronDown, ChevronUp, AlertTriangle, ChefHat } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useCommerceStatus } from "@/lib/mcp/useCommerceStatus";
import type { ShoppingItem } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  vegetable: "🥦 Vegetables",
  fruit: "🍋 Fruits",
  dairy: "🥛 Dairy",
  grain: "🌾 Grains & Staples",
  protein: "🥚 Protein",
  spice: "🌶️ Spices & Herbs",
  oil: "🫙 Oils & Ghee",
  other: "📦 Other",
};

export default function ShoppingPage() {
  const router = useRouter();
  const { household, shoppingList, buildShoppingList, toggleShoppingItem, refreshAvailability, placeOrder, weeklyPlan } =
    useAppStore();
  const [platform, setPlatform] = useState<"zepto" | "instamart">("instamart");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { status } = useCommerceStatus();

  const isLive = status[platform].connected;
  const addressId = status[platform].addressId;
  const addressLabel = status[platform].addressLabel;

  useEffect(() => {
    if (shoppingList.length === 0 && weeklyPlan) {
      buildShoppingList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyPlan?.id]);

  useEffect(() => {
    if (weeklyPlan) refreshAvailability(platform);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, weeklyPlan?.id]);

  const grouped = shoppingList.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const unchecked = shoppingList.filter((i) => !i.checked);
  const totalEstimate = unchecked.reduce((s, i) => s + (i.price ?? 50) * i.qtyToBuy, 0);
  const checkedCount = shoppingList.filter((i) => i.checked).length;

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) { next.delete(cat); } else { next.add(cat); }
      return next;
    });
  };

  const platformName = platform === "instamart" ? "Swiggy Instamart" : "Zepto";

  const handleOrderClick = () => {
    if (isLive) {
      if (!addressId) {
        toast.error(`Pick a delivery address for ${platformName} in Profile first.`);
        return;
      }
      setShowConfirm(true);
    } else {
      void confirmOrder();
    }
  };

  const confirmOrder = async () => {
    setShowConfirm(false);
    setOrdering(true);
    try {
      // Demo latency now lives in one place — MockCommerceAdapter.checkout()
      // (see placeOrder in store.ts) — instead of being simulated here too.
      await placeOrder(platform, addressId ?? undefined);
      setOrdered(true);
      toast.success(
        isLive ? `Real order placed on ${platformName}!` : `Demo order placed on ${platformName}! Delivery in ~25 min.`
      );
    } catch (err) {
      toast.error((err as Error).message || "Order failed — please try again.");
    } finally {
      setOrdering(false);
    }
  };

  // Deep-linking here without completing onboarding leaves household null
  // (or incomplete) — bounce to onboarding instead of showing an indefinite loader.
  useEffect(() => {
    if (!household?.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [household, router]);

  if (!household?.onboardingComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(252,249,245)] gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <span className="absolute inset-0 rounded-2xl border-4 border-brand-100 border-t-brand-500 animate-spin" />
          <ChefHat className="w-5 h-5 text-brand-500" />
        </div>
        <p className="text-xs font-medium text-muted-foreground animate-pulse">Redirecting…</p>
      </div>
    );
  }

  if (!weeklyPlan) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-center p-8">
          <ShoppingCart className="w-12 h-12 text-gray-300" />
          <p className="text-muted-foreground">Generate a weekly plan first from the Calendar tab.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-white border-b border-[rgb(235,227,215)] px-4 pt-4 pb-3 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold">Shopping List</h1>
            <p className="text-xs text-muted-foreground">
              {shoppingList.length} items · {checkedCount} already have
            </p>
          </div>
          <button
            onClick={() => {
              buildShoppingList();
              refreshAvailability(platform);
              setOrdered(false);
              toast.success("List refreshed!");
            }}
            className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-500 hover:text-brand-600"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Platform picker */}
        <div className="flex gap-2">
          {(["instamart", "zepto"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                platform === p
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              )}
            >
              {p === "instamart" ? (
                <><Package className="w-3.5 h-3.5" /> Instamart</>
              ) : (
                <><Zap className="w-3.5 h-3.5" /> Zepto</>
              )}
            </button>
          ))}
        </div>
        <p className="text-[11px] mt-1.5">
          {isLive ? (
            <span className="text-green-700 font-medium">● Live pricing{addressLabel ? ` · ${addressLabel}` : ""}</span>
          ) : (
            <span className="text-gray-400">● Demo pricing — connect {platformName} in Profile for live data</span>
          )}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4 lg:px-8 space-y-3 pb-32">
        {Object.entries(grouped).map(([cat, items]) => {
          const collapsed = collapsedCategories.has(cat);
          const allChecked = items.every((i) => i.checked);
          return (
            <div key={cat} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3",
                  allChecked ? "opacity-60" : ""
                )}
              >
                <span className="text-sm font-semibold">{CATEGORY_LABELS[cat] ?? cat}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{items.length} items</span>
                  {collapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {!collapsed && (
                <div className="border-t border-gray-50">
                  {items.map((item, idx) => (
                    <div
                      key={item.ingredientId}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3",
                        idx < items.length - 1 && "border-b border-gray-50",
                        item.checked && "opacity-50"
                      )}
                    >
                      <button
                        onClick={() => toggleShoppingItem(item.ingredientId)}
                        aria-label={item.checked ? `Mark ${item.name} as not bought` : `Mark ${item.name} as bought`}
                        className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                          item.checked
                            ? "bg-brand-500 border-brand-500"
                            : "border-gray-300 hover:border-brand-400"
                        )}
                      >
                        {item.checked && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium", item.checked && "line-through")}>{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Need {Math.ceil(item.qtyToBuy)} {item.unit}
                          {item.qtyInStock > 0 && ` · ${item.qtyInStock} in stock`}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {item.price ? (
                          <p className="text-sm font-semibold text-brand-600 flex items-center justify-end gap-1.5">
                            {formatCurrency(item.price)}
                            {!isLive && (
                              <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full" title="Sample price — connect a platform in Profile for a real quote">
                                demo
                              </span>
                            )}
                          </p>
                        ) : (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">checking…</span>
                        )}
                        {item.packSize && <p className="text-[10px] text-muted-foreground">{item.packSize}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {shoppingList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-200" />
            <p className="text-sm text-muted-foreground">No items to buy — either your pantry covers everything or no plan is set.</p>
          </div>
        )}
      </div>

      {/* Sticky order footer */}
      {unchecked.length > 0 && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-[rgb(235,227,215)] p-4 safe-bottom">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold">{unchecked.length} items to order</p>
              <p className="text-xs text-muted-foreground">Est. {formatCurrency(totalEstimate)} · delivered in ~25 min</p>
            </div>
            {ordered ? (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                <Check className="w-4 h-4" /> Ordered!
              </div>
            ) : (
              <button
                onClick={handleOrderClick}
                disabled={ordering}
                className="flex items-center gap-2 bg-brand-500 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-brand-600 disabled:opacity-60 transition-colors"
              >
                {ordering ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Placing…</>
                ) : (
                  <>{platform === "instamart" ? <Package className="w-4 h-4" /> : <Zap className="w-4 h-4" />} Order Now</>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Binding-order confirmation — only shown for live (real, paid) checkout */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl p-6 z-10 space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-gray-900">Confirm real order</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This places a real, binding order on your connected {platformName} account — payment and delivery
              happen for real, not a demo.
            </p>
            <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deliver to</span>
                <span className="font-medium">{addressLabel ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">{unchecked.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. total</span>
                <span className="font-medium">{formatCurrency(totalEstimate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span className="font-medium">Cash on Delivery</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Online/UPI payment isn&apos;t wired up yet — every live order goes out as Cash on
              Delivery. Quantities are also rounded up to whole packs where a partial pack isn&apos;t sold.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600"
              >
                Place real order
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
