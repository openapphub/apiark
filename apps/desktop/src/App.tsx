import { useEffect, useState, useCallback, useRef } from "react";
import { CollectionSidebar } from "@/components/collection/collection-sidebar";
import { TabBar } from "@/components/tabs/tab-bar";
import { UrlBar } from "@/components/request/url-bar";
import { RequestPanel } from "@/components/request/request-panel";
import { ResponsePanel } from "@/components/response/response-panel";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { CurlImportDialog } from "@/components/request/curl-import-dialog";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { GraphQLView } from "@/components/graphql/graphql-view";
import { WebSocketView } from "@/components/websocket/websocket-view";
import { SSEView } from "@/components/sse/sse-view";
import { CollectionRunnerDialog } from "@/components/runner/collection-runner-dialog";
import { ImportDialog } from "@/components/import/import-dialog";
import type { TabProtocol } from "@apiark/types";
import { useTabStore, useActiveTab } from "@/stores/tab-store";
import { useHistoryStore } from "@/stores/history-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/hooks/use-theme";
import { useAutoSave } from "@/hooks/use-auto-save";
import { WelcomeScreen } from "@/components/onboarding/welcome-screen";
import { GuidedTour } from "@/components/onboarding/guided-tour";
import { AlertCircle, X } from "lucide-react";

function App() {
  const { newTab, closeTab, save, send, persistTabs, restoreTabs } = useTabStore();
  const activeTab = useActiveTab();
  const tabs = useTabStore((s) => s.tabs);
  const activeTabId = useTabStore((s) => s.activeTabId);
  const { loadSettings } = useSettingsStore();
  const settingsLoaded = useSettingsStore((s) => s.loaded);
  const onboardingComplete = useSettingsStore((s) => s.settings.onboardingComplete);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [curlImportOpen, setCurlImportOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [runnerOpen, setRunnerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const urlBarRef = useRef<HTMLInputElement>(null);
  const envSelectorRef = useRef<HTMLSelectElement>(null);

  useTheme();
  const { autoSaveError } = useAutoSave();

  // Load settings and restore tabs on mount
  useEffect(() => {
    loadSettings();
    restoreTabs();
  }, [loadSettings, restoreTabs]);

  // Show welcome screen on first run
  useEffect(() => {
    if (settingsLoaded && !onboardingComplete) {
      setShowWelcome(true);
    }
  }, [settingsLoaded, onboardingComplete]);

  // Persist tabs on change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => persistTabs(), 500);
    return () => clearTimeout(timer);
  }, [tabs, activeTabId, persistTabs]);

  // Persist tabs on window close — warn about unsaved new tabs
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      persistTabs();
      if (useTabStore.getState().hasUnsavedNewTabs()) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [persistTabs]);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const openCurlImport = useCallback(() => setCurlImportOpen(true), []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      switch (e.key.toLowerCase()) {
        case "n":
        case "t":
          e.preventDefault();
          newTab();
          break;
        case "w":
          e.preventDefault();
          if (activeTab) closeTab(activeTab.id);
          break;
        case "s":
          e.preventDefault();
          save();
          break;
        case ",":
          e.preventDefault();
          setSettingsOpen(true);
          break;
        case "i":
          e.preventDefault();
          setCurlImportOpen(true);
          break;
        case "k":
          e.preventDefault();
          setCommandPaletteOpen(true);
          break;
        case "e":
          e.preventDefault();
          envSelectorRef.current?.focus();
          break;
        case "l":
          e.preventDefault();
          urlBarRef.current?.focus();
          break;
        case "\\":
          e.preventDefault();
          setSidebarCollapsed((prev) => !prev);
          break;
        case "enter":
          e.preventDefault();
          send();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [newTab, closeTab, save, send, activeTab]);

  // Refresh history when a request completes
  useEffect(() => {
    if (activeTab && !activeTab.loading && (activeTab.response || activeTab.error)) {
      useHistoryStore.getState().loadHistory();
    }
  }, [activeTab?.loading, activeTab?.response, activeTab?.error]);

  if (showWelcome) {
    return (
      <WelcomeScreen
        onComplete={(startTour?: boolean) => {
          setShowWelcome(false);
          if (startTour) setShowTour(true);
        }}
        onOpenImport={() => {
          setShowWelcome(false);
          setImportOpen(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Auto-save error banner */}
      {autoSaveError && (
        <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">Auto-save failed: {autoSaveError}</span>
          <button
            onClick={() => useTabStore.getState().autoSave()}
            className="rounded bg-red-500/20 px-2 py-0.5 text-xs hover:bg-red-500/30"
          >
            Retry
          </button>
          <button
            onClick={() => useTabStore.getState().clearAutoSaveError()}
            className="rounded p-0.5 hover:bg-red-500/20"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <CollectionSidebar
          onOpenSettings={openSettings}
          collapsed={sidebarCollapsed}
          envSelectorRef={envSelectorRef}
        />

        {/* Main Panel */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Tab Bar */}
          <TabBar />

          {activeTab ? (
            <ProtocolView protocol={activeTab.protocol} urlBarRef={urlBarRef} />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <CurlImportDialog open={curlImportOpen} onOpenChange={setCurlImportOpen} />
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onOpenSettings={openSettings}
        onOpenCurlImport={openCurlImport}
        onOpenRunner={() => setRunnerOpen(true)}
        onOpenImport={() => setImportOpen(true)}
      />
      <CollectionRunnerDialog open={runnerOpen} onOpenChange={setRunnerOpen} />
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
      {showTour && <GuidedTour onComplete={() => setShowTour(false)} />}
    </div>
  );
}

function ProtocolView({
  protocol,
  urlBarRef,
}: {
  protocol: TabProtocol;
  urlBarRef: React.RefObject<HTMLInputElement | null>;
}) {
  switch (protocol) {
    case "graphql":
      return <GraphQLView />;
    case "websocket":
      return <WebSocketView />;
    case "sse":
      return <SSEView />;
    default:
      return (
        <>
          <UrlBar ref={urlBarRef} />
          <div className="flex flex-1 overflow-hidden">
            <div data-tour="request-panel" className="flex w-1/2 flex-col border-r border-[var(--color-border)]">
              <RequestPanel />
            </div>
            <div data-tour="response-panel" className="flex w-1/2 flex-col">
              <ResponsePanel />
            </div>
          </div>
        </>
      );
  }
}

function EmptyState() {
  const { newTab } = useTabStore();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm text-[var(--color-text-dimmed)]">
        Open a request from the sidebar, or press{" "}
        <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-elevated)] px-1.5 py-0.5 text-xs text-[var(--color-text-secondary)]">
          Ctrl+N
        </kbd>{" "}
        to create one
      </p>
      <button
        onClick={newTab}
        className="rounded bg-[var(--color-elevated)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)]"
      >
        New Request
      </button>
    </div>
  );
}

export default App;
