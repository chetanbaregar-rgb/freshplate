import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildAuthorizeUrl,
  clearDiscoveryCache,
  discoverAuthServer,
  exchangeCodeForToken,
  getOAuthConfig,
  isDynamicRegistration,
  OAuthRegistrationError,
  OAuthTokenError,
  refreshAccessToken,
  registerClient,
  registerOAuthClient,
  resolveOAuthConfig,
} from "./oauth";

const REDIRECT = "https://freshplate.example/api/auth/instamart/callback";
const METADATA = {
  authorization_endpoint: "https://mcp.swiggy.com/auth/authorize",
  token_endpoint: "https://mcp.swiggy.com/auth/token",
  registration_endpoint: "https://mcp.swiggy.com/auth/register",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

let fetchMock: ReturnType<typeof vi.fn>;
const sentBody = (call = 0) => JSON.parse(fetchMock.mock.calls[call][1].body as string);

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("INSTAMART_REDIRECT_URI", REDIRECT);
  vi.stubEnv("INSTAMART_CLIENT_ID", "");
  clearDiscoveryCache();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("discoverAuthServer", () => {
  it("reads the endpoints from the metadata at the MCP server's origin", async () => {
    fetchMock.mockResolvedValueOnce(
      json({
        authorization_endpoint: "https://auth.example/authorize",
        token_endpoint: "https://auth.example/token",
        registration_endpoint: "https://auth.example/register",
      })
    );
    const endpoints = await discoverAuthServer("https://mcp.swiggy.com/im");
    expect(fetchMock.mock.calls[0][0]).toBe("https://mcp.swiggy.com/.well-known/oauth-authorization-server");
    expect(endpoints).toEqual({
      authorizeUrl: "https://auth.example/authorize",
      tokenUrl: "https://auth.example/token",
      registrationUrl: "https://auth.example/register",
    });
  });

  it("falls back to the documented paths when the metadata cannot be fetched", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    expect(await discoverAuthServer("https://mcp.swiggy.com/im")).toEqual({
      authorizeUrl: "https://mcp.swiggy.com/auth/authorize",
      tokenUrl: "https://mcp.swiggy.com/auth/token",
      registrationUrl: "https://mcp.swiggy.com/auth/register",
    });
  });

  it("falls back for a non-200 answer, and for any single endpoint that is missing or not https", async () => {
    fetchMock.mockResolvedValueOnce(json({}, 404));
    expect((await discoverAuthServer("https://mcp.swiggy.com/im")).registrationUrl).toBe("https://mcp.swiggy.com/auth/register");

    clearDiscoveryCache();
    fetchMock.mockResolvedValueOnce(
      json({ authorization_endpoint: "http://evil.example/authorize", token_endpoint: METADATA.token_endpoint })
    );
    const partial = await discoverAuthServer("https://mcp.swiggy.com/im");
    expect(partial.authorizeUrl).toBe("https://mcp.swiggy.com/auth/authorize"); // plain http refused
    expect(partial.tokenUrl).toBe(METADATA.token_endpoint);
    expect(partial.registrationUrl).toBe("https://mcp.swiggy.com/auth/register"); // missing
  });

  it("asks only once for a while", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json(METADATA)));
    await discoverAuthServer("https://mcp.swiggy.com/im");
    await discoverAuthServer("https://mcp.swiggy.com/im");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("registerClient", () => {
  it("posts a public-client registration with the redirect address and scope", async () => {
    fetchMock.mockResolvedValueOnce(json({ client_id: "client-123" }, 201));
    const client = await registerClient(METADATA.registration_endpoint, REDIRECT, "mcp:tools");

    expect(client).toEqual({ clientId: "client-123", clientSecret: undefined });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(METADATA.registration_endpoint);
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(sentBody()).toEqual({
      client_name: "FreshPlate",
      redirect_uris: [REDIRECT],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      scope: "mcp:tools",
    });
  });

  it("keeps a client secret if the server issues one anyway", async () => {
    fetchMock.mockResolvedValueOnce(json({ client_id: "c", client_secret: "s" }, 201));
    expect(await registerClient(METADATA.registration_endpoint, REDIRECT, "mcp:tools")).toEqual({ clientId: "c", clientSecret: "s" });
  });

  it("explains a rejected redirect address in plain words", async () => {
    fetchMock.mockResolvedValueOnce(json({ error: "invalid_redirect_uri" }, 400));
    await expect(registerClient(METADATA.registration_endpoint, REDIRECT, "mcp:tools")).rejects.toThrow(
      /did not accept the redirect address .*approved by Swiggy, or http:\/\/localhost/
    );
  });

  it("reports other refusals with the status and the server's reason", async () => {
    fetchMock.mockResolvedValueOnce(json({ error: "invalid_client_metadata", error_description: "scope not allowed" }, 400));
    const err = await registerClient(METADATA.registration_endpoint, REDIRECT, "x").catch((e) => e);
    expect(err).toBeInstanceOf(OAuthRegistrationError);
    expect(err.message).toBe("Instamart client registration failed (400): scope not allowed");
  });

  it("fails clearly when no client id comes back or the service is unreachable", async () => {
    fetchMock.mockResolvedValueOnce(json({}, 201));
    await expect(registerClient(METADATA.registration_endpoint, REDIRECT, "mcp:tools")).rejects.toThrow(/did not return a client id/);
    fetchMock.mockRejectedValueOnce(new Error("timeout"));
    await expect(registerClient(METADATA.registration_endpoint, REDIRECT, "mcp:tools")).rejects.toThrow(/Could not reach/);
  });
});

describe("modes", () => {
  it("registers Instamart clients by default and never Zepto's", () => {
    expect(isDynamicRegistration("instamart")).toBe(true);
    expect(isDynamicRegistration("zepto")).toBe(false);
  });

  it("uses a fixed client instead when INSTAMART_CLIENT_ID is set", async () => {
    vi.stubEnv("INSTAMART_CLIENT_ID", "fixed-id");
    vi.stubEnv("INSTAMART_OAUTH_AUTHORIZE_URL", "https://a.example/authorize");
    vi.stubEnv("INSTAMART_OAUTH_TOKEN_URL", "https://a.example/token");
    expect(isDynamicRegistration("instamart")).toBe(false);
    const config = await resolveOAuthConfig("instamart");
    expect(config).toMatchObject({ clientId: "fixed-id", tokenFormat: "form", dynamic: false });
    expect(fetchMock).not.toHaveBeenCalled();
    await expect(registerOAuthClient("instamart")).rejects.toThrow(/does not use dynamic/);
  });

  it("registers a client against the discovered endpoint", async () => {
    fetchMock.mockResolvedValueOnce(json(METADATA)).mockResolvedValueOnce(json({ client_id: "dyn-1" }, 201));
    const client = await registerOAuthClient("instamart");
    expect(client.clientId).toBe("dyn-1");
    expect(fetchMock.mock.calls[1][0]).toBe(METADATA.registration_endpoint);
    expect(sentBody(1).redirect_uris).toEqual([REDIRECT]);
    expect(sentBody(1).scope).toBe("mcp:tools");
  });

  it("builds the dynamic config around the registered client, with JSON tokens and the mcp:tools scope", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json(METADATA)));
    const config = await resolveOAuthConfig("instamart", { clientId: "dyn-1" });
    expect(config).toMatchObject({
      authorizeUrl: METADATA.authorization_endpoint,
      tokenUrl: METADATA.token_endpoint,
      clientId: "dyn-1",
      redirectUri: REDIRECT,
      scope: "mcp:tools",
      tokenFormat: "json",
      dynamic: true,
    });
  });

  it("refuses to continue a dynamic sign-in without the client that started it", async () => {
    await expect(resolveOAuthConfig("instamart")).rejects.toThrow(/connect again/);
  });

  it("needs the redirect address, because Swiggy matches it exactly", async () => {
    vi.stubEnv("INSTAMART_REDIRECT_URI", "");
    fetchMock.mockImplementation(() => Promise.resolve(json(METADATA)));
    await expect(registerOAuthClient("instamart")).rejects.toThrow(/INSTAMART_REDIRECT_URI/);
  });

  it("treats the blank values of a copied .env.example as unset", async () => {
    vi.stubEnv("INSTAMART_OAUTH_SCOPE", "");
    vi.stubEnv("INSTAMART_OAUTH_AUTHORIZE_URL", "");
    vi.stubEnv("INSTAMART_OAUTH_TOKEN_URL", "");
    vi.stubEnv("INSTAMART_MCP_URL", "");
    fetchMock.mockImplementation(() => Promise.resolve(json(METADATA)));
    const config = await resolveOAuthConfig("instamart", { clientId: "dyn-1" });
    expect(config).toMatchObject({ authorizeUrl: METADATA.authorization_endpoint, tokenUrl: METADATA.token_endpoint, scope: "mcp:tools" });
    expect(config.mcpEndpoint).toBe("https://mcp.swiggy.com/im");
  });

  it("sends the person to the discovered authorize URL with PKCE and the scope", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json(METADATA)));
    const config = await resolveOAuthConfig("instamart", { clientId: "dyn-1" });
    const url = new URL(buildAuthorizeUrl(config, "state-1", "challenge-1"));
    expect(url.origin + url.pathname).toBe(METADATA.authorization_endpoint);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      response_type: "code",
      client_id: "dyn-1",
      redirect_uri: REDIRECT,
      code_challenge: "challenge-1",
      code_challenge_method: "S256",
      state: "state-1",
      scope: "mcp:tools",
    });
  });
});

describe("Instamart token requests (JSON)", () => {
  const config = () => resolveOAuthConfig("instamart", { clientId: "dyn-1" });

  beforeEach(() => fetchMock.mockResolvedValueOnce(json(METADATA)));

  it("exchanges the code with the JSON body Swiggy documents", async () => {
    const cfg = await config();
    fetchMock.mockResolvedValueOnce(json({ access_token: "a", refresh_token: "r", expires_in: 432000 }));
    const tokens = await exchangeCodeForToken(cfg, "code-1", "verifier-1");

    expect(tokens.access_token).toBe("a");
    const [url, init] = fetchMock.mock.calls[1];
    expect(url).toBe(METADATA.token_endpoint);
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({
      grant_type: "authorization_code",
      code: "code-1",
      redirect_uri: REDIRECT,
      code_verifier: "verifier-1",
    });
  });

  it("refreshes with the refresh token only and returns the rotated one", async () => {
    const cfg = await config();
    fetchMock.mockResolvedValueOnce(json({ access_token: "a2", refresh_token: "r2", expires_in: 2592000 }));
    const tokens = await refreshAccessToken(cfg, "r1", [0]);

    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ grant_type: "refresh_token", refresh_token: "r1" });
    expect(tokens.refresh_token).toBe("r2");
  });

  it("retries a server error and then succeeds", async () => {
    const cfg = await config();
    fetchMock
      .mockResolvedValueOnce(json({ error: "server_error" }, 500))
      .mockResolvedValueOnce(json({ error: "server_error" }, 503))
      .mockResolvedValueOnce(json({ access_token: "a3", refresh_token: "r3" }));
    const tokens = await refreshAccessToken(cfg, "r2", [0, 0]);
    expect(tokens.access_token).toBe("a3");
    expect(fetchMock).toHaveBeenCalledTimes(4); // discovery + 3 token requests
  });

  it("gives up on a persistent server error, and marks it as transient", async () => {
    const cfg = await config();
    fetchMock.mockImplementation(() => Promise.resolve(json({ error: "server_error" }, 500)));
    const err = await refreshAccessToken(cfg, "r", [0, 0]).catch((e) => e);
    expect(err).toBeInstanceOf(OAuthTokenError);
    expect(err.transient).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(4); // discovery + first try + 2 retries
  });

  it("does not retry invalid_grant, which means the person has to connect again", async () => {
    const cfg = await config();
    fetchMock.mockResolvedValueOnce(json({ error: "invalid_grant" }, 400));
    const err = await refreshAccessToken(cfg, "dead", [0, 0]).catch((e) => e);
    expect(err).toBeInstanceOf(OAuthTokenError);
    expect(err).toMatchObject({ status: 400, code: "invalid_grant", transient: false });
    expect(fetchMock).toHaveBeenCalledTimes(2); // discovery + one attempt
  });
});

describe("static clients are unchanged (Zepto)", () => {
  beforeEach(() => {
    vi.stubEnv("ZEPTO_OAUTH_AUTHORIZE_URL", "https://zepto.example/authorize");
    vi.stubEnv("ZEPTO_OAUTH_TOKEN_URL", "https://zepto.example/token");
    vi.stubEnv("ZEPTO_CLIENT_ID", "zepto-id");
    vi.stubEnv("ZEPTO_CLIENT_SECRET", "zepto-secret");
    vi.stubEnv("ZEPTO_REDIRECT_URI", "https://freshplate.example/api/auth/zepto/callback");
  });

  it("reads Zepto's config from env, form-encoded, without discovery", async () => {
    expect(getOAuthConfig("zepto")).toMatchObject({ clientId: "zepto-id", tokenFormat: "form", dynamic: false, scope: "tools:read tools:write" });
    await resolveOAuthConfig("zepto");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("exchanges and refreshes with form bodies that include the client id and secret", async () => {
    const config = getOAuthConfig("zepto");
    fetchMock.mockImplementation(() => Promise.resolve(json({ access_token: "a", refresh_token: "r" })));

    await exchangeCodeForToken(config, "code-1", "verifier-1");
    const exchange = fetchMock.mock.calls[0][1];
    expect(exchange.headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
    expect(Object.fromEntries(exchange.body as URLSearchParams)).toEqual({
      grant_type: "authorization_code",
      code: "code-1",
      redirect_uri: "https://freshplate.example/api/auth/zepto/callback",
      client_id: "zepto-id",
      code_verifier: "verifier-1",
      client_secret: "zepto-secret",
    });

    await refreshAccessToken(config, "r1");
    expect(Object.fromEntries(fetchMock.mock.calls[1][1].body as URLSearchParams)).toEqual({
      grant_type: "refresh_token",
      refresh_token: "r1",
      client_id: "zepto-id",
      client_secret: "zepto-secret",
    });
  });

  it("does not retry a failed Zepto refresh", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json({ error: "server_error" }, 500)));
    await expect(refreshAccessToken(getOAuthConfig("zepto"), "r1")).rejects.toThrow(/OAuth token request failed \(500\)/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
