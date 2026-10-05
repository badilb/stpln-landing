import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { SITE_URL } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Пока демо-каталог, индексацию можно закрыть переменной NEXT_PUBLIC_NOINDEX=1
  if (process.env.NEXT_PUBLIC_NOINDEX === "1") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/*/cart", "/*/checkout", "/*/sravnenie", "/*/design"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
