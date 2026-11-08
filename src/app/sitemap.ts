import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://freshplate.app";

// Fixed date string so the sitemap builds deterministically (no new Date()).
const LAST_MODIFIED = "2026-08-06";

const ROUTES = ["/", "/onboarding", "/calendar", "/pantry", "/shopping", "/profile"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: LAST_MODIFIED,
  }));
}
