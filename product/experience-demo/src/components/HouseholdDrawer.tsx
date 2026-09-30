import { useState } from "react";
import { createPortal } from "react-dom";
import { Icon, money } from "./ui";
import {
  agency,
  fileFor,
  outreachBody,
  outreachEmail,
  questionnaireFields,
  questionnaireUrl,
  recEmail,
  recEmailBody,
  zillowUrl,
  type ChronoItem,
  type HouseholdFile,
  type LineKind,
  type QueueCard,
  type QuoteDoc,
} from "../data";

type Tab = "details" | "outreach" | "shopping" | "rec" | "closing";

export function HouseholdDrawer({
  card,
  onClose,
  onSendOutreach,
  onSendRec,
  onOpenResults,
  onAskCloseOut,
  onSkipOutreach,
}: {
  card: QueueCard;
  onClose: () => void;
  onSendOutreach: () => void;
  onSendRec: () => void;
  onOpenResults: () => void;
  onAskCloseOut: () => void;
  onSkipOutreach?: () => void;
}) {
  const file = fileFor(card);
  const defaultTab: Tab =
    card.col === "outreach" ? "outreach"
    : card.col === "shopping" ? "shopping"
    : card.col === "recommend" ? "rec"
    : "closing";
  const formUrl = card.target ? questionnaireUrl : `https://${agency.questionnaireHost}/d/${card.id}`;
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [body, setBody] = useState(
    card.target ? outreachBody.join("\n\n") : genericOutreach(card, formUrl),
  );
  const [recBody, setRecBody] = useState(
    file.rec?.email ?? (card.target ? recEmailBody.join("\n\n") : genericRec(card)),
  );
  const [qPane, setQPane] = useState<"confirm" | "ask">("confirm");
  const [confirm, setConfirm] = useState(
    (card.target ? questionnaireFields.confirm : genericConfirm(card, file)).map((f) => ({ ...f, included: true })),
  );
  const [ask, setAsk] = useState(
    (card.target ? questionnaireFields.ask : genericAsk()).map((q) => ({ ...q, included: true })),
  );
  const [newQ, setNewQ] = useState("");

  const tabs: { id: Tab; label: string }[] =
    card.col === "outreach" ? [{ id: "details", label: "Details" }, { id: "outreach", label: "Outreach" }]
    : card.col === "shopping" ? [{ id: "details", label: "Details" }, { id: "shopping", label: "Shopping" }]
    : card.col === "recommend" ? [{ id: "details", label: "Details" }, { id: "rec", label: "Recommendation" }]
    : [{ id: "details", label: "Details" }, { id: "closing", label: "Closing" }];

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer wide" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div className="row between">
            <div>
              <p className="eyebrow">{colLabel(card.col)}</p>
              <h2 className="scene-title" style={{ fontSize: 22 }}>{card.name}</h2>
              <p className="muted mt-8" style={{ fontSize: 13 }}>
                {card.jumpPct === 0
                  ? `No change (${money(card.premium)})`
                  : `+${card.jumpPct}% (${money(card.was)} → ${money(card.premium)})`}
                {" · "}{card.lines} · renews {card.renewal}
              </p>
            </div>
            <button className="btn btn-soft" style={{ padding: "8px 10px" }} onClick={onClose} aria-label="Close">
              <Icon.x size={16} />
            </button>
          </div>
        </div>

        <div className="drawer-tabs">
          {tabs.map((t) => (
            <button key={t.id} type="button" className={tab === t.id ? "is-on" : ""} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="drawer-body">
          {tab === "details" && <DetailsPane card={card} file={file} />}

          {tab === "outreach" && (
            <div className="stack gap-16">
              <CurrentPolicyBlock card={card} file={file} />

              <div className="email-frame">
                <div className="email-toolbar">
                  <Icon.mail size={15} /> From {agency.agent.name}'s mailbox
                </div>
                <div className="email-meta">
                  <div className="line"><span className="lbl">To</span><span>{card.target ? outreachEmail.to : `${file.namedInsured} <${card.email}>`}</span></div>
                  <div className="line"><span className="lbl">Subject</span><span className="strong">{card.target ? outreachEmail.subject : "A quick look at your renewal"}</span></div>
                </div>
                <div className="email-body is-tall">
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} aria-label="Outreach email" />
                </div>
              </div>

              <ShapeTheShop card={card} file={file} />

              <div>
                <div className="section-head" style={{ marginBottom: 8 }}>In the questionnaire</div>
                <div className="q-subtabs" role="tablist" aria-label="Questionnaire fields">
                  <button type="button" className={qPane === "confirm" ? "is-on" : ""} onClick={() => setQPane("confirm")}>
                    Pre-filled · {confirm.filter((f) => f.included).length}
                  </button>
                  <button type="button" className={qPane === "ask" ? "is-on" : ""} onClick={() => setQPane("ask")}>
                    New questions · {ask.filter((q) => q.included).length}
                  </button>
                </div>
                {qPane === "confirm" && (
                  <div>
                    <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.45, margin: "10px 0 4px" }}>
                      They'll confirm or fix this. Not new asks.
                    </p>
                    {confirm.filter((f) => f.included).map((f) => (
                      <div key={f.id} className="q-field-row">
                        <label>
                          {f.label}
                          <input
                            value={f.value}
                            onChange={(e) => setConfirm((rows) => rows.map((r) => r.id === f.id ? { ...r, value: e.target.value } : r))}
                          />
                        </label>
                        <button type="button" aria-label={`Remove ${f.label}`} onClick={() => setConfirm((rows) => rows.filter((r) => r.id !== f.id))}>
                          <Icon.x size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {qPane === "ask" && (
                  <div>
                    <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.45, margin: "10px 0 4px" }}>
                      Only what we don't already have on file.
                    </p>
                    {ask.filter((q) => q.included).map((q) => (
                      <div key={q.id} className="q-edit-row">
                        <span style={{ flex: 1 }}>{q.prompt}</span>
                        <button type="button" aria-label="Remove question" onClick={() => setAsk((rows) => rows.filter((r) => r.id !== q.id))}>
                          <Icon.x size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="row gap-8 mt-12">
                      <input
                        className="q-input"
                        placeholder="Add a question"
                        value={newQ}
                        onChange={(e) => setNewQ(e.target.value)}
                      />
                      <button
                        className="btn btn-soft"
                        type="button"
                        onClick={() => {
                          if (!newQ.trim()) return;
                          setAsk((rows) => [...rows, { id: `custom-${rows.length}`, prompt: newQ.trim(), included: true }]);
                          setNewQ("");
                        }}
                      >
                        <Icon.plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "shopping" && (
            <ShoppingPane card={card} file={file} onOpenResults={onOpenResults} />
          )}

          {tab === "rec" && (
            <RecPane
              card={card}
              file={file}
              recBody={recBody}
              setRecBody={setRecBody}
            />
          )}

          {tab === "closing" && (
            <ClosingPane card={card} file={file} />
          )}
        </div>

        {onSkipOutreach && (
          <div className="drawer-foot">
            <button className="btn btn-soft" type="button" onClick={onSkipOutreach}>
              Skip outreach
            </button>
            <button className="btn btn-primary btn-lg" onClick={onSendOutreach}>
              <Icon.send size={16} /> Send
            </button>
          </div>
        )}
        {card.col === "recommend" && (
          <div className="drawer-foot">
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={onSendRec}>
              <Icon.send size={16} /> Send recommendation email
            </button>
          </div>
        )}
        {card.col === "binding" && (
          <div className="drawer-foot">
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={onAskCloseOut}>
              Close out
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function DetailsPane({ card, file }: { card: QueueCard; file: HouseholdFile }) {
  const initials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2);
  return (
    <div className="stack gap-16">
      <div className="card">
        <div className="section-head">Contact</div>
        <dl className="kv mt-12">
          <dt>Named insured</dt><dd>{file.namedInsured}</dd>
          <dt>Phone</dt><dd>{file.phone}</dd>
          <dt>Email</dt><dd>{card.email}</dd>
          <dt>Address</dt>
          <dd>
            {file.address}
            <div>
              <a className="qlink" href={zillowUrl(file.address)} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 600 }}>
                View on Zillow
              </a>
            </div>
          </dd>
        </dl>
      </div>

      <div className="card">
        <div className="section-head">Household</div>
        {file.people.map((p) => (
          <div key={p.name} className="person">
            <span className="avatar-sm">{initials(p.name)}</span>
            <div>
              <div className="strong">{p.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{p.role}{p.note ? ` · ${p.note}` : ""}</div>
            </div>
          </div>
        ))}
      </div>

      {file.vehicles.length > 0 && (
        <div className="card">
          <div className="section-head">Vehicles</div>
          {file.vehicles.map((v) => (
            <div key={`${v.year}${v.make}${v.model}`} className="person">
              <Icon.car size={16} />
              <div className="strong">{v.year} {v.make} {v.model}</div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="section-head">Policies on file</div>
        {file.policies.map((p) => (
          <div key={p.line} className="person">
            {p.line.toLowerCase().includes("auto") ? <Icon.car size={16} /> : p.line.toLowerCase().includes("umbrella") ? <Icon.umbrella size={16} /> : <Icon.home size={16} />}
            <div>
              <div className="strong">{p.line}</div>
              <div className="muted" style={{ fontSize: 12 }}>{p.carrier} · {p.detail}</div>
            </div>
            <span className="mono" style={{ marginLeft: "auto", fontSize: 12.5, textAlign: "right" }}>
              {money(p.current)}
              <span className="muted" style={{ display: "block", fontFamily: "inherit" }}>now</span>
            </span>
          </div>
        ))}
      </div>

      {file.home && (
        <div className="card">
          <div className="section-head">The home</div>
          <dl className="kv mt-12">
            <dt>Roof</dt><dd>{file.home.roof}</dd>
            <dt>Trampoline</dt><dd>{file.home.trampoline}</dd>
            <dt>Dog</dt><dd>{file.home.dog}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}

function CurrentPolicyBlock({ card, file }: { card: QueueCard; file: HouseholdFile }) {
  const currentTotal = file.policies.reduce((s, p) => s + p.current, 0);
  const renewalTotal = file.policies.reduce((s, p) => s + p.renewal, 0);
  const jump = currentTotal === 0 ? 0 : Math.round(((renewalTotal - currentTotal) / currentTotal) * 100);
  const jumpLabel = jump === 0 ? "No change" : `${jump > 0 ? "+" : ""}${jump}%`;
  const carrier = file.policies[0]?.carrier ?? card.carrier;
  const driver = file.driver ?? (
    jump === 0
      ? "No change on the renewal. No claims, no changes on file."
      : `${carrier}'s renewal is up ${jump}%. No claims, no changes on file.`
  );
  return (
    <div className="policy-now">
      <div className="policy-now-kicker">Current policy · {carrier}</div>
      {file.policies.map((p) => (
        <div key={p.line} className="policy-now-row">
          <div>
            <span className="strong">{shortLine(p.line)}</span>
            <span className="muted"> renews {p.renews ?? card.renewal}</span>
          </div>
          <div className="mono policy-now-amt">
            {money(p.current)} <span className="muted">→</span> {money(p.renewal)}
          </div>
        </div>
      ))}
      <div className="policy-now-row is-total">
        <div>
          <span className="strong">Total</span>
          <span className={`policy-now-jump ${jump > 0 ? "is-up" : ""}`}>{jumpLabel}</span>
        </div>
        <div className="mono policy-now-amt">
          {money(currentTotal)} <span className="muted">→</span> {money(renewalTotal)}
        </div>
      </div>
      <p className="policy-now-driver">
        <span className="strong">{jump === 0 ? "What is driving it?" : "What is driving the increase?"}</span>
        <span className="policy-now-driver-copy">{driver}</span>
      </p>
    </div>
  );
}

function ShapeTheShop({ card, file }: { card: QueueCard; file: HouseholdFile }) {
  const rows = shapeRows(card, file);
  const [on, setOn] = useState(() => new Set(rows.filter((r) => r.on && !r.locked).map((r) => r.id)));
  return (
    <div className="shape-block">
      <div className="section-head">Shape the shop</div>
      <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.45, margin: "6px 0 10px" }}>
        Check what you want included. Recommended items are on. Grayed items do not apply.
      </p>
      <div className="shape-list">
        {rows.map((row) => {
          const checked = row.locked ? false : on.has(row.id);
          return (
            <label key={row.id} className={`shape-row${row.locked ? " is-locked" : ""}${checked ? " is-on" : ""}`}>
              <input
                type="checkbox"
                checked={checked}
                disabled={row.locked}
                onChange={() => {
                  if (row.locked) return;
                  setOn((prev) => {
                    const next = new Set(prev);
                    if (next.has(row.id)) next.delete(row.id);
                    else next.add(row.id);
                    return next;
                  });
                }}
              />
              <span>
                <span className="strong">{row.label}</span>
                <span className="shape-hint">{row.locked ? row.lockReason : row.hint}</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function shapeRows(card: QueueCard, file: HouseholdFile) {
  const has = (k: LineKind) => card.kinds.includes(k);
  const hasHA = has("home") && has("auto");
  const family = file.people.length > 1;
  return [
    {
      id: "home",
      label: "Homeowners",
      hint: "Quote a home policy while we shop.",
      locked: has("home"),
      lockReason: hasHA ? "This individual already has home and auto with us." : "This individual already has homeowners with us.",
      on: !has("home") && has("auto"),
    },
    {
      id: "auto",
      label: "Auto",
      hint: "Quote auto while we shop.",
      locked: has("auto"),
      lockReason: hasHA ? "This individual already has home and auto with us." : "This individual already has auto with us.",
      on: !has("auto") && has("home"),
    },
    {
      id: "medicare",
      label: "Medicare",
      hint: "Supplement options at renewal.",
      locked: true,
      lockReason: "Not available due to their age.",
      on: false,
    },
    {
      id: "life",
      label: "Life",
      hint: "Ask if they want a life quote while we shop.",
      locked: false,
      lockReason: "",
      on: family,
    },
  ];
}

function ShoppingPane({
  card,
  file,
  onOpenResults,
}: {
  card: QueueCard;
  file: HouseholdFile;
  onOpenResults: () => void;
}) {
  const carriers = file.shopCarriers ?? ["Auto-Owners", "Erie", "Grange"];
  const timeline = file.timeline ?? [
    { label: "You sent the outreach email", date: "Last week", state: "done" as const },
    { label: "They completed the questionnaire", date: "Yesterday", state: "done" as const },
    { label: `VA is shopping ${carriers.join(", ").replace(/, ([^,]*)$/, " and $1")}`, date: "In progress", state: "now" as const, detail: "Check back tomorrow for quotes." },
    { label: "Renewal date. Coverage needs to be in place.", date: card.renewal, state: "soon" as const },
  ];
  return (
    <div className="stack gap-16">
      <div className="status-banner">
        <div className="status-banner-top">
          <span className="badge working"><Icon.spinner size={12} /> Shopping in progress</span>
        </div>
        <p className="status-banner-title">Check back tomorrow to see updates.</p>
        <p className="status-banner-sub">VA is running {carriers.length} carriers for this household, quoted directly with each one.</p>
        <div className="shop-markets">
          {carriers.map((c) => (
            <div key={c} className="shop-market-row">
              <CarrierLogo name={c} />
              <div>
                <div className="shop-market-name">{c}</div>
                <div className="shop-market-copy">Quote in progress</div>
              </div>
              <span className="shop-market-state">Shopping</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-head" style={{ marginBottom: 8 }}>What has happened</div>
        <Chrono items={timeline} />
      </div>

      {card.target && (
        <button className="btn btn-ghost btn-block" onClick={onOpenResults}>
          Quotes are in. Continue <Icon.arrowRight size={16} />
        </button>
      )}
    </div>
  );
}

function RecPane({
  card,
  file,
  recBody,
  setRecBody,
}: {
  card: QueueCard;
  file: HouseholdFile;
  recBody: string;
  setRecBody: (s: string) => void;
}) {
  const rec = file.rec;
  const [pick, setPick] = useState(rec?.pick ?? "");
  const [help, setHelp] = useState<string | null>(null);
  const [openQuote, setOpenQuote] = useState<QuoteDoc | null>(null);
  const first = file.namedInsured.split(" ")[0];
  return (
    <div className="stack gap-16">
      <div>
        <div className="section-head" style={{ marginBottom: 6 }}>Shopping results</div>
        <h3 className="results-lede">
          The biggest differences in coverage and price, pulled directly from each carrier we shopped.
        </h3>
        {rec ? (
          <div className="cov-wrap">
            <table className="cov-table">
              <thead>
                <tr>
                  <th>Coverage</th>
                  <th className="is-current">
                    <span className="cov-current-tag">Current carrier</span>
                    {rec.currentLabel}
                  </th>
                  {rec.cols.map((c) => <th key={c.id}>{c.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {rec.coverage.map((row) => (
                  <tr key={row.label}>
                    <td>
                      <span className="cov-label">
                        {row.label}
                        {row.help && (
                          <button
                            type="button"
                            className={`cov-info${help === row.label ? " is-on" : ""}`}
                            aria-label={`What ${row.label} means`}
                            onClick={() => setHelp((h) => h === row.label ? null : row.label)}
                          >
                            <Icon.info size={13} />
                          </button>
                        )}
                      </span>
                      {help === row.label && row.help && <p className="cov-help">{row.help}</p>}
                    </td>
                    <td className="is-current">{row.current}</td>
                    {rec.cols.map((c) => (
                      <td key={c.id}><QuoteCell value={row.quotes[c.id]} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted" style={{ fontSize: 13.5 }}>{card.note}</p>
        )}
      </div>

      {rec?.biggest && (
        <div className="biggest-card">
          <div className="section-head">Biggest changes</div>
          <ul className="biggest-list">
            {rec.biggest.map((row) => (
              <li key={row.carrier}>
                <span className="strong">{row.carrier}. </span>
                {row.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rec?.quotes && rec.quotes.length > 0 && (
        <QuoteStrip docs={rec.quotes} onOpen={setOpenQuote} />
      )}

      {rec?.talkingPoints && (
        <div className="talk-block">
          <div className="section-head">Things to note</div>
          <p className="muted" style={{ fontSize: 12.5, margin: "4px 0 10px" }}>Here's what to call out, no matter which quote you send.</p>
          <ol className="talk-list">
            {rec.talkingPoints.map((point, i) => (
              <li key={point}>
                <span className="talk-n">{i + 1}</span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {rec && (
        <div className="rec-callout">
          <p className="section-head">Our recommendation</p>
          <p className="mt-8" style={{ fontSize: 16, lineHeight: 1.45, fontWeight: 600 }}>{rec.summary}</p>
        </div>
      )}

      {rec?.options && (
        <div className="pick-block">
          <div className="pick-kicker">Select what you recommend</div>
          <p className="muted" style={{ fontSize: 12.5, margin: "0 0 10px" }}>
            Choose the one to include in your email to {first}.
          </p>
          <div className="pick-list" role="radiogroup" aria-label="Quote to include">
            {rec.options.map((opt) => (
              <label key={opt.id} className={`pick-card${pick === opt.name ? " is-on" : ""}${opt.current ? " is-current" : ""}`}>
                <input
                  type="radio"
                  name="rec-pick"
                  checked={pick === opt.name}
                  onChange={() => {
                    setPick(opt.name);
                    if (opt.email) setRecBody(opt.email);
                  }}
                />
                <span className="pick-mark" aria-hidden />
                <span className="pick-copy">
                  <span className="pick-name">
                    {opt.name}
                    {opt.current && <span className="pick-tag">Current carrier</span>}
                  </span>
                  <span className="pick-meta">{opt.lines} · {money(opt.price)}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="email-frame">
        <div className="email-toolbar">
          <Icon.mail size={15} /> Recommendation email · does not auto-send
        </div>
        <div className="email-meta">
          <div className="line"><span className="lbl">To</span><span>{card.target ? recEmail.to : `${file.namedInsured} <${card.email}>`}</span></div>
          <div className="line"><span className="lbl">Subject</span><span className="strong">{card.target ? recEmail.subject : "I looked at your renewal"}</span></div>
        </div>
        <div className="email-body">
          <textarea value={recBody} onChange={(e) => setRecBody(e.target.value)} aria-label="Recommendation email" />
        </div>
      </div>

      {openQuote && createPortal(
        <QuoteViewer doc={openQuote} onClose={() => setOpenQuote(null)} />,
        document.body,
      )}
    </div>
  );
}

function ClosingPane({ card, file }: { card: QueueCard; file: HouseholdFile }) {
  const closing = file.closing;
  return (
    <div className="stack gap-16">
      <div className="closing-lead">
        <h3 className="closing-headline">
          {closing?.title ?? `Close out ${file.namedInsured}'s renewal`}
        </h3>
        <p className="closing-sub">
          {closing?.sub ?? `You reached out and sent a recommendation. Record ${file.namedInsured}'s decision before ${card.renewal} so this household can leave the queue.`}
        </p>
      </div>
      {closing && <Chrono items={closing.timeline} />}
    </div>
  );
}

function Chrono({ items }: { items: ChronoItem[] }) {
  return (
    <ol className="chrono">
      {items.map((item) => (
        <li key={item.label} className={`chrono-row is-${item.state}`}>
          <time className="chrono-date">{item.date}</time>
          <span className={`chrono-dot is-${item.state}`} />
          <div className="chrono-copy">
            <div className="chrono-label">{item.label}</div>
            {item.detail && <p className="chrono-detail">{item.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function QuoteCell({ value }: { value: string | true | undefined }) {
  if (value === true || value == null) return <span className="cov-check" aria-label="Same as current"><Icon.check size={14} /></span>;
  return <span className="cov-diff">{value}</span>;
}

function CarrierLogo({ name }: { name: string }) {
  return (
    <span className="carrier-logo" title={`${name} logo`}>
      <span className="carrier-logo-slot">Logo here</span>
    </span>
  );
}

function QuoteStrip({ docs, onOpen }: { docs: QuoteDoc[]; onOpen: (doc: QuoteDoc) => void }) {
  const current = docs.filter((d) => d.current);
  const shopped = docs.filter((d) => !d.current);
  return (
    <div className="quote-strip">
      <div className="section-head">Quotes from the carriers</div>
      <p className="muted" style={{ fontSize: 12.5, margin: "4px 0 12px" }}>
        Current policy documents, then each quote pulled directly from the carrier. Open one to read the full page.
      </p>
      {current.length > 0 && <QuoteThumbRow label="Current carrier" docs={current} onOpen={onOpen} />}
      {shopped.length > 0 && <QuoteThumbRow label="Shopped" docs={shopped} onOpen={onOpen} />}
    </div>
  );
}

function QuoteThumbRow({
  label,
  docs,
  onOpen,
}: {
  label: string;
  docs: QuoteDoc[];
  onOpen: (doc: QuoteDoc) => void;
}) {
  return (
    <div className="quote-group">
      <p className="quote-group-label">{label}</p>
      <div className="quote-grid">
        {docs.map((doc) => (
          <button type="button" key={doc.id} className="quote-thumb" onClick={() => onOpen(doc)}>
            <span className="quote-thumb-page" aria-hidden>
              <span className="quote-thumb-brand">{doc.carrier}</span>
              <span className="quote-thumb-lines" />
              <span className="quote-thumb-pdf">PDF</span>
            </span>
            <span className="quote-thumb-meta">
              <span className="quote-thumb-carrier">{doc.carrier}</span>
              <span className="quote-thumb-title">{doc.title}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuoteViewer({ doc, onClose }: { doc: QuoteDoc; onClose: () => void }) {
  return (
    <div className="doc-viewer-backdrop" onClick={onClose}>
      <div
        className="doc-viewer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-doc-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="doc-viewer-head">
          <div>
            <p className="eyebrow">{doc.current ? "Current carrier" : "Quote from the carrier"}</p>
            <h3 id="quote-doc-title">{doc.carrier} · {doc.title}</h3>
            <p className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{doc.filename}</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            <Icon.x size={16} /> Close
          </button>
        </header>
        <div className="doc-viewer-scroll">
          {doc.pages.map((page) => (
            <article key={page.kicker} className="doc-page">
              <div className="doc-page-kicker">{page.kicker}</div>
              <h4>{doc.carrier}</h4>
              <p className="doc-page-title">{doc.title}</p>
              <dl className="doc-page-rows">
                {page.rows.map((row) => (
                  <div key={`${page.kicker}-${row.label}`}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              {page.note && <p className="doc-page-note">{page.note}</p>}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function shortLine(line: string) {
  if (/auto/i.test(line)) return "Auto";
  if (/umbrella/i.test(line)) return "Umbrella";
  return "Home";
}

function colLabel(col: QueueCard["col"]) {
  if (col === "outreach") return "Ready to reach out";
  if (col === "shopping") return "Shopping";
  if (col === "recommend") return "Ready to send rec";
  return "Closing";
}

function genericOutreach(card: QueueCard, formUrl: string) {
  const jump = card.jumpPct === 0
    ? `Your ${card.lines} renews ${card.renewal} at ${money(card.premium)}, the same as last year.`
    : `Your ${card.lines} renews ${card.renewal} at ${money(card.premium)}, which is about ${money(card.premium - card.was)} more than last year.`;
  const nudge = card.jumpPct === 0
    ? `Renewals move for all sorts of reasons, so I always take a look before one rolls over.`
    : `Increases can come from a few different places, the market, a claim, or a change in coverage during the year. When one comes in like this, I'd like to shop it and see what else is out there for you.`;
  return `Hi ${card.first},\n\nHope you're doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.\n\n${jump}\n\n${nudge}\n\nBefore I can, there are a few details I need to confirm. It takes about five minutes:\n\nAnswer a few quick questions → ${formUrl}\n\nOnce I have your answers I'll get to work and come back to you well before the renewal.`;
}

function genericConfirm(card: QueueCard, file: HouseholdFile) {
  return [
    { id: "name", label: "Named insured", value: file.namedInsured },
    { id: "email", label: "Email", value: card.email },
    { id: "phone", label: "Mobile", value: file.phone },
    { id: "address", label: "Address", value: file.address },
  ];
}

function genericAsk() {
  return [
    { id: "changed", prompt: "Anything new we should know before we shop?" },
    { id: "referral", prompt: "Anyone else who should hear from us?" },
  ];
}

function genericRec(card: QueueCard) {
  return `Hi ${card.first},\n\nI looked at your ${card.renewal} renewal. I put the pick on a short page so you can see why I didn't go another direction.\n\nThis does not put coverage in place. Reply with a couple of times that work and I'll call you.`;
}
