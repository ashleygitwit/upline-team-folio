/**
 * Sheets open with focus on the panel, not on its first field: the email box
 * is often first, and landing in it draws a focus ring around the one thing
 * we hope nobody needs to edit. Focus still moves into the sheet, so Tab and
 * Escape work as usual.
 */
export function focusPanel(e: Event) {
  e.preventDefault();
  (e.currentTarget as HTMLElement | null)?.focus();
}
