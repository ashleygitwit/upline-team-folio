import { Fragment } from 'react';
import { JourneySnapshot } from '../components/JourneySnapshot';
import {
  SPRINT_DAYS,
  type SprintDay,
  type SprintExercise,
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

function SlideCard({ block }: { block: SprintExercise }) {
  return (
    <section className="card phase-card sprint-slide">
      <p className="sub-label">{[block.time, block.who].filter(Boolean).join(' · ')}</p>
      <h3 className="sprint-slide-title">{block.name}</h3>
      {block.snapshot ? <JourneySnapshot /> : null}
      {block.steps.length > 0 ? (
        <ul className="sprint-slide-list">
          {block.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
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

function Half({ label, half }: { label: string; half: SprintHalf }) {
  return (
    <>
      <h2 className="sprint-half-label">{label}</h2>
      {groupExercises(half.exercises).map((group) => {
        if (group.kind === 'single') {
          return <SlideCard key={group.exercise.name} block={group.exercise} />;
        }
        return (
          <div
            key={`${group.product[0]?.name}-${group.gtm[0]?.name}`}
            className="sprint-lanes"
          >
            <p className="sprint-lane-label">Product</p>
            <p className="sprint-lane-label">Go-to-market</p>
            {Array.from(
              { length: Math.max(group.product.length, group.gtm.length) },
              (_, i) => (
                <Fragment key={group.product[i]?.name ?? group.gtm[i]?.name}>
                  {group.product[i] ? (
                    <SlideCard block={group.product[i]} />
                  ) : (
                    <div />
                  )}
                  {group.gtm[i] ? <SlideCard block={group.gtm[i]} /> : <div />}
                  {i < Math.max(group.product.length, group.gtm.length) - 1 ? (
                    <>
                      {group.product[i + 1] ? (
                        <span className="sprint-lane-arrow" aria-hidden="true" />
                      ) : (
                        <div />
                      )}
                      {group.gtm[i + 1] ? (
                        <span className="sprint-lane-arrow" aria-hidden="true" />
                      ) : (
                        <div />
                      )}
                    </>
                  ) : null}
                </Fragment>
              ),
            )}
          </div>
        );
      })}
    </>
  );
}

export function SprintDayPage({ day }: { day: SprintDay }) {
  const idx = SPRINT_DAYS.findIndex((d) => d.id === day.id);
  const prev = idx > 0 ? SPRINT_DAYS[idx - 1] : null;
  const next = idx < SPRINT_DAYS.length - 1 ? SPRINT_DAYS[idx + 1] : null;

  return (
    <>
      <a className="page-back" href="#/sprint">
        &larr; Back to strategy sprint
      </a>

      <section className="hero">
        <p className="eyebrow">
          Strategy sprint · {day.when} {day.date}
        </p>
        <h1 className="hero-title">{day.when}.</h1>
        <p className="hero-sub">{day.theme}</p>
      </section>

      <section className="card phase-card sprint-slide">
        <h2>Objective</h2>
        <p className="proof-statement">{day.objective}</p>

        <h3 className="sub-label">Agenda</h3>
        <table className="sprint-agenda">
          <tbody>
            {day.agenda.map((row) => (
              <tr key={`${row.time}-${row.what}`}>
                <td>{row.time}</td>
                <td>{row.who}</td>
                <td>{row.what}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="sub-label">Leave with</h3>
        <ul className="sprint-slide-list">
          {day.leaveWith.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <Half label="Morning" half={day.morning} />
      <Half label="Afternoon" half={day.afternoon} />

      <nav className="sprint-day-nav" aria-label="Sprint days">
        {prev ? <a href={prev.href}>&larr; {prev.when}</a> : <span />}
        {next ? <a href={next.href}>{next.when} &rarr;</a> : <span />}
      </nav>
    </>
  );
}
