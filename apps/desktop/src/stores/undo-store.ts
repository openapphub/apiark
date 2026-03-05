import { create } from "zustand";

// Actions that can be undone in the collection tree
export type UndoAction =
  | {
      type: "delete";
      path: string;
      collectionPath: string;
      collectionName: string;
      trashPath: string; // where the item was moved in trash
    }
  | {
      type: "rename";
      oldPath: string;
      newPath: string;
      oldName: string;
      newName: string;
      collectionPath: string;
    }
  | {
      type: "move";
      oldPath: string;
      newPath: string;
      collectionPath: string;
    };

const MAX_UNDO_DEPTH = 20;

interface UndoState {
  undoStack: UndoAction[];
  pushUndo: (action: UndoAction) => void;
  popUndo: () => UndoAction | undefined;
  clearUndo: () => void;
}

export const useUndoStore = create<UndoState>((set, get) => ({
  undoStack: [],

  pushUndo: (action) => {
    set((state) => ({
      undoStack: [...state.undoStack.slice(-MAX_UNDO_DEPTH + 1), action],
    }));
  },

  popUndo: () => {
    const stack = get().undoStack;
    if (stack.length === 0) return undefined;
    const action = stack[stack.length - 1];
    set({ undoStack: stack.slice(0, -1) });
    return action;
  },

  clearUndo: () => {
    set({ undoStack: [] });
  },
}));
