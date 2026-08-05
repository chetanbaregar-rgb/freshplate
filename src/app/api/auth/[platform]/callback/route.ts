import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getOAuthConfig } from "@/lib/mcp/oauth";
import { consumePendingOAuth, setPlatformSession } from "@/lib/mcp/session";
import { getCommerceModule, getMcpEndpoint, isPlatform } from "@/lib/mcp/registry";

export async function GET(request: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const redirectToProfile = (query: string) =>
    NextResponse.redirect(new URL(`/profile?${query}`, request.url));

  if (!isPlatform(platform)) {
    return NextResponse.json({ error: `Unknown platform "${platform}"` }, { status: 404 });
  }

  const code = request.nextUrl.searchParams.get("code");
  const returnedState = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  // Always consume (single-use) the pending cookie, even on error paths, so
  // it can never be replayed.
  const pending = await consumePendingOAuth();

  if (oauthError) {
    return redirectToProfile(`connect_error=${encodeURIComponent(oauthError)}`);
  }
  if (
    !code ||
    !returnedState ||
    !pending.state ||
    pending.platform !== platform ||
    pending.state !== returnedState ||
    !pending.codeVerifier
  ) {
    // This mismatch check IS the CSRF defense for this flow — do not proceed.
    return redirectToProfile("connect_error=invalid_oauth_state");
  }

  let config;
  try {
    config = getOAuthConfig(platform);
  } catch (err) {
    return redirectToProfile(`connect_error=${encodeURIComponent((err as Error).message)}`);
  }

  try {
    const token = await exchangeCodeForToken(config, code, pending.codeVerifier);
    const endpoint = getMcpEndpoint(platform);
    const deviceId = randomUUID();

    // Best-effort: auto-select the address if there's exactly one, so
    // search/cart work immediately. Multiple addresses -> user picks in Profile.
    let selectedAddressId: string | undefined;
    let addressLabel: string | undefined;
    try {
      const commerce = getCommerceModule(platform);
      const addresses = await commerce.listAddresses({ accessToken: token.access_token, endpoint });
      if (addresses.length === 1) {
        await commerce.selectAddress({ accessToken: token.access_token, endpoint }, addresses[0].id);
        selectedAddressId = addresses[0].id;
        addressLabel = addresses[0].label;
      }
    } catch {
      // Non-fatal — connection still succeeds; user selects an address later.
    }

    await setPlatformSession(platform, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: token.expires_in ? Date.now() + token.expires_in * 1000 : undefined,
      deviceId,
      selectedAddressId,
      addressLabel,
    });

    return redirectToProfile(`connected=${platform}`);
  } catch (err) {
    return redirectToProfile(`connect_error=${encodeURIComponent((err as Error).message)}`);
  }
}
