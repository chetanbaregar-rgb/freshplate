import { NextResponse } from "next/server";
import {
  createPkcePair,
  createState,
  buildAuthorizeUrl,
  isDynamicRegistration,
  OAuthRegistrationError,
  registerOAuthClient,
  resolveOAuthConfig,
  type ClientIdentity,
} from "@/lib/mcp/oauth";
import { startPendingOAuth } from "@/lib/mcp/session";
import { isPlatform } from "@/lib/mcp/registry";

export async function GET(request: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!isPlatform(platform)) {
    return NextResponse.json({ error: `Unknown platform "${platform}"` }, { status: 404 });
  }

  let config;
  let client: ClientIdentity | undefined;
  try {
    // Instamart registers a client for each connection. A refusal is something the person should
    // see, so it goes back to Profile as a message instead of a raw JSON error page.
    if (isDynamicRegistration(platform)) client = await registerOAuthClient(platform);
    config = await resolveOAuthConfig(platform, client);
  } catch (err) {
    if (err instanceof OAuthRegistrationError) {
      return NextResponse.redirect(new URL(`/profile?connect_error=${encodeURIComponent(err.message)}`, request.url));
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  const { codeVerifier, codeChallenge } = createPkcePair();
  const state = createState();
  await startPendingOAuth(platform, state, codeVerifier, client);

  return NextResponse.redirect(buildAuthorizeUrl(config, state, codeChallenge));
}
