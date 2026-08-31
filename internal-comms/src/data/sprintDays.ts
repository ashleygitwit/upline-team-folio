export type SprintDayId = 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface SprintRole {
  who: string;
  ask: string;
}

export interface SprintExercise {
  name: string;
  time?: string;
  who?: string;
  steps: string[];
  snapshot?: boolean;
  link?: { href: string; label: string };
  rolesLabel?: string;
  roles?: SprintRole[];
  lane?: 'product' | 'gtm';
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
  agenda: { time: string; who: string; what: string }[];
  leaveWith: string[];
  morning: SprintHalf;
  afternoon: SprintHalf;
}

export const SPRINT_DAYS: SprintDay[] = [
  {
    id: 'tuesday',
    when: 'Tuesday',
    date: 'September 8',
    theme: 'Journeys — thesis, sales path, then the product map.',
    href: '#/sprint/tuesday',
    glanceBeats: [
      {
        label: '9:00–12:30',
        text: 'Everyone together. Review the week, roles, and the venture thesis, then Claire’s GTM workshop — ICP, sales journey through onboard, awareness, OMTM.',
      },
      {
        label: '1:30–4:30',
        text: 'Create the product experience map from the strawman. After the walk, everyone answers the same questions from their seat. Then we name flagships for Wednesday.',
      },
    ],
    objective: 'A sales journey through onboard. A product map the room owns. Wednesday knows what to sketch.',
    agenda: [
      {
        time: '9:00–9:30',
        who: 'Everyone',
        what: 'Review the week’s goals and purpose. Talk through roles. Align on the venture thesis.',
      },
      {
        time: '9:30–12:30',
        who: 'Everyone · Claire leads',
        what: 'GTM workshop: ICP, sales journey through onboard, awareness, content, OMTM.',
      },
      { time: '12:30–1:30', who: '—', what: 'Lunch' },
      {
        time: '1:30–3:30',
        who: 'Product + JV + Davey',
        what: 'Create the product experience map. Claire synthesizes the morning alone.',
      },
      {
        time: '3:30–4:30',
        who: 'Product + JV + Davey',
        what: 'Everyone in the room answers from their seat. Then we name what we sketch tomorrow.',
      },
    ],
    leaveWith: [
      'Value-adds pinned',
      'ICP + sales journey with owners, through onboard',
      'A product experience map the room owns',
      'Flagship features and must-not-ignore risks for Wednesday',
    ],
    morning: {
      title: 'Together',
      who: 'Ashley, Austin, JV, Davey, Jacob, Claire',
      goal: '',
      exercises: [
        {
          name: 'Ground in the thesis',
          time: '9:00–9:30',
          who: 'Ashley opens',
          steps: [
            'Review the goals, agenda, and purpose of this week.',
            'Talk through roles.',
            'Review the venture thesis and make sure we are aligned.',
          ],
          link: { href: '#/', label: 'Open the venture thesis' },
        },
        {
          name: 'GTM workshop',
          time: '9:30–12:30',
          who: 'Claire leads',
          steps: [
            'Refine the ICP.',
            'Map the sales journey: Awareness → Contracting → Onboarding. Name an owner on each.',
            'Identify how we create awareness — outbound, paid, events, and what already worked.',
            'Identify the content and systems needed to execute on the sales journey.',
            'Set OMTM and Friday goals.',
          ],
        },
      ],
    },
    afternoon: {
      title: 'Product',
      who: 'Walk the map, then the room answers. Claire synthesizes during the walk.',
      goal: '',
      exercises: [
        {
          name: 'Create the product experience map',
          time: '1:30–3:30',
          snapshot: true,
          steps: [
            'We will start from the existing strawman, not a blank wall.',
            'We will go section by section, step by step.',
            'For each stretch we will ask: Is this how it should work? Should we revise, drop, or add anything?',
            'As we go, we will name the risks and the unknowns. We will not solve them in this room.',
          ],
        },
        {
          name: 'Everyone answers',
          time: 'After the map · 3:30–4:00',
          steps: [
            'What is the riskiest or biggest unknown?',
            'What is going to take the most time?',
            'Is there anything we need to answer, address, or resolve before we can move on?',
          ],
          rolesLabel: 'Answer from your seat',
          roles: [
            { who: 'Amanda', ask: 'UX and UI.' },
            { who: 'Austin', ask: 'Data.' },
            { who: 'Engineer', ask: 'Build.' },
            { who: 'Ashley', ask: 'User value.' },
            {
              who: 'JV / Davey',
              ask: 'Sales SME — the end user, through a sales lens.',
            },
          ],
        },
        {
          name: 'What we sketch tomorrow',
          time: '4:00–4:30',
          steps: [
            'As a team, we will identify the flagship features — the ones this experience cannot live without.',
            'Our working guess is the dashboard, the recommendation, and the household profile.',
            'We will name the risks we cannot ignore, especially anything that looks infeasible.',
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
    theme: 'Sketch the flagship moments. GTM sets up systems and maps the site.',
    href: '#/sprint/wednesday',
    glanceBeats: [
      {
        label: '9:00–2:00',
        text: 'Product sketches Tuesday’s flagship moments. Austin and the engineer work feasibility in parallel. GTM onboards JV and Davey to the systems and works the pitch deck.',
      },
      {
        label: '2:00–5:00',
        text: 'The team reviews the sketches at 2:00 and gives feedback. Product revises from 3:00 to 5:00. GTM maps the website.',
      },
    ],
    objective:
      'The flagship moments are sketched. Feasibility is named. JV and Davey are on the systems. The site has a sitemap.',
    agenda: [
      {
        time: '9:00–2:00',
        who: 'Product',
        what: 'Breadboard and sketch Tuesday’s flagship moments. Austin and the engineer work feasibility.',
      },
      {
        time: '9:00–2:00',
        who: 'GTM',
        what: 'Onboard JV and Davey to the systems. Work the pitch deck.',
      },
      { time: '12:00–1:00', who: '—', what: 'Lunch' },
      {
        time: '2:00–3:00',
        who: 'Everyone',
        what: 'Review the sketches together and give feedback.',
      },
      {
        time: '3:00–5:00',
        who: 'Product',
        what: 'Revise the sketches from the team’s feedback.',
      },
      {
        time: '3:00–5:00',
        who: 'GTM',
        what: 'Map the website against the sales journey. Name the highest-priority pages.',
      },
    ],
    leaveWith: [
      'Breadboards and sketches of Tuesday’s flagship moments',
      'Sketches revised after the 2:00 review',
      'Feasibility notes from Austin and the engineer',
      'JV and Davey onboarded to GTM systems',
      'Pitch deck edits named',
      'A v2 sitemap and the highest-priority pages',
    ],
    morning: {
      title: 'Two rooms',
      who: 'Product: Ashley, Amanda, Austin, engineer · GTM: Claire, JV, Davey, Megan',
      goal: '',
      exercises: [
        {
          name: 'Breadboard the flagship moments',
          time: '9:00–11:00',
          who: 'Ashley, Amanda, Austin, engineer',
          lane: 'product',
          steps: [
            'Use Tuesday’s flagship moments.',
            'Name what is on each moment, what someone can do, and what decision it supports.',
          ],
          link: { href: '#/mvp-journey', label: 'Open the strawman' },
        },
        {
          name: 'Sketch and check feasibility',
          time: '11:00–2:00',
          who: 'Amanda and Ashley sketch · Austin and the engineer research',
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
          who: 'Claire, JV, Davey, Megan',
          lane: 'gtm',
          steps: [
            'Walk JV and Davey through the systems they will use: Gmail, Drive, Slack, Attio, Lemlist, and ringless voicemail.',
          ],
        },
        {
          name: 'Work the pitch deck',
          time: '11:00–2:00',
          who: 'Claire, JV, Davey, Megan',
          lane: 'gtm',
          steps: [
            'Critique the current deck.',
            'Name the edits and improvements.',
          ],
        },
      ],
    },
    afternoon: {
      title: 'Together, then two rooms',
      who: '2:00 everyone · 3:00 product and GTM',
      goal: '',
      exercises: [
        {
          name: 'Review the sketches',
          time: '2:00–3:00',
          who: 'Everyone, including Jacob and Dan',
          steps: [
            'Look at the sketches together.',
            'Give feedback on how to improve them.',
          ],
        },
        {
          name: 'Revise the sketches',
          time: '3:00–5:00',
          who: 'Ashley, Amanda, Austin, engineer',
          lane: 'product',
          steps: [
            'Revise the sketches from the team’s feedback.',
            'Put the new versions on the wall.',
          ],
        },
        {
          name: 'Map the website',
          time: '3:00–5:00',
          who: 'Claire, Megan · JV and Davey as needed',
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
    theme: 'Plan, scope, and requirements.',
    href: '#/sprint/thursday',
    glanceBeats: [
      {
        label: '9:00–12:30',
        text: 'Write the feature list from the journey and the sketches. Keep or kill each one. Size what stays, and set a launch date.',
      },
      {
        label: '1:30–5:00',
        text: 'Product writes stories into Linear. Go-to-market works the website and the pitch deck.',
      },
    ],
    objective: 'A scoped MVP and a launch date.',
    agenda: [
      {
        time: '9:00–12:30',
        who: 'Ashley, Amanda, Austin, engineer, JV, Davey · Claire sits the cut',
        what: 'Write the feature list. Place each one above or below the line. Size what stays. Set a launch date.',
      },
      { time: '12:30–1:30', who: '—', what: 'Lunch' },
      {
        time: '1:30–5:00',
        who: 'Product',
        what: 'Write epics, stories, and done-means. Set up Linear.',
      },
      {
        time: '1:30–5:00',
        who: 'Go-to-market',
        what: 'Heads-down on the website and the pitch deck.',
      },
    ],
    leaveWith: [
      'A feature list with each item above or below the line',
      'T-shirt sizes and a launch date',
      'Stories in Linear',
      'Website and pitch deck in progress',
    ],
    morning: {
      title: 'Together',
      who: 'Ashley facilitates',
      goal: '',
      exercises: [
        {
          name: 'Write the feature list',
          time: '9:00–10:15',
          who: 'Ashley, Amanda, Austin, engineer, JV, Davey, Claire',
          steps: [
            'Put Tuesday’s journey and Wednesday’s sketches on the wall.',
            'Write one card for each feature the experience needs.',
            'Do not size or kill anything yet. List first.',
          ],
          link: { href: '#/mvp-journey', label: 'Open the strawman' },
        },
        {
          name: 'Keep or kill',
          time: '10:15–11:30',
          who: 'Ashley, Amanda, Austin, engineer, JV, Davey, Claire',
          steps: [
            'This is the above-the-line / below-the-line exercise.',
            'For each feature, place it above the line or below the line.',
            'Above the line is in the MVP. Below the line is later — including AMS replacement, full automation, and logging in and being live.',
          ],
        },
        {
          name: 'Size and set a date',
          time: '11:30–12:30',
          who: 'Ashley, Amanda, Austin, engineer, JV, Davey, Claire',
          steps: [
            'T-shirt size what we kept: S, M, L, or XL.',
            'Sequence the work. Name what has to happen before something else can.',
            'Set a launch date.',
          ],
        },
      ],
    },
    afternoon: {
      title: 'Two rooms',
      who: 'Product and GTM',
      goal: '',
      exercises: [
        {
          name: 'Write the stories and set up Linear',
          time: '1:30–5:00',
          who: 'Ashley, Amanda, Austin, engineer',
          lane: 'product',
          steps: [
            'Turn what we kept into epics, then into stories.',
            'Write the requirements and what done means on each story.',
            'Set up Linear so the build has a home before we leave.',
          ],
        },
        {
          name: 'Website and pitch deck',
          time: '1:30–5:00',
          who: 'Claire, Megan, Davey',
          lane: 'gtm',
          steps: [
            'Heads-down time on the website.',
            'Heads-down time on the pitch deck.',
          ],
        },
      ],
    },
  },
  {
    id: 'friday',
    when: 'Friday',
    date: 'September 11',
    theme: 'Make sure we have considered everything it takes to launch this venture this fall.',
    href: '#/sprint/friday',
    glanceBeats: [
      {
        label: '9:00–12:00',
        text: 'Brainstorm everything it takes to launch this venture this fall — not only product and go-to-market. Draft a first step, a timing, and an owner. Place those things on the roadmap. Then name venture roles.',
      },
      {
        label: '1:00–5:00',
        text: 'Claire and Davey launch the first sales experiment from 1:00 to 3:00. Jacob, JV, and Davey record the podcast from 3:00 to 5:00.',
      },
    ],
    objective:
      'We have considered everything it takes to launch this venture this fall — not only the product and the go-to-market plan.',
    agenda: [
      {
        time: '9:00–12:00',
        who: 'Entire team · Mike + Patrick if they can',
        what: 'Brainstorm what it takes to launch. Name the roles.',
      },
      { time: '12:00–1:00', who: '—', what: 'Lunch' },
      {
        time: '1:00–3:00',
        who: 'Claire, Davey · Megan as needed',
        what: 'Launch Davey’s first sales experiment.',
      },
      {
        time: '3:00–5:00',
        who: 'Jacob, JV, Davey',
        what: 'Record the podcast.',
      },
    ],
    leaveWith: [
      'A brainstorm of everything it takes to launch this venture this fall',
      'A first step, a timing, and an owner on each',
      'Those things on the roadmap',
      'Venture roles named through the end of the year',
      'Davey’s first experiment live',
      'The podcast recorded',
    ],
    morning: {
      title: 'Together',
      who: 'Entire team',
      goal: '',
      exercises: [
        {
          name: 'Brainstorm what it takes to launch',
          time: '9:00–11:15',
          who: 'Entire team · Mike + Patrick if they can',
          steps: [
            'Brainstorm the specific things needed to launch this venture in the fall. Example: support, onboarding, VAs, legal, billing, hiring.',
            'For each one, draft the first step: what needs to be done, and assign an owner.',
            'Place these things on the roadmap.',
          ],
        },
        {
          name: 'Name the roles',
          time: '11:15–12:00',
          who: 'Entire team',
          steps: [
            'This is about roles on the venture, not owners of the tasks on the wall.',
            'Talk through individual team member roles and responsibilities.',
            'Decide which meetings we keep through the end of the year.',
          ],
        },
      ],
    },
    afternoon: {
      title: 'Launch, then record',
      who: 'GTM, then Jacob, JV, and Davey',
      goal: '',
      exercises: [
        {
          name: 'Launch the first experiment',
          time: '1:00–3:00',
          who: 'Claire, Davey · Megan as needed',
          steps: ['Launch the first sales motion we built on Thursday.'],
        },
        {
          name: 'Record the podcast',
          time: '3:00–5:00',
          who: 'Jacob, JV, Davey',
          steps: ['Record the podcast.'],
        },
      ],
    },
  },
];

export function sprintDayById(id: string | undefined): SprintDay | undefined {
  return SPRINT_DAYS.find((d) => d.id === id);
}
