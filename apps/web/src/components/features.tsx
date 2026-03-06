"use client";

import { motion, useInView } from "framer-motion";
import {
  Zap,
  Shield,
  GitBranch,
  Code,
  Sparkles,
  Puzzle,
} from "lucide-react";
import { useRef, type ComponentType, type SVGProps } from "react";

interface Feature {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  accent: string;
  accentGlow: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Native Speed",
    description:
      "50MB RAM. <2s startup. 20MB download. Tauri v2 + Rust backend means native performance, not Electron bloat.",
    accent: "#06b6d4",
    accentGlow: "rgba(6, 182, 212, 0.15)",
  },
  {
    icon: Shield,
    title: "Local-First Forever",
    description:
      "Your data never leaves your machine. No accounts. No cloud sync. No telemetry. Zero trust required.",
    accent: "#22c55e",
    accentGlow: "rgba(34, 197, 94, 0.15)",
  },
  {
    icon: GitBranch,
    title: "Git-Native Storage",
    description:
      "Collections stored as YAML files. One file per request. Fully diffable, mergeable, and versionable.",
    accent: "#8b5cf6",
    accentGlow: "rgba(139, 92, 246, 0.15)",
  },
  {
    icon: Code,
    title: "TypeScript Scripting",
    description:
      "Pre/post request scripts in TypeScript. Full ark API with Chai assertions, CryptoJS, Lodash, Faker built-in.",
    accent: "#eab308",
    accentGlow: "rgba(234, 179, 8, 0.15)",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description:
      "Generate requests from natural language. Auto-generate tests. Explain responses. Your API key, your model.",
    accent: "#ec4899",
    accentGlow: "rgba(236, 72, 153, 0.15)",
  },
  {
    icon: Puzzle,
    title: "Plugin Ecosystem",
    description:
      "Extend with JavaScript or WASM plugins. Custom auth handlers, transformers, and integrations.",
    accent: "#f97316",
    accentGlow: "rgba(249, 115, 22, 0.15)",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariants}
      className="card-shine group relative flex flex-col gap-4 rounded-2xl border border-[#1e1e2a] bg-[#14141c] p-6 transition-all duration-300 hover:border-[#2a2a3a]"
      style={
        {
          "--accent": feature.accent,
          "--accent-glow": feature.accentGlow,
        } as React.CSSProperties
      }
      whileHover={{
        boxShadow: `0 0 40px ${feature.accentGlow}, 0 0 80px ${feature.accentGlow}`,
        borderColor: `color-mix(in srgb, ${feature.accent} 30%, #1e1e2a)`,
      }}
    >
      {/* Accent gradient line at top */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)`,
        }}
      />

      {/* Icon container */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300"
        style={{
          backgroundColor: feature.accentGlow,
        }}
      >
        <Icon
          className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
          style={{ color: feature.accent }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-[#e4e4e7]">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-[#a1a1aa]">
          {feature.description}
        </p>
      </div>

      {/* Subtle corner accent */}
      <div
        className="pointer-events-none absolute -right-px -top-px h-20 w-20 rounded-tr-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top right, ${feature.accentGlow}, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      className="relative overflow-hidden px-6 py-32"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#6366f1]/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-[#e4e4e7] sm:text-5xl">
            Everything you need.{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#a78bfa] bg-clip-text text-transparent">
              And nothing you don&apos;t.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#71717a]">
            A complete API development platform that respects your privacy, your
            RAM, and your workflow.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
