import type { Platform } from "@/lib/types";

/**
 * Per-request context handed to the commerce modules. Built once per API call
 * from the session cookie (or, right after OAuth callback, from the token we
 * just minted — before it's readable back out of the request's cookie jar).
 */
export interface McpContext {
  accessToken: string;
  endpoint: string;
  /** Zepto's update_cart requires a stable per-household device key. */
  deviceId?: string;
  selectedAddressId?: string;
  /** Only ever populated for Instamart, whose track_order needs delivery coords
   *  that get_addresses deliberately omits (privacy). Capture once at address
   *  selection time (e.g. from the browser) and thread through. */
  addressCoords?: { lat: number; lng: number };
}

export interface AddressOption {
  id: string;
  label: string;
  addressLine: string;
  latitude?: number;
  longitude?: number;
}

export interface ProductResult {
  platform: Platform;
  name: string;
  brand?: string;
  /** Rupees, always — Zepto's wire format is paisa; we normalize at the boundary. */
  price: number;
  mrp?: number;
  packSize?: string;
  available: boolean;
  imageUrl?: string;
  /**
   * Opaque platform-specific identifiers needed to add this exact item/variant
   * to cart later. Callers should treat this as a black box and thread it back
   * unchanged into updateCart — Zepto needs {productVariantId, storeProductId,
   * ...}, Instamart needs {spinId, skuId}, and they are not interchangeable.
   */
  platformRef: Record<string, unknown>;
}

export interface CartLineInput {
  quantity: number;
  platformRef: Record<string, unknown>;
  name?: string;
  price?: number;
  packSize?: string;
}

export interface CartLine {
  name: string;
  quantity: number;
  price: number;
  platformRef: Record<string, unknown>;
}

export interface Cart {
  platform: Platform;
  items: CartLine[];
  total: number;
}

export interface CheckoutOptions {
  addressId: string;
  /** Only Cash on Delivery is wired up end-to-end for v1 — see instamartCommerce.ts / zeptoCommerce.ts. */
  paymentMethod: "cod";
  riderTip?: number;
}

export interface TrackingInfo {
  status: string;
  eta?: string;
}

export interface PlatformOrderResult {
  id: string;
  /** Raw platform status string — caller maps to the app's OrderStatus enum. */
  status: string;
  totalAmount?: number;
  placedAt: string;
}

export interface CommerceModule {
  listAddresses(ctx: McpContext): Promise<AddressOption[]>;
  selectAddress(ctx: McpContext, addressId: string): Promise<void>;
  searchProducts(ctx: McpContext, query: string): Promise<ProductResult[]>;
  getCart(ctx: McpContext): Promise<Cart>;
  updateCart(ctx: McpContext, lines: CartLineInput[]): Promise<Cart>;
  clearCart(ctx: McpContext): Promise<void>;
  checkout(ctx: McpContext, opts: CheckoutOptions): Promise<PlatformOrderResult>;
  trackOrder(ctx: McpContext, orderId: string): Promise<TrackingInfo>;
  getOrderHistory(ctx: McpContext): Promise<PlatformOrderResult[]>;
  getFrequentItems(ctx: McpContext): Promise<ProductResult[]>;
}
