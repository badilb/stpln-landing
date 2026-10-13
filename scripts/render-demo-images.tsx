// Демо-картинки для CRM: те же рисунки пола, что сайт показывает без фото (FloorPattern /
// ProductImage) — для каждого товара демо-каталога и для каждого раздела. Шаг 1 из 2:
//   npx tsx scripts/render-demo-images.tsx ../crm-stpln/api/scripts/data/demo_catalog.json > /tmp/demo-images.html
// Шаг 2 (PNG): crm-stpln/client/scripts/demo-images-to-png.mjs /tmp/demo-images.html ../api/scripts/data/demo_images
// PNG лежат в репозитории CRM; в MinIO их кладёт crm-stpln/api/scripts/seed_images.py.
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { FloorPattern } from "../src/components/FloorPattern";
import { ProductImage } from "../src/components/shop/ProductImage";
import { tonePalette, type PatternKind, type Tone } from "../src/data/catalog";
import type { Product } from "../src/data/products";

const W = 800;
const H = 600;
const WOODEN = new Set<PatternKind>(["deck", "herringbone", "chevron", "geometric"]);

// Плитки разделов — те же рисунок и тон, что на главной (src/components/home/HomeBlocks.tsx).
const CATEGORY_ART: Record<string, [PatternKind, Tone]> = {
  parket: ["herringbone", "brown"],
  laminat: ["deck", "beige"],
  kvarcvinil: ["deck", "grey"],
  kovrolin: ["carpet", "grey"],
  podlozhka: ["underlay", "beige"],
  klej: ["adhesive", "light"],
  plintus: ["skirting", "light"],
};

function categoryArt(kind: PatternKind, tone: Tone, seed: number) {
  if (WOODEN.has(kind)) {
    return <FloorPattern kind={kind} variant="wood" width={W} height={H} palette={tonePalette(tone)} seam="var(--tone-seam)" seed={seed} />;
  }
  return (
    <span style={{ display: "block", width: W, height: H, background: `var(--tone-${tone}-2)`, color: "var(--tone-seam)" }}>
      <FloorPattern kind={kind} width={W / 2} height={H / 2} seed={seed} />
    </span>
  );
}

const css = readFileSync(new URL("../src/styles/globals.css", import.meta.url), "utf8");
// Только цвета тонов и шва — остальное оформление сайта картинке не нужно.
const tones = css.match(/--tone-[a-z]+(-\d)?:[^;]+;/g)?.join("\n") ?? "";

const products = JSON.parse(readFileSync(process.argv[2], "utf8")) as Product[];
const tiles: string[] = [];
for (const p of products) {
  const markup = renderToStaticMarkup(<ProductImage product={{ ...p, images: undefined }} width={W} height={H} />);
  tiles.push(`<div class="img" data-name="product-${p.sku}" style="width:${W}px;height:${H}px">${markup}</div>`);
}
Object.entries(CATEGORY_ART).forEach(([id, [kind, tone]], i) => {
  const markup = renderToStaticMarkup(categoryArt(kind, tone, i * 5));
  tiles.push(`<div class="img" data-name="category-${id}" style="width:${W}px;height:${H}px">${markup}</div>`);
});

process.stdout.write(`<!doctype html><html><head><meta charset="utf-8"><style>
:root { ${tones} }
body { margin: 0; background: #fff; }
.img { overflow: hidden; }
.img svg, .img > span { display: block; width: 100%; height: 100%; }
.img span svg { width: 100%; height: 100%; }
</style></head><body>${tiles.join("\n")}</body></html>\n`);
