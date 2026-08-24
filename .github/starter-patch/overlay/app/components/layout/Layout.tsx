import { AgentSidebar, focusAgentChat } from "@agent-native/core/client/agent-chat";
import { HeaderActionsProvider } from "@agent-native/toolkit/app-shell";

import { TAB_ID } from "@/lib/tab-id";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Fusion-facing shell: blank app canvas on the left, always-open agent rail
 * on the right. Hidden settings/agent routes still render in the canvas.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <HeaderActionsProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AgentSidebar
          position="right"
          defaultOpen
          chatViewTransition
          storageKey="chat"
          browserTabId={TAB_ID}
          agentPageHref="/settings/agent"
          onFullscreenRequest={() => focusAgentChat()}
          emptyStateText="Your agent here"
          suggestions={[
            "What can this app do?",
            "Help me build the first screen",
            "Show available actions",
          ]}
        >
          <main className="agent-native-app-main min-w-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </main>
        </AgentSidebar>
      </div>
    </HeaderActionsProvider>
  );
}
