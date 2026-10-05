const { createHash, timingSafeEqual } = require('node:crypto');
const PASSWORD = 'upline26';
const COOKIE_NAME = 'throughline_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const MAX_BODY_BYTES = 4096;

const PUBLIC_PATHS = new Set([
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-16.png',
  '/favicon-32.png',
  '/apple-touch-icon.png',
]);

function token() {
  return createHash('sha256').update(`throughline-gate-v1:${PASSWORD}`).digest('hex');
}

function safeEqual(input, expected) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    if (key === name) return part.slice(separator + 1).trim();
  }
  return null;
}

function isSecure(request) {
  if (new URL(request.url).protocol === 'https:') return true;
  const forwarded = request.headers.get('x-forwarded-proto');
  return forwarded?.split(',')[0]?.trim() === 'https';
}

function cookieHeader(value, secure) {
  const parts = [
    `${COOKIE_NAME}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${COOKIE_MAX_AGE}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

function safeNext(value) {
  if (!value || value.length > 2048) return '/';
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return '/';
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return '/';
  }
  if (decoded.startsWith('//') || decoded.includes('\\') || decoded.includes('://')) return '/';
  return value;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function gateHtml(nextPath, showError) {
  const error = showError
    ? '<p class="gate-error" role="alert">That password isn’t right.</p>'
    : '';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>The Upline Through Line</title>
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Radio+Canada:wght@400;500;600&family=Radio+Canada+Big:wght@500&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        color-scheme: light;
        --background: #f7f7f6;
        --foreground: #282831;
        --muted: #6d6c68;
        --border: #dcdad8;
        --button: #483ac7;
        --button-hover: #3721a6;
        --card: #ffffff;
        --error: #b42318;
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; }
      body {
        font-family: 'Radio Canada', ui-sans-serif, system-ui, sans-serif;
        color: var(--foreground);
        background:
          radial-gradient(900px 420px at 0% 0%, #a2b3fb33, transparent 60%),
          radial-gradient(800px 380px at 100% 0%, #f1f68e6b, transparent 55%),
          var(--background);
      }
      main {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem 1.25rem;
      }
      .card {
        width: min(100%, 26rem);
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 1rem;
        box-shadow: 0 1px 3px rgb(40 40 49 / 0.05);
        padding: 1.75rem;
      }
      .lockup {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        margin-bottom: 1.5rem;
      }
      .lockup svg { width: 28px; height: 28px; display: block; }
      .wordmark {
        font-family: 'Radio Canada Big', 'Radio Canada', sans-serif;
        font-weight: 500;
        font-size: 1.2rem;
        letter-spacing: -0.01em;
      }
      h1 {
        margin: 0 0 0.4rem;
        font-size: 1.35rem;
        font-weight: 500;
        letter-spacing: -0.02em;
      }
      p { margin: 0; color: var(--muted); line-height: 1.45; }
      form { margin-top: 1.35rem; display: grid; gap: 0.45rem; }
      label { font-size: 0.875rem; font-weight: 500; }
      input {
        width: 100%;
        height: 2.75rem;
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 0 0.85rem;
        font: inherit;
        color: inherit;
        background: #fff;
      }
      input:focus {
        outline: 2px solid #3721a6;
        outline-offset: 1px;
      }
      .gate-error { color: var(--error); font-size: 0.875rem; }
      button {
        margin-top: 0.45rem;
        height: 2.75rem;
        border: 0;
        border-radius: 999px;
        background: var(--button);
        color: white;
        font: inherit;
        font-weight: 500;
        cursor: pointer;
      }
      button:hover { background: var(--button-hover); }
    </style>
  </head>
  <body>
    <main>
      <section class="card">
        <div class="lockup">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" aria-hidden="true">
            <rect width="128" height="128" rx="28" fill="#3721A6"/>
            <g transform="translate(33.627 22.984) scale(0.666667)">
              <path fill="#FFFFFF" d="M45.6233 4.52429H91.0529C91.0944 4.52429 91.1221 4.55888 91.1221 4.59347V50.0092C91.1221 50.0507 91.0875 50.0784 91.0529 50.0784H68.4038C68.3623 50.0784 68.3346 50.0438 68.3346 50.0092V27.3809C68.3346 27.3394 68.3 27.3117 68.2655 27.3117H45.6302C45.5887 27.3117 45.561 27.2771 45.561 27.2425V4.59347C45.561 4.55196 45.5956 4.52429 45.6302 4.52429H45.6233ZM68.3416 72.8105V72.8797H68.3208V72.9281C68.3208 82.6961 62.2123 91.6478 52.894 94.5879C37.2388 99.5342 22.7874 87.9122 22.7874 72.9765V72.8797H22.7528V4.59347C22.7528 4.55196 22.7183 4.52429 22.6837 4.52429H0.0691786C0.0276714 4.52429 0 4.55888 0 4.59347V71.9319C0 96.7601 19.4323 117.811 44.2466 118.51C69.9673 119.236 91.1221 98.5242 91.1221 72.9696V72.8589L91.0667 72.8036H68.3416V72.8105Z"/>
            </g>
          </svg>
          <span class="wordmark">The Through Line</span>
        </div>
        <h1>Password required</h1>
        <p>Enter the team password to open The Through Line.</p>
        <form method="post">
          <input type="hidden" name="next" value="${escapeHtml(nextPath)}" />
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
          ${error}
          <button type="submit">Continue</button>
        </form>
      </section>
    </main>
    <script>
      const form = document.querySelector('form');
      const next = form && form.querySelector('input[name="next"]');
      const sync = () => {
        if (!next) return;
        const fromBrowser = location.pathname + location.search + location.hash;
        if (location.hash || !next.value || next.value === '/') next.value = fromBrowser;
      };
      sync();
      form && form.addEventListener('submit', sync);
    </script>
  </body>
</html>`;
}

function htmlResponse(body, status) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      Vary: 'Cookie',
      'X-Robots-Tag': 'noindex',
    },
  });
}

async function handleSiteGate(request) {
  const url = new URL(request.url);
  if (PUBLIC_PATHS.has(url.pathname)) return null;

  const expected = token();
  const authed = safeEqual(readCookie(request.headers.get('cookie'), COOKIE_NAME) ?? '', expected);

  if (request.method === 'POST') {
    let password = '';
    let nextPath = safeNext(url.pathname + url.search);
    const length = Number(request.headers.get('content-length') ?? '0');
    const type = request.headers.get('content-type') ?? '';
    const formEncoded =
      type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data');
    if (formEncoded && length <= MAX_BODY_BYTES) {
      const form = await request.formData();
      password = String(form.get('password') ?? '');
      nextPath = safeNext(String(form.get('next') ?? nextPath));
    }
    if (safeEqual(password, PASSWORD)) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: nextPath,
          'Set-Cookie': cookieHeader(expected, isSecure(request)),
          'Cache-Control': 'private, no-store',
        },
      });
    }
    if (!authed) return htmlResponse(gateHtml(nextPath, true), 401);
  }

  if (authed) return null;

  const nextPath = safeNext(`${url.pathname}${url.search}`);
  return htmlResponse(gateHtml(nextPath, false), request.method === 'GET' ? 200 : 401);
}

function headersFromNode(headers) {
  const out = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const item of value) out.append(key, item);
    } else {
      out.set(key, value);
    }
  }
  return out;
}

function absoluteUrl(req) {
  const host = req.headers.host ?? 'localhost';
  const forwarded = req.headers['x-forwarded-proto'];
  const proto =
    typeof forwarded === 'string' && forwarded.split(',')[0]?.trim() === 'https' ? 'https' : 'http';
  return `${proto}://${host}${req.url ?? '/'}`;
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > limit) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(buffer);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function writeResponse(res, response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    if (key === 'set-cookie') return;
    res.setHeader(key, value);
  });
  const cookie = response.headers.get('set-cookie');
  if (cookie) res.setHeader('set-cookie', cookie);
  const body = Buffer.from(await response.arrayBuffer());
  res.setHeader('content-length', String(body.length));
  res.end(body);
}

function applySiteGate(req, res, next) {
  void (async () => {
    try {
      const method = req.method ?? 'GET';
      const init = {
        method,
        headers: headersFromNode(req.headers),
      };
      if (method === 'POST') {
        const body = await readBody(req, MAX_BODY_BYTES);
        init.body = new Uint8Array(body);
      }
      const gated = await handleSiteGate(new Request(absoluteUrl(req), init));
      if (!gated) {
        next();
        return;
      }
      await writeResponse(res, gated);
    } catch {
      if (!res.headersSent) {
        res.statusCode = 400;
        res.end('Could not read that request.');
      }
    }
  })();
}

module.exports = { handleSiteGate, applySiteGate };
