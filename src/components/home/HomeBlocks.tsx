import Link from "next/link";
import { tonePalette, type PatternKind, type Tone } from "@/data/catalog";
import { categoryById, subtypeById } from "@/data/catalog";
import { videos } from "@/data/media";
import { site, telHref, whatsappLink } from "@/content/site";
import { href, tr, type L } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { VideoCard } from "../media/VideoCard";
import { FloorPattern } from "../FloorPattern";
import { Icon, type IconName } from "../site/Icon";
import { MapEmbed } from "../site/MapEmbed";
import ms from "../media/Media.module.css";
import s from "./HomeBlocks.module.css";

// Плитки как у mirparketa: разделы и виды укладки вперемешку — так покупатель и ищет.
const GEO_MOD: L = { ru: "Геометрический и модульный", kk: "Геометриялық және модульдік", en: "Geometric and modular" };
const PALUBA: L = { ru: "Паркет палуба", kk: "Паркет палуба", en: "Plank parquet" };

const tiles: { label: () => L; href: string; pattern: PatternKind; tone: Tone; wide?: boolean }[] = [
  { label: () => categoryById.parket.name, href: "/catalog/parket", pattern: "herringbone", tone: "brown", wide: true },
  { label: () => categoryById.laminat.name, href: "/catalog/laminat", pattern: "deck", tone: "beige" },
  { label: () => categoryById.kvarcvinil.menu, href: "/catalog/kvarcvinil", pattern: "deck", tone: "grey" },
  { label: () => subtypeById("parket", "anglijskaya-elka")!.name, href: "/catalog/parket?type=anglijskaya-elka", pattern: "herringbone", tone: "natural" },
  { label: () => subtypeById("parket", "francuzskaya-elka")!.name, href: "/catalog/parket?type=francuzskaya-elka", pattern: "chevron", tone: "light" },
  { label: () => PALUBA, href: "/catalog/parket?type=paluba", pattern: "deck", tone: "natural", wide: true },
  { label: () => GEO_MOD, href: "/catalog/parket?type=geometricheskij,modulnyj", pattern: "geometric", tone: "dark", wide: true },
  { label: () => categoryById.kovrolin.name, href: "/catalog/kovrolin", pattern: "carpet", tone: "grey" },
  { label: () => categoryById.podlozhka.name, href: "/catalog/podlozhka", pattern: "underlay", tone: "beige" },
  { label: () => categoryById.klej.name, href: "/catalog/klej", pattern: "adhesive", tone: "light" },
  { label: () => categoryById.plintus.name, href: "/catalog/plintus", pattern: "skirting", tone: "light" },
];

const WOODEN = new Set<PatternKind>(["deck", "herringbone", "chevron", "geometric"]);

export async function CategoryTiles() {
  const { lang, t } = await getI18n();
  return (
    <section className={`wrap ${s.section}`} aria-labelledby="tiles-t">
      <h2 id="tiles-t" className={s.h2}>
        {t.home.catalog}
      </h2>
      <div className={s.tiles}>
        {tiles.map((tl, i) => {
          const label = tr(tl.label(), lang);
          return (
            <Link key={tl.href} href={href(lang, tl.href)} className={`${s.tile} ${tl.wide ? s.wide : ""}`}>
              {WOODEN.has(tl.pattern) ? (
                <FloorPattern kind={tl.pattern} variant="wood" width={tl.wide ? 600 : 300} height={300} palette={tonePalette(tl.tone)} seam="var(--tone-seam)" seed={i * 5} className={s.tileArt} />
              ) : (
                <span className={s.tileArt} style={{ background: `var(--tone-${tl.tone}-2)`, color: "var(--tone-seam)" }}>
                  <FloorPattern kind={tl.pattern} width={150} height={150} />
                </span>
              )}
              <span className={s.tileLabel}>
                {label}
                <Icon name="chevron" size={16} />
              </span>
            </Link>
          );
        })}
        <Link href={href(lang, "/na-zakaz")} className={`${s.tile} ${s.orderTile}`}>
          <span className={s.orderText}>
            <span className={s.orderKicker}>{t.home.notFound}</span>
            <span className={s.orderTitle}>{t.home.bringToOrder}</span>
          </span>
          <span className={s.tileLabel}>
            {t.home.orderCatalog}
            <Icon name="chevron" size={16} />
          </span>
        </Link>
      </div>
    </section>
  );
}

const perkIcons: IconName[] = ["layers", "truck", "box", "shield"];

export async function Perks() {
  const { t } = await getI18n();
  return (
    <section className="wrap" aria-label="STEPLINE">
      <div className={s.perks}>
        {t.perks.map((p, i) => (
          <div key={p.title} className={s.perk}>
            <Icon name={perkIcons[i]} size={28} className={s.perkIcon} />
            <div>
              <p className={s.perkTitle}>{p.title}</p>
              <p className={s.perkText}>{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function SectionHead({ id, title, href: to, more }: { id: string; title: string; href?: string; more?: string }) {
  const { lang } = await getI18n();
  return (
    <div className={s.head}>
      <h2 id={id} className={s.h2}>
        {title}
      </h2>
      {to ? (
        <Link href={href(lang, to)} className={s.more}>
          {more}
          <Icon name="chevron" size={16} />
        </Link>
      ) : null}
    </div>
  );
}

export async function MediaStrip() {
  const { t } = await getI18n();
  return (
    <section className={`wrap ${s.section}`} aria-labelledby="media-t">
      <SectionHead id="media-t" title={t.home.media} href="/media" more={t.home.allMedia} />
      <div className={ms.videos}>
        {videos.slice(0, 4).map((v, i) => (
          <VideoCard key={v.code} video={v} index={i} />
        ))}
      </div>
    </section>
  );
}

export async function Salon() {
  const { t } = await getI18n();
  return (
    <section className={`wrap ${s.section}`} aria-labelledby="salon-t">
      <div className={s.salon}>
        <div className={s.salonText}>
          <h2 id="salon-t" className={s.h2}>
            {t.home.salonTitle}
          </h2>
          <p className={s.salonLead}>{t.home.salonLead}</p>
          <dl className={s.salonList}>
            <div>
              <dt>{t.home.address}</dt>
              <dd>
                {t.site.city}, {t.site.address}
                <span className={s.dim}>{t.site.district}</span>
              </dd>
            </div>
            <div>
              <dt>{t.home.phone}</dt>
              <dd>
                <a href={telHref(site.phone)}>{site.phone}</a>
              </dd>
            </div>
            <div>
              <dt>{t.home.hours}</dt>
              <dd>{t.site.hours}</dd>
            </div>
            <div>
              <dt>2ГИС</dt>
              <dd>{t.site.rating}</dd>
            </div>
          </dl>
          <div className={s.salonActions}>
            <a href={site.map} target="_blank" rel="noreferrer" className={s.btn}>
              {t.home.route}
            </a>
            <a href={whatsappLink(t.home.bookVisitText)} target="_blank" rel="noreferrer" className={s.link}>
              {t.home.bookVisit}
            </a>
          </div>
        </div>
        <div className={s.salonMap}>
          <MapEmbed />
        </div>
      </div>
    </section>
  );
}

export async function AboutText() {
  const { t } = await getI18n();
  return (
    <section className={`wrap ${s.about}`} aria-labelledby="about-t">
      <h2 id="about-t" className={s.h3}>
        {t.home.aboutTitle}
      </h2>
      <div className={s.aboutCols}>
        {t.home.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
