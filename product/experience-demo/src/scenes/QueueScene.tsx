import { useMemo, useRef, useState } from "react";
import type { SceneProps } from "../App";
import { HouseholdDrawer } from "../components/HouseholdDrawer";
import { RetentionStrip } from "../components/RetentionStrip";
import { Cockpit, Icon, money } from "../components/ui";
import { agency, lastWeekOutreach, queueCards, type LineKind, type QueueCard, type QueueCol } from "../data";

const COLS: { id: QueueCol; title: string }[] = [
  { id: "outreach", title: "Ready to reach out" },
  { id: "shopping", title: "Shopping" },
  { id: "recommend", title: "Ready to send rec" },
  { id: "binding", title: "Closing" },
];

type View = "board" | "list";
type Window = "any" | "today" | "week" | "twoWeeks" | "thirty";
type Jump = "all" | "increase" | "flat" | "decrease";

function LineMark({ kind, size = 14 }: { kind: LineKind; size?: number }) {
  if (kind === "home") return <Icon.home size={size} />;
  if (kind === "auto") return <Icon.car size={size} />;
  return <Icon.umbrella size={size} />;
}

function Glyph({ card }: { card: QueueCard }) {
  if (card.kinds.length > 1) return <Icon.bundle size={15} />;
  return <LineMark kind={card.kinds[0]} size={15} />;
}

function premiumStat(c: QueueCard) {
  if (c.jumpPct === 0) return `${money(c.premium)}`;
  return `${money(c.was)} → ${money(c.premium)}`;
}

function ChangeMark({ card }: { card: QueueCard }) {
  if (card.jumpPct > 0) {
    return <span className="kcard-change up"><Icon.trendUp size={12} /> {card.jumpPct}%</span>;
  }
  if (card.jumpPct < 0) {
    return <span className="kcard-change down"><Icon.trendDown size={12} /> {Math.abs(card.jumpPct)}%</span>;
  }
  return <span className="kcard-change flat"><Icon.trendFlat size={12} /> 0%</span>;
}

function ColCards({ cards, onOpen }: { cards: QueueCard[]; onOpen: (card: QueueCard) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function sync() {
    const el = rail.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    const step = first.offsetWidth + 10;
    if (!step) return;
    setActive(Math.max(0, Math.min(cards.length - 1, Math.round(el.scrollLeft / step))));
  }

  return (
    <>
      <div className="kcol-body" ref={rail} onScroll={sync}>
        {cards.map((c) => (
          <div key={c.id} className={`kcard ${c.col === "binding" ? "has-tab" : ""} ${c.target ? "is-target" : ""}`}>
            <button type="button" className="kcard-body" onClick={() => onOpen(c)}>
              <CardFace card={c} />
            </button>
          </div>
        ))}
      </div>
      {cards.length > 1 && (
        <div className="kcol-dots" aria-hidden>
          {cards.map((c, i) => (
            <span key={c.id} className={i === active ? "is-on" : ""} />
          ))}
        </div>
      )}
    </>
  );
}

function CardFace({ card }: { card: QueueCard }) {
  return (
    <>
      {card.col === "binding" && (
        <span className="kcard-tab">
          <Icon.flag size={11} /> Action needed
        </span>
      )}
      <div className="kcard-top">
        <div className="kcard-title-row">
          <span className="kcard-glyph"><Glyph card={card} /></span>
          <span className="kcard-title">{card.name}</span>
        </div>
        <p className="kcard-stat">
          {premiumStat(card)} <ChangeMark card={card} />
        </p>
      </div>
      <div className="kcard-foot">
        <span className="kcard-carrier">{card.carrier}</span>
        <span className="kcard-renew">Renews {card.renewal}</span>
      </div>
    </>
  );
}

function inWindow(daysOut: number, w: Window) {
  if (w === "any") return true;
  if (w === "today") return daysOut === 0;
  if (w === "week") return daysOut <= 7;
  if (w === "twoWeeks") return daysOut <= 14;
  return daysOut <= 30;
}

export default function QueueScene({ onNext, phase }: SceneProps & { phase: QueueCol }) {
  const [view, setView] = useState<View>("board");
  const [query, setQuery] = useState("");
  const [renewalWindow, setRenewalWindow] = useState<Window>("any");
  const [stage, setStage] = useState<"all" | QueueCol>("all");
  const [jump, setJump] = useState<Jump>("all");
  const [needsMe, setNeedsMe] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [closed, setClosed] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<QueueCard | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [closeModal, setCloseModal] = useState<QueueCard[] | null>(null);
  const [closeNote, setCloseNote] = useState("");
  const [skipModal, setSkipModal] = useState<QueueCard | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [retentionOpen, setRetentionOpen] = useState(true);
  const [lastWeekOpen, setLastWeekOpen] = useState(false);
  const filtersOn = renewalWindow !== "any" || stage !== "all" || jump !== "all" || needsMe;

  const cards = useMemo(() => {
    return queueCards
      .map((c) => {
        if (c.target) {
          if (phase === "shopping") return { ...c, col: "shopping" as QueueCol, note: "Questionnaire in. VA shopping Erie, Auto-Owners, Grange." };
          if (phase === "binding") return { ...c, col: "binding" as QueueCol, ageDays: 0, owes: ["Bind Auto-Owners in the portal", "Mark closed in Upline"], note: "Dana approved. Coverage is not in place." };
        }
        return c;
      })
      .filter((c) => !skipped.includes(c.id) && !closed.includes(c.id));
  }, [phase, skipped, closed]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (!inWindow(c.daysOut, renewalWindow)) return false;
      if (stage !== "all" && c.col !== stage) return false;
      if (jump === "increase" && c.jumpPct <= 0) return false;
      if (jump === "flat" && c.jumpPct !== 0) return false;
      if (jump === "decrease" && c.jumpPct >= 0) return false;
      if (needsMe && !(c.col === "binding" && (c.ageDays ?? 0) >= 3)) return false;
      return true;
    });
  }, [cards, query, renewalWindow, stage, jump, needsMe]);

  function flash(msg: string) {
    setToast(msg);
    globalThis.setTimeout(() => setToast(null), 2800);
  }

  function sendOutreach(ids: string[]) {
    const names = ids.map((id) => cards.find((c) => c.id === id)?.name).filter(Boolean);
    flash(`Sending ${names.length === 1 ? names[0] : `${names.length} emails`} Tuesday 9:00`);
    setDrawer(null);
    if (ids.includes("callahan") && phase === "outreach") onNext();
  }

  function sendRecs(ids: string[]) {
    flash(ids.length === 1 ? "Recommendation queued to send" : `${ids.length} recommendations queued`);
    setDrawer(null);
  }

  function confirmSkip() {
    if (!skipModal) return;
    setSkipped((prev) => [...prev, skipModal.id]);
    setSkipModal(null);
    setDrawer(null);
    flash("Skipped · moved to closed for this cycle");
  }

  function confirmCloseOut() {
    if (!closeModal) return;
    const ids = closeModal.map((c) => c.id);
    setClosed((prev) => [...prev, ...ids]);
    setCloseModal(null);
    setCloseNote("");
    setDrawer(null);
    if (ids.includes("callahan") && phase === "binding") {
      setCelebrate(true);
    } else {
      flash("Closed out");
    }
  }

  function colActions(col: QueueCol, list: QueueCard[]) {
    if (col !== "outreach" && col !== "recommend") return null;
    return (
      <div className="kcol-actions">
        <button
          className="kcol-send"
          type="button"
          disabled={!list.length}
          onClick={() => col === "outreach" ? sendOutreach(list.map((c) => c.id)) : sendRecs(list.map((c) => c.id))}
        >
          Send {list.length}
        </button>
      </div>
    );
  }

  return (
    <Cockpit crumb="" shell="queue-shell">
      <div className="queue-pagehead">
        <p className="eyebrow">{agency.name}</p>
        <h1 className="scene-title">Renewal outreach</h1>
      </div>

      <div className="row between wrap" style={{ gap: 12, marginTop: 18 }}>
        <h2 className="queue-section-title">Retention data</h2>
        <button
          className="btn btn-soft btn-sm"
          type="button"
          onClick={() => setRetentionOpen((v) => !v)}
        >
          {retentionOpen ? "Collapse" : "Expand"}
        </button>
      </div>

      {retentionOpen && <RetentionStrip />}

      <div className="queue-toolbar">
        <div className="row gap-12 wrap" style={{ alignItems: "baseline" }}>
          <h2 className="queue-section-title">Outreach queue</h2>
          <button className="kcol-send lastweek-link" type="button" onClick={() => setLastWeekOpen(true)}>
            Last week's outreach
          </button>
        </div>
        <div className="filter-bar">
          <div className="filter-bar-row">
            <div className="filter-popover">
              <button className={`btn btn-soft btn-sm ${filtersOn ? "is-filtered" : ""}`} type="button" onClick={() => setFiltersOpen((v) => !v)}>
                <Icon.filter size={14} /> Filters
              </button>
              {filtersOpen && (
                <div className="filter-panel">
                  <label>
                    Renewal date
                    <select className="filter-select" value={renewalWindow} onChange={(e) => setRenewalWindow(e.target.value as Window)}>
                      <option value="any">Any renewal date</option>
                      <option value="today">Renews today</option>
                      <option value="week">This week</option>
                      <option value="twoWeeks">Next 2 weeks</option>
                      <option value="thirty">Next 30 days</option>
                    </select>
                  </label>
                  <label>
                    Stage
                    <select className="filter-select" value={stage} onChange={(e) => setStage(e.target.value as "all" | QueueCol)}>
                      <option value="all">All</option>
                      {COLS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </label>
                  <label>
                    Premium
                    <select className="filter-select" value={jump} onChange={(e) => setJump(e.target.value as Jump)}>
                      <option value="all">All</option>
                      <option value="increase">Increase</option>
                      <option value="flat">No change</option>
                      <option value="decrease">Decrease</option>
                    </select>
                  </label>
                  <label className="filter-check">
                    <input type="checkbox" checked={needsMe} onChange={(e) => setNeedsMe(e.target.checked)} />
                    Closing · needs me
                  </label>
                </div>
              )}
            </div>
            <div className="view-toggle" role="group" aria-label="Board or list">
              <button type="button" className={view === "board" ? "is-on" : ""} onClick={() => setView("board")}>
                <Icon.board size={14} /> Board
              </button>
              <button type="button" className={view === "list" ? "is-on" : ""} onClick={() => setView("list")}>
                <Icon.list size={14} /> List
              </button>
            </div>
          </div>
          <label className="filter-search">
            <Icon.search size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search names" aria-label="Search names" />
          </label>
        </div>
      </div>

      {view === "board" ? (
        <div className="kanban">
          {COLS.map((col) => {
            const list = filtered.filter((c) => c.col === col.id);
            return (
              <div key={col.id} className="kcol">
                <div className="kcol-head">
                  <div className="kcol-title">
                    <p>{col.title}</p>
                    <span>{list.length}</span>
                  </div>
                  {colActions(col.id, list)}
                </div>
                <ColCards cards={list} onOpen={setDrawer} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="list-view">
          {COLS.map((col) => {
            const list = filtered.filter((c) => c.col === col.id);
            if (!list.length) return null;
            return (
              <section key={col.id} className="list-group">
                <div className="list-group-head">
                  <h2>{col.title} · {list.length}</h2>
                  {colActions(col.id, list)}
                </div>
                {list.map((c) => (
                  <div
                    key={c.id}
                    className={`list-row ${c.target ? "is-target" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDrawer(c)}
                    onKeyDown={(e) => { if (e.key === "Enter") setDrawer(c); }}
                  >
                    <div>
                      <div className="list-name">{c.name}</div>
                      <div className="list-sub">{premiumStat(c)} {c.jumpPct === 0 ? "(0%)" : `(${c.jumpPct > 0 ? "↑" : "↓"}${Math.abs(c.jumpPct)}%)`}</div>
                    </div>
                    <div className="list-sub">{c.carrier}</div>
                    <div className="muted">Renews {c.renewal}</div>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      )}

      {!filtered.length && <p className="muted" style={{ marginTop: 12 }}>No households match those filters.</p>}

      {lastWeekOpen && (
        <div className="drawer-backdrop" onClick={() => setLastWeekOpen(false)}>
          <aside className="drawer wide" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head" style={{ paddingBottom: 16 }}>
              <div className="row between">
                <div>
                  <p className="eyebrow">Week of October 5</p>
                  <h2 className="scene-title" style={{ fontSize: 22 }}>Last week's outreach</h2>
                  <p className="muted mt-8" style={{ fontSize: 13 }}>Who you emailed, and where they are now</p>
                </div>
                <button className="btn btn-soft" style={{ padding: "8px 10px" }} onClick={() => setLastWeekOpen(false)} aria-label="Close">
                  <Icon.x size={16} />
                </button>
              </div>
            </div>
            <div className="drawer-body">
              {lastWeekOutreach.map((row) => {
                const onBoard = cards.find((c) => c.id === row.id);
                return (
                  <button
                    key={row.id}
                    type="button"
                    className={`lastweek-row ${onBoard ? "" : "is-static"}`}
                    disabled={!onBoard}
                    onClick={() => {
                      if (onBoard) {
                        setLastWeekOpen(false);
                        setDrawer(onBoard);
                      }
                    }}
                  >
                    <div>
                      <div className="list-name">{row.name}</div>
                      <div className="list-sub">Sent {row.sent} · renews {row.renewal}</div>
                    </div>
                    <span className="badge">{row.stage}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {drawer && (
        <HouseholdDrawer
          key={drawer.id}
          card={drawer}
          onClose={() => setDrawer(null)}
          onSendOutreach={() => sendOutreach([drawer.id])}
          onSendRec={() => sendRecs([drawer.id])}
          onOpenResults={() => {
            if (drawer.target && phase === "shopping") onNext();
          }}
          onAskCloseOut={() => setCloseModal([drawer])}
          onSkipOutreach={drawer.col === "outreach" ? () => setSkipModal(drawer) : undefined}
        />
      )}

      {skipModal && (
        <div className="modal-backdrop" onClick={() => setSkipModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow">Skip outreach</p>
            <h2 className="scene-title" style={{ fontSize: 22, marginTop: 6 }}>
              Are you sure you want to skip reaching out to {skipModal.name.replace(/\s*&\s*/g, " and ")}?
            </h2>
            <p className="muted mt-8" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              They will not be emailed about their upcoming renewal. This household will go straight to close for the cycle.
            </p>
            <div className="row gap-8 mt-16" style={{ justifyContent: "flex-end" }}>
              <button className="btn btn-soft" type="button" onClick={() => setSkipModal(null)}>Cancel</button>
              <button className="btn btn-primary" type="button" onClick={confirmSkip}>Skip outreach</button>
            </div>
          </div>
        </div>
      )}

      {closeModal && (
        <div className="modal-backdrop" onClick={() => setCloseModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow">Close out</p>
            <h2 className="scene-title" style={{ fontSize: 22, marginTop: 6 }}>
              Tell us what happened for {closeModal[0]?.name.replace(/\s*&\s*/g, " and ")}
            </h2>
            <p className="muted mt-8" style={{ fontSize: 13.5, lineHeight: 1.45 }}>
              Is {closeModal[0]?.first} staying put? Did you bind a new carrier, or are you still waiting on something?
            </p>
            <textarea
              value={closeNote}
              onChange={(e) => setCloseNote(e.target.value)}
              placeholder="She is staying with Erie. I bound it this morning."
            />
            <div className="row gap-8 mt-16" style={{ justifyContent: "flex-end" }}>
              <button className="btn btn-soft" type="button" onClick={() => setCloseModal(null)}>Cancel</button>
              <button className="btn btn-primary" type="button" onClick={confirmCloseOut}>Close out</button>
            </div>
          </div>
        </div>
      )}

      {celebrate && (
        <div className="drawer-backdrop" onClick={() => setCelebrate(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()} style={{ display: "grid", placeItems: "center" }}>
            <div className="celebrate">
              <p className="badge lime">Closed-won · pending AMS verify</p>
              <h2>Nice.</h2>
              <p className="muted" style={{ lineHeight: 1.5 }}>The card left Closing. Approve was never bound.</p>
              <button className="btn btn-primary btn-block mt-20" onClick={() => setCelebrate(false)}>Back to the queue</button>
            </div>
          </aside>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </Cockpit>
  );
}
