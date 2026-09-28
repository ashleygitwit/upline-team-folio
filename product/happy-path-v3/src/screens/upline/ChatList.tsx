import { Plus } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { dayName, days, type Day } from "@/data";
import type { Chat } from "@/walk";

/**
 * Stacey's chats, listed the way Claude lists them: a new chat at the top,
 * then today's, then each earlier day's, newest first. A day the walk hasn't
 * reached yet isn't shown.
 */
export function ChatList({
  day,
  chats,
  open,
  onOpen,
  onNew,
}: {
  day: Day;
  chats: Chat[];
  open: number | null;
  onOpen: (id: number) => void;
  onNew: () => void;
}) {
  const groups = days
    .slice(0, days.indexOf(day) + 1)
    .reverse()
    .map((d) => ({ d, label: d === day ? "Today" : dayName[d], list: chats.filter((c) => c.day === d).reverse() }))
    .filter((g) => g.list.length > 0);

  return (
    <nav aria-label="Chats" className="flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r bg-card p-4">
      <Button variant="outline" className="w-full justify-start" onClick={onNew}>
        <Plus data-icon="inline-start" />
        New chat
      </Button>

      {groups.length === 0 ? (
        <p className="px-2.5 text-sm text-muted-foreground">Your chats will show up here.</p>
      ) : (
        groups.map((g) => (
          <section key={g.d} aria-labelledby={`chats-${g.d}`}>
            <h2 id={`chats-${g.d}`} className="eyebrow px-2.5 text-muted-foreground">
              {g.label}
            </h2>
            <ul className="mt-2 flex flex-col">
              {g.list.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    title={c.title}
                    aria-current={c.id === open ? "page" : undefined}
                    onClick={() => onOpen(c.id)}
                    className={cn(
                      "block w-full truncate px-2.5 py-2 text-left text-sm transition-colors",
                      c.id === open ? "bg-muted" : "hover:bg-background",
                    )}
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </nav>
  );
}
