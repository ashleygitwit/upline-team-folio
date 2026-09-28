import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "cn";
import { HomeThumb } from "@/components/HomeThumb";
import { HouseholdDetails } from "@/components/HouseholdDetails";
import { PriceChange } from "@/components/PriceChange";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  agency,
  callahan,
  callahanHistory,
  carrierHistory,
  danaAnswers,
  money,
  optionById,
  options,
  recEmails,
  recSubject,
  type Day,
} from "@/data";
import { badgeVariant, statusFor } from "@/status";
import { words } from "@/today";
import type { Walk, WalkProps } from "@/walk";

type Entry = {
  id: string;
  date: string;
  time?: string;
  kind: string;
  title: string;
  summary: string;
  /** What opens inside the card, and what its button says. */
  more?: { label: string; content: React.ReactNode };
};

/**
 * A client's page. It opens on what has happened on the account, newest
 * first, because that's the question Stacey arrives with: where are we with
 * the Callahans? Each entry is a card she can open. When a shop comes back,
 * its card is the blue one, and it leads to the results. Who's in the
 * household and who insures them are a tab away.
 */
export function Profile({
  day,
  walk,
  onHome,
  onResults,
  onEdit,
}: WalkProps & { day: Day; onHome: () => void; onResults: () => void; onEdit: () => void }) {
  const h = callahan;
  const skipped = walk.skipped.includes(h.id);
  const status = day === "mon" ? null : statusFor(h, day, walk);
  const label = status?.label ?? (skipped ? "Skipped" : "Goes out Tuesday");
  const increase = h.now - h.was;
  const shopped = !skipped && (day === "thu" || day === "fri");

  return (
    <div className="shell pt-10 pb-(--space-section)">
      <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onHome}>
        <ArrowLeft data-icon="inline-start" />
        Home
      </Button>

      <header className="mt-10 flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
        <div className="flex items-start gap-5">
          <HomeThumb id={h.id} />
          <div>
            <h1 className="text-4xl">{h.name}</h1>
            <p className="mt-2 font-display text-lg font-normal text-muted-foreground">
              {h.lines} · {h.carrier} · Renews {h.renewsLong}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {h.address} · {h.phone}
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <Badge variant={badgeVariant(label)}>{label}</Badge>
          <p className="mt-3 text-base font-medium tabular-nums">+{money(increase)} a year</p>
          <p className="text-sm text-muted-foreground tabular-nums">
            {money(h.was)} → {money(h.now)}
          </p>
        </div>
      </header>

      <Tabs defaultValue="activity" className="mt-10">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="household">Household Details</TabsTrigger>
          <TabsTrigger value="carrier">Carrier Information</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="pt-10">
          <ol className="flex flex-col gap-4">
            {timelineFor(day, walk, onEdit).map((e) =>
              e.id === "results" ? (
                <Dated key={e.id} entry={e}>
                  <Results entry={e} sent={walk.recSent || day === "fri"} onResults={onResults} />
                </Dated>
              ) : (
                <Dated key={e.id} entry={e}>
                  <Update entry={e} />
                </Dated>
              ),
            )}
          </ol>
        </TabsContent>

        <TabsContent value="household" className="max-w-160 pt-10">
          <HouseholdDetails h={h} day={day} />
        </TabsContent>

        <TabsContent value="carrier" className="flex max-w-160 flex-col gap-10 pt-10">
          <section aria-labelledby="carrier-now">
            <h2 id="carrier-now" className="text-xl">
              {h.carrier}, today
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {h.lines} · Renews {h.renewsLong} at {money(h.now)}
            </p>
            <dl className="mt-4 divide-y border-y text-sm">
              {h.policies.map((p) => (
                <div key={p.line} className="flex items-baseline justify-between gap-4 py-3">
                  <dt>
                    {p.line}
                    <span className="text-muted-foreground"> · {p.detail}</span>
                  </dt>
                  <dd className="shrink-0 tabular-nums">
                    {money(p.current)} → {money(p.renewal)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {shopped && (
            <section aria-labelledby="carrier-shop">
              <h2 id="carrier-shop" className="text-xl">
                This renewal's shop
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Shopped Thursday morning.</p>
              <ul className="mt-4 divide-y border-y text-sm">
                {options.map((o) => (
                  <li key={o.id} className="flex items-baseline justify-between gap-4 py-3">
                    <span>
                      {o.carrier}
                      <span className="text-muted-foreground"> · {o.tag}</span>
                    </span>
                    <span className="shrink-0 tabular-nums">{money(o.price)}</span>
                  </li>
                ))}
              </ul>
              <Button variant="link" className="mt-4 h-auto p-0 font-sans text-sm" onClick={onResults}>
                See the results
                <ArrowRight data-icon="inline-end" />
              </Button>
            </section>
          )}

          <section aria-labelledby="carrier-history">
            <h2 id="carrier-history" className="text-xl">
              Carrier history
            </h2>
            <ul className="mt-4 divide-y border-y text-sm">
              {carrierHistory.map((c) => (
                <li key={c.carrier} className="flex items-baseline justify-between gap-4 py-3">
                  <span>
                    {c.carrier}
                    <span className="text-muted-foreground"> · {c.lines}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">{c.span}</span>
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * The Callahans' account so far, newest first. This week's entries follow the
 * walk: what the day has reached, and what the presenter did on the way.
 */
function timelineFor(day: Day, walk: Walk, onEdit: () => void): Entry[] {
  const h = callahan;
  const at = ["mon", "wed", "thu", "fri"].indexOf(day);
  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;
  const email = walk.drafts[h.id] ?? h.email;
  const asked = danaAnswers.filter((q) => q.id !== "life" || (walk.lifeQuote[h.id] ?? true));
  const entries: Entry[] = [];

  if (walk.skipped.includes(h.id)) {
    entries.push({
      id: "skipped",
      date: "Oct 12",
      kind: "Renewal email",
      title: "Skipped this time",
      summary: "You're handling this one yourself, so no email went out and we won't shop it.",
    });
  } else {
    if (at >= 3 && walk.bound) {
      entries.push({
        id: "bound",
        date: "Oct 16",
        kind: "Closed",
        title: pick.current ? "Staying with Erie" : `Bound with ${pick.carrier}`,
        summary: pick.current
          ? `Erie renews on ${h.renewsLong}. One more household that stayed with you.`
          : `${pick.carrier} takes over on ${h.renewsLong}, with ${money(erie.price - pick.price)} back for Dana and Mike.`,
      });
    }
    if (at >= 3) {
      entries.push({
        id: "approved",
        date: "Oct 15",
        time: "6:20 PM",
        kind: "Approval",
        title: pick.current ? "Dana and Mike are staying with Erie" : `Dana and Mike approved ${pick.carrier}`,
        summary: pick.current
          ? `There's nothing to bind. Erie renews on its own on ${h.renewsLong}.`
          : `Bind it in the ${pick.carrier} portal before ${h.renewsLong}, then mark it done.`,
      });
    }
    if (at >= 3 || (at === 2 && walk.recSent)) {
      entries.push({
        id: "rec",
        date: "Oct 15",
        time: "11:20 AM",
        kind: "Recommendation",
        title: "Recommendation sent to Dana",
        summary: `Your pick was ${pick.carrier} at ${money(pick.price)}. It went from your inbox with a link to Dana's page.`,
        more: {
          label: "View the email",
          content: <Email subject={recSubject} body={walk.recDraft ?? recEmails[walk.pick]} />,
        },
      });
    }
    if (at >= 2) {
      entries.push({
        id: "results",
        date: "Oct 15",
        time: "Morning",
        kind: "Shopped results",
        title: "Results are back",
        summary: `Auto-Owners will write the same coverage for ${money(4640)}. That's ${money(erie.price - 4640)} less than Erie's renewal.`,
      });
    }
    if (at >= 1) {
      entries.push(
        {
          id: "shopping",
          date: "Oct 14",
          kind: "Shopping",
          title: "Shopping three carriers",
          summary:
            at === 1
              ? "We're shopping Auto-Owners, Erie and Grange, back Thursday."
              : "We shopped Auto-Owners, Erie and Grange.",
        },
        {
          id: "questionnaire",
          date: "Oct 13",
          time: "7:40 PM",
          kind: "Questionnaire",
          title: "Questionnaire completed",
          summary: `Dana answered all ${words[asked.length].toLowerCase()} questions, added Sophie's license number and occupation, and changed the email on file.`,
          more: { label: "View Dana's answers", content: <Answers questions={asked} /> },
        },
        {
          id: "sent",
          date: "Oct 13",
          time: "9:00 AM",
          kind: "Renewal email",
          title: "Renewal email sent",
          summary: `From ${agency.agent.email}, with a link to the questionnaire.`,
          more: { label: "View the email", content: <Email subject={h.subject} body={email} /> },
        },
      );
    }
    if (at === 0) {
      entries.push({
        id: "scheduled",
        date: "Oct 12",
        kind: "Renewal email",
        title: "Renewal email scheduled",
        summary: "Drafted in your voice. It sends Tuesday at 9:00 AM from your inbox unless you skip it.",
        more: {
          label: "View the email",
          content: (
            <>
              <Email subject={h.subject} body={email} />
              <Button variant="outline" className="mt-5" onClick={onEdit}>
                Edit in Scheduled
              </Button>
            </>
          ),
        },
      });
    }
  }

  entries.push({
    id: "renewal",
    date: "Oct 12",
    kind: "Renewal",
    title: `Renewal came in at ${money(h.now)}`,
    summary: `Up ${money(h.now - h.was)} from last year. ${h.why}`,
    more: {
      label: "See the breakdown",
      content: (
        <>
          <PriceChange h={h} />
          <h4 className="mt-8 font-sans text-sm font-medium">A note from Upline</h4>
          <p className="mt-2 text-base">{h.colleague}</p>
        </>
      ),
    },
  });

  return [
    ...entries,
    ...callahanHistory.map((p) => ({ id: p.id, date: p.date, kind: p.kind, title: p.title, summary: p.detail })),
  ];
}

/** An entry with its date in the margin, so the dates read down one edge. */
function Dated({ entry, children }: { entry: Entry; children: React.ReactNode }) {
  return (
    <li className="grid gap-x-6 gap-y-2 sm:grid-cols-[6rem_minmax(0,1fr)]">
      <p className="text-sm tabular-nums sm:pt-(--card-pad)">
        {entry.date}
        {entry.time && <span className="block text-muted-foreground">{entry.time}</span>}
      </p>
      {children}
    </li>
  );
}

/** A status update: what happened, in a sentence, and the thing itself one click down. */
function Update({ entry }: { entry: Entry }) {
  return (
    <Collapsible asChild>
      <article className="border bg-card p-(--card-pad)">
        <p className="eyebrow text-muted-foreground">{entry.kind}</p>
        <h3 className="mt-3 text-xl">{entry.title}</h3>
        <p className="mt-2 max-w-[70ch] text-base">{entry.summary}</p>
        {entry.more && (
          <>
            <CollapsibleTrigger asChild>
              <Button variant="link" className="group mt-4 h-auto p-0 font-sans text-sm">
                {entry.more.label}
                <ChevronDown data-icon="inline-end" className="transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-6 max-w-160 border-t pt-6">{entry.more.content}</div>
            </CollapsibleContent>
          </>
        )}
      </article>
    </Collapsible>
  );
}

/**
 * The one card that isn't a status update: a shop came back. It's the blue
 * of the band so it can't be mistaken for the rest, and it goes to the
 * results rather than opening in place.
 */
function Results({ entry, sent, onResults }: { entry: Entry; sent: boolean; onResults: () => void }) {
  return (
    <article className="band-surface p-(--card-pad)">
      <p className="eyebrow">{entry.kind}</p>
      <h3 className="mt-3 text-2xl">{entry.title}</h3>
      <p className="mt-2 max-w-[70ch] text-base">{entry.summary}</p>
      <Button variant="secondary" size="lg" className="mt-6" onClick={onResults}>
        {sent ? "See the results" : "Review and send"}
        {sent && <ArrowRight data-icon="inline-end" />}
      </Button>
    </article>
  );
}

function Email({ subject, body }: { subject: string; body: string }) {
  return (
    <div className="text-base">
      <p className="text-sm">
        <span className="text-muted-foreground">Subject </span>
        {subject}
      </p>
      {/* The same box as the editable emails, so a sent email reads the same way. */}
      <div className="mt-2 flex flex-col gap-4 border bg-background px-2.5 py-2 leading-relaxed">
        {body.split(/\n\n+/).map((p, i) => (
          <p key={i} className="break-words">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

/**
 * Dana's answers, question by question. What Dana added or changed is
 * highlighted and labelled, so it's found without reading every line.
 */
function Answers({ questions }: { questions: typeof danaAnswers }) {
  return (
    <div className="flex flex-col gap-8">
      <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Badge variant="default">Added</Badge> New to us
        </span>
        <span className="flex items-center gap-2">
          <Badge variant="default">Changed</Badge> Replaces what was on file
        </span>
      </p>
      {questions.map((q, i) => (
        <section key={q.id} aria-labelledby={`answer-${q.id}`}>
          <h4 id={`answer-${q.id}`} className="font-sans text-base font-medium">
            <span className="text-muted-foreground">{i + 1}. </span>
            {q.question}
          </h4>
          <dl className="mt-3 divide-y border-y text-sm">
            {q.answers.map((a) => (
              <div
                key={a.label}
                className={cn(
                  "grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_5.5rem] items-baseline gap-x-4 px-3 py-3",
                  a.change && "bg-blue-100/40",
                )}
              >
                {/* Gray 700 falls under 4.5:1 on the highlight, so these rows use the body color. */}
                <dt className={a.change ? undefined : "text-muted-foreground"}>{a.label}</dt>
                <dd className={cn("break-words", a.change && "font-medium")}>
                  {a.value}
                  {a.was && <span className="block font-normal line-through">{a.was}</span>}
                </dd>
                <dd className="text-right">
                  {a.change && <Badge variant="default">{a.change === "added" ? "Added" : "Changed"}</Badge>}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
