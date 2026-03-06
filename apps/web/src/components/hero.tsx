"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Download, Github, Zap, Clock, ShieldOff, Scale } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Terminal typing animation                                          */
/* ------------------------------------------------------------------ */

interface TerminalLine {
  text: string;
  className?: string;
  delay: number;
}

const terminalLines: TerminalLine[] = [
  {
    text: "$ apiark run my-collection --env production",
    className: "text-[var(--color-text)]",
    delay: 0,
  },
  { text: "", className: "", delay: 400 },
  {
    text: "\u2713 GET  /api/users          200 OK          45ms",
    className: "text-[var(--color-success)]",
    delay: 800,
  },
  {
    text: "\u2713 POST /api/users          201 Created     123ms",
    className: "text-[var(--color-success)]",
    delay: 1200,
  },
  {
    text: "\u2713 GET  /api/users/:id      200 OK           38ms",
    className: "text-[var(--color-success)]",
    delay: 1600,
  },
  {
    text: "\u2713 PUT  /api/users/:id      200 OK           67ms",
    className: "text-[var(--color-success)]",
    delay: 2000,
  },
  {
    text: "\u2713 DELETE /api/users/:id    204 No Content    29ms",
    className: "text-[var(--color-success)]",
    delay: 2400,
  },
  { text: "", className: "", delay: 2800 },
  {
    text: "Results: 5 passed, 0 failed (302ms)",
    className: "text-[var(--color-text)] font-semibold",
    delay: 3000,
  },
];

function TypingLine({
  text,
  className,
  delay,
}: {
  text: string;
  className?: string;
  delay: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started || !text) {
      if (started && !text) setDone(true);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [started, text]);

  if (!started) return <div className="h-5" />;
  if (!text) return <div className="h-5" />;

  return (
    <div className={`h-5 whitespace-pre ${className ?? ""}`}>
      {displayed}
      {!done && (
        <span className="inline-block w-[7px] h-[14px] bg-[var(--color-accent-light)] ml-px translate-y-[2px] cursor-blink" />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats bar                                                          */
/* ------------------------------------------------------------------ */

const stats = [
  { icon: Zap, label: "~50MB RAM", id: "ram" },
  { icon: Clock, label: "<2s Startup", id: "startup" },
  { icon: ShieldOff, label: "Zero Login", id: "login" },
  { icon: Scale, label: "MIT License", id: "license" },
];

/* ------------------------------------------------------------------ */
/*  Floating orbs                                                      */
/* ------------------------------------------------------------------ */

function Orb({
  size,
  color,
  top,
  left,
  duration,
}: {
  size: number;
  color: string;
  top: string;
  left: string;
  duration: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: color,
        filter: `blur(${size * 0.6}px)`,
        opacity: 0.12,
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, 20, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Hero component                                                     */
/* ------------------------------------------------------------------ */

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* ---- Background effects ---- */}
      <div className="pointer-events-none absolute inset-0">
        {/* Central radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 40%, transparent 70%)",
          }}
        />

        {/* Floating orbs */}
        <Orb size={400} color="rgba(99,102,241,0.35)" top="10%" left="15%" duration={22} />
        <Orb size={300} color="rgba(167,139,250,0.3)" top="60%" left="70%" duration={18} />
        <Orb size={220} color="rgba(6,182,212,0.25)" top="30%" left="75%" duration={25} />
      </div>

      {/* ---- Content ---- */}
      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 py-32 flex flex-col items-center text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-4 py-1.5 text-sm text-[var(--color-text-secondary)] backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            Open Source &mdash; MIT Licensed
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="mt-8 text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="text-[var(--color-text)]">The API Platform That Respects</span>
          <br />
          <span className="gradient-text">Your Privacy, Your RAM,</span>
          <br />
          <span className="gradient-text">and Your Git Workflow</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl"
        >
          Open-source, local-first, native-speed. The Postman alternative developers actually want.
          <br className="hidden sm:block" />
          <span className="text-[var(--color-text-muted)]">No login. No cloud. No bloat.</span>
        </motion.p>

        {/* Stats bar */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {stats.map((stat, i) => (
            <div key={stat.id} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <stat.icon className="h-4 w-4 text-[var(--color-accent-light)]" />
              <span className="font-medium text-[var(--color-text)]">{stat.label}</span>
              {i < stats.length - 1 && (
                <span className="ml-4 hidden h-4 w-px bg-[var(--color-border)] sm:block" />
              )}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="https://github.com/berbicanes/apiark/releases"
            className="group relative inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#818cf8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:brightness-110 active:scale-[0.98]"
          >
            <Download className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-y-0.5" />
            Download for Free
          </a>

          <a
            href="https://github.com/berbicanes/apiark"
            className="group inline-flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 px-7 py-3.5 text-[15px] font-semibold text-[var(--color-text)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-elevated)]/60 active:scale-[0.98]"
          >
            <Github className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-[360deg]" />
            View on GitHub
          </a>
        </motion.div>

        {/* Platform note */}
        <motion.p
          variants={fadeUp}
          className="mt-4 text-sm text-[var(--color-text-muted)]"
        >
          Available for macOS, Windows, and Linux
        </motion.p>

        {/* Terminal mockup */}
        <motion.div
          variants={scaleIn}
          className="relative mt-16 w-full max-w-2xl"
        >
          {/* Glow behind terminal */}
          <div
            className="pointer-events-none absolute -inset-8 rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)",
            }}
          />

          <div className="animated-border relative overflow-hidden rounded-2xl">
            {/* Inner terminal */}
            <div className="relative rounded-2xl bg-[#0c0c14] shadow-2xl shadow-black/60">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-[var(--color-border)]/60 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs text-[var(--color-text-muted)] font-mono">
                  apiark &mdash; ~/my-api-project
                </span>
              </div>

              {/* Terminal body */}
              <div className="px-5 py-4 font-mono text-[13px] leading-relaxed sm:text-sm">
                {terminalLines.map((line, i) => (
                  <TypingLine
                    key={i}
                    text={line.text}
                    className={line.className}
                    delay={line.delay}
                  />
                ))}
              </div>

              {/* Reflection / shine */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 40%)",
                }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
