import { useState } from "react";
import type { CollectionNode, HttpMethod } from "@apiark/types";
import { useCollectionStore } from "@/stores/collection-store";
import { useTabStore } from "@/stores/tab-store";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FilePlus,
  FolderPlus,
  Trash2,
  Pencil,
  Download,
  GripVertical,
} from "lucide-react";
import { exportCollectionToFile } from "@/lib/export-collection";
import { saveFolderOrder } from "@/lib/tauri-api";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-green-500",
  POST: "text-yellow-500",
  PUT: "text-blue-500",
  PATCH: "text-purple-500",
  DELETE: "text-red-500",
  HEAD: "text-cyan-500",
  OPTIONS: "text-gray-500",
};

interface CollectionTreeProps {
  nodes: CollectionNode[];
  collectionPath: string;
  collectionName: string;
  depth?: number;
  searchQuery?: string;
}

/** Get the directory of a node (its parent directory path) */
function getNodeDir(node: CollectionNode): string {
  const path = node.path;
  const lastSep = path.lastIndexOf("/");
  return lastSep >= 0 ? path.substring(0, lastSep) : path;
}

/** Get the order key for a node (file stem for requests, folder name for folders) */
function getOrderKey(node: CollectionNode): string {
  const path = node.path;
  const name = path.substring(path.lastIndexOf("/") + 1);
  // For request files, strip .yaml/.yml extension
  if (node.type === "request") {
    return name.replace(/\.(yaml|yml)$/, "");
  }
  return name;
}

/** Check if a node or its children match a search query */
function nodeMatchesSearch(node: CollectionNode, query: string): boolean {
  if (!query) return true;
  const lower = query.toLowerCase();
  if (node.name.toLowerCase().includes(lower)) return true;
  if (node.type !== "request" && node.children.length > 0) {
    return node.children.some((child) => nodeMatchesSearch(child, lower));
  }
  return false;
}

export function CollectionTree({
  nodes,
  collectionPath,
  collectionName,
  depth = 0,
  searchQuery = "",
}: CollectionTreeProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const { refreshCollection } = useCollectionStore();

  const filteredNodes = searchQuery
    ? nodes.filter((node) => nodeMatchesSearch(node, searchQuery))
    : nodes;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = filteredNodes.findIndex((n) => n.path === active.id);
    const toIndex = filteredNodes.findIndex((n) => n.path === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    // Build new order
    const reordered = [...filteredNodes];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    // Determine the parent directory
    const parentDir = getNodeDir(filteredNodes[0]);

    // Save order to _folder.yaml
    const order = reordered.map(getOrderKey);
    try {
      await saveFolderOrder(parentDir, order);
      await refreshCollection(collectionPath);
    } catch (err) {
      console.error("Failed to save folder order:", err);
    }
  };

  if (filteredNodes.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredNodes.map((n) => n.path)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {filteredNodes.map((node) => (
            <SortableTreeNode
              key={node.path}
              node={node}
              collectionPath={collectionPath}
              collectionName={collectionName}
              depth={depth}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableTreeNode({
  node,
  collectionPath,
  collectionName,
  depth,
  searchQuery,
}: {
  node: CollectionNode;
  collectionPath: string;
  collectionName: string;
  depth: number;
  searchQuery: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.path });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TreeNode
        node={node}
        collectionPath={collectionPath}
        collectionName={collectionName}
        depth={depth}
        searchQuery={searchQuery}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

function TreeNode({
  node,
  collectionPath,
  collectionName,
  depth,
  searchQuery,
  dragHandleProps,
}: {
  node: CollectionNode;
  collectionPath: string;
  collectionName: string;
  depth: number;
  searchQuery: string;
  dragHandleProps?: Record<string, unknown>;
}) {
  const { expandedPaths, toggleExpand, createRequest, createFolder, deleteItem, renameItem } =
    useCollectionStore();
  const { openTab } = useTabStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const isExpanded = expandedPaths.has(node.path) || !!searchQuery;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleNewRequest = async () => {
    closeContextMenu();
    const dir = node.type === "request" ? collectionPath : node.path;
    const name = prompt("Request name:");
    if (!name) return;
    const filename = name.toLowerCase().replace(/\s+/g, "-");
    try {
      const path = await createRequest(dir, filename, name, collectionPath);
      await openTab(path, collectionPath);
    } catch (err) {
      console.error("Failed to create request:", err);
    }
  };

  const handleNewFolder = async () => {
    closeContextMenu();
    const dir = node.type === "request" ? collectionPath : node.path;
    const name = prompt("Folder name:");
    if (!name) return;
    try {
      await createFolder(dir, name);
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  };

  const handleDelete = async () => {
    closeContextMenu();
    if (!confirm(`Delete "${node.name}"?`)) return;
    try {
      await deleteItem(node.path, collectionName, collectionPath);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleRename = () => {
    closeContextMenu();
    setRenameValue(node.name);
    setRenaming(true);
  };

  const submitRename = async () => {
    setRenaming(false);
    if (!renameValue.trim() || renameValue === node.name) return;
    try {
      await renameItem(node.path, renameValue.trim(), collectionPath);
    } catch (err) {
      console.error("Failed to rename:", err);
    }
  };

  if (node.type === "request") {
    return (
      <>
        <button
          onClick={() => openTab(node.path, collectionPath)}
          onContextMenu={handleContextMenu}
          className="group flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm hover:bg-[var(--color-elevated)]"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <span
            className="shrink-0 cursor-grab opacity-0 group-hover:opacity-50 hover:!opacity-100"
            {...dragHandleProps}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3 w-3 text-[var(--color-text-muted)]" />
          </span>
          <span className={`w-9 shrink-0 text-[10px] font-bold ${METHOD_COLORS[node.method]}`}>
            {node.method}
          </span>
          {renaming ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={submitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              className="flex-1 rounded bg-[var(--color-elevated)] px-1 text-sm text-[var(--color-text-primary)] outline-none ring-1 ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate text-[var(--color-text-secondary)]">{node.name}</span>
          )}
        </button>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={closeContextMenu}
            items={[
              { label: "Rename", icon: Pencil, onClick: handleRename },
              { label: "Delete", icon: Trash2, onClick: handleDelete, danger: true },
            ]}
          />
        )}
      </>
    );
  }

  // Folder or Collection
  const children = node.children;

  return (
    <>
      <button
        onClick={() => toggleExpand(node.path)}
        onContextMenu={handleContextMenu}
        className="group flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm hover:bg-[var(--color-elevated)]"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {node.type !== "collection" && (
          <span
            className="shrink-0 cursor-grab opacity-0 group-hover:opacity-50 hover:!opacity-100"
            {...dragHandleProps}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3 w-3 text-[var(--color-text-muted)]" />
          </span>
        )}
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
        )}
        {isExpanded ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
        ) : (
          <Folder className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
        )}
        {renaming ? (
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitRename();
              if (e.key === "Escape") setRenaming(false);
            }}
            className="flex-1 rounded bg-[var(--color-elevated)] px-1 text-sm text-[var(--color-text-primary)] outline-none ring-1 ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate text-[var(--color-text-primary)]">{node.name}</span>
        )}
      </button>

      {isExpanded && children.length > 0 && (
        <CollectionTree
          nodes={children}
          collectionPath={collectionPath}
          collectionName={node.type === "collection" ? node.name : collectionName}
          depth={depth + 1}
          searchQuery={searchQuery}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          items={[
            { label: "New Request", icon: FilePlus, onClick: handleNewRequest },
            { label: "New Folder", icon: FolderPlus, onClick: handleNewFolder },
            ...(node.type === "collection"
              ? [
                  {
                    label: "Export as Postman",
                    icon: Download,
                    onClick: () => {
                      closeContextMenu();
                      exportCollectionToFile(node.path, node.name, "postman").catch(console.error);
                    },
                  },
                  {
                    label: "Export as OpenAPI",
                    icon: Download,
                    onClick: () => {
                      closeContextMenu();
                      exportCollectionToFile(node.path, node.name, "openapi").catch(console.error);
                    },
                  },
                ]
              : [
                  { label: "Rename", icon: Pencil, onClick: handleRename },
                  { label: "Delete", icon: Trash2, onClick: handleDelete, danger: true },
                ]),
          ]}
        />
      )}
    </>
  );
}

function ContextMenu({
  x,
  y,
  onClose,
  items,
}: {
  x: number;
  y: number;
  onClose: () => void;
  items: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    danger?: boolean;
  }[];
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 min-w-[160px] rounded border border-[var(--color-border)] bg-[var(--color-elevated)] py-1 shadow-lg"
        style={{ left: x, top: y }}
      >
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-[var(--color-border)] ${
              item.danger ? "text-red-400" : "text-[var(--color-text-primary)]"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
