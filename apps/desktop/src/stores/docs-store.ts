import { create } from "zustand";

interface DocsStore {
  open: boolean;
  collectionPath: string;
  collectionName: string;
  openDocs: (collectionPath: string, collectionName: string) => void;
  closeDocs: () => void;
}

export const useDocsStore = create<DocsStore>((set) => ({
  open: false,
  collectionPath: "",
  collectionName: "",
  openDocs: (collectionPath, collectionName) =>
    set({ open: true, collectionPath, collectionName }),
  closeDocs: () => set({ open: false }),
}));
