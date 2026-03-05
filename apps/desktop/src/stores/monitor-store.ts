import { create } from "zustand";
import type { MonitorStatus, MonitorResult } from "@apiark/types";

interface MonitorStore {
  monitors: MonitorStatus[];
  results: Record<string, MonitorResult[]>; // keyed by monitor_id
  dialogOpen: boolean;
  selectedMonitorId: string | null;

  setMonitors: (monitors: MonitorStatus[]) => void;
  addMonitor: (monitor: MonitorStatus) => void;
  removeMonitor: (monitorId: string) => void;
  updateMonitor: (monitor: MonitorStatus) => void;
  setResults: (monitorId: string, results: MonitorResult[]) => void;
  addResult: (monitorId: string, result: MonitorResult) => void;
  selectMonitor: (monitorId: string | null) => void;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useMonitorStore = create<MonitorStore>((set) => ({
  monitors: [],
  results: {},
  dialogOpen: false,
  selectedMonitorId: null,

  setMonitors: (monitors) => set({ monitors }),

  addMonitor: (monitor) =>
    set((s) => ({ monitors: [...s.monitors, monitor] })),

  removeMonitor: (monitorId) =>
    set((s) => ({
      monitors: s.monitors.filter((m) => m.id !== monitorId),
      results: Object.fromEntries(
        Object.entries(s.results).filter(([k]) => k !== monitorId),
      ),
    })),

  updateMonitor: (monitor) =>
    set((s) => ({
      monitors: s.monitors.map((m) => (m.id === monitor.id ? monitor : m)),
    })),

  setResults: (monitorId, results) =>
    set((s) => ({ results: { ...s.results, [monitorId]: results } })),

  addResult: (monitorId, result) =>
    set((s) => {
      const existing = s.results[monitorId] ?? [];
      return { results: { ...s.results, [monitorId]: [result, ...existing].slice(0, 50) } };
    }),

  selectMonitor: (monitorId) => set({ selectedMonitorId: monitorId }),
  openDialog: () => set({ dialogOpen: true }),
  closeDialog: () => set({ dialogOpen: false }),
}));
