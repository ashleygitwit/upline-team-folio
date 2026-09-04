import { Fragment, useEffect, useState } from 'react';
import { ExerciseIllustration } from '../components/ExerciseIllustration';
import { JourneySnapshot } from '../components/JourneySnapshot';
import {
  SPRINT_DAYS,
  type SprintDay,
  type SprintExercise,
  type SprintExerciseSlide,
  type SprintHalf,
} from '../data/sprintDays';

type LaneGroup =
  | { kind: 'single'; exercise: SprintExercise }
  | { kind: 'split'; product: SprintExercise[]; gtm: SprintExercise[] };

function groupExercises(exercises: SprintExercise[]): LaneGroup[] {
  const groups: LaneGroup[] = [];
  let pending: { product: SprintExercise[]; gtm: SprintExercise[] } | null = null;

  const flush = () => {
    if (!pending) return;
    if (pending.product.length > 0 && pending.gtm.length > 0) {
      groups.push({ kind: 'split', product: pending.product, gtm: pending.gtm });
    } else {
      for (const exercise of [...pending.product, ...pending.gtm]) {
        groups.push({ kind: 'single', exercise });
      }
    }
    pending = null;
  };

  for (const exercise of exercises) {
    if (!exercise.lane) {
      flush();
      groups.push({ kind: 'single', exercise });
      continue;
    }
    pending ??= { product: [], gtm: [] };
    pending[exercise.lane].push(exercise);
  }
  flush();
  return groups;
}

function ExerciseModal({
  slide,
  onClose,
}: {
  slide: SprintExerciseSlide;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="sprint-exercise-modal" role="dialog" aria-modal="true" aria-labelledby="sprint-exercise-title">
      <button type="button" className="sprint-exercise-close" onClick={onClose}>
        Close
      </button>
      <div className="sprint-exercise-slide">
        <ExerciseIllustration
          className="sprint-exercise-art sprint-exercise-art-slide"
          title={slide.title}
        />
        <p className="sub-label">Exercise</p>
        <h2 id="sprint-exercise-title">{slide.title}</h2>
        <ol className="sprint-exercise-steps">
          {slide.steps.map((step, i) => (
            <li key={step}>
              <span className="sprint-exercise-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function SlideCard({
  block,
  onOpenExercise,
}: {
  block: SprintExercise;
  onOpenExercise: (slide: SprintExerciseSlide) => void;
}) {
  return (
    <section className="card phase-card sprint-slide">
      <p className="sub-label">{[block.time, block.room].filter(Boolean).join(' · ')}</p>
      <h3 className="sprint-slide-title">{block.name}</h3>
      {block.snapshot ? <JourneySnapshot /> : null}
      {block.steps.length > 0 ? (
        <ul className="sprint-slide-list">
          {block.steps.map((s) => {
            const text = typeof s === 'string' ? s : s.text;
            const href = typeof s === 'string' ? undefined : s.href;
            const label = typeof s === 'string' ? undefined : s.label;
            return (
              <li key={text}>
                <span className="sprint-slide-step">
                  <span>{text}</span>
                  {href && label ? (
                    <a className="sprint-slide-cta sprint-slide-step-link" href={href}>
                      {label} &rarr;
                    </a>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
      {block.exercise ? (
        <button
          type="button"
          className="sprint-exercise-thumb"
          onClick={() => onOpenExercise(block.exercise!)}
        >
          <ExerciseIllustration
            className="sprint-exercise-art sprint-exercise-art-thumb"
            title={block.exercise.title}
          />
          <span className="sprint-exercise-thumb-body">
            <span className="sprint-exercise-thumb-kicker">Exercise</span>
            <span className="sprint-exercise-thumb-title">{block.exercise.title}</span>
            <span className="sprint-exercise-thumb-hint">Open slide</span>
          </span>
        </button>
      ) : null}
      {block.link ? (
        <a className="sprint-slide-cta" href={block.link.href}>
          {block.link.label} &rarr;
        </a>
      ) : null}
      {block.roles ? (
        <>
          {block.rolesLabel ? (
            <h3 className="sub-label">{block.rolesLabel}</h3>
          ) : null}
          <ul className="sprint-role-list">
            {block.roles.map((r) => (
              <li key={r.who}>
                <b>{r.who}.</b> {r.ask}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

function Half({
  label,
  half,
  onOpenExercise,
}: {
  label: string;
  half: SprintHalf;
  onOpenExercise: (slide: SprintExerciseSlide) => void;
}) {
  return (
    <>
      <h2 className="sprint-half-label">{label}</h2>
      {groupExercises(half.exercises).map((group) => {
        if (group.kind === 'single') {
          return (
            <SlideCard
              key={group.exercise.name}
              block={group.exercise}
              onOpenExercise={onOpenExercise}
            />
          );
        }
        return (
          <Fragment key={`${group.product[0]?.name}-${group.gtm[0]?.name}`}>
            {Array.from(
              { length: Math.max(group.product.length, group.gtm.length) },
              (_, i) => (
                <div
                  key={group.product[i]?.name ?? group.gtm[i]?.name}
                  className="sprint-lanes"
                >
                  <p className="sprint-lane-label">Product</p>
                  <p className="sprint-lane-label">Go-to-market</p>
                  {group.product[i] ? (
                    <SlideCard block={group.product[i]} onOpenExercise={onOpenExercise} />
                  ) : (
                    <div />
                  )}
                  {group.gtm[i] ? (
                    <SlideCard block={group.gtm[i]} onOpenExercise={onOpenExercise} />
                  ) : (
                    <div />
                  )}
                </div>
              ),
            )}
          </Fragment>
        );
      })}
    </>
  );
}

export function SprintDayPage({ day }: { day: SprintDay }) {
  const idx = SPRINT_DAYS.findIndex((d) => d.id === day.id);
  const prev = idx > 0 ? SPRINT_DAYS[idx - 1] : null;
  const next = idx < SPRINT_DAYS.length - 1 ? SPRINT_DAYS[idx + 1] : null;
  const [openSlide, setOpenSlide] = useState<SprintExerciseSlide | null>(null);

  return (
    <>
      <a className="page-back" href="#/sprint">
        &larr; Back to strategy sprint
      </a>

      <section className="hero">
        <p className="eyebrow">
          {day.when} · {day.date}
        </p>
        <h1 className="hero-title">{day.theme}</h1>
        <h2 className="sprint-day-objective">{day.objective}</h2>
      </section>

      <table className="sprint-agenda sprint-day-agenda">
        <thead>
          <tr>
            <th>Time</th>
            <th>Room</th>
            <th>What</th>
          </tr>
        </thead>
        <tbody>
          {day.agenda.map((row) => (
            <tr key={`${row.time}-${row.room}-${row.what}`}>
              <td>{row.time}</td>
              <td>{row.room}</td>
              <td>{row.what}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Half label="Morning" half={day.morning} onOpenExercise={setOpenSlide} />
      <Half label="Afternoon" half={day.afternoon} onOpenExercise={setOpenSlide} />

      <nav className="sprint-day-nav" aria-label="Sprint days">
        {prev ? <a href={prev.href}>&larr; {prev.when}</a> : <span />}
        {next ? <a href={next.href}>{next.when} &rarr;</a> : <span />}
      </nav>

      {openSlide ? <ExerciseModal slide={openSlide} onClose={() => setOpenSlide(null)} /> : null}
    </>
  );
}
