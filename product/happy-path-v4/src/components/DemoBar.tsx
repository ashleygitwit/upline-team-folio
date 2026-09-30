import { Fragment } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { screens } from "@/walk";

/**
 * The presenter's bar. Not part of the product: it sits on the slate ground so
 * it reads as the stage, not the app, and it carries the only way to jump
 * between days. Arrow keys do the same as Back and Next.
 */
export function DemoBar({ index, onGo }: { index: number; onGo: (i: number) => void }) {
  const screen = screens[index];
  const last = screens.length - 1;

  return (
    <div className="sticky top-0 z-40 h-(--demo-bar-h) border-b border-dark-border bg-dark-bg text-dark-fg [--ring:#ffffff]">
      <div className="flex h-full items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary">
                Jump to
                <ChevronDown data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              {/* Each card heads the screens it introduces: pick the card to set
                  the stage, or a screen to skip past it. */}
              {screens.map((s, i) => (
                <Fragment key={s.id}>
                  {s.text && i > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onSelect={() => onGo(i)}
                    className={i === index ? "font-medium text-primary" : undefined}
                  >
                    <span className="w-5 font-mono text-xs text-muted-foreground">{i + 1}</span>
                    {s.text ? (
                      <span className={i === index ? "eyebrow" : "eyebrow text-muted-foreground"}>{s.label}</span>
                    ) : (
                      s.label
                    )}
                  </DropdownMenuItem>
                </Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="truncate text-sm text-dark-muted-fg">
            <span className="text-dark-fg">{screen.label}</span>
            <span aria-hidden> · </span>
            {screen.where}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="mr-1 hidden font-mono text-xs text-dark-muted-fg sm:inline">
            {index + 1} of {screens.length}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="text-dark-fg hover:bg-dark-muted hover:text-dark-fg"
            disabled={index === 0}
            onClick={() => onGo(index - 1)}
          >
            <ArrowLeft data-icon="inline-start" />
            Back
          </Button>
          <Button size="sm" variant="secondary" disabled={index === last} onClick={() => onGo(index + 1)}>
            Next
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  );
}
