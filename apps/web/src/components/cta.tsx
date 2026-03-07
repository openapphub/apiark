"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";

const trustBadges = [
  { label: "Free Core", color: "#a78bfa" },
  { label: "No Telemetry", color: "#fbbf24" },
  { label: "Privacy First", color: "#34d399" },
];

export default function CTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
        >
          Ready to ditch the bloat?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto"
        >
          Try it &mdash; 60 seconds to your first request.
          <br className="hidden sm:block" /> No signup. No credit card. Just download and go.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/download"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-lg text-base font-semibold text-white bg-indigo-600 transition-colors hover:bg-indigo-500"
          >
            <Download className="w-5 h-5" />
            Download Now
          </a>

          <a
            href="/compare/postman"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-lg text-base font-medium text-zinc-300 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
          >
            Compare with Postman
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Free forever note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 text-sm text-zinc-600"
        >
          Free to start. No account required.
        </motion.p>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-12 flex items-center justify-center gap-8 sm:gap-12"
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-zinc-500"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: badge.color }} />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
