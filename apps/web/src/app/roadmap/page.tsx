"use client";

import { motion } from "framer-motion";
import { Check, Clock, Circle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Status = "done" | "in-progress" | "planned";

interface RoadmapItem {
  label: string;
  status: Status;
}

interface Phase {
  title: string;
  status: Status;
  items: RoadmapItem[];
}

const phases: Phase[] = [
  {
    title: "Phase 1 — Core",
    status: "done",
    items: [
      { label: "HTTP client with all methods", status: "done" },
      { label: "Collections as YAML on filesystem", status: "done" },
      { label: "Environment variables", status: "done" },
      { label: "Request history", status: "done" },
      { label: "cURL import/export", status: "done" },
      { label: "Code generation", status: "done" },
    ],
  },
  {
    title: "Phase 2 — Protocols & Power Features",
    status: "done",
    items: [
      { label: "GraphQL with introspection", status: "done" },
      { label: "gRPC support", status: "done" },
      { label: "WebSocket & SSE", status: "done" },
      { label: "MQTT support", status: "done" },
      { label: "Collection runner", status: "done" },
      {
        label: "Import/export (Postman, Bruno, Insomnia, OpenAPI)",
        status: "done",
      },
      { label: "OAuth 2.0 & advanced auth", status: "done" },
      { label: "Pre/post scripts (JS/TS)", status: "done" },
    ],
  },
  {
    title: "Phase 3 — Enterprise",
    status: "done",
    items: [
      { label: "Mock servers", status: "done" },
      { label: "Scheduled testing", status: "done" },
      { label: "API docs generation", status: "done" },
      { label: "Plugin system (JS + WASM)", status: "done" },
      { label: "Proxy capture mode", status: "done" },
    ],
  },
  {
    title: "Phase 4 — Ecosystem",
    status: "in-progress",
    items: [
      { label: "AI assistant", status: "done" },
      { label: "VS Code extension", status: "done" },
      { label: "Payment & licensing", status: "planned" },
      { label: "Plugin marketplace", status: "planned" },
      { label: "Code signing", status: "planned" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: Status }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
        <Check className="h-3 w-3" />
        Done
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
        <Clock className="h-3 w-3" />
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
      <Circle className="h-3 w-3" />
      Planned
    </span>
  );
}

function phaseAccent(status: Status) {
  if (status === "done") return "border-emerald-500/20";
  if (status === "in-progress") return "border-amber-500/20";
  return "border-zinc-700/40";
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-16 text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Roadmap
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="mt-4 text-lg text-zinc-400"
        >
          Where ApiArk has been and where it&apos;s headed. Built in the open,
          shaped by the community.
        </motion.p>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-3xl px-6 pb-32">
        <div className="relative space-y-12">
          {/* Vertical line */}
          <div className="absolute top-0 left-4 hidden h-full w-px bg-zinc-800 sm:block" />

          {phases.map((phase, phaseIdx) => (
            <motion.div
              key={phase.title}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="relative sm:pl-14"
            >
              {/* Timeline dot */}
              <div className="absolute top-1.5 left-2.5 hidden h-3 w-3 rounded-full sm:block">
                <div
                  className={`h-full w-full rounded-full ${
                    phase.status === "done"
                      ? "bg-emerald-500"
                      : phase.status === "in-progress"
                        ? "bg-amber-500"
                        : "bg-zinc-600"
                  }`}
                />
              </div>

              {/* Phase header */}
              <motion.div
                variants={fadeUp}
                className="mb-4 flex flex-wrap items-center gap-3"
              >
                <h2 className="text-xl font-semibold tracking-tight">
                  {phase.title}
                </h2>
                <StatusBadge status={phase.status} />
              </motion.div>

              {/* Items */}
              <motion.ul
                variants={stagger}
                className={`rounded-xl border ${phaseAccent(phase.status)} bg-zinc-900/50 divide-y divide-zinc-800/60`}
              >
                {phase.items.map((item) => (
                  <motion.li
                    key={item.label}
                    variants={fadeUp}
                    className="flex items-center justify-between gap-4 px-5 py-3.5"
                  >
                    <span className="text-sm text-zinc-300">{item.label}</span>
                    <StatusBadge status={item.status} />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
