import type { L } from "@/i18n/config";

// Разделы магазина. Состав — по брифу клиента (01.10.2026), структура меню —
// как у mirparketa.kz: категории, виды укладки, затем Новинки / Акции / На заказ.
// Названия — на трёх языках (ru/kk/en), казахский требует вычитки носителем.

export type PatternKind =
  | "deck"
  | "herringbone"
  | "chevron"
  | "geometric"
  | "modular"
  | "click"
  | "glue"
  | "carpet"
  | "adhesive"
  | "underlay"
  | "skirting";

export type Subtype = {
  id: string;
  name: L;
  pattern: PatternKind;
};

export type Unit = "m2" | "pcs" | "pack";

export type Category = {
  id: string;
  name: L;
  /** Короткое имя для меню */
  menu: L;
  note: L;
  pattern: PatternKind;
  unit: Unit;
  subtypes: Subtype[];
};

const ST = {
  paluba: { ru: "Палуба", kk: "Палуба", en: "Plank" },
  en: { ru: "Английская ёлка", kk: "Ағылшын шыршасы", en: "Herringbone" },
  fr: { ru: "Французская ёлка", kk: "Француз шыршасы", en: "Chevron" },
  geo: { ru: "Геометрический", kk: "Геометриялық", en: "Geometric" },
  mod: { ru: "Модульный", kk: "Модульдік", en: "Modular" },
  click: { ru: "Замковый", kk: "Құлыпты", en: "Click" },
  glue: { ru: "Клеевой", kk: "Желімді", en: "Glue-down" },
} satisfies Record<string, L>;

export const categories: Category[] = [
  {
    id: "parket",
    name: { ru: "Паркет", kk: "Паркет", en: "Parquet" },
    menu: { ru: "Паркет", kk: "Паркет", en: "Parquet" },
    note: {
      ru: "Инженерная и паркетная доска, штучный и модульный",
      kk: "Инженерлік және паркет тақтасы, даналық және модульдік",
      en: "Engineered boards, block and modular parquet",
    },
    pattern: "herringbone",
    unit: "m2",
    subtypes: [
      { id: "paluba", name: ST.paluba, pattern: "deck" },
      { id: "anglijskaya-elka", name: ST.en, pattern: "herringbone" },
      { id: "francuzskaya-elka", name: ST.fr, pattern: "chevron" },
      { id: "geometricheskij", name: ST.geo, pattern: "geometric" },
      { id: "modulnyj", name: ST.mod, pattern: "modular" },
    ],
  },
  {
    id: "laminat",
    name: { ru: "Ламинат", kk: "Ламинат", en: "Laminate" },
    menu: { ru: "Ламинат", kk: "Ламинат", en: "Laminate" },
    note: {
      ru: "Палуба и ёлка, 32–34 класс, 8–12 мм",
      kk: "Палуба және шырша, 32–34 класс, 8–12 мм",
      en: "Planks and herringbone, class 32–34, 8–12 mm",
    },
    pattern: "deck",
    unit: "m2",
    subtypes: [
      { id: "paluba", name: ST.paluba, pattern: "deck" },
      { id: "anglijskaya-elka", name: ST.en, pattern: "herringbone" },
      { id: "francuzskaya-elka", name: ST.fr, pattern: "chevron" },
    ],
  },
  {
    id: "kvarcvinil",
    name: { ru: "Кварцвинил SPC / LVT", kk: "Кварцвинил SPC / LVT", en: "SPC / LVT vinyl" },
    menu: { ru: "Кварцвинил SPC/LVT", kk: "Кварцвинил SPC/LVT", en: "SPC/LVT vinyl" },
    note: {
      ru: "Не боится воды — для кухни, ванной, прихожей",
      kk: "Судан қорықпайды — ас үй, жуынатын бөлме, дәліз үшін",
      en: "Waterproof — for kitchens, bathrooms and hallways",
    },
    pattern: "click",
    unit: "m2",
    subtypes: [
      { id: "zamkovyj", name: ST.click, pattern: "deck" },
      { id: "kleevoj", name: ST.glue, pattern: "herringbone" },
    ],
  },
  {
    id: "kovrolin",
    name: { ru: "Ковролин", kk: "Кілемше жабын", en: "Carpet" },
    menu: { ru: "Ковролин", kk: "Кілемше", en: "Carpet" },
    note: { ru: "Рулонный и плиточный", kk: "Орама және тақта түрінде", en: "Broadloom and carpet tiles" },
    pattern: "carpet",
    unit: "m2",
    subtypes: [],
  },
  {
    id: "podlozhka",
    name: { ru: "Подложка", kk: "Төсеме", en: "Underlay" },
    menu: { ru: "Подложка", kk: "Төсеме", en: "Underlay" },
    note: { ru: "Под ламинат, паркет и SPC", kk: "Ламинат, паркет және SPC астына", en: "For laminate, parquet and SPC" },
    pattern: "underlay",
    unit: "pack",
    subtypes: [],
  },
  {
    id: "klej",
    name: { ru: "Клей", kk: "Желім", en: "Adhesive" },
    menu: { ru: "Клей", kk: "Желім", en: "Adhesive" },
    note: { ru: "Для паркета, LVT и ковролина", kk: "Паркет, LVT және кілемше үшін", en: "For parquet, LVT and carpet" },
    pattern: "adhesive",
    unit: "pcs",
    subtypes: [],
  },
  {
    id: "plintus",
    name: { ru: "Плинтус", kk: "Плинтус", en: "Skirting" },
    menu: { ru: "Плинтус", kk: "Плинтус", en: "Skirting" },
    note: { ru: "МДФ, шпон, дюрополимер, алюминий", kk: "МДФ, шпон, дюрополимер, алюминий", en: "MDF, veneer, duropolymer, aluminium" },
    pattern: "skirting",
    unit: "pcs",
    subtypes: [],
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<string, Category>;

export function subtypeById(category: string, subtype?: string) {
  return categoryById[category]?.subtypes.find((s) => s.id === subtype);
}

export type Tone = "light" | "beige" | "natural" | "brown" | "dark" | "grey";

export const tones: { id: Tone; name: L }[] = [
  { id: "light", name: { ru: "Белый", kk: "Ақ", en: "White" } },
  { id: "beige", name: { ru: "Бежевый", kk: "Бежевый", en: "Beige" } },
  { id: "natural", name: { ru: "Натуральный", kk: "Табиғи", en: "Natural" } },
  { id: "brown", name: { ru: "Коричневый", kk: "Қоңыр", en: "Brown" } },
  { id: "dark", name: { ru: "Тёмно-коричневый", kk: "Қою қоңыр", en: "Dark brown" } },
  { id: "grey", name: { ru: "Серый", kk: "Сұр", en: "Grey" } },
];

/** Значения характеристик — ключи в данных, подписи на трёх языках */
export const attr = {
  chamfer: {
    v: { ru: "V-образная", kk: "V-тәрізді", en: "V-groove" },
    four: { ru: "4-х сторонняя", kk: "4 жақты", en: "4-sided" },
    none: { ru: "Нет", kk: "Жоқ", en: "None" },
  },
  connection: {
    unilin: { ru: "Unilin", kk: "Unilin", en: "Unilin" },
    tg: { ru: "Шип-паз", kk: "Тіс-ойық", en: "Tongue & groove" },
    click: { ru: "Click", kk: "Click", en: "Click" },
    glue: { ru: "Клеевой", kk: "Желімді", en: "Glue-down" },
  },
  finish: {
    oil: { ru: "Масло", kk: "Май", en: "Oil" },
    uv: { ru: "УФ-лак", kk: "УК-лак", en: "UV lacquer" },
    matte: { ru: "Матовый лак", kk: "Күңгірт лак", en: "Matt lacquer" },
    aged: { ru: "Масло, старение", kk: "Май, ескірту", en: "Oil, aged" },
    loop: { ru: "Петлевой ворс", kk: "Ілмекті түк", en: "Loop pile" },
    cut: { ru: "Разрезной ворс", kk: "Кесілген түк", en: "Cut pile" },
  },
  wood: { oak: { ru: "Дуб", kk: "Емен", en: "Oak" } },
} satisfies Record<string, Record<string, L>>;

export type AttrKey = keyof typeof attr;

export function attrLabel<K extends AttrKey>(key: K, v: string | undefined): L | undefined {
  if (!v) return undefined;
  return (attr[key] as Record<string, L>)[v];
}

/** Оттенки планок для «фото» товара — CSS-переменные из globals.css. */
export function tonePalette(tone: Tone) {
  return [1, 2, 3, 4, 5].map((i) => `var(--tone-${tone}-${i})`);
}
