import type { Metadata } from "next";
import {
  Commissioner,
  Cormorant_Garamond,
  Geologica,
  Golos_Text,
  IBM_Plex_Sans,
  JetBrains_Mono,
  Montserrat,
  Literata,
  Onest,
  Prata,
} from "next/font/google";
import { presetBootScript, presetCss } from "@/design/presets";
import { notFound } from "next/navigation";
import { PresetBadge } from "@/components/PresetBadge";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Analytics } from "@/components/site/Analytics";
import { I18nProvider } from "@/i18n/client";
import { LANGS, LANG_HTML, isLang } from "@/i18n/config";
import { getDict } from "@/i18n";
import { SITE_URL } from "@/content/site";
import "@/styles/globals.css";

// Основной пресет «Stepline» (Geologica + Onest) грузится сразу; шрифты остальных пресетов —
// без preload, браузер скачает их только когда пресет включён.
const cormorant = Cormorant_Garamond({ variable: "--ff-cormorant", subsets: ["latin", "cyrillic"], weight: ["500", "600"], preload: false });
const plex = IBM_Plex_Sans({ variable: "--ff-plex", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], preload: false });
const jetbrains = JetBrains_Mono({ variable: "--ff-jetbrains", subsets: ["latin", "cyrillic"], weight: ["400"] });

const geologica = Geologica({ variable: "--ff-geologica", subsets: ["latin", "cyrillic"], weight: ["600", "700"] });
const golos = Golos_Text({ variable: "--ff-golos", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], preload: false });
const prata = Prata({ variable: "--ff-prata", subsets: ["latin", "cyrillic"], weight: ["400"], preload: false });
const commissioner = Commissioner({ variable: "--ff-commissioner", subsets: ["latin", "cyrillic"], weight: ["300", "400", "500"], preload: false });
const literata = Literata({ variable: "--ff-literata", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], preload: false });
// Montserrat — только для надписи логотипа STEPLINE
const montserrat = Montserrat({ variable: "--ff-montserrat", subsets: ["latin"], weight: ["600"] });
const onest = Onest({ variable: "--ff-onest", subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"] });

const fontVars = [montserrat, cormorant, plex, jetbrains, geologica, golos, prata, commissioner, literata, onest]
  .map((f) => f.variable)
  .join(" ");

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: `%s — STEPLINE` },
    description: t.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(LANGS.map((l) => [LANG_HTML[l], `/${l}`])),
    },
    openGraph: {
      type: "website",
      siteName: "STEPLINE",
      locale: lang === "kk" ? "kk_KZ" : lang === "en" ? "en_US" : "ru_KZ",
      images: [{ url: "/brand/og.png", width: 1200, height: 630 }],
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={LANG_HTML[lang]} className={fontVars} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: presetCss() }} />
        <script dangerouslySetInnerHTML={{ __html: presetBootScript }} />
      </head>
      <body>
        <I18nProvider lang={lang}>
          {children}
          <CookieBanner />
          <Analytics />
          <PresetBadge />
        </I18nProvider>
      </body>
    </html>
  );
}
