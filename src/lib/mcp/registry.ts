import type { Platform } from "@/lib/types";
import type { CommerceModule } from "./commerceTypes";
import { zeptoCommerce } from "./zeptoCommerce";
import { instamartCommerce } from "./instamartCommerce";

export function getCommerceModule(platform: Platform): CommerceModule {
  return platform === "zepto" ? zeptoCommerce : instamartCommerce;
}

/** Deliberately independent of getOAuthConfig() — the MCP endpoint has a
 *  sensible default and shouldn't require full OAuth env config to resolve. */
export function getMcpEndpoint(platform: Platform): string {
  return platform === "zepto"
    ? process.env.ZEPTO_MCP_URL ?? "https://mcp.zepto.co.in/mcp"
    : process.env.INSTAMART_MCP_URL ?? "https://mcp.swiggy.com/im";
}

export function isPlatform(value: string): value is Platform {
  return value === "zepto" || value === "instamart";
}
