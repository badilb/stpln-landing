import type { Metadata } from "next";
import { PhotoCard } from "@/components/media/PhotoCard";
import { VideoCard } from "@/components/media/VideoCard";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { site } from "@/content/site";
import { photos, videos } from "@/data/media";
import { getDict } from "@/i18n";
import { isLang } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import ms from "@/components/media/Media.module.css";
import s from "./media.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/media">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return { title: t.media.title, description: t.media.lead };
}

// По образцу parket-greenline.ru/gallery: фото объектов → видео → соцсети
export default async function MediaPage() {
  const { lang, t } = await getI18n();
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ label: t.media.title }]} />
      <div className={s.head}>
        <h1 className={s.title}>{t.media.title}</h1>
        <p className={s.lead}>{t.media.lead}</p>
        <nav className={s.jump} aria-label={t.media.title}>
          <a href="#video">{t.media.videos}</a>
          <a href="#photo">{t.media.photos}</a>
          <a href="#ig">{t.media.instagram}</a>
        </nav>
      </div>

      <section id="video" className={s.section} aria-labelledby="video-t">
        <h2 id="video-t" className={s.h2}>
          {t.media.videos}
        </h2>
        <div className={ms.videos}>
          {videos.map((v, i) => (
            <VideoCard key={v.code} video={v} index={i} />
          ))}
        </div>
        <p className={ms.note}>{t.media.loadNote}</p>
      </section>

      <section id="photo" className={s.section} aria-labelledby="photo-t">
        <h2 id="photo-t" className={s.h2}>
          {t.media.photos}
        </h2>
        <div className={ms.photos}>
          {photos.map((p, i) => (
            <PhotoCard key={p.id} photo={p} index={i} lang={lang} soon={t.media.photoSoon} />
          ))}
        </div>
      </section>

      <section id="ig" className={`${s.section} ${s.ig}`} aria-labelledby="ig-t">
        <h2 id="ig-t" className={s.h2}>
          {site.instagramHandle}
        </h2>
        <a href={site.instagram} target="_blank" rel="noreferrer" className={s.igBtn}>
          {t.media.subscribe}
        </a>
      </section>
    </div>
  );
}
