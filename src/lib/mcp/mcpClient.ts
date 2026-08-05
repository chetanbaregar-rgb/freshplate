import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export class McpToolError extends Error {
  toolName: string;
  constructor(message: string, toolName: string) {
    super(message);
    this.name = "McpToolError";
    this.toolName = toolName;
  }
}

export type ToolCaller = (toolName: string, args?: Record<string, unknown>) => Promise<unknown>;

interface TextContentPart {
  type: "text";
  text: string;
}

function isTextPart(part: unknown): part is TextContentPart {
  return !!part && typeof part === "object" && (part as { type?: unknown }).type === "text";
}

/**
 * Opens one MCP connection, hands the callback a `call(tool, args)` helper,
 * then closes. We reconnect per request rather than pooling connections since
 * Next.js route handlers are stateless per-invocation anyway, and it's the
 * only way to be certain any server-side "store selected" context the
 * platform ties to this connection is actually re-established (see
 * zeptoCommerce.ts — we re-select the saved address on every call that needs
 * store context rather than assuming it survives across connections).
 */
export async function withMcpClient<T>(
  endpoint: string,
  accessToken: string,
  fn: (call: ToolCaller) => Promise<T>
): Promise<T> {
  const transport = new StreamableHTTPClientTransport(new URL(endpoint), {
    requestInit: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const client = new Client({ name: "freshplate", version: "0.1.0" }, { capabilities: {} });
  await client.connect(transport);

  const call: ToolCaller = async (toolName, args = {}) => {
    const result = await client.callTool({ name: toolName, arguments: args });
    const content = Array.isArray(result.content) ? result.content : [];
    const textPart = content.find(isTextPart);

    let parsed: unknown = textPart?.text;
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        // Not all tool responses are JSON (e.g. plain confirmation text) — keep as-is.
      }
    }

    if (result.isError) {
      const message =
        typeof parsed === "string"
          ? parsed
          : (parsed as { message?: string } | undefined)?.message ?? `MCP tool "${toolName}" failed`;
      throw new McpToolError(message, toolName);
    }

    return parsed;
  };

  try {
    return await fn(call);
  } finally {
    await client.close();
  }
}
