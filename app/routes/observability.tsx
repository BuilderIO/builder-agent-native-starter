import { ObservabilityDashboard } from "@agent-native/core/client/observability";
import { useSetPageTitle } from "@/components/layout/HeaderActions";

export function meta() {
  return [{ title: "Agent Observability" }];
}

export default function ObservabilityPage() {
  useSetPageTitle("Observability");
  return (
    <div className="p-6">
      <ObservabilityDashboard />
    </div>
  );
}
