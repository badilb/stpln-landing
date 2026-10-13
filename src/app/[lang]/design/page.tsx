import type { Metadata } from "next";
import { CatalogProvider } from "@/lib/catalog-client";
import { getCatalog } from "@/lib/catalog-source";
import { DesignBook } from "./DesignBook";

export const metadata: Metadata = {
  title: "Дизайн-система — пресеты, шрифты, цвета",
  robots: { index: false },
};

export default async function DesignPage() {
  const { products, categories } = await getCatalog();
  return (
    <CatalogProvider products={products} categories={categories}>
      <DesignBook products={products} />
    </CatalogProvider>
  );
}
