import Link from "next/link";
import { categories } from "@/data/catalog";
import { site, telHref, whatsappLink } from "@/content/site";
import { href, tr } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import s from "./Footer.module.css";

export async function Footer() {
  const { lang, t } = await getI18n();
  const h = (p: string) => href(lang, p);
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.grid}`}>
        <div className={s.brand}>
          <Logo />
          <p className={s.about}>{t.footer.about}</p>
          <div className={s.social}>
            <a href={whatsappLink(t.header.waHello)} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <Icon name="whatsapp" />
            </a>
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Icon name="instagram" />
            </a>
            <a href={site.map} target="_blank" rel="noreferrer" aria-label="2GIS">
              <Icon name="pin" />
            </a>
          </div>
        </div>

        <nav aria-label={t.footer.catalog} className={s.col}>
          <p className={s.title}>{t.footer.catalog}</p>
          {categories.map((c) => (
            <Link key={c.id} href={h(`/catalog/${c.id}`)}>
              {tr(c.name, lang)}
            </Link>
          ))}
        </nav>

        <nav aria-label={t.footer.buyers} className={s.col}>
          <p className={s.title}>{t.footer.buyers}</p>
          <Link href={h("/akcii")}>{t.nav.sale}</Link>
          <Link href={h("/novinki")}>{t.nav.news}</Link>
          <Link href={h("/na-zakaz")}>{t.nav.order}</Link>
          <Link href={h("/media")}>{t.nav.media}</Link>
          <Link href={h("/o-nas")}>{t.nav.about}</Link>
          <Link href={h("/dostavka")}>{t.nav.delivery}</Link>
          <Link href={h("/uslugi")}>{t.nav.services}</Link>
        </nav>

        <div className={s.col}>
          <p className={s.title}>{t.footer.salon}</p>
          <a href={site.map} target="_blank" rel="noreferrer">
            {t.site.city}, {t.site.address}
          </a>
          <a href={telHref(site.phone)} className={s.phone}>
            {site.phone}
          </a>
          <span className={s.dim}>{t.site.hours}</span>
          <Link href={h("/kontakty")}>{t.nav.contacts}</Link>
        </div>
      </div>
      <div className="wrap">
        <div className={s.base}>
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <nav aria-label={t.footer.legal} className={s.legal}>
            <Link href={h("/privacy")}>{t.legal.privacy}</Link>
            <Link href={h("/cookies")}>{t.legal.cookies}</Link>
            <Link href={h("/oferta")}>{t.legal.offer}</Link>
            <Link href={h("/vozvrat")}>{t.legal.returns}</Link>
          </nav>
          <span>{t.footer.colorNote}</span>
        </div>
      </div>
    </footer>
  );
}
