export type Actor = 'upline' | 'va' | 'agent' | 'customer';
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
  { key: 'ux', label: 'UX / wireframe', hint: 'What someone sees' },
  { key: 'data', label: 'Data written', hint: 'What this step writes to the repository' },
  { key: 'logic', label: 'Operational logic', hint: 'The rules behind this step' },
  { key: 'sold', label: 'Agent value', hint: 'What the agent gets from this step' },
];

export const ACTORS: { key: Actor; label: string; blurb: string }[] = [
  { key: 'upline', label: 'Upline', blurb: 'The product — maps the book, serves the week, drafts' },
  { key: 'va', label: 'VA', blurb: 'Upline people — deep-pull and shop. Same team, separate hands' },
  { key: 'agent', label: 'Agent', blurb: 'Reviews, sends, owns the relationship' },
  { key: 'customer', label: 'Customer', blurb: 'Only sees their agent' },
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

export const STEPS: JourneyStep[] = [
  {
    id: 'provide-access',
    n: 1,
    name: 'Provide access',
    phase: 'setup',
    lane: 'agent',
    cell: {
      title: 'Agency provides access to Upline',
      experience:
        'The agency hands Upline four things in one sitting. An EZLynx login to their AMS. A renewal report — the full list of upcoming renewals, exported. A CSV (or AMS access) with emails and contacts for every person in the book. Logins to every carrier portal they want shopped. Some agencies have about seven portals; some have about thirty. We take the set they shop, not a platform default.',
      logic: [
        'Four things, one sitting: EZLynx login, full upcoming-renewal export, whole-book emails/contacts, and every carrier portal they shop.',
        'EZLynx login is the AMS access — often the easy piece. Not a live 24/7 sync.',
        'The renewal report is the book’s upcoming-renewal list. Export it once and keep it scheduled so Upline can date-stamp the year.',
        'Emails/contacts: a CSV, or pull them through the AMS login. Every household, not a sample.',
        'Carrier portals: the appointed set they actually shop — ~7 on a small shop, ~30 if they appoint widely. We store the logins; we do not shop them yet.',
      ],
      ux: { kind: 'packet', caption: 'EZLynx login · renewal report · email CSV · carrier logins' },
      data: [
        'EZLynx / AMS credentials',
        'Carrier portal credentials (one per appointed carrier, ~7–30)',
        'Appointed-carrier list for this agency',
        'Book-of-business contacts CSV — email, phone if present',
        'Full upcoming-renewal report (exported)',
        'Renewal-report schedule (inbox destination)',
      ],
      sold: ['Give us access and go — one sitting, then we run the book.'],
      build: [
        'Store EZLynx login',
        'Take in the renewal-report export',
        'Import the email CSV',
        'Store each carrier-portal login (~7–30)',
      ],
    },
  },
  {
    id: 'map-book',
    n: 2,
    name: 'Map the book',
    phase: 'setup',
    lane: 'upline',
    cell: {
      title: 'Upline maps every household',
      experience:
        'Upline builds the full customer list: every household, their email, and their renewal date. That list is mapped into the system and sliced across the year — which households belong to which week. This is a census, not a Coverage Review file. We are not deep-pulling the book. We are dating it.',
      logic: [
        'Source: the email CSV plus the renewal report. AMS fills holes if the export is thin.',
        'This is a census, not a Coverage Review file. We date the book. We do not deep-pull History, decs, or claims on 1,500 people.',
        'Output: one row per household — identity, email, renewal date, assigned week.',
        'The year is parsed once so each week already has its people. We do not invent a new list every Monday.',
        'Everyone is assigned a week that still sits before their renewal — at least ~20 days out.',
      ],
      ux: { kind: 'upload', caption: 'Emails in · renewal dates in · year mapped to weeks' },
      data: [
        'Household / account identifier',
        'Contacts — email, phone (from the CSV)',
        'DOB if the export has it',
        'Current carrier per household (if the report has it)',
        'Policy list + LOB (active / inactive), if present',
        'Renewal / expiration date',
        'Assigned outreach week',
        'Weekly cadence position (week of year, touch count = 0)',
      ],
      sold: ['We take the whole book. Nobody gets skipped.'],
      build: ['Import household + email', 'Map renewal dates', 'Assign each household to a week'],
    },
  },
  {
    id: 'serve-week',
    n: 3,
    name: "Serve this week's 30",
    phase: 'reach',
    lane: 'upline',
    cell: {
      title: "Upline names this week's 30",
      experience:
        'Each week the system serves the households whose renewals land in this week’s window — about 30 people. That list is already sitting on the year map from step 2. This is selection by renewal date, not yet a ranked dashboard.',
      logic: [
        'Eligibility: every household is contacted when their renewal comes up — at least ~20 days before it happens. Not only increases.',
        'This week’s ~30 come off the year map — a running weekly list, not a fresh 60-day hunt.',
        'If a week overruns the cap, overflow slides to the next open week still before their renewal. Nobody is dropped.',
        'A found week-list funnels those households into the VA deep-pull. Rank (biggest increase first) waits until after that pull.',
        'Once a household’s week has run, sunset them until their next renewal date.',
      ],
      ux: { kind: 'inbox', caption: 'This week: 30 households, by renewal date' },
      data: [
        'This week’s household IDs',
        'Renewal date per household',
        'Outreach-queue status (in window / overflow / sunset)',
        'Weekly cadence position + number of touches',
        'Week cap / overflow assignment',
      ],
      sold: ['Every week, the next 30 renewals are already waiting.'],
      build: ['Pull this week from the year map', 'Cap at ~30', 'Slide overflow to the next week still before renewal'],
      question:
        'Other model: pull everyone in the next 60 days, rank them, then cut to 30. That picks the biggest increases first, but it means prioritizing before the VA pull. Current order assumes the week’s 30 are already named by date.',
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
        'A VA opens EZLynx on each of this week’s 30 and pulls the household: posted renewal $, History, account notes, Full Policy Details, documents. That file is what the agent will see. No dashboard until this pull is done.',
      logic: [
        'Targeted refresh of this week’s 30 — not the whole book. Same pre-work as Members 1st.',
        'The year map only dated them. This pull refreshes the household: vehicles, drivers, address, policies, notes, posted $ from History.',
        'Catches changes since onboard so cross-sell stays right (someone who added auto should not get an auto cross-sell).',
        'Quality flags land here: claim surcharge vs market move, wrong LOB, “route to Kari,” recent switcher, no posted $.',
        'Hands a current file to rank and draft. No dashboard until this is done.',
      ],
      ux: { kind: 'queue', caption: '30 tickets: History · notes · FPD · docs' },
      data: [
        'Latest renewal premium (once posted in History)',
        'Renewal % change vs. current',
        'Current carrier per household',
        'Updated policy list + LOB (active / inactive)',
        'New / changed vehicles, drivers, addresses',
        'Full Policy Details — coverages, deductibles, endorsements',
        'Current declaration pages',
        'Claims history',
        'Account notes / household facts (AMS Histories — “route to Kari,” etc.)',
        'Coverage gaps & household facts',
        'Quality-gate flags (surcharge vs market, landmine, recent switcher, no posted $)',
      ],
      sold: ['The file is ready before you open the week.'],
      build: ['One VA ticket per household', 'Pull History, notes, FPD, docs', 'Drop the file + quality flags'],
    },
  },
  {
    id: 'prioritize',
    n: 5,
    name: 'Prioritize the batch',
    phase: 'reach',
    lane: 'upline',
    cell: {
      title: 'Upline ranks the 30',
      experience:
        'Now the product ranks the week: biggest increase first, then flat, then decrease. Holds get a reason (no posted $, landmine note, no runway). This is order on the dashboard, not a second selection. The 30 are already chosen.',
      logic: [
        'Rank uses the VA pull — verified $ and notes — so this cannot sit before the deep-pull.',
        'Order: biggest increase first, then flat, then decrease. That front-loads shopping if volume is tight.',
        'Everyone in the 30 still goes to draft unless a hold fires (no posted $, landmine note, no runway).',
        'This is dashboard order, not a second selection. The 30 are already chosen.',
      ],
      ux: { kind: 'table', caption: 'Dashboard: ↑ % · verified $ · hold · ready' },
      data: [
        'Verified renewal premium + % change',
        'Rank order in the week',
        'Hold reason (if held)',
        'Quality-gate results on the row',
        'Ready-to-draft flag',
      ],
      sold: ['A ranked dashboard of who to reach first.'],
      build: ['Rank by increase / flat / decrease', 'Show verified $ on the row', 'Hold with a reason'],
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
        'Upline writes the email and the questionnaire from the household file and the verified renewal number. Shop-framing if the jump is material; check-discounts if it’s small; good-news if it’s flat or down. A cross-sell sits in every email. The questionnaire only asks what the file is missing. This packet is what the agent sees next.',
      logic: [
        'Who: this week’s 30, minus holds. No human writes the email.',
        'Frame by change: >10% → let’s shop. <10% → make sure you’re getting every discount. Flat → good news, it held. Decrease → good news, it dropped.',
        'Every email includes a cross-sell: under 65 → life; over 65 → Medicare / Medicaid; home-not-auto → auto; auto-not-home → home.',
        'Questionnaire is built from three inputs: what we already know, what carriers will ask to shop, and the holes between them. Only ask what’s missing.',
      ],
      ux: { kind: 'email', caption: 'Draft email + questionnaire, ready for the agent' },
      data: [
        'Record of who was selected for outreach',
        'Which email frame (decrease / flat / <10% / >10%)',
        'Verified $ and % written into the copy',
        'Cross-sell offer chosen (life / Medicare-Medicaid / auto / home)',
        'Questionnaire gap list (missing vs carrier question sets)',
        'Queued draft (not yet sent)',
      ],
      sold: ['The email is written. You review it, then send.'],
      build: ['Draft from % change + verified $', 'Build a gap-only questionnaire', 'Attach a cross-sell'],
    },
  },
  {
    id: 'review',
    n: 7,
    name: 'Review the week',
    phase: 'reach',
    lane: 'agent',
    cell: {
      title: 'Agent reviews the ranked list and each draft',
      experience:
        'The agent opens the dashboard: this week’s 30, ranked, each with a household file and a recommended outreach email. They read the list, open a draft, fix tone or a landmine, hold anyone they do not want contacted. They do not send yet.',
      logic: [
        'First required touch — unless they have bypassed review.',
        'They can change copy or hold a household. They do not send yet.',
        'If they skip this step, Upline sends the week without them.',
      ],
      ux: { kind: 'table', caption: 'Dashboard: ranked 30 · household · draft · hold' },
      data: [
        'Agent edits to the draft',
        'Holds they add + reason',
        'Do-not-contact flags',
        'Reviewed vs still pending',
      ],
      sold: ['A ranked list of who to reach, with the email already written.'],
      build: ['Ranked week view with household + draft', 'Edit a draft', 'Hold a household'],
    },
  },
  {
    id: 'send',
    n: 8,
    name: 'Send outreach',
    phase: 'reach',
    lane: 'agent',
    cell: {
      title: 'Agent sends from Upline',
      experience:
        'The agent hits send in Upline. The emails go from their mailbox. The customer never sees us.',
      logic: [
        'Comes from the agent’s own name. There is no “Upline is reaching out.”',
        'Send lives in Upline — they do not copy-paste into Outlook.',
        'If review is on, only approved drafts go out. If review is off, the whole week goes out with no click.',
        'Frame already decided in the draft step: decrease / flat → reassure; <10% → optimize; >10% → shop.',
      ],
      ux: { kind: 'email', caption: 'Send in Upline — from the agent’s mailbox' },
      data: [
        'Which email frame was used (decrease / flat / <10% / >10%)',
        'Send timestamp + delivery status',
        'Mailbox used',
        'Which drafts went out',
        'Bounce / reply capture',
        'Weekly cadence position + number of touches (now 1)',
        'Follow-ups / re-entries if bounce',
      ],
      sold: ['You send from Upline. Or we send the week for you.'],
      build: ['Send from the agent’s mailbox', 'Agency setting: review on or off', 'Auto-send the week if review is off'],
      note: '* If the agent bypasses review, Upline sends the whole week on their behalf.',
    },
  },
  {
    id: 'read-email',
    n: 9,
    name: 'Read the email',
    phase: 'intake',
    lane: 'customer',
    cell: {
      title: 'Customer reads the email',
      experience:
        'The customer opens an email from their agent. What they got depends on their renewal increase: a shop ask if the jump is material, a check-your-discounts note if it’s small, good news if it’s flat or down. It does not mention Upline.',
      logic: [
        'What they received is the frame from the draft: >10% shop, <10% discounts, flat / down good news.',
        'Same mailbox as every other note from their agent.',
      ],
      ux: { kind: 'email', caption: 'Inbox: agent name, renewal subject, one ask' },
      data: [
        'Open / bounce',
        'Which email frame they received (decrease / flat / <10% / >10%)',
        'Response type (opened)',
      ],
      sold: ['They hear from you. Not from a platform.'],
      build: ['Track open and bounce', 'Record which frame was sent'],
    },
  },
  {
    id: 'questionnaire',
    n: 10,
    name: 'Questionnaire',
    phase: 'intake',
    lane: 'customer',
    cell: {
      title: 'Customer fills out the questionnaire',
      experience:
        'They complete a short form to fill missing information and to say they want to be shopped. The form already knows their address and cars. It only asks what carriers will need that the file does not have.',
      logic: [
        'Custom-tailored from three inputs: what we already know, what carriers will ask to shop, and the holes between them.',
        'Only asks what’s missing — does not re-ask the VA pull.',
        'Two jobs: update the file, and signal they want to be shopped.',
        'A shop yes triggers carrier pick + ticket. Silence puts them back in the weekly cadence.',
      ],
      ux: { kind: 'form', caption: 'Short form: missing facts + yes, shop me' },
      data: [
        'Questionnaire answers',
        'Verified contact info',
        'Coverage gaps & household details',
        'Life-insurance / cross-sell interest',
        'Shop opt-in (yes / no)',
        'Submission timestamp',
      ],
      sold: ['A short form that already knows them.'],
      build: ['Host the form', 'Pre-fill from the file', 'Capture shop opt-in', 'Write answers back'],
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
        'The completed questionnaire triggers Upline. The product names the top three carriers this VA should shop for this client. The pick comes from the agency’s appointed set and a mix of rules: any special relationship or incentive that agency has with a carrier, whether this household even qualifies (roof over 30 years, a restricted dog breed, a recent claim), and who is generally most competitive for that line — Progressive on auto, for example. The VA does not choose.',
      logic: [
        'Always three carriers per household — not “shop everyone they appoint.”',
        'Drawn from the agency’s appointed set (the 7–30 from onboard).',
        'Agency relationship / bonus / appetite can bump a carrier up.',
        'Fit rules knock a carrier out before we waste a quote: roof over 30 years, restricted dog breed, claim in the last year, teen driver, credit, geography.',
        'Market defaults fill the rest (Progressive often most competitive on auto).',
        'Insider-baseball fit: who is good for this profile — not a generic three.',
      ],
      ux: { kind: 'flags', caption: 'This client: shop A, B, C — and why' },
      data: [
        'Top three carriers to shop',
        'Why each was picked or dropped',
        'Appointed-set considered',
        'Agency relationship / incentive flags',
        'Household fit flags (roof age, dog breed, claims, teen driver, geography)',
      ],
      sold: ['We pick the three carriers worth shopping. You do not guess.'],
      build: [
        'Score carriers from the appointed set',
        'Apply agency-relationship rules',
        'Apply household fit / exclusion rules',
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
        'Upline creates a ticket in the VA queue: shop this customer at these three carriers. The household file, the questionnaire answers, and the carrier list are on the ticket so the VA does not hunt.',
      logic: [
        'Trigger is a shop yes plus a locked three-carrier list — not a human assigning work.',
        'The ticket is the brief: who, which three portals, current policy, verified $, notes, and QQ answers.',
        'Target VA turnaround starts when the ticket lands — about 24 hours to shopped PDFs.',
      ],
      ux: { kind: 'flags', caption: 'New ticket: customer X · shop A, B, C' },
      data: [
        'Ticket ID',
        'Customer / household identifier',
        'Questionnaire answers (attached)',
        'The three carriers + portals to shop',
        'Household file snapshot — current policy, verified $, notes',
        'Ticket status: queued',
      ],
      sold: ['A yes on the form becomes a ticket. You do not assign it.'],
      build: ['Open a ticket from QQ + shop yes', 'Attach file, answers, and the three carriers', 'Land it in the VA shop queue'],
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
        'A VA takes the next ticket off the queue. They have the customer, the file, and what to shop. They have not entered a portal yet.',
      logic: [
        'Claim the ticket before shopping so two VAs do not work the same household.',
        'The VA now owns the brief. They have not entered a portal yet.',
      ],
      ux: { kind: 'queue', caption: 'Queue: claim ticket · customer X' },
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
        'The VA enters the three carrier portals named on the ticket and runs those quotes. They do not attach files yet. About a day. This stays a person at launch.',
      logic: [
        'Shop only the three carriers Upline named — not the agency’s full appointed list.',
        'Page-by-page portal playbook. No insurance license required.',
        'About 30–45 minutes for a bundled auto+home shop. Target turnaround ~24 hours.',
        'Do not attach PDFs in this step. Quoting and filing are separate beats.',
      ],
      ux: { kind: 'queue', caption: 'Ticket in progress: carrier · quoted' },
      data: [
        'Carriers quoted (the three on the ticket)',
        'Quoted premiums (if captured in-portal)',
        'Coverages & endorsements quoted',
        'Ticket status: quoting',
      ],
      sold: ['We shop it. You stay with the client.'],
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
        'The VA downloads the quote PDF from each of the three carrier portals they shopped and uploads those PDFs back onto the ticket. The files are the carrier’s own output, not a screenshot of a screen.',
      logic: [
        'One PDF per carrier shopped, attached to the same ticket.',
        'The file is the carrier’s own output, pulled directly from the portal — not a screenshot or a paraphrase.',
        'Upload is the trigger for Upline. No PDFs on the ticket → no recommendation.',
      ],
      ux: { kind: 'upload', caption: 'Ticket: drop carrier quote PDFs' },
      data: [
        'Shopped carrier PDFs (pulled directly from the carrier portals)',
        'Which carrier each file is from',
        'Ticket status: quotes attached',
      ],
      sold: ['The real quotes sit on the file. Not a paraphrase.'],
      build: ['Download quote PDF from each portal', 'Upload each PDF to the ticket', 'Mark the ticket ready for Upline'],
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
        'The PDFs on the ticket trigger Upline. The product reads every shopped quote, compares them to the current policy, and writes the recommendation logic: which option wins, why, savings and coverage deltas, plus the cross-sell. It has not written the agent email yet.',
      logic: [
        'Trigger is the shopped PDF — the carrier’s own output. Not the VA’s notes.',
        'Compare each option to the current policy. Surface savings and coverage deltas.',
        'Lock pick + rationale first. Copy second.',
        'One recommendation covers the renewal and the cross-sell (e.g. life). No handoff to a separate producer.',
      ],
      ux: { kind: 'compare', caption: 'Quotes in · pick + rationale locked' },
      data: [
        'Parsed quote fields (premium, coverages, endorsements)',
        'Current vs shopped deltas (savings / coverage)',
        'Recommended option',
        'Rationale',
        'Cross-sell / upsell offer included (e.g. life)',
      ],
      sold: ['We read every quote and pick one. You do not sort the pile.'],
      build: ['Parse each attached PDF', 'Compare to the current policy', 'Lock pick + rationale'],
    },
  },
  {
    id: 'rec-output',
    n: 17,
    name: 'Generate recommendation',
    phase: 'shop',
    lane: 'upline',
    cell: {
      title: 'Upline builds the readout and the draft email',
      experience:
        'From that logic, Upline generates two things for the agent: a recommendation readout they can scan, and a draft recommendation email they can review.',
      logic: [
        'Readout is the working view: options table, pick, why.',
        'Email is the client-facing note — shopped recommendation plus the cross-sell — still unsent.',
        'Both are generated from the locked logic. The agent has not touched them yet.',
      ],
      ux: { kind: 'compare', caption: 'Readout + draft email, ready for the agent' },
      data: [
        'Agent readout (options table + pick + why)',
        'Draft recommendation email',
        'Cross-sell offer in the draft',
      ],
      sold: ['A readout and a ready email. Not a pile of PDFs.'],
      build: ['Generate the agent readout', 'Draft the recommendation email from the locked logic'],
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
        'The agent opens the readout and the draft email. They can change Upline’s pick — a different carrier or option — or leave the pick and only change the copy and how the email is framed. They do not send yet.',
      logic: [
        'Two kinds of edit: change the recommendation itself (different carrier or option), or change only the copy and frame.',
        'They keep the last word on what the client is told to do.',
        'They do not send yet.',
      ],
      ux: { kind: 'compare', caption: 'Readout · change the pick or the copy' },
      data: [
        'Original recommended option',
        'Agent’s pick if they swapped it',
        'Copy / frame edits',
        'Final recommendation (pending send)',
      ],
      sold: ['You can change the pick or just the words. We do not lock you in.'],
      build: ['Show readout + draft side by side', 'Swap the recommended option', 'Edit the email copy'],
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
        'The agent hits send in Upline. The email goes from their mailbox. The customer never sees us.',
      logic: [
        'Same send path as outreach — from the agent’s name, in Upline.',
        'The customer never sees Upline.',
      ],
      ux: { kind: 'email', caption: 'Send in Upline — from the agent’s mailbox' },
      data: [
        'Recommendation sent (shopped options + rationale)',
        'Cross-sell / upsell offer included (e.g. life)',
        'Final pick + final copy',
        'Send timestamp + delivery status',
        'Customer’s response to the recommendation (when it arrives)',
      ],
      sold: ['You send it. Your name is on it.'],
      build: ['Send the recommendation from the agent’s mailbox'],
    },
  },
  {
    id: 'close',
    n: 20,
    name: 'Close',
    phase: 'close',
    lane: 'customer',
    cell: {
      title: 'How the week closes is undecided',
      experience:
        'We do not have a locked close yet. In the Members 1st pilot the recommendation email asked, “What times are you available to meet?” The agent ran that conversation — especially on a switch, because that is how they make commission. That may be the model. It may not. This is a group decision, not a product call we should fake on the map.',
      logic: [
        'Members 1st: the rec email asked for times; the agent closed on the phone — especially on a switch, because that is how they make commission.',
        'Other options still on the table: Calendly, a self-serve “pick this policy” page, or the agent handles it outside Upline.',
        'Whatever we pick has to keep the close with the agency. Upline does not take that conversation.',
        'If we do capture a meeting: channel can be phone, Zoom, or in person. Non-schedulers re-enter cadence.',
        'If we transcribe: write notes back to the repository and deposit an AMS note. Memorialized declines (e.g. turned down UM).',
      ],
      ux: { kind: 'calendar', caption: 'TBD: ask for times · book a call · or they handle it' },
      data: [
        'Customer’s response to the recommendation',
        'Scheduled meeting + channel (phone / Zoom / in-person) — if we capture it',
        'Meeting recording + transcript — if a call happens',
        'Call / meeting intelligence',
        'Decision / outcome (retained, switched, cross-sold, declined)',
        'Final paperwork / signature email — if we send it',
        'Thank-you-for-signing email — if we send it',
        'AMS note deposited',
      ],
      sold: ['Your close. We do not take the conversation — once we decide how it starts.'],
      build: ['Do not build a close path until the group picks one'],
      note: '* Group decision. Members 1st asked for meeting times and the agent closed on the phone.',
      question:
        'Does Upline ask for times, book the meeting, offer a self-serve bind, or stay out after the rec email?',
    },
  },
];
