import { cn } from "cn";
import erie from "@/assets/carriers/erie.svg";
import nationwide from "@/assets/carriers/nationwide.svg";
import travelers from "@/assets/carriers/travelers.svg";
import westfield from "@/assets/carriers/westfield.svg";

/**
 * The carriers' own symbols, cut from the monochrome lockups on the marketing
 * site's compatibility strip, so they wear the gray those do. Auto-Owners'
 * lockup is a wordmark with no symbol, and there's no mark at all for Grange
 * or Ohio Mutual yet, so those three draw their initial as a placeholder.
 */
const marks: Record<string, string> = {
  Erie: erie,
  Nationwide: nationwide,
  Travelers: travelers,
  Westfield: westfield,
};

export function CarrierMark({ carrier, className }: { carrier: string; className?: string }) {
  const src = marks[carrier];
  return src ? (
    <img src={src} alt="" className={cn("size-4 shrink-0", className)} />
  ) : (
    <span
      aria-hidden
      className={cn(
        "grid size-4 shrink-0 place-items-center border border-dashed border-muted-foreground font-mono text-[9px] leading-none text-muted-foreground",
        className,
      )}
    >
      {carrier[0]}
    </span>
  );
}
