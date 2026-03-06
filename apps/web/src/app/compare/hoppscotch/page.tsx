"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Check, X, ArrowRight, Palette, HardDrive, Terminal, Puzzle } from "lucide-react";

export default function HoppscotchComparison() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-5xl px-6 text-center mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold mb-6"
          >
            <span className="gradient-text">ApiArk vs Hoppscotch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto"
          >
            All the beauty. More of the power. Both use Tauri for native speed.
          </motion.p>
        </section>

        <section className="mx-auto max-w-5xl px-6 mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Where ApiArk goes further</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: HardDrive,
                title: "Filesystem-First Storage",
                desc: "ApiArk stores collections as YAML files on your filesystem — fully git-diffable and mergeable. Hoppscotch uses IndexedDB in the browser, making version control impossible.",
                color: "text-emerald-400",
              },
              {
                icon: Terminal,
                title: "gRPC, Mock Servers & Monitors",
                desc: "ApiArk supports gRPC with proto loading and reflection, local mock servers with Faker.js, and scheduled monitoring. Hoppscotch has none of these.",
                color: "text-cyan-400",
              },
              {
                icon: Puzzle,
                title: "Plugin System & CLI",
                desc: "Extend ApiArk with JS or WASM plugins. Run collections from CI/CD with the apiark CLI. Hoppscotch has limited CLI and no plugin system.",
                color: "text-violet-400",
              },
              {
                icon: Palette,
                title: "Desktop-First Experience",
                desc: "Both use Tauri for native speed. But ApiArk is desktop-first with filesystem integration, file watching, and deep OS integration that web-first tools can't match.",
                color: "text-amber-400",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors"
              >
                <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 mb-24">
          <h2 className="text-3xl font-bold mb-8 text-center">Feature comparison</h2>
          <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-elevated)]">
                  <th className="text-left p-4 font-medium text-[var(--color-text-secondary)]">Feature</th>
                  <th className="p-4 font-semibold text-[var(--color-accent)]">ApiArk</th>
                  <th className="p-4 font-medium text-[var(--color-text-secondary)]">Hoppscotch</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Framework", "Tauri v2", "Tauri"],
                  ["Storage", "Filesystem (YAML)", "IndexedDB"],
                  ["REST", true, true],
                  ["GraphQL", true, true],
                  ["gRPC", true, false],
                  ["WebSocket", true, true],
                  ["SSE", true, true],
                  ["MQTT", true, false],
                  ["Mock Servers", true, false],
                  ["Monitors", true, false],
                  ["Collection Runner", true, false],
                  ["Plugin System", true, false],
                  ["CLI Tool", true, true],
                  ["Git-Native", true, false],
                  ["Open Source", true, true],
                ].map(([feature, apiark, hopp], i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    <td className="p-4 text-[var(--color-text-secondary)]">{feature as string}</td>
                    <td className="p-4 text-center">
                      {typeof apiark === "boolean" ? (
                        apiark ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
                      ) : (
                        <span className="font-medium text-[var(--color-accent)]">{apiark as string}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof hopp === "boolean" ? (
                        hopp ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
                      ) : (
                        <span className="text-[var(--color-text-muted)]">{hopp as string}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Same native speed. More features.</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Hoppscotch has beautiful design. ApiArk matches it with a desktop-first experience, filesystem storage, and enterprise features.
          </p>
          <a
            href="https://github.com/berbicanes/apiark/releases/latest"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-indigo-400 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Download ApiArk <ArrowRight className="w-5 h-5" />
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
