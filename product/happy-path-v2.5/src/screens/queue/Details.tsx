import type { ReactNode } from "react";
import { Car, House, Umbrella } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { money, zillow, type Card as Household, type HouseholdFile } from "@/data";
import { SectionHead } from "@/screens/queue/parts";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

/** Everything on file for a household: who to reach, who's in it, what they drive and what they have with us. */
export function Details({ card, file }: { card: Household; file: HouseholdFile }) {
  return (
    <div className="flex flex-col gap-4">
      <Block title="Contact">
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Named insured</dt>
          <dd className="text-right font-medium">{file.namedInsured}</dd>
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="text-right font-medium">{file.phone}</dd>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="text-right font-medium">{card.email}</dd>
          <dt className="text-muted-foreground">Address</dt>
          <dd className="text-right font-medium">
            {file.address}
            <a
              href={zillow(file.address)}
              target="_blank"
              rel="noreferrer"
              className="block text-xs text-primary underline-offset-4 hover:underline"
            >
              View on Zillow
            </a>
          </dd>
        </dl>
      </Block>

      <Block title="Household">
        {file.people.map((p) => (
          <Row key={p.name}>
            <Avatar size="sm">
              <AvatarFallback className="bg-muted text-foreground">{initials(p.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.role}
                {p.note ? ` · ${p.note}` : ""}
              </p>
            </div>
          </Row>
        ))}
      </Block>

      {file.vehicles.length > 0 && (
        <Block title="Vehicles">
          {file.vehicles.map((v) => (
            <Row key={`${v.year}${v.make}${v.model}`}>
              <Car className="size-4" aria-hidden />
              <p className="font-medium">
                {v.year} {v.make} {v.model}
              </p>
            </Row>
          ))}
        </Block>
      )}

      <Block title="Policies on file">
        {file.policies.map((p) => {
          const Icon = /auto/i.test(p.line) ? Car : /umbrella/i.test(p.line) ? Umbrella : House;
          return (
            <Row key={p.line}>
              <Icon className="size-4 shrink-0" aria-hidden />
              <div>
                <p className="font-medium">{p.line}</p>
                <p className="text-xs text-muted-foreground">
                  {p.carrier} · {p.detail}
                </p>
              </div>
              <p className="ml-auto text-right font-mono text-sm">
                {money(p.current)}
                <span className="block font-sans text-muted-foreground">now</span>
              </p>
            </Row>
          );
        })}
      </Block>

      {file.home && (
        <Block title="The home">
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
            <dt className="text-muted-foreground">Roof</dt>
            <dd className="text-right font-medium">{file.home.roof}</dd>
            <dt className="text-muted-foreground">Trampoline</dt>
            <dd className="text-right font-medium">{file.home.trampoline}</dd>
            <dt className="text-muted-foreground">Dog</dt>
            <dd className="text-right font-medium">{file.home.dog}</dd>
          </dl>
        </Block>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card size="sm">
      <CardContent className="gap-0">
        <SectionHead>{title}</SectionHead>
        {children}
      </CardContent>
    </Card>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2.5 border-t py-2 text-sm first-of-type:mt-2">{children}</div>;
}
