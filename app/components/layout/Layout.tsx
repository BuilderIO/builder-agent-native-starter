import { HeaderActionsProvider } from "./HeaderActions";
import { useAgentSidebarHidden } from "./AgentSidebarVisibility";
import { AgentSidebar, AgentToggleButton } from "@agent-native/core/client";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const sidebarHidden = useAgentSidebarHidden();

  if (sidebarHidden) {
    return (
      <HeaderActionsProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </HeaderActionsProvider>
    );
  }

  return (
    <HeaderActionsProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AgentSidebar
          position="right"
          defaultOpen
          emptyStateText="What should this app become?"
          suggestions={[
            "Turn this into a CRM",
            "Add a dashboard for weekly metrics",
            "Create a habit tracker",
          ]}
        >
          <div className="flex h-full flex-1 flex-col overflow-hidden">
            {/* <div className="flex h-12 shrink-0 items-center justify-end border-b border-border px-3">
              <AgentToggleButton />
            </div> */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </AgentSidebar>
      </div>
    </HeaderActionsProvider>
  );
}
