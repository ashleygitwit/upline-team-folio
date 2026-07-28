import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, SceneHead, UplineMark, money } from "../components/ui";
import { carriers, client, coverageDiffs, lifeQuote, savings } from "../data";

export default function ShoppingScene({ onNext }: SceneProps) {
  return (
    <Cockpit crumb={`${client.name} · Shopping`}>
      <SceneHead
        eyebrow="Step 3 · Shopped across your carriers"
        title="Home and auto, quoted together — coverage matched, not just price"
        sub="Upline runs the bundle across your appointed carriers and normalizes the coverage so you're comparing apples to apples. It won't split a bundle if that quietly strips credits on the other line."
      />

      <div className="card mt-20" style={{ padding: 0, overflow: "hidden" }}>
        <table className="compare">
          <thead>
            <tr>
              <th>Coverage</th>
              {carriers.map((c) => (
                <th key={c.name} className={c.status === "winner" ? "winner" : ""}>
                  <div className="carrier-head">
                    <span className="name">{c.name}</span>
                    <span className="status" style={{ color: c.tone === "green" ? "var(--green)" : c.tone === "red" ? "var(--destructive)" : "var(--muted-foreground)" }}>
                      {c.tag}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="muted">Home</td>
              {carriers.map((c) => (
                <td key={c.name} className={`num ${c.status === "winner" ? "winner" : ""}`}>{c.home ? money(c.home) : "—"}</td>
              ))}
            </tr>
            <tr>
              <td className="muted">Auto</td>
              {carriers.map((c) => (
                <td key={c.name} className={`num ${c.status === "winner" ? "winner" : ""}`}>{c.auto ? money(c.auto) : "—"}</td>
              ))}
            </tr>
            <tr style={{ borderTop: "2px solid var(--border)" }}>
              <td className="strong">Combined / year</td>
              {carriers.map((c) => (
                <td key={c.name} className={`num ${c.status === "winner" ? "winner" : ""}`} style={{ fontSize: 15 }}>
                  {c.total ? <strong>{money(c.total)}</strong> : <span className="muted">Declined</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-main mt-16">
        <div className="card">
          <div className="section-head">Coverage differences to know</div>
          {coverageDiffs.map((d) => (
            <div key={d.label} className="diff-item">
              <span style={{ color: `var(--${d.tone === "green" ? "green" : "gold"})`, flex: "none", marginTop: 1 }}>
                {d.tone === "green" ? <Icon.check size={16} /> : <Icon.alert size={16} />}
              </span>
              <div>
                <span className="strong">{d.label}. </span>
                <span className="muted">{d.body}</span>
              </div>
            </div>
          ))}
          <p className="muted mt-12" style={{ fontSize: 12.5 }}>
            The green items are wins; the amber items are the two things worth mentioning on the call.
          </p>
        </div>

        <div className="stack gap-16">
          <div className="upline-callout center">
            <span className="tag eyebrow" style={{ justifyContent: "center" }}><UplineMark size={15} /> Recommendation</span>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, marginTop: 10 }}>Switch to Travelers</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 38, fontWeight: 600, color: "var(--primary)", marginTop: 6 }}>
              {money(savings.perYear)}
            </div>
            <div className="muted" style={{ fontSize: 13 }}>saved per year · {savings.pct}% under the renewal</div>
            <div className="row gap-8 mt-12" style={{ justifyContent: "center" }}>
              <Badge>{money(savings.donegal)} Donegal</Badge>
              <Icon.arrowRight size={14} />
              <Badge tone="green" dot="green">{money(savings.travelers)} Travelers</Badge>
            </div>
          </div>

          <div className="card card-soft">
            <div className="row gap-8"><Icon.heart size={16} /><span className="section-head" style={{ margin: 0 }}>Life quote (opted in)</span></div>
            <p className="mt-8" style={{ fontSize: 14 }}>
              <strong>{lifeQuote.face}</strong> · {lifeQuote.product}
              <span className="muted"> — about </span>
              <strong>${lifeQuote.monthly}/mo</strong>
            </p>
          </div>

          <button className="btn btn-primary btn-block btn-lg" onClick={onNext}>
            <Icon.mail size={16} /> Draft the recommendation
          </button>
        </div>
      </div>
    </Cockpit>
  );
}
