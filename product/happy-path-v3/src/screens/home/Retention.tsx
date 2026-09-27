import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dayLabel, retention, type Day } from "@/data";

/**
 * How the agency is doing, said in words first. The one graphic is the gap:
 * a strip with a cell for every household Stacey sent, filled when they
 * stayed and open when they left, so the three that got away are the thing
 * you notice.
 */
export function Retention({ day, onSeeWhoLeft }: { day: Day; onSeeWhoLeft: () => void }) {
  const { drafted, sent, stayed, pct, lastYearPct, lifeLeads, since } = retention;
  const left = sent - stayed;

  return (
    <section aria-labelledby="retention-title">
      <p className="eyebrow text-muted-foreground">{dayLabel[day]}</p>
      <h1 id="retention-title" className="mt-5 max-w-[26ch] text-5xl text-balance">
        You've kept {pct}% of the households we've reached.
      </h1>
      <p className="mt-6 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
        That's {pct - lastYearPct} points better than this stretch last year. Since {since} we've drafted{" "}
        {drafted} renewals, you sent {sent}, and {stayed} of those households stayed.
      </p>

      <div
        role="img"
        aria-label={`${stayed} of the ${sent} households you reached stayed. ${left} left.`}
        className="mt-10 flex h-12 gap-0.5"
      >
        {Array.from({ length: sent }, (_, i) => (
          <span
            key={i}
            className={i < stayed ? "flex-1 bg-primary" : "flex-1 border border-primary bg-card"}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">{stayed} stayed</span>
        <span className="flex items-center gap-3">
          <span className="text-muted-foreground">{left} left</span>
          <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onSeeWhoLeft}>
            See who
            <ArrowRight data-icon="inline-end" />
          </Button>
        </span>
      </div>

      <p className="mt-8 text-base">
        Also this month: {lifeLeads} households asked about a life quote, and they're with your sales team.
      </p>
    </section>
  );
}
