import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AgencyMark, AgencyScope, Stage } from "@/components/Stage";
import { callahan, changeChoices } from "@/data";
import type { WalkProps } from "@/walk";

type Step = "contact" | "changed" | "license" | "life" | "referral";

/**
 * Dana's questionnaire, Stockton Hill's and not Upline's. Carried over from
 * v2 on purpose: in the pilot everyone who saw the first question finished,
 * so it stays a questionnaire. One question to a screen. The life question
 * only shows when Stacey left it on in Monday's review.
 */
export function Questionnaire({ walk, update, go }: WalkProps) {
  const askLife = walk.lifeQuote.callahan ?? true;
  const steps: Step[] = ["contact", "changed", "license", ...(askLife ? (["life"] as const) : []), "referral"];
  const [i, setI] = useState(walk.danaAnswered ? steps.length : 0);
  const done = i >= steps.length;
  const step = steps[i];

  const next = () => {
    if (i === steps.length - 1) update({ danaAnswered: true });
    setI(i + 1);
  };

  return (
    <Stage caption="Dana's phone · Tuesday, October 13, 7:40 PM" size="phone">
      <AgencyScope>
        <header className="flex items-center justify-between border-b px-5 py-4">
          <AgencyMark />
          <span className="text-sm text-muted-foreground">Renewal review</span>
        </header>

        {done ? (
          <div className="flex flex-1 flex-col justify-center px-6">
            <span aria-hidden className="grid size-12 place-items-center bg-primary text-primary-foreground">
              <Check className="size-6" />
            </span>
            <h1 className="mt-6 text-2xl">Thanks, Dana.</h1>
            <p className="mt-3 text-base">
              Stacey has what she needs. She'll shop your home and auto and come back to you by Thursday.
            </p>
            <Button variant="link" className="mt-8 h-auto self-start p-0 font-sans text-sm" onClick={() => go("wednesday")}>
              Meanwhile, back at Stockton Hill
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
              {step === "contact" && (
                <Question title="Is this still the best way to reach you?" help="We filled this in from your current policies. Fix anything that's out of date.">
                  <FieldGroup className="gap-4">
                    <TextField id="q-name" label="Name" defaultValue="Dana Callahan" />
                    <TextField id="q-email" label="Email" defaultValue="dana.callahan@gmail.com" />
                    <TextField id="q-phone" label="Phone" defaultValue={callahan.phone} />
                    <TextField id="q-address" label="Address" defaultValue={callahan.address} />
                  </FieldGroup>
                </Question>
              )}

              {step === "changed" && (
                <Question
                  title="Anything new we should know before we shop?"
                  help="We already have Sophie from August. Tap anything else that applies."
                >
                  <FieldGroup className="gap-3">
                    {changeChoices.map((c) => (
                      <FieldLabel key={c.id} htmlFor={`q-${c.id}`}>
                        <Field orientation="horizontal">
                          <Checkbox id={`q-${c.id}`} defaultChecked={c.checked} />
                          <FieldContent>
                            <FieldTitle className="font-normal">{c.label}</FieldTitle>
                          </FieldContent>
                        </Field>
                      </FieldLabel>
                    ))}
                  </FieldGroup>
                </Question>
              )}

              {step === "license" && (
                <Question
                  title="What's Sophie's driver's license number?"
                  help="We need it to pull driving records when we quote. Her occupation helps too, because carriers use it to set price."
                >
                  <FieldGroup className="gap-4">
                    <TextField id="q-dl" label="Sophie's license number" placeholder="OH license number" />
                    <TextField id="q-job" label="Sophie's occupation" placeholder="Student, for example" />
                  </FieldGroup>
                </Question>
              )}

              {step === "life" && (
                <Question
                  title="Want a life insurance quote while we shop the rest?"
                  help="No obligation. We'll just come back with a number."
                >
                  <RadioGroup defaultValue="yes" className="gap-3">
                    {[
                      { id: "yes", label: "Yes, get me a number" },
                      { id: "no", label: "No thanks" },
                    ].map((o) => (
                      <FieldLabel key={o.id} htmlFor={`q-life-${o.id}`}>
                        <Field orientation="horizontal">
                          <RadioGroupItem value={o.id} id={`q-life-${o.id}`} />
                          <FieldContent>
                            <FieldTitle className="font-normal">{o.label}</FieldTitle>
                          </FieldContent>
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                </Question>
              )}

              {step === "referral" && (
                <Question
                  title="Anyone else who should hear from us?"
                  help="A neighbor, a coworker, or family who'd want the same look at their renewal. Totally optional."
                >
                  <FieldGroup className="gap-4">
                    <TextField id="q-ref-name" label="Their name" />
                    <TextField id="q-ref-contact" label="Their email or phone" />
                  </FieldGroup>
                </Question>
              )}
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

function Question({ title, help, children }: { title: string; help: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="font-display text-2xl">{title}</legend>
      <p className="mt-3 text-base text-muted-foreground">{help}</p>
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

function TextField({
  id,
  label,
  defaultValue,
  placeholder,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} defaultValue={defaultValue} placeholder={placeholder} />
    </Field>
  );
}
