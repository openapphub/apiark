import { useCallback, useRef } from "react";

interface PanelDividerProps {
  direction: "horizontal" | "vertical";
  onResize: (ratio: number) => void;
  onDoubleClick: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function PanelDivider({ direction, onResize, onDoubleClick, containerRef }: PanelDividerProps) {
  const dragging = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;

      const container = containerRef.current;
      if (!container) return;

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const rect = container.getBoundingClientRect();
        let ratio: number;
        if (direction === "horizontal") {
          ratio = (ev.clientX - rect.left) / rect.width;
        } else {
          ratio = (ev.clientY - rect.top) / rect.height;
        }
        // Clamp between 0.2 and 0.8 (min 20% for each panel)
        ratio = Math.min(0.8, Math.max(0.2, ratio));
        onResize(ratio);
      };

      const onMouseUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [direction, onResize, containerRef],
  );

  const isHorizontal = direction === "horizontal";

  return (
    <div
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
      className={`group relative shrink-0 ${
        isHorizontal
          ? "w-1 cursor-col-resize"
          : "h-1 cursor-row-resize"
      }`}
    >
      {/* Visible line */}
      <div
        className={`absolute bg-[var(--color-border)] transition-colors group-hover:bg-[var(--color-accent)]/50 ${
          isHorizontal
            ? "inset-y-0 left-0 w-px"
            : "inset-x-0 top-0 h-px"
        }`}
      />
      {/* Wider hit target */}
      <div
        className={`absolute ${
          isHorizontal
            ? "inset-y-0 -left-1 w-3"
            : "inset-x-0 -top-1 h-3"
        }`}
      />
    </div>
  );
}
