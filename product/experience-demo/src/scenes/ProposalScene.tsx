import { useState } from "react";
import type { SceneProps } from "../App";
import { Icon, money } from "../components/ui";
import { agency, client, proposalCompare, savings } from "../data";

export default function ProposalScene({ onNext }: SceneProps) {
  const [choice, setChoice] = useState<"stay" | "switch" | null>(null);

  return (
    <div className="proposal-page">
      <div className="proposal-inner">
        <div className="masthead">
          <div className="wordmark row gap-12">
            <span className="crest">SH</span>
            <div>
              <span className="name">{agency.name}</span>
              <span className="tag">Independent · Dublin, Ohio</span>
            </div>
          </div>
          <div style={{ fontSize: 13, textAlign: "right", opacity: 0.92 }}>
            {agency.agent.name}<br />
            <a href={`mailto:${agency.email}`} style={{ color: "#fff" }}>{agency.phone}</a>
          </div>
        </div>

        <div className="ribbon">
          <span className="dot" style={{ width: 8, height: 8, borderRadius: 99, background: "var(--agency-accent)", display: "inline-block" }} />
          <span>Prepared for {client.name} · home and auto · renews {client.renewalDate}</span>
        </div>

        <div className="sheet">
          <div className="block" style={{ background: "linear-gradient(180deg, var(--agency-soft), var(--card) 70%)" }}>
            <p className="eyebrow">A note from {agency.agent.name}</p>
            <p className="proposal-letter">Hey {client.first},</p>
            <p className="proposal-letter">
              I went ahead and shopped a variety of carriers, and Auto-Owners looks like the best bet, especially if you bundle auto and home together.
            </p>
            <p className="proposal-letter">
              Sophie is on the policy now, and that's why Erie came in higher. Auto-Owners can write the same coverage for less.
            </p>
            <p className="proposal-sign">{agency.agent.name}</p>
          </div>

          <div className="block">
            <p className="eyebrow">The pick</p>
            <h2>Move both home and auto to Auto-Owners.</h2>
            <div className="pick">
              <div className="row between wrap gap-12">
                <div>
                  <p className="strong">Auto-Owners · bundled</p>
                  <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Same deductibles, same liability, replacement cost on the roof.</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="price">{money(savings.owners)}</p>
                  <p className="muted" style={{ fontSize: 13 }}>{money(savings.perYear)} less than Erie</p>
                </div>
              </div>
            </div>
          </div>

          <div className="block">
            <p className="eyebrow">Here's what's changing</p>
            <h2>Your current coverage next to the recommendation.</h2>
            <div className="cov-wrap mt-16">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Coverage</th>
                    <th>Current · Erie</th>
                    <th>Recommended · Auto-Owners</th>
                    <th>What's changed</th>
                  </tr>
                </thead>
                <tbody>
                  {proposalCompare.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td>{row.current}</td>
                      <td className={row.note === "Same" ? "" : "is-rec"}>{row.rec}</td>
                      <td>
                        {row.note === "Same"
                          ? <span className="compare-same"><Icon.check size={14} /> Same</span>
                          : <span className="compare-note">{row.note}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted mt-12" style={{ fontSize: 13.5, lineHeight: 1.45 }}>
              The coverage matches what you have with Erie. The change is the price.
            </p>
          </div>

          <div className="block">
            {choice === null ? (
              <div className="approve-box">
                <h2 className="decide-title">Would you like to move forward with our recommendation?</h2>
                <div className="decide-actions">
                  <button type="button" className="btn btn-soft btn-lg" onClick={() => setChoice("stay")}>
                    No, stay with Erie
                  </button>
                  <button type="button" className="btn btn-agency btn-lg" onClick={() => setChoice("switch")}>
                    Yes, switch to Auto-Owners
                  </button>
                </div>
              </div>
            ) : (
              <div className="approve-box fade-in">
                <p className="strong" style={{ fontSize: 18 }}>
                  {choice === "switch"
                    ? "Great, we'll get in contact with you to go over details and paperwork to bind the new policy."
                    : "Got it. We'll keep you with Erie, and Stacey will be in touch if anything else comes up before November 15."}
                </p>
                <button type="button" className="btn btn-agency mt-16" onClick={onNext}>
                  Back to the week
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
