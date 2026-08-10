import type { ReactNode } from "react";
import { agency } from "../data";

/* ---------------- Icons (inline, no deps) ---------------- */
type IconProps = { size?: number; className?: string };
const S = (size = 18) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

export const Icon = {
  chevron: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="m9 18 6-6-6-6" /></svg>
  ),
  check: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M20 6 9 17l-5-5" /></svg>
  ),
  checkCircle: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>
  ),
  alert: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
  ),
  sparkle: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M12 8.5 13.2 11 15.5 12 13.2 13 12 15.5 10.8 13 8.5 12 10.8 11Z" fill="currentColor" stroke="none" /></svg>
  ),
  mail: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  ),
  phone: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M15.5 3H19a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3.5M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" /><path d="M12 18h.01" /></svg>
  ),
  search: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
  ),
  minus: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M5 12h14" /></svg>
  ),
  shield: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6Z" /></svg>
  ),
  heart: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z" /></svg>
  ),
  home: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /></svg>
  ),
  car: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M5 13 6.5 8h11L19 13" /><path d="M4 13h16v5H4z" /><circle cx="7.5" cy="18" r="1.4" /><circle cx="16.5" cy="18" r="1.4" /></svg>
  ),
  droplet: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /></svg>
  ),
  send: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg>
  ),
  arrowLeft: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
  ),
  arrowRight: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
  ),
  lock: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
  ),
  x: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M18 6 6 18M6 6l12 12" /></svg>
  ),
  spinner: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={`spin ${className ?? ""}`}><path d="M12 3a9 9 0 1 0 9 9" /></svg>
  ),
  plus: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M12 5v14M5 12h14" /></svg>
  ),
  filter: ({ size, className }: IconProps) => (
    <svg {...S(size)} className={className}><path d="M4 5h16l-6 8v5l-4 2v-7Z" /></svg>
  ),
};

export function UplineMark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M4 20 L11 4 L14 12 L20 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Badge ---------------- */
export function Badge({ children, tone, dot }: { children: ReactNode; tone?: string; dot?: string }) {
  return (
    <span className={`badge ${tone ?? ""}`}>
      {dot && <span className={`dot ${dot}`} />}
      {children}
    </span>
  );
}

/* ---------------- Cockpit frame ---------------- */
export function Cockpit({
  crumb,
  children,
  customer,
  shell,
}: {
  crumb: string;
  children: ReactNode;
  customer?: boolean;
  /** Extra shell class — e.g. "queue-shell" for full-bleed list pages */
  shell?: string;
}) {
  return (
    <div className={`cockpit ${customer ? "customer-surface" : ""} ${shell ?? ""}`.trim()}>
      <div className="cockpit-topbar">
        <img src="/upline-logo.png" alt="Upline" className="cockpit-logo" />
        <span className="divider" />
        <span className="cockpit-crumb">{crumb}</span>
        {!customer && (
          <div className="cockpit-user">
            <span>{agency.agent.name}</span>
            <span className="cockpit-avatar">{agency.agent.initials}</span>
          </div>
        )}
      </div>
      <div className="cockpit-body">{children}</div>
    </div>
  );
}

/* ---------------- Scene header ---------------- */
export function SceneHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="scene-title">{title}</h1>
      {sub && <p className="scene-sub">{sub}</p>}
    </div>
  );
}

export function money(n: number) {
  return "$" + n.toLocaleString("en-US");
}
