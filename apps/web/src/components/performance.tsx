"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const competitors = [
  { name: "Postman", ram: 800, color: "#ef4444", glow: false },
  { name: "Insomnia", ram: 400, color: "#f97316", glow: false },
  { name: "Bruno", ram: 250, color: "#eab308", glow: false },
  { name: "Hoppscotch", ram: 80, color: "#06b6d4", glow: false },
  { name: "ApiArk", ram: 50, color: "#6366f1", glow: true },
];

const maxRam = 800; // normalise bars against Postman

const stats = [
  {
    value: 50,
    suffix: "MB",
    label: "Average RAM Usage",
    comparison: "vs 800MB for Postman",
  },
  {
    value: 2,
    prefix: "<",
    suffix: "s",
    label: "Cold Start Time",
    comparison: "vs 10-30s for Postman",
  },
  {
    value: 20,
    suffix: "MB",
    label: "Download Size",
    comparison: "vs 200MB+ for Postman",
  },
];

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function AnimatedCounter({
  value,
  prefix,
  suffix,
  inView,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(motionVal, value, {
        duration: 1.6,
        ease: [0.22, 1, 0.36, 1] as const,
      });
      return controls.stop;
    }
  }, [inView, motionVal, value]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Bar component                                                      */
/* ------------------------------------------------------------------ */

function RamBar({
  name,
  ram,
  color,
  glow,
  index,
  inView,
}: {
  name: string;
  ram: number;
  color: string;
  glow: boolean;
  index: number;
  inView: boolean;
}) {
  const pct = (ram / maxRam) * 100;
  const motionVal = useMotionValue(0);
  const [displayRam, setDisplayRam] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(motionVal, ram, {
        duration: 1.2,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1] as const,
      });
      return controls.stop;
    }
  }, [inView, motionVal, ram, index]);

  useEffect(() => {
    const unsub = motionVal.on("change", (v) => setDisplayRam(Math.round(v)));
    return unsub;
  }, [motionVal]);

  return (
    <div className="group flex items-center gap-4">
      {/* Label */}
      <span
        className={`w-28 shrink-0 text-right text-sm font-medium ${
          glow ? "text-white" : "text-zinc-400"
        }`}
      >
        {name}
      </span>

      {/* Bar track */}
      <div className="relative flex-1 h-10 rounded-lg bg-white/[0.03] overflow-hidden">
        {/* Animated fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-lg"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            delay: index * 0.12,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
          style={{
            background: glow
              ? `linear-gradient(90deg, ${color}, #818cf8)`
              : color,
            boxShadow: glow
              ? `0 0 30px ${color}40, 0 0 60px ${color}20`
              : "none",
          }}
        />

        {/* Pulsing glow overlay for ApiArk */}
        {glow && (
          <motion.div
            className="absolute inset-y-0 left-0 rounded-lg"
            initial={{ width: 0 }}
            animate={
              inView
                ? {
                    width: `${pct}%`,
                    opacity: [0.4, 0.8, 0.4],
                  }
                : { width: 0 }
            }
            transition={{
              width: {
                duration: 1.2,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1] as const,
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.4,
              },
            }}
            style={{
              background: `linear-gradient(90deg, ${color}00, ${color}60, ${color}00)`,
            }}
          />
        )}

        {/* Inner label for ApiArk */}
        {glow && (
          <motion.span
            className="absolute inset-y-0 left-4 flex items-center text-xs font-bold text-white/90 tracking-wider uppercase"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 + index * 0.12, duration: 0.4 }}
          >
            16x lighter
          </motion.span>
        )}
      </div>

      {/* RAM value */}
      <motion.span
        className={`w-20 shrink-0 text-sm font-mono tabular-nums ${
          glow ? "font-bold text-indigo-400" : "text-zinc-500"
        }`}
        initial={{ opacity: 0, x: -8 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
        transition={{ delay: 0.6 + index * 0.12, duration: 0.4 }}
      >
        {displayRam}MB
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

export default function Performance() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const chartInView = useInView(chartRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <section
      id="performance"
      ref={sectionRef}
      className="relative overflow-hidden py-32 sm:py-40"
    >
      {/* Background */}

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            10x lighter.
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Same power. Fraction of the resources.
          </p>
        </motion.div>

        {/* RAM comparison chart */}
        <div ref={chartRef} className="space-y-3 max-w-4xl mx-auto">
          {competitors.map((c, i) => (
            <RamBar
              key={c.name}
              name={c.name}
              ram={c.ram}
              color={c.color}
              glow={c.glow}
              index={i}
              inView={chartInView}
            />
          ))}

          {/* Chart label */}
          <motion.p
            className="text-center text-xs text-zinc-600 mt-6 tracking-wide uppercase"
            initial={{ opacity: 0 }}
            animate={chartInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Average RAM usage at idle &mdash; measured on macOS 14, Apple M2, 10 requests loaded
          </motion.p>
        </div>

        {/* Stats grid */}
        <div
          ref={statsRef}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center transition-colors hover:border-indigo-500/20 hover:bg-white/[0.04]"
              initial={{ opacity: 0, y: 24 }}
              animate={
                statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
              }
              transition={{
                delay: i * 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              {/* Glow on hover */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <p className="text-5xl sm:text-6xl font-bold tracking-tight text-white">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    inView={statsInView}
                  />
                </p>
                <p className="mt-3 text-sm font-medium text-zinc-300">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-zinc-600">{stat.comparison}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Callout quote */}
        <motion.blockquote
          className="relative mt-20 max-w-3xl mx-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-8 sm:px-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* Gradient left border accent */}
          <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-amber-500 via-red-500 to-pink-500" />

          <p className="text-lg sm:text-xl font-medium leading-relaxed text-zinc-200">
            &ldquo;Postman uses{" "}
            <span className="text-red-400 font-semibold">800MB of RAM</span> to
            send a GET request. ApiArk uses{" "}
            <span className="text-indigo-400 font-semibold">50MB</span>.
            <br className="hidden sm:block" />
            Your laptop deserves better.&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
