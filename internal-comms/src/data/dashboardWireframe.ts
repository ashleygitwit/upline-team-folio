/**
 * Funnel stages for the owner view's outreach funnel.
 *
 * The standalone product wireframes now live as plain HTML in
 * `product/wireframes/` — they are not part of the Through Line site. What
 * remains here is only what `OwnerViewPage` / `OutreachFunnel` still consume.
 *
 * Counts follow the Aug 24 sales deck proof slide: ~30 renewals a week, and 43%
 * of those reached ask to be shopped.
 */

export interface FunnelStage {
  label: string;
  count: number;
  hint: string;
}

export interface RangeView {
  funnel: FunnelStage[];
}

export const RANGE_VIEWS: Record<'quarter', RangeView> = {
  quarter: {
    funnel: [
      { label: 'Reached', count: 120, hint: 'Every renewal, in your voice' },
      { label: 'Opened', count: 98, hint: 'Heard from you before the bill' },
      { label: 'Questionnaire', count: 52, hint: '43% asked to be shopped' },
      { label: 'Shopped', count: 48, hint: 'Three portals each' },
      { label: 'Decided', count: 34, hint: 'Switch or stay — you closed it' },
    ],
  },
};
