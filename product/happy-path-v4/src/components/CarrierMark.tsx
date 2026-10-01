import { cn } from "cn";
import autoOwners from "@/assets/carriers/auto-owners.png";
import erie from "@/assets/carriers/erie.png";
import grange from "@/assets/carriers/grange.png";
import nationwide from "@/assets/carriers/nationwide.png";
import ohioMutual from "@/assets/carriers/ohio-mutual.png";
import travelers from "@/assets/carriers/travelers.png";
import westfield from "@/assets/carriers/westfield.png";

/**
 * A carrier's mark beside its name, in the carrier's own colors: the design
 * hub's CarrierMark (src/components/review/carrier-mark.tsx there), ported.
 *
 * Nationwide's and Travelers' are the ones uplineinsurance.com ships in its
 * carrier rows (upline-marketing-site/public/logos). Auto-Owners', Erie's,
 * Grange's, Ohio Mutual's and Westfield's came from Amanda on 2026-10-01
 * (her Carrier Icons folder), scaled to 128px so the exported page stays
 * small; until then they were each carrier's initial on the muted ground. A
 * carrier with no file still gets that placeholder; drop the file in
 * src/assets/carriers and add a line here.
 */
const marks: Record<string, string> = {
  "Auto-Owners": autoOwners,
  Erie: erie,
  Grange: grange,
  Nationwide: nationwide,
  "Ohio Mutual": ohioMutual,
  Travelers: travelers,
  Westfield: westfield,
};

export function CarrierMark({ carrier, className }: { carrier: string; className?: string }) {
  const src = marks[carrier];
  return src ? (
    <img src={src} alt="" className={cn("size-5 shrink-0 object-contain", className)} />
  ) : (
    <span
      aria-hidden
      title={`${carrier}: mark not on file`}
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center bg-muted font-display text-[11px] leading-none font-medium text-muted-foreground",
        className,
      )}
    >
      {carrier.charAt(0)}
    </span>
  );
}
