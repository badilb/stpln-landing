import type { NextConfig } from "next";

// Сайт собирается в статику (папка out/): без сервера, можно выложить на Vercel,
// Netlify, GitHub Pages или любой хостинг. Формы уходят через Web3Forms (src/lib/send.ts).
// На GitHub Pages сайт живёт в подпапке (/stepline-floors) — её задаёт workflow
// через NEXT_PUBLIC_BASE_PATH. На своём домене или локально переменная пустая.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // /ru/catalog/ → /ru/catalog/index.html — так статические хостинги отдают страницы без настроек
  trailingSlash: true,
};

export default nextConfig;
