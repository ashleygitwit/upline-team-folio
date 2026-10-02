/**
 * Leah's questionnaire, which the walk shows one question to a screen on her
 * phone (screens/Questionnaire.tsx), and Jenna can preview all on one page in
 * a tab of its own from the Pruitts' renewal email
 * (screens/QuestionnairePreview.tsx). Both ask what screens/questions.tsx
 * has, in this order. The life question is only there when Jenna left Life
 * on in Shape the shop.
 */
export type Step = "contact" | "changed" | "license" | "life" | "referral";

export const stepsFor = (askLife: boolean): Step[] => [
  "contact",
  "changed",
  "license",
  ...(askLife ? (["life"] as const) : []),
  "referral",
];

/**
 * The preview is the prototype's own page at its own address, so it opens
 * the same in development and in the one-file export Through Line serves. A
 * new tab starts a walk of its own, so whether to ask about life goes in the
 * address, "?life=0" when Life is off.
 */
const previewHash = "#questionnaire-preview";
const previewWithoutLife = `${previewHash}?life=0`;

export const previewHref = (askLife: boolean) => (askLife ? previewHash : previewWithoutLife);

/** Whether a page is the preview, from its address, and if it is, whether it asks about life. */
export function previewFor(hash: string): { askLife: boolean } | null {
  if (hash === previewHash) return { askLife: true };
  if (hash === previewWithoutLife) return { askLife: false };
  return null;
}
