import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AgencyMark, AgencyScope, Stage } from "@/components/Stage";
import { stepsFor } from "@/questionnaire";
import { Question, Thanks } from "@/screens/questions";
import type { WalkProps } from "@/walk";

/**
 * Leah's questionnaire, Harbor Point's and not Upline's. Carried over from
 * v2 on purpose: in the pilot everyone who saw the first question finished,
 * so it stays a questionnaire. One question to a screen. The life question
 * only shows when Jenna left it on in Monday's review. What it asks is
 * questions.tsx's, which the preview from the Pruitts' renewal email shows
 * too (QuestionnairePreview.tsx).
 */
export function Questionnaire({ walk, update, go }: WalkProps) {
  const steps = stepsFor(walk.lifeQuote.pruitt ?? true);
  const [i, setI] = useState(walk.danaAnswered ? steps.length : 0);
  const done = i >= steps.length;
  const step = steps[i];

  const next = () => {
    if (i === steps.length - 1) update({ danaAnswered: true });
    setI(i + 1);
  };

  return (
    <Stage caption="Leah's phone · Tuesday, October 13, 7:40 PM" size="phone">
      <AgencyScope>
        <header className="flex items-center justify-between border-b px-5 py-4">
          <AgencyMark />
          <span className="text-sm text-muted-foreground">Renewal review</span>
        </header>

        {done ? (
          <div className="flex flex-1 flex-col justify-center px-6">
            <Thanks />
            <Button variant="link" className="mt-8 h-auto self-start p-0 font-sans text-sm" onClick={() => go("card-wednesday")}>
              Meanwhile, back at Harbor Point
            </Button>
          </div>
        ) : (
          <>
            <div className="px-5 pt-5">
              <p className="text-sm text-muted-foreground">
                Question {i + 1} of {steps.length}
              </p>
              <Progress value={((i + 1) / steps.length) * 100} className="mt-2" aria-label="Progress" />
            </div>

            <div className="flex-1 overflow-y-auto px-5 pt-7 pb-6">
              <Question key={step} step={step} life={walk.danaLife} onLife={(yes) => update({ danaLife: yes })} />
            </div>

            <footer className="flex items-center gap-3 border-t px-5 py-4">
              {i > 0 && (
                <Button variant="ghost" onClick={() => setI(i - 1)}>
                  Back
                </Button>
              )}
              <Button size="lg" className="flex-1" onClick={next}>
                {step === "referral" ? "Finish" : "Continue"}
              </Button>
            </footer>
          </>
        )}
      </AgencyScope>
    </Stage>
  );
}
