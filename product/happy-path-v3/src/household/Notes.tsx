import { useLayoutEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { agency, dayDate } from "@/data";
import type { Note } from "@/walk";

/** "Wed, Oct 14 · 10:42 AM": the walk's day and the clock time Jenna posted it. */
const stamp = (n: Note) =>
  `${dayDate[n.day].toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · ${n.time}`;

/**
 * Jenna's notes on a household: what she's learned about them or how the
 * renewal is going. The box stays at the foot of the drawer, and each note
 * lands above it, oldest at the top, with her avatar (as Upline's bar draws
 * it), when she wrote it, and what she wrote. It opens empty. Cmd or Ctrl +
 * Enter adds a note, as Add note does.
 */
export function Notes({ first, notes, onAdd }: { first: string; notes: Note[]; onAdd: (text: string) => void }) {
  const [draft, setDraft] = useState("");
  const list = useRef<HTMLDivElement>(null);

  // The newest note is the one just above the box, so keep it in view.
  useLayoutEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [notes.length]);

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft("");
  };

  return (
    <>
      <div ref={list} className="min-h-0 flex-1 overflow-y-auto px-5 pt-4.5 pb-7">
        {notes.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <p className="font-display text-lg">No notes yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Add anything you learn about {first} or how the renewal is going.
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-5">
            {notes.map((n) => (
              <li key={n.id} className="flex gap-3">
                <Avatar aria-hidden>
                  <AvatarFallback className="bg-muted text-foreground">{agency.agent.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    <span className="sr-only">{agency.agent.name}, </span>
                    {stamp(n)}
                  </p>
                  <p className="mt-0.5 text-sm break-words whitespace-pre-wrap">{n.text}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="border-t px-5 pt-3.5 pb-4">
        <Textarea
          aria-label="Add a note"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              add();
            }
          }}
          placeholder={`What's going on with ${first}?`}
          className="max-h-40"
        />
        <div className="mt-2.5 flex justify-end">
          <Button onClick={add} disabled={!draft.trim()}>
            Add note
          </Button>
        </div>
      </div>
    </>
  );
}
