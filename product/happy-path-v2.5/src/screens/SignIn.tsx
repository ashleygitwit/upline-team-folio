import logo from "@/assets/upline-logo.svg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { agency } from "@/data";
import type { ScreenProps } from "@/App";

/** Stacey signs in. Filled in already; the button is the only thing to do. */
export function SignIn({ onNext }: ScreenProps) {
  return (
    <div className="grid min-h-[calc(100svh-var(--demo-bar-h))] place-items-center bg-background px-5 py-10">
      <Card className="w-full max-w-[400px] gap-0 px-9 pt-12 pb-10">
        <div>
          <img src={logo} alt="Upline" className="mx-auto h-[52px] w-auto" />
        </div>
        <FieldGroup className="mt-7 gap-4">
          <Field>
            <FieldLabel htmlFor="signin-email">Email</FieldLabel>
            <Input id="signin-email" defaultValue={agency.email} readOnly />
          </Field>
          <Field>
            <FieldLabel htmlFor="signin-password">Password</FieldLabel>
            <Input id="signin-password" type="password" defaultValue="••••••••" readOnly />
          </Field>
        </FieldGroup>
        <Button size="lg" className="mt-5 w-full" onClick={onNext}>
          Log in
        </Button>
      </Card>
    </div>
  );
}
