const COST_ASSUMPTIONS: [string, string][] = [
  ['1,500', 'households'],
  ['~30', 'outreach / week'],
  ['~25%', 'respond'],
  ['~29%', 'of those reached opt to shop (25–33%)'],
  ['30–45 min', 'to shop each'],
  ['~6', 'closes / week'],
  ['$8/hr', 'VA (fully loaded)'],
  ['VA', 'shopping + biweekly data refresh'],
  ['RPA', 'initial load + renewal pulls'],
];

interface CostRow {
  group?: string;
  item?: string;
  basis?: string;
  amt?: string;
  note?: string;
  total?: boolean;
}

const COST_ROWS: CostRow[] = [
  { group: 'Labor' },
  { item: 'Shopping (VA)', basis: '~8–9/wk × ~38 min @ $8/hr', amt: '~$190' },
  {
    item: 'Household-data refresh (VA)',
    basis: '~30/wk entering window × ~4 min @ $8/hr',
    amt: '~$65',
    note: '→ ~$0 if the RPA does this instead',
  },
  {
    item: 'Close meetings',
    basis: "agency servicing team takes these — they're paid on the close",
    amt: '$0',
  },
  { group: 'Automation & tools' },
  {
    item: 'RPA — initial load + weekly renewal pulls',
    basis: 'built in-house (Stagehand + Browserbase): browser-hosting plan + LLM tokens',
    amt: '~$20–100',
  },
  {
    item: 'Email — send + reply capture (Graph / Gmail API)',
    basis: "through the agent's own mailbox",
    amt: 'Free',
  },
  {
    item: 'Meeting transcription (Recall.ai + AssemblyAI)',
    basis: '~$0.80/hr × meeting hrs',
    amt: '~$16',
  },
  {
    item: 'Phone recording + transcription (Twilio)',
    basis: '~$0.0025/min + number',
    amt: '~$10',
  },
  { item: 'Two-way text capture (Twilio SMS)', basis: 'number + ~$0.008/msg', amt: '~$10' },
  { item: 'Scheduling (Calendly)', basis: 'per seat', amt: '~$12' },
  { item: 'E-signature (Dropbox Sign / PandaDoc)', basis: 'unlimited plan', amt: '~$25' },
  { total: true, item: 'Recurring total', basis: 'per agency / month', amt: '~$350–430' },
];

export function CostBreakdown() {
  return (
    <>
      <p className="export-hint">
        Estimated monthly run-cost for one ~1,500-household agency. Excludes MVP build / engineering
        — this is ongoing time + tool cost only. VA labor is <strong>shopping</strong> plus a light{' '}
        <strong>biweekly data-refresh</strong> pull; the RPA handles the initial load and the weekly
        renewal-number pulls. Directional; edit the assumptions with Austin.
      </p>
      <div className="cost-assumptions">
        {COST_ASSUMPTIONS.map(([v, l]) => (
          <span key={l} className="cost-pill">
            <b>{v}</b> {l}
          </span>
        ))}
      </div>
      <div className="cost-table-wrap">
        <table className="cost-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Basis</th>
              <th className="amt">Est. $/mo</th>
            </tr>
          </thead>
          <tbody>
            {COST_ROWS.map((r, i) =>
              r.group ? (
                <tr key={`g-${i}`} className="cost-group">
                  <td colSpan={3}>{r.group}</td>
                </tr>
              ) : (
                <tr key={r.item} className={r.total ? 'cost-total' : undefined}>
                  <td>
                    {r.item}
                    {r.note ? <span className="cost-row-note"> {r.note}</span> : null}
                  </td>
                  <td className="cost-basis">{r.basis}</td>
                  <td className="amt">{r.amt}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <div className="mini-callout">
        <p className="mini-callout-t">What this means</p>
        <p>
          Recurring human labor is <strong>VA shopping (~$190/mo)</strong> plus a light{' '}
          <strong>pre-outreach data refresh (~$65/mo)</strong>. The RPA handles the initial load and
          weekly renewal-number pulls, and the expensive close is <strong>$0 to Upline</strong> (the
          servicing team&rsquo;s revenue). Building the RPA on Stagehand + Browserbase runs{' '}
          <strong>~$20–100/mo</strong> — vs. <strong>$8k–15k per bot per year</strong> for a
          commercial RPA platform, so building is ~10–50× cheaper. Whole thing runs{' '}
          <strong>~$350–430/mo per agency</strong>.
        </p>
      </div>
    </>
  );
}
