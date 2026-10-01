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
import { Switch } from "@/components/ui/switch";
import { screens, type ScreenId } from "@/walk";

/** The stops that show the homepage's board. */
const onBoard: ScreenId[] = ["monday", "review", "wednesday", "thursday", "friday"];

/**
 * The presenter's bar. Not part of the product: it sits on the slate ground so
 * it reads as the stage, not the app, and it carries the only way to jump
 * between days. Arrow keys do the same as Back and Next.
 *
 * On a stop that shows the board, the 4 columns switch swaps the board for
 * the four-column experiment (phases.ts), and it stays as it's set for the
 * rest of the walk.
 */
export function DemoBar({
  index,
  onGo,
  fourColumns,
  onFourColumns,
}: {
  index: number;
  onGo: (i: number) => void;
  fourColumns: boolean;
  onFourColumns: (on: boolean) => void;
}) {
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
          {onBoard.includes(screen.id) && (
            <label className="mr-4 flex items-center gap-2 text-sm text-dark-muted-fg">
              <Switch checked={fourColumns} onCheckedChange={onFourColumns} />4 columns
            </label>
          )}
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
