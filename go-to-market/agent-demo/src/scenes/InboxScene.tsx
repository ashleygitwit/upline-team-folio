import type { SceneProps } from "../App";
import { Icon } from "../components/ui";
import { agency, client, outreachEmail } from "../data";

/** What Corey sees — his email inbox / message open. No Upline branding. */
export default function InboxScene({ onNext }: SceneProps) {
  const v = outreachEmail.vars;

  return (
    <div className="cockpit customer-surface">
      <div className="inbox-shell">
        <div className="inbox-phone">
          <div className="inbox-notch" />
          <div className="inbox-status">
            <span>9:41</span>
            <span className="inbox-carrier">Mail</span>
            <span>●●●</span>
          </div>

          <div className="inbox-nav">
            <button className="inbox-back" type="button" onClick={() => {}} aria-hidden>
              <Icon.arrowLeft size={16} /> Inbox
            </button>
            <span className="muted" style={{ fontSize: 12 }}>Today</span>
          </div>

          <div className="inbox-message fade-in">
            <div className="inbox-from">
              <span className="inbox-avatar">{agency.agent.initials}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="strong" style={{ fontSize: 14 }}>{agency.agent.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{agency.name}</div>
              </div>
              <span className="muted" style={{ fontSize: 11 }}>10:14 AM</span>
            </div>

            <h2 className="inbox-subject">{outreachEmail.subject}</h2>
            <div className="inbox-to muted">To: {client.first}</div>

            <div className="inbox-body">
              <p>Hi {v.first},</p>
              <p>
                At Seabrook Insurance, we value you as a client, not just a policyholder. As your
                renewal on {v.renewalDate} approaches, we'd like to take a few minutes to review your
                coverage and make sure everything still fits your needs. Sometimes we find our clients
                are missing out on discounts, because over time the information we have no longer
                reflects your current situation. Your renewal premium for this term is {v.premium}.
              </p>
              <p>
                One of the advantages of working with Seabrook is that we partner with{" "}
                {agency.carrierCount} different insurance companies. That means we can compare options
                across multiple carriers to help ensure you're receiving competitive rates and the
                coverage that's right for you.
              </p>
              <p>
                To make sure you're not missing any available discounts or carrying coverage that may
                no longer match your situation, I've put together a brief questionnaire.
              </p>
              <button className="btn btn-primary btn-block" style={{ margin: "18px 0" }} onClick={onNext}>
                Complete the questionnaire here →
              </button>
              <p>Thank you for being a valued client of Seabrook Insurance.</p>
              <p>{agency.agent.name}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
