import { tr, type L, type Lang } from "@/i18n/config";
import { attr, categoryById, subtypeById, type PatternKind, type Tone, type Unit } from "./catalog";

// Товар магазина. Данные приходят из CRM (src/lib/catalog-source.ts) ровно в этой форме;
// без CRM — демо-каталог из ./demo-products.ts.

export type Product = {
  id: string;
  sku: string;
  /** Каталог: "stock" — в наличии (основной), "order" — на заказ (раздел «На заказ»). Нет — stock. */
  kind?: "stock" | "order";
  category: string;
  subtype?: string;
  brand: string;
  country?: L;
  collection: string;
  decor: L;
  tone: Tone;
  pattern: PatternKind;
  length?: number;
  width?: number;
  thickness?: number;
  /** Формат, если не доска: «рулон 4 м», «10 кг» */
  format?: L;
  cls?: string;
  chamfer?: keyof typeof attr.chamfer;
  connection?: keyof typeof attr.connection;
  finish?: keyof typeof attr.finish;
  wood?: keyof typeof attr.wood;
  warmFloor?: boolean;
  waterproof?: boolean;
  /** Подпись к влагостойкости, если известна точно: «до 48 ч» */
  waterNote?: L;
  packM2?: number;
  packPcs?: number;
  price: number;
  oldPrice?: number;
  /** Остаток на складе в единицах продажи; 0 — под заказ */
  stock: number;
  isNew?: boolean;
  seed: number;
  /** Фото из CRM; первое — обложка. Нет фото — рисуется раскладка (ProductImage). */
  images?: { id: string; alt?: L }[];
  description?: L;
  /** Свободные характеристики сверх полей выше: гарантия, сертификат… */
  specs?: { name: L; value: L }[];
};

/** Адрес фото товара. Картинки идут через сайт (rewrite /catalog-media → CRM в next.config.ts),
 *  а не напрямую из CRM: у браузера один домен, а адрес CRM бывает внутренним. */
export function imageUrl(id: string) {
  return `/catalog-media/${id}`;
}

export function discount(p: Product) {
  return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
}

export function unitOf(p: Product): Unit {
  return categoryById[p.category].unit;
}

const MM: L = { ru: "мм", kk: "мм", en: "mm" };

export function sizeOf(p: Product, lang: Lang) {
  if (p.length && p.width && p.thickness) {
    const t = lang === "en" ? String(p.thickness) : String(p.thickness).replace(".", ",");
    return `${p.length} × ${p.width} × ${t} ${tr(MM, lang)}`;
  }
  return tr(p.format, lang);
}

export function subtypeName(p: Product, lang: Lang) {
  const s = subtypeById(p.category, p.subtype);
  return s ? tr(s.name, lang) : undefined;
}

const KIND: Record<string, L> = {
  parket: { ru: "Паркетная доска", kk: "Паркет тақтасы", en: "Parquet board" },
  "parket:geometricheskij": { ru: "Паркет геометрический", kk: "Геометриялық паркет", en: "Geometric parquet" },
  "parket:modulnyj": { ru: "Модульный паркет", kk: "Модульдік паркет", en: "Modular parquet" },
  laminat: { ru: "Ламинат", kk: "Ламинат", en: "Laminate" },
  "kvarcvinil:zamkovyj": { ru: "Кварцвинил SPC", kk: "Кварцвинил SPC", en: "SPC vinyl" },
  "kvarcvinil:kleevoj": { ru: "Кварцвинил LVT", kk: "Кварцвинил LVT", en: "LVT vinyl" },
  kovrolin: { ru: "Ковролин", kk: "Кілемше жабын", en: "Carpet" },
  podlozhka: { ru: "Подложка", kk: "Төсеме", en: "Underlay" },
  klej: { ru: "Клей", kk: "Желім", en: "Adhesive" },
  plintus: { ru: "Плинтус", kk: "Плинтус", en: "Skirting" },
};

/** «Ламинат, Палуба, Натур (LA-0001)» — собирается под язык */
export function productName(p: Product, lang: Lang) {
  const kind = tr(KIND[`${p.category}:${p.subtype}`] ?? KIND[p.category], lang);
  if (p.format) return `${kind}, ${tr(p.format, lang)}`;
  const parts = [kind];
  const sub = p.category === "parket" && ["geometricheskij", "modulnyj"].includes(p.subtype ?? "") ? undefined : subtypeName(p, lang);
  if (sub && p.category !== "kvarcvinil") parts.push(sub);
  if (p.wood) parts.push(tr(attr.wood[p.wood], lang));
  parts.push(`${tr(p.decor, lang)} (${p.sku})`);
  return parts.join(", ");
}
