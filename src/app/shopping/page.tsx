"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import AppShell from "@/components/layout/AppShell";
import { ShoppingCart, Check, RefreshCw, ChevronDown, ChevronUp, Copy, Info } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { formatShoppingList, quantityToBuy } from "@/lib/shopping";
import { toast } from "sonner";
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
  const { shoppingList, buildShoppingList, toggleShoppingItem, weeklyPlan } = useAppStore();
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (shoppingList.length === 0 && weeklyPlan) {
      buildShoppingList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyPlan?.id]);

  const grouped = shoppingList.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const unchecked = shoppingList.filter((i) => !i.checked);
  const checkedCount = shoppingList.filter((i) => i.checked).length;

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) { next.delete(cat); } else { next.add(cat); }
      return next;
    });
  };

  const handleCopy = async () => {
    if (!weeklyPlan) return;
    try {
      await navigator.clipboard.writeText(formatShoppingList(shoppingList, weeklyPlan.weekStart));
      toast.success(`Copied ${unchecked.length} item${unchecked.length === 1 ? "" : "s"} to the clipboard.`);
    } catch {
      toast.error("Couldn't copy to the clipboard. Check this browser allows it.");
    }
  };

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
            onClick={() => { buildShoppingList(); toast.success("List refreshed!"); }}
            className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-500 hover:text-brand-600"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 lg:px-8 space-y-3 pb-32">
        <div role="note" className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            <span className="font-semibold">Demo mode.</span> FreshPlate isn&apos;t connected to Zepto or Swiggy Instamart yet,
            so it can&apos;t show prices or place an order. Copy this list to shop on an app or at the store.
          </p>
        </div>

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
                          Need {quantityToBuy(item)}
                          {item.qtyInStock > 0 && ` · ${item.qtyInStock} in stock`}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {item.price !== undefined && (
                          <p className="text-sm font-semibold text-brand-600">{formatCurrency(item.price)}</p>
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

      {/* Sticky footer */}
      {unchecked.length > 0 && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-[rgb(235,227,215)] p-4 safe-bottom">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold">{unchecked.length} item{unchecked.length === 1 ? "" : "s"} to buy</p>
              <p className="text-xs text-muted-foreground">Demo mode · no prices, no ordering</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-brand-500 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors"
            >
              <Copy className="w-4 h-4" /> Copy list
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
