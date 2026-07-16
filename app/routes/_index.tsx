import { APP_TITLE } from "@/lib/app-config";
import { useHideAgentSidebar } from "@/components/layout/AgentSidebarVisibility";

export function meta() {
  return [
    { title: APP_TITLE },
    {
      name: "description",
      content:
        "Build an agent-native app where the AI agent and UI share state, actions, and context.",
    },
  ];
}

export default function IndexPage() {
  useHideAgentSidebar();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {/* TODO: FUSION_GENERATION_APP_PLACEHOLDER replace everything here with the actual app! */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <svg
            className="h-6 w-6 animate-spin text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <h1 className="text-xl font-semibold tracking-tight">
            Generating your app...
          </h1>
        </div>
        <p className="max-w-xs text-center text-sm text-muted-foreground">
          Watch the chat on the left for updates that might need your
          attention to finish generating
        </p>
      </div>
    </div>
  );
}
