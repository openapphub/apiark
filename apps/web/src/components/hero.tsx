"use client";

import { motion } from "framer-motion";
import { Download, Github } from "lucide-react";
import { AppMockup } from "./app-mockup";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl px-6"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-zinc-400">Open Source &mdash; Free Core</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
        >
          The API Platform That
          <br />
          Respects Your Privacy,
          <br />
          <span className="text-indigo-400">Your RAM, and Your Git</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center text-lg text-zinc-500 mb-8"
        >
          Local-first, native-speed. Send REST, GraphQL, gRPC,
          WebSocket &mdash; all from one interface.{" "}
          <span className="text-zinc-300">No login. No cloud. No bloat.</span>
        </motion.p>

        {/* Stats */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-zinc-500">
          {[
            { label: "~50MB RAM", color: "#fbbf24" },
            { label: "<2s Startup", color: "#22d3ee" },
            { label: "Zero Login", color: "#34d399" },
            { label: "Cross-Platform", color: "#a78bfa" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: stat.color }} />
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mb-4">
          <a
            href="/download"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
          <a
            href="https://github.com/berbicanes/apiark"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-7 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-white/[0.06]"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </motion.div>
        <motion.p variants={fadeUp} className="text-center text-xs text-zinc-600 mb-16">
          Available for macOS, Windows, and Linux
        </motion.p>

        {/* App Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <AppMockup autoPlay className="mx-auto max-w-5xl" />
        </motion.div>
      </motion.div>
    </section>
  );
}
