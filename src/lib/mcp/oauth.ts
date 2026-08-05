import { randomBytes, createHash } from "crypto";
import type { Platform } from "@/lib/types";

/**
 * OAuth 2.1 + PKCE config per platform, loaded from env. There is no RFC 8414
 * discovery here on purpose — FreshPlate needs its own registered OAuth client
 * per platform (self-serve for Zepto; a demo submission to builders@swiggy.in
 * for Instamart production access — see PRD §9, §16), so explicit env vars are
 * the only thing that can actually be correct. See .env.example.
 */
export interface PlatformOAuthConfig {
  mcpEndpoint: string;
  authorizeUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scope?: string;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name} — see .env.example to configure OAuth for this platform.`);
  }
  return value;
}

export function getOAuthConfig(platform: Platform): PlatformOAuthConfig {
  if (platform === "zepto") {
    return {
      mcpEndpoint: process.env.ZEPTO_MCP_URL ?? "https://mcp.zepto.co.in/mcp",
      authorizeUrl: required("ZEPTO_OAUTH_AUTHORIZE_URL"),
      tokenUrl: required("ZEPTO_OAUTH_TOKEN_URL"),
      clientId: required("ZEPTO_CLIENT_ID"),
      clientSecret: process.env.ZEPTO_CLIENT_SECRET,
      redirectUri: required("ZEPTO_REDIRECT_URI"),
      scope: process.env.ZEPTO_OAUTH_SCOPE ?? "tools:read tools:write",
    };
  }
  return {
    mcpEndpoint: process.env.INSTAMART_MCP_URL ?? "https://mcp.swiggy.com/im",
    authorizeUrl: required("INSTAMART_OAUTH_AUTHORIZE_URL"),
    tokenUrl: required("INSTAMART_OAUTH_TOKEN_URL"),
    clientId: required("INSTAMART_CLIENT_ID"),
    clientSecret: process.env.INSTAMART_CLIENT_SECRET,
    redirectUri: required("INSTAMART_REDIRECT_URI"),
    scope: process.env.INSTAMART_OAUTH_SCOPE,
  };
}

function base64url(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function createPkcePair(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = base64url(randomBytes(32));
  const codeChallenge = base64url(createHash("sha256").update(codeVerifier).digest());
  return { codeVerifier, codeChallenge };
}

export function createState(): string {
  return base64url(randomBytes(16));
}

export function buildAuthorizeUrl(config: PlatformOAuthConfig, state: string, codeChallenge: string): string {
  const url = new URL(config.authorizeUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);
  if (config.scope) url.searchParams.set("scope", config.scope);
  return url.toString();
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}

async function postTokenRequest(config: PlatformOAuthConfig, body: URLSearchParams): Promise<TokenResponse> {
  if (config.clientSecret) body.set("client_secret", config.clientSecret);
  const res = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OAuth token request failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

export function exchangeCodeForToken(config: PlatformOAuthConfig, code: string, codeVerifier: string): Promise<TokenResponse> {
  return postTokenRequest(
    config,
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      code_verifier: codeVerifier,
    })
  );
}

export function refreshAccessToken(config: PlatformOAuthConfig, refreshToken: string): Promise<TokenResponse> {
  return postTokenRequest(
    config,
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: config.clientId,
    })
  );
}
