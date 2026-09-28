import { useEffect, useId, useState, type ComponentType, type ReactNode } from "react";
import {
  Activity,
  AudioLines,
  BookOpen,
  Calculator,
  Calendar,
  Camera,
  Clock,
  CloudSun,
  Compass,
  ContactRound,
  Flower,
  Folder,
  Heart,
  House,
  ListTodo,
  Map as MapIcon,
  MessageCircle,
  Music,
  NotebookPen,
  Phone,
  Podcast,
  Search,
  Settings,
  Wallet,
} from "lucide-react";

/**
 * An iPhone 18 Pro, drawn at its own size in points: a 402 × 874 screen (2622 ×
 * 1206 at 3x), 16 of frame and bezel around it, and the smaller Dynamic Island,
 * about 82 wide, a third narrower than the 17 Pro's. It's a drawing, not
 * Apple's artwork. Everything inside is Apple's look, not Upline's; the colors
 * and the system font are scoped to `.iphone` in index.css.
 */
const SCREEN = { w: 402, h: 874 };
const EDGE = 16;
const DEVICE = { w: SCREEN.w + EDGE * 2, h: SCREEN.h + EDGE * 2 };

// What sits around the phone on the stage: the presenter bar, the stage's
// padding and its caption. The phone shrinks to fit what's left, down to half
// size, and the stage scrolls below that.
const AROUND = { w: 48, h: 192 };

function fit() {
  return Math.max(
    0.5,
    Math.min(1, (window.innerHeight - AROUND.h) / DEVICE.h, (window.innerWidth - AROUND.w) / DEVICE.w),
  );
}

export function Iphone({ time, label, children }: { time: string; label: string; children: ReactNode }) {
  const [zoom, setZoom] = useState(fit);

  useEffect(() => {
    const onResize = () => setZoom(fit());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <figure aria-label={label} className="iphone relative mx-auto" style={{ zoom, width: DEVICE.w, height: DEVICE.h }}>
      {/* Action button and volume on the left; side button and Camera Control on the right. */}
      <FrameButton side="left" top={176} h={32} />
      <FrameButton side="left" top={236} h={60} />
      <FrameButton side="left" top={308} h={60} />
      <FrameButton side="right" top={260} h={96} />
      <FrameButton side="right" top={568} h={56} />

      <div className="ios-frame absolute inset-0 rounded-[78px] p-[3px]">
        <div className="size-full rounded-[75px] bg-(--ios-bezel) p-[13px]">
          <div className="ios-wallpaper relative size-full overflow-hidden rounded-[62px] text-(--ios-on-glass)">
            <StatusBar time={time} />
            {children}
            <span
              aria-hidden
              className="absolute bottom-[8px] left-1/2 h-[5px] w-[140px] -translate-x-1/2 rounded-full bg-(--ios-on-glass)"
            />
          </div>
        </div>
      </div>
    </figure>
  );
}

function FrameButton({ side, top, h }: { side: "left" | "right"; top: number; h: number }) {
  return (
    <span
      aria-hidden
      className="ios-frame absolute w-[4px] rounded-full"
      style={{ top, height: h, [side]: -3 }}
    />
  );
}

/** The time on the left, the Dynamic Island, and signal, Wi-Fi and battery on the right. */
function StatusBar({ time }: { time: string }) {
  return (
    <div aria-hidden className="absolute inset-x-0 top-[11px] z-10 flex h-[37px] items-center justify-between px-[44px]">
      <span className="w-[54px] text-center text-[17px] font-semibold">{time}</span>
      <span className="absolute top-0 left-1/2 h-[37px] w-[82px] -translate-x-1/2 rounded-full bg-(--ios-bezel)" />
      <span className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M.22 3.72A11 11 0 0 1 15.78 3.72L13.94 5.56A8.4 8.4 0 0 0 2.06 5.56Z" />
          <path d="M2.91 6.41A7.2 7.2 0 0 1 13.09 6.41L11.25 8.25A4.6 4.6 0 0 0 4.75 8.25Z" />
          <path d="M5.74 9.24A3.2 3.2 0 0 1 10.26 9.24L8 11.5Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="currentColor">
          <rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="16" height="9" rx="2.2" />
          <rect x="24.5" y="4.5" width="1.5" height="4" rx=".75" opacity=".4" />
        </svg>
      </span>
    </div>
  );
}

type App = { name: string; Icon: ComponentType<{ className?: string; strokeWidth?: number }>; badge?: number };

const grid: App[] = [
  { name: "Calendar", Icon: Calendar },
  { name: "Photos", Icon: Flower },
  { name: "Camera", Icon: Camera },
  { name: "Clock", Icon: Clock },
  { name: "Weather", Icon: CloudSun },
  { name: "Maps", Icon: MapIcon },
  { name: "Notes", Icon: NotebookPen },
  { name: "Reminders", Icon: ListTodo },
  { name: "Wallet", Icon: Wallet },
  { name: "Health", Icon: Heart },
  { name: "Settings", Icon: Settings },
  { name: "Files", Icon: Folder },
  { name: "Podcasts", Icon: Podcast },
  { name: "Music", Icon: Music },
  { name: "Books", Icon: BookOpen },
  { name: "Calculator", Icon: Calculator },
  { name: "Contacts", Icon: ContactRound },
  { name: "Home", Icon: House },
  { name: "Fitness", Icon: Activity },
  { name: "Voice Memos", Icon: AudioLines },
];

const dock: App[] = [
  { name: "Phone", Icon: Phone },
  { name: "Safari", Icon: Compass },
  { name: "Messages", Icon: MessageCircle },
  { name: "Outlook", Icon: OutlookGlyph, badge: 1 },
];

/**
 * A home screen in iOS's Clear icon style: every icon is frosted glass with a
 * white glyph, so the notification is the one thing on the screen with color.
 * Stacey reads her mail in Outlook, so it's Outlook in the dock.
 * The dock's four columns line up with the grid's.
 */
export function HomeScreen({ day, date }: { day: string; date: number }) {
  return (
    <div aria-hidden>
      <div className="absolute inset-x-[27px] top-[72px] grid grid-cols-4 gap-y-[20px]">
        {grid.map((app) =>
          app.name === "Calendar" ? (
            <Labelled key={app.name} name={app.name}>
              <span className="ios-glass flex size-[62px] flex-col items-center justify-center rounded-[15px] leading-none">
                <span className="text-[11px] font-semibold tracking-wide">{day}</span>
                <span className="mt-[2px] text-[30px] font-light">{date}</span>
              </span>
            </Labelled>
          ) : (
            <Labelled key={app.name} name={app.name}>
              <Icon app={app} />
            </Labelled>
          ),
        )}
      </div>

      <span className="ios-glass absolute bottom-[128px] left-1/2 flex h-[30px] -translate-x-1/2 items-center gap-[5px] rounded-full px-[12px] text-[13px] font-medium">
        <Search className="size-[13px]" strokeWidth={2.25} />
        Search
      </span>

      <div className="ios-glass absolute inset-x-[12px] bottom-[20px] grid h-[92px] grid-cols-4 place-items-center rounded-[50px] px-[15px]">
        {dock.map((app) => (
          <Icon key={app.name} app={app} />
        ))}
      </div>
    </div>
  );
}

function Labelled({ name, children }: { name: string; children: ReactNode }) {
  return (
    <span className="flex flex-col items-center gap-[6px]">
      {children}
      <span className="ios-on-wallpaper text-[12px] leading-[14px]">{name}</span>
    </span>
  );
}

function Icon({ app }: { app: App }) {
  const { Icon: Glyph, badge } = app;
  return (
    <span className="ios-glass relative grid size-[62px] place-items-center rounded-[15px]">
      <Glyph className="size-[30px]" strokeWidth={1.75} />
      {badge ? (
        <span className="absolute -top-[5px] -right-[5px] grid h-[22px] min-w-[22px] place-items-center rounded-full bg-(--ios-badge) px-[6px] text-[15px] font-medium">
          {badge}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Outlook's icon, for the notification: the O tile over an envelope on
 * Outlook's blue. A drawing standing in for Microsoft's artwork.
 */
export function OutlookIcon() {
  return (
    <svg aria-hidden width="38" height="38" viewBox="0 0 38 38" className="ios-outlook-icon shrink-0 rounded-[9px]">
      <rect x="15" y="11" width="17" height="16" rx="2" fill="var(--ios-on-glass)" opacity=".92" />
      <path d="M15.5 12.5 23.5 19l8-6.5" fill="none" stroke="var(--ios-outlook-dark)" strokeWidth="1.3" opacity=".5" />
      <rect x="6" y="12" width="14" height="14" rx="2.5" fill="var(--ios-outlook-tile)" />
      <ellipse cx="13" cy="19" rx="3.1" ry="3.7" fill="none" stroke="var(--ios-on-glass)" strokeWidth="2" />
    </svg>
  );
}

/** The same mark in the Clear style, for the dock: white, with the O and the tile's edge cut out. */
function OutlookGlyph({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 30 30" className={className} fill="none">
      <mask id={`${id}-env`}>
        <rect width="30" height="30" fill="white" />
        <rect x="1.5" y="8.5" width="16" height="16" rx="4" fill="black" />
      </mask>
      <mask id={`${id}-tile`}>
        <rect width="30" height="30" fill="white" />
        <ellipse cx="9.5" cy="16.5" rx="2.6" ry="3.2" stroke="black" strokeWidth="1.8" />
      </mask>
      <g mask={`url(#${id}-env)`} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
        <rect x="9" y="8" width="18" height="15" rx="2.5" />
        <path d="M9.5 10 18 16.5 26.5 10" />
      </g>
      <rect x="3" y="10" width="13" height="13" rx="3" fill="currentColor" mask={`url(#${id}-tile)`} />
    </svg>
  );
}
