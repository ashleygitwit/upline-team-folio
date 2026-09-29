import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * The card before each change of day or person, after BrightFuture's demo
 * (brightfuture-demo.vercel.app/2): the stage's slate, a story title, the day
 * and a sentence, so the screen after it reads as a new day or someone else's.
 * No rule beside the title: blue 600 barely shows on slate, and the stage's
 * own captions go without one.
 */
export function Interlude({ title, when, text }: { title: string; when: string; text: string }) {
  return (
    <div className="flex min-h-[calc(100svh-var(--demo-bar-h))] items-center bg-dark-bg text-dark-fg">
      <div className="shell animate-in py-(--space-section) duration-300 fade-in-0 slide-in-from-bottom-2">
        <p className="eyebrow">{title}</p>
        <Badge className="mt-(--space-tight) border-dark-border bg-dark-muted text-dark-fg">
          <Clock data-icon="inline-start" />
          {when}
        </Badge>
        <h1 className="mt-(--space-tight) text-4xl leading-snug text-pretty">{text}</h1>
      </div>
    </div>
  );
}
