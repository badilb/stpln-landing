// Откуда сайт берёт каталог. Только для сервера: в браузер товары приезжают
// пропсами из серверных страниц и через CatalogProvider (src/lib/catalog-client.tsx).
//
// Источник правды — CRM (crm-stpln): GET {CRM_API_URL}/api/v1/public/catalog.
// Ответ лежит в кэше данных Next с тегом "catalog":
//   • менеджер сохранил товар → CRM дёргает POST /api/revalidate → тег сброшен,
//     следующий посетитель получает свежий каталог;
//   • уведомление потерялось → кэш всё равно обновится сам через REVALIDATE секунд;
//   • CRM недоступна → отдаётся последний удачный ответ из кэша.
//
// Без CRM_API_URL (локально без CRM) — демо-каталог, как раньше, с плашкой «Демо-каталог».

import { connection } from "next/server";
import { cache } from "react";
import { applyCategories, categoryById, type Category, type PatternKind, type Tone } from "@/data/catalog";
import { demoProducts } from "@/data/demo-products";
import type { Product } from "@/data/products";
import type { L } from "@/i18n/config";

export const CATALOG_TAG = "catalog";
const REVALIDATE = 600;

/** Текст из CRM: ru обязателен, пустые kk/en сайт берёт из ru (tr() это умеет). */
type T = Partial<L> & { ru: string };

/** Содержимое страниц из CRM («Магазин → Страницы сайта»). Товары — по адресу (slug). */
export type SiteBlocks = {
  home: {
    slides: {
      kicker?: T | null;
      title: T;
      text?: T | null;
      cta?: T | null;
      href: string;
      sale?: string | null;
      product: string | null;
      pattern: PatternKind;
      tone: Tone;
    }[];
    recommend: { category: string; products: string[] }[];
    sale: string[];
    new: string[];
  };
  sale: {
    title?: T | null;
    intro?: T | null;
    featured: { product: string | null; kicker?: T | null; title?: T | null; text?: T | null; cta?: T | null }[];
  };
  new: { title?: T | null; intro?: T | null };
};

export type Catalog = {
  /** Разделы из CRM; пусто — разделы из кода (src/data/catalog.ts). */
  categories: Category[];
  /** Основной каталог — товары «в наличии». Только они в разделах, поиске, акциях, на главной. */
  products: Product[];
  /** Каталог «На заказ» (kind = order): раздел /na-zakaz собирает из них коллекции. */
  orderProducts: Product[];
  /** Страницы из CRM; null — без CRM, сайт берёт свои тексты (src/i18n). */
  blocks: SiteBlocks | null;
  byId: Record<string, Product>;
  /** true — демо-данные, а не каталог из CRM */
  sample: boolean;
};

function index(
  products: Product[],
  sample: boolean,
  categories: Category[] = [],
  blocks: SiteBlocks | null = null,
): Catalog {
  applyCategories(categories);
  // Товар скрытого или удалённого раздела сайт не показывает: без раздела у него нет
  // ни адреса в меню, ни единицы продажи.
  const known = products.filter((p) => categoryById[p.category]);
  const stock = known.filter((p) => p.kind !== "order");
  return {
    categories,
    products: stock,
    orderProducts: known.filter((p) => p.kind === "order"),
    blocks,
    byId: Object.fromEntries(stock.map((p) => [p.id, p])),
    sample,
  };
}

const CRM = process.env.CRM_API_URL?.replace(/\/$/, "");

/** Каталог на этот запрос. cache() — один разбор на рендер, сколько бы компонентов ни спросили. */
export const getCatalog = cache(async (): Promise<Catalog> => {
  if (!CRM) return index(demoProducts, true);
  // Страницы рендерятся на запросе, а не при сборке: при `next build` (в Docker в том
  // числе) CRM обычно недоступна, и в собранные страницы запёкся бы пустой каталог.
  // Сам ответ CRM при этом кэшируется — см. fetch ниже.
  await connection();
  try {
    const res = await fetch(`${CRM}/api/v1/public/catalog`, {
      cache: "force-cache",
      next: { tags: [CATALOG_TAG], revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { products: Product[]; categories: Category[]; blocks: SiteBlocks };
    lastGood = index(body.products, false, body.categories, body.blocks);
    return lastGood;
  } catch (error) {
    // Кэш сброшен (правка в CRM), а CRM как раз недоступна: лучше вчерашние цены,
    // чем страница с ошибкой. Пока процесс жив, держим последний удачный ответ.
    if (lastGood) {
      console.warn("CRM catalog unavailable, serving last good copy:", error);
      applyCategories(lastGood.categories);
      return lastGood;
    }
    throw error;
  }
});

let lastGood: Catalog | null = null;

/** Выбранные в CRM товары, добитые автоматическим подбором до n (без повторов).
 *  Снятый с сайта товар уже выпал из выдачи CRM — его место займёт подбор. */
export function chosen(slugs: string[] | undefined, byId: Record<string, Product>, auto: Product[], n: number) {
  const picked = (slugs ?? []).map((id) => byId[id]).filter((p): p is Product => Boolean(p));
  const seen = new Set(picked.map((p) => p.id));
  return [...picked, ...auto.filter((p) => !seen.has(p.id))].slice(0, n);
}
