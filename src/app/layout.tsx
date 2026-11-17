import type { Metadata, Viewport } from "next";
import { Amiri, Cinzel, Cormorant_Garamond, Great_Vibes, IM_Fell_English, Inter, Pinyon_Script } from "next/font/google";
import { wedding } from "@/config/wedding";
import { siteUrl } from "@/lib/site";
import { Providers } from "@/components/layout/Providers";
import { OPENED_KEY } from "@/lib/constants";
import "./globals.css";

const cinzel = Cinzel({ variable: "--font-cinzel-face", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const fell = IM_Fell_English({ variable: "--font-fell-face", subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const vibes = Great_Vibes({ variable: "--font-vibes-face", subsets: ["latin"], weight: "400", display: "swap" });
const inter = Inter({ variable: "--font-inter-face", subsets: ["latin"], display: "swap" });
const pinyon = Pinyon_Script({ variable: "--font-pinyon-face", subsets: ["latin"], weight: "400", display: "swap" });
const amiri = Amiri({ variable: "--font-amiri-face", subsets: ["arabic"], weight: ["400", "700"], display: "swap", preload: false });

const { seo } = wedding;

/**
 * Runs before paint: returning guests (same tab session) and ?open=1 skip the
 * gate; everyone else gets the scroll lock straight away (no flash of the site).
 */
const gateScript = `try{var d=document.documentElement,o=new URL(location.href).searchParams.get("open")==="1"||sessionStorage.getItem(${JSON.stringify(OPENED_KEY)})==="1";if(o)d.setAttribute("data-opened","");else d.setAttribute("data-gate","closed")}catch(e){document.documentElement.setAttribute("data-gate","closed")}`;

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: seo.title,
  description: seo.description,
  applicationName: seo.title,
  alternates: { canonical: "/" },
  robots: seo.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    url: "/",
    siteName: seo.title,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#090b12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${cinzel.variable} ${cormorant.variable} ${fell.variable} ${vibes.variable} ${inter.variable} ${pinyon.variable} ${amiri.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: gateScript }} />
        <noscript>
          <style>{`[data-gate-overlay]{display:none!important}html body{overflow:auto!important}`}</style>
        </noscript>
      </head>
      {/* data-wand: the wand cursor (and sparkle trail on desktop) everywhere. */}
      <body data-wand>
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[200] bg-parchment px-4 py-2 font-sans text-sm text-ink">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
