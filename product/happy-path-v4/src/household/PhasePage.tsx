import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { PageBack } from "@/household/pageNav";

/**
 * How long a page takes to slide over the drawer or back off it, and so how
 * long a page that's going stays on screen. The layer's duration-250 is the
 * same number.
 */
const SLIDE_MS = 250;

/**
 * A layer over the household's drawer: a page over the profile, or the
 * carriers' quotes over the results. It slides in from the drawer's right
 * edge and covers it, and slides back out when it closes, showing what it
 * showed until it's gone. Its hairline lies over the drawer's own left edge,
 * so the edge reads while it moves. One that's open as the drawer opens (the
 * walk's shortcuts) arrives with the drawer rather than after it; any other
 * takes the focus on its title, so a screen reader says where it is. Under
 * reduced motion it appears and goes at once. Covered or going, nothing in
 * it takes the focus.
 */
export function Layer<T>({
  item,
  covered = false,
  children,
}: {
  item: T | null;
  covered?: boolean;
  children: (item: T) => ReactNode;
}) {
  const [arrived] = useState(item);
  const [shown, setShown] = useState(item);
  if (item !== null && item !== shown) setShown(item);
  useEffect(() => {
    if (item !== null) return;
    const gone = window.setTimeout(() => setShown(null), SLIDE_MS);
    return () => window.clearTimeout(gone);
  }, [item]);

  const open = item !== null;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && shown !== arrived) ref.current?.querySelector<HTMLElement>("[data-page-title]")?.focus();
  }, [open, shown, arrived]);

  if (shown === null) return null;
  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      inert={!open || covered}
      className={cn(
        "absolute inset-y-0 right-0 -left-px z-10 flex flex-col border-l bg-popover duration-250 ease-out",
        shown !== arrived && "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:slide-in-from-right",
        "motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fill-mode-forwards motion-safe:data-[state=closed]:slide-out-to-right",
        "motion-reduce:data-[state=closed]:hidden",
      )}
    >
      {children(shown)}
    </div>
  );
}

/**
 * A page over the drawer: the outreach review, a nudge, a shop, its results
 * or the close-out, and over the results, the carriers' quotes. Its back
 * button, named for where it goes, sits level with the drawer's close
 * button, which stays put over every page and closes the drawer. Then the
 * page's title, its body scrolling under them so neither scrolls away, and
 * its buttons in a footer under the scroll rather than at the body's foot.
 *
 * Until 2026-10-01 these were modals centered over the page, wider and
 * shorter than the drawer, so they'd read as a dialog over the page rather
 * than a second drawer over the first (the 2026-09-29 review). That was an
 * assumption, not something seen in use, and a modal left no way back to
 * the profile but closing it.
 */
export function PhasePage({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const back = useContext(PageBack);
  return (
    <>
      <div className="px-5 pt-4 pr-14">
        {back && (
          <Button
            variant="link"
            aria-label={`Back to ${back.label}`}
            onClick={back.onBack}
            className="h-8 p-0 font-sans text-sm has-data-[icon=inline-start]:pl-0 pointer-coarse:min-h-11"
          >
            <ArrowLeft data-icon="inline-start" />
            {back.label}
          </Button>
        )}
        <h2 data-page-title tabIndex={-1} className="mt-1 font-display text-2xl">
          {title}
        </h2>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div data-phase-body className="mt-3.5 min-h-0 flex-1 overflow-y-auto border-t px-5 pt-4.5 pb-7">
        {children}
      </div>
      {footer}
    </>
  );
}

/**
 * A page's footer, laid out as the drawer's own was: one button fills the
 * row, a quiet one (Skip, Back) sits to its left, and once it's done, what
 * happened is said on the left with any Undo on the right. On a phone the
 * buttons stack, the main one on top.
 */
export function PhaseFooter({ done, children }: { done?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex border-t px-5 pt-3.5 pb-4",
        done
          ? "items-center justify-between gap-4"
          : "flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end",
      )}
    >
      {children}
    </div>
  );
}
