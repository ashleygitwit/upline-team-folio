import type { CSSProperties } from "react";
import grain from "@/assets/band/band-grain.webp";
import mask from "@/assets/band/band-mountain.webp";
import ridgeGrain from "@/assets/band/band-ridge-grain.webp";
import ridgeMask from "@/assets/band/band-ridge.webp";

/**
 * The design hub's two band textures, drawn the way the hub draws them: the
 * grain tile shown only through the art's mask (.band-grain in index.css).
 * The files are the hub's own.
 *
 * - `mountain`: the homepage's halftone mountain in blue 800, with its grain,
 *   on the band's blue 600 (public/home/band-mountain.webp and
 *   band-grain.webp, BAND_MOUNTAIN in its site.ts), centred.
 * - `ridge`: the Websites page's gray band, the ridge in gray 200 on gray 100
 *   (public/band/band-ridge.webp and band-ridge-grain.webp, BAND_RIDGE),
 *   standing on the band's foot, as the hub anchors it.
 *
 * The band only ever sits wider than tall here, so the hub's portrait mask
 * isn't carried over.
 */
const textures = {
  mountain: { mask, grain, anchor: undefined },
  ridge: { mask: ridgeMask, grain: ridgeGrain, anchor: "center bottom" },
};

export function BandGrain({ texture = "mountain" }: { texture?: keyof typeof textures }) {
  const t = textures[texture];
  return (
    <div
      aria-hidden
      className="band-grain"
      style={
        {
          "--band-mask": `url(${t.mask})`,
          "--band-mask-anchor": t.anchor,
          "--band-grain": `url(${t.grain})`,
        } as CSSProperties
      }
    >
      <div className="band-grain-art" />
    </div>
  );
}
