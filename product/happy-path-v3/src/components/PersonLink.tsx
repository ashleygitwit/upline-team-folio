import { cn } from "cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Household } from "@/data";

const link = "text-left font-medium text-primary underline-offset-4 hover:underline";

/**
 * A client's name, which opens their profile. Only the Callahans have one in
 * this round; the other five are drawn as the links they will be and say so
 * when pointed at.
 */
export function PersonLink({
  h,
  onProfile,
  className,
}: {
  h: Pick<Household, "id" | "name">;
  onProfile: () => void;
  className?: string;
}) {
  if (h.id === "callahan") {
    return (
      <button type="button" onClick={onProfile} className={cn(link, className)}>
        {h.name}
      </button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-disabled className={cn(link, className)}>
          {h.name}
        </button>
      </TooltipTrigger>
      <TooltipContent>Only the Callahans have a profile in this prototype.</TooltipContent>
    </Tooltip>
  );
}
