import { cn } from "cn";
import nationwide from "@/assets/carriers/nationwide.png";
import travelers from "@/assets/carriers/travelers.png";

/**
 * A carrier's mark beside its name, in the carrier's own colors: the design
 * hub's CarrierMark (src/components/review/carrier-mark.tsx there), ported.
 *
 * The files are the ones uplineinsurance.com already ships in its carrier
 * rows (upline-marketing-site/public/logos), the sanctioned set, not something
 * scraped. Only Nationwide and Travelers are in it. A carrier with no file
 * gets its initial on the muted ground, a visible placeholder rather than a
 * substitute; drop the file in src/assets/carriers and add a line here.
 */
const marks: Record<string, string> = {
  Nationwide: nationwide,
  Travelers: travelers,
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
