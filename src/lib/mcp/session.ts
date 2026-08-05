import { cookies } from "next/headers";
import { getIronSession, type IronSession } from "iron-session";
import type { Platform } from "@/lib/types";

/**
 * Server-only cookie sessions. There's no DB in this project (household data
 * lives client-side in Zustand/localStorage), so OAuth tokens are held in an
 * httpOnly + encrypted (iron-session/sealed) cookie instead. Never read/write
 * these from client components.
 */

export interface PlatformSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // epoch ms
  selectedAddressId?: string;
  addressLabel?: string;
  storeId?: string;
  deviceId?: string;
  /** Instamart only — get_addresses omits coordinates for privacy, but
   *  track_order requires them. Captured client-side (browser geolocation)
   *  when the user selects an address, if they grant permission. */
  addressCoords?: { lat: number; lng: number };
}

interface CommerceSessionData {
  zepto?: PlatformSession;
  instamart?: PlatformSession;
}

interface PendingOAuthData {
  platform?: Platform;
  state?: string;
  codeVerifier?: string;
}

// Resolved lazily (not at module load) so `next build`'s static page-data
// collection — which imports route modules without a real request — doesn't
// fail just because env vars aren't set yet in a build environment.
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set in production (see .env.example).");
    }
    return "dev-only-insecure-secret-change-me-before-deploying-32chars";
  }
  return secret;
}

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

async function commerceSession(): Promise<IronSession<CommerceSessionData>> {
  const store = await cookies();
  return getIronSession<CommerceSessionData>(store, {
    cookieName: "freshplate_commerce_session",
    password: getSessionSecret(),
    cookieOptions: baseCookieOptions,
  });
}

async function pendingOAuthSession(): Promise<IronSession<PendingOAuthData>> {
  const store = await cookies();
  return getIronSession<PendingOAuthData>(store, {
    cookieName: "freshplate_oauth_pending",
    password: getSessionSecret(),
    ttl: 600, // 10 minutes — just long enough for the redirect round trip
    cookieOptions: baseCookieOptions,
  });
}

export async function getPlatformSession(platform: Platform): Promise<PlatformSession | undefined> {
  const session = await commerceSession();
  return session[platform];
}

export async function setPlatformSession(platform: Platform, data: PlatformSession): Promise<void> {
  const session = await commerceSession();
  session[platform] = data;
  await session.save();
}

export async function clearPlatformSession(platform: Platform): Promise<void> {
  const session = await commerceSession();
  delete session[platform];
  await session.save();
}

export async function startPendingOAuth(platform: Platform, state: string, codeVerifier: string): Promise<void> {
  const session = await pendingOAuthSession();
  session.platform = platform;
  session.state = state;
  session.codeVerifier = codeVerifier;
  await session.save();
}

export async function consumePendingOAuth(): Promise<PendingOAuthData> {
  const session = await pendingOAuthSession();
  const data = { platform: session.platform, state: session.state, codeVerifier: session.codeVerifier };
  session.destroy();
  return data;
}
