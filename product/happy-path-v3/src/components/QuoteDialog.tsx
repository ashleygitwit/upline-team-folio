import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { agency, type Quote } from "@/data";
import { focusPanel } from "@/lib/focus";

/**
 * A carrier's quote, drawn as the document it stands in for. For anyone who
 * really wants the detail, this is where it lives, not on the page.
 */
export function QuoteDialog({ quote, onClose }: { quote: Quote | null; onClose: () => void }) {
  const [shown, setShown] = useState(quote);
  if (quote && quote !== shown) setShown(quote);
  if (!shown) return null;

  return (
    <Dialog open={quote !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent onOpenAutoFocus={focusPanel} className="max-h-[88svh] overflow-y-auto outline-none sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm font-normal">{shown.filename}</DialogTitle>
          <DialogDescription>
            {shown.current ? "Renewal offer, pulled from the carrier." : "Quote pulled directly from the carrier."}
          </DialogDescription>
        </DialogHeader>

        <article className="border bg-card p-8">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-xl">{shown.carrier}</p>
            <p className="eyebrow text-muted-foreground">{shown.current ? "Renewal" : "Quote"}</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {shown.title} · Prepared for {agency.name}
          </p>

          <p className="eyebrow mt-8 text-muted-foreground">Annual premium</p>
          <p className="mt-1 font-display text-4xl">{shown.premium}</p>

          <dl className="mt-8 divide-y border-y text-sm">
            {shown.rows.map((r) => (
              <div key={r.label} className="flex justify-between gap-6 py-2.5">
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className="text-right">{r.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm text-muted-foreground">
            {shown.current
              ? "This is the in-force renewal offer. It takes effect on the renewal date unless the policy is changed."
              : "This quote does not put coverage in place. It is valid for 15 days from the quote date."}
          </p>
        </article>
      </DialogContent>
    </Dialog>
  );
}
