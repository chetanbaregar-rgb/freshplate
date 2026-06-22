"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import AppShell from "@/components/layout/AppShell";
import { Package, Plus, Trash2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import type { PantryItem } from "@/lib/types";

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
  const { pantry, addPantryItem, updatePantryItem, removePantryItem, orders } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "", quantity: 1, unit: "g", category: "vegetable" as PantryItem["category"], expiryDate: "",
  });

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
    if (!newItem.name) return;
    addPantryItem(newItem);
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
            <div className="text-sm font-bold text-blue-800">
              ₹{recentOrder.totalAmount}
            </div>
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
                          onClick={() => updatePantryItem(item.id, { quantity: Math.max(0, item.quantity - (item.unit === "g" ? 100 : 1)) })}
                          className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 text-sm font-bold"
                        >−</button>
                        <span className="text-sm font-semibold w-12 text-center tabular-nums">
                          {item.quantity}{item.unit === "g" || item.unit === "ml" ? item.unit : " " + item.unit}
                        </span>
                        <button
                          onClick={() => updatePantryItem(item.id, { quantity: item.quantity + (item.unit === "g" ? 100 : 1) })}
                          className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 text-sm font-bold"
                        >+</button>
                      </div>
                      <button
                        onClick={() => { removePantryItem(item.id); toast.success(`${item.name} removed`); }}
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
              <button onClick={() => setShowAdd(false)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Item name (e.g. Tomatoes)"
                value={newItem.name}
                onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem((p) => ({ ...p, quantity: Number(e.target.value) }))}
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))}
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  {["g", "kg", "ml", "L", "piece", "pack", "bunch", "cup"].map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value as PantryItem["category"] }))}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
              <input
                type="date"
                placeholder="Expiry date (optional)"
                value={newItem.expiryDate}
                onChange={(e) => setNewItem((p) => ({ ...p, expiryDate: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-600"
              />
              <button
                onClick={handleAdd}
                disabled={!newItem.name}
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
