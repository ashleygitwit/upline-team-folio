/**
 * The MVP prototype from the September sprint week, carried over from the
 * Upline Design Hub as its self-contained export (public/prototype.html).
 *
 * It runs in a frame rather than as components here for two reasons: it
 * keeps its step in the URL hash (#queue, #outreach…), which would collide
 * with this site's #/route hashes, and it is built on Tailwind, which this
 * site does not use. Inside the frame it keeps its own stage, heading and
 * previous/next links, and sizes itself to the frame's height.
 */
export function PrototypePage() {
  return (
    <iframe
      className="prototype-frame"
      title="Upline MVP prototype"
      src="/prototype.html"
    />
  );
}
