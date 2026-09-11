import type { FunnelStage } from '../data/dashboardWireframe';

function wave(xs: number[], ys: number[], bump: number) {
  let d = `M ${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
  for (let i = 0; i < xs.length - 1; i += 1) {
    const x0 = xs[i];
    const y0 = ys[i];
    const x1 = xs[i + 1];
    const y1 = ys[i + 1];
    const cx = (x0 + x1) / 2;
    const lift = i % 2 === 0 ? -bump : bump;
    d += ` C ${cx.toFixed(1)} ${(y0 + lift).toFixed(1)}, ${cx.toFixed(1)} ${(y1 - lift).toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}

export function OutreachFunnel({ stages }: { stages: FunnelStage[] }) {
  const W = 1100;
  const H = 250;
  const padX = 74;
  const padTop = 34;
  const padBot = 62;
  const midY = padTop + (H - padTop - padBot) / 2;
  const maxHalf = (H - padTop - padBot) / 2;
  const max = stages[0]?.count ?? 1;
  const xs = stages.map((_, i) => padX + (i * (W - padX * 2)) / Math.max(stages.length - 1, 1));
  const halves = stages.map((s) => Math.max(16, maxHalf * (s.count / max)));
  const tops = xs.map((_, i) => midY - halves[i]);
  const bots = xs.map((_, i) => midY + halves[i]);
  const area = `${wave(xs, tops, 13)} ${wave([...xs].reverse(), [...bots].reverse(), 13).replace(/^M/, 'L')} Z`;
  const innerHalves = halves.map((h) => h * 0.7);
  const innerTops = xs.map((_, i) => midY - innerHalves[i] + 5);
  const innerBots = xs.map((_, i) => midY + innerHalves[i] + 2);
  const inner = `${wave(xs, innerTops, 9)} ${wave([...xs].reverse(), [...innerBots].reverse(), 9).replace(/^M/, 'L')} Z`;

  return (
    <svg
      className="bd-funnel-svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Work Upline did"
    >
      <defs>
        <linearGradient id="bd-funnel-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff7f35" />
          <stop offset="42%" stopColor="#ffb088" />
          <stop offset="100%" stopColor="#ffe4d0" />
        </linearGradient>
        <linearGradient id="bd-funnel-inner" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff9a5c" />
          <stop offset="55%" stopColor="#ffd2b3" />
          <stop offset="100%" stopColor="#fff4ea" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#bd-funnel-fill)" />
      <path d={inner} fill="url(#bd-funnel-inner)" opacity="0.85" />
      {xs.map((x, i) => (
        <g key={stages[i].label}>
          <text className="bd-funnel-label" x={x} y={20} textAnchor="middle">
            {stages[i].label}
          </text>
          <line
            x1={x}
            x2={x}
            y1={tops[i] + 4}
            y2={bots[i] - 4}
            stroke="#fff"
            strokeWidth="2.25"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx={x} cy={H - 26} r="19" fill="#c0c3f4" />
          <text className="bd-funnel-count" x={x} y={H - 21} textAnchor="middle">
            {stages[i].count}
          </text>
        </g>
      ))}
    </svg>
  );
}
