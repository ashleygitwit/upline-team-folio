import type { ReactNode } from "react";
import { cn } from "cn";

/**
 * The ground for everything that happens outside Upline: Jenna's inbox and
 * Leah's phone. Slate, so it never reads as the product, with one caption
 * saying whose screen this is.
 */
export function Stage({
  caption,
  size,
  children,
}: {
  caption: string;
  size: "phone" | "email";
  children: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100svh-var(--demo-bar-h))] bg-dark-bg px-5 pt-10 pb-16">
      <p className="eyebrow text-center text-dark-fg">{caption}</p>
      <div
        className={cn(
          "mx-auto mt-6 bg-card text-foreground",
          size === "phone"
            ? "flex h-[min(780px,calc(100svh-var(--demo-bar-h)-9rem))] min-h-[560px] max-w-[390px] flex-col overflow-hidden"
            : "max-w-[640px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * The agency's own look for everything Leah sees: Harbor Point's green in
 * place of Upline's blue, set by overriding the tokens so every library
 * component inside follows. No Upline anywhere on these surfaces.
 */
export function AgencyScope({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("agency flex min-h-0 flex-1 flex-col", className)}>{children}</div>;
}

export function AgencyMark() {
  return (
    <div className="flex items-baseline gap-1.5 text-(--agency)">
      <span className="font-display text-lg">Harbor Point</span>
      <span className="eyebrow">Insurance</span>
    </div>
  );
}
