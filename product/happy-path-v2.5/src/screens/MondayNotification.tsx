import { HomeScreen, Iphone, OutlookIcon } from "@/components/Iphone";
import { Stage } from "@/components/Stage";
import { mondayNote } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * Before Stacey reads the Monday email, it arrives: 8:00 AM on her phone, as
 * Outlook's banner over the home screen. Tapping it opens the email. The preview
 * is cut to the two lines an iOS banner shows (roughly 80 characters), the way
 * iOS cuts it, so the rest of the sentence is still here if the width changes.
 */
export function MondayNotification({ go }: WalkProps) {
  return (
    <Stage caption="Stacey's phone · Monday, October 12, 8:00 AM" size="device">
      <Iphone time="8:00" label="Stacey's iPhone home screen, with an Outlook notification from Upline">
        <HomeScreen day="MON" date={12} />
        <button
          type="button"
          onClick={() => go("monday-email")}
          className="ios-banner ios-banner-in absolute inset-x-[10px] top-[56px] z-20 flex cursor-pointer items-center gap-[10px] rounded-[26px] p-[14px] text-left"
        >
          <OutlookIcon />
          <span className="min-w-0 flex-1 text-[15px] leading-[20px] text-(--ios-label)">
            <span className="flex items-baseline justify-between gap-[8px]">
              <span className="truncate font-semibold">{mondayNote.from}</span>
              <span className="shrink-0 text-[13px] text-(--ios-secondary-label)">now</span>
            </span>
            <span className="block truncate font-semibold">{mondayNote.subject}</span>
            <span className="line-clamp-2">
              {mondayNote.opening} {mondayNote.body}
            </span>
          </span>
        </button>
      </Iphone>
    </Stage>
  );
}
