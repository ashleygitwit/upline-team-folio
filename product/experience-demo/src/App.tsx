import { useCallback, useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import LoginScene from "./scenes/LoginScene";
import QueueScene from "./scenes/QueueScene";
import OutreachInboxScene from "./scenes/OutreachInboxScene";
import QuestionnaireScene from "./scenes/QuestionnaireScene";
import RecInboxScene from "./scenes/RecInboxScene";
import ProposalScene from "./scenes/ProposalScene";

export type SceneProps = { onNext: () => void; onBack: () => void };

type SceneDef = {
  label: string;
  short: string;
  Comp: (p: SceneProps) => JSX.Element;
  phone?: boolean;
  kanban?: boolean;
};

const SCENES: SceneDef[] = [
  { label: "Sign in", short: "Sign in", Comp: LoginScene },
  { label: "Renewal queue", short: "Queue", Comp: (p) => <QueueScene {...p} phase="outreach" />, kanban: true },
  { label: "Insured inbox", short: "Inbox", Comp: OutreachInboxScene, phone: true },
  { label: "Questionnaire", short: "Form", Comp: QuestionnaireScene },
  { label: "Shopping", short: "Shopping", Comp: (p) => <QueueScene {...p} phase="shopping" />, kanban: true },
  { label: "Rec email", short: "Rec mail", Comp: RecInboxScene, phone: true },
  { label: "Proposal", short: "Proposal", Comp: ProposalScene },
  { label: "Closing", short: "Closing", Comp: (p) => <QueueScene {...p} phase="binding" />, kanban: true },
];

export default function App() {
  const [i, setI] = useState(0);
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  const [jumpOpen, setJumpOpen] = useState(false);
  const jumpRef = useRef<HTMLDivElement>(null);
  const last = SCENES.length - 1;
  const scene = SCENES[i];
  const mobile = view === "mobile" && !!scene.kanban;

  const goto = useCallback((n: number) => {
    setI(Math.max(0, Math.min(last, n)));
    setJumpOpen(false);
    window.scrollTo({ top: 0 });
  }, [last]);

  const next = useCallback(() => goto(i + 1), [goto, i]);
  const back = useCallback(() => goto(i - 1), [goto, i]);

  useEffect(() => {
    if (!jumpOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (jumpRef.current && !jumpRef.current.contains(e.target as Node)) setJumpOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [jumpOpen]);

  const Scene = scene.Comp;

  return (
    <div className={`app${mobile ? " is-mobile" : ""}`}>
      <header className="demo-chrome">
        <div className="demo-jump" ref={jumpRef}>
          <button
            type="button"
            className={`demo-jump-btn${jumpOpen ? " is-open" : ""}`}
            aria-haspopup="listbox"
            aria-expanded={jumpOpen}
            onClick={() => setJumpOpen((v) => !v)}
          >
            Jump to
            <span className="demo-jump-chevron" aria-hidden />
          </button>
          {jumpOpen && (
            <ul className="demo-menu" role="listbox" aria-label="Jump to a screen">
              {SCENES.map((s, n) => (
                <li key={s.short + n}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={n === i}
                    className={n === i ? "is-on" : ""}
                    onClick={() => goto(n)}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="demo-now">{scene.label}</span>
        {scene.kanban && (
          <div className="demo-view" role="radiogroup" aria-label="Viewport">
            <button
              type="button"
              role="radio"
              aria-checked={view === "desktop"}
              className={view === "desktop" ? "is-on" : ""}
              onClick={() => setView("desktop")}
            >
              Desktop
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={view === "mobile"}
              className={view === "mobile" ? "is-on" : ""}
              onClick={() => setView("mobile")}
            >
              Mobile
            </button>
          </div>
        )}
      </header>

      <main className="stage">
        {mobile ? (
          <div className="device-frame">
            <div className="device-screen">
              <div className="stage-inner fade-in" key={i}>
                <Scene onNext={next} onBack={back} />
              </div>
            </div>
          </div>
        ) : (
          <div className="stage-inner fade-in" key={i}>
            <Scene onNext={next} onBack={back} />
          </div>
        )}
      </main>
    </div>
  );
}
