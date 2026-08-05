import { withMcpClient, type ToolCaller } from "./mcpClient";
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
 * Real Zepto MCP tool sequences, validated live (tool input schemas + example
 * search/address output) against https://mcp.zepto.co.in/mcp in a Claude Code
 * session. Cart/order/tracking *output* shapes were not empirically observed
 * (only their input schemas), so parsing there is defensive/best-effort —
 * verify against a real connected account before shipping checkout.
 *
 * Zepto ties "store context" to a saved address server-side; since every API
 * route invocation opens a fresh MCP connection, we don't assume that context
 * survives across connections — every call that needs it re-selects the
 * household's chosen address first.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

async function ensureAddressSelected(ctx: McpContext, call: ToolCaller): Promise<void> {
  if (!ctx.selectedAddressId) {
    throw new Error("No Zepto delivery address selected. Connect an address from Profile first.");
  }
  await call("select_saved_address", { addressId: ctx.selectedAddressId });
}

function mapZeptoProduct(p: Json): ProductResult {
  const price = typeof p.price === "number" ? p.price / 100 : 0;
  const mrp = typeof p.mrp === "number" ? p.mrp / 100 : undefined;
  return {
    platform: "zepto",
    name: p.name ?? "Unknown item",
    price,
    mrp,
    packSize: p.packSize ?? undefined,
    available: (p.availableQuantity ?? 0) > 0,
    imageUrl: p.imageUrl,
    platformRef: {
      productVariantId: p.productVariantId,
      storeProductId: p.storeProductId,
      cartProductId: p.cartProductId,
      variantId: p.variantId,
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      packSize: p.packSize,
      availableQuantity: p.availableQuantity,
      imageUrl: p.imageUrl,
      isAd: p.isAd ?? false,
    },
  };
}

function extractCartItems(raw: Json): Json[] {
  if (Array.isArray(raw?.cartItems)) return raw.cartItems;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw)) return raw;
  return [];
}

function normalizeCart(raw: Json): Cart {
  const lines: CartLine[] = extractCartItems(raw).map((i: Json) => {
    const price = typeof i.price === "number" ? i.price / 100 : 0;
    return {
      name: i.name ?? i.label ?? "Item",
      quantity: i.quantity ?? 0,
      price,
      platformRef: {
        productVariantId: i.productVariantId ?? i.variantId,
        storeProductId: i.storeProductId,
      },
    };
  });
  return { platform: "zepto", items: lines, total: lines.reduce((sum, l) => sum + l.price * l.quantity, 0) };
}

async function listAddresses(ctx: McpContext): Promise<AddressOption[]> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("list_saved_addresses")) as Json;
    const addresses = Array.isArray(result?.addresses) ? result.addresses : [];
    return addresses.map((a: Json) => ({
      id: a.id,
      label: a.label ?? "Address",
      addressLine: a.addressLine ?? "",
      latitude: a.latitude,
      longitude: a.longitude,
    }));
  });
}

async function selectAddress(ctx: McpContext, addressId: string): Promise<void> {
  await withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    await call("select_saved_address", { addressId });
  });
}

async function searchProducts(ctx: McpContext, query: string): Promise<ProductResult[]> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    await ensureAddressSelected(ctx, call);
    const result = (await call("search_products", { query })) as Json;
    const products = Array.isArray(result?.products) ? result.products : [];
    return products.map(mapZeptoProduct);
  });
}

async function getCart(ctx: McpContext): Promise<Cart> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("view_cart")) as Json;
    return normalizeCart(result);
  });
}

async function updateCart(ctx: McpContext, lines: CartLineInput[]): Promise<Cart> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const deviceId = ctx.deviceId ?? "freshplate-fallback-device";
    const cartItems = lines.map((line) => {
      const ref = line.platformRef;
      return {
        productVariantId: ref.productVariantId,
        storeProductId: ref.storeProductId,
        cartProductId: ref.cartProductId,
        variantId: ref.variantId,
        quantity: line.quantity,
        name: line.name ?? ref.name,
        label: ref.name ?? line.name,
        price: ref.price,
        mrp: ref.mrp,
        packSize: ref.packSize ?? line.packSize,
        availableQuantity: ref.availableQuantity,
        imageUrl: ref.imageUrl,
        isAd: ref.isAd ?? false,
      };
    });
    const result = (await call("update_cart", { deviceId, cartItems })) as Json;
    return normalizeCart(result);
  });
}

async function clearCart(ctx: McpContext): Promise<void> {
  await withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const current = (await call("view_cart")) as Json;
    const items = extractCartItems(current);
    if (items.length === 0) return;
    const deviceId = ctx.deviceId ?? "freshplate-fallback-device";
    const cartItems = items.map((i: Json) => ({
      productVariantId: i.productVariantId ?? i.variantId,
      storeProductId: i.storeProductId,
      quantity: 0,
    }));
    await call("update_cart", { deviceId, cartItems });
  });
}

async function checkout(ctx: McpContext, opts: CheckoutOptions): Promise<PlatformOrderResult> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    await ensureAddressSelected(ctx, call);
    // Required by Zepto's own tool description: surface payment methods before placing.
    // v1 only wires up COD end-to-end; online/UPI payment is deferred (see PRD open questions).
    await call("get_payment_methods");
    // Two-step: preview, then confirm — per create_order's own description.
    await call("create_order", { userAddressId: opts.addressId, confirmOrder: false });
    const placed = (await call("create_order", {
      userAddressId: opts.addressId,
      confirmOrder: true,
      riderTip: opts.riderTip ?? 0,
    })) as Json;
    return {
      id: String(placed?.orderId ?? placed?.order_id ?? placed?.id ?? `zepto-${Date.now()}`),
      status: String(placed?.status ?? "placed"),
      totalAmount: typeof placed?.total === "number" ? placed.total / 100 : undefined,
      placedAt: new Date().toISOString(),
    };
  });
}

async function trackOrder(ctx: McpContext, orderId: string): Promise<TrackingInfo> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("get_order_detail", { orderId })) as Json;
    return { status: String(result?.status ?? "unknown"), eta: result?.eta ?? result?.expectedDeliveryTime };
  });
}

async function getOrderHistory(ctx: McpContext): Promise<PlatformOrderResult[]> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("list_order_history", { limit: 10, pageNumber: 1 })) as Json;
    const orders = Array.isArray(result?.orders) ? result.orders : [];
    return orders.map((o: Json) => ({
      id: String(o.orderId ?? o.id),
      status: String(o.status ?? "unknown"),
      totalAmount: typeof o.total === "number" ? o.total / 100 : undefined,
      placedAt: o.placedAt ?? o.createdAt ?? new Date().toISOString(),
    }));
  });
}

async function getFrequentItems(ctx: McpContext): Promise<ProductResult[]> {
  return withMcpClient(ctx.endpoint, ctx.accessToken, async (call) => {
    const result = (await call("get_past_order_items")) as Json;
    const items = Array.isArray(result?.items) ? result.items : Array.isArray(result) ? result : [];
    return items.map((i: Json) => ({
      platform: "zepto" as const,
      name: i.name ?? i.productName ?? "Item",
      price: 0,
      available: true,
      platformRef: { productVariantId: i.productVariantId },
    }));
  });
}

export const zeptoCommerce: CommerceModule = {
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
