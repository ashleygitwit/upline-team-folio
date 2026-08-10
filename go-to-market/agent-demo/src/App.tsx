import { useCallback, useEffect, useState } from "react";
import type { JSX } from "react";
import { Icon, UplineMark } from "./components/ui";
import QueueScene from "./scenes/QueueScene";
import Client360Scene from "./scenes/Client360Scene";
import OutreachScene from "./scenes/OutreachScene";
import InboxScene from "./scenes/InboxScene";
import QuestionnaireScene from "./scenes/QuestionnaireScene";
import ResponsesScene from "./scenes/ResponsesScene";
import ShoppingScene from "./scenes/ShoppingScene";
import RecommendationScene from "./scenes/RecommendationScene";
import EndStateScene from "./scenes/EndStateScene";

export type SceneProps = { onNext: () => void; onBack: () => void };

const SCENES: { label: string; short: string; Comp: (p: SceneProps) => JSX.Element }[] = [
  { label: "Renewal queue", short: "Queue", Comp: QueueScene },
  { label: "Client view", short: "Client", Comp: Client360Scene },
  { label: "Outreach & questionnaire", short: "Outreach", Comp: OutreachScene },
  { label: "Corey's inbox", short: "Inbox", Comp: InboxScene },
  { label: "Questionnaire", short: "Form", Comp: QuestionnaireScene },
  { label: "Client (after questionnaire)", short: "Profile", Comp: ResponsesScene },
  { label: "Shopping", short: "Shopping", Comp: ShoppingScene },
  { label: "Recommendation", short: "Recommend", Comp: RecommendationScene },
  { label: "Client (after recommendation)", short: "Updated", Comp: EndStateScene },
];

export default function App() {
  const [i, setI] = useState(0);
  const last = SCENES.length - 1;

  const goto = useCallback((n: number) => {
    setI(Math.max(0, Math.min(last, n)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [last]);

  const next = useCallback(() => goto(i + 1), [goto, i]);
  const back = useCallback(() => goto(i - 1), [goto, i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, back]);

  const Scene = SCENES[i].Comp;

  return (
    <div className="app">
      <main className="stage">
        <div className="stage-inner fade-in" key={i}>
          <Scene onNext={next} onBack={back} />
        </div>
      </main>

      <nav className="stepper">
        <div className="stepper-inner">
          <span className="presenter-tag">
            <UplineMark size={14} /> Upline
          </span>
          <div className="stepper-steps">
            {SCENES.map((s, n) => (
              <button
                key={s.short}
                className={`step-pip ${n === i ? "active" : ""} ${n < i ? "done" : ""}`}
                onClick={() => goto(n)}
                title={s.label}
              >
                <span className="n">{n < i ? "✓" : n + 1}</span>
                {s.short}
              </button>
            ))}
          </div>
          <div className="stepper-nav">
            <button className="btn btn-soft" onClick={back} disabled={i === 0} style={{ opacity: i === 0 ? 0.4 : 1 }}>
              <Icon.arrowLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" onClick={next} disabled={i === last} style={{ opacity: i === last ? 0.4 : 1 }}>
              Next <Icon.arrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
