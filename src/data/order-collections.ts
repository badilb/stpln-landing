import type { L } from "@/i18n/config";
import type { PatternKind, Tone } from "./catalog";

// Каталог «На заказ». Источник — PDF-каталоги фабрик, которые присылают STEPLINE.
// Из каждого PDF переносим сюда коллекцию в едином формате (это и есть «свой каталог»):
//   1. name / kind / format / specs — со страницы описания коллекции;
//   2. decors — по одной строке на декор: код фабрики, название, ближайший тон из фильтра;
//   3. фото декоров (когда будут) — в public/na-zakaz/<collection>/<code>.jpg, поле photo.
// Страну и фабрику на сайте не показываем — только коллекцию и характеристики.
// ВНИМАНИЕ: коллекции ниже — образец структуры, не реальные данные.

export type OrderDecor = { code: string; name: string; tone: Tone; photo?: string };

export type OrderCollection = {
  id: string;
  name: string;
  kind: keyof typeof KINDS;
  pattern: PatternKind;
  /** Формат в мм: длина × ширина × толщина */
  format: string;
  specs: L[];
  /** TODO: срок поставки и цена «от» — после согласования с поставщиком */
  leadTime?: string;
  priceFrom?: number;
  decors: OrderDecor[];
};

export const ORDER_SAMPLE = true;

export const KINDS = {
  laminate: { ru: "Ламинат", kk: "Ламинат", en: "Laminate" },
  spc: { ru: "Кварцвинил SPC", kk: "Кварцвинил SPC", en: "SPC vinyl" },
  lvt: { ru: "Кварцвинил LVT", kk: "Кварцвинил LVT", en: "LVT vinyl" },
  parquet: { ru: "Паркет", kk: "Паркет", en: "Parquet" },
} satisfies Record<string, L>;

const S = {
  c42: { ru: "42 класс", kk: "42 класс", en: "Class 42" },
  c43: { ru: "43 класс", kk: "43 класс", en: "Class 43" },
  c33: { ru: "33 класс", kk: "33 класс", en: "Class 33" },
  click: { ru: "Замок Click", kk: "Click құлпы", en: "Click joint" },
  glue: { ru: "Клеевой", kk: "Желімді", en: "Glue-down" },
  water: { ru: "Влагостойкий", kk: "Ылғалға төзімді", en: "Water-resistant" },
  warm: { ru: "Тёплый пол", kk: "Жылы еден", en: "Underfloor heating" },
  vgroove: { ru: "V-фаска", kk: "V-фаска", en: "V-groove" },
  four: { ru: "4-х сторонняя фаска", kk: "4 жақты фаска", en: "4-sided bevel" },
  unilin: { ru: "Unilin", kk: "Unilin", en: "Unilin" },
  oak: { ru: "Дуб", kk: "Емен", en: "Oak" },
  herring: { ru: "Английская ёлка", kk: "Ағылшын шыршасы", en: "Herringbone" },
  chevron: { ru: "Французская ёлка", kk: "Француз шыршасы", en: "Chevron" },
  oil: { ru: "Масло", kk: "Май", en: "Oil" },
  tg: { ru: "Шип-паз", kk: "Тіс-ойық", en: "Tongue & groove" },
} satisfies Record<string, L>;

const d = (code: string, name: string, tone: Tone): OrderDecor => ({ code, name, tone });

export const orderCollections: OrderCollection[] = [
  {
    id: "terra",
    name: "Terra",
    kind: "spc",
    pattern: "deck",
    format: "1220 × 180 × 5",
    specs: [S.c43, S.click, S.water, S.warm],
    decors: [
      d("TR-201", "Oak Sand", "beige"),
      d("TR-204", "Oak Natural", "natural"),
      d("TR-207", "Oak Honey", "brown"),
      d("TR-210", "Oak Smoke", "grey"),
      d("TR-213", "Oak Ash", "light"),
      d("TR-216", "Oak Coffee", "dark"),
      d("TR-219", "Oak Linen", "light"),
      d("TR-222", "Oak Stone", "grey"),
    ],
  },
  {
    id: "vela",
    name: "Vela",
    kind: "laminate",
    pattern: "deck",
    format: "1380 × 193 × 10",
    specs: [S.c33, S.vgroove, S.unilin],
    decors: [
      d("VL-01", "Nordic White", "light"),
      d("VL-02", "Classic Oak", "natural"),
      d("VL-03", "Barn Oak", "brown"),
      d("VL-04", "Dark Walnut", "dark"),
      d("VL-05", "Grey Mist", "grey"),
      d("VL-06", "Almond", "beige"),
    ],
  },
  {
    id: "mosaic",
    name: "Mosaic",
    kind: "parquet",
    pattern: "herringbone",
    format: "600 × 120 × 14",
    specs: [S.oak, S.herring, S.oil, S.tg],
    decors: [
      d("MS-110", "Rustic", "brown"),
      d("MS-114", "Select", "natural"),
      d("MS-118", "Smoked", "dark"),
      d("MS-122", "White Oil", "light"),
      d("MS-126", "Greige", "grey"),
    ],
  },
  {
    id: "linea",
    name: "Linea",
    kind: "laminate",
    pattern: "chevron",
    format: "630 × 126 × 8",
    specs: [S.c33, S.chevron, S.four],
    decors: [
      d("LN-31", "Cream", "light"),
      d("LN-32", "Biscuit", "beige"),
      d("LN-33", "Cognac", "brown"),
      d("LN-34", "Graphite", "grey"),
    ],
  },
  {
    id: "atlas",
    name: "Atlas",
    kind: "lvt",
    pattern: "herringbone",
    format: "615 × 123 × 2.5",
    specs: [S.c42, S.glue, S.water],
    decors: [
      d("AT-501", "Pale Oak", "light"),
      d("AT-502", "Honey Oak", "natural"),
      d("AT-503", "Mocha", "dark"),
      d("AT-504", "Concrete Oak", "grey"),
      d("AT-505", "Toffee", "brown"),
      d("AT-506", "Sandstone", "beige"),
    ],
  },
];
