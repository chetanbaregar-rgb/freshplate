import { randomBytes, createHash } from "crypto";
import type { Platform } from "@/lib/types";

/**
 * OAuth 2.1 + PKCE config per platform, loaded from env.
 *
 * Zepto: needs its own registered OAuth client, so explicit env vars are the only thing that can
 * actually be correct (see .env.example).
 *
 * Instamart: Swiggy does not issue client credentials. Clients register themselves with Dynamic
 * Client Registration (RFC 7591), so by default nothing but the redirect URI is configured and a
 * client is registered on each Connect. Setting INSTAMART_CLIENT_ID switches to a fixed client
 * from env, which is also how a pre-registered client would be used.
 */
export interface PlatformOAuthConfig {
  mcpEndpoint: string;
  authorizeUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scope?: string;
  /** Wire format of token requests. Swiggy's token endpoint takes JSON; the rest take forms. */
  tokenFormat: "form" | "json";
  /** True when the client was registered on the fly instead of read from env. */
  dynamic: boolean;
}

/** An OAuth client identity issued by Dynamic Client Registration. */
export interface ClientIdentity {
  clientId: string;
  clientSecret?: string;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name} — see .env.example to configure OAuth for this platform.`);
  }
  return value;
}

const INSTAMART_DEFAULT_SCOPE = "mcp:tools";

/** Instamart registers its own client unless a fixed one is configured. Zepto never does. */
export function isDynamicRegistration(platform: Platform): boolean {
  return platform === "instamart" && !process.env.INSTAMART_CLIENT_ID;
}

/**
 * Config for platforms that use a client from env. For Instamart in dynamic mode use
 * resolveOAuthConfig(), which discovers endpoints and takes the registered client.
 */
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
      tokenFormat: "form",
      dynamic: false,
    };
  }
  return {
    mcpEndpoint: process.env.INSTAMART_MCP_URL || "https://mcp.swiggy.com/im",
    authorizeUrl: required("INSTAMART_OAUTH_AUTHORIZE_URL"),
    tokenUrl: required("INSTAMART_OAUTH_TOKEN_URL"),
    clientId: required("INSTAMART_CLIENT_ID"),
    clientSecret: process.env.INSTAMART_CLIENT_SECRET,
    redirectUri: required("INSTAMART_REDIRECT_URI"),
    scope: process.env.INSTAMART_OAUTH_SCOPE,
    tokenFormat: "form",
    dynamic: false,
  };
}

// --- Discovery and Dynamic Client Registration -------------------------------------------------

export interface AuthServerEndpoints {
  authorizeUrl: string;
  tokenUrl: string;
  registrationUrl: string;
}

const DISCOVERY_TTL_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;
const discoveryCache = new Map<string, { endpoints: AuthServerEndpoints; expires: number }>();

export function clearDiscoveryCache(): void {
  discoveryCache.clear();
}

/** HTTPS only, except localhost so a local stub of the auth server can be used in development. */
function isAcceptableEndpoint(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || (url.protocol === "http:" && url.hostname === "localhost");
  } catch {
    return false;
  }
}

/**
 * Finds the authorization server's endpoints from RFC 8414 metadata at the MCP server's origin.
 * Any endpoint the metadata does not provide (or the whole document, if it cannot be read) falls
 * back to the paths Swiggy documents: /auth/authorize, /auth/token and /auth/register.
 */
export async function discoverAuthServer(mcpEndpoint: string): Promise<AuthServerEndpoints> {
  const origin = new URL(mcpEndpoint).origin;
  const cached = discoveryCache.get(origin);
  if (cached && cached.expires > Date.now()) return cached.endpoints;

  let metadata: Record<string, unknown> = {};
  try {
    const res = await fetch(`${origin}/.well-known/oauth-authorization-server`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (res.ok) metadata = await res.json();
  } catch {
    // Fall through to the documented paths.
  }

  const endpoints: AuthServerEndpoints = {
    authorizeUrl: isAcceptableEndpoint(metadata.authorization_endpoint) ? metadata.authorization_endpoint : `${origin}/auth/authorize`,
    tokenUrl: isAcceptableEndpoint(metadata.token_endpoint) ? metadata.token_endpoint : `${origin}/auth/token`,
    registrationUrl: isAcceptableEndpoint(metadata.registration_endpoint) ? metadata.registration_endpoint : `${origin}/auth/register`,
  };
  discoveryCache.set(origin, { endpoints, expires: Date.now() + DISCOVERY_TTL_MS });
  return endpoints;
}

/** Registration was refused or failed. The message is safe to show the user. */
export class OAuthRegistrationError extends Error {}

/**
 * Registers FreshPlate as an OAuth client (RFC 7591). A public client: PKCE protects the code
 * exchange, so no client secret is requested, but one is kept if the server issues it anyway.
 */
export async function registerClient(registrationUrl: string, redirectUri: string, scope: string): Promise<ClientIdentity> {
  let res: Response;
  try {
    res = await fetch(registrationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_name: "FreshPlate",
        redirect_uris: [redirectUri],
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        token_endpoint_auth_method: "none",
        scope,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new OAuthRegistrationError("Could not reach the Instamart sign-in service. Please try again in a moment.");
  }

  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const code = typeof body.error === "string" ? body.error : "";
    const detail = typeof body.error_description === "string" ? body.error_description : code || res.statusText;
    if (code === "invalid_redirect_uri") {
      throw new OAuthRegistrationError(
        `Instamart did not accept the redirect address ${redirectUri}. It must be HTTPS and approved by Swiggy, or http://localhost for development.`
      );
    }
    throw new OAuthRegistrationError(`Instamart client registration failed (${res.status}): ${detail}`);
  }
  if (typeof body.client_id !== "string" || !body.client_id) {
    throw new OAuthRegistrationError("Instamart client registration did not return a client id.");
  }
  return { clientId: body.client_id, clientSecret: typeof body.client_secret === "string" ? body.client_secret : undefined };
}

/** Instamart in dynamic mode: discovers the auth server and registers a new client for this connect. */
export async function registerOAuthClient(platform: Platform): Promise<ClientIdentity> {
  if (!isDynamicRegistration(platform)) {
    throw new Error(`${platform} does not use dynamic client registration.`);
  }
  const endpoints = await discoverAuthServer(process.env.INSTAMART_MCP_URL || "https://mcp.swiggy.com/im");
  const scope = process.env.INSTAMART_OAUTH_SCOPE || INSTAMART_DEFAULT_SCOPE;
  return registerClient(endpoints.registrationUrl, required("INSTAMART_REDIRECT_URI"), scope);
}

/**
 * The config to use for a platform. Static platforms read it from env. Instamart in dynamic mode
 * needs the client that was registered for this connection (kept in the sign-in cookie during the
 * redirect, then in the platform session), because a different client could not redeem the code.
 */
export async function resolveOAuthConfig(platform: Platform, client?: ClientIdentity): Promise<PlatformOAuthConfig> {
  if (!isDynamicRegistration(platform)) return getOAuthConfig(platform);
  if (!client) {
    throw new Error("No registered Instamart client for this connection. Please connect again.");
  }
  const mcpEndpoint = process.env.INSTAMART_MCP_URL || "https://mcp.swiggy.com/im";
  const endpoints = await discoverAuthServer(mcpEndpoint);
  return {
    mcpEndpoint,
    authorizeUrl: process.env.INSTAMART_OAUTH_AUTHORIZE_URL || endpoints.authorizeUrl,
    tokenUrl: process.env.INSTAMART_OAUTH_TOKEN_URL || endpoints.tokenUrl,
    clientId: client.clientId,
    clientSecret: client.clientSecret,
    redirectUri: required("INSTAMART_REDIRECT_URI"),
    scope: process.env.INSTAMART_OAUTH_SCOPE || INSTAMART_DEFAULT_SCOPE,
    tokenFormat: "json",
    dynamic: true,
  };
}

// --- Authorization request and tokens ----------------------------------------------------------

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

/** A token request was answered with an error. `code` is the OAuth error, e.g. invalid_grant. */
export class OAuthTokenError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message);
  }
  /** Worth retrying later, and not a sign that the refresh token is dead. */
  get transient(): boolean {
    return this.status >= 500;
  }
}

async function postTokenRequest(config: PlatformOAuthConfig, params: Record<string, string>): Promise<TokenResponse> {
  const json = config.tokenFormat === "json";
  const fields = { ...params };
  if (config.clientSecret) fields.client_secret = config.clientSecret;

  const res = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": json ? "application/json" : "application/x-www-form-urlencoded", Accept: "application/json" },
    body: json ? JSON.stringify(fields) : new URLSearchParams(fields),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let code: string | undefined;
    try {
      const parsed = JSON.parse(text) as { error?: unknown };
      if (typeof parsed.error === "string") code = parsed.error;
    } catch {
      // Not JSON; the raw text goes in the message.
    }
    throw new OAuthTokenError(`OAuth token request failed (${res.status}): ${text || res.statusText}`, res.status, code);
  }
  return res.json();
}

export function exchangeCodeForToken(config: PlatformOAuthConfig, code: string, codeVerifier: string): Promise<TokenResponse> {
  // Swiggy's documented JSON exchange has no client_id; everything else sends it.
  const params: Record<string, string> = {
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
    code_verifier: codeVerifier,
  };
  if (config.tokenFormat === "form") params.client_id = config.clientId;
  return postTokenRequest(config, params);
}

const REFRESH_RETRY_DELAYS_MS = [400, 1200];

/**
 * Swiggy rotates refresh tokens: the response carries a new one, and the old one stops working,
 * so callers must store what comes back. A 5xx is retried a couple of times, as Swiggy advises;
 * a 400 invalid_grant is final and means the user has to connect again.
 */
export async function refreshAccessToken(
  config: PlatformOAuthConfig,
  refreshToken: string,
  retryDelaysMs: number[] = REFRESH_RETRY_DELAYS_MS
): Promise<TokenResponse> {
  const params: Record<string, string> = { grant_type: "refresh_token", refresh_token: refreshToken };
  if (config.tokenFormat === "form") params.client_id = config.clientId;

  if (config.tokenFormat !== "json") return postTokenRequest(config, params);

  for (let attempt = 0; ; attempt++) {
    try {
      return await postTokenRequest(config, params);
    } catch (err) {
      const retriable = err instanceof OAuthTokenError && err.transient;
      if (!retriable || attempt >= retryDelaysMs.length) throw err;
      await new Promise((resolve) => setTimeout(resolve, retryDelaysMs[attempt]));
    }
  }
}
