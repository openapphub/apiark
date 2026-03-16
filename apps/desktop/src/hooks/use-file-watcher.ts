import { useEffect, useRef } from "react";
import { useTabStore, wasRecentlySaved } from "@/stores/tab-store";
import { useCollectionStore } from "@/stores/collection-store";
import type { FileChangeEvent } from "@apiark/types";

/**
 * Listens for `watcher:file-changed` Tauri events and:
 * - Refreshes the collection tree for created/deleted files
 * - Auto-reloads clean open tabs on external modification
 * - Sets conflict state on dirty open tabs on external modification
 * - Ignores changes triggered by our own save/autoSave
 */
export function useFileWatcher() {
  const listenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        const { listen } = await import("@tauri-apps/api/event");
        const unlisten = await listen<FileChangeEvent>(
          "watcher:file-changed",
          async (event) => {
            if (cancelled) return;
            const { path, changeType, collectionPath } = event.payload;

            // Refresh collection tree for structural changes
            if (changeType === "created" || changeType === "deleted") {
              useCollectionStore.getState().refreshCollection(collectionPath);
            }

            // Ignore file changes triggered by our own save/autoSave
            if (wasRecentlySaved(path)) {
              return;
            }

            // Handle open tab conflicts
            const store = useTabStore.getState();
            const affectedTab = store.tabs.find((t) => t.filePath === path);

            if (!affectedTab) {
              // File not open — if modified, refresh tree in case name/method changed
              if (changeType === "modified") {
                useCollectionStore.getState().refreshCollection(collectionPath);
              }
              return;
            }

            if (changeType === "deleted") {
              store.handleExternalChange(path, "deleted");
              return;
            }

            if (changeType === "modified") {
              if (affectedTab.isDirty) {
                // Dirty tab: show conflict banner
                store.handleExternalChange(path, "modified");
              } else {
                // Clean tab: auto-reload
                store.reloadFromDisk(affectedTab.id);
              }
            }
          },
        );
        listenerRef.current = unlisten;
      } catch {
        // Not running in Tauri environment
      }
    }

    setup();

    return () => {
      cancelled = true;
      listenerRef.current?.();
    };
  }, []);
}
