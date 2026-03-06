"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Download, Sparkles, Building2 } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

/* ------------------------------------------------------------------ */
/*  Metadata (exported from a separate file or layout for App Router)  */
/* ------------------------------------------------------------------ */

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to build APIs",
    cta: "Download Free",
    ctaHref: "https://github.com/berbicanes/apiark/releases/latest",
    highlighted: false,
    badge: null,
    icon: Download,
    features: [
      "Unlimited collections & environments",
      "Full scripting engine (JS/TS)",
      "REST, GraphQL, gRPC, WebSocket, SSE, MQTT",
      "Import from Postman, Bruno, Insomnia, OpenAPI",
      "Export to Postman, OpenAPI, cURL, HAR",
      "CLI tool (apiark run, import, export)",
      "Request history & search",
      "OAuth 2.0, Digest, AWS Sig v4, NTLM, JWT",
      "Collection runner with data-driven testing",
      "Cookie jar management",
      "Code generation (JS, Python, cURL)",
    ],
  },
  {
    name: "Pro",
    price: "$8",
    period: "/user/month",
    description: "For power users who want more",
    cta: "Start 14-day trial",
    ctaHref: "#",
    highlighted: true,
    badge: "Popular",
    icon: Sparkles,
    features: [
      "Everything in Free, plus:",
      "Mock servers (unlimited, local)",
      "Scheduled testing & monitors",
      "API documentation generation",
      "Response diff viewer",
      "OpenAPI spec editor with linting",
      "Parallel collection runner",
      "Proxy capture mode",
      "Priority email support",
    ],
  },
  {
    name: "Team",
    price: "$16",
    period: "/user/month",
    description: "For teams that collaborate",
    cta: "Contact Sales",
    ctaHref: "mailto:team@apiark.dev",
    highlighted: false,
    badge: null,
    icon: Building2,
    features: [
      "Everything in Pro, plus:",
      "Built-in Git UI",
      "Team environment sharing",
      "SSO / SAML authentication",
      "Audit logs",
      "Priority support with SLA",
      "Custom onboarding",
    ],
  },
];

const faqs = [
  {
    question: "Is the Free tier really free forever?",
    answer:
      "Yes. The Free tier includes the full HTTP client, all protocols, scripting, CLI, import/export, and more. There are no usage limits, no time limits, and no account required. We will never gate core API development features behind a paywall.",
  },
  {
    question: "What happens when my Pro trial ends?",
    answer:
      "After the 14-day trial, Pro features (mock servers, monitors, docs generation, response diff) are disabled. Your data stays exactly where it is -- on your filesystem. The core app continues to work with all Free features. There is a 14-day grace period after license expiry before Pro features are disabled.",
  },
  {
    question: "Can I use ApiArk offline?",
    answer:
      "Absolutely. ApiArk is designed to work 100% offline for all core workflows. Collections, environments, scripting, history, mock servers, and the collection runner all work without an internet connection. License validation is offline-first using signed JWT keys -- no phone-home lockout.",
  },
  {
    question: "How does licensing work? Is there DRM?",
    answer:
      "No DRM. Your license is a signed JWT stored locally on your machine. It is validated offline against a public key embedded in the binary. An optional online check runs on launch if internet is available, but the license remains valid if the server is unreachable. We believe in making paid tiers genuinely valuable, not in punishing users.",
  },
  {
    question: "Can I switch from Postman easily?",
    answer:
      "Yes -- ApiArk has a built-in Postman importer. Export your Postman collection as JSON, then import it into ApiArk. Collections, environments, headers, auth, scripts, and tests are all converted. The entire process takes less than 60 seconds.",
  },
];

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
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

/* ------------------------------------------------------------------ */
/*  FAQ Accordion Item                                                 */
/* ------------------------------------------------------------------ */

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-white"
      >
        <span className="text-base font-medium text-zinc-200 pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-zinc-400">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen pt-32 pb-24">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-500/[0.06] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              <span className="gradient-text">Simple, fair pricing.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              Free forever for individuals. Pro for power users. Team for
              organizations.
            </motion.p>
          </motion.div>

          {/* Pricing tiers */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-6 lg:grid-cols-3 lg:gap-8 max-w-5xl mx-auto"
          >
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  variants={fadeUp}
                  className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                    tier.highlighted
                      ? "border-indigo-500/40 bg-indigo-500/[0.06] shadow-xl shadow-indigo-500/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03]"
                  }`}
                >
                  {tier.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25">
                      {tier.badge}
                    </span>
                  )}

                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${
                          tier.highlighted
                            ? "bg-indigo-500/20"
                            : "bg-white/[0.06]"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            tier.highlighted
                              ? "text-indigo-400"
                              : "text-zinc-400"
                          }`}
                        />
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {tier.name}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        {tier.price}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {tier.period}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">
                      {tier.description}
                    </p>
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            tier.highlighted
                              ? "text-indigo-400"
                              : "text-emerald-400"
                          }`}
                        />
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={tier.ctaHref}
                    className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                      tier.highlighted
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
                        : "border border-white/[0.1] bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {tier.cta}
                  </a>
                </motion.div>
              );
            })}
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="mt-32 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Frequently asked questions
              </span>
            </h2>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6">
              {faqs.map((faq, i) => (
                <FaqItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
