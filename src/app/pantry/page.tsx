"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import AppShell from "@/components/layout/AppShell";
import { Package, Plus, Trash2, AlertTriangle, X, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { useCommerceStatus } from "@/lib/mcp/useCommerceStatus";
import { LiveCommerceAdapter, type ProductResult } from "@/lib/mcp/adapter";
import { getIngredientCategoryByName } from "@/lib/recipes";
import type { PantryItem, Platform } from "@/lib/types";

const CONNECTABLE_PLATFORMS: Platform[] = ["zepto", "instamart"];

/** Known pantry units, in the same order offered by the manual add-item form. */
const KNOWN_UNITS = ["g", "kg", "ml", "L", "piece", "pack", "bunch", "cup"];

/** Best-effort split of a commerce packSize string (e.g. "500g", "1kg", "6 pcs")
 *  into a pantry-compatible {quantity, unit} pair. Falls back to a single
 *  "piece" when the pack size is missing or doesn't parse — never 0 or
 *  negative, since that would corrupt downstream stock math the same way an
 *  unvalidated manual entry would. */
function pantryQuantityFromPackSize(packSize?: string): { quantity: number; unit: string } {
  const fallback = { quantity: 1, unit: "piece" };
  if (!packSize) return fallback;
  const match = packSize.trim().match(/^([\d.]+)\s*([a-zA-Z]+)?/);
  if (!match) return fallback;
  const quantity = parseFloat(match[1]);
  if (!Number.isFinite(quantity) || quantity <= 0) return fallback;
  const rawUnit = (match[2] ?? "piece").toLowerCase();
  const unitAliases: Record<string, string> = {
    pcs: "piece", pc: "piece", pieces: "piece",
    l: "L", ltr: "L", litre: "L", liter: "L",
  };
  const unit = unitAliases[rawUnit] ?? KNOWN_UNITS.find((u) => u.toLowerCase() === rawUnit) ?? "piece";
  return { quantity, unit };
}

const CATEGORY_LABELS: Record<string, string> = {
  vegetable: "🥦 Vegetables",
  fruit: "🍋 Fruits",
  dairy: "🥛 Dairy",
  grain: "🌾 Grains",
  protein: "🥚 Protein",
  spice: "🌶️ Spices",
  oil: "🫙 Oils",
  other: "📦 Other",
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as PantryItem["category"][];

export default function PantryPage() {
  const router = useRouter();
  const { household, pantry, addPantryItem, updatePantryItem, removePantryItem, orders } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "", quantity: 1, unit: "g", category: "vegetable" as PantryItem["category"], expiryDate: "",
  });

  const trimmedName = newItem.name.trim();
  const isQuantityValid = Number.isFinite(newItem.quantity) && newItem.quantity > 0;
  const isNameValid = trimmedName.length > 0;
  const canSubmitNewItem = isNameValid && isQuantityValid;

  // Frequent-order pre-seed: only meaningful against real order history, so
  // only connected (live) platforms are queried — an unconnected platform's
  // mock adapter always returns the same 3 demo products, which carries no
  // signal about what this household actually buys.
  const { status: commerceStatus, loading: commerceStatusLoading } = useCommerceStatus();
  const [frequentItems, setFrequentItems] = useState<{ platform: Platform; item: ProductResult }[]>([]);
  const [loadingFrequent, setLoadingFrequent] = useState(false);
  const [addedFrequentKeys, setAddedFrequentKeys] = useState<Set<string>>(new Set());

  const connectedPlatforms = CONNECTABLE_PLATFORMS.filter((p) => commerceStatus[p].connected);
  const connectedPlatformsKey = connectedPlatforms.join(",");

  useEffect(() => {
    if (commerceStatusLoading || connectedPlatforms.length === 0) {
      setFrequentItems([]);
      return;
    }
    let cancelled = false;
    setLoadingFrequent(true);
    Promise.all(
      connectedPlatforms.map(async (platform) => {
        try {
          const items = await new LiveCommerceAdapter(platform).getFrequentItems();
          return items.map((item) => ({ platform, item }));
        } catch {
          return []; // best-effort — a flaky lookup on one platform shouldn't block the other
        }
      })
    )
      .then((groups) => {
        if (!cancelled) setFrequentItems(groups.flat());
      })
      .finally(() => {
        if (!cancelled) setLoadingFrequent(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commerceStatusLoading, connectedPlatformsKey]);

  // Dedupe across platforms (e.g. "Onions" showing up as both Zepto's and
  // Instamart's frequent items) so the chip row doesn't repeat the same
  // ingredient twice.
  const uniqueFrequentItems = useMemo(() => {
    const seen = new Set<string>();
    const result: { platform: Platform; item: ProductResult }[] = [];
    for (const entry of frequentItems) {
      const key = entry.item.name.trim().toLowerCase();
      if (seen.has(key) || !key) continue;
      seen.add(key);
      result.push(entry);
    }
    return result;
  }, [frequentItems]);

  const handleQuickAdd = (entry: { platform: Platform; item: ProductResult }) => {
    const name = entry.item.name.trim();
    if (!name) return;
    const key = name.toLowerCase();
    const { quantity, unit } = pantryQuantityFromPackSize(entry.item.packSize);
    addPantryItem({
      name,
      quantity,
      unit,
      category: getIngredientCategoryByName(name),
    });
    setAddedFrequentKeys((prev) => new Set(prev).add(key));
    toast.success(`${name} added to pantry!`);
  };

  // Deep-linking here without completing onboarding leaves household null
  // (or incomplete) — bounce to onboarding instead of rendering an empty pantry.
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

  const grouped = pantry.reduce<Record<string, PantryItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const nearExpiry = pantry.filter((item) => {
    if (!item.expiryDate) return false;
    const days = differenceInDays(new Date(item.expiryDate), new Date());
    return days >= 0 && days <= 3;
  });

  const handleAdd = () => {
    if (!canSubmitNewItem) return;
    addPantryItem({ ...newItem, name: trimmedName });
    setShowAdd(false);
    setNewItem({ name: "", quantity: 1, unit: "g", category: "vegetable", expiryDate: "" });
    toast.success("Item added to pantry!");
  };

  const recentOrder = orders.find((o) => o.status === "placed" || o.status === "on_the_way");

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-white border-b border-[rgb(235,227,215)] px-4 pt-4 pb-3 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Pantry & Stock</h1>
            <p className="text-xs text-muted-foreground">{pantry.length} items tracked</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 bg-brand-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-brand-600"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 lg:px-8 space-y-4">
        {/* Active order banner */}
        {recentOrder && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              🛵
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-800">Order on the way</p>
              <p className="text-xs text-blue-600">
                {recentOrder.items.length} items from {recentOrder.platform === "instamart" ? "Swiggy Instamart" : "Zepto"} ·
                Placed {format(new Date(recentOrder.placedAt), "h:mm a")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-800">₹{recentOrder.totalAmount}</p>
              {recentOrder.id.startsWith("DEMO-") && (
                <p className="text-[9px] font-semibold text-blue-400" title="Sample order — connect a platform in Profile for real orders">demo</p>
              )}
            </div>
          </div>
        )}

        {/* Quick add from order history — additive/secondary to manual add,
            only shown when at least one platform is actually connected. */}
        {connectedPlatforms.length > 0 && (loadingFrequent || uniqueFrequentItems.length > 0) && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Quick add from your usual orders
            </p>
            {loadingFrequent ? (
              <p className="text-xs text-muted-foreground">Loading your frequent items…</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {uniqueFrequentItems.map((entry) => {
                  const key = entry.item.name.trim().toLowerCase();
                  const added = addedFrequentKeys.has(key);
                  return (
                    <button
                      key={`${entry.platform}-${key}`}
                      onClick={() => handleQuickAdd(entry)}
                      disabled={added}
                      className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                        added
                          ? "bg-green-50 border-green-200 text-green-600 cursor-default"
                          : "bg-white border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600"
                      )}
                    >
                      {added ? "✓ " : "+ "}{entry.item.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Near expiry alert */}
        {nearExpiry.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-sm font-semibold text-amber-800">Use soon</p>
            </div>
            <div className="space-y-1">
              {nearExpiry.map((item) => {
                const days = differenceInDays(new Date(item.expiryDate!), new Date());
                return (
                  <p key={item.id} className="text-xs text-amber-700">
                    {item.name} — expires {days === 0 ? "today" : `in ${days} day${days !== 1 ? "s" : ""}`}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {pantry.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <Package className="w-12 h-12 text-gray-200" />
            <div>
              <p className="text-sm font-medium text-gray-600">Your pantry is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Add items manually or they&apos;ll auto-populate after your first delivery.</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-sm font-medium text-brand-600 bg-brand-50 border border-brand-200 rounded-xl px-4 py-2"
            >
              <Plus className="w-4 h-4" /> Add first item
            </button>
          </div>
        )}

        {/* Grouped items */}
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {CATEGORY_LABELS[cat] ?? cat}
            </p>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {items.map((item, idx) => {
                const isExpiringSoon = item.expiryDate
                  ? differenceInDays(new Date(item.expiryDate), new Date()) <= 3
                  : false;
                const isLow = item.quantity < 50 && ["vegetable", "fruit", "protein"].includes(item.category);
                const step = item.unit === "g" ? 100 : 1;
                // Quantity must stay a positive number (>0) — same rule as the
                // add form, so an edit can never leave a pantry row at 0/negative
                // stock (which corrupts buildShoppingList/markMealCooked math in
                // store.ts). To zero an item out, remove it via the trash icon.
                const canDecrement = item.quantity - step > 0;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      idx < items.length - 1 && "border-b border-gray-50"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{item.name}</p>
                        {isExpiringSoon && (
                          <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">EXPIRING</span>
                        )}
                        {isLow && (
                          <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">LOW</span>
                        )}
                      </div>
                      {item.expiryDate && (
                        <p className="text-xs text-muted-foreground">Expires {format(new Date(item.expiryDate), "d MMM")}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (!canDecrement) return;
                            updatePantryItem(item.id, { quantity: item.quantity - step });
                          }}
                          disabled={!canDecrement}
                          title={!canDecrement ? "Remove the item instead of reducing it to zero" : undefined}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
                        >−</button>
                        <span className="text-sm font-semibold w-12 text-center tabular-nums">
                          {item.quantity}{item.unit === "g" || item.unit === "ml" ? item.unit : " " + item.unit}
                        </span>
                        <button
                          onClick={() => updatePantryItem(item.id, { quantity: item.quantity + step })}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 text-sm font-bold"
                        >+</button>
                      </div>
                      <button
                        onClick={() => { removePantryItem(item.id); toast.success(`${item.name} removed`); }}
                        aria-label={`Remove ${item.name} from pantry`}
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add item modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold">Add to Pantry</h3>
              <button onClick={() => setShowAdd(false)} aria-label="Close" className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Item name (e.g. Tomatoes)"
                aria-label="Item name"
                value={newItem.name}
                onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Quantity"
                  aria-label="Quantity"
                  min={0}
                  step="any"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem((p) => ({ ...p, quantity: Number(e.target.value) }))}
                  className={cn(
                    "border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400",
                    isQuantityValid ? "border-gray-200" : "border-red-300"
                  )}
                />
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))}
                  aria-label="Unit"
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  {KNOWN_UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              {!isQuantityValid && (
                <p className="text-xs text-red-500 -mt-1.5">Quantity must be greater than 0.</p>
              )}
              <select
                value={newItem.category}
                onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value as PantryItem["category"] }))}
                aria-label="Category"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
              <input
                type="date"
                placeholder="Expiry date (optional)"
                aria-label="Expiry date (optional)"
                value={newItem.expiryDate}
                onChange={(e) => setNewItem((p) => ({ ...p, expiryDate: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-600"
              />
              <button
                onClick={handleAdd}
                disabled={!canSubmitNewItem}
                className="w-full bg-brand-500 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-600 disabled:opacity-40 text-sm"
              >
                Add to Pantry
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
