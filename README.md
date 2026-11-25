# Ody MCP

Hosted [Model Context Protocol](https://modelcontextprotocol.io) server for
[Ody](https://ody.co) — the shared AI business phone. Connect Cursor, Claude
Code, VS Code, or any MCP client and work the inbox, texts, numbers, Astra,
and knowledge base with an API key.

| | |
| --- | --- |
| **Server URL** | `https://api.ody.co/v1/mcp` |
| **Transport** | Streamable HTTP |
| **Auth** | `Authorization: Bearer ody_live_…` or `ody_test_…` |
| **Docs** | [dev.ody.co/mcp](https://dev.ody.co/mcp/overview) |
| **Registry** | `co.ody/ody` |

Create a key in **[Build → API keys](https://app.ody.co/build/api-keys)**. Use a
**test key** for a first try (sends are simulated).

## Install in Cursor

### Marketplace / plugin (recommended)

Once the listing is live, run:

```text
/add-plugin ody
```

Or install from this repo: Cursor Settings → Plugins → add
`https://github.com/CosmicHero2/ody-mcp`, then set **ODY_API_KEY** under
Plugins → Configure.

### Manual `mcp.json`

```json
{
  "mcpServers": {
    "ody": {
      "url": "https://api.ody.co/v1/mcp",
      "headers": {
        "Authorization": "Bearer ${env:ODY_API_KEY}"
      }
    }
  }
}
```

Put that in `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global), export
`ODY_API_KEY`, and check for a green **ody** dot under Settings → MCP.

## Other clients

```bash
# Claude Code
claude mcp add --transport http ody https://api.ody.co/v1/mcp \
  --header "Authorization: Bearer $ODY_API_KEY"
```

VS Code, Claude Desktop (`mcp-remote`), OpenAI Responses API, and Anthropic's
Messages API connector are covered in
[Connect a client](https://dev.ody.co/mcp/connect).

> Claude.ai and ChatGPT **web** custom connectors expect OAuth. Ody MCP uses
> API keys today, so use Cursor / Claude Code / Desktop / VS Code until OAuth
> ships.

## What the assistant can do

41 tools (filtered by the key's scopes), including:

- Inbox: list / get conversations, search messages, set status, wait for a reply
- SMS: send texts (simulated on test keys)
- Contacts CRUD
- Numbers, buy, 10DLC status and registration
- Astra AI agent configure + connect to a number; place outbound AI calls
- Knowledge base read/write for what Astra answers from

Full schemas: [Tool reference](https://dev.ody.co/mcp/tools).

## This repository

Public packaging for directories (the server itself runs on
`api.ody.co`). Layout:

| Path | Purpose |
| --- | --- |
| `mcp.json` / `.mcp.json` | Cursor / Open Plugins MCP config |
| `.cursor-plugin/plugin.json` | Cursor Marketplace plugin manifest |
| `skills/ody-business-phone/` | Agent skill for using the tools safely |
| `server.json` | Official MCP Registry metadata (`co.ody/ody`) |
| `assets/logo.png` | Listing logo |

The plugin is free to install. You need an Ody account and API key to use the
server (7-day free trial on every plan).

## Glama / Docker

Open-source packaging for [Glama](https://glama.ai/mcp/servers/CosmicHero2/ody-mcp) health checks:

```bash
docker build -t ody-mcp .
docker run -i --rm -e ODY_API_KEY=ody_test_… ody-mcp
```

Without `ODY_API_KEY` the bridge still starts and answers `initialize` / `tools/list` (one configure tip tool). Prefer the hosted URL for real clients.

## License

MIT — see [LICENSE](./LICENSE).
