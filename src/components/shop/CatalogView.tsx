"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { categories, categoryById } from "@/data/catalog";
import { products } from "@/data/products";
import { fmt } from "@/i18n";
import { href, tr } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import { facetOptions, facets, filterProducts, list, matchesQuery, queryText, sortProducts, SORTS, type Query, type Sort } from "@/lib/shop";
import { Breadcrumbs } from "./Breadcrumbs";
import { Filters, SortSelect, type FacetView } from "./Filters";
import { ProductGrid } from "./ProductCard";
import s from "./CatalogView.module.css";

// Общая страница-список: раздел каталога, поиск, акции, новинки.
// Сайт статический, поэтому фильтры читаются из query-строки в браузере:
// страница передаёт только «область» (scope), остальное считается здесь.
// Поиск устроен так же, как раздел: заголовок, чипы, фильтры слева — меняется только
// содержимое. Чипы в поиске — разделы, где нашлись товары; фасеты — только по найденному.

const PER_PAGE = 24;

export type Scope = { kind: "all" } | { kind: "category"; id: string } | { kind: "sale" } | { kind: "new" };

type Props = {
  title: string;
  intro?: ReactNode;
  /** Блок над списком — у акций; показывается, пока фильтры не тронуты */
  hero?: ReactNode;
  scope: Scope;
  /** Сортировка по умолчанию — у акций «по скидке» */
  defaultSort?: Sort;
  crumbs: { href?: string; label: string }[];
  basePath: string;
};

function scopeProducts(scope: Scope) {
  switch (scope.kind) {
    case "category":
      return products.filter((p) => p.category === scope.id);
    case "sale":
      return products.filter((p) => p.oldPrice);
    case "new":
      return products.filter((p) => p.isNew);
    default:
      return products;
  }
}

export function CatalogView(props: Props) {
  // useSearchParams на статике требует Suspense: до гидрации — список без фильтров
  return (
    <Suspense fallback={<CatalogInner {...props} query={{}} />}>
      <WithQuery {...props} />
    </Suspense>
  );
}

function WithQuery(props: Props) {
  const params = useSearchParams();
  const query: Query = {};
  params.forEach((v, k) => {
    query[k] = v;
  });
  return <CatalogInner {...props} query={query} />;
}

function CatalogInner({ title, intro, hero, scope, defaultSort, crumbs, basePath, query: raw }: Props & { query: Query }) {
  const { lang, t } = useI18n();
  const all = scopeProducts(scope);
  const category = scope.kind === "category" ? categoryById[scope.id] : undefined;
  const query: Query = defaultSort && !raw.sort ? { ...raw, sort: defaultSort } : raw;
  const touched = Object.keys(raw).length > 0;
  const text = queryText(query);
  const searching = Boolean(text);
  const base = searching ? all.filter((p) => matchesQuery(p, text)) : all;

  const items = sortProducts(filterProducts(base, query), (query.sort as Sort) ?? "popular");
  const page = Math.max(1, Number(query.page) || 1);
  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const shown = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const views: FacetView[] = facets
    .map((f) => ({ key: f.key, title: t.facets[f.key], options: facetOptions(base, query, f, lang, t), swatch: f.key === "color" }))
    .filter((f) => f.options.length > 1 || (f.options.length === 1 && (f.key === "warm" || f.key === "water")));

  const prices = base.map((p) => p.price);
  const priceRange: [number, number] = prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0];
  const types = list(query, "type");
  const cat = typeof query.cat === "string" ? query.cat : "";

  const qs = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) if (typeof v === "string" && k !== "page") p.set(k, v);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) p.delete(k);
      else p.set(k, v);
    }
    const s = p.toString();
    return href(lang, s ? `${basePath}?${s}` : basePath);
  };

  // Чипы: в разделе — виды укладки, в поиске — разделы, где что-то нашлось
  const searchCats = searching
    ? categories.map((c) => ({ c, n: base.filter((p) => p.category === c.id).length })).filter((x) => x.n > 0)
    : [];

  return (
    <div className="wrap">
      <Breadcrumbs items={searching ? [{ label: t.catalog.searchCrumb }] : crumbs} />
      <div className={s.head}>
        <h1 className={s.title}>{searching ? fmt(t.catalog.searchTitle, { q: text }) : title}</h1>
        {searching ? (
          <Link href={href(lang, basePath)} className={s.clear}>
            × {t.catalog.clearSearch}
          </Link>
        ) : intro ? (
          <div className={s.intro}>{intro}</div>
        ) : null}
      </div>

      {touched ? null : hero}

      {category?.subtypes.length ? (
        <nav className={s.chips} aria-label={t.catalog.kindNav}>
          <Link href={qs({ type: null })} aria-current={!types.length ? "true" : undefined}>
            {t.catalog.allChip}
          </Link>
          {category.subtypes.map((st) => (
            <Link key={st.id} href={qs({ type: st.id })} aria-current={types.length === 1 && types[0] === st.id ? "true" : undefined}>
              {tr(st.name, lang)}
            </Link>
          ))}
        </nav>
      ) : null}

      {searchCats.length > 1 ? (
        <nav className={s.chips} aria-label={t.catalog.searchIn}>
          <Link href={qs({ cat: null })} aria-current={!cat ? "true" : undefined}>
            {t.catalog.allChip} <span className={s.chipN}>{base.length}</span>
          </Link>
          {searchCats.map(({ c, n }) => (
            <Link key={c.id} href={qs({ cat: c.id })} aria-current={cat === c.id ? "true" : undefined}>
              {tr(c.name, lang)} <span className={s.chipN}>{n}</span>
            </Link>
          ))}
        </nav>
      ) : null}

      <div className={s.layout}>
        {/* На телефоне фильтры свёрнуты под кнопку, на десктопе — колонка слева */}
        <aside className={s.side} aria-label={t.catalog.filters}>
          <Suspense>
            <Filters facets={views} priceRange={priceRange} />
          </Suspense>
        </aside>
        <details className={s.mobileFilters}>
          <summary className={s.sideToggle}>{t.catalog.filtersMobile}</summary>
          <Suspense>
            <Filters facets={views} priceRange={priceRange} />
          </Suspense>
        </details>

        <div className={s.results}>
          <div className={s.bar}>
            <p className={s.count}>
              {t.catalog.found}: <b>{items.length}</b>
            </p>
            <Suspense>
              <SortSelect sorts={SORTS.map((id) => ({ id, name: t.sorts[id] }))} />
            </Suspense>
          </div>
          <ProductGrid
            products={shown}
            empty={
              <div className={s.empty}>
                <p className={s.emptyTitle}>{searching && !base.length ? fmt(t.catalog.searchEmptyTitle, { q: text }) : t.catalog.emptyTitle}</p>
                <p>{searching && !base.length ? t.catalog.searchEmptyText : t.catalog.emptyText}</p>
                <Link href={href(lang, "/na-zakaz")}>{t.catalog.emptyLink}</Link>
              </div>
            }
          />
          {pages > 1 ? (
            <nav className={s.pages} aria-label={t.catalog.pages}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={qs({ page: n > 1 ? String(n) : null })} aria-current={n === page ? "page" : undefined}>
                  {n}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
