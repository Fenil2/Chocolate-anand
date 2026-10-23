import type { Metadata, Viewport } from "next";
import { Bodoni_Moda } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";
import { Providers } from "@/components/Providers";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

// Truly static Jost files (Fontsource, OFL). Google serves Jost as a variable font whose default
// instance is Thin (100); engines that can't vary it (some WebKit builds) render every weight hairline.
const jost = localFont({
  src: [
    { path: "./fonts/jost-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jost-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jost",
  display: "swap",
  fallback: ["Futura", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  // PLACEHOLDER: set NEXT_PUBLIC_SITE_URL to the production domain.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
    images: [{ url: "/images/mora/hero-bar.jpg", width: 1254, height: 854, alt: "MORA 70% dark chocolate bar with cocoa beans" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/mora/hero-bar.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#090807",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2 focus:text-obsidian"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
