import { AgencyScope, Stage } from "@/components/Stage";
import { PlainEmail } from "@/components/PlainEmail";
import { pruitt } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * Tuesday, 9:02 AM: the outreach as Leah gets it, with whatever Jenna
 * changed on Monday. Harbor Point's, from Jenna, with no Upline in sight.
 */
export function DanaInbox({ walk, go }: WalkProps) {
  const skipped = walk.skipped.includes("pruitt");

  return (
    <Stage caption="Leah's phone · Tuesday, October 13, 9:02 AM" size="phone">
      <AgencyScope>
        {skipped ? (
          <div className="flex flex-1 flex-col justify-center px-6 text-center">
            <p className="font-display text-xl">Nothing from Jenna today.</p>
            <p className="mt-3 text-base text-muted-foreground">
              You skipped the Pruitts on Monday, so this email didn't go. Undo the skip on Monday to see it.
            </p>
          </div>
        ) : (
          <PlainEmail
            time="9:02 AM"
            subject={pruitt.subject}
            body={walk.drafts.pruitt ?? pruitt.email}
            onLink={() => go("questionnaire")}
          />
        )}
      </AgencyScope>
    </Stage>
  );
}
