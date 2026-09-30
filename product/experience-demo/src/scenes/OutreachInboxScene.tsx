import type { SceneProps } from "../App";
import { Icon } from "../components/ui";
import { agency, client, outreachBody, outreachEmail } from "../data";

export default function OutreachInboxScene({ onNext }: SceneProps) {
  return (
    <div className="cockpit customer-surface">
      <div className="inbox-shell">
        <div className="inbox-phone">
          <div className="inbox-notch" />
          <div className="inbox-status">
            <span>9:41</span>
            <span>Mail</span>
            <span>●●●</span>
          </div>
          <div className="inbox-nav">
            <span className="inbox-back"><Icon.arrowLeft size={16} /> Inbox</span>
            <span className="muted" style={{ fontSize: 12 }}>Today</span>
          </div>
          <div className="inbox-message fade-in">
            <div className="inbox-from">
              <span className="inbox-avatar">{agency.agent.initials}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="strong" style={{ fontSize: 14 }}>{agency.agent.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{agency.name}</div>
              </div>
              <span className="muted" style={{ fontSize: 11 }}>9:02 AM</span>
            </div>
            <h2 className="inbox-subject">{outreachEmail.subject}</h2>
            <div className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>To: {client.first}</div>
            <div className="inbox-body">
              {outreachBody.map((p) =>
                p.includes("http") ? (
                  <p key={p.slice(0, 24)}>
                    {p.split(/(https?:\/\/\S+)/).map((part, i) =>
                      part.startsWith("http") ? (
                        <span key={i} className="qlink">{part}</span>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </p>
                ) : (
                  <p key={p.slice(0, 24)}>{p}</p>
                ),
              )}
              <button className="btn btn-agency btn-block" style={{ margin: "18px 0" }} onClick={onNext}>
                Complete the questionnaire here →
              </button>
              <p>{agency.agent.name}</p>
              <p className="muted" style={{ fontSize: 12 }}>{agency.name} · {agency.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
