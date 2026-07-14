import { HeaderActionsProvider } from "./HeaderActions";
import { AgentSidebar } from "@agent-native/core/client";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <HeaderActionsProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <AgentSidebar
          position="right"
          emptyStateText="What should this app become?"
          suggestions={[
            "Turn this into a CRM",
            "Add a dashboard for weekly metrics",
            "Create a habit tracker",
          ]}
        >
          <div className="flex h-full flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </AgentSidebar>
      </div>
    </HeaderActionsProvider>
  );
}
