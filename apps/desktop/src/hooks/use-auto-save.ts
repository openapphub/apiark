import { useEffect, useRef } from "react";
import { useTabStore } from "@/stores/tab-store";

/**
 * Auto-save hook: debounces saving the active tab 1 second after changes.
 * Only saves file-backed tabs (those with a filePath).
 * Returns the last auto-save error (if any) for display in a banner.
 */
export function useAutoSave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveError = useTabStore((s) => s.autoSaveError);

  useEffect(() => {
    // Subscribe to store changes and auto-save dirty file-backed tabs
    const unsubscribe = useTabStore.subscribe((state, prevState) => {
      const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
      const prevActiveTab = prevState.tabs.find((t) => t.id === prevState.activeTabId);

      // Only trigger auto-save if the active tab became dirty and is file-backed
      if (
        activeTab &&
        activeTab.filePath &&
        activeTab.isDirty &&
        // Check if this is a new dirty state (wasn't dirty before, or content changed)
        (!prevActiveTab || !prevActiveTab.isDirty || activeTab !== prevActiveTab)
      ) {
        // Clear previous timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // Debounce 1 second
        timerRef.current = setTimeout(() => {
          useTabStore.getState().autoSave();
        }, 1000);
      }
    });

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { autoSaveError };
}
