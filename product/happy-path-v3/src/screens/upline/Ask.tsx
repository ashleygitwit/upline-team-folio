import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pillById, type PillId } from "@/pills";

/**
 * The box Jenna types into, on the homepage and under a chat. On the
 * homepage the suggested questions sit inside it, on one row under the line
 * she types on, and the whole box takes the focus ring the field would.
 */
export function AskBox({
  label,
  onAsk,
  className,
  children,
}: {
  label: string;
  onAsk: (question: string) => void;
  className?: string;
  /** Suggested questions, shown inside the box. */
  children?: React.ReactNode;
}) {
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = text.trim();
    if (!question) return;
    onAsk(question);
    setText("");
  };

  if (children) {
    return (
      <form
        onSubmit={submit}
        className={cn(
          "border border-input bg-card text-card-foreground transition-[color,box-shadow] has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring",
          className,
        )}
      >
        <div className="flex items-center gap-4 pr-4">
          <Input
            aria-label={label}
            placeholder={label}
            className="h-14 border-0 px-4 focus-visible:ring-0"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" size="icon" disabled={!text.trim()}>
            <ArrowUp />
            <span className="sr-only">Ask</span>
          </Button>
        </div>
        <div className="px-4 pb-4">{children}</div>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className={cn("flex", className)}>
      <Input
        aria-label={label}
        placeholder={label}
        className="h-13 border-r-0 px-4"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" size="lg" className="w-13 px-0" disabled={!text.trim()}>
        <ArrowUp />
        <span className="sr-only">Ask</span>
      </Button>
    </form>
  );
}

/** The suggested questions, written out so Jenna doesn't have to think of them. */
export function Suggestions({
  ids,
  onAsk,
  size = "default",
  className,
}: {
  ids: PillId[];
  onAsk: (id: PillId) => void;
  /** Small inside the homepage's box, so all three fit on one row. */
  size?: "default" | "sm";
  className?: string;
}) {
  return (
    <ul aria-label="Suggested questions" className={cn("flex flex-wrap gap-2", className)}>
      {ids.map((id) => (
        <li key={id}>
          <Button variant="outline" size={size} className="bg-card font-sans font-normal" onClick={() => onAsk(id)}>
            {pillById(id).question}
          </Button>
        </li>
      ))}
    </ul>
  );
}
