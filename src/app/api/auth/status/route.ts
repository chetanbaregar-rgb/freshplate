import { NextResponse } from "next/server";
import { getPlatformSession } from "@/lib/mcp/session";

/**
 * Server-derived connection status. This is the source of truth for whether
 * checkout/search should hit the live adapters — never trust a client-side
 * cookie or cached flag for this, always re-derive from the httpOnly session.
 */
export async function GET() {
  const [zepto, instamart] = await Promise.all([getPlatformSession("zepto"), getPlatformSession("instamart")]);
  return NextResponse.json({
    zepto: {
      connected: !!zepto?.accessToken,
      addressLabel: zepto?.addressLabel ?? null,
      addressId: zepto?.selectedAddressId ?? null,
    },
    instamart: {
      connected: !!instamart?.accessToken,
      addressLabel: instamart?.addressLabel ?? null,
      addressId: instamart?.selectedAddressId ?? null,
    },
  });
}
