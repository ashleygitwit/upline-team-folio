import { CarrierMark } from "@/components/CarrierMark";
import { dayDate, type Day } from "@/data";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Inside a week, how long is left says more than the date does. `renews` is
 * "Oct 16". A Completed card on the board can be on or past its renewal.
 */
function renewsIn(renews: string, day: Day) {
  const [mon, date] = renews.split(" ");
  const renewal = new Date(2026, months.indexOf(mon), Number(date));
  const days = Math.round((renewal.getTime() - dayDate[day].getTime()) / 86_400_000);
  if (days < 0) return `Renewed ${renews}`;
  if (days === 0) return "Renews today";
  if (days >= 7) return `Renews ${renews}`;
  return days === 1 ? "Renews tomorrow" : `Renews in ${days} days`;
}

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
