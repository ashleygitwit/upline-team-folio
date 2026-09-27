import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { activity, retention } from "@/data";

/**
 * The homepage under the banner: how Stacey is doing, said the way the
 * marketing site says it. A headline, a sentence, and the one graphic, then a
 * few cards on what Stacey has been up to, each one number and one sentence. Quick
 * enough to take in with the first coffee of the day.
 */
export function Overview({ onSeeWhoLeft }: { onSeeWhoLeft: () => void }) {
  const { drafted, sent, stayed, pct, lastYearPct, since } = retention;
  const left = sent - stayed;

  return (
    <div className="shell flex flex-col gap-(--space-section) pt-16 pb-(--space-section)">
      <section aria-labelledby="retention-title">
        <p className="eyebrow text-muted-foreground">Since {since}</p>
        <h1 id="retention-title" className="mt-5 max-w-[26ch] text-5xl text-balance">
          You've kept {pct}% of the households we've reached.
        </h1>
        <p className="mt-6 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
          That's {pct - lastYearPct} points better than this stretch last year. We drafted {drafted} renewals, you sent{" "}
          {sent}, and {stayed} of those households stayed.
        </p>

        {/* A cell for every household Stacey sent: filled when they stayed,
            open when they left, so the gap is the thing you notice. */}
        <div
          role="img"
          aria-label={`${stayed} of the ${sent} households you reached stayed. ${left} left.`}
          className="mt-10 flex h-12 gap-0.5"
        >
          {Array.from({ length: sent }, (_, i) => (
            <span key={i} className={i < stayed ? "flex-1 bg-primary" : "flex-1 border border-primary bg-card"} />
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
      </section>

      <section aria-labelledby="activity-title">
        <h2 id="activity-title" className="text-4xl">
          Here's what you've been up to.
        </h2>
        <div className="mt-10 grid gap-(--space-block) md:grid-cols-3">
          {activity.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex h-full flex-col">
                <p className="eyebrow text-muted-foreground">{a.eyebrow}</p>
                <p className="mt-6 font-display text-5xl">{a.figure}</p>
                <p className="mt-2 font-display text-lg font-normal">{a.label}</p>
                <p className="mt-6 text-sm">{a.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
