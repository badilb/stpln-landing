// Демо-каталог → JSON для сида CRM (crm-stpln/api/scripts/seed_catalog.py).
// Запуск: npx tsx scripts/export-demo-catalog.ts > ../crm-stpln/api/scripts/data/demo_catalog.json
// Нужен один раз: дальше каталог живёт в CRM, а демо — только запасной путь сайта без неё.
//   • товары «В наличии» — демо-генератор (src/data/demo-products.ts);
//   • товары «На заказ» — образцы коллекций (src/data/order-collections.ts): декор = товар.
import { demoProducts } from "../src/data/demo-products";
import { orderCollections } from "../src/data/order-collections";
import type { Product } from "../src/data/products";

const CATEGORY: Record<string, [string, string?]> = {
  laminate: ["laminat", "paluba"],
  spc: ["kvarcvinil", "zamkovyj"],
  lvt: ["kvarcvinil", "kleevoj"],
  parquet: ["parket"],
};

// Характеристики образцов — строки; раскладываем их по полям товара.
function fields(specs: string[], pattern: string): Partial<Product> {
  const out: Partial<Product> = {};
  for (const s of specs) {
    const cls = s.match(/^(\d+) класс$/);
    if (cls) out.cls = cls[1];
    if (s === "Замок Click") out.connection = "click";
    if (s === "Клеевой") out.connection = "glue";
    if (s === "Шип-паз") out.connection = "tg";
    if (s === "Unilin") out.connection = "unilin";
    if (s === "Влагостойкий") out.waterproof = true;
    if (s === "Тёплый пол") out.warmFloor = true;
    if (s === "V-фаска") out.chamfer = "v";
    if (s === "4-х сторонняя фаска") out.chamfer = "four";
    if (s === "Дуб") out.wood = "oak";
    if (s === "Масло") out.finish = "oil";
  }
  if (pattern === "herringbone") out.subtype = "anglijskaya-elka";
  if (pattern === "chevron") out.subtype = "francuzskaya-elka";
  return out;
}

const order = orderCollections.flatMap((c) => {
  const [category, subtype] = CATEGORY[c.kind] ?? ["laminat"];
  const [length, width, thickness] = (c.format ?? "").split("×").map((x) => Number(x.trim()));
  return c.decors.map((d, i) => ({
    id: `na-zakaz-${c.id}-${d.code.toLowerCase()}`,
    sku: d.code,
    kind: "order" as const,
    category,
    brand: "",
    collection: c.name,
    decor: { ru: d.name, kk: d.name, en: d.name },
    tone: d.tone,
    pattern: c.pattern,
    ...(length && width && thickness ? { length, width, thickness } : {}),
    ...fields(c.specs.map((s) => s.ru), c.pattern),
    // Вид укладки раздела важнее рисунка: LVT-ёлка остаётся «клеевым» кварцвинилом.
    ...(subtype ? { subtype } : {}),
    price: c.priceFrom ?? 0,
    stock: 0,
    seed: 500 + i,
  }));
});

process.stdout.write(JSON.stringify([...demoProducts, ...order], null, 1) + "\n");
