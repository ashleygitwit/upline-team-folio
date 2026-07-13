import type { PilotSummary, VenturePlan } from '../types';

export function formatPilotSummary(pilot: PilotSummary | undefined): string[] {
  if (!pilot) return [];

  const f = pilot.funnel;
  const lines: string[] = [
    '## Pilot activity summary',
    '',
    `*${pilot.agency} · kickoff ${pilot.kickoffDate} · as of ${pilot.asOfDate}*`,
    '',
    `**Pilot week:** ${pilot.pilotWeek}${pilot.outreachSendWeek ? ` · outreach sends catch-up week ${pilot.outreachSendWeek}` : ''} · sessions ${pilot.sessionsCompleted} of ${pilot.sessionsPlanned}${pilot.sessionRhythm ? ` · rhythm ${pilot.sessionRhythm}` : ''}`,
    '',
    ...(pilot.scheduleNote ? [`**Schedule:** ${pilot.scheduleNote}`, ''] : []),
    `**Client naming (team-safe):** ${pilot.clientNamingRule}`,
    '',
    '### Funnel metrics',
    '',
    '| Metric | Count |',
    '| --- | --- |',
    `| Outreach emails drafted | ${f.outreachEmailsDrafted ?? '—'} |`,
    `| Outreach emails sent | ${f.outreachEmailsSent ?? '—'} |`,
    `| Total emails sent (all types) | ${f.emailsSentTotal ?? '—'} |`,
    `| Questionnaires completed | ${f.questionnairesCompleted ?? '—'} |`,
    `| Quotes reviewed with agency | ${f.quotesReviewedWithAgency ?? '—'} |`,
    `| Recommendation emails sent | ${f.recommendationEmailsSent ?? '—'} |`,
    `| Completed end-to-end (sent → questionnaire → quote → rec → client action) | ${f.completedEndToEnd ?? '—'} |`,
    '',
  ];

  if (pilot.roster) {
    const r = pilot.roster;
    lines.push(
      '### Roster',
      '',
      `- Week 1: ${r.week1Households} households · ${r.week1OutreachDrafts} outreach drafts`,
      `- Week 2: ${r.week2Households} households · ${r.week2OutreachDrafts} outreach drafts · ${r.week2EndToEndBuilt} end-to-end built`,
      '',
    );
  }

  if (pilot.outreachEmail) {
    const o = pilot.outreachEmail;
    lines.push(
      '### Recommended outreach email copy',
      '',
      `**Version:** ${o.version}`,
      '',
      o.summary,
      '',
      `**Subject:** ${o.subject}`,
      '',
      '**Body:**',
      '',
      o.body,
      '',
    );
  }

  if (pilot.recommendationEmail) {
    const r = pilot.recommendationEmail;
    lines.push(
      '### Recommendation email (post-shop)',
      '',
      `**Version:** ${r.version}`,
      '',
      r.summary,
      '',
      `**Status:** ${r.status}`,
      '',
    );
    if (r.goldStandardClient) {
      lines.push(`**Gold-standard example client:** ${r.goldStandardClient}`, '');
    }
  }

  if (pilot.keyFindings?.length) {
    lines.push('### Key findings so far', '');
    for (const finding of pilot.keyFindings) {
      lines.push(`- ${finding}`);
    }
    lines.push('');
  }

  if (pilot.notableProgress?.length) {
    lines.push('### Notable client progress', '');
    for (const item of pilot.notableProgress) {
      lines.push(`- **${item.client}:** ${item.note}`);
    }
    lines.push('');
  }

  lines.push('---', '');
  return lines;
}

export function buildExecutionPlanMarkdown(plan: VenturePlan): string {
  const byStatus = (status: VenturePlan['initiatives'][number]['status']) =>
    plan.initiatives.filter((i) => i.status === status);

  const formatBlock = (items: VenturePlan['initiatives']) => {
    if (items.length === 0) return '*(none)*';
    return items
      .map(
        (i) =>
          `### ${i.title}\n- **Workstream:** ${i.workstream}\n- **Owner:** ${i.owner}\n- **Dates:** ${i.start} → ${i.end}${i.notes ? `\n- **Notes:** ${i.notes}` : ''}`,
      )
      .join('\n\n');
  };

  return [
    '# Upline Venture — Execution Plan',
    '',
    `*Last updated: ${plan.lastUpdated}*`,
    '',
    'Paste this into ChatGPT, Claude, or your preferred LLM to ask about timeline, priorities, pilot metrics, email copy, and what is in flight.',
    '',
    '---',
    '',
    '## Venture hypothesis',
    '',
    plan.venture.hypothesis,
    '',
    '## Venture thesis',
    '',
    `**Problem:** ${plan.venture.thesis.problem}`,
    '',
    `**World after:** ${plan.venture.thesis.worldAfter}`,
    '',
    `**Our approach:** ${plan.venture.thesis.approach}`,
    '',
    '## Mantra',
    '',
    `> ${plan.venture.mantra}`,
    '',
    '## Upcoming proof point',
    '',
    plan.venture.upcomingProofPoint.description,
    '',
    `**Success:** ${plan.venture.upcomingProofPoint.successCriteria.join(' · ')}`,
    '',
    '---',
    '',
    ...formatPilotSummary(plan.pilotSummary),
    '## In flight',
    '',
    formatBlock(byStatus('In Flight')),
    '',
    '## Next',
    '',
    formatBlock(byStatus('Next')),
    '',
    '## Future',
    '',
    formatBlock(byStatus('Future')),
    '',
    '## Done',
    '',
    formatBlock(byStatus('Done')),
    '',
    '---',
    '',
    '## Timeline table',
    '',
    '| Initiative | Workstream | Owner | Status | Start | End |',
    '| --- | --- | --- | --- | --- | --- |',
    ...plan.initiatives.map(
      (i) =>
        `| ${i.title} | ${i.workstream} | ${i.owner} | ${i.status} | ${i.start} | ${i.end} |`,
    ),
    '',
  ].join('\n');
}
