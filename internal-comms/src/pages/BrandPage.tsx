import { useEffect, useRef, useState } from 'react';

interface Ramp {
  name: string;
  role: string;
  cssVar: string;
  steps: string[];
}

// The Upline Brand Guide palette. Each ramp shows shades 100/300/500/700/900;
// the role names match the semantic labels in the guide.
const RAMPS: Ramp[] = [
  {
    name: 'Indigo',
    role: 'Primary',
    cssVar: '--primary',
    steps: ['#c0c3f4', '#7879e5', '#483ac7', '#321e97', '#1e125b'],
  },
  {
    name: 'Lime',
    role: 'Secondary',
    cssVar: '--secondary',
    steps: ['#f8fbcb', '#f1f68e', '#eaf156', '#a6ab3d', '#626524'],
  },
  {
    name: 'Light Blue',
    role: 'Gradient',
    cssVar: '--chart-2',
    steps: ['#e2e7fe', '#c1ccfc', '#a2b3fb', '#737fb2', '#444b69'],
  },
  {
    name: 'Yellow',
    role: 'Accent',
    cssVar: '--chart-3',
    steps: ['#fff1c7', '#ffe186', '#ffd24a', '#b59535', '#6b581f'],
  },
  {
    name: 'Coral',
    role: 'Accent',
    cssVar: '--chart-4',
    steps: ['#ffd7c0', '#ffa978', '#ff7f35', '#b55a26', '#6b3516'],
  },
  {
    name: 'Green',
    role: 'Accent',
    cssVar: '--chart-5',
    steps: ['#c8e7ce', '#88cc94', '#4db360', '#377f44', '#204b28'],
  },
  {
    name: 'Lavender',
    role: 'Accent',
    cssVar: '--chart-6',
    steps: ['#efe4fc', '#cfb6ee', '#ad8bd5', '#785d97', '#49385b'],
  },
  {
    name: 'Red',
    role: 'Destructive',
    cssVar: '--destructive',
    steps: ['#fcc1c0', '#fa7877', '#f83634', '#b02625', '#681716'],
  },
  {
    name: 'Gray',
    role: 'Neutral',
    cssVar: '--muted-foreground',
    steps: ['#ecebe9', '#c7c5c2', '#9a9894', '#6d6c68', '#363533'],
  },
  {
    name: 'Slate',
    role: 'Dark',
    cssVar: '--foreground',
    steps: ['#ceced6', '#888893', '#4f4e5a', '#282831', '#0b0b0f'],
  },
];

const LOGO_LIGHT = '/upline-logo.svg';
const LOGO_WHITE = '/upline-logo-white.svg';

const LOGO_CELLS: { key: string; label: string; bg: string; src: string; border: boolean }[] = [
  { key: 'light', label: 'On white', bg: 'var(--card)', src: LOGO_LIGHT, border: true },
  { key: 'primary', label: 'On indigo', bg: 'var(--primary)', src: LOGO_WHITE, border: false },
  { key: 'dark', label: 'On black', bg: 'var(--foreground)', src: LOGO_WHITE, border: false },
];

// ---- Color math: resolve the computed swatch color (oklab/oklch/rgb) to a hex code ----
function encodeChannel(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, v)) * 255);
}

function oklabToRgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [encodeChannel(r), encodeChannel(g), encodeChannel(bb)];
}

function parseToRgb(str: string): [number, number, number] {
  const nums = str.match(/-?[\d.]+/g)?.map(Number) ?? [];
  if (str.startsWith('rgb')) {
    return [nums[0] ?? 0, nums[1] ?? 0, nums[2] ?? 0];
  }
  if (str.startsWith('oklch')) {
    const [L, C, H] = nums;
    const rad = ((H ?? 0) * Math.PI) / 180;
    return oklabToRgb(L ?? 0, (C ?? 0) * Math.cos(rad), (C ?? 0) * Math.sin(rad));
  }
  if (str.startsWith('oklab')) {
    return oklabToRgb(nums[0] ?? 0, nums[1] ?? 0, nums[2] ?? 0);
  }
  return [0, 0, 0];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

const SWATCH_INK = '#363533';
const SWATCH_PAPER = '#ffffff';

function relLuminance([r, g, b]: [number, number, number]): number {
  const ch = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const l1 = relLuminance(a);
  const l2 = relLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Pick whichever of ink/paper reads better on the swatch, rather than guessing
// from a luminance threshold — saturated mid-tones fool a fixed cutoff.
function isLight(rgb: [number, number, number]): boolean {
  return contrast(rgb, [54, 53, 51]) >= contrast(rgb, [255, 255, 255]);
}

interface Swatch {
  hex: string;
  light: boolean;
}

export function BrandPage() {
  const rampsRef = useRef<HTMLDivElement>(null);
  const [swatches, setSwatches] = useState<Record<string, Swatch[]>>({});

  useEffect(() => {
    const root = rampsRef.current;
    if (!root) return;
    const next: Record<string, Swatch[]> = {};
    root.querySelectorAll<HTMLElement>('.ramp').forEach((rampEl) => {
      const key = rampEl.dataset.var;
      if (!key) return;
      next[key] = [...rampEl.querySelectorAll<HTMLElement>('.ramp-step')].map((step) => {
        const rgb = parseToRgb(getComputedStyle(step).backgroundColor);
        return { hex: rgbToHex(rgb), light: isLight(rgb) };
      });
    });
    setSwatches(next);
  }, []);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Brand</p>
        <h1 className="hero-title">How Upline looks, sounds, and feels.</h1>
        <p className="hero-sub">
          The working brand system — logo, palette, type, and voice. Colour and type follow the
          Upline Brand Guide; components follow the Upline shadcncraft Base library.
        </p>
      </section>

      <section className="card">
        <h2>Logo</h2>
        <div className="logo-trio">
          {LOGO_CELLS.map((c) => (
            <div key={c.key} className="logo-cell">
              <div
                className={c.border ? 'logo-well logo-well-bordered' : 'logo-well'}
                style={{ background: c.bg }}
              >
                <img src={c.src} alt="Upline logo" className="logo-mark" />
              </div>
              <p className="logo-cell-label">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Palette</h2>
        <p className="brand-subnote">
          The Upline brand colors and their scales — the tokens this whole system is built from. Hex
          values are the resolved sRGB for each step.
        </p>
        <div className="brand-ramps" ref={rampsRef}>
          {RAMPS.map((r) => (
            <div key={r.cssVar} className="ramp" data-var={r.cssVar}>
              <div className="ramp-bar">
                {r.steps.map((bg, i) => {
                  const sw = swatches[r.cssVar]?.[i];
                  return (
                    <div
                      key={i}
                      className="ramp-step"
                      style={{ background: bg, color: sw?.light ? SWATCH_INK : SWATCH_PAPER }}
                    >
                      {sw?.hex ?? ''}
                    </div>
                  );
                })}
              </div>
              <p className="ramp-name">{r.name}</p>
              <p className="ramp-role">{r.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Typography</h2>
        <div className="type-specimen">
          <p className="type-display">Radio Canada Big — headers &amp; subheaders</p>
          <p className="type-sans">Radio Canada — long-form copy &amp; captions</p>
          <p className="type-mono">Reddit Mono — data &amp; code</p>
        </div>
      </section>

      <section className="card mantra-card">
        <h2>Voice — the mantra</h2>
        <blockquote>Make every renewal prove the agent is in my corner.</blockquote>
        <p className="export-hint">
          Everything Upline says should ladder up to this. We reassure, we don&rsquo;t alarm; we lead
          with the relationship, not the rate.
        </p>
      </section>
    </>
  );
}
