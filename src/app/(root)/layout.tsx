import type { Metadata } from "next";

// Отдельный корневой layout только для «/»: сайт статический, языки — в /ru, /kk, /en.
export const metadata: Metadata = { title: "STEPLINE", robots: { index: false } };

export default function RootRedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
