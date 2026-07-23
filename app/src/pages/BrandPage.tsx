import { useEffect, useRef, useState } from 'react';

const TWEAKCN_URL = 'https://tweakcn.com/themes/cmpyemmwk000204jse9u28aie';

interface Ramp {
  name: string;
  role: string;
  cssVar: string;
}

const RAMPS: Ramp[] = [
  { name: 'Indigo', role: 'Primary', cssVar: '--primary' },
  { name: 'Lime', role: 'Secondary', cssVar: '--secondary' },
  { name: 'Periwinkle', role: 'Accent', cssVar: '--chart-2' },
  { name: 'Gold', role: 'Accent', cssVar: '--chart-3' },
  { name: 'Sand', role: 'Accent', cssVar: '--chart-4' },
  { name: 'Green', role: 'Accent', cssVar: '--chart-5' },
  { name: 'Ink', role: 'Text', cssVar: '--foreground' },
];

// Light → dark ramp built from each base token, so every column reads as a scale.
function rampSteps(cssVar: string): string[] {
  const base = `var(${cssVar})`;
  return [
    `color-mix(in oklab, ${base} 16%, white)`,
    `color-mix(in oklab, ${base} 40%, white)`,
    `color-mix(in oklab, ${base} 66%, white)`,
    base,
    `color-mix(in oklab, ${base} 78%, black)`,
  ];
}

const LOGO_CELLS: { key: string; label: string; bg: string; invert: boolean; border: boolean }[] = [
  { key: 'light', label: 'On white', bg: 'var(--card)', invert: false, border: true },
  { key: 'primary', label: 'On indigo', bg: 'var(--primary)', invert: true, border: false },
  { key: 'dark', label: 'On black', bg: 'var(--foreground)', invert: true, border: false },
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

function isLight([r, g, b]: [number, number, number]): boolean {
  // Relative luminance — bright swatches get dark text, dark swatches get light text.
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.6;
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
          The working brand system — logo, palette, type, and voice. The theme is defined in{' '}
          <a href={TWEAKCN_URL} target="_blank" rel="noreferrer">
            tweakcn
          </a>
          .
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
                <img
                  src="/upline-logo.png"
                  alt="Upline logo"
                  className={c.invert ? 'logo-mark logo-mark-reversed' : 'logo-mark'}
                />
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
                {rampSteps(r.cssVar).map((bg, i) => {
                  const sw = swatches[r.cssVar]?.[i];
                  return (
                    <div
                      key={i}
                      className="ramp-step"
                      style={{ background: bg, color: sw?.light ? '#1c1a17' : '#ffffff' }}
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
          <p className="type-serif">Fraunces — display &amp; quotes</p>
          <p className="type-sans">DM Sans — body &amp; UI</p>
          <p className="type-mono">DM Mono — data &amp; code</p>
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
