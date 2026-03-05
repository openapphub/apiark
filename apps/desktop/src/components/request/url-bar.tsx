import { forwardRef, useState, useEffect, useMemo } from "react";
import { useTabStore, useActiveTab } from "@/stores/tab-store";
import { useEnvironmentStore } from "@/stores/environment-store";
import type { HttpMethod } from "@apiark/types";
import { Loader2, Send, Eye } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

const METHODS: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-green-500",
  POST: "text-yellow-500",
  PUT: "text-blue-500",
  PATCH: "text-purple-500",
  DELETE: "text-red-500",
  HEAD: "text-cyan-500",
  OPTIONS: "text-gray-500",
};

/** Extract all {{variableName}} references from a tab's fields */
function extractVariableRefs(tab: {
  url: string;
  headers: { key: string; value: string }[];
  params: { key: string; value: string }[];
  body: { content: string };
}): string[] {
  const text = [
    tab.url,
    ...tab.headers.flatMap((h) => [h.key, h.value]),
    ...tab.params.flatMap((p) => [p.key, p.value]),
    tab.body.content,
  ].join(" ");

  const matches = text.match(/\{\{([\w$]+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(2, -2)))];
}

export const UrlBar = forwardRef<HTMLInputElement>(function UrlBar(_props, ref) {
  const tab = useActiveTab();
  const { setMethod, setUrl, send } = useTabStore();
  const [resolvedVars, setResolvedVars] = useState<Record<string, string>>({});
  const [popoverOpen, setPopoverOpen] = useState(false);

  const variableRefs = useMemo(
    () => (tab ? extractVariableRefs(tab) : []),
    [tab?.url, tab?.headers, tab?.params, tab?.body.content],
  );

  // Resolve variables when popover opens
  useEffect(() => {
    if (!popoverOpen || variableRefs.length === 0) return;
    useEnvironmentStore
      .getState()
      .getResolvedVariables()
      .then(setResolvedVars)
      .catch(() => setResolvedVars({}));
  }, [popoverOpen, variableRefs]);

  if (!tab) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      send();
    }
  };

  return (
    <div data-tour="url-bar" className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
      {/* Method selector */}
      <select
        value={tab.method}
        onChange={(e) => setMethod(e.target.value as HttpMethod)}
        className={`${METHOD_COLORS[tab.method]} cursor-pointer rounded bg-[var(--color-elevated)] px-2 py-1.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-blue-500`}
      >
        {METHODS.map((m) => (
          <option key={m} value={m} className="text-[var(--color-text-primary)]">
            {m}
          </option>
        ))}
      </select>

      {/* URL input */}
      <input
        ref={ref}
        type="text"
        value={tab.url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://api.example.com/endpoint"
        className="flex-1 rounded bg-[var(--color-elevated)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-dimmed)] outline-none focus:ring-1 focus:ring-blue-500"
      />

      {/* Variable quick-view */}
      {variableRefs.length > 0 && (
        <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Popover.Trigger asChild>
            <button
              className="rounded p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-secondary)]"
              title="View resolved variables"
            >
              <Eye className="h-4 w-4" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="z-50 w-72 rounded border border-[var(--color-border)] bg-[var(--color-elevated)] p-3 shadow-lg"
              sideOffset={5}
              align="end"
            >
              <p className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">
                Variables in this request
              </p>
              <div className="space-y-1">
                {variableRefs.map((name) => {
                  const resolved = resolvedVars[name];
                  return (
                    <div key={name} className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-blue-400">{`{{${name}}}`}</span>
                      {resolved !== undefined ? (
                        <span className="truncate text-[var(--color-text-primary)]">{resolved}</span>
                      ) : (
                        <span className="italic text-red-400">unresolved</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <Popover.Arrow className="fill-[var(--color-border)]" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}

      {/* Send button */}
      <button
        data-tour="send-btn"
        onClick={send}
        disabled={tab.loading || !tab.url.trim()}
        className="flex items-center gap-1.5 rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {tab.loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Send
      </button>
    </div>
  );
});
