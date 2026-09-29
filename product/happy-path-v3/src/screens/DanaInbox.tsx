import { AgencyScope, Stage } from "@/components/Stage";
import { PlainEmail } from "@/components/PlainEmail";
import { callahan } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * Tuesday, 9:02 AM: the outreach as Dana gets it, with whatever Stacey
 * changed on Monday. Stockton Hill's, from Stacey, with no Upline in sight.
 */
export function DanaInbox({ walk, go }: WalkProps) {
  const skipped = walk.skipped.includes("callahan");

  return (
    <Stage caption="Dana's phone · Tuesday, October 13, 9:02 AM" size="phone">
      <AgencyScope>
        {skipped ? (
          <div className="flex flex-1 flex-col justify-center px-6 text-center">
            <p className="font-display text-xl">Nothing from Stacey today.</p>
            <p className="mt-3 text-base text-muted-foreground">
              You skipped the Callahans on Monday, so this email didn't go. Undo the skip on Monday to see it.
            </p>
          </div>
        ) : (
          <PlainEmail
            time="9:02 AM"
            subject={callahan.subject}
            body={walk.drafts.callahan ?? callahan.email}
            onLink={() => go("questionnaire")}
          />
        )}
      </AgencyScope>
    </Stage>
  );
}
