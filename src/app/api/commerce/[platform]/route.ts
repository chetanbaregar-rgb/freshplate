import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPlatformSession, setPlatformSession } from "@/lib/mcp/session";
import { getCommerceModule, getMcpEndpoint, isPlatform } from "@/lib/mcp/registry";
import type { CartLineInput, McpContext } from "@/lib/mcp/commerceTypes";

/**
 * Single dispatch endpoint, POST-only, body {action, ...}. `action` is a
 * closed enum mapped server-side to a specific commerce-module function —
 * deliberately NOT a raw MCP tool-name passthrough, so client JS can never
 * invoke arbitrary tools with arbitrary params on the user's live account.
 */

const cartLineSchema = z.object({
  quantity: z.number().min(0),
  platformRef: z.record(z.string(), z.unknown()),
  name: z.string().optional(),
  price: z.number().optional(),
  packSize: z.string().optional(),
});

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("addresses.list") }),
  z.object({
    action: z.literal("addresses.select"),
    addressId: z.string().min(1),
    // Instamart's get_addresses omits coordinates (privacy); track_order needs
    // them, so the client can optionally supply them (e.g. browser geolocation).
    coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
  }),
  z.object({ action: z.literal("search"), query: z.string().min(1) }),
  z.object({ action: z.literal("cart.get") }),
  z.object({ action: z.literal("cart.update"), lines: z.array(cartLineSchema).min(1) }),
  z.object({ action: z.literal("cart.clear") }),
  z.object({ action: z.literal("checkout"), addressId: z.string().min(1), riderTip: z.number().optional() }),
  z.object({ action: z.literal("orders.history") }),
  z.object({ action: z.literal("orders.track"), orderId: z.string().min(1) }),
  z.object({ action: z.literal("items.frequent") }),
]);

export async function POST(request: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!isPlatform(platform)) {
    return NextResponse.json({ error: `Unknown platform "${platform}"` }, { status: 404 });
  }

  const session = await getPlatformSession(platform);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const ctx: McpContext = {
    accessToken: session.accessToken,
    endpoint: getMcpEndpoint(platform),
    deviceId: session.deviceId,
    selectedAddressId: session.selectedAddressId,
    addressCoords: session.addressCoords,
  };
  const commerce = getCommerceModule(platform);
  const input = parsed.data;

  try {
    switch (input.action) {
      case "addresses.list":
        return NextResponse.json({ addresses: await commerce.listAddresses(ctx) });

      case "addresses.select": {
        await commerce.selectAddress(ctx, input.addressId);
        await setPlatformSession(platform, {
          ...session,
          selectedAddressId: input.addressId,
          addressCoords: input.coords ?? session.addressCoords,
        });
        return NextResponse.json({ ok: true });
      }

      case "search":
        return NextResponse.json({ products: await commerce.searchProducts(ctx, input.query) });

      case "cart.get":
        return NextResponse.json({ cart: await commerce.getCart(ctx) });

      case "cart.update":
        return NextResponse.json({ cart: await commerce.updateCart(ctx, input.lines as CartLineInput[]) });

      case "cart.clear":
        await commerce.clearCart(ctx);
        return NextResponse.json({ ok: true });

      case "checkout": {
        const order = await commerce.checkout(ctx, {
          addressId: input.addressId,
          paymentMethod: "cod",
          riderTip: input.riderTip,
        });
        return NextResponse.json({ order });
      }

      case "orders.history":
        return NextResponse.json({ orders: await commerce.getOrderHistory(ctx) });

      case "orders.track":
        return NextResponse.json({ tracking: await commerce.trackOrder(ctx, input.orderId) });

      case "items.frequent":
        return NextResponse.json({ products: await commerce.getFrequentItems(ctx) });
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }

  return NextResponse.json({ error: "unhandled_action" }, { status: 400 });
}
