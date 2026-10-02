import { useEffect, useMemo, useState } from 'react';
import {
  ACTORS,
  LAYERS,
  PHASES,
  STEPS,
  type Cell,
  type JourneyStep,
  type LayerKey,
} from '../data/mvpJourney';

function LayerBody({ cell, layer }: { cell: Cell; layer: LayerKey }) {
  if (layer === 'experience') {
    return <p className="ljm-copy">{cell.experience}</p>;
  }
  if (layer === 'data') {
    if (!cell.data.length) return <p className="ljm-copy is-muted">Nothing written here.</p>;
    return (
      <ul className="ljm-list">
        {cell.data.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    );
  }
  if (layer === 'logic') {
    if (!cell.logic.length) return <p className="ljm-copy is-muted">No rules in this step.</p>;
    return (
      <ul className="ljm-list">
        {cell.logic.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    );
  }
  if (!cell.build.length) return <p className="ljm-copy is-muted">Nothing to build in this step.</p>;
  return (
    <ul className="ljm-list">
      {cell.build.map((f) => (
        <li key={f}>{f}</li>
      ))}
    </ul>
  );
}

function CardInner({ cell, layers }: { cell: Cell; layers: LayerKey[] }) {
  return (
    <>
      <h4 className="ljm-card-title">{cell.title}</h4>
      {cell.note ? <p className="ljm-note">{cell.note}</p> : null}
      {layers.map((layer) => (
        <div key={layer} className="ljm-layer-block">
          {layers.length > 1 ? <p className="ljm-layer-kicker">{LAYERS.find((l) => l.key === layer)?.label}</p> : null}
          <LayerBody cell={cell} layer={layer} />
        </div>
      ))}
    </>
  );
}

export function LayeredJourneyMap() {
  const [on, setOn] = useState<LayerKey[]>(['experience']);
  const [selected, setSelected] = useState<string | null>(null);

  const layers = on.length ? on : (['experience'] as LayerKey[]);
  const step = STEPS.find((s) => s.id === selected) ?? null;

  const phaseSpans = useMemo(() => {
    const spans: { key: JourneyStep['phase']; start: number; span: number }[] = [];
    STEPS.forEach((s, i) => {
      const last = spans[spans.length - 1];
      if (last && last.key === s.phase) last.span += 1;
      else spans.push({ key: s.phase, start: i, span: 1 });
    });
    return spans;
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.querySelector('.ljm-detail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const i = STEPS.findIndex((s) => s.id === selected);
      const next = e.key === 'ArrowRight' ? STEPS[i + 1] : STEPS[i - 1];
      if (next) setSelected(next.id);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  function toggle(key: LayerKey) {
    setOn((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const cols = STEPS.length + 1;

  return (
    <div className="ljm">
      <div className="ljm-toolbar">
        <div className="ljm-layers" role="group" aria-label="Layers">
          {LAYERS.map((layer) => {
            const active = layers.includes(layer.key);
            return (
              <button
                key={layer.key}
                type="button"
                className={active ? 'ljm-chip is-on' : 'ljm-chip'}
                aria-pressed={active}
                onClick={() => toggle(layer.key)}
              >
                <span>{layer.label}</span>
                <small>{layer.hint}</small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="ljm-scroll">
        <div
          className="ljm-grid"
          style={{ gridTemplateColumns: `7.5rem repeat(${STEPS.length}, minmax(13.5rem, 1fr))` }}
        >
          <div className="ljm-corner" style={{ gridColumn: 1, gridRow: 1 }} />
          {phaseSpans.map((p) => (
            <div
              key={p.key}
              className={`ljm-phase is-${p.key}`}
              style={{ gridColumn: `${p.start + 2} / span ${p.span}`, gridRow: 1 }}
            >
              {PHASES.find((x) => x.key === p.key)?.label}
            </div>
          ))}

          <div className="ljm-lane-head" style={{ gridColumn: 1, gridRow: 2 }} />
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={selected === s.id ? 'ljm-colhead is-selected' : 'ljm-colhead'}
              style={{ gridColumn: i + 2, gridRow: 2 }}
              onClick={() => setSelected(s.id === selected ? null : s.id)}
              aria-pressed={selected === s.id}
            >
              <span className="ljm-n">{s.n}</span>
              <span className="ljm-colname">{s.name}</span>
            </button>
          ))}

          {ACTORS.flatMap((actor, r) => {
            const row = [3, 4, 6, 8][r];
            const items = [
              <div key={`lane-${actor.key}`} className={`ljm-lane is-${actor.key}`} style={{ gridColumn: 1, gridRow: row }}>
                <span>{actor.label}</span>
                <small>{actor.blurb}</small>
              </div>,
              ...STEPS.map((s, i) => {
                const cell = s.lane === actor.key ? s.cell : null;
                const isSel = selected === s.id;
                if (!cell) {
                  return (
                    <div
                      key={`${s.id}-${actor.key}`}
                      className={isSel ? 'ljm-empty is-selected' : 'ljm-empty'}
                      style={{ gridColumn: i + 2, gridRow: row }}
                      onClick={() => setSelected(s.id === selected ? null : s.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelected(s.id === selected ? null : s.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    />
                  );
                }
                return (
                  <button
                    key={`${s.id}-${actor.key}`}
                    type="button"
                    className={isSel ? `ljm-card is-${actor.key} is-selected` : `ljm-card is-${actor.key}`}
                    style={{ gridColumn: i + 2, gridRow: row }}
                    onClick={() => setSelected(s.id === selected ? null : s.id)}
                  >
                    <CardInner cell={cell} layers={layers} />
                  </button>
                );
              }),
            ];
            if (r === 1) {
              items.push(
                <div key="rule-vis" className="ljm-rule is-vis" style={{ gridColumn: `1 / span ${cols}`, gridRow: 5 }}>
                  <span>Line of visibility</span>
                </div>,
              );
            }
            if (r === 2) {
              items.push(
                <div key="rule-int" className="ljm-rule is-int" style={{ gridColumn: `1 / span ${cols}`, gridRow: 7 }}>
                  <span>Line of interaction</span>
                </div>,
              );
            }
            return items;
          })}
        </div>
      </div>

      {step ? <StepDetail step={step} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}

function StepDetail({ step, onClose }: { step: JourneyStep; onClose: () => void }) {
  const actor = ACTORS.find((a) => a.key === step.lane);
  const cell = step.cell;
  return (
    <section className="ljm-detail" aria-label={`${step.name} detail`}>
      <div className="ljm-detail-head">
        <div>
          <p className="ljm-detail-kicker">
            Step {step.n} · {PHASES.find((p) => p.key === step.phase)?.label} · {actor?.label}
          </p>
          <h3>{step.name}</h3>
        </div>
        <button type="button" className="ljm-close" onClick={onClose}>
          Close
        </button>
      </div>
      <article className={`ljm-detail-col is-${step.lane} is-solo`}>
        <h4>{actor?.label}</h4>
        <p className="ljm-detail-title">{cell.title}</p>
        {cell.note ? <p className="ljm-note">{cell.note}</p> : null}
        {cell.question ? <p className="ljm-change">{cell.question}</p> : null}
        {LAYERS.map((layer) => (
          <div key={layer.key} className="ljm-detail-layer">
            <p className="ljm-layer-kicker">{layer.label}</p>
            <LayerBody cell={cell} layer={layer.key} />
          </div>
        ))}
        <div className="ljm-detail-layer ljm-detail-build">
          <p className="ljm-layer-kicker">Functionality</p>
          <LayerBody cell={cell} layer="build" />
        </div>
      </article>
    </section>
  );
}
