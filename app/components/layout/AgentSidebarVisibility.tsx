import { useEffect, useSyncExternalStore } from "react";

/**
 * External store (see HeaderActions.tsx for the same pattern) so pages can
 * hide the agent sidebar without <Layout> re-rendering on every subscriber
 * update.
 */

type Listener = () => void;

let hidden = false;
const listeners = new Set<Listener>();

function notify() {
  for (const l of listeners) l();
}

function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** Consumed only by <Layout /> — returns whether the agent sidebar should render. */
export function useAgentSidebarHidden(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hidden,
    () => hidden,
  );
}

/** Call from a page to hide the agent sidebar while it's mounted. */
export function useHideAgentSidebar() {
  useEffect(() => {
    hidden = true;
    notify();
    return () => {
      hidden = false;
      notify();
    };
  });
}
