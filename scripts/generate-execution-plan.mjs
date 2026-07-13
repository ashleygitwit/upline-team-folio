import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildExecutionPlanMarkdown } from './plan-markdown.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const planPath = path.join(root, 'data', 'venture-plan.json');
const outPath = path.join(root, 'venture', 'planning', 'execution-plan.md');
const publicOutPath = path.join(root, 'app', 'public', 'venture', 'planning', 'execution-plan.md');

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const content = buildExecutionPlanMarkdown(plan);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.mkdirSync(path.dirname(publicOutPath), { recursive: true });
fs.writeFileSync(outPath, content);
fs.writeFileSync(publicOutPath, content);

console.log('Generated execution-plan.md');
