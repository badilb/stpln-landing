import { attr, attrLabel, categoryById, subtypeById, tones, type AttrKey } from "@/data/catalog";
import { discount, productName, products, sizeOf, type Product } from "@/data/products";
import { LANGS, tr, type Lang } from "@/i18n/config";
import type { Dict } from "@/i18n";

// ——— Фильтры каталога: всё живёт в query-строке, как у mirparketa ———

export type Query = Record<string, string | string[] | undefined>;

export type Facet = {
  key: keyof Dict["facets"];
  value: (p: Product) => string | undefined;
  label?: (v: string, lang: Lang, t: Dict) => string;
  order?: (a: string, b: string) => number;
};

const num = (a: string, b: string) => parseFloat(a) - parseFloat(b);
const mm = (v: string, lang: Lang) => `${lang === "en" ? v : v.replace(".", ",")} mm`.replace("mm", lang === "en" ? "mm" : "мм");
const attrFacet = (key: AttrKey) => ({
  value: (p: Product) => p[key as keyof Product] as string | undefined,
  label: (v: string, lang: Lang) => tr(attrLabel(key, v), lang),
  order: (a: string, b: string) => Object.keys(attr[key]).indexOf(a) - Object.keys(attr[key]).indexOf(b),
});

export const facets: Facet[] = [
  {
    key: "type",
    value: (p) => p.subtype,
    label: (v, lang) => {
      for (const c of Object.values(categoryById)) {
        const s = c.subtypes.find((x) => x.id === v);
        if (s) return tr(s.name, lang);
      }
      return v;
    },
  },
  {
    key: "color",
    value: (p) => p.tone,
    label: (v, lang) => tr(tones.find((t) => t.id === v)?.name, lang),
    order: (a, b) => tones.findIndex((t) => t.id === a) - tones.findIndex((t) => t.id === b),
  },
  {
    key: "brand",
    value: (p) => p.brand,
    label: (v, lang) => {
      const p = products.find((x) => x.brand === v);
      return p?.country ? `${v} (${tr(p.country, lang)})` : v;
    },
  },
  { key: "class", value: (p) => p.cls, order: num },
  { key: "thickness", value: (p) => (p.thickness ? String(p.thickness) : undefined), label: (v, lang) => mm(v, lang), order: num },
  { key: "length", value: (p) => (p.length ? String(p.length) : undefined), label: (v, lang) => mm(v, lang), order: num },
  { key: "width", value: (p) => (p.width ? String(p.width) : undefined), label: (v, lang) => mm(v, lang), order: num },
  { key: "chamfer", ...attrFacet("chamfer") },
  { key: "connection", ...attrFacet("connection") },
  { key: "finish", ...attrFacet("finish") },
  { key: "warm", value: (p) => (p.warmFloor ? "yes" : undefined), label: (_, __, t) => t.facets.supports },
  { key: "water", value: (p) => (p.waterproof ? "yes" : undefined), label: (_, __, t) => t.facets.yes },
];

export function list(q: Query, key: string) {
  const v = q[key];
  if (!v) return [];
  return (Array.isArray(v) ? v : v.split(",")).filter(Boolean);
}

export type Sort = "popular" | "cheap" | "expensive" | "discount" | "new";
export const SORTS: Sort[] = ["popular", "cheap", "expensive", "discount", "new"];

/** Поисковая строка товара — на всех языках сразу: «дуб», «oak», «емен» найдут одно и то же */
const haystack = new Map<string, string>();
function searchText(p: Product) {
  let s = haystack.get(p.id);
  if (!s) {
    const c = categoryById[p.category];
    s = LANGS.flatMap((l) => [productName(p, l), tr(c.name, l), tr(subtypeById(p.category, p.subtype)?.name, l), tr(tones.find((t) => t.id === p.tone)?.name, l), sizeOf(p, l)])
      .concat([p.brand, p.collection, p.sku, p.cls ? `${p.cls} класс` : ""])
      .join(" ")
      .toLowerCase()
      .replace(/ё/g, "е");
    haystack.set(p.id, s);
  }
  return s;
}

export function matchesQuery(p: Product, q: string) {
  const words = q.toLowerCase().replace(/ё/g, "е").split(/\s+/).filter(Boolean);
  const text = searchText(p);
  return words.every((w) => text.includes(w));
}

export function queryText(q: Query) {
  return typeof q.q === "string" ? q.q.trim() : "";
}

export function filterProducts(base: Product[], q: Query, skip?: string) {
  const min = Number(q.min) || 0;
  const max = Number(q.max) || Infinity;
  const stock = q.stock === "1";
  const sale = q.sale === "1";
  const cat = typeof q.cat === "string" ? q.cat : "";
  return base.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (p.price < min || p.price > max) return false;
    if (stock && p.stock === 0) return false;
    if (sale && !p.oldPrice) return false;
    for (const f of facets) {
      if (f.key === skip) continue;
      const want = list(q, f.key);
      if (want.length && !want.includes(f.value(p) ?? "")) return false;
    }
    return true;
  });
}

export function sortProducts(items: Product[], sort: Sort) {
  const s = [...items];
  switch (sort) {
    case "cheap":
      return s.sort((a, b) => a.price - b.price);
    case "expensive":
      return s.sort((a, b) => b.price - a.price);
    case "discount":
      return s.sort((a, b) => discount(b) - discount(a));
    case "new":
      return s.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    default:
      return s.sort((a, b) => (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0) || a.seed - b.seed);
  }
}

/** Значения фасета с количеством; пустые значения не показываем, если их не выбрали */
export function facetOptions(base: Product[], q: Query, f: Facet, lang: Lang, t: Dict) {
  const pool = filterProducts(base, q, f.key);
  const counts = new Map<string, number>();
  for (const p of pool) {
    const v = f.value(p);
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  const selected = list(q, f.key);
  const all = new Set(base.map(f.value).filter(Boolean) as string[]);
  return [...all]
    .filter((v) => (counts.get(v) ?? 0) > 0 || selected.includes(v))
    .sort(f.order ?? ((a, b) => a.localeCompare(b, "ru")))
    .map((v) => ({ value: v, label: f.label ? f.label(v, lang, t) : v, count: counts.get(v) ?? 0 }));
}
