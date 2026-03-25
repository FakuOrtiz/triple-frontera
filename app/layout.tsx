import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Triple Frontera",
  description: "Tu guía para Iguazú, Ciudad del Este y Foz do Iguaçu",
  icons: {
    icon: [
      { url: "/triple-frontera-logo.png?v=2", type: "image/png" },
      { url: "/triple-frontera-logo.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/triple-frontera-logo.png?v=2", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/triple-frontera-logo.png?v=2", sizes: "180x180" }],
    shortcut: ["/triple-frontera-logo.png?v=2"],
  },
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.className} h-full antialiased dark bg-black`}>
      <head>
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white tabular-nums">{children}</body>
    </html>
  );
}
