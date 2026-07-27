export interface SwimLane {
  key: string;
  label: string;
  color: string;
}

export interface SwimStep {
  lane: number;
  text: string;
}

export interface SwimPhase {
  start: number;
  span: number;
  label: string;
  bg: string;
  fg: string;
}

interface SwimlaneMapProps {
  lanes: SwimLane[];
  steps: SwimStep[];
  phases: SwimPhase[];
  ariaLabel: string;
}

// Generalized horizontal swim-lane journey map (columns = steps, rows = actors).
// Shared by the POC weekly loop and the "at a glance" product journey.
export function SwimlaneMap({ lanes, steps, phases, ariaLabel }: SwimlaneMapProps) {
  const W = 1000;
  const gutter = 88;
  const topPad = 6;
  const headerH = 24;
  const headerGap = 10;
  const laneH = 88;
  const laneGap = 10;
  const nStep = steps.length;
  const colW = (W - gutter) / nStep;
  const nodeW = colW - 12;
  const nodeH = 66;
  const lanesTop = topPad + headerH + headerGap;
  const laneTop = (i: number) => lanesTop + i * (laneH + laneGap);
  const nodeX = (col: number) => gutter + col * colW + (colW - nodeW) / 2;
  const nodeY = (lane: number) => laneTop(lane) + (laneH - nodeH) / 2;
  const centerY = (lane: number) => nodeY(lane) + nodeH / 2;
  const H = lanesTop + lanes.length * laneH + (lanes.length - 1) * laneGap + topPad;

  return (
    <figure className="wlm">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        <defs>
          <marker id="slmArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
          </marker>
        </defs>

        {/* Lane bands + labels */}
        {lanes.map((ln, i) => (
          <g key={ln.key}>
            <rect
              x={0}
              y={laneTop(i)}
              width={W}
              height={laneH}
              rx={8}
              style={{ fill: ln.color, fillOpacity: 0.055 }}
            />
            <rect x={0} y={laneTop(i)} width={4} height={laneH} style={{ fill: ln.color }} />
            <text
              x={13}
              y={centerY(i)}
              dominantBaseline="middle"
              style={{ fill: ln.color, fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-sans)' }}
            >
              {ln.label}
            </text>
          </g>
        ))}

        {/* Phase headers */}
        {phases.map((p) => {
          const x = gutter + p.start * colW + 3;
          const w = p.span * colW - 6;
          return (
            <g key={p.label}>
              <rect x={x} y={topPad} width={w} height={headerH} rx={6} style={{ fill: p.bg }} />
              <text
                x={x + w / 2}
                y={topPad + headerH / 2 + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fill: p.fg,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Connectors */}
        {steps.slice(0, -1).map((_, i) => {
          const a = steps[i];
          const b = steps[i + 1];
          const ax = nodeX(i) + nodeW;
          const ay = centerY(a.lane);
          const bx = nodeX(i + 1);
          const by = centerY(b.lane);
          const midx = (ax + bx) / 2;
          return (
            <polyline
              key={i}
              points={`${ax},${ay} ${midx},${ay} ${midx},${by} ${bx},${by}`}
              style={{ fill: 'none', stroke: 'var(--muted-foreground)', strokeWidth: 1.5 }}
              markerEnd="url(#slmArrow)"
            />
          );
        })}

        {/* Nodes */}
        {steps.map((s, i) => {
          const color = lanes[s.lane].color;
          return (
            <foreignObject key={i} x={nodeX(i)} y={nodeY(s.lane)} width={nodeW} height={nodeH}>
              <div
                style={{
                  boxSizing: 'border-box',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: `1.5px solid ${color}`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: '8px',
                  background: 'var(--card)',
                  padding: '6px 9px',
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    lineHeight: 1.22,
                    color: 'var(--card-foreground)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {s.text}
                </span>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </figure>
  );
}
