/**
 * CommerceAdapter — single interface over Zepto + Swiggy Instamart MCPs.
 * Dev mode uses mock data. Production swaps in real HTTP MCP calls.
 */
import type { Platform, Order } from "@/lib/types";

export interface ProductResult {
  skuId: string;
  name: string;
  price: number;
  packSize: string;
  available: boolean;
  platform: Platform;
  imageUrl?: string;
}

export interface CartItem {
  skuId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  platform: Platform;
}

export interface CommerceAdapter {
  searchProducts(query: string, address: string, platform: Platform): Promise<ProductResult[]>;
  getCart(platform: Platform): Promise<Cart>;
  updateCart(platform: Platform, items: { skuId: string; quantity: number }[]): Promise<Cart>;
  clearCart(platform: Platform): Promise<void>;
  checkout(platform: Platform, paymentMethod: string): Promise<Order>;
  trackOrder(platform: Platform, orderId: string): Promise<{ status: string; eta?: string }>;
  getOrderHistory(platform: Platform): Promise<Order[]>;
  getFrequentItems(platform: Platform, address: string): Promise<ProductResult[]>;
}

const DEV_MODE = process.env.NODE_ENV === "development" || !process.env.ZEPTO_MCP_URL;

class MockCommerceAdapter implements CommerceAdapter {
  private mockProducts: Record<string, ProductResult[]> = {
    tomato: [
      { skuId: "sku_tm1", name: "Tomatoes (500g)", price: 28, packSize: "500g", available: true, platform: "instamart" },
      { skuId: "sku_tm2", name: "Tomatoes (1kg)", price: 49, packSize: "1kg", available: true, platform: "zepto" },
    ],
    onion: [
      { skuId: "sku_on1", name: "Onions (1kg)", price: 35, packSize: "1kg", available: true, platform: "instamart" },
      { skuId: "sku_on2", name: "Onions (2kg)", price: 65, packSize: "2kg", available: true, platform: "zepto" },
    ],
    paneer: [
      { skuId: "sku_pn1", name: "Fresh Paneer (200g)", price: 85, packSize: "200g", available: true, platform: "instamart" },
      { skuId: "sku_pn2", name: "Amul Paneer (200g)", price: 90, packSize: "200g", available: true, platform: "zepto" },
    ],
    chicken: [
      { skuId: "sku_ch1", name: "Chicken Curry Cut (500g)", price: 195, packSize: "500g", available: true, platform: "instamart" },
      { skuId: "sku_ch2", name: "Fresh Chicken (1kg)", price: 380, packSize: "1kg", available: true, platform: "zepto" },
    ],
    spinach: [
      { skuId: "sku_sp1", name: "Spinach/Palak (250g)", price: 22, packSize: "250g", available: true, platform: "instamart" },
      { skuId: "sku_sp2", name: "Fresh Spinach (500g)", price: 40, packSize: "500g", available: true, platform: "zepto" },
    ],
    rice: [
      { skuId: "sku_ri1", name: "Basmati Rice (1kg)", price: 120, packSize: "1kg", available: true, platform: "instamart" },
    ],
    eggs: [
      { skuId: "sku_eg1", name: "Farm Fresh Eggs (6pc)", price: 55, packSize: "6 pcs", available: true, platform: "instamart" },
      { skuId: "sku_eg2", name: "Brown Eggs (12pc)", price: 105, packSize: "12 pcs", available: true, platform: "zepto" },
    ],
    oats: [
      { skuId: "sku_oa1", name: "Quaker Oats (500g)", price: 115, packSize: "500g", available: true, platform: "instamart" },
    ],
  };

  async searchProducts(query: string, _address: string, platform: Platform): Promise<ProductResult[]> {
    await new Promise((r) => setTimeout(r, 400));
    const key = Object.keys(this.mockProducts).find((k) => query.toLowerCase().includes(k));
    const results = key ? this.mockProducts[key] : [
      { skuId: `sku_${Date.now()}`, name: `${query} (500g)`, price: 45, packSize: "500g", available: Math.random() > 0.2, platform },
    ];
    return results.filter((r) => r.platform === platform || platform === "instamart");
  }

  async getCart(platform: Platform): Promise<Cart> {
    return { items: [], total: 0, platform };
  }

  async updateCart(platform: Platform, items: { skuId: string; quantity: number }[]): Promise<Cart> {
    await new Promise((r) => setTimeout(r, 300));
    const cartItems: CartItem[] = items.map((item) => ({
      skuId: item.skuId,
      name: `Item ${item.skuId}`,
      quantity: item.quantity,
      price: 50,
    }));
    return { items: cartItems, total: cartItems.reduce((s, i) => s + i.price * i.quantity, 0), platform };
  }

  async clearCart(_platform: Platform): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
  }

  async checkout(platform: Platform, _paymentMethod: string): Promise<Order> {
    await new Promise((r) => setTimeout(r, 800));
    return {
      id: `ORD-${Date.now()}`,
      platform,
      planId: "current",
      items: [],
      status: "placed",
      placedAt: new Date().toISOString(),
      totalAmount: 650,
    };
  }

  async trackOrder(_platform: Platform, _orderId: string): Promise<{ status: string; eta?: string }> {
    return { status: "on_the_way", eta: "25 minutes" };
  }

  async getOrderHistory(_platform: Platform): Promise<Order[]> {
    return [];
  }

  async getFrequentItems(platform: Platform, _address: string): Promise<ProductResult[]> {
    return [
      { skuId: "sku_tm1", name: "Tomatoes (500g)", price: 28, packSize: "500g", available: true, platform },
      { skuId: "sku_on1", name: "Onions (1kg)", price: 35, packSize: "1kg", available: true, platform },
      { skuId: "sku_ri1", name: "Basmati Rice (1kg)", price: 120, packSize: "1kg", available: true, platform },
    ];
  }
}

class ZeptoMCPAdapter implements CommerceAdapter {
  private endpoint = process.env.ZEPTO_MCP_URL ?? "https://mcp.zepto.co.in/mcp";

  private async call(tool: string, params: Record<string, unknown>) {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool, params }),
    });
    if (!res.ok) throw new Error(`Zepto MCP error: ${res.status}`);
    return res.json();
  }

  async searchProducts(query: string, address: string, platform: Platform): Promise<ProductResult[]> {
    const data = await this.call("search_products", { query, address });
    return (data.results ?? []).map((r: Record<string, unknown>) => ({
      skuId: r.sku_id,
      name: r.name,
      price: r.price,
      packSize: r.pack_size,
      available: r.available,
      platform,
    }));
  }

  async getCart(platform: Platform): Promise<Cart> {
    const data = await this.call("get_cart", {});
    return { items: data.items ?? [], total: data.total ?? 0, platform };
  }

  async updateCart(platform: Platform, items: { skuId: string; quantity: number }[]): Promise<Cart> {
    const data = await this.call("update_cart", { items });
    return { items: data.items ?? [], total: data.total ?? 0, platform };
  }

  async clearCart(_platform: Platform): Promise<void> {
    await this.call("remove_from_cart", { clear_all: true });
  }

  async checkout(platform: Platform, paymentMethod: string): Promise<Order> {
    const data = await this.call("place_order", { payment_method: paymentMethod });
    return {
      id: data.order_id,
      platform,
      planId: "current",
      items: data.items ?? [],
      status: "placed",
      placedAt: new Date().toISOString(),
      totalAmount: data.total,
    };
  }

  async trackOrder(_platform: Platform, orderId: string): Promise<{ status: string; eta?: string }> {
    const data = await this.call("track_order", { order_id: orderId });
    return { status: data.status, eta: data.eta };
  }

  async getOrderHistory(_platform: Platform): Promise<Order[]> {
    const data = await this.call("get_order_history", {});
    return data.orders ?? [];
  }

  async getFrequentItems(platform: Platform, _address: string): Promise<ProductResult[]> {
    const data = await this.call("get_frequently_bought", {});
    return (data.items ?? []).map((r: Record<string, unknown>) => ({ ...r, platform } as ProductResult));
  }
}

export function getAdapter(): CommerceAdapter {
  if (DEV_MODE) return new MockCommerceAdapter();
  return new ZeptoMCPAdapter();
}

export const adapter = getAdapter();
