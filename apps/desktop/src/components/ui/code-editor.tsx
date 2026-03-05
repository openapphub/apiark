import { useRef, useCallback, useEffect } from "react";
import Editor, { type OnMount, loader } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useSettingsStore } from "@/stores/settings-store";

// Configure Monaco to use local bundled files (not CDN) for Tauri offline support
loader.config({
  paths: {
    vs: "/node_modules/monaco-editor/min/vs",
  },
});

// ApiArk dark theme definition
const APIARK_DARK_THEME: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6b7280", fontStyle: "italic" },
    { token: "keyword", foreground: "c084fc" },
    { token: "string", foreground: "86efac" },
    { token: "number", foreground: "fbbf24" },
    { token: "type", foreground: "60a5fa" },
  ],
  colors: {
    "editor.background": "#141416",
    "editor.foreground": "#e4e4e7",
    "editor.lineHighlightBackground": "#1c1c1f",
    "editor.selectionBackground": "#3b82f640",
    "editorCursor.foreground": "#3b82f6",
    "editorLineNumber.foreground": "#52525b",
    "editorLineNumber.activeForeground": "#a1a1aa",
    "editor.inactiveSelectionBackground": "#3b82f620",
    "editorIndentGuide.background": "#2a2a2e",
    "editorWidget.background": "#1c1c1f",
    "editorWidget.border": "#2a2a2e",
    "input.background": "#0a0a0b",
    "input.border": "#2a2a2e",
  },
};

const APIARK_LIGHT_THEME: Monaco.editor.IStandaloneThemeData = {
  base: "vs",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#ffffff",
    "editor.foreground": "#1a1a1a",
  },
};

let themesRegistered = false;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string | number;
  readOnly?: boolean;
  minimap?: boolean;
  lineNumbers?: boolean;
  placeholder?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  height = "200px",
  readOnly = false,
  minimap = false,
  lineNumbers = true,
  placeholder,
}: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const theme = useSettingsStore((s) => s.settings.theme);

  const monacoTheme = theme === "light" ? "apiark-light" : "apiark-dark";

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    if (!themesRegistered) {
      monaco.editor.defineTheme("apiark-dark", APIARK_DARK_THEME);
      monaco.editor.defineTheme("apiark-light", APIARK_LIGHT_THEME);
      themesRegistered = true;
    }

    monaco.editor.setTheme(monacoTheme);
  }, [monacoTheme]);

  // Update theme when settings change
  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as unknown as { monaco?: typeof Monaco }).monaco;
      if (monaco) {
        monaco.editor.setTheme(monacoTheme);
      }
    }
  }, [monacoTheme]);

  const showPlaceholder = placeholder && !value;

  return (
    <div className="relative h-full overflow-hidden rounded border border-[var(--color-border)]">
      {showPlaceholder && (
        <div className="pointer-events-none absolute left-14 top-2 z-10 text-sm text-[var(--color-text-dimmed)]">
          {placeholder}
        </div>
      )}
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        theme={monacoTheme}
        options={{
          minimap: { enabled: minimap },
          lineNumbers: lineNumbers ? "on" : "off",
          readOnly,
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",
          tabSize: 2,
          wordWrap: "on",
          automaticLayout: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          padding: { top: 8, bottom: 8 },
          renderLineHighlight: "line",
          folding: true,
          bracketPairColorization: { enabled: true },
          suggest: { showWords: false },
          quickSuggestions: language === "javascript" || language === "typescript",
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
        }}
      />
    </div>
  );
}
