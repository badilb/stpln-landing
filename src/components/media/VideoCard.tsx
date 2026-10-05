"use client";

import { useState } from "react";
import { FloorPattern } from "@/components/FloorPattern";
import { Icon } from "@/components/site/Icon";
import { tonePalette } from "@/data/catalog";
import { igEmbed, igUrl, type MediaVideo } from "@/data/media";
import { useI18n } from "@/i18n/client";
import { tr } from "@/i18n/config";
import s from "./Media.module.css";

// Ролик из Instagram грузится только по клику — до этого обложка без сторонних запросов.
export function VideoCard({ video, index }: { video: MediaVideo; index: number }) {
  const { lang, t } = useI18n();
  const [on, setOn] = useState(false);
  const title = tr(video.title, lang);

  return (
    <figure className={s.video}>
      <div className={s.frame}>
        {on ? (
          <iframe src={igEmbed(video)} title={title} loading="lazy" allowFullScreen />
        ) : (
          <button type="button" className={s.cover} onClick={() => setOn(true)} aria-label={`${t.media.watch}: ${title}`}>
            <FloorPattern kind={video.pattern} variant="wood" width={270} height={480} palette={tonePalette(video.tone)} seam="var(--tone-seam)" seed={index * 9 + 3} />
            <span className={s.play} aria-hidden>
              <Icon name="chevron" size={28} />
            </span>
            <span className={s.kind}>{video.kind === "reel" ? "Reels" : "Instagram"}</span>
          </button>
        )}
      </div>
      <figcaption>
        <span className={s.caption}>{title}</span>
        <a href={igUrl(video)} target="_blank" rel="noreferrer" className={s.igLink}>
          {t.media.openIg} ↗
        </a>
      </figcaption>
    </figure>
  );
}
