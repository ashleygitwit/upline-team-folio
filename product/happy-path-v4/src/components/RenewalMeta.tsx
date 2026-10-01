import { CarrierMark } from "@/components/CarrierMark";

/**
 * A household's lines and its carrier with the carrier's mark, on one line,
 * as a board card says what's renewing. When it renews is the card's
 * countdown, under its name (Countdown in components/Status.tsx); it sat at
 * the end of this line until 2026-09-30.
 */
export function RenewalMeta({ lines, carrier }: { lines: string; carrier: string }) {
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
      {lines}
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1.5">
        <CarrierMark carrier={carrier} />
        {carrier}
      </span>
    </span>
  );
}
