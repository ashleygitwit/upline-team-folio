/**
 * Ashley's happy-path demo (v2 draft): Stacey Cole at Stockton Hill Insurance,
 * walked from sign-in through the renewal queue, the insured's inbox, the
 * questionnaire, shopping, the recommendation and closing. It is a
 * self-contained single-file build (public/prototype.html), shown in a frame
 * so its own styles and state stay apart from this site's. It brings its own
 * "Jump to" menu and Desktop/Mobile toggle.
 */
export function PrototypePage() {
  return (
    <iframe
      className="prototype-frame"
      title="Upline happy-path demo"
      src="/prototype.html"
    />
  );
}
