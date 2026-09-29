import { useCallback, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoChrome, type Viewport } from "@/components/DemoChrome";
import { MobileContext } from "@/lib/viewport";
import { SignIn } from "@/screens/SignIn";
import { Queue } from "@/screens/queue/Queue";
import { InsuredInbox, RecEmail } from "@/screens/Phone";
import { Questionnaire } from "@/screens/Questionnaire";
import { Proposal } from "@/screens/Proposal";

export type ScreenProps = { onNext: () => void; onBack: () => void };

/** Ashley's eight stops, in her order and with her names. */
const screens: { label: string; Comp: ComponentType<ScreenProps>; kanban?: boolean }[] = [
  { label: "Sign in", Comp: SignIn },
  { label: "Renewal queue", Comp: (p) => <Queue {...p} phase="outreach" />, kanban: true },
  { label: "Insured inbox", Comp: InsuredInbox },
  { label: "Questionnaire", Comp: Questionnaire },
  { label: "Shopping", Comp: (p) => <Queue {...p} phase="shopping" />, kanban: true },
  { label: "Rec email", Comp: RecEmail },
  { label: "Proposal", Comp: Proposal },
  { label: "Closing", Comp: (p) => <Queue {...p} phase="binding" />, kanban: true },
];

export function App() {
  const [index, setIndex] = useState(0);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const screen = screens[index];
  const mobile = viewport === "mobile" && !!screen.kanban;
  const deviceScreen = useRef<HTMLDivElement>(null);

  const go = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(screens.length - 1, i)));
    window.scrollTo({ top: 0 });
  }, []);

  // While the phone is up, tell the stylesheet where its screen is, so sheets
  // and dialogs open inside it rather than over the whole window.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const el = deviceScreen.current;
    if (!mobile || !el) return;
    const place = () => {
      const r = el.getBoundingClientRect();
      root.style.setProperty("--device-top", `${r.top}px`);
      root.style.setProperty("--device-left", `${r.left}px`);
      root.style.setProperty("--device-width", `${r.width}px`);
      root.style.setProperty("--device-height", `${r.height}px`);
    };
    place();
    root.dataset.viewport = "mobile";
    const ro = new ResizeObserver(place);
    ro.observe(el);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
      delete root.dataset.viewport;
    };
  }, [mobile]);

  const Comp = screen.Comp;
  const page = <Comp onNext={() => go(index + 1)} onBack={() => go(index - 1)} />;

  return (
    <TooltipProvider>
      <MobileContext.Provider value={mobile}>
        <div className={mobile ? "flex h-svh flex-col overflow-hidden bg-dark-bg" : "flex min-h-svh flex-col"}>
          <DemoChrome
            screens={screens}
            index={index}
            onGo={go}
            showViewport={!!screen.kanban}
            viewport={viewport}
            onViewport={setViewport}
          />
          {mobile ? (
            <main className="flex min-h-0 flex-1 justify-center px-4 pt-3.5 pb-4.5">
              <div className="h-full w-[390px] max-w-full rounded-[28px] border border-dark-border bg-black p-2.5">
                <div
                  ref={deviceScreen}
                  className="relative h-full overflow-auto rounded-[20px] bg-background [transform:translateZ(0)]"
                >
                  <div key={index} className="animate-in duration-200 slide-in-from-bottom-1">
                    {page}
                  </div>
                </div>
              </div>
            </main>
          ) : (
            <main key={index} className="flex-1 animate-in duration-200 slide-in-from-bottom-1">
              {page}
            </main>
          )}
        </div>
      </MobileContext.Provider>
    </TooltipProvider>
  );
}
