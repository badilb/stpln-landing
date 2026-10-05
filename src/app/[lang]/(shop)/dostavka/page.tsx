import type { Metadata } from "next";
import { InfoView } from "@/components/site/InfoView";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/dostavka">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const p = getDict(lang).pages.delivery;
  return { title: p.title, description: p.lead };
}

export default function Page() {
  return <InfoView page="delivery" />;
}
