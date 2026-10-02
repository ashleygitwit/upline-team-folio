export type Actor = 'upline' | 'va' | 'agent' | 'insured';
export type LayerKey = 'experience' | 'ux' | 'data' | 'logic' | 'sold' | 'build';
export type WireKind =
  | 'upload'
  | 'inbox'
  | 'table'
  | 'flags'
  | 'email'
  | 'form'
  | 'queue'
  | 'compare'
  | 'calendar'
  | 'packet';

export interface LayerDef {
  key: LayerKey;
  label: string;
  hint: string;
}

export const LAYERS: LayerDef[] = [
  { key: 'experience', label: 'Experience', hint: 'What happens here' },
  { key: 'data', label: 'Data written', hint: 'What this step writes to the repository' },
  { key: 'logic', label: 'Operational logic', hint: 'The rules behind this step' },
];

export const ACTORS: { key: Actor; label: string; blurb: string }[] = [
  { key: 'upline', label: 'Upline', blurb: 'The product — names the week, drafts, picks' },
  { key: 'va', label: 'VA', blurb: 'Upline people — deep-pull and shop. Same team, separate hands' },
  { key: 'agent', label: 'Agent', blurb: 'Intervenes, owns the rec, closes the bind' },
  { key: 'insured', label: 'Insured', blurb: 'Only sees their agent' },
];

export interface Cell {
  title: string;
  experience: string;
  logic: string[];
  ux: { kind: WireKind; caption: string } | null;
  data: string[];
  sold: string[];
  build: string[];
  note?: string;
  question?: string;
}

export interface JourneyStep {
  id: string;
  n: number;
  name: string;
  phase: 'setup' | 'reach' | 'intake' | 'shop' | 'close';
  lane: Actor;
  cell: Cell;
}

export const PHASES: { key: JourneyStep['phase']; label: string }[] = [
  { key: 'setup', label: 'Set up the data' },
  { key: 'reach', label: 'This week' },
  { key: 'intake', label: 'Intake' },
  { key: 'shop', label: 'Shop & recommend' },
  { key: 'close', label: 'Close' },
];

/** Always-on surfaces. Not sequential steps. Tuesday named these as flagships. */
export const SURFACES: {
  id: string;
  name: string;
  who: string;
  experience: string;
  shows: string[];
  href?: string;
  hrefLabel?: string;
}[] = [
  {
    id: 'dashboard',
    name: 'Business dashboard',
    who: 'Agent',
    experience:
      'The first screen when they log in. Dopamine: this thing is already working. While you were out selling, here is what we did to the book. First slide in the sales deck. Drives the 90-day / 6-month check-in.',
    shows: [
      'Leading: households touched, emails opened, questionnaires in',
      'This week’s 30: how many done vs pending to bind',
      'Lagging: retention we calculate (not self-reported), cross-sell, upsell, referrals',
      'Renewals that came through, and the percentage',
      'Who shopped and who hit yes',
      'Net-new data vs the AMS (e.g. ~8 new points per check-in)',
      'Who still needs a human',
    ],
  },
  {
    id: 'brief',
    name: 'Client brief',
    who: 'Agent',
    experience:
      'Type the name. Get the one-pager — file, questionnaire, recommendation — and/or a chat on top of that file. CRM for this workflow. Not 17 AMS screens. Not an AMS.',
    shows: [
      'Household file from the weekly pull',
      'Questionnaire answers',
      'Recommendation + why we rolled carriers out',
      'What to know for the call',
    ],
  },
];

export const STEPS: JourneyStep[] = [
  {
    id: 'provide-access',
    n: 1,
    name: 'Provide access',
    phase: 'setup',
    lane: 'agent',
    cell: {
      title: 'Agency gives Upline its own login',
      experience:
        'The agency creates an individual Upline login on their AMS — one seat, not their personal login, and not named upline@…. They also add that user at every carrier they want shopped. Access is the SLA. We cannot start without it. A full-book CSV or year dump is not required to go live.',
      logic: [
        'One AMS seat. Individual Upline user (e.g. looks like the agency, not “upline”).',
        'They add us at the carriers they actually shop — not a platform default. Some appoint ~30; personal lines closer to ~8; three can be enough.',
        '2FA, shared-login shops, and auth tokens are expected. Credentials live in a vault we can hand to another VA later.',
        'Access SLA in week one (example: “If you have AMS 360, these 10 things”). Charge if they stall.',
        'No AMS integration. That is the strategy — they cannot turn off an API we never built.',
      ],
      ux: { kind: 'packet', caption: 'AMS login · carrier logins · access SLA' },
      data: [
        'AMS credentials (one seat)',
        'Carrier portal credentials (the appointed set they want shopped)',
        'Appointed-carrier list for this agency',
        'Login display name (not “upline”)',
      ],
      sold: ['Give us access and the week can run. We do not wait on a full-book extract.'],
      build: [
        'Store one AMS login and each carrier login',
        'Credential vault that survives a VA swap',
        'Track the access SLA',
      ],
      note: 'Onboard (preference survey, whose name is on the login) is a sibling conversation. This map starts after contract + onboard.',
    },
  },
  {
    id: 'date-book',
    n: 2,
    name: 'Date the book',
    phase: 'setup',
    lane: 'upline',
    cell: {
      title: 'Upline dates the book lightly',
      experience:
        'We do not deep-map every household at onboard. That takes weeks and the data goes stale. Placeholders at most — enough to know who exists. The real household file is written when we pull this week’s 30.',
      logic: [
        'Census, not a Coverage Review file. Do not pull History, decs, or claims on the whole book.',
        'If we date anyone, it is light: identity and a renewal window, not a year of assigned weeks as the source of truth.',
        'The weekly 30–45 day pull (step 3–4) is when we write the file.',
      ],
      ux: { kind: 'upload', caption: 'Placeholders · not a deep pull' },
      data: [
        'Household / account identifier (if we have it)',
        'Renewal / expiration date (if the export has it)',
      ],
      sold: ['You are not waiting weeks for us to ingest the book.'],
      build: ['Optional light import', 'Do not block go-live on a full-book extract'],
    },
  },
  {
    id: 'serve-week',
    n: 3,
    name: "Name this week's 30",
    phase: 'reach',
    lane: 'upline',
    cell: {
      title: "Upline names this week's 30",
      experience:
        'Once a week we pull renewals in a 30–45 day window and name about 30 households. That list is ready Monday at 8:00 AM. The ritual is the product — not a pre-dated year map.',
      logic: [
        'Fresh weekly pull of posted renewals in the 30–45 day window. Renewals are not posted indefinitely out.',
        'Ready Monday 8:00 AM. Do not make Monday the agency’s ritual day — we are ready; they pick their day.',
        'Cap ~30. Time is the first cut. Rank waits until after the VA pull.',
        'RPA / Sunday-night headless browser is below the line. A person can name the 30.',
      ],
      ux: { kind: 'inbox', caption: 'This week: ~30 in the 30–45 day window · ready Mon 8:00' },
      data: [
        'This week’s household IDs',
        'Renewal date per household',
        'Outreach-queue status',
      ],
      sold: ['Every week, the next 30 are already waiting Monday morning.'],
      build: ['Weekly renewal pull (30–45 days)', 'Cap at ~30', 'Ready-by-Monday ritual'],
    },
  },
  {
    id: 'deep-pull',
    n: 4,
    name: 'Pull household data',
    phase: 'reach',
    lane: 'va',
    cell: {
      title: 'VA pulls data on the 30',
      experience:
        'A VA opens the AMS on each of this week’s 30 and writes the household file: posted renewal $, History, notes, Full Policy Details, declaration pages. This is when the real data lands. Pulling is a fraction of shopping time — a person can do it.',
      logic: [
        'Targeted refresh of this week’s 30 — not the whole book.',
        'This is the write. Step 2 did not do this.',
        'Quality flags land here: claim surcharge vs market, wrong LOB, landmine note, no posted $.',
        'Headless browser / last year’s EZLynx RPA is below the line.',
      ],
      ux: { kind: 'queue', caption: '30 tickets: History · notes · FPD · docs' },
      data: [
        'Latest renewal premium (once posted)',
        'Renewal % change vs. current',
        'Current carrier',
        'Updated policy list + LOB',
        'Vehicles, drivers, addresses',
        'Full Policy Details — coverages, deductibles, endorsements',
        'Declaration pages',
        'Claims history',
        'Account notes / household facts',
        'Quality-gate flags',
      ],
      sold: ['The file is ready before you open the week.'],
      build: ['One VA ticket per household', 'Pull History, notes, FPD, docs', 'Drop the file + quality flags'],
    },
  },
  {
    id: 'prioritize',
    n: 5,
    name: 'Rank the 30',
    phase: 'reach',
    lane: 'upline',
    cell: {
      title: 'Upline ranks the 30',
      experience:
        'A simple table. Sort by renewal date or biggest percentage. Tag “MVP clients” if we have a definition. No algorithm. An onboard diagnostic (“how would you prioritize A / B / C”) can come later.',
      logic: [
        'Rank uses the VA pull — verified $ and notes.',
        'Pick one default (date or %) and roll with it.',
        'Surface and tag MVP clients. Do not carve them out.',
        'Everyone in the 30 still goes to draft unless a hold fires.',
      ],
      ux: { kind: 'table', caption: 'Sort: date or % · MVP tag · hold' },
      data: [
        'Verified renewal premium + % change',
        'Rank order in the week',
        'MVP-client tag (if used)',
        'Hold reason (if held)',
        'Ready-to-draft flag',
      ],
      sold: ['A ranked list of who to reach first. Not a black-box score.'],
      build: ['Sortable table', 'MVP tag', 'Hold with a reason'],
    },
  },
  {
    id: 'draft',
    n: 6,
    name: 'Draft outreach',
    phase: 'reach',
    lane: 'upline',
    cell: {
      title: 'Upline writes the outreach',
      experience:
        'Every household in the 30 gets a questionnaire. The email framing changes. Material increase → let’s shop. Small increase or you are in a good position → I probably would not shop; happy to if you want (inspection risk). Premium down → chance to raise coverages or drop deductibles. Cross-sell sits in every email. Email only for MVP.',
      logic: [
        'Questionnaire to everyone. Filling it out is the trigger — not a separate “yes, shop me.”',
        'Frame by increase and account complexion. Not the same shop-ask every time.',
        'Agency gets a $ and % threshold, or they let Upline decide. Not one-off customization.',
        'SMS / “just dropped your email” is below the line. Data-hygiene benefit we can claim: we get an email and a phone.',
      ],
      ux: { kind: 'email', caption: 'Framed email + questionnaire, every household' },
      data: [
        'Which email frame (shop / probably not / good news / coverages)',
        'Verified $ and % written into the copy',
        'Cross-sell offer chosen',
        'Questionnaire gap list',
        'Queued draft (not yet sent)',
      ],
      sold: ['The email is written. The questionnaire is the ask.'],
      build: ['Draft from % + complexion', 'Build a gap-only questionnaire', 'Attach a cross-sell'],
    },
  },
  {
    id: 'review',
    n: 7,
    name: 'Hold or it sends',
    phase: 'reach',
    lane: 'agent',
    cell: {
      title: 'Agent may intervene. Silence sends.',
      experience:
        'The ranked 30 and drafts are ready Monday at 8:00. The agent can edit or hold. If they do nothing, the week goes out in the send window (Tuesday 9:00 was the example). It never stacks to 90. The train is moving.',
      logic: [
        'Default: emails go unless they stop them.',
        'Window: Monday 8:00 until the send time. Silence = send.',
        'Optional onboard default of “don’t send” — but the sales posture is a moving train. If they must approve every email forever, they may not be a customer.',
        'Recommendation (step 18) does not get this default. Only outreach.',
      ],
      ux: { kind: 'table', caption: 'Ranked 30 · edit · hold · timeout' },
      data: [
        'Agent edits to the draft',
        'Holds they add + reason',
        'Do-not-contact flags',
        'Reviewed vs still pending vs auto-released',
      ],
      sold: ['You can stop any email. You do not have to start the week.'],
      build: ['Timeout / default-send', 'Edit a draft', 'Hold a household'],
    },
  },
  {
    id: 'send',
    n: 8,
    name: 'Send outreach',
    phase: 'reach',
    lane: 'agent',
    cell: {
      title: 'Upline sends from the agent’s mailbox',
      experience:
        'Upline fires the emails from the agent’s own mailbox. The insured never sees us. Microsoft first; Google is growing. Individual sends, not a blast from outreach@upline — that looks like phishing.',
      logic: [
        'Comes from the agent’s name. There is no “Upline is reaching out.”',
        'Upline sends. The agent does not copy-paste into Outlook.',
        'Holds stay held. Everyone else in the 30 goes.',
        'Individual sends (Pipedrive-style), not a mass drop from an Upline domain.',
      ],
      ux: { kind: 'email', caption: 'From the agent’s mailbox · individual sends' },
      data: [
        'Which email frame was used',
        'Send timestamp + delivery status',
        'Mailbox used',
        'Which drafts went out',
        'Bounce / reply capture',
        'Touch count',
      ],
      sold: ['They hear from you. Not from a platform.'],
      build: ['Send from the agent mailbox (Microsoft + Google)', 'Individual send, not a blast', 'Honor holds'],
    },
  },
  {
    id: 'read-email',
    n: 9,
    name: 'Read the email',
    phase: 'intake',
    lane: 'insured',
    cell: {
      title: 'Insured reads the email',
      experience:
        'They open an email from their agent. What they got depends on the frame: a shop ask, a “you are in a good position,” or good news if it is flat or down. It does not mention Upline.',
      logic: [
        'Same mailbox as every other note from their agent.',
        'The ask in the email is to fill out the questionnaire — not reply, not book a call.',
      ],
      ux: { kind: 'email', caption: 'Inbox: agent name, renewal subject, one ask' },
      data: ['Open / bounce', 'Which email frame they received'],
      sold: ['They hear from you. Not from a platform.'],
      build: ['Track open and bounce', 'Record which frame was sent'],
    },
  },
  {
    id: 'questionnaire',
    n: 10,
    name: 'Questionnaire',
    phase: 'intake',
    lane: 'insured',
    cell: {
      title: 'Insured fills out the questionnaire',
      experience:
        'Filling this out is the trigger for Upline. The form already knows their address and cars. It only asks what is missing. There is no separate “yes, shop me” in the email.',
      logic: [
        'Custom-tailored from what we know, what carriers will ask, and the holes between them.',
        'Which questions appear can follow the email frame (shop vs stay vs coverages).',
        'Silence puts them back in the weekly cadence.',
        'A completed form is enough to pick carriers and open a ticket when we are offering to shop.',
      ],
      ux: { kind: 'form', caption: 'Short form: missing facts. Completing it is the yes.' },
      data: [
        'Questionnaire answers',
        'Verified contact — email and phone',
        'Coverage gaps & household details',
        'Life-insurance / cross-sell interest',
        'Submission timestamp',
      ],
      sold: ['A short form that already knows them. Completing it starts the work.'],
      build: ['Host the form', 'Pre-fill from the file', 'Write answers back', 'Treat submit as the trigger'],
    },
  },
  {
    id: 'pick-carriers',
    n: 11,
    name: 'Pick carriers',
    phase: 'shop',
    lane: 'upline',
    cell: {
      title: 'Upline picks the three carriers to shop',
      experience:
        'We have access to the agency’s markets. We use judgment. The product names the top three most likely matches — current plus three options. Best carrier first, not cheapest. We do not say we shopped thirty if we shopped three.',
      logic: [
        'Always three per household — not “shop everyone they appoint.”',
        'Drawn from the appointed set. Agency preference and contingency (need $100k more Donegal) come from the onboard survey.',
        'Fit rules knock a carrier out: teen driver, claims, restricted dog, trampoline, roof age, geography.',
        'Show work later: “we rolled out Progressive because you have a pit bull.”',
        'Contract should say we can shop where we choose — so a carrier deal does not require going back to every agency.',
      ],
      ux: { kind: 'flags', caption: 'This household: shop A, B, C — and why' },
      data: [
        'Top three carriers to shop',
        'Why each was picked or dropped',
        'Appointed-set considered',
        'Agency relationship / incentive flags',
        'Household fit flags',
      ],
      sold: ['We have access to your markets. We used judgment. Best carrier, not just cheapest.'],
      build: [
        'Score carriers from the appointed set',
        'Apply agency-preference + fit rules',
        'Lock the top three on the household',
      ],
    },
  },
  {
    id: 'create-ticket',
    n: 12,
    name: 'Create shop ticket',
    phase: 'shop',
    lane: 'upline',
    cell: {
      title: 'Upline opens a shop ticket',
      experience:
        'Upline creates a ticket in the VA queue: shop this household at these three carriers. The file, the questionnaire, and the carrier list are on the ticket so the VA does not hunt.',
      logic: [
        'Trigger is a completed questionnaire plus a locked three-carrier list — when we are offering to shop.',
        'The ticket is the brief. Nothing lives in the VA’s head.',
        'Target turnaround starts when the ticket lands — about 24 hours. The VA kit has to make that promise true.',
      ],
      ux: { kind: 'flags', caption: 'New ticket: household · shop A, B, C' },
      data: [
        'Ticket ID',
        'Household identifier',
        'Questionnaire answers (attached)',
        'The three carriers + portals',
        'Household file snapshot',
        'Ticket status: queued',
      ],
      sold: ['A completed form becomes a ticket. You do not assign it.'],
      build: ['Open a ticket from the questionnaire', 'Attach file, answers, and the three carriers', 'Land it in the VA shop queue'],
    },
  },
  {
    id: 'pull-ticket',
    n: 13,
    name: 'Pull the ticket',
    phase: 'shop',
    lane: 'va',
    cell: {
      title: 'VA pulls the ticket',
      experience:
        'A VA takes the next ticket off the queue. They have the household, the file, and what to shop. They have not entered a portal yet.',
      logic: [
        'Claim the ticket before shopping so two VAs do not work the same household.',
        'Same shopping kit every time. No tribal knowledge.',
      ],
      ux: { kind: 'queue', caption: 'Queue: claim ticket · household' },
      data: [
        'Who claimed the ticket',
        'Claim timestamp',
        'Ticket status: claimed',
        'Household locked to that VA',
      ],
      sold: ['Work is waiting. Someone picks it up.'],
      build: ['VA shop queue', 'Claim a ticket', 'Lock the household to that VA'],
    },
  },
  {
    id: 'shop',
    n: 14,
    name: 'Shop',
    phase: 'shop',
    lane: 'va',
    cell: {
      title: 'VA shops the household',
      experience:
        'The VA enters the three carrier portals named on the ticket and runs those quotes. About a day. This stays a person at launch. Own rater / multi-rater API is below the line.',
      logic: [
        'Shop only the three Upline named.',
        'Page-by-page portal playbook. No insurance license required.',
        'About 30–45 minutes for a bundled auto+home. Target ~24 hours.',
        'Do not attach PDFs in this step. Quoting and filing are separate beats.',
      ],
      ux: { kind: 'queue', caption: 'Ticket in progress: carrier · quoted' },
      data: [
        'Carriers quoted (the three on the ticket)',
        'Quoted premiums (if captured in-portal)',
        'Coverages & endorsements quoted',
        'Ticket status: quoting',
      ],
      sold: ['We shop it. You stay with the insured.'],
      build: ['Use the onboarded portal logins', 'Quote each carrier on the ticket'],
    },
  },
  {
    id: 'attach-quotes',
    n: 15,
    name: 'Attach quote PDFs',
    phase: 'shop',
    lane: 'va',
    cell: {
      title: 'VA uploads the carrier PDFs',
      experience:
        'The VA downloads the quote PDF from each of the three portals and uploads those files onto the ticket. Upload is also the QA hook — Upline can catch a missed wood stove or a deductible twice as high.',
      logic: [
        'One PDF per carrier, attached to the same ticket.',
        'The file is the carrier’s own output — not a screenshot or a paraphrase.',
        'No PDFs on the ticket → no recommendation.',
      ],
      ux: { kind: 'upload', caption: 'Ticket: drop three carrier quote PDFs' },
      data: [
        'Shopped carrier PDFs',
        'Which carrier each file is from',
        'Ticket status: quotes attached',
      ],
      sold: ['The real quotes sit on the file. Not a paraphrase.'],
      build: ['Upload each PDF to the ticket', 'Flag the ticket for Upline', 'QA against the household file'],
    },
  },
  {
    id: 'rec-logic',
    n: 16,
    name: 'Read the quotes',
    phase: 'shop',
    lane: 'upline',
    cell: {
      title: 'Upline reads the quotes and sets the recommendation',
      experience:
        'The PDFs trigger Upline. The product reads every shopped quote, compares them to the current policy, and locks the pick: which option wins, why, savings and coverage deltas, plus why we rolled others out.',
      logic: [
        'Trigger is the carrier PDF. Not the VA’s notes.',
        'Lock pick + rationale first. Copy second.',
        'One recommendation covers the renewal and the cross-sell.',
      ],
      ux: { kind: 'compare', caption: 'Quotes in · pick + rationale locked' },
      data: [
        'Parsed quote fields (premium, coverages, endorsements)',
        'Current vs shopped deltas',
        'Recommended option',
        'Rationale + why others were rolled out',
        'Cross-sell / upsell offer',
      ],
      sold: ['We read every quote and pick one. You do not sort the pile.'],
      build: ['Parse each attached PDF', 'Compare to the current policy', 'Lock pick + why we rolled X out'],
    },
  },
  {
    id: 'rec-output',
    n: 17,
    name: 'Generate recommendation',
    phase: 'shop',
    lane: 'upline',
    cell: {
      title: 'Upline builds the readout, the draft, and the landing page',
      experience:
        'From that logic, Upline generates three things: an agent readout, a draft recommendation email, and an insured landing page — a custom page for this household, not a jargon PDF. The email is the invite. The page is the brief.',
      logic: [
        'Readout is the working view: options table, pick, why we rolled others out.',
        'Email is the invitation. It does not cram the full comparison.',
        'Landing page is what the insured (and the agent on a call) can actually read.',
      ],
      ux: { kind: 'compare', caption: 'Readout · draft email · insured landing page' },
      data: [
        'Agent readout (options table + pick + why)',
        'Draft recommendation email',
        'Insured landing page URL',
        'Cross-sell offer in the draft',
      ],
      sold: ['A readout, a ready email, and a page they can understand.'],
      build: ['Generate the agent readout', 'Draft the email', 'Build the household landing page'],
    },
  },
  {
    id: 'review-rec',
    n: 18,
    name: 'Review recommendation',
    phase: 'shop',
    lane: 'agent',
    cell: {
      title: 'Agent reviews the recommendation',
      experience:
        'The agent opens the readout, the draft, and the landing page. They can change the pick or only the copy. They do not send yet. This one never auto-sends — AI does not advise the insured.',
      logic: [
        'Two kinds of edit: change the recommendation, or change only the copy.',
        'They keep the last word on what the insured is told to do.',
        'Unlike outreach, silence does not send this.',
      ],
      ux: { kind: 'compare', caption: 'Readout · page · change the pick or the copy' },
      data: [
        'Original recommended option',
        'Agent’s pick if they swapped it',
        'Copy / frame edits',
        'Final recommendation (pending send)',
      ],
      sold: ['You can change the pick or just the words. We do not lock you in.'],
      build: ['Show readout + draft + page', 'Swap the recommended option', 'Edit the email copy'],
    },
  },
  {
    id: 'send-rec',
    n: 19,
    name: 'Send recommendation',
    phase: 'shop',
    lane: 'agent',
    cell: {
      title: 'Agent sends the recommendation',
      experience:
        'The agent hits send. The email goes from their mailbox with a link to the landing page. The insured never sees Upline.',
      logic: [
        'Same send path as outreach — from the agent’s name.',
        'Email invites them to the page. Page holds the comparison.',
      ],
      ux: { kind: 'email', caption: 'From the agent’s mailbox · link to their page' },
      data: [
        'Recommendation sent',
        'Landing page URL sent',
        'Final pick + final copy',
        'Send timestamp + delivery status',
      ],
      sold: ['You send it. Your name is on it. They get a page, not a jargon PDF.'],
      build: ['Send from the agent’s mailbox', 'Include the landing-page link'],
    },
  },
  {
    id: 'respond',
    n: 20,
    name: 'Insured responds',
    phase: 'close',
    lane: 'insured',
    cell: {
      title: 'Reply to talk — or click approve as pending',
      experience:
        'Phone stays. For MVP they reply to this email to book time — warm, from the agent’s inbox. Calendly and call recording are below the line. Some insureds will want to click approve (“$500 cheaper, same coverage, switch me”). If that exists, it means pending, not bound: we will be in touch. This did not bind.',
      logic: [
        'Reply-to-email is the booking path. Majority of these conversations are still phone, not Zoom.',
        'Click-approve, if we keep it, is pending. Upline does not bind, collect bank, or DocuSign.',
        'Calendly without recording is not worth it. Recording is below the line for Nov 6.',
      ],
      ux: { kind: 'email', caption: 'Reply to talk · optional approve = pending, not bound' },
      data: [
        'Response type (reply to talk / approve pending / silence)',
        'If approve: pending flag — not bound',
      ],
      sold: ['Talk if you want. Clicking yes is not coverage.'],
      build: [
        'Reply lands with the agent',
        'Optional approve writes pending — never bound',
        'Do not build Calendly or recording for launch',
      ],
      question: 'Keep click-approve in MVP (pending + “did not bind”), or phone-only?',
    },
  },
  {
    id: 'needs-binding',
    n: 21,
    name: 'Needs binding',
    phase: 'close',
    lane: 'agent',
    cell: {
      title: 'Agency closes the loop',
      experience:
        'Upline midwives. We do not bind. The household sits in needs-binding until the agent marks their part done — paperwork, bank, DocuSign, the phone call. A human action cannot disappear. This is the Kanban (or the dashboard tile) so “they think they bought” cannot become a claim we get blamed for.',
      logic: [
        'Stuck in needs-binding until the agent signs off.',
        'Do not write structured data back to the AMS. Two systems on purpose.',
        'Sales can say: at the end of our process, you have to close.',
      ],
      ux: { kind: 'table', caption: 'Kanban: proposal sent → needs binding → agent marks done' },
      data: [
        'Needs-binding status',
        'Agent sign-off + timestamp',
        'Whether they talked or the insured clicked pending',
      ],
      sold: ['We take it to the one-yard line. You close. Nothing falls off the board.'],
      build: ['Needs-binding column or tile', 'Agent mark-done', 'Do not write back to the AMS'],
    },
  },
  {
    id: 'verify-renewal',
    n: 22,
    name: 'Verify renewal',
    phase: 'close',
    lane: 'upline',
    cell: {
      title: 'Upline checks whether they actually renewed',
      experience:
        'Approve and “jumped on a call” are not retention. We pull the AMS (the same way the pilot spreadsheet did) and see if the household renewed or switched. That number is the claim. If we cannot see it, we do not report it.',
      logic: [
        'Retention is a pull, not a button.',
        'Trailing-12 before we started is calculated by us, not self-reported.',
        'IBAN will download a new policy if they bind. It will not notify anyone that they did not.',
      ],
      ux: { kind: 'table', caption: 'Outcome: renewed · switched · still open — from the AMS' },
      data: [
        'Verified outcome (renewed / switched / still open / lost)',
        'Source of the check (AMS pull)',
        'Trailing-12 baseline (agency level)',
      ],
      sold: ['The retention number is true. We did not count a click as a renewal.'],
      build: ['Pull the AMS for outcome', 'Write verified outcome on the household', 'Never treat approve as retained'],
    },
  },
];
