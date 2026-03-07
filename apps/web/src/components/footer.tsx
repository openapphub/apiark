import { Github, Twitter } from "lucide-react";

const sections = [
  {
    title: "Product",
    links: [
      { name: "Download", href: "/download" },
      { name: "Pricing", href: "/pricing" },
      { name: "Changelog", href: "/changelog" },
      { name: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Compare",
    links: [
      { name: "vs Postman", href: "/compare/postman" },
      { name: "vs Bruno", href: "/compare/bruno" },
      { name: "vs Insomnia", href: "/compare/insomnia" },
      { name: "vs Hoppscotch", href: "/compare/hoppscotch" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "GitHub", href: "https://github.com/berbicanes/apiark" },
      { name: "Documentation", href: "/docs" },
      { name: "CLI Reference", href: "/docs/cli" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Security", href: "/security" },
    ],
  },
];

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/berbicanes/apiark",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://x.com/apiark",
    icon: Twitter,
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            {/* Logo + tagline */}
            <div className="col-span-2">
              <a href="/" className="inline-flex items-center gap-2.5">
                <img
                  src="/logo.svg"
                  alt="ApiArk"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-lg font-bold text-white">ApiArk</span>
              </a>
              <p className="mt-4 text-sm text-zinc-500 max-w-xs leading-relaxed">
                Local-first API development. No login. No cloud. No bloat.
              </p>
              <div className="mt-6 flex items-center gap-4">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-[18px] h-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation columns */}
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-zinc-300 tracking-wide">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} ApiArk. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Built with Tauri, React, and Rust.
          </p>
        </div>
      </div>
    </footer>
  );
}
