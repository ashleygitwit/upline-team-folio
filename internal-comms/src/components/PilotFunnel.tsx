const FN_GREEN = 'var(--chart-5)';
const FN_PURPLE = 'var(--primary)';
const FN_GRAY = 'var(--muted-foreground)';

interface FunnelNode {
  x: number;
  y: number;
  w: number;
  h: number;
  count: string;
  label: string[];
  desc: string[];
  color: string;
  ty?: number;
}

const FN_NODES: FunnelNode[] = [
  {
    x: 20,
    y: 85,
    w: 150,
    h: 280,
    count: '48',
    color: FN_GRAY,
    ty: 108,
    label: ['On the sheet'],
    desc: ['Households on the', 'disposition roster'],
  },
  {
    x: 250,
    y: 70,
    w: 150,
    h: 185,
    count: '42',
    color: FN_GREEN,
    label: ['Outreach sent'],
    desc: ['Renewal email sent'],
  },
  {
    x: 250,
    y: 275,
    w: 150,
    h: 90,
    count: '6',
    color: FN_GRAY,
    label: ['Not emailed'],
    desc: ['Held — not in', 'the send queue'],
  },
  {
    x: 480,
    y: 70,
    w: 150,
    h: 140,
    count: '18',
    color: FN_GREEN,
    label: ['Responded'],
    desc: ['Questionnaire', 'completed · 43%'],
  },
  {
    x: 480,
    y: 230,
    w: 150,
    h: 135,
    count: '24',
    color: FN_GRAY,
    ty: 34,
    label: ['No response'],
    desc: ['Emailed, no', 'questionnaire'],
  },
  {
    x: 710,
    y: 70,
    w: 150,
    h: 140,
    count: '18',
    color: FN_GREEN,
    label: ['Rec sent'],
    desc: ['Shopped + rec', 'email · 100% of QQ'],
  },
  {
    x: 940,
    y: 55,
    w: 175,
    h: 310,
    count: '18',
    color: FN_PURPLE,
    ty: 8,
    label: ['Closed / open'],
    desc: ['Switched — 7', 'Stayed — 5', 'Pending — 6'],
  },
];

const FN_STAGES: { x: number; label: string }[] = [
  { x: 95, label: 'In pilot' },
  { x: 325, label: 'Outreach' },
  { x: 555, label: 'Response' },
  { x: 785, label: 'Recommend' },
  { x: 1027, label: 'Outcome' },
];

interface FunnelLink {
  x1: number;
  y1: number;
  t1: number;
  x2: number;
  y2: number;
  t2: number;
  color: string;
}

const FN_LINKS: FunnelLink[] = [
  { x1: 170, y1: 170, t1: 110, x2: 250, y2: 162, t2: 110, color: FN_GREEN },
  { x1: 170, y1: 300, t1: 18, x2: 250, y2: 320, t2: 18, color: FN_GRAY },
  { x1: 400, y1: 115, t1: 42, x2: 480, y2: 140, t2: 42, color: FN_GREEN },
  { x1: 400, y1: 195, t1: 56, x2: 480, y2: 297, t2: 56, color: FN_GRAY },
  { x1: 630, y1: 140, t1: 42, x2: 710, y2: 140, t2: 42, color: FN_GREEN },
  { x1: 860, y1: 140, t1: 42, x2: 940, y2: 210, t2: 42, color: FN_PURPLE },
];

function ribbonPath(l: FunnelLink): string {
  const cx = (l.x1 + l.x2) / 2;
  const a = l.y1 - l.t1 / 2;
  const b = l.y1 + l.t1 / 2;
  const c = l.y2 - l.t2 / 2;
  const d = l.y2 + l.t2 / 2;
  return `M${l.x1},${a} C${cx},${a} ${cx},${c} ${l.x2},${c} L${l.x2},${d} C${cx},${d} ${cx},${b} ${l.x1},${b} Z`;
}

export function PilotFunnel() {
  return (
    <figure className="funnel-figure">
      <svg
        className="funnel-svg"
        viewBox="0 0 1130 400"
        role="img"
        aria-label="Members 1st pilot funnel snapshot: 48 households on the disposition sheet; 42 outreach emails sent and 6 held (not emailed); 18 questionnaires completed (43%) and 24 with no response; all 18 responders received a recommendation email; outcomes — 7 switched, 5 stayed, 6 pending."
      >
        {FN_STAGES.map((s) => (
          <text key={s.label} x={s.x} y={22} textAnchor="middle" className="fn-stage">
            {s.label.toUpperCase()}
          </text>
        ))}

        {FN_LINKS.map((l, i) => (
          <path key={i} d={ribbonPath(l)} fill={l.color} fillOpacity={0.22} />
        ))}

        {FN_NODES.map((n, i) => {
          const top = n.ty ?? 4;
          return (
            <g key={i}>
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={8}
                fill={n.color}
                fillOpacity={0.14}
                stroke={n.color}
                strokeOpacity={0.5}
              />
              <text x={n.x + 12} y={n.y + top + 20} className="fn-num" fill={n.color}>
                {n.count}
              </text>
              {n.label.map((ln, j) => (
                <text key={`l${j}`} x={n.x + 40} y={n.y + top + 14 + j * 13} className="fn-lbl">
                  {ln}
                </text>
              ))}
              {n.desc.map((ln, j) => (
                <text
                  key={`d${j}`}
                  x={n.x + 12}
                  y={n.y + top + 14 + n.label.length * 13 + 6 + j * 12}
                  className="fn-desc"
                >
                  {ln}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption>
        End-of-pilot snapshot from Austin&rsquo;s disposition sheet (Members 1st, as of Aug 7, 2026).
        Outreach and response are cumulative; every questionnaire responder received a recommendation
        email (18/18). Outcomes: switched carriers, stayed with current carrier, or still pending a
        response to the recommendation.
      </figcaption>
    </figure>
  );
}
