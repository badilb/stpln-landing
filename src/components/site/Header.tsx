import Link from "next/link";
import { Suspense } from "react";
import { categories, tones } from "@/data/catalog";
import { site, telHref, whatsappLink } from "@/content/site";
import { href, tr } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { HeaderCounters } from "./HeaderCounters";
import { Icon } from "./Icon";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";
import s from "./Header.module.css";

export async function Header() {
  const { lang, t } = await getI18n();
  const h = (p: string) => href(lang, p);
  const info = [
    { href: "/o-nas", label: t.nav.about },
    { href: "/dostavka", label: t.nav.delivery },
    { href: "/uslugi", label: t.nav.services },
    { href: "/media", label: t.nav.media },
    { href: "/kontakty", label: t.nav.contacts },
  ];

  return (
    <header className={s.header}>
      {/* Верхняя полоса: адрес, часы, справочные страницы, язык */}
      <div className={s.topbar}>
        <div className={`wrap ${s.topRow}`}>
          <a href={site.map} target="_blank" rel="noreferrer" className={s.where}>
            <Icon name="pin" size={16} />
            {t.site.city}, {t.site.address}
          </a>
          <span className={s.hours}>{t.site.hours}</span>
          <nav className={s.info} aria-label={t.nav.about}>
            {info.map((l) => (
              <Link key={l.href} href={h(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Suspense>
            <LangSwitch />
          </Suspense>
        </div>
      </div>

      {/* Основная строка: лого, поиск, контакты, сравнение, корзина */}
      <div className={`wrap ${s.main}`}>
        <Logo />

        <Suspense>
          <SearchBox className={s.search} />
        </Suspense>

        <div className={s.contacts}>
          <a href={telHref(site.phone)} className={s.phone}>
            {site.phone}
          </a>
          <a href={whatsappLink(t.header.waHello)} target="_blank" rel="noreferrer" className={s.wa}>
            <Icon name="whatsapp" size={16} />
            {t.header.whatsapp}
          </a>
        </div>

        <HeaderCounters />

        <details className={s.burger}>
          <summary aria-label={t.nav.menu}>
            <Icon name="menu" size={24} />
          </summary>
          <div className={s.sheet}>
            {categories.map((c) => (
              <Link key={c.id} href={h(`/catalog/${c.id}`)}>
                {tr(c.name, lang)}
              </Link>
            ))}
            <Link href={h("/novinki")}>{t.nav.news}</Link>
            <Link href={h("/akcii")} className={s.saleLink}>
              {t.nav.sale}
            </Link>
            <Link href={h("/na-zakaz")} className={s.orderLink}>
              {t.nav.order}
            </Link>
            <hr />
            {info.map((l) => (
              <Link key={l.href} href={h(l.href)}>
                {l.label}
              </Link>
            ))}
            <a href={telHref(site.phone)}>{site.phone}</a>
            <p className={s.sheetHours}>{t.site.hours}</p>
            <Suspense>
              <LangSwitch />
            </Suspense>
          </div>
        </details>
      </div>

      {/* На телефоне поиск — отдельной строкой, всегда под рукой */}
      <div className={`wrap ${s.mobileSearchRow}`}>
        <Suspense>
          <SearchBox className={s.mobileSearch} />
        </Suspense>
      </div>

      {/* Меню каталога с выпадающими видами и цветами, без JS */}
      <nav className={s.menu} aria-label={t.nav.catalog}>
        <ul className={`wrap ${s.menuRow}`}>
          {categories.map((c) => (
            <li key={c.id} className={s.item}>
              <Link href={h(`/catalog/${c.id}`)} className={s.top}>
                {tr(c.menu, lang)}
              </Link>
              {c.subtypes.length ? (
                <div className={s.drop}>
                  <div>
                    <p className={s.dropTitle}>{t.header.kind}</p>
                    {c.subtypes.map((st) => (
                      <Link key={st.id} href={h(`/catalog/${c.id}?type=${st.id}`)}>
                        {tr(st.name, lang)}
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p className={s.dropTitle}>{t.header.color}</p>
                    {tones.map((tn) => (
                      <Link key={tn.id} href={h(`/catalog/${c.id}?color=${tn.id}`)}>
                        <i className={s.toneDot} style={{ background: `var(--tone-${tn.id}-3)` }} />
                        {tr(tn.name, lang)}
                      </Link>
                    ))}
                  </div>
                  <Link href={h(`/catalog/${c.id}`)} className={s.dropAll}>
                    {t.header.wholeSection} «{tr(c.name, lang)}»
                  </Link>
                </div>
              ) : null}
            </li>
          ))}
          <li className={`${s.item} ${s.split}`}>
            <Link href={h("/novinki")} className={s.top}>
              {t.nav.news} <span className={s.tagNew}>NEW</span>
            </Link>
          </li>
          <li className={s.item}>
            <Link href={h("/akcii")} className={s.top}>
              {t.nav.sale} <span className={s.tagSale}>SALE</span>
            </Link>
          </li>
          <li className={`${s.item} ${s.orderItem}`}>
            <Link href={h("/na-zakaz")} className={s.order}>
              {t.nav.order}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
