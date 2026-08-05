import { NextResponse } from "next/server";
import { clearPlatformSession } from "@/lib/mcp/session";
import { isPlatform } from "@/lib/mcp/registry";

export async function POST(_request: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!isPlatform(platform)) {
    return NextResponse.json({ error: `Unknown platform "${platform}"` }, { status: 404 });
  }
  await clearPlatformSession(platform);
  return NextResponse.json({ ok: true });
}
