import { create } from "zustand";
import type { ResponseData } from "@apiark/types";

export interface SavedSnapshot {
  label: string;
  response: ResponseData;
  savedAt: string;
}

interface DiffState {
  leftResponse: ResponseData | null;
  rightResponse: ResponseData | null;
  snapshots: SavedSnapshot[];
  isOpen: boolean;

  setLeft: (response: ResponseData | null) => void;
  setRight: (response: ResponseData | null) => void;
  saveSnapshot: (label: string, response: ResponseData) => void;
  removeSnapshot: (index: number) => void;
  open: () => void;
  close: () => void;
}

export const useDiffStore = create<DiffState>((set) => ({
  leftResponse: null,
  rightResponse: null,
  snapshots: [],
  isOpen: false,

  setLeft: (response) => set({ leftResponse: response }),
  setRight: (response) => set({ rightResponse: response }),

  saveSnapshot: (label, response) => {
    set((state) => ({
      snapshots: [
        ...state.snapshots,
        { label, response, savedAt: new Date().toISOString() },
      ],
    }));
  },

  removeSnapshot: (index) => {
    set((state) => ({
      snapshots: state.snapshots.filter((_, i) => i !== index),
    }));
  },

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
