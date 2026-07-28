import type { JSX } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, SceneHead, UplineMark } from "../components/ui";
import { client, responseHighlights } from "../data";

const iconFor: Record<string, JSX.Element> = {
  check: <Icon.checkCircle size={18} />,
  pool: <Icon.droplet size={18} />,
  minus: <Icon.minus size={18} />,
  life: <Icon.heart size={18} />,
};

export default function ResponsesScene({ onNext }: SceneProps) {
  return (
    <Cockpit crumb={`${client.name} · Responses`}>
      <div className="row between wrap gap-12">
        <SceneHead
          eyebrow="Step 2 · Corey answered — in 6 minutes"
          title="His answers land right on his card"
          sub="No re-keying, no chasing. Upline drops the responses onto Corey's record and highlights what changed since the policy was written — so you're ready to quote accurately."
        />
        <Badge tone="green" dot="green">Completed · 2 min ago</Badge>
      </div>

      <div className="grid grid-main mt-20">
        <div className="card pad-lg">
          <div className="section-head">What changed</div>
          <div className="mt-8">
            {responseHighlights.map((r) => (
              <div key={r.text} className="rec-line" style={{ padding: "11px 0", borderTop: "1px solid var(--border)" }}>
                <span style={{ color: `var(--${r.tone === "indigo" ? "primary" : r.tone})` }}>{iconFor[r.icon]}</span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stack gap-16">
          <div className="upline-callout">
            <span className="tag eyebrow"><UplineMark size={15} /> Ready to shop</span>
            <p className="muted mt-12" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              Every gap that would've made a quote inaccurate is now filled: Lily's license number is in,
              the pool's confirmed, the trampoline's off, and Corey wants a life number. Upline has the
              clean facts it needs to shop your carriers.
            </p>
            <div className="mt-16">
              {["Home + auto quoted together", "Coverage matched to today", "Life quote queued"].map((t) => (
                <div key={t} className="rec-line"><span className="check"><Icon.check size={16} /></span><span>{t}</span></div>
              ))}
            </div>
            <button className="btn btn-primary btn-block btn-lg mt-16" onClick={onNext}>
              <Icon.search size={16} /> Shop the renewal
            </button>
          </div>
        </div>
      </div>
    </Cockpit>
  );
}
