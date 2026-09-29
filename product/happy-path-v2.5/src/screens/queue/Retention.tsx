import { useMemo, useState, type ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { stats, weeks } from "@/data";
import { useMobile } from "@/lib/viewport";

const W = 640;
const H = 168;
const pad = { l: 28, r: 8, t: 12, b: 26 };
const BAR = 7;
const GAP = 3;

const series = [
  { key: "queued", label: "Teed up", fill: "fill-chart-queued", swatch: "bg-chart-queued" },
  { key: "sent", label: "Sent", fill: "fill-chart-sent", swatch: "bg-chart-sent" },
  { key: "retained", label: "Renewed", fill: "fill-chart-kept", swatch: "bg-chart-kept" },
] as const;

/**
 * Ashley's retention strip: households teed up, sent and renewed by week, and
 * the averages beside it. Renewed only counts once a week's renewal date has
 * passed, so the last four weeks have two bars.
 */
export function Retention() {
  const mobile = useMobile();
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover == null ? null : weeks[hover];
  const max = useMemo(
    () => Math.ceil(Math.max(...weeks.flatMap((w) => [w.queued, w.sent, w.retained ?? 0])) / 5) * 5,
    [],
  );
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const slot = plotW / weeks.length;
  const y = (v: number) => pad.t + plotH - (v / max) * plotH;
  const h = (v: number) => (v / max) * plotH;
  const ring = 2 * Math.PI * 42;

  return (
    <section
      aria-label="Retention data"
      className={cn(
        "mt-4 mb-1 grid gap-3",
        mobile ? "mt-2.5 grid-cols-1 gap-2" : "grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] max-[980px]:grid-cols-1",
      )}
    >
      <div className={cn("border bg-card px-4.5 pt-4 pb-2.5", mobile && "overflow-x-auto px-3 pt-3 pb-2")}>
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div>
            <h2 className="text-base">Weekly book</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Counted after the renewal date.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5 text-xs font-medium text-muted-foreground">
            {series.map((s) => (
              <span key={s.key} className="inline-flex items-center gap-1.5">
                <i aria-hidden className={cn("size-2", s.swatch)} />
                {s.label}
              </span>
            ))}
            <Badge variant="outline">{stats.rangeLabel}</Badge>
          </div>
        </div>

        <div className={cn("relative mt-1", mobile && "min-w-[640px]")}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={cn("block w-full", mobile ? "h-[210px]" : "h-[168px]")}
            role="img"
            aria-label="Households teed up, sent, and renewed by week. The table below has the numbers."
          >
            {[0, max / 2, max].map((v) => (
              <g key={v}>
                <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="stroke-border" strokeWidth={1} />
                <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" className="fill-muted-foreground text-[10px] font-medium">
                  {v}
                </text>
              </g>
            ))}
            {weeks.map((w, i) => {
              const cx = pad.l + i * slot + slot / 2;
              const bars = w.retained == null ? 2 : 3;
              const x0 = cx - (bars * BAR + (bars - 1) * GAP) / 2;
              const on = i === hover;
              return (
                <g
                  key={w.label}
                  className="cursor-pointer"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <rect x={pad.l + i * slot} y={pad.t} width={slot} height={plotH} fill="transparent" />
                  {series.map((s, k) => {
                    const v = w[s.key];
                    return v == null ? null : (
                      <rect key={s.key} x={x0 + k * (BAR + GAP)} y={y(v)} width={BAR} height={h(v)} className={s.fill} />
                    );
                  })}
                  <text
                    x={cx}
                    y={160}
                    textAnchor="middle"
                    className={cn(
                      "text-[10px] font-medium",
                      on || w.current ? "fill-primary" : "fill-muted-foreground",
                    )}
                  >
                    {w.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {shown && hover != null && (
            <div
              className="pointer-events-none absolute top-1.5 z-10 min-w-[148px] -translate-x-1/2 bg-dark-bg px-3 py-2.5 text-xs leading-relaxed text-dark-fg"
              style={{ left: `${Math.min(86, Math.max(14, ((hover + 0.5) / weeks.length) * 100))}%` }}
            >
              <p className="mb-1 text-[10px] font-semibold tracking-wider text-dark-muted-fg uppercase">
                {shown.current ? "This week" : shown.label}
              </p>
              <p className="flex items-center gap-1.5">
                <i aria-hidden className="size-2 bg-chart-queued" /> {shown.queued} teed up
              </p>
              <p className="flex items-center gap-1.5">
                <i aria-hidden className="size-2 bg-chart-sent" /> {shown.sent} sent
              </p>
              <p className="flex items-center gap-1.5">
                <i aria-hidden className="size-2 bg-chart-kept ring-1 ring-dark-fg/40" />
                {shown.retained == null ? "Available after the renewal date" : `${shown.retained} renewed`}
              </p>
            </div>
          )}

          <table className="sr-only">
            <caption>Households by week</caption>
            <thead>
              <tr>
                <th scope="col">Week</th>
                <th scope="col">Teed up</th>
                <th scope="col">Sent</th>
                <th scope="col">Renewed</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((w) => (
                <tr key={w.label}>
                  <th scope="row">{w.label}</th>
                  <td>{w.queued}</td>
                  <td>{w.sent}</td>
                  <td>{w.retained ?? "Available after the renewal date"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-2.5",
          mobile ? "grid-cols-3 gap-2" : "grid-cols-[1.15fr_1fr] grid-rows-2 max-[980px]:grid-cols-2",
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 border bg-card px-3 py-3.5 text-center",
            mobile ? "items-start justify-start gap-0.5 px-2.5 pt-2.5 pb-3 text-left" : "row-span-2 max-[980px]:col-span-2 max-[980px]:row-span-1 max-[980px]:flex-row max-[980px]:gap-4",
          )}
        >
          <p className={cn("eyebrow text-muted-foreground", mobile && "hidden")}>Average retention</p>
          <div className={cn("relative size-[108px]", mobile && "size-auto")}>
            <svg viewBox="0 0 108 108" aria-hidden className={cn("size-[108px]", mobile && "hidden")}>
              <circle cx={54} cy={54} r={42} fill="none" className="stroke-blue-100" strokeWidth={10} />
              <circle
                cx={54}
                cy={54}
                r={42}
                fill="none"
                className="stroke-primary"
                strokeWidth={10}
                strokeDasharray={ring}
                strokeDashoffset={ring * (1 - stats.avgRetention / 100)}
                transform="rotate(-90 54 54)"
              />
            </svg>
            <p
              className={cn(
                "grid place-items-center font-display text-2xl",
                mobile ? "static text-left" : "absolute inset-0",
              )}
            >
              {stats.avgRetention}%
            </p>
          </div>
          <p className={cn("text-xs text-muted-foreground", mobile && "text-[10.5px] leading-tight")}>
            Through {stats.throughLabel}
          </p>
        </div>

        <Mini
          wave="M0 18 C12 18 14 8 26 8 S40 22 52 16 S68 4 80 10"
          stat={
            <>
              <ArrowUp className="size-3.5" aria-hidden />+{stats.vsLastYearPts}%
            </>
          }
          caption={`vs this stretch last year (${stats.lastYearRetention}%)`}
        />
        <Mini
          wave="M0 20 C10 16 18 6 30 10 S48 24 60 14 S72 8 80 12"
          alt
          stat={`${stats.leadsToSales} leads`}
          caption="sent to sales this month"
        />
      </div>
    </section>
  );
}

function Mini({ wave, alt, stat, caption }: { wave: string; alt?: boolean; stat: ReactNode; caption: string }) {
  const mobile = useMobile();
  return (
    <div className={cn("flex flex-col justify-end border bg-card px-3.5 pt-3 pb-3.5", mobile && "justify-start gap-0.5 px-2.5 pt-2.5 pb-3")}>
      <svg viewBox="0 0 80 28" aria-hidden className={cn("mb-1 h-[22px] w-[72px]", mobile && "hidden")}>
        <path d={wave} fill="none" strokeWidth={2} className={alt ? "stroke-chart-sent" : "stroke-primary"} />
      </svg>
      <p className="flex items-center gap-1 font-display text-xl">{stat}</p>
      <p className={cn("text-xs text-muted-foreground", mobile && "text-[10.5px] leading-tight")}>{caption}</p>
    </div>
  );
}
