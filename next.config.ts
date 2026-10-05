import type { NextConfig } from "next";

// Сайт собирается в статику (папка out/): без сервера, можно выложить на Vercel,
// Netlify, GitHub Pages или любой хостинг. Формы уходят через Web3Forms (src/lib/send.ts).
const nextConfig: NextConfig = {
  output: "export",
  // /ru/catalog/ → /ru/catalog/index.html — так статические хостинги отдают страницы без настроек
  trailingSlash: true,
};

export default nextConfig;
