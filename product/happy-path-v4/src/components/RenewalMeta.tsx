import { CarrierMark } from "@/components/CarrierMark";
import type { Day } from "@/data";
import { renewsIn } from "@/tasks";

/**
 * A household's lines, its carrier with the carrier's mark, and when it
 * renews, on one line. The Monday email's cards and the homepage's Shopped and
 * Closing rows both carry it. A span, since on the homepage it sits inside the
 * row's button.
 */
export function RenewalMeta({
  lines,
  carrier,
  renews,
  day,
}: {
  lines: string;
  carrier: string;
  renews: string;
  day: Day;
}) {
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
      {lines}
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1.5">
        <CarrierMark carrier={carrier} />
        {carrier}
      </span>
      <span aria-hidden>·</span>
      {renewsIn(renews, day)}
    </span>
  );
}
