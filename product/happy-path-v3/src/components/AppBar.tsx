import { ChevronDown } from "lucide-react";
import logo from "@/assets/upline-logo.svg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { agency } from "@/data";

/**
 * The product's own bar. Deliberately bare: no tabs. The mark takes Jenna
 * back to the homepage, and her name opens her menu: her profile, the list of
 * everyone renewing, and her account settings. The profile and the settings
 * aren't built yet, so they close the menu and go nowhere, as the row menus'
 * unbuilt items do.
 */
export function AppBar({ onHome, onPolicyholders }: { onHome: () => void; onPolicyholders: () => void }) {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="-mr-2 h-auto gap-3 py-1 pr-2 pl-3 font-sans font-normal">
              {agency.agent.name}
              <Avatar aria-hidden>
                <AvatarFallback className="bg-muted text-foreground">{agency.agent.initials}</AvatarFallback>
              </Avatar>
              <ChevronDown aria-hidden className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={onPolicyholders}>My Policyholder List</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
