import { useMemo, useState } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, SceneHead } from "../components/ui";
import { client } from "../data";

type Status = "outreach" | "shopping" | "recommend";
type StatusFilter = "all" | Status;
type JumpFilter = "all" | "increase" | "flat" | "decrease";

type Row = {
  id: string;
  name: string;
  portfolio: string;
  jumpPct: number;
  renewal: number;
  status: Status;
  target?: boolean;
  /** Manually added from a call-in */
  added?: boolean;
  reason?: string;
};

type BookMember = {
  id: string;
  name: string;
  portfolio: string;
  renewalDate: string;
  renewal: number;
  jumpPct: number;
};

function money(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function jumpLabel(n: number) {
  if (n > 0) return `+${n}%`;
  if (n < 0) return `${n}%`;
  return "0%";
}

const initialRows: Row[] = [
  { id: "r-foss", name: "Raymond Foss", portfolio: "Home · Nationwide", jumpPct: 11, renewal: 2840, status: "recommend" },
  { id: "r-vasquez", name: "Elena Vasquez", portfolio: "Home + Auto · Travelers", jumpPct: 18, renewal: 4210, status: "recommend" },

  { id: "o-alcott", name: "Margaret Alcott", portfolio: "Auto · Progressive", jumpPct: 22, renewal: 3180, status: "outreach" },
  { id: "o-kowalski", name: "James & Rita Kowalski", portfolio: "Home + Auto · Donegal", jumpPct: 21, renewal: 5420, status: "outreach" },
  { id: "o-lee", name: "Brandon Lee", portfolio: "Auto · Progressive", jumpPct: 20, renewal: 2650, status: "outreach" },
  { id: "o-desai", name: "Anika Desai", portfolio: "Home · Nationwide", jumpPct: 19, renewal: 1980, status: "outreach" },
  { id: "o-greer", name: "Thomas Greer", portfolio: "Home + Auto · Travelers", jumpPct: 18, renewal: 4890, status: "outreach" },
  { id: "o-oneill", name: "Shannon O'Neill", portfolio: "Auto · Donegal", jumpPct: 17, renewal: 2410, status: "outreach" },
  { id: "o-corey", name: client.name, portfolio: "Home + Auto · Donegal", jumpPct: 16, renewal: 11659, status: "outreach", target: true },
  { id: "o-webb", name: "Marcus Webb", portfolio: "Home · Progressive", jumpPct: 16, renewal: 1720, status: "outreach" },
  { id: "o-hartman", name: "Linda Hartman", portfolio: "Home + Auto · Nationwide", jumpPct: 15, renewal: 3960, status: "outreach" },
  { id: "o-haddad", name: "Omar Haddad", portfolio: "Auto · Travelers", jumpPct: 15, renewal: 2890, status: "outreach" },
  { id: "o-fontaine", name: "Claire Fontaine", portfolio: "Home + Auto · Donegal", jumpPct: 14, renewal: 5120, status: "outreach" },
  { id: "o-hsu", name: "Derek Hsu", portfolio: "Auto · Progressive", jumpPct: 14, renewal: 2240, status: "outreach" },
  { id: "o-nolan", name: "Patricia Nolan", portfolio: "Home · Donegal", jumpPct: 13, renewal: 1560, status: "outreach" },
  { id: "o-brooks", name: "Kevin & Amy Brooks", portfolio: "Home + Auto · Travelers", jumpPct: 13, renewal: 4380, status: "outreach" },
  { id: "o-ramirez", name: "Sofia Ramirez", portfolio: "Auto · Nationwide", jumpPct: 12, renewal: 1980, status: "outreach" },
  { id: "o-pike", name: "Gregory Pike", portfolio: "Home + Auto · Progressive", jumpPct: 12, renewal: 3670, status: "outreach" },
  { id: "o-kim", name: "Hannah Kim", portfolio: "Home · Travelers", jumpPct: 11, renewal: 1840, status: "outreach" },
  { id: "o-boone", name: "Russell Boone", portfolio: "Auto · Donegal", jumpPct: 11, renewal: 2110, status: "outreach" },
  { id: "o-patel", name: "Maya Patel", portfolio: "Home + Auto · Nationwide", jumpPct: 10, renewal: 4050, status: "outreach" },
  { id: "o-reed", name: "Jonathan Reed", portfolio: "Auto · Progressive", jumpPct: 10, renewal: 1760, status: "outreach" },
  { id: "o-caldwell", name: "Wendy Caldwell", portfolio: "Home · Donegal", jumpPct: 9, renewal: 1420, status: "outreach" },
  { id: "o-nandakumar", name: "Priya Nandakumar", portfolio: "Auto · Donegal", jumpPct: 9, renewal: 1890, status: "outreach" },
  { id: "o-simmons", name: "Albert Simmons", portfolio: "Home + Auto · Travelers", jumpPct: 8, renewal: 3290, status: "outreach" },
  { id: "o-chiang", name: "Nora Chiang", portfolio: "Auto · Nationwide", jumpPct: 0, renewal: 1540, status: "outreach" },
  { id: "o-delgado-f", name: "Frank Delgado", portfolio: "Home · Progressive", jumpPct: -3, renewal: 1680, status: "outreach" },
  { id: "o-moretti", name: "Isabel Moretti", portfolio: "Home + Auto · Donegal", jumpPct: 7, renewal: 4510, status: "outreach" },
  { id: "o-hale", name: "Curtis Hale", portfolio: "Auto · Travelers", jumpPct: 0, renewal: 1320, status: "outreach" },
  { id: "o-cruz", name: "Bethany Cruz", portfolio: "Home · Nationwide", jumpPct: -2, renewal: 1490, status: "outreach" },
  { id: "o-mercer", name: "Paul & Diane Mercer", portfolio: "Home + Auto · Progressive", jumpPct: 5, renewal: 3880, status: "outreach" },
  { id: "o-rahman", name: "Yusuf Rahman", portfolio: "Auto · Donegal", jumpPct: 4, renewal: 1180, status: "outreach" },

  { id: "s-delgado", name: "The Delgado Family", portfolio: "Home + Auto · Travelers", jumpPct: 14, renewal: 4620, status: "shopping" },
  { id: "s-zimmerman", name: "Carl Zimmerman", portfolio: "Auto · Progressive", jumpPct: 17, renewal: 2380, status: "shopping" },
  { id: "s-bright", name: "Naomi Bright", portfolio: "Home · Donegal", jumpPct: 12, renewal: 1650, status: "shopping" },
];

/** Members in the book who are NOT in this week's queue */
const bookOutsideQueue: BookMember[] = [
  { id: "b-tammy", name: "Tammy Fleming", portfolio: "Home + Auto · Donegal", renewalDate: "Sep 14, 2026", renewal: 3240, jumpPct: 8 },
  { id: "b-jacob", name: "Jacob Reed", portfolio: "Auto · Travelers", renewalDate: "Oct 2, 2026", renewal: 1890, jumpPct: 4 },
  { id: "b-deborah", name: "Deborah Strohecker", portfolio: "Home · Nationwide", renewalDate: "Nov 18, 2026", renewal: 1560, jumpPct: 6 },
  { id: "b-donald", name: "Donald & Karen Kopp", portfolio: "Home + Auto · Donegal", renewalDate: "Jul 26, 2026", renewal: 3502, jumpPct: 12 },
  { id: "b-carole", name: "Carole Meadows", portfolio: "Auto · Progressive", renewalDate: "Aug 22, 2026", renewal: 1916, jumpPct: 46 },
  { id: "b-stacey", name: "Stacey Whitaker", portfolio: "Home + Auto · Travelers", renewalDate: "Dec 1, 2026", renewal: 4120, jumpPct: 3 },
];

const REASONS = [
  "Asked to be shopped",
  "Called about their rate",
  "Coverage question / change",
  "Other",
];

function StatusBadge({ status, added }: { status: Status; added?: boolean }) {
  if (status === "outreach") {
    return (
      <span className="row gap-6" style={{ justifyContent: "flex-end" }}>
        {added && <Badge tone="lime">Added · call-in</Badge>}
        <Badge tone="indigo" dot="indigo">Outreach Ready</Badge>
      </span>
    );
  }
  if (status === "recommend") return <Badge tone="green" dot="green">Recommendation Ready</Badge>;
  return (
    <span className="badge working">
      <Icon.spinner size={12} />
      Shopping carriers…
    </span>
  );
}

function matchesJump(
  jump: number,
  filter: JumpFilter,
  minPct: string,
  maxPct: string,
) {
  if (filter === "all") return true;
  if (filter === "flat") return jump === 0;

  const min = minPct.trim() === "" ? null : Number(minPct);
  const max = maxPct.trim() === "" ? null : Number(maxPct);
  const minOk = min == null || !Number.isNaN(min);
  const maxOk = max == null || !Number.isNaN(max);

  if (filter === "increase") {
    if (jump <= 0) return false;
    if (minOk && min != null && jump < min) return false;
    if (maxOk && max != null && jump > max) return false;
    return true;
  }

  if (filter === "decrease") {
    if (jump >= 0) return false;
    const mag = Math.abs(jump);
    if (minOk && min != null && mag < min) return false;
    if (maxOk && max != null && mag > max) return false;
    return true;
  }

  return true;
}

function sortRows(list: Row[]) {
  const rank = (s: Status) => (s === "recommend" ? 0 : s === "outreach" ? 1 : 2);
  return [...list].sort((a, b) => {
    const rd = rank(a.status) - rank(b.status);
    if (rd !== 0) return rd;
    if (a.status === "outreach" && b.status === "outreach") {
      if (a.added && !b.added) return -1;
      if (!a.added && b.added) return 1;
      return b.jumpPct - a.jumpPct;
    }
    return b.jumpPct - a.jumpPct;
  });
}

export default function QueueScene({ onNext }: SceneProps) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [jumpFilter, setJumpFilter] = useState<JumpFilter>("all");
  const [jumpMin, setJumpMin] = useState("");
  const [jumpMax, setJumpMax] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [picked, setPicked] = useState<BookMember | null>(null);
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState("");

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const showJumpRange = jumpFilter === "increase" || jumpFilter === "decrease";

  const filteredQueue = useMemo(() => {
    let list = rows;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    list = list.filter((r) => matchesJump(r.jumpPct, jumpFilter, jumpMin, jumpMax));
    if (searching) list = list.filter((r) => r.name.toLowerCase().includes(q));
    return sortRows(list);
  }, [rows, statusFilter, jumpFilter, jumpMin, jumpMax, searching, q]);

  const bookHits = useMemo(() => {
    if (!searching) return [];
    const inQueueIds = new Set(rows.map((r) => r.name.toLowerCase()));
    return bookOutsideQueue.filter(
      (b) => b.name.toLowerCase().includes(q) && !inQueueIds.has(b.name.toLowerCase()),
    );
  }, [searching, q, rows]);

  const addCandidates = useMemo(() => {
    const aq = addQuery.trim().toLowerCase();
    if (!aq) return bookOutsideQueue.filter((b) => !rows.some((r) => r.name === b.name));
    return bookOutsideQueue.filter(
      (b) => b.name.toLowerCase().includes(aq) && !rows.some((r) => r.name === b.name),
    );
  }, [addQuery, rows]);

  const counts = useMemo(() => ({
    outreach: rows.filter((r) => r.status === "outreach").length,
    shopping: rows.filter((r) => r.status === "shopping").length,
    recommend: rows.filter((r) => r.status === "recommend").length,
  }), [rows]);

  const addMember = () => {
    if (!picked) return;
    const newRow: Row = {
      id: `added-${picked.id}`,
      name: picked.name,
      portfolio: picked.portfolio,
      jumpPct: picked.jumpPct,
      renewal: picked.renewal,
      status: "outreach",
      added: true,
      reason,
    };
    setRows((prev) => [newRow, ...prev]);
    setAddOpen(false);
    setPicked(null);
    setAddQuery("");
    setReason(REASONS[0]);
    setNotes("");
    setStatusFilter("outreach");
    setQuery("");
  };

  return (
    <Cockpit crumb="Monday, July 28" shell="queue-shell">
      <div className="row between wrap gap-12">
        <SceneHead
          eyebrow="Seabrook Insurance"
          title="Renewals for the week of July 28"
        />
        <div className="mini-stats">
          <span><strong>{counts.outreach}</strong> outreach ready</span>
          <span className="mini-dot" />
          <span><strong>{counts.shopping}</strong> shopping</span>
          <span className="mini-dot" />
          <span><strong>{counts.recommend}</strong> recommendation ready</span>
        </div>
      </div>

      {/* One toolbar line: Search · Status · Premium · Add */}
      <div className="queue-toolbar mt-20">
        <label className="toolbar-field search-field">
          <span className="filter-label">Search</span>
          <span className="queue-search">
            <Icon.search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Members…"
              aria-label="Search members"
            />
          </span>
        </label>

        <label className="toolbar-field">
          <span className="filter-label">Status</span>
          <span className="select-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              aria-label="Filter by status"
            >
              <option value="all">All</option>
              <option value="outreach">Outreach Ready</option>
              <option value="shopping">Shopping</option>
              <option value="recommend">Recommendation Ready</option>
            </select>
            <Icon.chevron size={14} className="select-caret" />
          </span>
        </label>

        <label className="toolbar-field">
          <span className="filter-label">Premium</span>
          <span className="select-wrap">
            <select
              value={jumpFilter}
              onChange={(e) => {
                const next = e.target.value as JumpFilter;
                setJumpFilter(next);
                if (next === "all" || next === "flat") {
                  setJumpMin("");
                  setJumpMax("");
                }
              }}
              aria-label="Filter by premium change"
            >
              <option value="all">All</option>
              <option value="increase">Increase</option>
              <option value="flat">No change</option>
              <option value="decrease">Decrease</option>
            </select>
            <Icon.chevron size={14} className="select-caret" />
          </span>
        </label>

        {showJumpRange && (
          <div className="toolbar-field range-stack fade-in" aria-label="Custom percentage range">
            <span className="filter-label">
              {jumpFilter === "increase" ? "Range" : "Down by"}
            </span>
            <div className="range-fields">
              <label className="pct-input">
                <input
                  type="number"
                  min={0}
                  max={100}
                  inputMode="numeric"
                  placeholder="Min"
                  value={jumpMin}
                  onChange={(e) => setJumpMin(e.target.value)}
                  aria-label="Minimum percent"
                />
                <span>%</span>
              </label>
              <span className="muted" style={{ fontSize: 12 }}>–</span>
              <label className="pct-input">
                <input
                  type="number"
                  min={0}
                  max={100}
                  inputMode="numeric"
                  placeholder="Max"
                  value={jumpMax}
                  onChange={(e) => setJumpMax(e.target.value)}
                  aria-label="Maximum percent"
                />
                <span>%</span>
              </label>
            </div>
          </div>
        )}

        <div className="toolbar-field toolbar-action">
          <span className="filter-label" aria-hidden>&nbsp;</span>
          <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
            <Icon.plus size={16} /> Add client to queue
          </button>
        </div>
      </div>

      <div className="mt-16" style={{ marginBottom: 4 }}>
        <div className="section-head">
          {searching ? `Results · ${filteredQueue.length + bookHits.length}` : "Prioritized queue"}
        </div>
      </div>

      <div className="queue">
        <div className="queue-head queue-cols">
          <div>Member</div>
          <div className="num">Renewal</div>
          <div className="num">Increase</div>
          <div className="num">Status</div>
        </div>

        {filteredQueue.map((r) => (
          <div
            key={r.id}
            className={`queue-row queue-cols ${r.target ? "is-target" : ""} ${r.status === "shopping" ? "is-shopping" : ""}`}
            onClick={r.status === "shopping" ? undefined : onNext}
            style={r.status === "shopping" ? { cursor: "default" } : undefined}
          >
            <div>
              <div className="q-name">{r.name}</div>
              <div className="q-sub">
                {r.portfolio}
                {r.added && r.reason ? ` · ${r.reason}` : ""}
              </div>
            </div>
            <div className="num mono muted">{money(r.renewal)}</div>
            <div className="num q-jump">{jumpLabel(r.jumpPct)}</div>
            <div className="q-status-cell">
              <StatusBadge status={r.status} added={r.added} />
              {r.status !== "shopping" ? (
                <span className="q-chevron"><Icon.chevron size={18} /></span>
              ) : (
                <span className="q-chevron" aria-hidden />
              )}
            </div>
          </div>
        ))}

        {searching && bookHits.length > 0 && (
          <>
            <div className="queue-section-label">Not in this week’s queue</div>
            {bookHits.map((b) => (
              <div key={b.id} className="queue-row queue-cols is-book" onClick={() => {
                setAddOpen(true);
                setPicked(b);
                setAddQuery(b.name);
              }}>
                <div>
                  <div className="q-name">{b.name}</div>
                  <div className="q-sub">{b.portfolio}</div>
                </div>
                <div className="num mono muted">{money(b.renewal)}</div>
                <div className="num q-jump muted">{jumpLabel(b.jumpPct)}</div>
                <div className="q-status-cell">
                  <span className="book-renewal">Renewal on {b.renewalDate}</span>
                  <span className="q-chevron"><Icon.plus size={16} /></span>
                </div>
              </div>
            ))}
          </>
        )}

        {searching && filteredQueue.length === 0 && bookHits.length === 0 && (
          <div className="queue-empty muted">No members match “{query}”.</div>
        )}

        {!searching && filteredQueue.length === 0 && (
          <div className="queue-empty muted">No members match these filters.</div>
        )}
      </div>

      {/* Add to queue panel */}
      {addOpen && (
        <div className="drawer-backdrop" onClick={() => setAddOpen(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="row between">
              <div>
                <div className="eyebrow">Manual add</div>
                <h2 className="scene-title" style={{ fontSize: 22 }}>Add client to queue</h2>
              </div>
              <button className="btn btn-soft" style={{ padding: "8px 10px" }} onClick={() => setAddOpen(false)} aria-label="Close">
                <Icon.x size={16} />
              </button>
            </div>
            <p className="muted mt-8" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              For call-ins who want to be shopped outside their renewal week. We’ll generate a questionnaire once they’re on the queue.
            </p>

            {!picked ? (
              <>
                <label className="queue-search mt-20" style={{ width: "100%" }}>
                  <Icon.search size={16} />
                  <input
                    value={addQuery}
                    onChange={(e) => setAddQuery(e.target.value)}
                    placeholder="Search book of business…"
                    autoFocus
                  />
                </label>
                <div className="add-results mt-12">
                  {addCandidates.map((b) => (
                    <button key={b.id} type="button" className="add-result" onClick={() => setPicked(b)}>
                      <div style={{ textAlign: "left" }}>
                        <div className="strong">{b.name}</div>
                        <div className="q-sub">{b.portfolio}</div>
                      </div>
                      <span className="book-renewal">Renewal on {b.renewalDate}</span>
                    </button>
                  ))}
                  {addCandidates.length === 0 && (
                    <div className="muted" style={{ padding: 12, fontSize: 13 }}>No matching members, or they’re already on the queue.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="stack gap-16 mt-20">
                <div className="picked-member">
                  <div className="strong">{picked.name}</div>
                  <div className="q-sub">{picked.portfolio}</div>
                  <div className="book-renewal mt-8">Renewal on {picked.renewalDate}</div>
                  <button className="btn btn-ghost mt-12" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => setPicked(null)}>
                    Change member
                  </button>
                </div>

                <label className="field">
                  <span className="field-label">Why did they reach out?</span>
                  <select value={reason} onChange={(e) => setReason(e.target.value)}>
                    {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </label>

                <label className="field">
                  <span className="field-label">Any new information you already know? <span className="muted">(optional)</span></span>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. New roof last year, wants to add umbrella, shopping a competitor quote…"
                  />
                </label>

                <button className="btn btn-primary btn-block btn-lg" onClick={addMember}>
                  <Icon.plus size={16} /> Add &amp; prepare questionnaire
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </Cockpit>
  );
}
