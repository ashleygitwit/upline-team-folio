# Happy path v2.5 (Ashley's v2 in the Upline library)

Ashley's v2 (`Ashley_v2_sept_22` on Through Line), screen for screen, rebuilt in the Upline shadcn library. Through Line shows it as **Amanda_v2.5_sept_27** under Prototype, between Ashley's v2 and Amanda's v3.

The content, the order and the behavior are Ashley's. Her build only exists as a compiled single file (`internal-comms/public/prototype.html`), so the data in `src/data.ts` was carried over from it word for word, and every screen was rebuilt from what her code does. What changed is how it's drawn: the design hub's components and tokens in place of her own CSS.

This is a prototype, not the product. Everything is canned.

Until Sept 28 this folder held Amanda's overview-and-renewals pass (the Monday email, the Outlook notification, the retention overview and the renewals list). That version is in git history, and v3 carries its direction forward.

## The walk

Eight stops, with Ashley's names, from the Jump to menu:

1. **Sign in.** Stacey's details are filled in.
2. **Renewal queue.** Retention data (the weekly chart, average retention, against last year, leads to sales) and the outreach board: Ready to reach out, Shopping, Ready to send rec, Closing. Filters, Board or List, search, and Last week's outreach. A card opens the household in a sheet, on the tab for its stage, with Details one tab over. Sending the Callahans moves the walk on.
3. **Insured inbox.** Stacey's outreach on Dana's phone.
4. **Questionnaire.** A note from Stacey, five questions, and thanks.
5. **Shopping.** The board again, with the Callahans being shopped. Quotes are in. Continue moves the walk on.
6. **Rec email.** Stacey's recommendation on Dana's phone.
7. **Proposal.** Stockton Hill's page for Dana: the note, the pick, what changes, and yes or no.
8. **Closing.** The board again, with the Callahans approved. Closing them out ends the walk.

Desktop or Mobile shows on the three board stops, as in v2. Mobile draws the board inside a 390-wide phone, with each column as a row of cards to swipe, and sheets and dialogs open inside the phone.

## What the library changed

- **Components.** Buttons, badges, cards, sheets, dialogs, tabs, fields, inputs, checkboxes, radios, the progress bar and tables are the design hub's own Upline-mode files (`upline-design-hub`, `src/components/ui`). The dialog was re-copied and the tabs copied from the hub on Sept 28, so they're its latest versions.
- **Tokens.** Blue 600 in place of Ashley's indigo, Radio Canada / Radio Canada Big / Reddit Mono in place of DM Sans, Fraunces and DM Mono, square corners and hairlines in place of rounded, shadowed cards.
- **Lime.** Lime is retired, so everything Ashley marked in lime (the Callahans' card, the recommendation callout, the closed-won card) carries blue 100, accent 01, at 30%. At 30% the gray captions on it still clear 4.5:1.
- **Gold, orange and green.** The library has no gold, warning or success colors. The current-carrier column is set off in gray 50 with a label, the shop in progress sits on gray 100, and price changes are an arrow and a number in the text color, as in v3. Red is kept for Action needed, on the flag icon only, so the label clears contrast.
- **The retention chart.** Teed up, sent and renewed are blue 100, blue 300 and blue 600, one hue light to dark, since households move through them in that order. Blue 100 is 1.6:1 on white, so the chart keeps its legend and hover numbers and carries a table for screen readers.
- **Stockton Hill's screens** (the phone, the questionnaire and the proposal) are the agency's, not Upline's: `.agency` in `src/index.css` swaps `--primary` for Ashley's agency green, and adds her amber and cream, so every component inside follows. They use the Upline faces rather than Fraunces.

## Components to confirm against the kit

- **Popover** (`src/components/ui/popover.tsx`) and **Select** (`src/components/ui/select.tsx`) aren't in the hub yet. They're shadcn's radix-vega files with the hub's Upline-mode treatment (square, a hairline in place of a shadow, the input's white field, a full-strength focus ring), added for the board's filters and the life-quote amount.

## Placeholders to know about

- Carrier logos are "Logo here" slots, as in v2. The hub has marks for Nationwide and Travelers but not Auto-Owners, Erie or Grange.
- The phone is Ashley's simple drawing (a notch, the status bar, Mail's header), not a real device. It keeps a device's rounded corners.
- The Zillow links open real Zillow searches for invented addresses.
- Everything else Ashley flagged as synthetic still is: Stockton Hill, Stacey, the Callahans and the other households are made up.
- Desktop only, apart from the board's Mobile view.

## Run it

```bash
npm install
npm run dev
```

Opens on port 5305, so it can run beside v3 on 5310.

## Publish it to Through Line

```bash
npm run export
```

Builds one self-contained HTML file (fonts included, no network needed) into `internal-comms/public/prototype-v2-5.html`.
