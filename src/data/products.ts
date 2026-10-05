import { tr, type L, type Lang } from "@/i18n/config";
import { attr, categoryById, subtypeById, type PatternKind, type Tone, type Unit } from "./catalog";

// ВНИМАНИЕ: демо-каталог. Взято из постов @stepline_astana (02.10.2026):
//   • ламинат BlackBerry (Германия) −35%, 33 класс, 8/12 мм, влагостойкий до 48 ч;
//   • ламинат SOHO (Швеция), Metric Lam Chevron — французская ёлка, 7 оттенков;
//   • акция «паркет 24 000 ₸ вместо 40 000 ₸».
// Остальное — названия декоров, размеры, цены, остатки — сгенерировано для шаблона
// и заменяется выгрузкой из прайса. Пока флаг true, на сайте висит пометка «Демо-каталог».
export const SAMPLE_DATA = true;

export type Product = {
  id: string;
  sku: string;
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
};

const C = {
  sweden: { ru: "Швеция", kk: "Швеция", en: "Sweden" },
  germany: { ru: "Германия", kk: "Германия", en: "Germany" },
};

const DECORS: [L, Tone][] = [
  [{ ru: "Альпийский", kk: "Альпі", en: "Alpine" }, "light"],
  [{ ru: "Арктик", kk: "Арктика", en: "Arctic" }, "light"],
  [{ ru: "Беленый", kk: "Ағартылған", en: "Whitewashed" }, "light"],
  [{ ru: "Нордик", kk: "Нордик", en: "Nordic" }, "beige"],
  [{ ru: "Пастель", kk: "Пастель", en: "Pastel" }, "beige"],
  [{ ru: "Миндальный", kk: "Бадам", en: "Almond" }, "beige"],
  [{ ru: "Песочный", kk: "Құмды", en: "Sand" }, "beige"],
  [{ ru: "Натур", kk: "Табиғи", en: "Natural" }, "natural"],
  [{ ru: "Сиена", kk: "Сиена", en: "Siena" }, "natural"],
  [{ ru: "Медовый", kk: "Балды", en: "Honey" }, "natural"],
  [{ ru: "Island Chestnut", kk: "Island Chestnut", en: "Island Chestnut" }, "brown"],
  [{ ru: "Карамель", kk: "Карамель", en: "Caramel" }, "brown"],
  [{ ru: "Коньячный", kk: "Коньяк", en: "Cognac" }, "brown"],
  [{ ru: "Табачный", kk: "Темекі", en: "Tobacco" }, "brown"],
  [{ ru: "Копчёный", kk: "Ысталған", en: "Smoked" }, "dark"],
  [{ ru: "Эспрессо", kk: "Эспрессо", en: "Espresso" }, "dark"],
  [{ ru: "Кашемир", kk: "Кашемир", en: "Cashmere" }, "grey"],
  [{ ru: "Дымчатый", kk: "Түтінді", en: "Smoky" }, "grey"],
  [{ ru: "Туманный", kk: "Тұманды", en: "Misty" }, "grey"],
  [{ ru: "Графит", kk: "Графит", en: "Graphite" }, "grey"],
];

type Spec = {
  category: string;
  subtype?: string;
  count: number;
  brands: [string, L | undefined][];
  collection: string[];
  pattern: PatternKind;
  sizes: [number, number, number][];
  price: [number, number];
  extra: (i: number) => Partial<Product>;
  formats?: L[];
  /** Доля товаров со скидкой и её размер; по умолчанию ~30% со скидкой 13–38% */
  sale?: { share: number; off: number };
};

const specs: Spec[] = [
  {
    category: "laminat", subtype: "paluba", count: 9,
    brands: [["SOHO", C.sweden], ["BlackBerry", C.germany], ["Metric Lam", undefined]],
    collection: ["Classic", "Wide Plank", "Island"], pattern: "deck",
    sizes: [[1380, 193, 8], [1380, 193, 12], [1215, 195, 12], [1220, 200, 8]], price: [5990, 14990],
    extra: (i) => ({ cls: ["32", "33", "33", "34"][i % 4], chamfer: (["v", "four", "none"] as const)[i % 3], connection: "unilin", warmFloor: i % 3 !== 2, waterproof: i % 2 === 0 }),
  },
  {
    // Акция из инстаграма: BlackBerry −35%, 33 класс, 8 и 12 мм, влагостойкий до 48 ч
    category: "laminat", subtype: "paluba", count: 4,
    brands: [["BlackBerry", C.germany]], collection: ["Aqua 48"], pattern: "deck",
    sizes: [[1380, 193, 8], [1380, 193, 12]], price: [8990, 12990],
    sale: { share: 1, off: 0.35 },
    extra: () => ({ cls: "33", chamfer: "v", connection: "unilin", warmFloor: true, waterproof: true, waterNote: { ru: "до 48 ч", kk: "48 сағ дейін", en: "up to 48 h" } }),
  },
  {
    category: "laminat", subtype: "anglijskaya-elka", count: 6,
    brands: [["SOHO", C.sweden], ["BlackBerry", C.germany]],
    collection: ["Herringbone", "Parquet Line"], pattern: "herringbone",
    sizes: [[600, 100, 8], [600, 100, 12], [560, 112, 12]], price: [8990, 16990],
    extra: (i) => ({ cls: ["33", "34"][i % 2], chamfer: "four", connection: "unilin", warmFloor: true, waterproof: i % 2 === 1 }),
  },
  {
    // Из инстаграма: Metric Lam Chevron — французская ёлка, 7 натуральных оттенков
    category: "laminat", subtype: "francuzskaya-elka", count: 7,
    brands: [["Metric Lam", undefined]], collection: ["Chevron"], pattern: "chevron",
    sizes: [[630, 126, 8]], price: [10990, 14990], sale: { share: 0, off: 0 },
    extra: () => ({ cls: "33", chamfer: "four", connection: "unilin", warmFloor: true }),
  },
  {
    category: "parket", subtype: "paluba", count: 6,
    brands: [["STEPLINE Select", undefined]], collection: ["Atelier", "Wide"], pattern: "deck",
    sizes: [[1900, 190, 14], [2200, 220, 15], [1800, 180, 14]], price: [24990, 59990],
    extra: (i) => ({ chamfer: "four", connection: "tg", finish: (["oil", "uv", "matte"] as const)[i % 3], wood: "oak", warmFloor: true }),
  },
  {
    // Акция из инстаграма: «24 000 ₸ за паркет вместо 40 000 ₸»
    category: "parket", subtype: "paluba", count: 1,
    brands: [["STEPLINE Select", undefined]], collection: ["Promo"], pattern: "deck",
    sizes: [[1200, 150, 14]], price: [24000, 24000], sale: { share: 1, off: 0.4 },
    extra: () => ({ chamfer: "four", connection: "tg", finish: "uv", wood: "oak", warmFloor: true }),
  },
  {
    category: "parket", subtype: "anglijskaya-elka", count: 7,
    brands: [["STEPLINE Select", undefined]], collection: ["Atelier", "Heritage"], pattern: "herringbone",
    sizes: [[600, 120, 14], [595, 125, 14], [490, 70, 15]], price: [29990, 69990],
    extra: (i) => ({ chamfer: "four", connection: "tg", finish: (["oil", "uv"] as const)[i % 2], wood: "oak", warmFloor: true }),
  },
  {
    category: "parket", subtype: "francuzskaya-elka", count: 5,
    brands: [["STEPLINE Select", undefined]], collection: ["Heritage"], pattern: "chevron",
    sizes: [[595, 125, 14], [600, 120, 15]], price: [36990, 79990],
    extra: (i) => ({ chamfer: "four", connection: "tg", finish: (["oil", "uv"] as const)[i % 2], wood: "oak", warmFloor: true }),
  },
  {
    category: "parket", subtype: "geometricheskij", count: 2,
    brands: [["STEPLINE Select", undefined]], collection: ["Geometry"], pattern: "geometric",
    sizes: [[400, 400, 15]], price: [42990, 64990],
    extra: () => ({ connection: "glue", finish: "oil", wood: "oak" }),
  },
  {
    category: "parket", subtype: "modulnyj", count: 3,
    brands: [["STEPLINE Select", undefined]], collection: ["Versailles", "Chantilly"], pattern: "modular",
    sizes: [[700, 700, 20], [600, 600, 20]], price: [69990, 119990],
    extra: () => ({ connection: "glue", finish: "aged", wood: "oak" }),
  },
  {
    category: "kvarcvinil", subtype: "zamkovyj", count: 8,
    brands: [["STEPLINE Aqua", undefined]], collection: ["Aqua Wood", "Aqua Stone"], pattern: "deck",
    sizes: [[1220, 180, 4], [1220, 180, 5], [1500, 230, 6]], price: [8990, 16990],
    extra: (i) => ({ cls: "43", connection: "click", waterproof: true, warmFloor: true, chamfer: (["v", "none"] as const)[i % 2] }),
  },
  {
    category: "kvarcvinil", subtype: "kleevoj", count: 4,
    brands: [["STEPLINE Aqua", undefined]], collection: ["Aqua Glue"], pattern: "herringbone",
    sizes: [[615, 123, 2.5], [1220, 180, 2.5]], price: [7990, 12990],
    extra: () => ({ cls: "42", connection: "glue", waterproof: true, warmFloor: true }),
  },
  {
    category: "kovrolin", count: 4, brands: [["STEPLINE Soft", undefined]],
    collection: ["Loop", "Tile"], pattern: "carpet", sizes: [[0, 0, 6]], price: [4990, 9990],
    formats: [
      { ru: "рулон 4 м", kk: "орам 4 м", en: "4 m roll" },
      { ru: "рулон 4 м", kk: "орам 4 м", en: "4 m roll" },
      { ru: "плитка 500 × 500 мм", kk: "тақта 500 × 500 мм", en: "500 × 500 mm tile" },
      { ru: "рулон 5 м", kk: "орам 5 м", en: "5 m roll" },
    ],
    extra: (i) => ({ finish: (["loop", "cut"] as const)[i % 2] }),
  },
  {
    category: "podlozhka", count: 3, brands: [["STEPLINE", undefined]],
    collection: ["Base"], pattern: "underlay", sizes: [[0, 0, 3]], price: [990, 3990],
    formats: [
      { ru: "хвойная 790 × 590 × 4 мм, 5,6 м²/уп", kk: "қылқанжапырақты 790 × 590 × 4 мм, 5,6 м²/қап", en: "softwood fibre 790 × 590 × 4 mm, 5.6 m²/pack" },
      { ru: "XPS 1 × 10 м × 1,5 мм, 10 м²/уп", kk: "XPS 1 × 10 м × 1,5 мм, 10 м²/қап", en: "XPS 1 × 10 m × 1.5 mm, 10 m²/pack" },
      { ru: "пробковая 1 × 10 м × 2 мм, 10 м²/уп", kk: "тығын 1 × 10 м × 2 мм, 10 м²/қап", en: "cork 1 × 10 m × 2 mm, 10 m²/pack" },
    ],
    extra: () => ({}),
  },
  {
    category: "klej", count: 3, brands: [["STEPLINE Pro", undefined]],
    collection: ["Pro"], pattern: "adhesive", sizes: [[0, 0, 0]], price: [18990, 49990],
    formats: [
      { ru: "двухкомпонентный ПУ для паркета, 10 кг", kk: "паркетке арналған екі компонентті ПУ, 10 кг", en: "2-component PU for parquet, 10 kg" },
      { ru: "дисперсионный для LVT, 15 кг", kk: "LVT үшін дисперсиялық, 15 кг", en: "dispersion adhesive for LVT, 15 kg" },
      { ru: "для ковролина, 14 кг", kk: "кілемшеге арналған, 14 кг", en: "carpet adhesive, 14 kg" },
    ],
    extra: () => ({}),
  },
  {
    category: "plintus", count: 5, brands: [["STEPLINE", undefined]],
    collection: ["Line"], pattern: "skirting", sizes: [[0, 0, 0]], price: [2490, 6990],
    formats: [
      { ru: "МДФ под покраску 2400 × 80 × 16 мм", kk: "бояуға арналған МДФ 2400 × 80 × 16 мм", en: "paintable MDF 2400 × 80 × 16 mm" },
      { ru: "МДФ белый 2400 × 100 × 16 мм", kk: "ақ МДФ 2400 × 100 × 16 мм", en: "white MDF 2400 × 100 × 16 mm" },
      { ru: "шпон дуба 2400 × 60 × 16 мм", kk: "емен шпоны 2400 × 60 × 16 мм", en: "oak veneer 2400 × 60 × 16 mm" },
      { ru: "дюрополимер 2000 × 80 × 13 мм", kk: "дюрополимер 2000 × 80 × 13 мм", en: "duropolymer 2000 × 80 × 13 mm" },
      { ru: "скрытый алюминиевый 2500 × 40 мм", kk: "жасырын алюминий 2500 × 40 мм", en: "concealed aluminium 2500 × 40 mm" },
    ],
    extra: () => ({}),
  },
];

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function slug(s: string) {
  const map: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya" };
  return s
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function build(): Product[] {
  const out: Product[] = [];
  let n = 0;
  for (const sp of specs) {
    for (let i = 0; i < sp.count; i++) {
      n++;
      const r = rand(n);
      const [decor, tone] = DECORS[(n * 7) % DECORS.length];
      const [brand, country] = sp.brands[i % sp.brands.length];
      const collection = sp.collection[i % sp.collection.length];
      const [length, width, thickness] = sp.sizes[i % sp.sizes.length];
      const price = sp.price[0] === sp.price[1] ? sp.price[0] : Math.round((sp.price[0] + r * (sp.price[1] - sp.price[0])) / 1000) * 1000 - 10;
      const sale = sp.sale ?? { share: 0.3, off: 0.13 + rand(n + 200) * 0.25 };
      const discounted = rand(n + 100) < sale.share;
      const oldPrice = discounted ? Math.round(price / (1 - sale.off) / 10) * 10 : undefined;
      const board = Boolean(length && width && !sp.formats);
      // Штук в упаковке — под типичную площадь упаковки раздела (ламинат ~2 м², паркет ~1,6 м²)
      const target = { laminat: 2.1, parket: 1.6, kvarcvinil: thickness < 3 ? 3.3 : 2.2 }[sp.category as "laminat"] ?? 2;
      const packPcs = board ? Math.max(2, Math.round(target / ((length * width) / 1e6))) : undefined;
      const packM2 = packPcs ? Math.round(((length * width) / 1e6) * packPcs * 1000) / 1000 : undefined;
      const sku = `${sp.category.slice(0, 2).toUpperCase()}-${String(n).padStart(4, "0")}`;
      const format = sp.formats?.[i % sp.formats.length];
      out.push({
        id: `${slug(`${sp.category} ${sp.subtype ?? ""} ${format ? format.ru : decor.ru}`)}-${sku.toLowerCase()}`,
        sku,
        category: sp.category,
        subtype: sp.subtype,
        brand,
        country,
        collection,
        decor: format ? { ru: collection, kk: collection, en: collection } : decor,
        tone,
        pattern: sp.pattern,
        ...(board ? { length, width, thickness } : {}),
        format,
        ...sp.extra(i),
        packPcs,
        packM2,
        price,
        oldPrice,
        stock: discounted && sp.sale ? Math.round(30 + rand(n + 400) * 200) : rand(n + 300) < 0.25 ? 0 : Math.round(20 + rand(n + 400) * 400),
        isNew: rand(n + 500) < 0.18,
        seed: n,
      });
    }
  }
  return out;
}

export const products = build();

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product>;

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
