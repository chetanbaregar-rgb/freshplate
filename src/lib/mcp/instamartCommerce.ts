import { withMcpClient } from "./mcpClient";
import type {
  AddressOption,
  Cart,
  CartLine,
  CartLineInput,
  CheckoutOptions,
  CommerceModule,
  McpContext,
  PlatformOrderResult,
  ProductResult,
  TrackingInfo,
} from "./commerceTypes";

/**
 * Real Swiggy Instamart MCP tool sequences, validated live (search_products
 * and get_addresses were exercised against https://mcp.swiggy.com/im with real
 * example output in a Claude Code session; cart/checkout/order output shapes
 * were only confirmed at the input-schema level) — same caveat as
 * zeptoCommerce.ts: verify cart/checkout parsing against a real account.
 *
 * Unlike Zepto, Instamart has no server-side "select address" tool — every
 * call that needs delivery context takes addressId as an explicit parameter,
 * so there's no store-context re-selection step required here.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

function requireAddress(ctx: McpContext): string {
  if (!ctx.selectedAddressId) {
    throw new Error("No Instamart delivery address selected. Connect an address from Profile first.");
  }
  return ctx.selectedAddressId;
}

function extractProductList(raw: Json): Json[] {
  if (Array.isArray(raw?.data?.products)) return raw.data.products;
  if (Array.isArray(raw?.products)) return raw.products;
  return [];
}

function mapInstamartProduct(p: Json): ProductResult[] {
  const variations = Array.isArray(p.variations) ? p.variations : [];
  return variations.map((v: Json) => ({
    platform: "instamart" as const,
    name: v.displayName ?? p.displayName ?? "Unknown item",
    brand: v.brandName ?? p.brand,
    price: typeof v.price?.offerPrice === "number" ? v.price.offerPrice : v.price?.mrp ?? 0,
    mrp: v.price?.mrp,
    packSize: v.quantityDescription,
    available: v.isInStockAndAvailable ?? p.inStock ?? false,
    imageUrl: v.imageUrl,
    platformRef: { spinId: v.spinId, skuId: v.skuId },
  }));
}

function extractCartItems(raw: Json): Json[] {
  if (Array.isArray(raw?.cart?.items)) return raw.cart.items;
  if (Array.isArray(raw?.items)) return raw.items;
  return [];
}

function normalizeCart(raw: Json): Cart {
  const lines: CartLine[] = extractCartItems(raw).map((i: Json) => ({
    name: i.displayName ?? i.name ?? "Item",
    quantity: i.quantity ?? 0,
    price: typeof i.price?.offerPrice === "number" ? i.price.offerPrice : i.price ?? 0,
    platformRef: { spinId: i.spinId, skuId: i.skuId },
  }));
  const total =
    typeof raw?.bill?.total === "number" ? raw.bill.total : lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  return { platform: "instamart", items: lines, total };
}

async function listAddresses(ctx: McpContext): Promise<AddressOption[]> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("get_addresses")) as Json;
    const addresses = Array.isArray(result?.addresses) ? result.addresses : [];
    return addresses.map((a: Json) => ({
      id: a.id,
      label: a.addressCategory ?? a.addressTag ?? "Address",
      addressLine: a.addressLine ?? "",
      // get_addresses deliberately omits coordinates (per its own description,
      // for privacy) — track_order needs them, so they must come from
      // elsewhere (e.g. browser geolocation captured at connect time).
    }));
  });
}

async function selectAddress(_ctx: McpContext, addressId: string): Promise<void> {
  if (!addressId) throw new Error("addressId is required");
  // No-op beyond validation: Instamart tools take addressId per-call rather
  // than binding a server-side "selected" store the way Zepto does.
}

async function searchProducts(ctx: McpContext, query: string): Promise<ProductResult[]> {
  const addressId = requireAddress(ctx);
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("search_products", { addressId, query })) as Json;
    return extractProductList(result).flatMap(mapInstamartProduct);
  });
}

async function getCart(ctx: McpContext): Promise<Cart> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("get_cart")) as Json;
    return normalizeCart(result);
  });
}

async function updateCart(ctx: McpContext, lines: CartLineInput[]): Promise<Cart> {
  const addressId = requireAddress(ctx);
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    // update_cart REPLACES the entire cart, unlike Zepto's merge-by-default update_cart.
    const items = lines.map((line) => ({
      spinId: line.platformRef.spinId,
      skuId: line.platformRef.skuId,
      quantity: line.quantity,
    }));
    const result = (await call("update_cart", { selectedAddressId: addressId, items })) as Json;
    return normalizeCart(result);
  });
}

async function clearCart(ctx: McpContext): Promise<void> {
  await withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    await call("clear_cart");
  });
}

async function checkout(ctx: McpContext, opts: CheckoutOptions): Promise<PlatformOrderResult> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    // v1 only wires up Cash on Delivery end-to-end; UPI needs a user-facing
    // intent-app picker (get_payment_options) plus a check_payment_status /
    // confirm_order polling loop that's deferred for now (see PRD open Qs).
    const result = (await call("checkout", { addressId: opts.addressId, paymentMethod: "Cash" })) as Json;
    const order = result?.order ?? result;
    const status = String(order?.status ?? "placed");

    // Defensive: if Cash orders ever land in a pending state too, finalize —
    // but never call confirm_order on a failed/cancelled status.
    if (status.toUpperCase().includes("PENDING") && order?.orderId) {
      const confirmed = (await call("confirm_order", { orderId: order.orderId })) as Json;
      return {
        id: String(confirmed?.orderId ?? order.orderId),
        status: String(confirmed?.status ?? "placed"),
        totalAmount: order?.total,
        placedAt: new Date().toISOString(),
      };
    }

    return {
      id: String(order?.orderId ?? order?.id ?? `instamart-${Date.now()}`),
      status,
      totalAmount: order?.total,
      placedAt: new Date().toISOString(),
    };
  });
}

async function trackOrder(ctx: McpContext, orderId: string): Promise<TrackingInfo> {
  if (!ctx.addressCoords) {
    throw new Error(
      "Tracking an Instamart order requires delivery coordinates, which get_addresses doesn't return. " +
        "Capture lat/lng once (e.g. via browser geolocation) when the address is selected."
    );
  }
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("track_order", {
      orderId,
      lat: ctx.addressCoords!.lat,
      lng: ctx.addressCoords!.lng,
    })) as Json;
    return { status: String(result?.status ?? "unknown"), eta: result?.eta };
  });
}

async function getOrderHistory(ctx: McpContext): Promise<PlatformOrderResult[]> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("get_orders", { count: 10 })) as Json;
    const orders = Array.isArray(result?.orders) ? result.orders : [];
    return orders.map((o: Json) => ({
      id: String(o.orderId ?? o.id),
      status: String(o.status ?? "unknown"),
      totalAmount: o.total,
      placedAt: o.placedAt ?? o.createdAt ?? new Date().toISOString(),
    }));
  });
}

async function getFrequentItems(ctx: McpContext): Promise<ProductResult[]> {
  const addressId = requireAddress(ctx);
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("your_go_to_items", { addressId })) as Json;
    return extractProductList(result).flatMap(mapInstamartProduct);
  });
}

export const instamartCommerce: CommerceModule = {
  listAddresses,
  selectAddress,
  searchProducts,
  getCart,
  updateCart,
  clearCart,
  checkout,
  trackOrder,
  getOrderHistory,
  getFrequentItems,
};
