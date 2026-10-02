import type { CSSProperties } from "react";
import grain from "@/assets/band/band-grain.webp";
import mask from "@/assets/band/band-mountain.webp";

/**
 * The design hub homepage's band texture, drawn the way the hub draws it: the
 * grain tile shown only through the art's mask (.band-grain in index.css).
 * It's the halftone mountain in blue 800, with its grain, on the band's blue
 * 600 (public/home/band-mountain.webp and band-grain.webp, BAND_MOUNTAIN in
 * its site.ts), centred. The files are the hub's own. The band only ever sits
 * wider than tall here, so the hub's portrait mask isn't carried over.
 */
export function BandGrain() {
  return (
    <div
      aria-hidden
      className="band-grain"
      style={
        {
          "--band-mask": `url(${mask})`,
          "--band-grain": `url(${grain})`,
        } as CSSProperties
      }
    >
      <div className="band-grain-art" />
    </div>
  );
}
