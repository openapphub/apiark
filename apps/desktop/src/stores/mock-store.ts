import { create } from "zustand";
import type { MockServerStatus, MockRequestLog } from "@apiark/types";

interface MockStore {
  servers: MockServerStatus[];
  logs: Record<string, MockRequestLog[]>; // keyed by server_id
  dialogOpen: boolean;

  setServers: (servers: MockServerStatus[]) => void;
  addServer: (server: MockServerStatus) => void;
  removeServer: (serverId: string) => void;
  addLog: (serverId: string, log: MockRequestLog) => void;
  clearLogs: (serverId: string) => void;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useMockStore = create<MockStore>((set) => ({
  servers: [],
  logs: {},
  dialogOpen: false,

  setServers: (servers) => set({ servers }),

  addServer: (server) =>
    set((s) => ({ servers: [...s.servers, server] })),

  removeServer: (serverId) =>
    set((s) => ({
      servers: s.servers.filter((srv) => srv.id !== serverId),
      logs: Object.fromEntries(
        Object.entries(s.logs).filter(([k]) => k !== serverId),
      ),
    })),

  addLog: (serverId, log) =>
    set((s) => {
      const existing = s.logs[serverId] ?? [];
      // Keep last 200 logs per server
      const updated = [...existing, log].slice(-200);
      return { logs: { ...s.logs, [serverId]: updated } };
    }),

  clearLogs: (serverId) =>
    set((s) => ({ logs: { ...s.logs, [serverId]: [] } })),

  openDialog: () => set({ dialogOpen: true }),
  closeDialog: () => set({ dialogOpen: false }),
}));
