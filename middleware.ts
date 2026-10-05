import { next } from '@vercel/functions';
import { handleSiteGate } from './internal-comms/site-gate.cjs';

export const config = {
  runtime: 'nodejs',
  matcher: ['/(.*)'],
};

export default async function middleware(request: Request) {
  const gated = await handleSiteGate(request);
  if (gated) return gated;
  return next();
}
