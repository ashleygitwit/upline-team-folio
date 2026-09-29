import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUp, Car, Check, House, Layers2, Mail, Umbrella } from "lucide-react";
import { cn } from "cn";
import type { Card, Kind, TimelineItem } from "@/data";

export function KindIcon({ kind, className }: { kind: Kind; className?: string }) {
  const Icon = kind === "home" ? House : kind === "auto" ? Car : Umbrella;
  return <Icon className={className} aria-hidden />;
}

/** One icon for a household's lines: the line itself, or a stack for a bundle. */
export function CardGlyph({ card, className }: { card: Card; className?: string }) {
  return card.kinds.length > 1 ? (
    <Layers2 className={className} aria-hidden />
  ) : (
    <KindIcon kind={card.kinds[0]} className={className} />
  );
}

/** The renewal's change, with an arrow so it never rests on color. */
export function Change({ pct, className }: { pct: number; className?: string }) {
  const Icon = pct > 0 ? ArrowUp : pct < 0 ? ArrowDown : ArrowRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 font-medium text-foreground", className)}>
      <Icon className="size-3" aria-hidden />
      <span>
        <span className="sr-only">{pct > 0 ? "up " : pct < 0 ? "down " : "no change, "}</span>
        {Math.abs(pct)}%
      </span>
    </span>
  );
}

export function SectionHead({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("eyebrow text-muted-foreground", className)}>{children}</h3>;
}

/** What has happened on a household, oldest first, with where it stands now. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="grid gap-2">
      {items.map((it) => (
        <li
          key={it.label}
          className={cn(
            "grid grid-cols-[92px_12px_1fr] items-start gap-3 border bg-card px-4 py-3.5",
            it.state === "now" && "border-primary bg-blue-100/30",
          )}
        >
          <time className={cn("pt-0.5 text-sm font-medium text-muted-foreground", it.state === "now" && "text-primary")}>
            {it.date}
          </time>
          <span
            aria-hidden
            className={cn(
              "mt-1.5 size-2.5 justify-self-center",
              it.state === "done" && "bg-primary",
              it.state === "now" && "bg-primary ring-4 ring-blue-100",
              it.state === "soon" && "border-2 border-primary bg-card",
            )}
          />
          <div>
            <p className="text-base font-medium leading-snug">{it.label}</p>
            {it.detail && <p className="mt-1 text-sm text-muted-foreground">{it.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A quote that matches what the household has today is a check; anything else is written out. */
export function CovMark({ value }: { value: string | true | undefined }) {
  return value === true || value == null ? (
    <span className="inline-flex text-primary">
      <Check className="size-3.5" aria-hidden />
      <span className="sr-only">Same as current</span>
    </span>
  ) : (
    <span className="font-medium text-primary">{value}</span>
  );
}

/** Where a carrier's mark will go. The hub has no marks for these carriers yet. */
export function CarrierLogo({ name }: { name: string }) {
  return (
    <span
      title={`${name} logo`}
      className="grid size-12 shrink-0 place-items-center border border-dashed border-primary/40 bg-card p-1"
    >
      <span className="text-center text-[8px] leading-tight font-semibold tracking-wider text-muted-foreground uppercase">
        Logo here
      </span>
    </span>
  );
}

/** An email as it will go out: where it comes from, who it's to, and the words, which can be edited. */
export function EmailFrame({
  toolbar,
  to,
  subject,
  children,
}: {
  toolbar: string;
  to: string;
  subject: string;
  children: ReactNode;
}) {
  return (
    <div className="border bg-card">
      <div className="flex items-center gap-2 border-b bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
        <Mail className="size-4" aria-hidden />
        {toolbar}
      </div>
      <dl className="grid grid-cols-[54px_1fr] gap-x-2 gap-y-0.5 border-b px-5 py-3.5 text-sm">
        <dt className="text-muted-foreground">To</dt>
        <dd>{to}</dd>
        <dt className="text-muted-foreground">Subject</dt>
        <dd className="font-medium">{subject}</dd>
      </dl>
      {children}
    </div>
  );
}
