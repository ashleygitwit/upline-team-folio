import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pillById, type PillId } from "@/pills";

/** The box Stacey types into, on the homepage and under a chat. */
export function AskBox({
  label,
  onAsk,
  className,
}: {
  label: string;
  onAsk: (question: string) => void;
  className?: string;
}) {
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = text.trim();
    if (!question) return;
    onAsk(question);
    setText("");
  };

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

/** The suggested questions, written out so Stacey doesn't have to think of them. */
export function Suggestions({
  ids,
  onAsk,
  className,
}: {
  ids: PillId[];
  onAsk: (id: PillId) => void;
  className?: string;
}) {
  return (
    <ul aria-label="Suggested questions" className={cn("flex flex-wrap gap-2", className)}>
      {ids.map((id) => (
        <li key={id}>
          <Button variant="outline" className="bg-card font-sans font-normal" onClick={() => onAsk(id)}>
            {pillById(id).question}
          </Button>
        </li>
      ))}
    </ul>
  );
}
