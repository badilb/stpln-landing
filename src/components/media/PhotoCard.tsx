import { FloorPattern } from "@/components/FloorPattern";
import { tonePalette } from "@/data/catalog";
import type { MediaPhoto } from "@/data/media";
import { tr, type Lang } from "@/i18n/config";
import s from "./Media.module.css";

export function PhotoCard({ photo, index, lang, soon }: { photo: MediaPhoto; index: number; lang: Lang; soon: string }) {
  const title = tr(photo.title, lang);
  return (
    <figure className={s.photo}>
      <div className={s.photoArt}>
        {photo.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.photo} alt={title} loading="lazy" />
        ) : (
          <>
            <FloorPattern kind={photo.pattern} variant="wood" width={480} height={360} palette={tonePalette(photo.tone)} seam="var(--tone-seam)" seed={index * 5 + 21} />
            <span className={s.soon}>{soon}</span>
          </>
        )}
      </div>
      <figcaption className={s.caption}>{title}</figcaption>
    </figure>
  );
}
