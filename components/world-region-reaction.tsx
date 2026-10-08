"use client";
import Image from 'next/image';
import type {ZoneId} from '@/lib/world-data';
import {worldReactions} from '@/lib/world-reactions';
import {publicPath} from '@/lib/site-config';

export function WorldRegionReaction({zone}:{zone:ZoneId}) {
  const reaction=worldReactions[zone];
  return <figure className={`zone-reaction zone-reaction--${zone}`} data-reaction={zone} data-person-reaction={reaction.person} data-cat-reaction={reaction.cat}>
    <div className="zone-reaction-art"><Image src={publicPath(`/world/reaction-${zone}.webp`)} width={800} height={800} alt={`杨逸凡和小牛：${reaction.caption}`} unoptimized/>
      <span className="reaction-spark" aria-hidden="true">{reaction.effect}</span>
    </div><figcaption>{reaction.caption}</figcaption>
  </figure>;
}
