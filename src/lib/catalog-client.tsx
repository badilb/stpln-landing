"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { applyCategories, type Category } from "@/data/catalog";
import type { Product } from "@/data/products";

// Каталог для клиентских компонентов (корзина, сравнение, счётчики в шапке, фильтры).
// Серверный layout магазина получает его из getCatalog() и кладёт сюда один раз:
// при переходах между страницами layout не перерисовывается, и каталог не едет заново.
// Если товаров станет много тысяч — фильтрацию стоит перенести на сервер.

type Ctx = { products: Product[]; byId: Record<string, Product> };

const CatalogContext = createContext<Ctx>({ products: [], byId: {} });

export function CatalogProvider({
  products,
  categories,
  children,
}: {
  products: Product[];
  /** Разделы из CRM — применяются до отрисовки детей, чтобы меню совпало с серверным. */
  categories: Category[];
  children: ReactNode;
}) {
  applyCategories(categories);
  const value = useMemo(() => ({ products, byId: Object.fromEntries(products.map((p) => [p.id, p])) }), [products]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
