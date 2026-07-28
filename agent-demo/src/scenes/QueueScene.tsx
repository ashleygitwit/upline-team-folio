import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, SceneHead } from "../components/ui";
import { agency, client } from "../data";

type Row = {
  name: string; where: string; carrier: string; lines: string;
  jump: string; days: number; gate: "ready" | "blocked" | "touch"; target?: boolean;
};

const rows: Row[] = [
  { name: client.name, where: "Lancaster, PA", carrier: "Donegal", lines: "Home + Auto", jump: "+16%", days: 30, gate: "ready", target: true },
  { name: "Margaret Alcott", where: "York, PA", carrier: "Progressive", lines: "Auto", jump: "+22%", days: 18, gate: "ready" },
  { name: "The Delgado Family", where: "Hershey, PA", carrier: "Travelers", lines: "Home + Auto", jump: "+14%", days: 26, gate: "ready" },
  { name: "Raymond Foss", where: "Lititz, PA", carrier: "Nationwide", lines: "Home", jump: "+11%", days: 41, gate: "blocked" },
  { name: "Priya Nandakumar", where: "Camp Hill, PA", carrier: "Donegal", lines: "Auto", jump: "+4%", days: 33, gate: "touch" },
];

function GateBadge({ gate }: { gate: Row["gate"] }) {
  if (gate === "ready") return <Badge tone="green" dot="green">Shop-ready</Badge>;
  if (gate === "blocked") return <Badge tone="gold" dot="gold">Needs renewal $</Badge>;
  return <Badge dot="indigo">Touch only</Badge>;
}

export default function QueueScene({ onNext }: SceneProps) {
  return (
    <Cockpit crumb="Renewals · This week">
      <SceneHead
        eyebrow={`${agency.name} · ${agency.agent.name}`}
        title="Your renewals, ranked so you know who to work first"
        sub="Upline watches every upcoming renewal, checks it's ready to shop, and floats the biggest premium jumps to the top — so nobody slips through the cracks at renewal."
      />

      <div className="metric-row mt-20">
        <div className="metric"><div className="label">Renewals in 45 days</div><div className="value">38</div></div>
        <div className="metric"><div className="label">Shop-ready</div><div className="value">21</div></div>
        <div className="metric"><div className="label">15%+ increases</div><div className="value">7 <small>work first</small></div></div>
        <div className="metric"><div className="label">Awaiting client</div><div className="value">5</div></div>
      </div>

      <div className="row between mt-24" style={{ marginBottom: 10 }}>
        <div className="section-head">Prioritized queue</div>
        <div className="muted" style={{ fontSize: 13 }}>Sorted by increase, biggest first</div>
      </div>

      <div className="queue">
        <div className="queue-head">
          <div>Member</div>
          <div>Carrier</div>
          <div className="hide-sm">Renewal</div>
          <div className="hide-sm">Increase</div>
          <div>Status</div>
          <div />
        </div>
        {rows.map((r) => (
          <div
            key={r.name}
            className={`queue-row ${r.target ? "is-target" : ""}`}
            onClick={onNext}
          >
            <div>
              <div className="q-name">{r.name}</div>
              <div className="q-sub">{r.where} · {r.lines}</div>
            </div>
            <div>{r.carrier}</div>
            <div className="hide-sm q-sub">{r.days} days out</div>
            <div className="hide-sm q-jump">{r.jump}</div>
            <div><GateBadge gate={r.gate} /></div>
            <div className="q-chevron"><Icon.chevron size={18} /></div>
          </div>
        ))}
      </div>

      <p className="muted mt-16" style={{ fontSize: 13 }}>
        Click <strong>{client.name}</strong> — the biggest jump that's ready to shop — to open their review.
      </p>
    </Cockpit>
  );
}
