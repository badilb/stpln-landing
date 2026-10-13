import type { NextConfig } from "next";

// Сайт работает Node-сервером (`next start`, в Docker — standalone-сборка): каталог берётся
// из CRM на запросе и кэшируется, а CRM после правки товара просит перерисовать страницы
// (src/lib/catalog-source.ts, src/app/api/revalidate/route.ts).
const nextConfig: NextConfig = {
  output: "standalone",
  // /ru/catalog/ — адреса со слэшем, как были у статической версии: ссылки не меняются
  trailingSlash: true,
};

export default nextConfig;
