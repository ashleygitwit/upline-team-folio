/**
 * A blinking blue dot in a card's top right corner, for the demo only. Not
 * part of the product: on each day's first homepage it points the presenter
 * at the Pruitts' card or row, and it goes once their drawer opens there or
 * the walk moves on (`cues` in walk.ts, App.tsx). It lets clicks through to
 * the card, so clicking it opens the drawer, and screen readers skip it. The
 * capture script hides it, since it isn't up for feedback.
 */
export function DemoCue() {
  return (
    <span
      data-demo-cue
      aria-hidden
      className="pointer-events-none absolute top-2 right-2 z-20 size-2.5 rounded-full bg-primary animate-[demo-cue-blink_1.2s_ease-in-out_infinite]"
    />
  );
}
