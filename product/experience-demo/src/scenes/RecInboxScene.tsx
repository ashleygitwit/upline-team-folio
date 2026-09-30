import type { SceneProps } from "../App";
import { Icon } from "../components/ui";
import { agency, client, recEmail, recEmailBody } from "../data";

export default function RecInboxScene({ onNext }: SceneProps) {
  return (
    <div className="cockpit customer-surface">
      <div className="inbox-shell">
        <div className="inbox-phone">
          <div className="inbox-notch" />
          <div className="inbox-status">
            <span>7:18</span>
            <span>Mail</span>
            <span>●●●</span>
          </div>
          <div className="inbox-nav">
            <span className="inbox-back"><Icon.arrowLeft size={16} /> Inbox</span>
            <span className="muted" style={{ fontSize: 12 }}>Wed</span>
          </div>
          <div className="inbox-message fade-in">
            <div className="inbox-from">
              <span className="inbox-avatar">{agency.agent.initials}</span>
              <div style={{ flex: 1 }}>
                <div className="strong" style={{ fontSize: 14 }}>{agency.agent.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{agency.name}</div>
              </div>
              <span className="muted" style={{ fontSize: 11 }}>7:18 PM</span>
            </div>
            <h2 className="inbox-subject">{recEmail.subject}</h2>
            <div className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>To: {client.first}</div>
            <div className="inbox-body">
              {recEmailBody.map((p) => <p key={p.slice(0, 28)}>{p}</p>)}
              <button className="btn btn-agency btn-block" style={{ margin: "18px 0" }} onClick={onNext}>
                See the recommendation →
              </button>
              <p>{agency.agent.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
