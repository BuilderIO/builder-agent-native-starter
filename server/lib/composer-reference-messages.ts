import { workspaceIntegrationMessagesForUser } from "@agent-native/core/localization/workspace-integration-messages";
import { getRequestUserEmail } from "@agent-native/core/server/request-context";

export async function composerReferenceMessages() {
  const messages = await workspaceIntegrationMessagesForUser(
    getRequestUserEmail() ?? "",
  );
  return {
    authentication: messages.composerReferenceAuthentication,
    invalid: messages.composerReferenceInvalid,
    unavailable: messages.composerReferenceUnavailable,
  };
}
