import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUp, Car, Check, House, Layers2, Mail, Umbrella } from "lucide-react";
import { cn } from "cn";
import { Textarea } from "@/components/ui/textarea";
import type { Card, Kind } from "@/household/data";

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

/**
 * A section's heading in the drawer and its pages: the display face at 500
 * and 16px, in the text color, sentence case, as the design hub sets a small
 * label and the marketing site a draft's title, with 12px to what follows
 * and 32px above it from the section before. It was the eyebrow, in capitals
 * and gray, until 2026-10-01, when the drawer had about fifteen of them.
 */
export function SectionHead({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("font-display text-base font-medium", className)}>{children}</h3>;
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

/**
 * An email as it will go out: where it comes from, who it's to, and the
 * words, which can be edited. Everything in it keeps 24px from its sides, as
 * the drawer does, and the words 24px from the To and Subject above them.
 */
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
      <div className="flex items-center gap-2 border-b bg-muted px-6 py-3 text-sm text-muted-foreground">
        <Mail className="size-4" aria-hidden />
        {toolbar}
      </div>
      <dl className="grid grid-cols-[54px_1fr] gap-x-2 gap-y-1 border-b px-6 py-4 text-sm">
        <dt className="text-muted-foreground">To</dt>
        <dd>{to}</dd>
        <dt className="text-muted-foreground">Subject</dt>
        <dd className="font-medium">{subject}</dd>
      </dl>
      {children}
    </div>
  );
}

/**
 * An email's words, still editable until it goes, with its questionnaire link
 * set apart: the paragraphs either side of it are two boxes that read as one,
 * and the link line between them is its words, with the address under them,
 * and can't be edited. It isn't a link: the questionnaire opens from View the
 * Questionnaire under the renewal email (phases.tsx). Until 2026-10-02 the
 * Pruitts' went to Leah's questionnaire in the walk, and the others said on
 * hover that only the Pruitts' was in this prototype. An email with no link
 * line is one box.
 */
export function LinkedEmail({
  body,
  onChange,
  readOnly,
}: {
  body: string;
  onChange: (body: string) => void;
  readOnly?: boolean;
}) {
  const paragraphs = body.split(/\n\n+/);
  const at = paragraphs.findIndex((p) => linkLine.test(p));
  // Each box keeps the kit's own padding, so its focus ring has room, and the
  // frame's padding is short by as much (14px and the box's 10 at the sides,
  // 16 and its 8 above and below), so the words sit on the frame's 24px.
  const words = "min-h-0 resize-none border-0 bg-transparent text-[15px] leading-relaxed";

  if (at < 0) {
    return (
      <div className="px-3.5 py-4">
        <Textarea
          aria-label="Email"
          value={body}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={words}
        />
      </div>
    );
  }

  const before = paragraphs.slice(0, at).join("\n\n");
  const after = paragraphs.slice(at + 1).join("\n\n");
  const [, label, url] = paragraphs[at].match(linkLine)!;
  const join = (b: string, a: string) => onChange([b, paragraphs[at], a].filter((part) => part.trim()).join("\n\n"));

  return (
    <div className="px-3.5 py-4">
      <Textarea
        aria-label="Email, before the questionnaire link"
        value={before}
        readOnly={readOnly}
        onChange={(e) => join(e.target.value, after)}
        className={words}
      />
      <p className="my-4 px-2.5 text-[15px] leading-relaxed">
        {label}
        <span className="block text-sm break-all text-muted-foreground">{url.replace(/^https?:\/\//, "")}</span>
      </p>
      <Textarea
        aria-label="Email, after the questionnaire link"
        value={after}
        readOnly={readOnly}
        onChange={(e) => join(before, e.target.value)}
        className={words}
      />
    </div>
  );
}

/** A paragraph that's only a link: its words, an arrow, and the address, as Leah's inbox reads it. */
const linkLine = /^(.*?) → (https?:\/\/\S+)$/;
