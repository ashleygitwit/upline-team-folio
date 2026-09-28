import { money, type Household } from "@/data";

const pctOf = (a: number, b: number) => Math.round(((b - a) / a) * 100);

/**
 * Why a household's price moved: the dollar change, the sentence that
 * explains it, and the same change policy by policy, with the line that did
 * most of the moving picked out.
 */
export function PriceChange({ h }: { h: Household }) {
  const increase = h.now - h.was;
  const biggest = [...h.policies].sort((a, b) => b.renewal - b.current - (a.renewal - a.current))[0];

  return (
    <div>
      <p className="font-display text-3xl">{increase > 0 ? `+${money(increase)}` : "No change"}</p>
      <p className="mt-1 text-sm text-muted-foreground tabular-nums">
        {increase > 0
          ? `${money(h.was)} → ${money(h.now)} a year, up ${pctOf(h.was, h.now)}%`
          : `The same ${money(h.now)} a year as last time`}
      </p>
      <p className="mt-4 text-base">{h.why}</p>
      <dl className="mt-5 divide-y border-y text-sm">
        {h.policies.map((p) => {
          const up = p.renewal - p.current;
          return (
            <div key={p.line} className="flex items-baseline justify-between gap-4 py-3">
              <dt>
                {p.short}
                <span className="text-muted-foreground"> · {p.detail}</span>
              </dt>
              <dd className="shrink-0 tabular-nums">
                {money(p.current)} → {money(p.renewal)}
                <span
                  className={
                    h.policies.length > 1 && p === biggest && up > 0
                      ? "ml-3 inline-block w-12 text-right font-medium"
                      : "ml-3 inline-block w-12 text-right text-muted-foreground"
                  }
                >
                  {up > 0 ? `+${pctOf(p.current, p.renewal)}%` : "0%"}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
