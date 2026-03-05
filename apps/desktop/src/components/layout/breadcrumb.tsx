import { ChevronRight } from "lucide-react";
import { useActiveTab } from "@/stores/tab-store";
import { useMemo } from "react";

export function Breadcrumb() {
  const tab = useActiveTab();

  const segments = useMemo(() => {
    if (!tab?.filePath || !tab?.collectionPath) return null;

    // Extract relative path from collection
    const relative = tab.filePath
      .replace(tab.collectionPath, "")
      .replace(/^[\\/]/, "")
      .replace(/\.yaml$/, "");

    const parts = relative.split(/[\\/]/);
    if (parts.length === 0) return null;

    // Collection name is the last segment of collectionPath
    const collectionName = tab.collectionPath.split(/[\\/]/).pop() ?? "Collection";

    return [collectionName, ...parts];
  }, [tab?.filePath, tab?.collectionPath]);

  if (!segments || segments.length === 0) return null;

  return (
    <div className="flex items-center gap-0.5 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1">
      {segments.map((segment, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 && <ChevronRight className="h-3 w-3 text-[var(--color-text-dimmed)]" />}
          <span
            className={`text-xs ${
              i === segments.length - 1
                ? "font-medium text-[var(--color-text-primary)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            {segment}
          </span>
        </span>
      ))}
    </div>
  );
}
