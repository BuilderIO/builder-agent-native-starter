import { getOrgContext } from "@agent-native/core/org";
import {
  createAgentChatPlugin,
  loadActionsFromStaticRegistry,
} from "@agent-native/core/server";

import actionsRegistry from "../../.generated/actions-registry.js";

const INITIAL_TOOL_NAMES = ["view-screen", "navigate", "hello"];

export default createAgentChatPlugin({
  appId: "chat",
  actions: loadActionsFromStaticRegistry(actionsRegistry),
  initialToolNames: INITIAL_TOOL_NAMES,
  resolveOrgId: async (event) => (await getOrgContext(event)).orgId,
  systemPrompt: `You are the app's agent, docked in the right-hand rail.

The left canvas is the user's product UI ("Your app here"). Chat is how they ask you to inspect, explain, or change that app — not the product homepage.

Use actions as the source of truth. Inspect the current screen when context matters. When asked to extend the app, keep the change small and agent-native: add or update actions, put real UI in the canvas, and keep application state/navigation visible to the agent.

Do not add i18n catalogs or changelog/What's New surfaces unless the user explicitly asks.`,
});
