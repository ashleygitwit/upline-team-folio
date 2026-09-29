import { useContext, type ReactNode } from "react";
import { cn } from "cn";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReturnFocus } from "@/household/returnFocus";
import { focusPanel } from "@/lib/focus";

/**
 * A phase's page as a modal over the drawer (the outreach review, a nudge, a
 * shop, its results or the close-out): the drawer's header and ground, its
 * body scrolling under a header that stays, so the close button never scrolls
 * away, and its buttons in a footer under the scroll rather than at the
 * body's foot. It's centered in the window under the presenter's bar, since
 * it's tall enough to reach it.
 */
export function PhaseModal({
  eyebrow,
  title,
  footer,
  children,
}: {
  eyebrow: string;
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const returnFocus = useContext(ReturnFocus);
  return (
    <DialogContent
      onOpenAutoFocus={focusPanel}
      onCloseAutoFocus={returnFocus}
      aria-describedby={undefined}
      className="top-[calc(50%+var(--demo-bar-h)/2)] flex max-h-[calc(100svh-var(--demo-bar-h)-2rem)] flex-col gap-0 overflow-hidden bg-background p-0 outline-none sm:max-w-[640px]"
    >
      <DialogHeader className="gap-0 px-5 pt-4.5 pr-14">
        <p className="eyebrow text-muted-foreground">{eyebrow}</p>
        <DialogTitle className="mt-1.5 font-display text-2xl">{title}</DialogTitle>
      </DialogHeader>
      <div className="mt-3.5 min-h-0 flex-1 overflow-y-auto border-t px-5 pt-4.5 pb-7">{children}</div>
      {footer}
    </DialogContent>
  );
}

/**
 * A phase modal's footer, laid out as the drawer's own was: one button fills
 * the row, a quiet one sits to its left, and once it's done, what happened is
 * said on the left with any Undo on the right.
 */
export function PhaseFooter({ done, children }: { done?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center border-t px-5 pt-3.5 pb-4",
        done ? "justify-between gap-4" : "justify-end gap-2",
      )}
    >
      {children}
    </div>
  );
}
