import { getOrgContext } from "@agent-native/core/org";
import {
  createAgentChatPlugin,
  loadActionsFromStaticRegistry,
} from "@agent-native/core/server";

import actionsRegistry from "../../.generated/actions-registry.js";

const INITIAL_TOOL_NAMES = ["view-screen", "navigate", "hello"];

export default createAgentChatPlugin({
  appId: "app",
  actions: loadActionsFromStaticRegistry(actionsRegistry),
  initialToolNames: INITIAL_TOOL_NAMES,
  resolveOrgId: async (event) => (await getOrgContext(event)).orgId,
  systemPrompt: `You are this app's agent. Help the user inspect, explain, and extend the app.

Use actions as the source of truth. Inspect the current screen when context matters. When asked to extend the app, keep the change small and agent-native: add or update actions, put real product UI on the page, and keep application state and navigation visible to the agent.

Do not add i18n catalogs or changelog/What's New surfaces unless the user explicitly asks.`,
});
