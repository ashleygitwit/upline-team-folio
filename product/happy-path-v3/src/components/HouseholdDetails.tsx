import type { Day, Household } from "@/data";

/**
 * Who and what is on the household: people, vehicles, the home, and how to
 * reach them. Once Dana has answered, Sophie's license is no longer missing.
 */
export function HouseholdDetails({ h, day }: { h: Household; day: Day }) {
  const answered = h.id === "callahan" && day !== "mon";

  return (
    <dl className="grid grid-cols-[8rem_1fr] gap-x-6 gap-y-4 text-sm">
      <dt className="text-muted-foreground">People</dt>
      <dd>
        {h.people.map((p) => {
          const note = answered ? p.note?.replace("license number missing", "license number on file") : p.note;
          return (
            <p key={p.name}>
              {p.name}
              <span className="text-muted-foreground">
                {" "}
                · {p.role}
                {note ? ` · ${note}` : ""}
              </span>
            </p>
          );
        })}
      </dd>
      {h.vehicles.length > 0 && (
        <>
          <dt className="text-muted-foreground">Vehicles</dt>
          <dd>{h.vehicles.join(" · ")}</dd>
        </>
      )}
      {h.home && (
        <>
          <dt className="text-muted-foreground">Home</dt>
          <dd>{h.home.join(" · ")}</dd>
        </>
      )}
      <dt className="text-muted-foreground">Address</dt>
      <dd>{h.address}</dd>
      <dt className="text-muted-foreground">Phone</dt>
      <dd>{h.phone}</dd>
    </dl>
  );
}
