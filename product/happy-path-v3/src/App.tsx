import { useCallback, useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoBar } from "@/components/DemoBar";
import { MondayEmail } from "@/screens/MondayEmail";
import { Upline } from "@/screens/Upline";
import { DanaInbox } from "@/screens/DanaInbox";
import { Questionnaire } from "@/screens/Questionnaire";
import { DanaPage } from "@/screens/DanaPage";
import { initialWalk, screens, type ScreenId, type Walk } from "@/walk";

export function App() {
  const [index, setIndex] = useState(0);
  const [walk, setWalk] = useState<Walk>(initialWalk);
  const screen = screens[index];

  const go = useCallback((id: ScreenId) => {
    setIndex(screens.findIndex((s) => s.id === id));
  }, []);

  const update = useCallback(
    (patch: Partial<Walk> | ((w: Walk) => Partial<Walk>)) =>
      setWalk((w) => ({ ...w, ...(typeof patch === "function" ? patch(w) : patch) })),
    [],
  );

  // Each stop starts at the top, the way a new page would.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [index]);

  // Arrow keys step through the walk, except while someone is typing, picking
  // a radio, or working inside a sheet or dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable], [role=radio], [role=menu], [role=menuitem]")) return;
      if (document.querySelector("[role=dialog]")) return;
      setIndex((i) => Math.max(0, Math.min(screens.length - 1, i + (e.key === "ArrowRight" ? 1 : -1))));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const props = { walk, update, go };

  return (
    <TooltipProvider>
      <div className="flex min-h-svh flex-col">
        <DemoBar index={index} onGo={setIndex} />
        <main className="flex-1">
          {screen.id === "monday-email" && <MondayEmail {...props} />}
          {screen.id === "monday" && <Upline key="monday" day="mon" {...props} />}
          {screen.id === "review" && <Upline key="review" day="mon" household="callahan" {...props} />}
          {screen.id === "dana-inbox" && <DanaInbox {...props} />}
          {screen.id === "questionnaire" && <Questionnaire {...props} />}
          {screen.id === "wednesday" && <Upline key="wednesday" day="wed" {...props} />}
          {screen.id === "results" && <Upline key="results" day="thu" page="results" {...props} />}
          {screen.id === "dana-page" && <DanaPage {...props} />}
          {screen.id === "friday" && <Upline key="friday" day="fri" {...props} />}
        </main>
      </div>
    </TooltipProvider>
  );
}
