import logo from "@/assets/upline-logo.svg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { agency } from "@/data";

/**
 * The product's own bar. Deliberately bare: no tabs. The mark takes Stacey
 * back to the homepage; everything else starts from there or from the dock.
 */
export function AppBar({ onHome }: { onHome: () => void }) {
  return (
    <header className="border-b bg-card">
      <div className="shell flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={onHome} aria-label="Upline, back to the homepage">
            <img src={logo} alt="" className="h-6 w-auto" />
          </button>
          <span aria-hidden className="h-5 w-px bg-border" />
          <span className="text-sm text-muted-foreground">{agency.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">{agency.agent.name}</span>
          <Avatar>
            <AvatarFallback className="bg-muted text-foreground">{agency.agent.initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
