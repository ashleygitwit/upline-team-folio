import type { IncomingMessage, ServerResponse } from 'node:http';

export function handleSiteGate(request: Request): Promise<Response | null>;

export function applySiteGate(
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void,
): void;
