import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Viewport = "desktop" | "mobile";

/**
 * The presenter's bar, as in Ashley's v2: Jump to, the screen's name, and on
 * the renewal board only, Desktop or Mobile. Not part of the product, so it
 * sits on the slate ground and reads as the stage, not the app.
 */
export function DemoChrome({
  screens,
  index,
  onGo,
  showViewport,
  viewport,
  onViewport,
}: {
  screens: { label: string }[];
  index: number;
  onGo: (i: number) => void;
  showViewport: boolean;
  viewport: Viewport;
  onViewport: (v: Viewport) => void;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-(--demo-bar-h) items-center gap-3 border-b border-dark-border bg-dark-bg px-3.5 text-dark-fg [--ring:#ffffff]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="secondary">
            Jump to
            <ChevronDown data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {screens.map((s, i) => (
            <DropdownMenuItem
              key={s.label}
              onSelect={() => onGo(i)}
              className={i === index ? "font-medium text-primary" : undefined}
            >
              {s.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <p className="truncate text-sm text-dark-muted-fg">{screens[index].label}</p>

      {showViewport && (
        <div role="radiogroup" aria-label="Viewport" className="ml-auto flex gap-0.5">
          {(["desktop", "mobile"] as const).map((v) => (
            <Button
              key={v}
              size="sm"
              variant={viewport === v ? "secondary" : "ghost"}
              role="radio"
              aria-checked={viewport === v}
              onClick={() => onViewport(v)}
              className={cn(viewport !== v && "text-dark-muted-fg hover:bg-dark-muted hover:text-dark-fg")}
            >
              {v === "desktop" ? "Desktop" : "Mobile"}
            </Button>
          ))}
        </div>
      )}
    </header>
  );
}
