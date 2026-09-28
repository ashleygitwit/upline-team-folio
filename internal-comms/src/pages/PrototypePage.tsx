/**
 * A prototype, shown full height in a frame so its own styles and state stay
 * apart from this site's. Each is a self-contained single-file build in
 * public/:
 *
 * - prototype.html: Ashley's happy-path demo (v2 draft, Sept 22), with its own
 *   "Jump to" menu and Desktop/Mobile toggle.
 * - prototype-v2-5.html: Amanda's overview and renewals pass (v2.5, Sept 27),
 *   built from product/happy-path-v2.5 with `npm run export` there.
 * - prototype-v3.html: Amanda's conversational pass (v3, Sept 28), built from
 *   product/happy-path-v3 with `npm run export` there.
 */
export function PrototypePage({ src, title }: { src: string; title: string }) {
  return <iframe className="prototype-frame" title={title} src={src} />;
}
