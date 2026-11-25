#!/usr/bin/env node
/**
 * Stdio MCP bridge → https://api.ody.co/v1/mcp
 *
 * Used by Glama's Dockerfile health checks and by clients that only speak
 * stdio. Prefer connecting to the hosted URL directly when your client
 * supports Streamable HTTP (Cursor, Claude Code, VS Code, …).
 *
 * Env:
 *   ODY_API_KEY  – ody_live_… or ody_test_… (required for tools/list after init)
 *   ODY_MCP_URL  – override endpoint (default https://api.ody.co/v1/mcp)
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const URL = process.env.ODY_MCP_URL || "https://api.ody.co/v1/mcp";
const KEY = process.env.ODY_API_KEY || "";

async function rpc(method, params) {
  const headers = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };
  if (KEY) headers.authorization = `Bearer ${KEY}`;
  const body = { jsonrpc: "2.0", id: Date.now(), method, params };
  const res = await fetch(URL, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Ody MCP returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const msg = data?.error?.message || data?.message || text.slice(0, 200);
    throw new Error(`Ody MCP HTTP ${res.status}: ${msg}`);
  }
  if (data.error) {
    throw new Error(data.error.message || JSON.stringify(data.error));
  }
  return data.result;
}

const server = new Server(
  { name: "ody", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  if (!KEY) {
    return {
      tools: [
        {
          name: "configure_ody_api_key",
          description:
            "Set the ODY_API_KEY environment variable (ody_live_… or ody_test_…) and restart. Create a key at https://app.ody.co/build/api-keys. Prefer connecting directly to https://api.ody.co/v1/mcp over Streamable HTTP.",
          inputSchema: { type: "object", properties: {} },
        },
      ],
    };
  }
  const result = await rpc("tools/list", {});
  return { tools: result.tools || [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  if (!KEY) {
    return {
      content: [
        {
          type: "text",
          text: "Missing ODY_API_KEY. Create a key at https://app.ody.co/build/api-keys and set it in the environment, or connect your client to https://api.ody.co/v1/mcp with Authorization: Bearer <key>.",
        },
      ],
      isError: true,
    };
  }
  const result = await rpc("tools/call", {
    name,
    arguments: request.params.arguments || {},
  });
  return result;
});

const transport = new StdioServerTransport();
await server.connect(transport);
