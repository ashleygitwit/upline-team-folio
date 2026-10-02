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
 * back to the homepage, and her name opens her menu: her profile and her
 * account settings. Neither is built yet, so they close the menu and go
 * nowhere. My Policyholder List was
 * between them until 2026-09-30, when the homepage's board replaced it. The
 * bar's contents take the homepage's width, at most 1280, centered, as v3's
 * Policyholder List did, so the mark sits on the same edge as the greeting
 * and the board's first column; the bar's own ground and hairline run the
 * window's width. (They ran the window's width too until 2026-10-01.)
 */
export function AppBar({ onHome }: { onHome: () => void }) {
  return (
    <header className="border-b bg-card">
      <div className="shell flex h-16 max-w-7xl items-center justify-between">
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
              {/* Initials in blue 600 on blue 100, as every avatar in the
                  drawer has them (gray 100 until 2026-10-02). */}
              <Avatar aria-hidden>
                <AvatarFallback className="bg-blue-100 text-primary">{agency.agent.initials}</AvatarFallback>
              </Avatar>
              <ChevronDown aria-hidden className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
