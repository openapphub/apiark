import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "ApiArk — Local-First API Development Platform",
  description:
    "The API platform that respects your privacy, your RAM, and your Git workflow. Local-first. Native-speed. Zero login. Full power. The open-source Postman alternative.",
  keywords: [
    "API client",
    "Postman alternative",
    "REST client",
    "GraphQL",
    "gRPC",
    "local-first",
    "open source",
  ],
  openGraph: {
    title: "ApiArk — No Login. No Cloud. No Bloat.",
    description:
      "Local-first API development platform. 10x less RAM than Postman. Open source.",
    type: "website",
    url: "https://apiark.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApiArk — Local-First API Development Platform",
    description:
      "The open-source Postman alternative. 50MB RAM. <2s startup. Zero login.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="noise">
        {children}
      </body>
    </html>
  );
}
