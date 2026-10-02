import { useEffect } from "react";
import { AgencyMark, AgencyScope, Stage } from "@/components/Stage";
import { stepsFor } from "@/questionnaire";
import { Question, Thanks } from "@/screens/questions";
import { initialWalk } from "@/walk";

/**
 * Leah's questionnaire all on one page, in a tab of its own, from View the
 * Questionnaire under the Pruitts' renewal email (phases.tsx), so Jenna can
 * read what Leah will be asked without leaving the drawer or the walk. Every
 * question in order, numbered as her phone numbers them, then what she sees
 * once she's finished. The life question is there only if Life was on when
 * Jenna opened it. The fields are as Leah first sees them and can't be
 * changed, and nothing in it reaches the walk. It's the prototype's own page
 * at its own address (questionnaire.ts), without the demo bar, on the slate
 * ground of everything outside Upline, as wide as the Monday email.
 */
export function QuestionnairePreview({ askLife }: { askLife: boolean }) {
  const steps = stepsFor(askLife);

  useEffect(() => {
    document.title = "Questionnaire preview · Leah & Tom Pruitt";
  }, []);

  return (
    <div className="[--demo-bar-h:0px]">
      <Stage caption="Preview · Leah's renewal questionnaire" size="email">
        <p className="border-b bg-muted px-8 py-3 text-sm">
          What Leah sees from the link in her renewal email, one question to a screen. Nothing here is saved or sent.
        </p>
        <AgencyScope>
          <header className="flex items-center justify-between border-b px-8 py-4">
            <AgencyMark />
            <span className="text-sm text-muted-foreground">Renewal review</span>
          </header>
          <h1 className="sr-only">Leah's renewal questionnaire</h1>
          {steps.map((step, i) => (
            <section key={step} className="border-b px-8 py-8">
              <p className="mb-4 text-sm text-muted-foreground">
                Question {i + 1} of {steps.length}
              </p>
              <Question step={step} life={initialWalk.danaLife} readOnly />
            </section>
          ))}
          <section className="px-8 pt-8 pb-12">
            <p className="mb-4 text-sm text-muted-foreground">Once she's finished</p>
            <Thanks heading="h2" />
          </section>
        </AgencyScope>
      </Stage>
    </div>
  );
}
