import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talkia | Agentes de voz con IA",
  description:
    "Talkia te permite crear agentes de voz inteligentes capaces de mantener conversaciones humanas en tiempo real. Integra llamadas, asistentes virtuales y experiencias de voz impulsadas por IA, similares a ElevenLabs o VAPI.",
  keywords: [
    "Talkia",
    "voz IA",
    "text to speech",
    "agentes de voz",
    "asistentes virtuales",
    "IA conversacional",
    "ElevenLabs",
    "VAPI",
    "voz natural",
    "speech synthesis",
  ],
  authors: [{ name: "Talkia" }],
  openGraph: {
    title: "Talkia — Crea agentes de voz con inteligencia artificial",
    description:
      "Genera voces naturales, conversa en tiempo real y construye experiencias de voz con IA. Talkia es la plataforma para crear tus propios agentes conversacionales.",
    url: "https://talkia.co",
    siteName: "Talkia",
    images: [
      {
        url: "https://talkia.ai/logo.svg",
        width: 1200,
        height: 630,
        alt: "Talkia — Agentes de voz IA",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talkia — Agentes de voz con IA",
    description:
      "Crea experiencias de voz naturales impulsadas por inteligencia artificial.",
    // images: ["https://talkia.ai/og-image.jpg"],
  },
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
