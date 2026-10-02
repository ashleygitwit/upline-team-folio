import { Funnel, LayoutGrid, List } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isFiltered, type Filters, type Premium, type When } from "@/filters";
import { phases, type PhaseId } from "@/phases";

export type View = "board" | "list";

/**
 * The homepage's toolbar, between the band and the board: v2.5's Filters on
 * the left, and v3's search by name and Board or List on the right, as the
 * v3 Policyholder List set its row. All three narrow or redraw every column
 * at once; each column's own status menu still narrows that column alone
 * (Board.tsx). The toolbar came off on 2026-10-01 (Needs me and a search,
 * then) and came back the same day as this.
 */
export function Toolbar({
  filters,
  onFilters,
  query,
  onQuery,
  view,
  onView,
}: {
  filters: Filters;
  onFilters: (f: Filters) => void;
  query: string;
  onQuery: (q: string) => void;
  view: View;
  onView: (v: View) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <FiltersMenu filters={filters} onFilters={onFilters} />
      <div className="flex items-center gap-4">
        <Input
          type="search"
          aria-label="Search policyholders by name"
          placeholder="Search by name"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="w-72"
        />
        {/* Board or List, drawn as v3's were and flush, so the pair reads as
            one control. */}
        <div role="group" aria-label="View" className="flex">
          <ViewButton on={view === "board"} onClick={() => onView("board")} label="Board" icon={<LayoutGrid />} />
          <ViewButton on={view === "list"} onClick={() => onView("list")} label="List" icon={<List />} />
        </div>
      </div>
    </div>
  );
}

/**
 * v2.5's Filters: a button that opens a panel of selects, drawn as Board and
 * List are, the outline button, with a blue outline and blue type while
 * anything is set, as the view showing has, so it says the board is
 * narrowed. (It was the quiet gray button until something was set until
 * 2026-10-02.) Renewal date, Stage (the board's columns), Premium, and
 * Closing · needs me, which is Closing's Ready for Review (said yes, waiting
 * on Jenna to bind it). It's the kit's default height here, a size up from
 * v2.5's, so it lines up with the search and the view buttons.
 */
function FiltersMenu({ filters, onFilters }: { filters: Filters; onFilters: (f: Filters) => void }) {
  const on = isFiltered(filters);
  const set = (patch: Partial<Filters>) => onFilters({ ...filters, ...patch });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn(on && "border-primary text-primary hover:text-primary")}>
          <Funnel data-icon="inline-start" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[260px] gap-2.5">
        <Field className="gap-1.5">
          <FieldLabel htmlFor="filter-when">Renewal date</FieldLabel>
          <Select value={filters.when} onValueChange={(v) => set({ when: v as When })}>
            <SelectTrigger id="filter-when" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any renewal date</SelectItem>
              <SelectItem value="today">Renews today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="twoWeeks">Next 2 weeks</SelectItem>
              <SelectItem value="thirty">Next 30 days</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="filter-stage">Stage</FieldLabel>
          <Select value={filters.stage} onValueChange={(v) => set({ stage: v as "all" | PhaseId })}>
            <SelectTrigger id="filter-stage" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {phases.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="filter-premium">Premium</FieldLabel>
          <Select value={filters.premium} onValueChange={(v) => set({ premium: v as Premium })}>
            <SelectTrigger id="filter-premium" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="increase">Increase</SelectItem>
              <SelectItem value="flat">No change</SelectItem>
              <SelectItem value="decrease">Decrease</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field orientation="horizontal" className="mt-1">
          <Checkbox id="filter-needs" checked={filters.needsMe} onCheckedChange={(v) => set({ needsMe: v === true })} />
          <FieldLabel htmlFor="filter-needs">Closing · needs me</FieldLabel>
        </Field>
      </PopoverContent>
    </Popover>
  );
}

function ViewButton({ on, onClick, label, icon }: { on: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <Button
      variant="outline"
      aria-pressed={on}
      onClick={onClick}
      className="-ml-px first:ml-0 aria-pressed:relative aria-pressed:border-primary aria-pressed:text-primary aria-pressed:hover:text-primary"
    >
      {icon}
      {label}
    </Button>
  );
}
