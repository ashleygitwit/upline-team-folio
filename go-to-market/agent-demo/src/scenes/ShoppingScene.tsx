import { useState } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, SceneHead, UplineMark, money } from "../components/ui";
import { client, lifeQuote, savings } from "../data";

type CarrierState = "known" | "quoted" | "shopping" | "declined" | "winner";

type CarrierCol = {
  name: string;
  state: CarrierState;
  home: number | null;
  auto: number | null;
  total: number | null;
  bi: string | null;
  homeDed: string | null;
  autoComp: string | null;
  roadside: string | null;
};

const shoppingCols: CarrierCol[] = [
  {
    name: "Donegal",
    state: "known",
    home: 1473,
    auto: 10186,
    total: 11659,
    bi: "100/300 stacked",
    homeDed: "$500 AOP",
    autoComp: "$100 + glass",
    roadside: "2 of 3 vehicles",
  },
  {
    name: "Travelers",
    state: "quoted",
    home: 1512,
    auto: 8328,
    total: 9840,
    bi: "100/300 stacked",
    homeDed: "$1,000 AOP",
    autoComp: "$500",
    roadside: "All 3 vehicles",
  },
  {
    name: "Nationwide",
    state: "shopping",
    home: null,
    auto: null,
    total: null,
    bi: null,
    homeDed: null,
    autoComp: null,
    roadside: null,
  },
  {
    name: "Progressive",
    state: "shopping",
    home: null,
    auto: null,
    total: null,
    bi: null,
    homeDed: null,
    autoComp: null,
    roadside: null,
  },
];

const completeCols: CarrierCol[] = [
  {
    name: "Donegal",
    state: "known",
    home: 1473,
    auto: 10186,
    total: 11659,
    bi: "100/300 stacked",
    homeDed: "$500 AOP",
    autoComp: "$100 + glass",
    roadside: "2 of 3 vehicles",
  },
  {
    name: "Travelers",
    state: "winner",
    home: 1512,
    auto: 8328,
    total: 9840,
    bi: "100/300 stacked",
    homeDed: "$1,000 AOP",
    autoComp: "$500 → re-rate $100",
    roadside: "All 3 vehicles",
  },
  {
    name: "Nationwide",
    state: "quoted",
    home: 1449,
    auto: 9026,
    total: 10475,
    bi: "100/300 stacked",
    homeDed: "$1,000 AOP",
    autoComp: "$500",
    roadside: "All 3 vehicles",
  },
  {
    name: "Progressive",
    state: "declined",
    home: null,
    auto: null,
    total: null,
    bi: null,
    homeDed: null,
    autoComp: null,
    roadside: null,
  },
];

function StateTag({ state }: { state: CarrierState }) {
  if (state === "known") return <span className="status muted">Current renewal</span>;
  if (state === "winner") return <span className="status" style={{ color: "var(--green)" }}>Recommended</span>;
  if (state === "quoted") return <span className="status muted">Quoted</span>;
  if (state === "declined") return <span className="status" style={{ color: "var(--destructive)" }}>Declined — new driver</span>;
  return (
    <span className="status" style={{ color: "var(--gold)", display: "inline-flex", alignItems: "center", gap: 4 }}>
      <Icon.spinner size={12} /> Shopping…
    </span>
  );
}

function Cell({ value, winner, shopping }: { value: string | null; winner?: boolean; shopping?: boolean }) {
  if (shopping) {
    return (
      <td className={winner ? "winner" : ""}>
        <span className="muted"><Icon.spinner size={16} /></span>
      </td>
    );
  }
  return <td className={winner ? "winner" : ""}>{value ?? <span className="muted">—</span>}</td>;
}

function NumCell({ value, winner, shopping }: { value: number | null; winner?: boolean; shopping?: boolean }) {
  if (shopping) {
    return (
      <td className={`num ${winner ? "winner" : ""}`}>
        <span className="muted"><Icon.spinner size={16} /></span>
      </td>
    );
  }
  return (
    <td className={`num ${winner ? "winner" : ""}`}>
      {value == null ? <span className="muted">—</span> : money(value)}
    </td>
  );
}

export default function ShoppingScene({ onNext }: SceneProps) {
  const [phase, setPhase] = useState<"shopping" | "complete">("shopping");
  const cols = phase === "shopping" ? shoppingCols : completeCols;

  return (
    <Cockpit crumb={`${client.name} · Shopping`}>
      <SceneHead
        eyebrow={`${client.name} · Shopping`}
        title={phase === "shopping" ? "Shopping home + auto" : "Carrier comparison"}
        sub={
          phase === "shopping"
            ? "Quotes appear as each carrier finishes. Donegal is the current renewal."
            : "Premiums and coverage side by side. Travelers is recommended."
        }
      />

      {phase === "complete" && (
        <div className="rec-banner fade-in mt-16">
          <div className="rec-banner-main">
            <span className="tag eyebrow" style={{ margin: 0 }}><UplineMark size={14} /> Recommendation</span>
            <h2 className="rec-banner-title">Switch to Travelers</h2>
            <p className="rec-banner-sub muted">
              Best combined home + auto quote. Same liability limits as Donegal, roadside on all three
              vehicles, and {money(savings.perYear)} less per year than renewing.
            </p>
            <div className="rec-banner-stats">
              <div className="rec-banner-stat">
                <span className="val">{money(savings.perYear)}</span>
                <span className="lbl">Saved / year</span>
              </div>
              <div className="rec-banner-stat">
                <span className="val">{savings.pct}%</span>
                <span className="lbl">Under renewal</span>
              </div>
              <div className="rec-banner-stat">
                <span className="val">{money(savings.donegal)}</span>
                <span className="lbl">Donegal renewal</span>
              </div>
              <div className="rec-banner-stat">
                <span className="val" style={{ color: "var(--green)" }}>{money(savings.travelers)}</span>
                <span className="lbl">Travelers quote</span>
              </div>
            </div>
          </div>
          <div className="rec-banner-cta">
            <button className="btn btn-primary btn-lg" onClick={onNext}>
              Draft recommendation <Icon.arrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      <div className="card mt-16" style={{ padding: 0, overflow: "auto" }}>
        <table className="compare">
          <thead>
            <tr>
              <th> </th>
              {cols.map((c) => (
                <th key={c.name} className={c.state === "winner" ? "winner" : ""}>
                  <div className="carrier-head">
                    <span className="name">{c.name}</span>
                    <StateTag state={c.state} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="section-row">
              <td colSpan={cols.length + 1}>Premium</td>
            </tr>
            <tr>
              <td>Home</td>
              {cols.map((c) => (
                <NumCell key={c.name} value={c.home} winner={c.state === "winner"} shopping={c.state === "shopping"} />
              ))}
            </tr>
            <tr>
              <td>Auto</td>
              {cols.map((c) => (
                <NumCell key={c.name} value={c.auto} winner={c.state === "winner"} shopping={c.state === "shopping"} />
              ))}
            </tr>
            <tr className="total-row">
              <td>Combined / year</td>
              {cols.map((c) => (
                <td key={c.name} className={`num ${c.state === "winner" ? "winner" : ""}`}>
                  {c.state === "shopping" ? (
                    <span className="muted"><Icon.spinner size={16} /></span>
                  ) : c.state === "declined" ? (
                    <span className="muted">Declined</span>
                  ) : c.total != null ? (
                    <strong>{money(c.total)}</strong>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              ))}
            </tr>
            <tr className="section-row">
              <td colSpan={cols.length + 1}>Coverage</td>
            </tr>
            <tr>
              <td>Liability (BI/PD)</td>
              {cols.map((c) => (
                <Cell key={c.name} value={c.bi} winner={c.state === "winner"} shopping={c.state === "shopping"} />
              ))}
            </tr>
            <tr>
              <td>Home deductible</td>
              {cols.map((c) => (
                <Cell key={c.name} value={c.homeDed} winner={c.state === "winner"} shopping={c.state === "shopping"} />
              ))}
            </tr>
            <tr>
              <td>Auto comp</td>
              {cols.map((c) => (
                <Cell key={c.name} value={c.autoComp} winner={c.state === "winner"} shopping={c.state === "shopping"} />
              ))}
            </tr>
            <tr>
              <td>Roadside</td>
              {cols.map((c) => (
                <Cell key={c.name} value={c.roadside} winner={c.state === "winner"} shopping={c.state === "shopping"} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {phase === "shopping" && (
        <div className="card card-soft mt-16 fade-in">
          <div className="row between wrap gap-12">
            <div className="row gap-10">
              <Icon.spinner size={18} />
              <div>
                <div className="strong">Still shopping Nationwide &amp; Progressive</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                  Travelers already in — Donegal is the renewal baseline. This usually finishes in a few minutes.
                </div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setPhase("complete")}>
              Refresh quotes <Icon.arrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {phase === "complete" && (
        <div className="life-callout fade-in mt-16">
          <div className="life-callout-head">
            <div>
              <span className="tag eyebrow" style={{ margin: 0 }}>
                <Icon.heart size={14} /> Life insurance
              </span>
              <h3 className="life-callout-title">
                Life quote was shopped with {lifeQuote.carrier}
              </h3>
              <p className="muted" style={{ fontSize: 14, marginTop: 6, maxWidth: "54ch", lineHeight: 1.5 }}>
                Corey opted in to being shopped for life insurance.
              </p>
            </div>
            <Badge tone="green" dot="green">Opted in</Badge>
          </div>

          <div className="life-details">
            <div className="life-detail">
              <span className="lbl">Carrier</span>
              <span className="val">{lifeQuote.carrier}</span>
            </div>
            <div className="life-detail">
              <span className="lbl">Product</span>
              <span className="val">{lifeQuote.product}</span>
            </div>
            <div className="life-detail">
              <span className="lbl">Face amount</span>
              <span className="val">{lifeQuote.face}</span>
            </div>
            <div className="life-detail">
              <span className="lbl">Est. premium</span>
              <span className="val">${lifeQuote.monthly}/mo</span>
            </div>
          </div>

          <div className="section-head mt-16" style={{ marginBottom: 8 }}>Next steps</div>
          <ul className="life-next">
            {lifeQuote.nextSteps.map((step, i) => (
              <li key={step}>
                <span className="n">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Cockpit>
  );
}
