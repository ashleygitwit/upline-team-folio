import type { ReactNode } from "react";
import { cn } from "cn";

/**
 * A square thumbnail for each household, so the list reads as six different
 * families rather than six rows. Placeholders: each is a flat drawing of the
 * household's home in the brand palette, standing in for a photo the real
 * product could pull from the address on file. Swap these for images when
 * there's a photo source.
 */
export function HomeThumb({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 56 56" aria-hidden className={cn("size-14 shrink-0", className)}>
      {drawings[id] ?? drawings.callahan}
    </svg>
  );
}

const drawings: Record<string, ReactNode> = {
  // Two-story colonial in Dublin.
  callahan: (
    <>
      <rect width="56" height="56" className="fill-primary" />
      <rect x="36" y="14" width="5" height="9" className="fill-blue-300" />
      <polygon points="8,27 28,12 48,27" className="fill-blue-300" />
      <rect x="12" y="26" width="32" height="30" className="fill-card" />
      <rect x="16" y="31" width="6" height="6" className="fill-primary" />
      <rect x="34" y="31" width="6" height="6" className="fill-primary" />
      <rect x="16" y="43" width="6" height="6" className="fill-primary" />
      <rect x="32" y="44" width="6" height="12" className="fill-primary" />
    </>
  ),
  // An apartment downtown on High Street.
  okonkwo: (
    <>
      <rect width="56" height="56" className="fill-foreground" />
      <rect x="15" y="8" width="26" height="48" className="fill-card" />
      {[19, 26, 33].flatMap((x) =>
        [12, 19, 26, 33, 40].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" className="fill-foreground" />
        )),
      )}
      <rect x="25" y="48" width="6" height="8" className="fill-blue-300" />
    </>
  ),
  // Split-level on Walnut, two doors down from the Callahans.
  brennan: (
    <>
      <rect width="56" height="56" className="fill-blue-100" />
      <rect x="6" y="34" width="24" height="22" className="fill-primary" />
      <polygon points="4,35 18,25 32,35" className="fill-foreground" />
      <rect x="30" y="26" width="20" height="30" className="fill-primary" />
      <polygon points="28,27 40,16 52,27" className="fill-foreground" />
      <rect x="10" y="39" width="6" height="5" className="fill-blue-100" />
      <rect x="20" y="39" width="6" height="5" className="fill-blue-100" />
      <rect x="36" y="31" width="8" height="6" className="fill-blue-100" />
      <rect x="38" y="44" width="6" height="12" className="fill-blue-100" />
    </>
  ),
  // Brick rowhouse in German Village.
  rossi: (
    <>
      <rect width="56" height="56" className="fill-border" />
      <rect x="15" y="9" width="26" height="4" className="fill-foreground" />
      <rect x="17" y="12" width="22" height="44" className="fill-foreground" />
      <rect x="21" y="17" width="5" height="8" className="fill-blue-100" />
      <rect x="30" y="17" width="5" height="8" className="fill-blue-100" />
      <rect x="21" y="30" width="5" height="8" className="fill-blue-100" />
      <rect x="30" y="30" width="5" height="8" className="fill-blue-100" />
      <rect x="25" y="44" width="6" height="12" className="fill-primary" />
    </>
  ),
  // Ranch in Powell.
  miller: (
    <>
      <rect width="56" height="56" className="fill-blue-300" />
      <polygon points="3,37 28,25 53,37" className="fill-primary" />
      <rect x="6" y="36" width="44" height="20" className="fill-card" />
      <rect x="11" y="41" width="9" height="6" className="fill-blue-300" />
      <rect x="36" y="41" width="9" height="6" className="fill-blue-300" />
      <rect x="25" y="42" width="6" height="14" className="fill-primary" />
    </>
  ),
  // Victorian near the Short North.
  nguyen: (
    <>
      <rect width="56" height="56" className="fill-muted" />
      <polygon points="8,21 15.5,8 23,21" className="fill-foreground" />
      <rect x="9" y="20" width="13" height="36" className="fill-primary" />
      <polygon points="20,31 35,20 50,31" className="fill-foreground" />
      <rect x="22" y="30" width="26" height="26" className="fill-primary" />
      <rect x="13" y="26" width="5" height="7" className="fill-muted" />
      <rect x="13" y="39" width="5" height="7" className="fill-muted" />
      <rect x="27" y="35" width="6" height="6" className="fill-muted" />
      <rect x="38" y="35" width="6" height="6" className="fill-muted" />
      <rect x="33" y="45" width="6" height="11" className="fill-muted" />
    </>
  ),
};
