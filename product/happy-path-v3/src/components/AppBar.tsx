import logo from "@/assets/upline-logo.svg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { agency } from "@/data";

/**
 * The product's own bar. Deliberately bare: no tabs, because there is one
 * page. Everything else opens from it and closes back to it.
 */
export function AppBar() {
  return (
    <header className="border-b bg-card">
      <div className="shell flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Upline" className="h-6 w-auto" />
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
