---
name: ody-business-phone
description: >-
  Use the Ody MCP server to work a shared business phone workspace: read the
  inbox, send SMS/MMS, manage contacts and numbers, configure the Astra AI
  agent, and maintain the knowledge base. Use when the user mentions Ody,
  business SMS, the shared inbox, Astra, 10DLC, or a workspace phone number.
---

# Ody business phone

Ody is a shared workspace phone (calls + SMS) with manageable AI agents. The
hosted MCP server is at `https://api.ody.co/v1/mcp` and authenticates with an
Ody API key (`ody_live_…` or `ody_test_…`).

## Before you call tools

1. Confirm the Ody MCP server is connected (green in Cursor Settings → MCP).
2. Prefer a **test key** (`ody_test_…`) when rehearsing: sends, purchases and
   calls are simulated and nothing reaches the carrier.
3. For production assistants, use a live key scoped to only the tools needed
   (see [scopes](https://dev.ody.co/get-started/scopes)).

## Typical flows

| Goal | Start with |
| --- | --- |
| Orient in a workspace | `workspace_summary` |
| Read open conversations | `list_conversations` then `get_conversation` |
| Reply by SMS | `send_message` (id or E.164 recipient) |
| Wait for a reply | `wait_for_message` (long-polls up to ~25s) |
| Find someone | `list_contacts` / `create_contact` |
| Numbers and 10DLC | `list_numbers`, `search_numbers`, `buy_number`, `get_messaging_status` |
| Configure Astra | `get_agent`, `configure_agent`, `connect_agent_to_number` |
| Knowledge base | `search_knowledge`, then write tools only when asked |

## Safety

- Tools carry MCP annotations (`readOnlyHint`, `destructiveHint`, `openWorldHint`).
  Auto-run reads; confirm before writes that spend money or message a person.
- `buy_number`, `submit_10dlc_registration`, `place_call`, and live
  `send_message` have real-world effects on a live key.
- Enabling AI call recording requires an explicit consent acknowledgement the
  first time (`acknowledgeConsent: true`).
- Full guide: [Connect a client](https://dev.ody.co/mcp/connect) and
  [Safety](https://dev.ody.co/mcp/safety).

## Docs

- Overview: https://dev.ody.co/mcp/overview
- Tool reference: https://dev.ody.co/mcp/tools
- Create a key: https://app.ody.co/build/api-keys
