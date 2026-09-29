import { useState } from "react";
import { ArrowRight, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { agency, dana, questionnaireIntro, questions } from "@/data";
import type { ScreenProps } from "@/App";

/**
 * Dana's questionnaire, Stockton Hill's and not Upline's: a note from Stacey,
 * then one question to a screen, then thanks. Finishing it is the yes to shop.
 */
export function Questionnaire({ onNext }: ScreenProps) {
  const [step, setStep] = useState(-1);
  const [license, setLicense] = useState("");
  const [changed, setChanged] = useState<string[]>(["sophie"]);
  const [life, setLife] = useState("yes");
  const [amount, setAmount] = useState("500000");
  const [referral, setReferral] = useState("");
  const n = questions.length;
  const pct = step < 0 ? 0 : Math.min(100, Math.round(((step + 1) / (n + 1)) * 100));
  const q = step >= 0 && step < n ? questions[step] : null;

  const toggle = (id: string) =>
    setChanged((all) => {
      if (id === "none") return ["none"];
      const rest = all.filter((x) => x !== "none");
      return rest.includes(id) ? rest.filter((x) => x !== id) : [...rest, id];
    });

  return (
    <div className="agency flex min-h-[calc(100svh-var(--demo-bar-h))] flex-col bg-agency-bg">
      <header className="flex items-center gap-3 border-b bg-card px-6.5 py-4">
        <strong className="font-display text-base font-medium">{agency.name}</strong>
        <span className="text-sm text-muted-foreground">· Coverage review</span>
        <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden />
          Secure · {agency.questionnaireHost}
        </span>
      </header>
      <Progress value={pct} aria-label="Progress" className="h-1" />

      <main className="flex flex-1 justify-center px-6.5 py-12">
        {step === -1 && (
          <div className="w-full max-w-[560px] text-center animate-in duration-200 slide-in-from-bottom-1">
            <p className="eyebrow text-primary">A note from {agency.agent.name}</p>
            <h1 className="mt-3.5 text-2xl">{questionnaireIntro.headline}</h1>
            <p className="mx-auto mt-4 max-w-[42ch] text-base text-muted-foreground">{questionnaireIntro.sub}</p>
            <div className="mt-7.5 flex justify-center">
              <Button size="lg" onClick={() => setStep(0)}>
                Get started
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        )}

        {q && (
          <div key={q.id} className="w-full max-w-[560px] animate-in duration-200 slide-in-from-bottom-1">
            <p className="eyebrow text-primary">{q.section}</p>
            <h1 className="mt-2.5 text-2xl">{q.prompt}</h1>
            {q.help && <p className="mt-3 text-base text-muted-foreground">{q.help}</p>}

            {q.kind === "confirm" && (
              <dl className="mt-5 border bg-card">
                {[
                  ["Name", dana.name],
                  ["Email", dana.email],
                  ["Mobile", dana.phone],
                  ["Address", dana.address],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center gap-3 border-t px-4 py-3 first:border-t-0">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="ml-auto text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {q.kind === "multi" && (
              <div className="mt-5.5 grid gap-2.5">
                {q.choices?.map((c) => (
                  <FieldLabel key={c.id} htmlFor={`changed-${c.id}`} className="bg-card">
                    <Field orientation="horizontal" className="p-4!">
                      <Checkbox id={`changed-${c.id}`} checked={changed.includes(c.id)} onCheckedChange={() => toggle(c.id)} />
                      <span className="text-base font-normal">{c.label}</span>
                    </Field>
                  </FieldLabel>
                ))}
              </div>
            )}

            {q.kind === "text" && (
              <Input
                className="mt-5.5 h-12 px-3.5"
                aria-label={q.prompt}
                placeholder={q.placeholder}
                value={license}
                onChange={(e) => setLicense(e.target.value)}
              />
            )}

            {q.kind === "life" && (
              <div className="mt-5.5">
                <RadioGroup value={life} onValueChange={setLife} className="gap-2.5">
                  {q.choices?.map((c) => (
                    <FieldLabel key={c.id} htmlFor={`life-${c.id}`} className="bg-card">
                      <Field orientation="horizontal" className="p-4!">
                        <RadioGroupItem value={c.id} id={`life-${c.id}`} />
                        <span className="text-base font-normal">{c.label}</span>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {life === "yes" && (
                  <Field className="mt-4 gap-1.5">
                    <FieldLabel htmlFor="life-amount">About how much coverage?</FieldLabel>
                    <Select value={amount} onValueChange={setAmount}>
                      <SelectTrigger id="life-amount" className="w-full px-3.5 data-[size=default]:h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="250000">$250,000</SelectItem>
                        <SelectItem value="500000">$500,000</SelectItem>
                        <SelectItem value="1000000">$1,000,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </div>
            )}

            {q.kind === "referral" && (
              <div className="mt-5.5">
                <Input
                  className="h-12 px-3.5"
                  aria-label={q.prompt}
                  placeholder="Name, and how you know them"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                />
                <p className="mt-3 text-base text-muted-foreground">
                  You can skip this. Asking here is the whole feature for November.
                </p>
              </div>
            )}

            <div className="mt-7.5 flex items-center gap-3">
              <Button variant="secondary" size="lg" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
              <Button size="lg" onClick={() => setStep((s) => s + 1)}>
                {step === n - 1 ? "Submit" : "Continue"}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        )}

        {step >= n && (
          <div className="w-full max-w-[460px] pt-10 text-center animate-in duration-200 slide-in-from-bottom-1">
            <span aria-hidden className="mx-auto mb-5 grid size-16 place-items-center bg-agency-soft text-primary">
              <Check className="size-7" />
            </span>
            <h1 className="text-2xl">Got it. We'll take it from here.</h1>
            <p className="mt-3 text-base text-muted-foreground">
              {agency.agent.first} will be in touch once we've looked at your markets. Completing this was the yes to
              shop. Nothing else to click.
            </p>
            <div className="mt-7.5 flex justify-center">
              <Button size="lg" onClick={onNext}>
                Back to the week
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
