import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { activity, earlier, retention, thisWeek, whoLeft, type Day } from "@/data";
import type { PillId } from "@/pills";
import { statusFor } from "@/status";
import { todayFor, words, type Today } from "@/today";
import type { WalkProps } from "@/walk";

export type AnswerProps = WalkProps & {
  day: Day;
  /** Runs the day's one action, the same one the brief carries. */
  onAction: (to: NonNullable<Today["action"]>["to"]) => void;
  /** Asks a follow-up, as if Jenna had picked its pill. */
  onAsk: (id: PillId) => void;
};

/**
 * What Upline says back. Every answer is written from what the prototype
 * already knows, so the same numbers and the same people turn up here as
 * everywhere else. `null` is a question it has no answer for.
 */
export function Answer({ id, ...props }: AnswerProps & { id: PillId | null }) {
  if (id === "today") return <TodayAnswer {...props} />;
  if (id === "retention") return <RetentionAnswer {...props} />;
  if (id === "left") return <LeftAnswer {...props} />;
  if (id === "savings") return <Figure id="savings" />;
  if (id === "life") return <Figure id="leads" />;
  if (id === "everyone") return <EveryoneAnswer {...props} />;
  return <p>I can't answer that one in this prototype yet. The questions below are the ones I know.</p>;
}

function TodayAnswer({ day, walk, onAction }: AnswerProps) {
  const today = todayFor(day, walk);
  return (
    <>
      <p>
        {today.lead} {today.sub}
      </p>
      {today.more && <p className="mt-4">{today.more}</p>}
      {today.action && (
        <Button
          variant={today.action.primary ? "default" : "outline"}
          className="mt-5"
          onClick={() => onAction(today.action!.to)}
        >
          {today.action.label}
        </Button>
      )}
    </>
  );
}

function RetentionAnswer({ onAsk }: AnswerProps) {
  const { drafted, sent, stayed, pct, lastYearPct, since } = retention;
  const left = sent - stayed;
  const outreach = activity.find((a) => a.id === "outreach")!;

  return (
    <>
      <p className="eyebrow text-muted-foreground">Since {since}</p>
      <p className="mt-3 font-display text-2xl text-balance">You've kept {pct}% of the households we've reached.</p>
      <p className="mt-3">
        That's {pct - lastYearPct} points better than this stretch last year. We drafted {drafted} renewals, you sent{" "}
        {sent}, and {stayed} of those households stayed.
      </p>

      {/* A cell for every household Jenna sent: filled when they stayed,
          open when they left, so the gap is the thing you notice. */}
      <div
        role="img"
        aria-label={`${stayed} of the ${sent} households you reached stayed. ${left} left.`}
        className="mt-6 flex h-12 gap-0.5"
      >
        {Array.from({ length: sent }, (_, i) => (
          <span key={i} className={i < stayed ? "flex-1 bg-primary" : "flex-1 border border-primary bg-card"} />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">{stayed} stayed</span>
        <span className="flex items-center gap-3">
          <span className="text-muted-foreground">{left} left</span>
          <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={() => onAsk("left")}>
            See who
            <ArrowRight data-icon="inline-end" />
          </Button>
        </span>
      </div>

      <Stat eyebrow={outreach.eyebrow} figure={outreach.figure} label={outreach.label} className="mt-8" />
      <p className="mt-4">{outreach.note}</p>
    </>
  );
}

function LeftAnswer({ walk, update }: AnswerProps) {
  const winBack = whoLeft.filter((l) => l.winBack);
  const names = winBack.map((l) => l.name.split(" ")[0]).join(" and ");

  return (
    <>
      <p>
        {words[whoLeft.length]} households left, out of the {retention.sent} you reached since {retention.since}.
      </p>
      <ul className="mt-5 divide-y border-y">
        {whoLeft.map((l) => (
          <li key={l.id} className="py-5">
            <p className="font-medium">{l.name}</p>
            <p className="text-sm text-muted-foreground">
              {l.lines} · {l.when}
            </p>
            <p className="mt-2">{l.what}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5">
        Rita and Paul moved out of state, so there's not much to do there. {names} might be worth a note from you.
      </p>
      {walk.notesDrafted ? (
        <p role="status" className="mt-5 flex items-start gap-3 text-sm">
          <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          Drafted. Both notes will be in Monday's list for you to look over before they send.
        </p>
      ) : (
        <Button className="mt-5" onClick={() => update({ notesDrafted: true })}>
          Draft a note to {names}
        </Button>
      )}
    </>
  );
}

/** One of the overview's numbers: the figure on a card, its sentence under it. */
function Figure({ id }: { id: string }) {
  const a = activity.find((x) => x.id === id)!;
  return (
    <>
      <Stat eyebrow={a.eyebrow} figure={a.figure} label={a.label} />
      <p className="mt-4">{a.note}</p>
    </>
  );
}

function Stat({
  eyebrow,
  figure,
  label,
  className,
}: {
  eyebrow: string;
  figure: string;
  label: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="gap-0">
        <p className="eyebrow text-muted-foreground">{eyebrow}</p>
        <p className="mt-6 font-display text-5xl">{figure}</p>
        <p className="mt-2 font-display text-lg font-normal">{label}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Everyone Upline has reached lately, in one plain list: the answer to
 * "where do I see everyone I reached out to?" without a board to manage.
 */
function EveryoneAnswer({ day, walk }: AnswerProps) {
  return (
    <>
      <p>The last four weeks of renewals, this week first.</p>
      <div className="mt-6 flex flex-col gap-8">
        <Group title="This week">
          {thisWeek.map((h) => {
            const skipped = walk.skipped.includes(h.id);
            const where = day === "mon" ? (skipped ? "Skipped" : "Goes out Tuesday") : statusFor(h, day, walk).label;
            return (
              <TableRow key={h.id}>
                <TableCell className="font-medium whitespace-normal">{h.name}</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  {h.lines} · {h.carrier}
                </TableCell>
                <TableCell>{h.renews}</TableCell>
                <TableCell className="whitespace-normal">{where}</TableCell>
              </TableRow>
            );
          })}
        </Group>

        <Group title="Earlier weeks">
          {earlier.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium whitespace-normal">{e.name}</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">{e.lines}</TableCell>
              <TableCell>{e.renews}</TableCell>
              <TableCell className="whitespace-normal">{day === "mon" ? e.mon : e.later}</TableCell>
            </TableRow>
          ))}
        </Group>

        <Group title="Left">
          {whoLeft.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="font-medium whitespace-normal">{l.name}</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">{l.lines}</TableCell>
              <TableCell>{l.date}</TableCell>
              <TableCell className="whitespace-normal">{l.short}</TableCell>
            </TableRow>
          ))}
        </Group>
      </div>
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <h3 className="text-xl">{title}</h3>
      <Table className="mt-3 table-fixed text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[27%]">Household</TableHead>
            <TableHead className="w-[31%]">Lines</TableHead>
            <TableHead className="w-[11%]">Renews</TableHead>
            <TableHead>Where it stands</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </section>
  );
}
