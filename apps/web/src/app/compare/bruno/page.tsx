"use client";

import { motion } from "framer-motion";
import {
  Check,
  X,
  Minus,
  Download,
  Zap,
  Server,
  Activity,
  Puzzle,
  Wifi,
  ArrowRight,
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

const comparisonRows: { feature: string; apiark: CellValue; bruno: CellValue }[] = [
  { feature: "Framework", apiark: "Tauri v2 (Rust)", bruno: "Electron" },
  { feature: "RAM Usage", apiark: "~50MB", bruno: "150-300MB" },
  { feature: "Startup Time", apiark: "<2s", bruno: "3-8s" },
  { feature: "Data Format", apiark: "YAML (standard)", bruno: ".bru (custom) + YAML (v3)" },
  { feature: "REST", apiark: "yes", bruno: "yes" },
  { feature: "GraphQL", apiark: "yes", bruno: "yes" },
  { feature: "gRPC", apiark: "yes", bruno: "yes" },
  { feature: "WebSocket", apiark: "yes", bruno: "no" },
  { feature: "SSE", apiark: "yes", bruno: "no" },
  { feature: "MQTT", apiark: "yes", bruno: "no" },
  { feature: "Socket.IO", apiark: "yes", bruno: "no" },
  { feature: "Mock Servers", apiark: "yes", bruno: "no" },
  { feature: "Monitoring / Scheduling", apiark: "yes", bruno: "no" },
  { feature: "Collection Runner", apiark: "yes", bruno: "no" },
  { feature: "API Docs Generation", apiark: "yes", bruno: "no" },
  { feature: "Response Diff", apiark: "yes", bruno: "no" },
  { feature: "Plugin System", apiark: "JS + WASM", bruno: "no" },
  { feature: "Proxy Capture Mode", apiark: "yes", bruno: "no" },
  { feature: "OpenAPI Spec Editor", apiark: "yes", bruno: "no" },
  { feature: "CLI Tool", apiark: "apiark", bruno: "bru CLI" },
  { feature: "Code Generation", apiark: "JS, Python, cURL", bruno: "no" },
  { feature: "Open Source", apiark: "MIT", bruno: "MIT" },
  { feature: "Account Required", apiark: "no", bruno: "no" },
  { feature: "Git-Friendly", apiark: "yes", bruno: "yes" },
];

const keyDifferences = [
  {
    icon: Zap,
    title: "Tauri v2 vs Electron",
    description:
      "Bruno uses Electron (Chromium + Node.js), consuming 150-300MB RAM. ApiArk uses Tauri v2 with a Rust backend and native OS webview -- 3-6x less memory, 2-4x faster startup.",
    color: "#6366f1",
  },
  {
    icon: Server,
    title: "Local mock servers",
    description:
      "ApiArk includes built-in local mock servers powered by axum. Define mock responses with Faker.js data, latency simulation, and error injection. Bruno has no mocking support.",
    color: "#22c55e",
  },
  {
    icon: Activity,
    title: "Monitoring & scheduled testing",
    description:
      "Run collections on a cron schedule with desktop notifications, webhook alerts, and historical trend charts. All local, no cloud. Bruno does not have monitoring.",
    color: "#f59e0b",
  },
  {
    icon: Wifi,
    title: "Full protocol coverage",
    description:
      "ApiArk supports REST, GraphQL, gRPC, WebSocket, SSE, MQTT, and Socket.IO. Bruno supports REST and GraphQL, with gRPC added in v3. No WebSocket, SSE, MQTT, or Socket.IO.",
    color: "#06b6d4",
  },
  {
    icon: Puzzle,
    title: "Plugin system",
    description:
      "Extend ApiArk with JavaScript or WASM plugins. Custom auth providers, request transformers, response visualizers, and more. Bruno has no plugin system.",
    color: "#8b5cf6",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CompareBrunoPage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen pt-32 pb-24">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-500/[0.06] rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
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
              <span className="gradient-text">ApiArk vs Bruno</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto"
            >
              We love Bruno. We just built something faster.
            </motion.p>
          </motion.div>

          {/* Performance comparison - quick stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-3 gap-4 mb-24 max-w-2xl mx-auto"
          >
            {[
              { label: "RAM Usage", apiark: "~50MB", bruno: "150-300MB" },
              { label: "Startup", apiark: "<2s", bruno: "3-8s" },
              { label: "Download", apiark: "~20MB", bruno: "~80MB" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center"
              >
                <p className="text-xs text-zinc-500 mb-3">{stat.label}</p>
                <p className="text-lg font-bold text-indigo-400">{stat.apiark}</p>
                <p className="text-[10px] text-zinc-600 mb-1">ApiArk</p>
                <div className="h-px w-8 mx-auto bg-white/[0.06] my-2" />
                <p className="text-lg font-bold text-zinc-500">{stat.bruno}</p>
                <p className="text-[10px] text-zinc-600">Bruno</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Respectful preamble */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="inline-block rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-6 max-w-2xl">
              <p className="text-sm leading-relaxed text-zinc-400">
                Bruno is a great project that proved the demand for local-first,
                git-friendly API clients. We share the same philosophy: no
                forced accounts, no cloud sync, no telemetry. Both tools are
                open source under the MIT license.{" "}
                <span className="text-zinc-200">
                  Here is why you might prefer ApiArk.
                </span>
              </p>
            </div>
          </motion.div>

          {/* Key differences */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-24"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight text-center mb-12"
            >
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Key differences
              </span>
            </motion.h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {keyDifferences.map((diff) => {
                const Icon = diff.icon;
                return (
                  <motion.div
                    key={diff.title}
                    variants={fadeUp}
                    className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-white/[0.1] hover:bg-white/[0.03]"
                  >
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${diff.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: diff.color }} />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">
                      {diff.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {diff.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Full comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Full feature comparison
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
                        Bruno
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
                            <CellDisplay value={row.bruno} />
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
                Same philosophy. More power.
              </h2>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                Local-first, open source, git-native -- just like Bruno. Plus
                mock servers, monitors, gRPC, WebSocket, SSE, plugins, and
                native speed.
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
