import { NextResponse } from "next/server";
import { createPkcePair, createState, buildAuthorizeUrl, getOAuthConfig } from "@/lib/mcp/oauth";
import { startPendingOAuth } from "@/lib/mcp/session";
import { isPlatform } from "@/lib/mcp/registry";

export async function GET(_request: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!isPlatform(platform)) {
    return NextResponse.json({ error: `Unknown platform "${platform}"` }, { status: 404 });
  }

  let config;
  try {
    config = getOAuthConfig(platform);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  const { codeVerifier, codeChallenge } = createPkcePair();
  const state = createState();
  await startPendingOAuth(platform, state, codeVerifier);

  return NextResponse.redirect(buildAuthorizeUrl(config, state, codeChallenge));
}
