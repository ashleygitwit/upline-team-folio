import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { changeChoices, pruitt } from "@/data";
import type { Step } from "@/questionnaire";

/** Each question's title and the line under it. */
const asked: Record<Step, { title: string; help: string }> = {
  contact: {
    title: "Is this still the best way to reach you?",
    help: "We filled this in from your current policies. Fix anything that's out of date.",
  },
  changed: {
    title: "Anything new we should know before we shop?",
    help: "We already have Maya from August. Tap anything else that applies.",
  },
  license: {
    title: "What's Maya's driver's license number?",
    help: "We need it to pull driving records when we quote. Her occupation helps too, because carriers use it to set price.",
  },
  life: {
    title: "Want a life insurance quote while we shop the rest?",
    help: "No obligation. We'll just come back with a number.",
  },
  referral: {
    title: "Anyone else who should hear from us?",
    help: "A neighbor, a coworker, or family who'd want the same look at their renewal. Totally optional.",
  },
};

/**
 * One of Leah's questions: its title, the line under it and its fields, the
 * same on her phone and in the preview. `life` is her answer to the life
 * question, and `onLife` changes it. `readOnly`, for the preview, shows the
 * fields as Leah first sees them and holds them there: the text fields can't
 * be typed in, and the boxes and buttons don't change.
 */
export function Question({
  step,
  life,
  onLife,
  readOnly = false,
}: {
  step: Step;
  life: boolean;
  onLife?: (yes: boolean) => void;
  readOnly?: boolean;
}) {
  const { title, help } = asked[step];
  return (
    <fieldset>
      <legend className="font-display text-2xl">{title}</legend>
      <p className="mt-3 text-base text-muted-foreground">{help}</p>
      <div className="mt-6">
        {step === "contact" && (
          <FieldGroup className="gap-4">
            <TextField id="q-name" label="Name" defaultValue="Leah Pruitt" readOnly={readOnly} />
            <TextField id="q-email" label="Email" defaultValue="leah.pruitt@gmail.com" readOnly={readOnly} />
            <TextField id="q-phone" label="Phone" defaultValue={pruitt.phone} readOnly={readOnly} />
            <TextField id="q-address" label="Address" defaultValue={pruitt.address} readOnly={readOnly} />
          </FieldGroup>
        )}

        {step === "changed" && (
          <FieldGroup className="gap-3">
            {changeChoices.map((c) => (
              <FieldLabel key={c.id} htmlFor={`q-${c.id}`}>
                <Field orientation="horizontal">
                  <Checkbox
                    id={`q-${c.id}`}
                    defaultChecked={c.checked}
                    checked={readOnly ? !!c.checked : undefined}
                    aria-readonly={readOnly || undefined}
                  />
                  <FieldContent>
                    <FieldTitle className="font-normal">{c.label}</FieldTitle>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </FieldGroup>
        )}

        {step === "license" && (
          <FieldGroup className="gap-4">
            <TextField id="q-dl" label="Maya's license number" placeholder="OH license number" readOnly={readOnly} />
            <TextField id="q-job" label="Maya's occupation" placeholder="Student, for example" readOnly={readOnly} />
          </FieldGroup>
        )}

        {step === "life" && (
          <RadioGroup
            value={life ? "yes" : "no"}
            onValueChange={onLife && ((v) => onLife(v === "yes"))}
            aria-readonly={readOnly || undefined}
            className="gap-3"
          >
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
        )}

        {step === "referral" && (
          <FieldGroup className="gap-4">
            <TextField id="q-ref-name" label="Their name" readOnly={readOnly} />
            <TextField id="q-ref-contact" label="Their email or phone" readOnly={readOnly} />
          </FieldGroup>
        )}
      </div>
    </fieldset>
  );
}

/** What Leah sees once she's finished: a check, her thanks, and when to expect Jenna. */
export function Thanks({ heading: Heading = "h1" }: { heading?: "h1" | "h2" }) {
  return (
    <>
      <span aria-hidden className="grid size-12 place-items-center bg-primary text-primary-foreground">
        <Check className="size-6" />
      </span>
      <Heading className="mt-6 text-2xl">Thanks, Leah.</Heading>
      <p className="mt-3 text-base">
        That's everything Jenna needs to shop your home and auto. Expect to hear back by Thursday.
      </p>
    </>
  );
}

function TextField({
  id,
  label,
  defaultValue,
  placeholder,
  readOnly,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} defaultValue={defaultValue} placeholder={placeholder} readOnly={readOnly} />
    </Field>
  );
}
