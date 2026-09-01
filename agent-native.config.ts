import { defineAgentNativeConfig } from "@agent-native/core/config";

export default defineAgentNativeConfig({
  harness: true,
  onboarding: { firstRun: "off" },
});
