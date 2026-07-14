import { Link, useLocation } from "react-router";
import {
  IconActivity,
  IconHome,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ExtensionsSidebarSection } from "@agent-native/core/client/extensions";
import {
  DevDatabaseLink,
  FeedbackButton,
  appPath,
} from "@agent-native/core/client";
import { OrgSwitcher } from "@agent-native/core/client/org";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APP_TITLE } from "@/lib/app-config";

const navItems = [
  { icon: IconHome, label: "Home", href: "/" },
  { icon: IconActivity, label: "Observability", href: "/observability" },
];

interface SidebarProps {
  collapsed?: boolean;
  collapsible?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({
  collapsed = false,
  collapsible = false,
  onCollapsedChange,
}: SidebarProps) {
  const location = useLocation();

  const toggleButton = collapsible ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onCollapsedChange?.(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
        >
          {collapsed ? (
            <IconLayoutSidebarLeftExpand className="h-4 w-4" />
          ) : (
            <IconLayoutSidebarLeftCollapse className="h-4 w-4" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {collapsed ? "Expand sidebar" : "Collapse sidebar"}
      </TooltipContent>
    </Tooltip>
  ) : null;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full min-w-0 shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-150",
          collapsed ? "w-14" : "w-56",
        )}
      >
        <div
          className={cn(
            "flex h-12 shrink-0 items-center border-b border-border",
            collapsed ? "justify-center px-1" : "gap-2 px-4",
          )}
        >
          {collapsed ? (
            toggleButton
          ) : (
            <>
              <img
                src={appPath("/agent-native-icon-light.svg")}
                alt=""
                aria-hidden="true"
                className="block h-4 w-auto dark:hidden"
              />
              <img
                src={appPath("/agent-native-icon-dark.svg")}
                alt=""
                aria-hidden="true"
                className="hidden h-4 w-auto dark:block"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">
                {APP_TITLE}
              </span>
              {toggleButton}
            </>
          )}
        </div>

        <nav
          className={cn(
            "flex-1 overflow-y-auto py-2 space-y-1",
            collapsed ? "px-1" : "px-2",
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);
            const link = (
              <Link
                key={item.href}
                to={item.href}
                aria-label={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-sm transition-colors",
                  collapsed ? "h-9 w-9 justify-center" : "px-3 py-2",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
            if (!collapsed) return link;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-border px-2 py-2">
            <ExtensionsSidebarSection />
          </div>
        )}

        {!collapsed && (
          <div className="border-t border-border px-3 py-2 space-y-2">
            <DevDatabaseLink />
            <FeedbackButton />
            <OrgSwitcher />
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
