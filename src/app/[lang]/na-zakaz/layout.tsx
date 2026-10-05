import type { Metadata } from "next";
import Link from "next/link";
import { site, telHref, whatsappLink } from "@/content/site";
import { Icon } from "@/components/site/Icon";
import { LogoMark } from "@/components/site/Logo";
import { getDict } from "@/i18n";
import { href, isLang } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import s from "./order.module.css";

export async function generateMetadata({ params }: LayoutProps<"/[lang]/na-zakaz">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return { title: t.order.metaTitle, description: t.order.metaDescription };
}

// Отдельный формат: своя тема (data-theme="order"), своя шапка и подвал,
// без меню магазина — чтобы раздел ощущался как другой продукт.
export default async function OrderLayout({ children }: LayoutProps<"/[lang]/na-zakaz">) {
  const { lang, t } = await getI18n();
  return (
    <div data-theme="order" className={s.shell}>
      <header className={s.header}>
        <div className={`wrap ${s.headerRow}`}>
          <Link href={href(lang, "/na-zakaz")} className={s.brand}>
            <LogoMark className={s.brandMark} />
            <span className={s.brandName}>{site.name}</span>
            <span className={s.brandSep} aria-hidden />
            <span className={s.brandSub}>{t.order.brandSub}</span>
          </Link>
          <nav className={s.headerNav} aria-label={t.order.brandSub}>
            <a href="#kollekcii">{t.order.navCollections}</a>
            <a href="#kak">{t.order.navHow}</a>
            <a href="#zapros">{t.order.navRequest}</a>
          </nav>
          <Link href={href(lang, "/")} className={s.back}>
            <Icon name="arrowLeft" size={16} />
            {t.order.toShop}
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className={s.footer}>
        <div className={`wrap ${s.footerRow}`}>
          <p>
            {site.name} · {t.site.city}, {t.site.address} · {t.site.hours}
          </p>
          <a href={telHref(site.phone)}>{site.phone}</a>
          <a href={whatsappLink(t.order.waQuestion)} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <Link href={href(lang, "/catalog")}>{t.order.inStockCatalog}</Link>
        </div>
      </footer>
    </div>
  );
}
