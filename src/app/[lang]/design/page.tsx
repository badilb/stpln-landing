import type { Metadata } from "next";
import { DesignBook } from "./DesignBook";

export const metadata: Metadata = {
  title: "Дизайн-система — пресеты, шрифты, цвета",
  robots: { index: false },
};

export default function DesignPage() {
  return <DesignBook />;
}
