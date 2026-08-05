/**
 * Client-facing CommerceAdapter — call this from components/store actions.
 * Real Zepto/Instamart calls happen server-side (see zeptoCommerce.ts /
 * instamartCommerce.ts / api/commerce/[platform]/route.ts); this file is a
 * thin fetch() wrapper over that route, plus a mock fallback for platforms
 * the household hasn't connected yet.
 */
import type { Platform } from "@/lib/types";
import type {
  AddressOption,
  Cart,
  CartLineInput,
  PlatformOrderResult,
  ProductResult,
  TrackingInfo,
} from "./commerceTypes";

export type {
  AddressOption,
  Cart,
  CartLine,
  CartLineInput,
  PlatformOrderResult,
  ProductResult,
  TrackingInfo,
} from "./commerceTypes";

export interface CommerceAdapter {
  listAddresses(): Promise<AddressOption[]>;
  selectAddress(addressId: string, coords?: { lat: number; lng: number }): Promise<void>;
  searchProducts(query: string): Promise<ProductResult[]>;
  getCart(): Promise<Cart>;
  updateCart(lines: CartLineInput[]): Promise<Cart>;
  clearCart(): Promise<void>;
  checkout(addressId: string, riderTip?: number): Promise<PlatformOrderResult>;
  trackOrder(orderId: string): Promise<TrackingInfo>;
  getOrderHistory(): Promise<PlatformOrderResult[]>;
  getFrequentItems(): Promise<ProductResult[]>;
}

export class NotConnectedError extends Error {
  constructor(platform: Platform) {
    super(`${platform} is not connected`);
    this.name = "NotConnectedError";
  }
}

/** Thin fetch() wrapper — all real MCP logic lives server-side. */
export class LiveCommerceAdapter implements CommerceAdapter {
  constructor(private platform: Platform) {}

  private async call<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
    const res = await fetch(`/api/commerce/${this.platform}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    if (res.status === 401) throw new NotConnectedError(this.platform);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
    return data as T;
  }

  async isConnected(): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      return !!data?.[this.platform]?.connected;
    } catch {
      return false;
    }
  }

  listAddresses() {
    return this.call<{ addresses: AddressOption[] }>("addresses.list").then((r) => r.addresses);
  }
  selectAddress(addressId: string, coords?: { lat: number; lng: number }) {
    return this.call<{ ok: true }>("addresses.select", { addressId, coords }).then(() => undefined);
  }
  searchProducts(query: string) {
    return this.call<{ products: ProductResult[] }>("search", { query }).then((r) => r.products);
  }
  getCart() {
    return this.call<{ cart: Cart }>("cart.get").then((r) => r.cart);
  }
  updateCart(lines: CartLineInput[]) {
    return this.call<{ cart: Cart }>("cart.update", { lines }).then((r) => r.cart);
  }
  clearCart() {
    return this.call<{ ok: true }>("cart.clear").then(() => undefined);
  }
  checkout(addressId: string, riderTip?: number) {
    return this.call<{ order: PlatformOrderResult }>("checkout", { addressId, riderTip }).then((r) => r.order);
  }
  trackOrder(orderId: string) {
    return this.call<{ tracking: TrackingInfo }>("orders.track", { orderId }).then((r) => r.tracking);
  }
  getOrderHistory() {
    return this.call<{ orders: PlatformOrderResult[] }>("orders.history").then((r) => r.orders);
  }
  getFrequentItems() {
    return this.call<{ products: ProductResult[] }>("items.frequent").then((r) => r.products);
  }
}

const MOCK_PRODUCTS: Record<string, { name: string; price: number; packSize: string }> = {
  tomato: { name: "Tomatoes", price: 28, packSize: "500g" },
  onion: { name: "Onions", price: 35, packSize: "1kg" },
  paneer: { name: "Fresh Paneer", price: 85, packSize: "200g" },
  chicken: { name: "Chicken Curry Cut", price: 195, packSize: "500g" },
  spinach: { name: "Spinach/Palak", price: 22, packSize: "250g" },
  rice: { name: "Basmati Rice", price: 120, packSize: "1kg" },
  eggs: { name: "Farm Fresh Eggs", price: 55, packSize: "6 pcs" },
  oats: { name: "Quaker Oats", price: 115, packSize: "500g" },
};

const MOCK_ADDRESS: AddressOption = {
  id: "mock-address",
  label: "Home (demo)",
  addressLine: "Demo address — connect a real account from Profile for live data",
};

/** Dev/demo fallback for a platform the household hasn't connected yet. */
export class MockCommerceAdapter implements CommerceAdapter {
  constructor(private platform: Platform) {}
  private cart = new Map<string, { name: string; quantity: number; price: number }>();

  async isConnected() {
    return false;
  }
  async listAddresses() {
    return [MOCK_ADDRESS];
  }
  async selectAddress() {
    return undefined;
  }
  async searchProducts(query: string): Promise<ProductResult[]> {
    await new Promise((r) => setTimeout(r, 300));
    const key = Object.keys(MOCK_PRODUCTS).find((k) => query.toLowerCase().includes(k));
    const match = key ? MOCK_PRODUCTS[key] : { name: query, price: 45, packSize: "500g" };
    const skuId = key ?? `custom-${query.toLowerCase().replace(/\s+/g, "-")}`;
    return [
      {
        platform: this.platform,
        name: match.name,
        price: match.price,
        packSize: match.packSize,
        available: true,
        platformRef: { mockSkuId: skuId },
      },
    ];
  }
  async getCart(): Promise<Cart> {
    const items = Array.from(this.cart.values()).map((i) => ({ ...i, platformRef: {} }));
    return { platform: this.platform, items, total: items.reduce((s, i) => s + i.price * i.quantity, 0) };
  }
  async updateCart(lines: CartLineInput[]): Promise<Cart> {
    await new Promise((r) => setTimeout(r, 200));
    for (const line of lines) {
      const key = JSON.stringify(line.platformRef);
      if (line.quantity <= 0) this.cart.delete(key);
      else this.cart.set(key, { name: line.name ?? "Item", quantity: line.quantity, price: line.price ?? 50 });
    }
    return this.getCart();
  }
  async clearCart() {
    this.cart.clear();
  }
  async checkout(_addressId: string): Promise<PlatformOrderResult> {
    await new Promise((r) => setTimeout(r, 600));
    const cart = await this.getCart();
    this.cart.clear();
    return {
      id: `DEMO-${Date.now()}`,
      status: "placed",
      totalAmount: cart.total,
      placedAt: new Date().toISOString(),
    };
  }
  async trackOrder(): Promise<TrackingInfo> {
    return { status: "on_the_way", eta: "25 minutes" };
  }
  async getOrderHistory() {
    return [];
  }
  async getFrequentItems(): Promise<ProductResult[]> {
    return Object.entries(MOCK_PRODUCTS)
      .slice(0, 3)
      .map(([key, p]) => ({
        platform: this.platform,
        name: p.name,
        price: p.price,
        packSize: p.packSize,
        available: true,
        platformRef: { mockSkuId: key },
      }));
  }
}

/**
 * Resolves whether the household has actually connected `platform`, and
 * returns the matching adapter. Callers that place real money orders (see
 * shopping/page.tsx) MUST check `live` and show the binding-order disclaimer
 * before checkout when true — never assume live vs mock from the adapter type alone.
 */
export async function resolveAdapter(platform: Platform): Promise<{ adapter: CommerceAdapter; live: boolean }> {
  const live = new LiveCommerceAdapter(platform);
  const connected = await live.isConnected();
  return connected ? { adapter: live, live: true } : { adapter: new MockCommerceAdapter(platform), live: false };
}
