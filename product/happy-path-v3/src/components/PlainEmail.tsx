import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { agency } from "@/data";

/**
 * An email from Jenna as Leah reads it: plain text from Jenna's own
 * mailbox, not a designed blast, because a bulk-mail look is the fear. The
 * one link in it is the only thing on the screen that does anything.
 */
export function PlainEmail({
  time,
  subject,
  body,
  onLink,
}: {
  time: string;
  subject: string;
  body: string;
  onLink: () => void;
}) {
  const paragraphs = body.split(/\n\n+/);

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback className="bg-(--agency) text-xs text-white">{agency.agent.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-medium">{agency.agent.name}</p>
          <p className="text-muted-foreground">to me · {time}</p>
        </div>
      </div>
      <h1 className="mt-6 font-sans text-xl font-medium">{subject}</h1>
      <div className="mt-4 flex flex-col gap-4 text-base">
        {paragraphs.map((p, i) => {
          const m = p.match(/^(.*?) → (https?:\/\/\S+)$/);
          if (m) {
            return (
              <p key={i}>
                <button
                  type="button"
                  onClick={onLink}
                  className="text-left text-(--agency) underline underline-offset-4 hover:no-underline"
                >
                  {m[1]}
                </button>
                <span className="mt-0.5 block break-all text-sm text-muted-foreground">{m[2].replace(/^https?:\/\//, "")}</span>
              </p>
            );
          }
          return <p key={i}>{p}</p>;
        })}
        <p className="mt-2 text-sm text-muted-foreground">
          {agency.agent.title}, {agency.name}
          <br />
          {agency.phone}
        </p>
      </div>
    </div>
  );
}
