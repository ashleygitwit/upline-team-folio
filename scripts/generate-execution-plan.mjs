import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const planPath = path.join(root, 'data', 'venture-plan.json');
const outPath = path.join(root, 'venture', 'planning', 'execution-plan.md');
const publicOutPath = path.join(root, 'app', 'public', 'venture', 'planning', 'execution-plan.md');

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const { venture, initiatives, lastUpdated } = plan;

const byStatus = (status) => initiatives.filter((i) => i.status === status);

const lines = [
  '# Upline Venture — Execution Plan',
  '',
  `*Last updated: ${lastUpdated}*`,
  '',
  'Paste this into ChatGPT, Claude, or your preferred LLM to ask about timeline, priorities, and what is in flight.',
  '',
  '---',
  '',
  '## Venture thesis',
  '',
  venture.thesis,
  '',
  '## Mantra',
  '',
  `> ${venture.mantra}`,
  '',
  '## Upcoming proof point',
  '',
  venture.upcomingProofPoint,
  '',
  '---',
  '',
  '## In flight',
  '',
  ...formatInitiatives(byStatus('In Flight')),
  '',
  '## Next',
  '',
  ...formatInitiatives(byStatus('Next')),
  '',
  '## Future',
  '',
  ...formatInitiatives(byStatus('Future')),
  '',
  '## Done',
  '',
  ...formatInitiatives(byStatus('Done')),
  '',
  '---',
  '',
  '## Timeline table',
  '',
  '| Initiative | Workstream | Owner | Status | Start | End |',
  '| --- | --- | --- | --- | --- | --- |',
  ...initiatives.map(
    (i) =>
      `| ${i.title} | ${i.workstream} | ${i.owner} | ${i.status} | ${i.start} | ${i.end} |`,
  ),
  '',
];

function formatInitiatives(items) {
  if (items.length === 0) return ['*(none)*'];
  return items.flatMap((i) => [
    `### ${i.title}`,
    `- **Workstream:** ${i.workstream}`,
    `- **Owner:** ${i.owner}`,
    `- **Dates:** ${i.start} → ${i.end}`,
    i.notes ? `- **Notes:** ${i.notes}` : null,
    '',
  ].filter(Boolean));
}

const content = lines.join('\n');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.mkdirSync(path.dirname(publicOutPath), { recursive: true });
fs.writeFileSync(outPath, content);
fs.writeFileSync(publicOutPath, content);

console.log('Generated execution-plan.md');
