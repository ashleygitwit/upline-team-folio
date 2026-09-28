import type { ComponentType, ReactNode } from "react";
import {
  Archive,
  Ban,
  Bell,
  Calendar,
  ChevronDown,
  CircleCheck,
  Ellipsis,
  FilePen,
  Flag,
  FolderInput,
  Forward,
  Grip,
  Inbox,
  LayoutGrid,
  ListFilter,
  Mail,
  MailOpen,
  Paperclip,
  Reply,
  ReplyAll,
  Search,
  Send,
  Settings,
  Star,
  Trash,
  Users,
} from "lucide-react";
import { cn } from "cn";
import uplineMark from "@/assets/upline-u-square.svg";
import { agency, type InboxMessage } from "@/data";

type Glyph = ComponentType<{ className?: string; strokeWidth?: number }>;

/**
 * Stacey's inbox in Outlook: the web and new desktop app's layout, with the
 * blue header, a ribbon, folders, the message list and the reading pane. It's
 * Microsoft's surface, not Upline's, so its colors and Segoe UI are scoped to
 * `.outlook` in index.css. Only the email itself does anything; the chrome
 * around it is a picture. Narrower windows drop the folders, then the list.
 */
export function OutlookWindow({
  inbox,
  selected,
  sent,
  children,
}: {
  inbox: InboxMessage[];
  selected: InboxMessage & { logo?: boolean };
  sent: string;
  children: ReactNode;
}) {
  return (
    <figure
      aria-label="Stacey's Outlook inbox"
      className="outlook @container flex min-h-0 flex-1 flex-col overflow-hidden rounded-[8px] bg-(--ol-canvas)"
    >
      <Header />
      <div className="flex min-h-0 flex-1">
        <AppRail />
        <div className="flex min-w-0 flex-1 flex-col gap-[8px] py-[8px] pr-[8px]">
          <Ribbon />
          <div className="flex min-h-0 flex-1 gap-[8px]">
            <Folders />
            <MessageList messages={[selected, ...inbox]} selected={selected.id} />
            <section className="min-w-0 flex-1 overflow-y-auto rounded-[8px] bg-(--ol-card)">
              <div className="px-[24px] pt-[16px]">
                <h2 className="font-(family-name:--ol-font) text-[20px] leading-[28px] font-semibold">
                  {selected.subject}
                </h2>
                <div className="mt-[16px] flex items-start gap-[12px]">
                  <Avatar message={selected} size={40} />
                  <div className="min-w-0 flex-1 text-[14px] leading-[20px]">
                    <p className="truncate font-semibold">{selected.from}</p>
                    <p className="truncate text-(--ol-fg-3)">To: {agency.agent.name}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-[4px]">
                    <span aria-hidden className="flex text-(--ol-fg-2)">
                      {[Reply, ReplyAll, Forward, Ellipsis].map((Icon, i) => (
                        <span key={i} className="grid size-[28px] place-items-center">
                          <Icon className="size-[18px]" strokeWidth={1.5} />
                        </span>
                      ))}
                    </span>
                    <span className="text-[12px] leading-[16px] text-(--ol-fg-3)">{sent}</span>
                  </div>
                </div>
              </div>
              <div className="px-[24px] pt-[24px] pb-[32px]">{children}</div>
            </section>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Header() {
  return (
    <div aria-hidden className="flex h-[48px] shrink-0 items-center gap-[12px] bg-(--ol-brand) px-[14px] text-(--ol-on-brand)">
      <span className="flex flex-1 items-center gap-[12px]">
        <Grip className="size-[20px]" strokeWidth={1.75} />
        <span className="text-[16px] font-semibold">Outlook</span>
      </span>
      <span className="flex h-[32px] w-[min(468px,40%)] items-center gap-[8px] rounded-[4px] bg-(--ol-search) px-[10px] text-[14px] text-(--ol-fg-3)">
        <Search className="size-[16px]" strokeWidth={1.75} />
        Search
      </span>
      <span className="flex flex-1 items-center justify-end gap-[16px]">
        <Bell className="size-[20px]" strokeWidth={1.5} />
        <Settings className="size-[20px]" strokeWidth={1.5} />
        <span className="grid size-[32px] place-items-center rounded-full bg-(--ol-avatar-3) text-[12px] font-semibold text-(--ol-avatar-3-fg)">
          {agency.agent.initials}
        </span>
      </span>
    </div>
  );
}

function AppRail() {
  const apps: Glyph[] = [Mail, Calendar, Users, Paperclip, CircleCheck, LayoutGrid];
  return (
    <div aria-hidden className="flex w-[56px] shrink-0 flex-col items-center gap-[4px] py-[8px] text-(--ol-fg-2)">
      {apps.map((Icon, i) => (
        <span
          key={i}
          className={cn(
            "grid size-[40px] place-items-center rounded-[4px]",
            i === 0 && "bg-(--ol-card) text-(--ol-brand)",
          )}
        >
          <Icon className="size-[20px]" strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}

function Ribbon() {
  const actions: [Glyph, string][] = [
    [Trash, "Delete"],
    [Archive, "Archive"],
    [FolderInput, "Move to"],
    [Reply, "Reply"],
    [ReplyAll, "Reply all"],
    [Forward, "Forward"],
    [MailOpen, "Read / Unread"],
    [Flag, "Flag / Unflag"],
  ];
  return (
    <div aria-hidden className="shrink-0 rounded-[8px] bg-(--ol-card) text-[14px]">
      <div className="flex gap-[20px] px-[16px] pt-[6px]">
        {["Home", "View", "Help"].map((tab, i) => (
          <span
            key={tab}
            className={cn(
              "relative py-[6px]",
              i === 0
                ? "font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-(--ol-brand)"
                : "text-(--ol-fg-2)",
            )}
          >
            {tab}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-[4px] overflow-hidden px-[8px] py-[8px] whitespace-nowrap">
        <span className="flex h-[32px] shrink-0 items-center gap-[6px] rounded-[4px] bg-(--ol-brand) px-[12px] font-semibold text-(--ol-on-brand)">
          <Mail className="size-[16px]" strokeWidth={1.75} />
          New mail
        </span>
        <span className="mx-[4px] h-[20px] w-px shrink-0 bg-(--ol-stroke)" />
        {actions.map(([Icon, label]) => (
          <span key={label} className="flex h-[32px] shrink-0 items-center gap-[6px] px-[8px] text-(--ol-fg-1)">
            <Icon className="size-[16px] text-(--ol-fg-2)" strokeWidth={1.5} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Folders() {
  const favorites: [Glyph, string, number?][] = [
    [Inbox, "Inbox", 1],
    [Send, "Sent Items"],
    [FilePen, "Drafts"],
  ];
  const mailbox: [Glyph, string, number?][] = [
    [Inbox, "Inbox", 1],
    [FilePen, "Drafts"],
    [Send, "Sent Items"],
    [Trash, "Deleted Items"],
    [Ban, "Junk Email"],
    [Archive, "Archive"],
  ];
  return (
    <div aria-hidden className="hidden w-[200px] shrink-0 flex-col gap-[2px] overflow-hidden text-[14px] @6xl:flex">
      <FolderHeading>Favorites</FolderHeading>
      {favorites.map(([Icon, name, count], i) => (
        <Folder key={name} Icon={Icon} name={name} count={count} selected={i === 0} />
      ))}
      <FolderHeading className="mt-[12px]">{agency.agent.email}</FolderHeading>
      {mailbox.map(([Icon, name, count]) => (
        <Folder key={name} Icon={Icon} name={name} count={count} />
      ))}
    </div>
  );
}

function FolderHeading({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn("flex h-[32px] items-center gap-[6px] px-[8px] font-semibold", className)}>
      <ChevronDown className="size-[16px] shrink-0" strokeWidth={1.75} />
      <span className="truncate">{children}</span>
    </span>
  );
}

function Folder({ Icon, name, count, selected }: { Icon: Glyph; name: string; count?: number; selected?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-[32px] items-center gap-[8px] rounded-[4px] pr-[8px] pl-[30px]",
        selected && "bg-(--ol-card)",
        count && "font-semibold",
      )}
    >
      <Icon className={cn("size-[16px] shrink-0", selected ? "text-(--ol-brand)" : "text-(--ol-fg-2)")} strokeWidth={1.5} />
      <span className="flex-1 truncate">{name}</span>
      {count ? <span className="text-(--ol-brand)">{count}</span> : null}
    </span>
  );
}

function MessageList({ messages, selected }: { messages: (InboxMessage & { logo?: boolean })[]; selected: string }) {
  const groups = [...new Set(messages.map((m) => m.group))];
  return (
    <div aria-hidden className="hidden w-[340px] shrink-0 flex-col overflow-hidden rounded-[8px] bg-(--ol-card) @5xl:flex">
      <div className="flex items-center justify-between px-[16px] pt-[12px] pb-[4px]">
        <span className="flex items-center gap-[6px] text-[16px] font-semibold">
          Inbox
          <Star className="size-[14px] text-(--ol-fg-3)" strokeWidth={1.5} />
        </span>
        <ListFilter className="size-[16px] text-(--ol-fg-2)" strokeWidth={1.5} />
      </div>
      <div className="flex gap-[20px] border-b border-(--ol-stroke) px-[16px] text-[14px]">
        <span className="relative py-[6px] font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-(--ol-brand)">
          Focused
        </span>
        <span className="py-[6px] text-(--ol-fg-2)">Other</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {groups.map((group) => (
          <div key={group}>
            <p className="px-[16px] pt-[12px] pb-[4px] text-[12px] leading-[16px] font-semibold text-(--ol-fg-2)">{group}</p>
            {messages
              .filter((m) => m.group === group)
              .map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "relative flex gap-[12px] border-b border-(--ol-stroke-2) px-[16px] py-[10px]",
                    m.id === selected && "bg-(--ol-selected)",
                  )}
                >
                  {m.unread && <span className="absolute inset-y-0 left-0 w-[3px] bg-(--ol-brand)" />}
                  <Avatar message={m} size={32} />
                  <div className="min-w-0 flex-1 text-[14px] leading-[20px]">
                    <p className={cn("truncate", m.unread && "font-semibold")}>{m.from}</p>
                    <p className="flex items-baseline justify-between gap-[8px]">
                      <span className={cn("truncate", m.unread && "font-semibold text-(--ol-brand)")}>{m.subject}</span>
                      <span className="shrink-0 text-[12px] text-(--ol-fg-3)">{m.time}</span>
                    </p>
                    <p className="truncate text-(--ol-fg-3)">{m.preview}</p>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The sender's circle: Upline's mark for Upline, initials in one of Outlook's avatar colors for everyone else. */
function Avatar({ message, size }: { message: InboxMessage & { logo?: boolean }; size: number }) {
  if (message.logo) {
    return <img src={uplineMark} alt="" className="shrink-0 rounded-full" style={{ width: size, height: size }} />;
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.375,
        background: `var(--ol-avatar-${message.tone})`,
        color: `var(--ol-avatar-${message.tone}-fg)`,
      }}
    >
      {message.initials}
    </span>
  );
}
