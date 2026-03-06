"use client";

import { motion } from "framer-motion";
import {
  Check,
  X,
  Minus,
  Download,
  ShieldOff,
  CloudOff,
  Eye,
  FileWarning,
  Lock,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type CellValue = "yes" | "no" | "partial" | string;

function CellDisplay({ value }: { value: CellValue }) {
  if (value === "yes") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15">
        <Check className="w-4 h-4 text-emerald-400" />
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/15">
        <X className="w-4 h-4 text-red-400" />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15">
        <Minus className="w-4 h-4 text-amber-400" />
      </span>
    );
  }
  return <span className="text-sm text-zinc-300">{value}</span>;
}

const comparisonRows: { feature: string; apiark: CellValue; insomnia: CellValue }[] = [
  { feature: "Framework", apiark: "Tauri v2 (Rust)", insomnia: "Electron" },
  { feature: "RAM Usage", apiark: "~50MB", insomnia: "200-400MB" },
  { feature: "Account Required", apiark: "no", insomnia: "partial" },
  { feature: "Data Storage", apiark: "Local filesystem (YAML)", insomnia: "Cloud (Kong)" },
  { feature: "Open Source", apiark: "MIT", insomnia: "MIT" },
  { feature: "REST", apiark: "yes", insomnia: "yes" },
  { feature: "GraphQL", apiark: "yes", insomnia: "yes" },
  { feature: "gRPC", apiark: "yes", insomnia: "yes" },
  { feature: "WebSocket", apiark: "yes", insomnia: "yes" },
  { feature: "SSE", apiark: "yes", insomnia: "yes" },
  { feature: "MQTT", apiark: "yes", insomnia: "no" },
  { feature: "Mock Servers", apiark: "Local (unlimited)", insomnia: "partial" },
  { feature: "Monitoring", apiark: "yes", insomnia: "no" },
  { feature: "Collection Runner", apiark: "yes", insomnia: "no" },
  { feature: "CLI Tool", apiark: "apiark", insomnia: "inso" },
  { feature: "Plugin System", apiark: "JS + WASM", insomnia: "npm plugins" },
  { feature: "Git-Friendly", apiark: "yes", insomnia: "no" },
  { feature: "API Docs Generation", apiark: "yes", insomnia: "no" },
  { feature: "Proxy Capture", apiark: "yes", insomnia: "no" },
  { feature: "Code Generation", apiark: "yes", insomnia: "yes" },
  { feature: "Response Diff", apiark: "yes", insomnia: "no" },
];

const trustTimeline = [
  {
    year: "2023",
    title: "Forced cloud sync",
    description:
      "Kong (Insomnia's parent company) pushed an update that forced cloud sync without user consent. Local data was uploaded to Kong's servers. Users who relied on Insomnia for sensitive API work found their secrets on someone else's infrastructure.",
    icon: CloudOff,
    color: "#ef4444",
  },
  {
    year: "2023",
    title: "Data loss incident",
    description:
      "The forced migration caused data loss for many users. Local collections disappeared. The community outcry was severe -- Insomnia dropped from 4.5 to 2.1 stars on some platforms overnight.",
    icon: FileWarning,
    color: "#f59e0b",
  },
  {
    year: "2023",
    title: "Creator leaves",
    description:
      "Gregory Schier, Insomnia's original creator, left Kong and built Yaak -- a new API client from scratch. When the creator walks away, that tells you everything about the direction of the product.",
    icon: Heart,
    color: "#8b5cf6",
  },
  {
    year: "2024+",
    title: "Trust is hard to rebuild",
    description:
      "Insomnia has since made local storage optional again, but the damage is done. Once a tool uploads your secrets without permission, the relationship with security-conscious developers is broken.",
    icon: ShieldOff,
    color: "#06b6d4",
  },
];

const trustComparison = [
  {
    label: "Account required",
    apiark: "Never. No account needed, ever.",
    insomnia: "Optional, but was forced in 2023.",
  },
  {
    label: "Data storage",
    apiark: "Always local. YAML files on your filesystem.",
    insomnia: "Cloud by default. Local mode restored after backlash.",
  },
  {
    label: "Telemetry",
    apiark: "Zero telemetry. Opt-in crash reports only.",
    insomnia: "Analytics enabled by default.",
  },
  {
    label: "Secret handling",
    apiark: "Secrets in .env files, gitignored. Never logged or synced.",
    insomnia: "Secrets were uploaded to cloud without consent in 2023.",
  },
  {
    label: "Architecture guarantee",
    apiark: "Local-first by design. Cannot sync to cloud -- there is no cloud.",
    insomnia: "Local-first by policy. Policy changed once already.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CompareInsomniaPage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen pt-32 pb-24">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-500/[0.06] rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm text-zinc-400">
                Detailed comparison
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              <span className="gradient-text">ApiArk vs Insomnia</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto"
            >
              Local-first by design, not by afterthought.
            </motion.p>
          </motion.div>

          {/* Trust timeline */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-24"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight text-center mb-4"
            >
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                What happened to Insomnia
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto"
            >
              Insomnia was one of the best API clients. Then Kong acquired it,
              and trust was broken.
            </motion.p>

            <div className="max-w-3xl mx-auto space-y-6">
              {trustTimeline.map((event) => {
                const Icon = event.icon;
                return (
                  <motion.div
                    key={event.title}
                    variants={fadeUp}
                    className="flex gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.1]"
                  >
                    <div className="shrink-0">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${event.color}15` }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: event.color }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${event.color}15`,
                            color: event.color,
                          }}
                        >
                          {event.year}
                        </span>
                        <h3 className="text-base font-semibold text-white">
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {event.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Trust comparison */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Trust comparison
              </span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-4">
              {trustComparison.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div className="text-sm font-medium text-zinc-300">
                    {item.label}
                  </div>
                  <div className="flex items-start gap-2">
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                    <span className="text-sm text-zinc-300">{item.apiark}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Eye className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
                    <span className="text-sm text-zinc-500">
                      {item.insomnia}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Feature comparison
              </span>
            </h2>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-6 py-4 text-sm font-medium text-zinc-400 w-56">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-center bg-indigo-500/[0.08] text-indigo-300">
                        ApiArk
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-center text-zinc-300">
                        Insomnia
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${
                          i % 2 === 0 ? "" : "bg-white/[0.01]"
                        }`}
                      >
                        <td className="px-6 py-3.5 text-sm font-medium text-zinc-300">
                          {row.feature}
                        </td>
                        <td className="px-6 py-3.5 text-center bg-indigo-500/[0.06]">
                          <span className="inline-flex justify-center">
                            <CellDisplay value={row.apiark} />
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <span className="inline-flex justify-center">
                            <CellDisplay value={row.insomnia} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.06] p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Trust is earned, not promised.
              </h2>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                ApiArk is local-first by architecture, not by policy. There is
                no cloud to sync to. Your data physically cannot leave your
                machine.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://github.com/berbicanes/apiark/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  <Download className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">Download ApiArk</span>
                </a>
                <Link
                  href="/pricing"
                  className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-zinc-200 transition-all hover:bg-white/[0.08] hover:text-white"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
