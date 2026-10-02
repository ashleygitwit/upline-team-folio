import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { agency, dana, outreachBody, outreachEmail, recBody, recEmail } from "@/data";
import type { ScreenProps } from "@/App";

/** Monday's outreach, as Dana reads it on her phone. The button starts the questionnaire. */
export function InsuredInbox({ onNext }: ScreenProps) {
  return (
    <Phone clock="9:41" day="Today" time="9:02 AM" subject={outreachEmail.subject}>
      {outreachBody.map((p) =>
        p.includes("http") ? (
          <p key={p.slice(0, 24)}>
            {p.split(/(https?:\/\/\S+)/).map((part, i) =>
              part.startsWith("http") ? (
                <span key={i} className="font-medium break-words text-primary underline underline-offset-4">
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        ) : (
          <p key={p.slice(0, 24)}>{p}</p>
        ),
      )}
      <Button className="my-4.5 w-full" onClick={onNext}>
        Complete the questionnaire here →
      </Button>
      <p>{agency.agent.name}</p>
      <p className="text-xs text-muted-foreground">
        {agency.name} · {agency.phone}
      </p>
    </Phone>
  );
}

/** Wednesday evening: Stacey's recommendation lands. The button opens the proposal. */
export function RecEmail({ onNext }: ScreenProps) {
  return (
    <Phone clock="7:18" day="Wed" time="7:18 PM" subject={recEmail.subject}>
      {recBody.map((p) => (
        <p key={p.slice(0, 28)}>{p}</p>
      ))}
      <Button className="my-4.5 w-full" onClick={onNext}>
        See the recommendation →
      </Button>
      <p>{agency.agent.name}</p>
    </Phone>
  );
}

/**
 * Dana's phone, drawn as Ashley drew it: a notch, the status bar, Mail's
 * header and one message. The phone is a device, so it keeps a device's
 * rounded corners; the email in it is Stockton Hill's, so it wears the
 * agency's green.
 */
function Phone({
  clock,
  day,
  time,
  subject,
  children,
}: {
  clock: string;
  day: string;
  time: string;
  subject: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100svh-var(--demo-bar-h))] justify-center bg-muted px-5 pt-9 pb-12">
      <div className="agency flex min-h-[640px] w-full max-w-[390px] flex-col self-start overflow-hidden rounded-[28px] border bg-card">
        <div aria-hidden className="mx-auto mt-2 h-5.5 w-[110px] rounded-b-[14px] bg-black" />
        <div aria-hidden className="flex justify-between px-4.5 pt-1.5 pb-1 text-[11px] font-semibold">
          <span>{clock}</span>
          <span>Mail</span>
          <span>●●●</span>
        </div>
        <div className="flex items-center justify-between border-b px-3.5 py-2">
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="size-4" aria-hidden />
            Inbox
          </span>
          <span className="text-xs text-muted-foreground">{day}</span>
        </div>
        <div className="flex-1 px-4.5 pt-4 pb-7 animate-in duration-200 slide-in-from-bottom-1">
          <div className="flex items-center gap-2.5">
            <Avatar size="lg">
              <AvatarFallback className="bg-agency text-xs font-semibold text-white">{agency.agent.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{agency.agent.name}</p>
              <p className="text-xs text-muted-foreground">{agency.name}</p>
            </div>
            <span className="text-[11px] text-muted-foreground">{time}</span>
          </div>
          <h1 className="mt-4 mb-1.5 text-xl leading-tight">{subject}</h1>
          <p className="mb-3.5 text-sm text-muted-foreground">To: {dana.first}</p>
          <div className="text-sm leading-relaxed [&_p]:mb-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
