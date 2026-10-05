import { tonePalette } from "@/data/catalog";
import type { Product } from "@/data/products";
import { FloorPattern } from "../FloorPattern";

// Пока нет фото товаров, «фото» — раскладка этого товара в его тоне.
// TODO: когда появятся фото из прайса, показывать <Image>, а раскладку оставить запасным вариантом.

const WOODEN = new Set(["deck", "herringbone", "chevron", "geometric"]);

export function ProductImage({
  product,
  width,
  height,
  zoom = 1,
  className,
  alt,
}: {
  product: Product;
  width: number;
  height: number;
  /** >1 — крупнее планка, для «деталь» в галерее */
  zoom?: number;
  className?: string;
  /** Подпись для скринридеров — название товара на текущем языке */
  alt?: string;
}) {
  const palette = tonePalette(product.tone);
  if (WOODEN.has(product.pattern)) {
    const u = Math.min(width, height) / zoom;
    return (
      <FloorPattern
        kind={product.pattern}
        variant="wood"
        width={Math.round(width / zoom)}
        height={Math.round(height / zoom)}
        plank={product.pattern === "herringbone" ? (u / 9) * (product.length && product.width ? Math.min(7, product.length / product.width) : 5) : undefined}
        palette={palette}
        seam="var(--tone-seam)"
        seed={product.seed}
        className={className}
        title={alt}
      />
    );
  }
  // Ковролин, подложка, клей, плинтус, модули — линия тона на заливке тона
  return (
    <span className={className} style={{ display: "block", background: palette[1], color: "var(--tone-seam)" }} role="img" aria-label={alt}>
      <FloorPattern kind={product.pattern} width={Math.round(width / zoom / 2)} height={Math.round(height / zoom / 2)} seed={product.seed} />
    </span>
  );
}
