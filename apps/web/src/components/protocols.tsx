"use client";

import { motion, useInView } from "framer-motion";
import {
  Globe,
  Hexagon,
  Radio,
  MessageSquare,
  Rss,
  Wifi,
} from "lucide-react";
import { useRef, type ComponentType, type SVGProps } from "react";

interface Protocol {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
  colorGlow: string;
  description: string;
  preview: string;
}

const protocols: Protocol[] = [
  {
    name: "REST",
    icon: Globe,
    color: "#22c55e",
    colorGlow: "rgba(34, 197, 94, 0.12)",
    description:
      "Full HTTP client with all methods, headers, params, auth, and body types.",
    preview: `GET /api/users?page=1
Authorization: Bearer {{token}}
Content-Type: application/json

200 OK  245ms  1.2KB`,
  },
  {
    name: "GraphQL",
    icon: Hexagon,
    color: "#ec4899",
    colorGlow: "rgba(236, 72, 153, 0.12)",
    description:
      "Schema introspection, auto-complete, variables editor, and schema explorer.",
    preview: `query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
    role
  }
}`,
  },
  {
    name: "gRPC",
    icon: Radio,
    color: "#3b82f6",
    colorGlow: "rgba(59, 130, 246, 0.12)",
    description:
      "Proto file loading, server reflection, unary, streaming, and all call types.",
    preview: `service UserService {
  rpc GetUser (UserReq)
    returns (UserRes);
  rpc ListUsers (Empty)
    returns (stream UserRes);
}`,
  },
  {
    name: "WebSocket",
    icon: MessageSquare,
    color: "#eab308",
    colorGlow: "rgba(234, 179, 8, 0.12)",
    description:
      "Real-time bidirectional messaging with auto-reconnect and message history.",
    preview: `ws://localhost:8080/ws
> {"type": "subscribe",
   "channel": "updates"}
< {"type": "ack",
   "status": "subscribed"}`,
  },
  {
    name: "SSE",
    icon: Rss,
    color: "#06b6d4",
    colorGlow: "rgba(6, 182, 212, 0.12)",
    description:
      "Server-Sent Events with real-time stream viewer and event type filtering.",
    preview: `GET /events
Accept: text/event-stream

event: message
data: {"id": 1, "update":
  "deployment complete"}`,
  },
  {
    name: "MQTT",
    icon: Wifi,
    color: "#8b5cf6",
    colorGlow: "rgba(139, 92, 246, 0.12)",
    description:
      "Publish/subscribe messaging with topic management and QoS levels.",
    preview: `mqtt://broker:1883
Topic: devices/sensor-01
QoS: 1

{"temp": 22.5,
 "humidity": 65}`,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

function ProtocolCard({ protocol }: { protocol: Protocol }) {
  const Icon = protocol.icon;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex min-w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#1e1e2a] bg-[#14141c] transition-all duration-300 hover:border-[#2a2a3a] lg:min-w-0"
      whileHover={{
        boxShadow: `0 0 40px ${protocol.colorGlow}, 0 8px 32px rgba(0, 0, 0, 0.4)`,
        borderColor: `color-mix(in srgb, ${protocol.color} 25%, #1e1e2a)`,
      }}
    >
      {/* Top accent border */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${protocol.color}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-6">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: protocol.colorGlow }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: protocol.color }} />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight text-[#e4e4e7]">
            {protocol.name}
          </h3>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: protocol.color }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="px-6 pt-3 text-sm leading-relaxed text-[#a1a1aa]">
        {protocol.description}
      </p>

      {/* Code preview */}
      <div className="mt-4 px-4 pb-4">
        <div className="relative overflow-hidden rounded-xl border border-[#1a1a24] bg-[#0c0c14] p-4">
          {/* Decorative terminal dots */}
          <div className="mb-3 flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#2a2a3a]" />
            <div className="h-2 w-2 rounded-full bg-[#2a2a3a]" />
            <div className="h-2 w-2 rounded-full bg-[#2a2a3a]" />
          </div>

          <pre className="overflow-hidden text-xs leading-relaxed">
            <code className="text-[#71717a]">{protocol.preview}</code>
          </pre>

          {/* Glow overlay on hover */}
          <div
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(ellipse at bottom, ${protocol.colorGlow}, transparent 70%)`,
            }}
          />
        </div>
      </div>

      {/* Corner glow on hover */}
      <div
        className="pointer-events-none absolute -left-px -top-px h-24 w-24 rounded-tl-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top left, ${protocol.colorGlow}, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

export function Protocols() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="protocols"
      className="relative overflow-hidden px-6 py-32"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/4 h-[500px] w-[600px] rounded-full bg-[#8b5cf6]/[0.03] blur-[120px]" />
        <div className="absolute right-1/4 top-0 h-[500px] w-[600px] rounded-full bg-[#3b82f6]/[0.03] blur-[120px]" />
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
            Every protocol.{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#a78bfa] bg-clip-text text-transparent">
              One unified interface.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#71717a]">
            REST, GraphQL, gRPC, WebSocket, SSE, and MQTT in the same app. No
            tab-switching between tools.
          </p>
        </motion.div>

        {/* Protocol cards - horizontal scroll on mobile, grid on desktop */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none lg:hidden">
            {protocols.map((protocol) => (
              <ProtocolCard key={protocol.name} protocol={protocol} />
            ))}
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden grid-cols-3 gap-4 lg:grid">
            {protocols.map((protocol) => (
              <ProtocolCard key={protocol.name} protocol={protocol} />
            ))}
          </div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          className="mt-12 text-center text-sm text-[#52525b]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          All protocols share the same scripting engine, environment variables,
          and collection structure.
        </motion.p>
      </div>
    </section>
  );
}
