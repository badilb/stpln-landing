import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { site, telHref, whatsappLink } from "@/content/site";
import { fmt, type Dict } from "@/i18n";
import { getI18n } from "@/i18n/server";
import { Icon } from "./Icon";
import { MapEmbed } from "./MapEmbed";
import s from "./InfoView.module.css";

type PageKey = keyof Dict["pages"];

export async function InfoView({ page, children, map = false }: { page: PageKey; children?: ReactNode; map?: boolean }) {
  const { t } = await getI18n();
  const p = t.pages[page];
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: p.title }]} />
      <div className={s.layout}>
        <article className={s.article}>
          <h1 className={s.title}>{p.title}</h1>
          <p className={s.lead}>{p.lead}</p>
          {p.sections.map((sec) => (
            <section key={sec.title} className={s.section}>
              <h2 className={s.h2}>{sec.title}</h2>
              {sec.body.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </section>
          ))}
          {map ? (
            <div className={s.map}>
              <MapEmbed />
            </div>
          ) : null}
          {children}
        </article>

        <aside className={s.card} aria-label={fmt(t.info.salon, { name: site.name })}>
          <p className={s.cardTitle}>{fmt(t.info.salon, { name: site.name })}</p>
          <p>
            <Icon name="pin" size={18} /> {t.site.city}, {t.site.address}
          </p>
          <p>
            <Icon name="phone" size={18} /> <a href={telHref(site.phone)}>{site.phone}</a>
          </p>
          <p className={s.dim}>{t.site.hours}</p>
          <a className={s.btn} href={whatsappLink(t.header.waHello)} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={18} /> {t.info.write}
          </a>
          <a className={s.link} href={site.map} target="_blank" rel="noreferrer">
            {t.info.route}
          </a>
          <a className={s.link} href={site.instagram} target="_blank" rel="noreferrer">
            {t.info.ig}
          </a>
        </aside>
      </div>
    </div>
  );
}
