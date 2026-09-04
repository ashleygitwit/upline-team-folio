export type SprintDayId = 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface SprintRole {
  who: string;
  ask: string;
}

export interface SprintExerciseSlide {
  title: string;
  steps: string[];
}

export type SprintStep = string | { text: string; href?: string; label?: string };

export interface SprintExercise {
  name: string;
  time?: string;
  room?: string;
  steps: SprintStep[];
  snapshot?: boolean;
  link?: { href: string; label: string };
  rolesLabel?: string;
  roles?: SprintRole[];
  lane?: 'product' | 'gtm';
  exercise?: SprintExerciseSlide;
}

export interface SprintHalf {
  title: string;
  who: string;
  goal: string;
  exercises: SprintExercise[];
}

export interface SprintDay {
  id: SprintDayId;
  when: string;
  date: string;
  theme: string;
  href: string;
  glanceBeats: { label: string; text: string }[];
  objective: string;
  agenda: { time: string; room: string; what: string }[];
  leaveWith: string[];
  morning: SprintHalf;
  afternoon: SprintHalf;
}

export const SPRINT_DAYS: SprintDay[] = [
  {
    id: 'tuesday',
    when: 'Tuesday',
    date: 'September 8',
    theme: 'Sales and product journeys',
    href: '#/sprint/tuesday',
    glanceBeats: [
      {
        label: '9:00–10:00',
        text: 'Everyone together. Ground in the week, roles, and venture thesis.',
      },
      {
        label: '10:00–11:30',
        text: 'Go-to-market workshop: ICP, sales journey (awareness through onboarding), awareness plays, content and systems, and Friday goals. Pitch deck critique and brainstorm.',
      },
      {
        label: '11:30–1:00',
        text: 'Everyone together for Gitwit All-Hands. Jacob introduces Justin and Davie. Lunch included.',
      },
      {
        label: '1:00–3:30',
        text: 'Product room. Walk the product experience map together, step by step, to catalog how Upline will work at MVP launch. Name the risks and the unknowns as we go.',
      },
      {
        label: '3:30–4:30',
        text: 'Name the make-or-break moments and the risks we cannot ignore — these are what we sketch Wednesday.',
      },
    ],
    objective:
      'We’ll review and refine what’s already been done on Upline — critique, revise, and upend as needed — and map the sales journey and how Upline will work at MVP launch.',
    agenda: [
      { time: '9:00–10:00', room: 'The Curve', what: 'Ground the thesis.' },
      { time: '10:00–11:30', room: 'The Curve', what: 'Go-to-market workshop: ICP, sales journey, awareness, content and systems, Friday goals, pitch deck.' },
      { time: '11:30–1:00', room: 'Gitwit', what: 'All-Hands. Jacob introduces Justin and Davie. Lunch included.' },
      { time: '1:00–3:30', room: 'The Curve', what: 'Walk the product experience map.' },
      { time: '3:30–4:30', room: 'The Curve', what: 'What we sketch tomorrow.' },
    ],
    leaveWith: [
      'Aligned on the thesis and the week',
      'ICP + sales journey with owners, through onboard',
      'Pitch deck edits named',
      'A product experience map the room owns',
      'Make-or-break moments and must-not-ignore risks for Wednesday',
    ],
    morning: {
      title: 'Together',
      who: 'Everyone',
      goal: '',
      exercises: [
        {
          name: 'Ground the thesis',
          time: '9:00–10:00',
          room: 'The Curve',
          steps: [
            'Review the goals, agenda, and purpose of the week.',
            'Talk through everyone’s roles for the week.',
            {
              text: 'Review the venture thesis and make sure we’re aligned.',
              href: '#/',
              label: 'Open the venture thesis',
            },
            'Conduct the premortem exercise.',
          ],
          exercise: {
            title: 'Premortem exercise',
            steps: [
              'Everyone grab a card in front of you.',
              'Everybody answer the following question: if the end of this week ends up being a failure, what would cause that?',
              'Everyone shares their answers out loud.',
              'Collaboratively draft together the biggest objectives of the week.',
            ],
          },
        },
        {
          name: 'GTM workshop',
          time: '10:00–11:30',
          room: 'The Curve',
          steps: [
            'Review and refine the ICP.',
            'Map the sales journey from awareness through onboarding.',
            'Brainstorm awareness plays: outbound, paid, events, and what we’ve learned so far.',
            'Map the content and systems needed to the sales journey.',
            'Set goals for Friday.',
            'Critique the current pitch deck and brainstorm edits.',
          ],
        },
        {
          name: 'Gitwit All-Hands',
          time: '11:30–1:00',
          room: 'Gitwit',
          steps: [
            'Join the company All-Hands. Lunch is included.',
            'Jacob introduces Justin and Davie to the rest of Gitwit.',
          ],
        },
      ],
    },
    afternoon: {
      title: 'Product room',
      who: 'Walk the product experience map together.',
      goal: '',
      exercises: [
        {
          name: 'Walk the product experience map',
          time: '1:00–3:30',
          room: 'The Curve',
          snapshot: true,
          steps: [
            'We will start from the existing preliminary product journey map, not a blank wall.',
            'We will go section by section, step by step, to catalog how Upline will work at MVP launch.',
            'For each stretch we will ask: Is this how it should work? Should we revise, drop, or add anything?',
            'As we go, we will name the risks and the unknowns. We will not solve them in this room.',
          ],
        },
        {
          name: 'What we sketch tomorrow',
          time: '3:30–4:30',
          room: 'The Curve',
          steps: [
            'Name the make-or-break moments in the experience.',
            'Name the risks we cannot ignore, especially anything that looks infeasible.',
            'These are the moments we will sketch tomorrow.',
          ],
        },
      ],
    },
  },
  {
    id: 'wednesday',
    when: 'Wednesday',
    date: 'September 9',
    theme: 'Sketch the product and set up go-to-market efforts',
    href: '#/sprint/wednesday',
    glanceBeats: [
      {
        label: '9:00–2:00',
        text: 'Two groups. Product room: breadboard and sketch Tuesday’s flagship moments; parallel check on technical feasibility and open questions. GTM room: onboard to ops and GTM systems; investor and sales pitch deck working sessions.',
      },
      {
        label: '2:00–3:00',
        text: 'Everyone together to review the product design sketches and give direction.',
      },
      {
        label: '3:00–5:00',
        text: 'Two groups. Product room: revise sketches from feedback. GTM room: website sitemapping for the v2 website.',
      },
    ],
    objective:
      'The flagship moments are sketched. Feasibility is named. Systems are on. The decks are in motion. The site has a sitemap.',
    agenda: [
      { time: '9:00–2:00', room: 'The Curve', what: 'Breadboard and sketch the flagship moments.' },
      { time: '9:00–11:00', room: 'The Cube', what: 'Onboard to ops and GTM systems.' },
      { time: '11:00–2:00', room: 'The Cube', what: 'Work the investor deck and the sales deck.' },
      { time: '12:00–1:00', room: '—', what: 'Lunch' },
      { time: '2:00–3:00', room: 'The Curve', what: 'Review the sketches.' },
      { time: '3:00–5:00', room: 'The Curve', what: 'Revise the sketches.' },
      { time: '3:00–5:00', room: 'The Cube', what: 'Website sitemapping for the v2 website.' },
    ],
    leaveWith: [
      'Breadboards and sketches of Tuesday’s flagship moments',
      'Sketches revised after the 2:00 review',
      'Feasibility named',
      'Systems on',
      'Deck edits named',
      'A v2 sitemap and the highest-priority pages',
    ],
    morning: {
      title: 'Two rooms',
      who: 'Product and go-to-market',
      goal: '',
      exercises: [
        {
          name: 'Breadboard the flagship moments',
          time: '9:00–11:00',
          room: 'The Curve',
          lane: 'product',
          steps: [
            'For each of Tuesday’s flagship moments: what is on the moment, what someone can do, and what decision it supports.',
          ],
          link: { href: '#/mvp-journey', label: 'Open the preliminary product journey map' },
        },
        {
          name: 'Sketch and check feasibility',
          time: '11:00–2:00',
          room: 'The Curve',
          lane: 'product',
          steps: [
            'Sketch what is on the breadboard.',
            'Name the feasibility issues, the risks, and any onboard assumptions we are still relying on.',
            'Have something on the wall by 2:00 so the team can review it.',
          ],
        },
        {
          name: 'Onboard to systems',
          time: '9:00–11:00',
          room: 'The Cube',
          lane: 'gtm',
          steps: [
            'Walk through the accounts and platforms we will use for outreach and sales.',
            'Get everyone who needs access onto the tools.',
          ],
        },
        {
          name: 'Work the decks',
          time: '11:00–2:00',
          room: 'The Cube',
          lane: 'gtm',
          steps: [
            'Investor deck — start the story we will raise on.',
            'Sales deck — keep editing from Tuesday’s critique.',
          ],
        },
      ],
    },
    afternoon: {
      title: 'Together, then two rooms',
      who: '2:00 everyone · 3:00 product and go-to-market',
      goal: '',
      exercises: [
        {
          name: 'Review the sketches',
          time: '2:00–3:00',
          room: 'The Curve',
          steps: [
            'Look at the product design sketches together.',
            'Give feedback and direction on how to improve them.',
          ],
        },
        {
          name: 'Revise the sketches',
          time: '3:00–5:00',
          room: 'The Curve',
          lane: 'product',
          steps: [
            'Revise the sketches from the team’s feedback.',
            'Put the new versions on the wall.',
          ],
        },
        {
          name: 'Map the website',
          time: '3:00–5:00',
          room: 'The Cube',
          lane: 'gtm',
          steps: [
            'Map the website against Tuesday’s sales journey.',
            'Name the highest-priority pages for v2.',
          ],
        },
      ],
    },
  },
  {
    id: 'thursday',
    when: 'Thursday',
    date: 'September 10',
    theme: 'Product requirements + heads-down GTM work',
    href: '#/sprint/thursday',
    glanceBeats: [
      {
        label: '9:00–12:00',
        text: 'Everyone together. Put Tuesday’s journey and Wednesday’s sketches on the wall. List the features the experience needs; keep or kill each one (above/below the line for MVP). Estimate effort/complexity, sequence the work, and set an MVP launch date.',
      },
      {
        label: '1:00–5:00',
        text: 'Two groups. Product room: turn the above-the-line list into epics, user stories, and requirements; stand up Linear — or whatever ticketing system we’ll use. GTM room: heads-down on website, pitch deck, and first sales motion.',
      },
    ],
    objective: 'A scoped MVP and a launch date.',
    agenda: [
      { time: '9:00–12:00', room: 'The Curve', what: 'Write the list. Keep or kill. Estimate effort. Set a date.' },
      { time: '12:00–1:00', room: '—', what: 'Lunch' },
      { time: '1:00–5:00', room: 'The Curve', what: 'Write stories and stand up the ticketing system.' },
      { time: '1:00–5:00', room: 'The Cube', what: 'Website, pitch deck, and the first sales motion.' },
    ],
    leaveWith: [
      'A feature list with each item above or below the line',
      'Effort estimates and an MVP launch date',
      'Stories in Linear — or whatever ticketing system we use',
      'Website, pitch deck, and first sales motion in progress',
    ],
    morning: {
      title: 'Together',
      who: 'Everyone',
      goal: '',
      exercises: [
        {
          name: 'Write the feature list',
          time: '9:00–10:00',
          room: 'The Curve',
          steps: [
            'Put Tuesday’s journey and Wednesday’s sketches on the wall.',
            'Conduct a feature brainstorm — generate the features needed to execute on the experience.',
          ],
          link: { href: '#/mvp-journey', label: 'Open the preliminary product journey map' },
          exercise: {
            title: 'Feature brainstorm',
            steps: [
              'Take a sticky-note pad. Write one feature per sticky note.',
              'Look at the full product experience map from beginning to end and write the features we would need to build to execute on this experience. One feature per sticky note.',
              'Hold on to your list of features until we walk the map together.',
              'Ashley starts from the beginning of the product map. If you have a feature at that moment, call it out. We’ll add it to the map.',
              'Look at the full map as a group when we’re done and consolidate features that are the same until we have one list of everything needed to execute on the product experience map.',
            ],
          },
        },
        {
          name: 'Keep or kill',
          time: '10:00–11:00',
          room: 'The Curve',
          steps: ['Conduct the Keep or Kill Exercise as a group.'],
          exercise: {
            title: 'Keep or Kill Exercise',
            steps: [
              'Ashley draws a line on the whiteboard.',
              'We’ll go through each feature, pull that sticky note off the board, and discuss whether it absolutely has to make the MVP.',
              'As we go, talk about the fidelity of each feature — above the line or below the line. We may reframe or rephrase features as we go.',
              'At the end, look back and make sure we’re aligned and this feels like a reasonable MVP scope.',
            ],
          },
        },
        {
          name: 'Estimate and set a date',
          time: '11:00–12:00',
          room: 'The Curve',
          steps: [
            'Estimate effort and complexity for what we kept.',
            'Sequence the work. Name what has to happen before something else can.',
            'Set an MVP launch date.',
          ],
          exercise: {
            title: 'T-shirt sizing exercise',
            steps: [
              'Placeholder — we’ll fill in this exercise before Thursday.',
            ],
          },
        },
      ],
    },
    afternoon: {
      title: 'Two rooms',
      who: 'Product and go-to-market',
      goal: '',
      exercises: [
        {
          name: 'Write the stories and set up Linear',
          time: '1:00–5:00',
          room: 'The Curve',
          lane: 'product',
          steps: [
            'Decide what ticketing system we’ll use to manage the build (Linear?).',
            'Write user stories for each of the features.',
            'Write requirements and a definition of done for each story.',
          ],
        },
        {
          name: 'Website, deck, and first motion',
          time: '1:00–5:00',
          room: 'The Cube',
          lane: 'gtm',
          steps: [
            'Continue working on the website and pitch deck.',
            'Build the first sales motion we will tee up on Friday.',
          ],
        },
      ],
    },
  },
  {
    id: 'friday',
    when: 'Friday',
    date: 'September 11',
    theme: 'Venture operations',
    href: '#/sprint/friday',
    glanceBeats: [
      {
        label: '9:00–11:30',
        text: 'Heads-down work time — wrap up work from the previous day.',
      },
      {
        label: '11:30–1:30',
        text: 'Everyone together to brainstorm what it takes to launch (support, onboarding, VAs, legal, billing, hiring). Map it on the roadmap with owners and timing. Name venture roles, recurring meetings, and milestones. Review Tuesday’s goals.',
      },
      {
        label: '1:30–3:00',
        text: 'GTM room. Tee up Davie’s first sales experiment.',
      },
      {
        label: '3:00–5:00',
        text: 'Record the podcast. Justin and Davie talk with Jacob about how they got to Upline, what excites them about the opportunity, and why they wanted to work with Gitwit.',
      },
    ],
    objective:
      'We’ve considered everything it takes to launch the venture this fall — in addition to, or outside of, just the product and go-to-market plans.',
    agenda: [
      { time: '9:00–11:30', room: 'The Curve', what: 'Heads-down wrap-up (product work).' },
      { time: '9:00–11:30', room: 'The Cube', what: 'Heads-down wrap-up (go-to-market).' },
      { time: '11:30–1:30', room: 'The Curve', what: 'Venture Ops, roles, and week goals.' },
      { time: '1:30–3:00', room: 'The Cube', what: 'Tee up Davie’s first sales experiment.' },
      { time: '3:00–5:00', room: 'The Cube', what: 'Record the podcast.' },
    ],
    leaveWith: [
      'A brainstorm of everything it takes to launch this venture this fall',
      'A first step, a timing, and an owner on each',
      'Those things on the roadmap',
      'Venture roles named through the end of the year',
      'The first sales experiment teed up',
      'The podcast recorded',
    ],
    morning: {
      title: 'Two rooms',
      who: 'Product and go-to-market',
      goal: '',
      exercises: [
        {
          name: 'Product wrap-up',
          time: '9:00–11:30',
          room: 'The Curve',
          lane: 'product',
          steps: [
            'Heads-down time to wrap up Thursday’s work — stories, requirements, and the ticketing system.',
          ],
        },
        {
          name: 'Go-to-market wrap-up',
          time: '9:00–11:30',
          room: 'The Cube',
          lane: 'gtm',
          steps: [
            'Heads-down time to wrap up Thursday’s work — website, pitch deck, and first sales motion.',
          ],
        },
      ],
    },
    afternoon: {
      title: 'Venture Ops, then launch',
      who: 'Entire team, then go-to-market, then the podcast',
      goal: '',
      exercises: [
        {
          name: 'Brainstorm what it takes to launch',
          time: '11:30–12:30',
          room: 'The Curve',
          steps: [
            'Brainstorm the specific things needed to launch this venture in the fall. Example: support, onboarding, VAs, legal, billing, hiring.',
            'For each one, draft the first step: what needs to be done, and assign an owner.',
            'Place these things on the roadmap.',
          ],
          exercise: {
            title: 'Brainstorm prompts',
            steps: ['Placeholder — we’ll fill in this exercise before Friday.'],
          },
        },
        {
          name: 'Role expectations and ongoing maintenance',
          time: '12:30–1:30',
          room: 'The Curve',
          steps: [
            'This is about roles on the venture, not owners of the tasks on the wall.',
            'Talk through individual team member roles and responsibilities.',
            'Decide which meetings we keep through the end of the year.',
            'Review Tuesday’s goals and confirm we accomplished what we set out to do.',
          ],
          exercise: {
            title: 'Discussion prompts',
            steps: ['Placeholder — we’ll fill in this exercise before Friday.'],
          },
        },
        {
          name: 'Tee up the first experiment',
          time: '1:30–3:00',
          room: 'The Cube',
          steps: ['Ensure Davie’s first sales experiment is ready to go.'],
        },
        {
          name: 'Record the podcast',
          time: '3:00–5:00',
          room: 'The Cube',
          steps: [
            'Justin and Davie talk with Jacob about how they got to Upline, what interests and excites them about the opportunity, and why they wanted to work with Gitwit.',
          ],
        },
      ],
    },
  },
];

export function sprintDayById(id: string | undefined): SprintDay | undefined {
  return SPRINT_DAYS.find((d) => d.id === id);
}
