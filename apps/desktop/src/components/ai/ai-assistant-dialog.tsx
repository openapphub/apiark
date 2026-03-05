import { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { useTabStore } from "@/stores/tab-store";
import {
  aiGenerateRequest,
  aiGenerateTests,
  type AiGeneratedRequest,
  type AiGeneratedTests,
} from "@/lib/tauri-api";
import type { HttpMethod, KeyValuePair } from "@apiark/types";

interface AiAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AiMode = "generate-request" | "generate-tests";

export function AiAssistantDialog({ open, onOpenChange }: AiAssistantDialogProps) {
  const { settings } = useSettingsStore();
  const [mode, setMode] = useState<AiMode>("generate-request");
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRequest, setGeneratedRequest] = useState<AiGeneratedRequest | null>(null);
  const [generatedTests, setGeneratedTests] = useState<AiGeneratedTests | null>(null);

  const isConfigured = settings.aiEndpoint && settings.aiApiKey;

  const getAiParams = useCallback(() => ({
    prompt,
    context: context || undefined,
    apiKey: settings.aiApiKey || "",
    endpoint: settings.aiEndpoint || "https://api.openai.com/v1",
    model: settings.aiModel || "gpt-4o-mini",
  }), [prompt, context, settings]);

  const handleGenerateRequest = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setGeneratedRequest(null);
    try {
      const result = await aiGenerateRequest(getAiParams());
      setGeneratedRequest(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTests = async () => {
    const activeTab = useTabStore.getState().tabs.find(
      (t) => t.id === useTabStore.getState().activeTabId
    );
    if (!activeTab?.response) {
      setError("Send a request first to generate tests from its response");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedTests(null);

    const requestYaml = [
      `name: ${activeTab.name}`,
      `method: ${activeTab.method}`,
      `url: ${activeTab.url}`,
    ].join("\n");

    try {
      const result = await aiGenerateTests(
        getAiParams(),
        requestYaml,
        activeTab.response.body,
        activeTab.response.status,
      );
      setGeneratedTests(result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const applyGeneratedRequest = () => {
    if (!generatedRequest) return;
    const store = useTabStore.getState();
    store.newTab();

    // Small delay to let the new tab create
    setTimeout(() => {
      const s = useTabStore.getState();
      const method = generatedRequest.method.toUpperCase() as HttpMethod;
      s.setMethod(method);
      s.setUrl(generatedRequest.url);

      const headers: KeyValuePair[] = Object.entries(generatedRequest.headers).map(
        ([key, value]) => ({ key, value, enabled: true })
      );
      if (headers.length > 0) s.setHeaders([...headers, { key: "", value: "", enabled: true }]);

      if (generatedRequest.body) {
        s.setBody({
          type: (generatedRequest.bodyType as "json" | "raw") || "json",
          content: generatedRequest.body,
          formData: [],
        });
      }
    }, 50);

    onOpenChange(false);
  };

  const applyGeneratedTests = () => {
    if (!generatedTests) return;
    const store = useTabStore.getState();
    if (generatedTests.tests) {
      store.setTestScript(generatedTests.tests);
    }
    if (generatedTests.assertions) {
      store.setAssertions(generatedTests.assertions);
    }
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[560px] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl focus:outline-none">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
            <Dialog.Title className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
              <Sparkles className="h-5 w-5 text-purple-400" />
              AI Assistant
            </Dialog.Title>
            <Dialog.Close className="rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-elevated)]">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-4">
            {!isConfigured ? (
              <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-400">
                <p className="font-medium mb-1">AI not configured</p>
                <p className="text-xs text-yellow-400/70">
                  Go to Settings and configure your AI endpoint, API key, and model to use the AI assistant.
                  Any OpenAI-compatible API works (OpenAI, Anthropic via proxy, Ollama, etc.).
                </p>
              </div>
            ) : (
              <>
                {/* Mode selector */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode("generate-request")}
                    className={`rounded px-3 py-1.5 text-sm ${
                      mode === "generate-request"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-[var(--color-elevated)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    Generate Request
                  </button>
                  <button
                    onClick={() => setMode("generate-tests")}
                    className={`rounded px-3 py-1.5 text-sm ${
                      mode === "generate-tests"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-[var(--color-elevated)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    Generate Tests
                  </button>
                </div>

                {/* Prompt */}
                <div>
                  <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
                    {mode === "generate-request"
                      ? "Describe the API request you want to make"
                      : "Additional instructions (optional)"}
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      mode === "generate-request"
                        ? "e.g., Create a user with name and email using the JSONPlaceholder API"
                        : "e.g., Focus on validating the response schema"
                    }
                    className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-dimmed)]"
                    rows={3}
                  />
                </div>

                {mode === "generate-request" && (
                  <div>
                    <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">
                      API context (optional)
                    </label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Paste API docs, base URL, or any context..."
                      className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-dimmed)]"
                      rows={2}
                    />
                  </div>
                )}

                {/* Action button */}
                <button
                  onClick={mode === "generate-request" ? handleGenerateRequest : handleGenerateTests}
                  disabled={loading || (mode === "generate-request" && !prompt.trim())}
                  className="flex items-center gap-2 rounded bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {loading ? "Generating..." : "Generate"}
                </button>

                {/* Error */}
                {error && (
                  <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                    {error}
                  </div>
                )}

                {/* Generated request result */}
                {generatedRequest && (
                  <div className="space-y-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
                        Generated Request
                      </h4>
                      <button
                        onClick={applyGeneratedRequest}
                        className="flex items-center gap-1 rounded bg-purple-500 px-3 py-1 text-xs text-white hover:bg-purple-600"
                      >
                        Apply <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p><span className="text-[var(--color-text-muted)]">Name:</span> {generatedRequest.name}</p>
                      <p><span className="text-[var(--color-text-muted)]">Method:</span> <span className="font-bold">{generatedRequest.method}</span></p>
                      <p><span className="text-[var(--color-text-muted)]">URL:</span> {generatedRequest.url}</p>
                      {Object.keys(generatedRequest.headers).length > 0 && (
                        <p><span className="text-[var(--color-text-muted)]">Headers:</span> {Object.entries(generatedRequest.headers).map(([k, v]) => `${k}: ${v}`).join(", ")}</p>
                      )}
                      {generatedRequest.body && (
                        <pre className="mt-1 max-h-[200px] overflow-auto rounded bg-[var(--color-elevated)] p-2 text-[var(--color-text-secondary)]">
                          {generatedRequest.body}
                        </pre>
                      )}
                    </div>
                  </div>
                )}

                {/* Generated tests result */}
                {generatedTests && (
                  <div className="space-y-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
                        Generated Tests
                      </h4>
                      <button
                        onClick={applyGeneratedTests}
                        className="flex items-center gap-1 rounded bg-purple-500 px-3 py-1 text-xs text-white hover:bg-purple-600"
                      >
                        Apply <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                    <pre className="max-h-[300px] overflow-auto rounded bg-[var(--color-elevated)] p-2 text-xs text-[var(--color-text-secondary)]">
                      {generatedTests.tests}
                    </pre>
                    {generatedTests.assertions && (
                      <>
                        <h5 className="text-xs font-medium text-[var(--color-text-muted)]">Assertions (YAML)</h5>
                        <pre className="max-h-[150px] overflow-auto rounded bg-[var(--color-elevated)] p-2 text-xs text-[var(--color-text-secondary)]">
                          {generatedTests.assertions}
                        </pre>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
