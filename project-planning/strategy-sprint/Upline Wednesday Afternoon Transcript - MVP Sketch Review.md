# Upline Wednesday Afternoon Transcript - MVP Sketch Review

**Date:** Wednesday, September 9, 2026 (afternoon session)
**Session:** Strategy sprint · MVP wireframe / sketch review
**Reviewed:** Business dashboard wireframe ([`product/wireframes/business-dashboard.html`](../../product/wireframes/business-dashboard.html)), then the agent proposal and insured proposal flow from the coverage-review demo ([`go-to-market/agent-demo/`](../../go-to-market/agent-demo/))
**Framing going in:** [`sprint-week/wed-wall.md`](../sprint-week/wed-wall.md) — "What do the flagship moments look like, and can we actually build them?"

**Source note:** Recorded live in the room and screen-shared from Cursor. Wording is preserved. The recording labeled turns as Speaker 1–4 and did not name them; Speaker 1 is Ashley (presenting the dashboard) and Speaker 3 is Amanda (presenting the agent proposal). Speaker 2 and Speaker 4 are not named in the source, and diarization drifts in a few places — a handful of turns are attributed to the wrong number, most visibly in the Medicare/AMS stretch where the agency-owner voice appears under Speaker 1. Labels are left exactly as the recording produced them rather than corrected by guess. Names mentioned aloud (Doug, Brandon, Stacey, Jolene, Patrick, Jacob, Dan, Davey, Megan, Josh, Mike, Jeff Brimmer, James, Justin) are preserved as spoken.

---

## Contents

**Part 1 — Business dashboard (Ashley)**
1. [Framing and walkthrough](#1-framing-and-walkthrough)
2. [Permissions: owner vs. producer](#2-permissions-owner-vs-producer)
3. [Time in process, and what Upline can't see](#3-time-in-process-and-what-upline-cant-see)
4. [One place where the data lives, and quantifying it](#4-one-place-where-the-data-lives-and-quantifying-it)
5. [Renewals as the anchor number](#5-renewals-as-the-anchor-number)
6. [Empty state and the reporting lag](#6-empty-state-and-the-reporting-lag)
7. [Whether the numbers will be trusted](#7-whether-the-numbers-will-be-trusted)
8. [Data hygiene as a metric](#8-data-hygiene-as-a-metric)
9. [Simplifying down to two numbers](#9-simplifying-down-to-two-numbers)
10. [Upline retention vs. book retention, and exclusions](#10-upline-retention-vs-book-retention-and-exclusions)
11. [Attribution and the credit problem](#11-attribution-and-the-credit-problem)
12. [Framing the first read](#12-framing-the-first-read)
13. [Mobile, month-in-review, progressive unlock](#13-mobile-month-in-review-progressive-unlock)
14. [What owners already know, and why current reporting isn't trusted](#14-what-owners-already-know-and-why-current-reporting-isnt-trusted)
15. [Ashley's takeaways, and the swap with Amanda](#15-ashleys-takeaways-and-the-swap-with-amanda)
16. [Who else is actually in the product](#16-who-else-is-actually-in-the-product)
17. [Why reporting exists at all](#17-why-reporting-exists-at-all)

**Part 2 — Agent proposal and insured page (Amanda)**

18. [Walkthrough of the agent screen](#18-walkthrough-of-the-agent-screen)
19. [What the insured sees, and which carriers to show](#19-what-the-insured-sees-and-which-carriers-to-show)
20. [Collapse what's the same, surface what's changed](#20-collapse-whats-the-same-surface-whats-changed)
21. [Endorsements, and checking the VA's work](#21-endorsements-and-checking-the-vas-work)
22. [Recommendation vs. talking points](#22-recommendation-vs-talking-points)
23. [Household snapshot and questionnaire answers](#23-household-snapshot-and-questionnaire-answers)
24. [Where the email lives in the flow](#24-where-the-email-lives-in-the-flow)
25. [Long term: signature and payment](#25-long-term-signature-and-payment)
26. [Who gets a phone call](#26-who-gets-a-phone-call)
27. [Referrals and closing the loop](#27-referrals-and-closing-the-loop)

**Part 3 — Validation and pilots**

28. [Getting this in front of real users](#28-getting-this-in-front-of-real-users)
29. [Pilot sequencing](#29-pilot-sequencing)
30. [Design partner and investor overlap](#30-design-partner-and-investor-overlap)

**Part 4 — Logistics**

31. [Tomorrow: pricing, then feature prioritization](#31-tomorrow-pricing-then-feature-prioritization)
32. [Scheduling](#32-scheduling)

---

## What came out of the room

**Business dashboard — decided:**
- Strip it down to two numbers: how many households are up for renewal, and how many renewed. Cut the middle of the funnel (shopped / switched / waiting on response).
- Cut the "ask Upline anything" chat overlay. Not worth developing now, and a bad first chat experience is unrecoverable.
- Drop the percentages; raw counts are enough early.
- Separate **Upline retention** from **book retention**. The book number is where the wash and the bad data will be.
- No native mobile app for MVP. The delivery mechanism is likely a monthly email, possibly with a PDF, that doubles as the trigger to log in.
- Progressive unlock: show what isn't populated yet, keep the cadence regular, let insights open up as data accrues.
- MVP owner reporting can slip. There will be no data until roughly December for a customer starting in September.

**Business dashboard — open:**
- Is it a page at all, or a month-in-review email plus a thin card on the work board?
- Whether to add referral / cross-sell asks-and-conversions as the second tier of data.
- Whether the first read is a gated, guided call so we control the narrative.
- Where financial performance (premium, revenue, commission) enters, since the current wireframe has none.

**Agent proposal — decided:**
- Collapse everything that is identical across carriers. Surface only what changed, with a way to drop down the detail.
- Flip the hierarchy: three to five talking points for the agent come first, the comparison table goes behind a link or a dropdown.
- Position Upline as showing its work, not as "Upline Recommends™."
- Let the agent toggle which carriers the insured sees.
- The insured gets a landing page linked from the email, not a quote pasted into the email body.
- Include the household snapshot from the questionnaire — Susie turned 16, new baby, congratulate them.

**Agent proposal — open:**
- Whether a quote can legally go straight into an email body (raised, disputed in the room, unresolved).
- Whether the insured page is gated by a date-of-birth check.
- What the recommendation email preview looks like and where it sits in the flow.

**Ownership change:** Ashley and Amanda swapped. Amanda takes the business dashboard / month-in-review (it reads as product marketing). Ashley takes the agent proposal and insured page revision.

**Illustrative numbers used in the room** (all hypothetical wireframe data unless noted): 30 outreach emails/week, 22 opened, 11 questionnaires, 8 through the funnel, 22 hours saved, 130 households with 128 retained, 96–98% Upline retention, ~86% and 97% as book retention numbers an owner might already have, $700/mo price point, $40k/yr service staffer, 12,000 records in the Members First system (real), Nov 6 launch date (tentative).

---

# Part 1 — Business dashboard (Ashley)

## 1. Framing and walkthrough

**Speaker 1:** Okay, so I'm going to start the transcript first, make sure that we have that. Then I'm going to jump over and do a little context switching, because we've— or not context, but, like, setting the stage a second— because we haven't all been together yet today. Um, and then I'm going to screen share.

**Speaker 2:** He was, like, on a call, but I'm not sure if he was recording.

**Speaker 1:** Oh, yes. Yeah. And he can have that chair over there. Okay, let's see. It should automatically screen share. Yes. Nice. Great. Okay. I'm going to— wait, maybe I shouldn't share yet. Hold on. Let me just set context real quick. Whenever Doug gets near. Okay, so this is going to be a wireframe review. They'll look designed. They are absolutely not designed. It's just that we've been, like, working in Claude and Cursor, whatever, because it has all the context, all that stuff. Anyway.

**Speaker 2:** Did you get help with design it?

**Speaker 1:** Yes. And sometimes I've tried to actually, like, pull away the design before and then spent an hour trying to un-design the design. So, um, yeah, so we'll review designs. The main pages that we have: I worked on the business dashboard. I have a lot of questions for the room, so that's where I definitely am transcribing now. We need to talk about specific data that's shown. We need to talk about what decisions you're making from that page, your biggest intent going to that page. I kept circling back around saying, "I'm going to this page for confidence and upline. Is that truly my number 1 with this page?" So I have a lot of questions, but I'll review what I have. Just to be totally transparent, I feel very conflicted about the page. Like, I feel a little bit like it's expected, and not in the best way. So ways that we can also push the envelope here, and how we want to think about this differently.

And then Amanda has the agent proposal piece, so how you're being presented to all the carriers that are shopped. And then I believe— tell me if you got to the— yes. Okay, perfect. Then also the— what the client, the policyholder sees in their visual as well, because those are kind of— I mean, they're definitely connected. So she'll have those too. So I think I'll start with the business dashboard one, since that's kind of, like, higher level. If you're the agency owner, that's the first page you're going to see. So I'm going to start there. I'll go top to bottom, kind of like what we usually do. Top to bottom, I'll talk through my thinking on what I have and the areas that I am very uncertain. Um, and then I'm just going to review it in here. So it's a little rough. But, um— or not rough, but I'm going to review it just straight in Cursor.

Um, okay, so this is what we have right now. The thought is, if you're the agency holder, you land on this number 1 page. I went back and forth a lot on what you show first. This is, like, one of our biggest conversations out the gate, is what we would see out the gate. So right now I opted for the retention funnel, and then you can change that to this week, this month, this year, or a custom date range.

And so then I'm seeing— I kept going back to, if I'm the agency owner, I think I loved, like, the use case you had: I'm out of the golf course, I'm, like, I'm out pursuing brand new sales. I want to come back and have peace of mind that upline is making sure that my entire book of business is taken care of. So now I'm able to see, like, exactly how— so let's go to, like, week, because it's, like, 30. How many outreach emails were sent, opened, completed, shopped, recommendations sent, and then from there, how many have stayed or switched carriers.

And then below here, it's how many quotes generated across all carriers. I don't really know if we even need to do that, but the thought is you'd be able to see, hey, if I quote 2, 3, 4 per person, and then, you know, I'm able to see how many quotes, which then helps tell me, like, that would have been a lot of time that I would be spending on there. I also have, like, number of hours, like, time saved in general. Again, I don't know if either of those are like big things you want to hit home with. Um, and then average— I need to get rid of this one. I wanted to get do away with that. But then, like, average savings per switched customer on your funnel.

Then from there, you move into, like, retention across your entire book of business. So then you have, like, last year, your average, and then, like, the trajectory that you have starting just from January. I went back and forth on, like, I don't think you can then do, like, this week because it's all lagging so much. You're not really going to have your retention per week. Like, even with month, whenever we ran it with members first, you don't really get those month numbers, like, the next month later. So then that one, it's like you're really kind of just doing from your view, or you could say, I don't know, quarter, or rolling 90 days, or something, but it gets a little bit weird on what that looks like. So then I just set it to, like, this year so far.

Then you have, like, premium, like, the premium update. So basically the thought is, like, you want to show that you're saving your clients money, but then overall, like, the book, like, it increases at the same time. How many people were, like, asked to be quoted for Home Umbrella or Life? How many new policies were written? And then how many referrals were provided? And then that's kind of about, like, your business overall.

And then basically recent activity. This is where you start to really get into, like, nitty-gritty, and I don't know if an agency owner really needs to see this. But the thought is, if you have activity, like, this went back to the use case of, like, what if something's ready to buy? And, like, how do you know that, like, someone is notified and they're at least aware? And the thought is, if you click into each of these, it goes directly to that customer's profile, which then you can see the full 360, what's been happening, the history. You can take action if you want to directly from there. Again, you can filter by certain time period or a specific name. And then anything that, like, would most likely need, like, an agency owner's, like, ac— like, activity or attention, because there's, like, serious consequences if you don't take action on it. Those would be highlighted or identified in one way or another.

And then other that— other than that, the way I, like, categorize these was, like, of the activity happening. It's not going to just, like, catalog every person that just had a renewal and they did nothing. Like, that wouldn't show up here. It'd be like large life events. Maybe you want to reach out to them. It would be they switched carriers and, like, you may— I don't even know if an agency owner wants to know every individual person that switches a carrier. Or maybe they do. Um, anyway, so we can discuss, like, what type of activity will live here. Those are the three main categories.

And then I kept trying to figure out, this feels so expected to me, and that's what I'm really struggling with. And I think if we say, "Oh, no, like, this makes sense, we should move in this direction," we can haggle the data that's shown and where it's shown. But then I was like, okay, well, how do you, like, really get, like, more enriching data from this? It's like, okay, well, what if instead there's an overlay that's an ask upline anything? And I ha— I, like, worked with chat to come up with a few different, like, models, like, how would I communicate in, like, a more intelligent thing. And the thought is, okay, well, what if your default is you open your drawer instead of it just being an empty chat? It gives you your, like, brief. And it gives you an overview of, like, you know, here's what's been happening. This is a lot of information. Again, I'd want to dive down into, like, what data are you showing? What would be included in the brief? All of those.

But then you could choose, like, okay, give me a 5-minute overview. And it runs through, and there's, like, a few kind of, like, baked-in, like, more or less exercises that it's, like, packaging the data for you. But your prompt is just, like, a question. But then we basically show that a few different ways. So then if I say, like, what is the data saying? It's, like, generating this, like, these visuals on the fly based on stuff. And then I can, like, follow a rabbit trail from there and say, okay, now this one is saying tell me more, and it's generating unique, specific-to-me visuals, which is pulling a thread that Jacob had talked about yesterday of, like, dynamic visualization based on what I'm looking for. But I just had a hard time moving away from the idea that, like, I think I would still want some kind of home base that I come back to over and over again.

Okay. That's my overview, high level. Tear it up. I think there's so much room for improvement on this. So we want to get started.

## 2. Permissions: owner vs. producer

**Speaker 2:** My first question is, we already talked about permission levels in terms of agency owner versus, right? That immediately is going to change what this says.

**Speaker 1:** Mm-hmm.

**Speaker 2:** Is permission levels.

**Speaker 1:** So.

**Speaker 2:** Is an agency owner is going to want to see financial performance, book performance, overall.

**Speaker 1:** Gotcha. Okay.

**Speaker 2:** Whereas a user.

**Speaker 1:** Yeah.

**Speaker 2:** Even a power user doesn't care about the book. They care about the tasks to get done. Things that aren't open.

**Speaker 1:** Yeah.

**Speaker 2:** Things like that. So.

**Speaker 1:** So this is assuming not the user.

**Speaker 2:** This is agency owner.

**Speaker 1:** Because I imagine there's a full dashboard for that.

**Speaker 2:** Right.

**Speaker 1:** The agency owner, but that's a great point. This does not touch any of the financial piece.

**Speaker 2:** Right.

**Speaker 1:** And it should.

**Speaker 2:** Yeah.

**Speaker 1:** Okay.

## 3. Time in process, and what Upline can't see

**Speaker 2:** I just think that, you know, um, overall, I think a good question is like, hey, from outreach email to action taken, whether they renewed or bailed or stayed the same or had a cross-sold or whatever.

**Speaker 1:** Mm-hmm.

**Speaker 2:** How much time? Because that could— that's a.

**Speaker 1:** Okay.

**Speaker 2:** What's the average amount of time in the upline process? Upline journey.

**Speaker 1:** Yeah.

**Speaker 2:** Upline, you know, whatever. Because that's a number that we can go back in relationship touches and try to tell them, teach them how to compress those, that timing.

**Speaker 1:** Okay.

**Speaker 2:** And to get basically the bind, the renewal, the upsell, the cross-sell closer to the moment the email is out.

**Speaker 1:** Mm-hmm.

**Speaker 2:** Right? Because we love pipelines, we love stages, but the faster we can get everything done.

**Speaker 1:** Yeah.

**Speaker 2:** The faster the agency can go on to do other things. That might be one metric to include is average time in process or something like that.

**Speaker 1:** So then that's a great thing as it relates to, like, anytime we have referrals, upsell, cross-sell, that kind of thing. We want that more closely rel— like, tied to the funnel. Assuming, like, here's when the ask happened, and then here's time to close on that.

**Speaker 2:** Closing time.

**Speaker 1:** Okay. Which then I had a question of, like, with time to close, though, the way we've been treating upline right now, is that time to close on net new sales is out of upline's control. So how are we getting that data back into the system at that point without, like, a user triggering that?

**Speaker 2:** Fair point. I think.

**Speaker 1:** So.

## 4. One place where the data lives, and quantifying it

**Speaker 2:** The way that this adds a ton of value outside of what upline actually does is giving access to one consolidated place where all the data lives.

**Speaker 1:** Okay.

**Speaker 2:** And that's why the agency owner won't quit it. Because they come back and use it, like you said, on the golf course.

**Speaker 1:** Mm-hmm.

**Speaker 2:** Even if they're not doing anything in it.

**Speaker 1:** Yeah.

**Speaker 2:** Right? What they sold agency Zoom forever to agencies was, hey, you as an owner, you get to see your book.

**Speaker 1:** Yeah.

**Speaker 2:** And what's in stages. How— what's in quoted, what's in waiting on response, whatever.

**Speaker 1:** Okay.

**Speaker 2:** I think upline can do a better job of displaying that information for the agency owner with the power that we have here.

**Speaker 1:** Okay.

**Speaker 2:** So I think two layers to it. An actionable, like, number of things done.

**Speaker 1:** Mm-hmm.

**Speaker 2:** 30 outreach emails, X amount of emails open, etc. And you had it down below, but then, like, hey, this has turned into X amount of dollars.

**Speaker 1:** So that's more of the turn we need to make as opposed to, like, activity done, which is just a let me see peace of mind into.

**Speaker 2:** What does that mean?

**Speaker 1:** Transformation. Financially. Okay.

**Speaker 2:** Yeah. And even if there's not a hard dollar amount.

**Speaker 1:** Yeah.

**Speaker 2:** Hours saved.

**Speaker 1:** Okay.

**Speaker 2:** You know what I mean?

**Speaker 1:** Yeah, yeah, yeah.

**Speaker 2:** Quantify something that the agency owner can walk away with by looking at, okay, we sent out 30 and we got 10.

**Speaker 1:** Mm-hmm.

**Speaker 2:** That's a pretty good ratio.

**Speaker 1:** Okay.

**Speaker 2:** Oh, that, according to this source of truth, which remember, they inherently trust us because they onboarded with us and are paying us money.

**Speaker 1:** Mm-hmm.

**Speaker 2:** According to this source of truth, I'll save my staff 4 hours this week.

**Speaker 1:** Yeah.

## 5. Renewals as the anchor number

**Speaker 2:** And then just to be clear on the model piece. So the 30, that's a, a number that we placed, like, we're, we're only going to work 30, like, their top 30, or?

**Speaker 1:** No, that's just the working number we've been using up to this point. It's really— I don't think we ha— I don't think we have a limit per se. It's everyone who falls within the certain radio.

**Speaker 2:** So then what I would change that first, or not change, but maybe add the first column there is number of renewals this month.

**Speaker 1:** Ooh, okay.

**Speaker 2:** And then.

**Speaker 1:** And then.

**Speaker 2:** Out, out, outreach say, it could be 100, or maybe it's 99 or 98 because they have this kind of, like, do not email this customer or whatever.

**Speaker 1:** Gotcha.

**Speaker 2:** And that way we can show, because then if I'm looking at it from a— to Davey's point, if I just want one place to go and check in.

**Speaker 1:** Yeah.

**Speaker 2:** I know how many renewals I had this month, and then I can look at the endpoint number and I can quickly do the math in my head. Because I kind of did that scroll down a little bit.

**Speaker 1:** Yeah.

**Speaker 2:** Like, the 22 hours saved.

**Speaker 1:** Yeah.

**Speaker 2:** So then I'm thinking in my head, what would I have to pay my own VA for 22 hours? How much am I paying this? And I'm trying to do the math in my head.

**Speaker 1:** Okay.

**Speaker 2:** Just to make sure that doesn't hurt us.

**Speaker 1:** Yeah, that's the other thing I struggled with. It's like, out the gate, the first month or few months, this may not be something we turn on is the simple answer. But, like, what happens if any of these numbers are then not favorable for upline? Like, that's— there were so many things I went back and forth on with some of that stuff where I was like, then do you get— I don't necessarily want to be abstract because I want it to truly be, like, a representation of how it's going. But I don't want it to be anywhere where, like, you could bring that to a meeting and be like, this is why I'm canceling upline.

**Speaker 2:** So it's not.

**Speaker 1:** Because of the data you present.

## 6. Empty state and the reporting lag

**Speaker 2:** The second question I had is, we would need to figure out what the blank view of this is.

**Speaker 1:** Okay.

**Speaker 2:** Because we won't be able to populate anything in here for, like, at least several weeks.

**Speaker 1:** Yeah. And maybe it's just.

**Speaker 2:** When I talked to James about this, he was basically like, we should have— have the agency sign a two-year contract. And so I remember yesterday we said, like, well, the, the magic moment for the agency owner, anything that makes them worthy of us.

**Speaker 1:** What's 13?

**Speaker 2:** Is, like, seeing this. But if we're thinking about, like, what we prioritize to build it and, like, the decisions we need to make this week.

**Speaker 1:** Yeah.

**Speaker 2:** I almost feel like we could launch an MVP without this because there wouldn't be any data anyway in the first place. There's no risk the agency's churn if they don't have this data. And even if we waited until 9 months out to actually build this and have our first customer success meeting and say, here's how you're doing this, your agency owner, I think that's okay. And we'll know so much more about what they want to see in this dashboard after we've had 9 months of sales calls.

**Speaker 3:** I was thinking it could be something as simple as they type in what they want from chat or generate a data table from the chat, has the capability to add into this, and then they build their own dashboard.

## 7. Whether the numbers will be trusted

**Speaker 2:** So maybe, but that also introduces the other, like, huge problem I have, which is this isn't going to match what they see in their AMS. We ran into this with the members first pilot. I said, well, your current retention rate's 97%.

**Speaker 1:** Yeah.

**Speaker 2:** We didn't move the needle. And you were like, oh, well, the Medicare people and the blah, blah, blah.

**Speaker 1:** Yeah.

**Speaker 2:** And what about commercial lens? And I just feel because I, I spent, like, the majority of my career making dashboards like this, and it's the worst fucking thing because no one agrees on, like, if the data is accurate because we're going to have just a small subset. And, like, what if we exclude the people who have a motorcycle policy because we haven't turned our VAs on? Anyway, I'm just saying, like, it's fun to, like, vibe code it and be like, cool, we're going to make something like this, but execution on this is so hard.

**Speaker 1:** It's hard. Yeah. There are a lot of questions on this. I'm not adverse to, like, your very, very first question. I'm not adverse. I've used it more and more tools where, like, they just say there's not enough data to visualize anything yet. And you literally have to, like, log time into it before that's unlogged. And I'm even okay with that serving as an empty state from just, like, a user experience standpoint for a while. But the other things you have are big questions I have as well. Is, like, if it's not truly accurate representational data, it gets a little.

**Speaker 3:** But you have all the data of, like, just you'll have, like, the activity data of, like, we sent this many.

**Speaker 1:** Yes.

**Speaker 3:** These many reports.

**Speaker 1:** You have that data for sure.

**Speaker 3:** You'll have that data that we could, we could just do, like, not, like, as many financials.

**Speaker 1:** Yeah.

**Speaker 3:** And I think you just, maybe you just start with activity that it's going to be empty for a month.

**Speaker 2:** And then maybe it's a retention piece of our clients for the agents that 6 months, kind of to your point, maybe that's when we have 6 months' worth of data. It's halfway point of the contract. If we're doing annual or whatever, then we're checking in, we give you this, and then if it's good, then going forward, you just have access to it.

**Speaker 1:** Or even an, an idea that I had is, like, what if this, depending on your permission levels, is an overlay that's more of, like, a card, not a full dashboard page on top of the, like, traditional, here's your client outreach queue. You have, like, whatever, an overlay card, pop-up model, pop-up model sucks, but, like, whatever, something that's like, here's how things are trending. Like, I mean, I use Whisper Flow, and it's like, unlock your voice when you have a certain number of logged. And it's just a little, like, a small little card. It's like, this is your voice cell, this is what you do, these are your stats. And if it's treated almost more of, like, here's your retention compared to over, like, over time, or even if you introduce something that's more of, like, just the chat element and, like, not this data, but that amount of overview, I ran into the issue where it felt like I have a whole page. How do I fill a whole page worth of data? And then you get to the end of the page and it's like, there's too, I've, there's probably too much here.

**Speaker 2:** I think the chat is even, it's great, but it's unnecessary or in the game.

**Speaker 1:** Yeah. Too much.

**Speaker 2:** It's just not worth developing at this point.

**Speaker 1:** Yeah.

**Speaker 2:** No one's even going to know.

**Speaker 1:** It's a lot.

**Speaker 2:** To go in and ask, what, what impressions do I ask?

**Speaker 1:** And what's hard is, like, if that chat is not a great experience, you'll never, ever, ever use it again.

**Speaker 2:** Yeah.

**Speaker 1:** Like, out the gate.

**Speaker 2:** It's a great thing for sure, but.

**Speaker 1:** Yeah.

**Speaker 3:** The other thing about just having usage data, then you can make it more consistent for owner versus producer. Because producer can just be my individual usage data.

**Speaker 2:** Mm-hmm.

**Speaker 1:** And then owner can just roll up all the producers.

**Speaker 2:** Agreed.

**Speaker 1:** Okay.

**Speaker 2:** And to that point, and even we've been at Austin's thought here is like, yeah, these objective numbers. How many emails got sent?

**Speaker 1:** Yes.

**Speaker 2:** How many open? How many questions? And I think, again, listening to Austin's here, you don't even need the percentages here yet. You know, in.

**Speaker 1:** Yeah. Probably don't. Just the numbers.

**Speaker 2:** I just, hey, real quickly on the owner, 30 emails sent, 22 open. Cool. That's my, that's my 700 bucks. They're sending emails. My team is sending the emails that upline said they would write for them, personalize that get people to open them. 30 were sent, 22 were open. Oh, we also sent out some questionnaires and 11 of them got they know the, the, they know it's declining, but.

**Speaker 3:** And then.

**Speaker 2:** The MVP there, you know?

**Speaker 1:** Yeah, which I.

**Speaker 2:** Even the outcome could be hit early on, right? It's like, kind of up to you to figure it out.

**Speaker 1:** Yeah, because you're not going to know outcome for at least a few months. Everything is, like, in the members first. The two things we reference over and over and over again is basically your combat board of the individual people moving through.

**Speaker 2:** Yep.

**Speaker 1:** And then afterwards, it's the funnel of, like, how, how did things go? Those are the two things that I, when I think back, those are the only two things we really kept going back to.

## 8. Data hygiene as a metric

**Speaker 2:** Yeah. Maybe one thing that we could have done a better job of and could be worth incorporating here is the data hygiene piece.

**Speaker 1:** Okay.

**Speaker 2:** And it could be, like, we corrected 12 phone numbers last month, or.

**Speaker 1:** Yes.

**Speaker 2:** We just talked about that.

**Speaker 1:** That's true.

**Speaker 2:** Other two, yeah, to get into the, once we get to the delete your AMS or, like, giving them the idea of, like, well, why do I have any? Like, it's kind of, like, psychologically planting that seed.

**Speaker 1:** Yeah. That's cool.

## 9. Simplifying down to two numbers

**Speaker 3:** Also, the one thing about that funnel visualization is it, like, makes it look like only eight people.

**Speaker 2:** Yeah.

**Speaker 3:** I capped eight people.

**Speaker 1:** Like dead, yeah.

**Speaker 3:** Which you probably kept, you know, 20 of those people.

**Speaker 2:** Yeah.

**Speaker 3:** This is just the upline funnel.

**Speaker 2:** It's like, if we could zoom out and just be like, what's the one metric that matters that we would put at, like, the top left of a dashboard? Retention rate.

**Speaker 1:** Yeah.

**Speaker 2:** Yeah. But it's very.

**Speaker 1:** Yep. It's this thing here.

**Speaker 2:** And I, I do think total number of renewals per month. Because I, right now, I think I have to run, like, several I have to run, like, several reports and usually needs to figure that out.

**Speaker 1:** Okay.

**Speaker 2:** Like, I don't know how many. We couldn't put a dollar value to that too.

**Speaker 1:** Yeah.

**Speaker 2:** For sure. We couldn't put a commission value. And I have a bunch of other really. Well, in the future, we could talk about the incentives and how you, like, play the game.

**Speaker 1:** Yeah.

**Speaker 2:** Yeah.

**Speaker 3:** Will we, um, will they, like, market? Will we be able to just see if someone, like, doesn't shop, doesn't fill out a questionnaire, but renews?

**Speaker 2:** We would need our, our community to go back to EasyLinks.

**Speaker 3:** And pull it again.

**Speaker 2:** Look up that, look up Claire's profile and say, oh, she didn't know. Okay, maybe that's the number then. We don't even talk about.

**Speaker 1:** Shop stuff.

**Speaker 2:** We don't talk about how many shopped, how many switched, how many did we're waiting on. It's literally like, you had 70 people up for renewal, and then maybe the number at the end is, like, last month, because we might not know yet. So, like, okay, October, you have 79 people that are renewing. In September, we renewed X amount. And then maybe it's a percentage there, maybe. But then if I can know, like, okay, well, shit. I mean, because then what we want them to understand is that the people that renewed and did nothing.

**Speaker 1:** More than.

**Speaker 2:** Some of them did it because we talked to them. You never talked to them. So we can't, that's not, nothing on here is to.

**Speaker 1:** No.

**Speaker 2:** Like, illustrating.

**Speaker 1:** Well, this was the closest to it. But that's not, it's not saying what you're saying though.

## 10. Upline retention vs. book retention, and exclusions

**Speaker 2:** Right. I, yeah, I think, like, this second piece should be just like a, almost like a count from the 30 of upline saves or, yeah, how many, you know, you know what I mean? It's almost like, it's almost like there's an upline retention number versus the book retention number, because that's where the wash and the incorrect data will be. But the argument we'll make is like, yeah, you probably didn't put everything through upline, but what that was dumb of you. Because upline performs at a 98% retention rate, whereas you're, like, what are the reasons why somebody's not going to send a personalized email from upline to their insurer? Why would you not? Why would you opt them out? Any reason?

**Speaker 1:** Well, with members first, it was like there was one person that y'all knew.

**Speaker 2:** Yeah.

**Speaker 1:** Yeah. He was like board of directors. It's like a personal.

**Speaker 2:** So it should be clients or we, we only did it only in Iowa. So if they had something random like a farm or a motorcycle or an RV, we excluded those people just because, like, and I think for MVP, like, we might have to, unless you have a good way to, like, figure out how to train the VAs and then we have to modify the questionnaire. So it's like.

**Speaker 1:** Not for farm.

**Speaker 2:** Auto and, I mean, I'm sorry, motorcycle and toys, those are easy, but.

**Speaker 1:** Okay.

**Speaker 2:** Not for farm. Yeah.

**Speaker 1:** Yeah, they were confused on the questions they ask on farm. It was like, a lot of options there.

**Speaker 2:** I guess what I'm saying is when I have somebody looking, if I'm, like, on call, I'm looking at the data with me, and I'm like, look, of the accounts you use upline on, we're at a 96% retention rate. So why. And notwithstanding farm and things like that, like, this is your book.

**Speaker 1:** Yeah.

**Speaker 2:** This isn't, this is your personalized book. Is every customer's getting touched by upline, and that's turning into a 96% retention ratio. That's better than some of the reports that you're going to piece together.

**Speaker 1:** For sure.

**Speaker 2:** Way more accurate.

**Speaker 1:** Maybe an easier way, at least for MVP, is like, the top left number is average number or, you know, your, whatever the math terminology is for your total renewals for 12 months divided by 12. This is what it is. And then last month, we, we retained X amount, or I don't know. Or maybe it's a toggle between actual average or, I don't know. That's what I wanted too. Like, do we get those at, like, do we get average stuff as part of our onboarding so that it's like a static number? Are we able to go pull?

**Speaker 2:** For me, it's even simpler than that.

**Speaker 1:** Reports.

**Speaker 2:** Like, accounts saved by upline. Or accounts.

**Speaker 1:** But we want to, we want to insinuate that every account that stayed was because we had some renewal then.

**Speaker 2:** Yeah. And that's.

**Speaker 1:** Yeah.

## 11. Attribution and the credit problem

**Speaker 2:** I haven't found a good way to articulate, like, how it would be a predictive model, right? It would be like, I think there's a 20% chance that next month Claire is going to turn her renewal. We saved her, and so do we take 80% credit for it? And, like, do we even believe in that 20% in the first place? It all comes back to, like, scroll down a little bit. There's that dotted gray line. We don't have a good source of truth for that. Even you couldn't tell me what that is, and we couldn't come to terms and still have it on what that number was for members first. And so, and we have a good relationship with each other. How am I going to do that with someone who I'm trying to sell to and prove that I can create value?

**Speaker 3:** I think you just lay the foundation for, like, the AMS is building over 13 months. Like, it's like, you, you unlock the insights as we have enough data to build them.

**Speaker 2:** How many accounts?

**Speaker 1:** Which.

**Speaker 2:** This scenario, 30, 30 emails were sent.

**Speaker 1:** A week.

**Speaker 2:** Is that 30 accounts or 30 emails?

**Speaker 1:** 30 emails, which represent each household. Like, each email represents like an account.

**Speaker 2:** In this scenario of those 30, how many did are still member customers of the agency? Haven't left, haven't quit, haven't.

**Speaker 1:** Eight?

**Speaker 3:** No. She's not accounting for.

**Speaker 1:** No, like, how many just didn't leave?

**Speaker 2:** Yes.

**Speaker 1:** Oh, see, like.

**Speaker 2:** So 30 was the initial.

**Speaker 1:** I mean, like, in the scenario we're talking about, like, a 98% retention.

**Speaker 2:** So 26 of the.

**Speaker 1:** Yeah. It's like, yeah, like 26 of the 30 stayed. But see, that's where it gets weird because it's like.

**Speaker 2:** We just go monthly from day one to day 31 each month.

**Speaker 1:** Yeah.

**Speaker 2:** Right?

**Speaker 1:** We're saying, like, 120 emails would be sent there.

**Speaker 2:** Okay.

**Speaker 1:** 98% of those people stayed with, stayed with members first.

**Speaker 2:** We retained.

**Speaker 1:** We retained.

**Speaker 2:** And then you have 120 of your customers out of your 130.

**Speaker 1:** Yeah.

**Speaker 2:** Is a very powerful number.

**Speaker 1:** And, like, is that number just alone that suffices? I don't need any of the other.

**Speaker 2:** That was the.

**Speaker 1:** Okay.

**Speaker 2:** That whole second rectangle.

**Speaker 1:** That would streamline everything.

**Speaker 2:** 130 households, 128 are still here.

**Speaker 1:** Yeah.

**Speaker 3:** And then you could, you could get into, like, the activity.

**Speaker 1:** Yeah, because there's, like, the upline activity that positively contributed.

**Speaker 3:** Yeah.

**Speaker 1:** But then to Austin's point, it's like, we have to kind of be, like, a little bit into saying, like, we can't say direct attribution to each of those saves, but.

**Speaker 3:** You should put it next to each other.

**Speaker 1:** Yeah, you should put it next to each other.

**Speaker 2:** Personally, as an agency owner, if I, we know they're not doing any of this now.

**Speaker 1:** Yeah.

**Speaker 2:** Right? So you can't attribute it. So I, well, I think you don't, I think you leave out all the stuff in the middle.

**Speaker 1:** Okay.

**Speaker 2:** And it's literally whatever, however we land on how many people are renewing and how many people renewed or how many people are up for renewal and how many people renewed.

**Speaker 1:** That's it.

**Speaker 2:** That's the number one.

**Speaker 1:** Number one.

**Speaker 2:** I don't give a shit how you did it because I'm, I wasn't doing it previously. So why don't you care. I'm not going to take your idea and do it. I couldn't do it before.

**Speaker 1:** Yeah.

**Speaker 2:** 130 accounts, 128 stayed.

**Speaker 1:** Yeah.

**Speaker 2:** From January 1 to January.

**Speaker 1:** And then when we, if we feel like we need more stuff to show here, then it's how many times do we ask for a referral and how many times do we get one? How many times did we ask for life insurance and how many times stuff that's going to generate revenue and stuff that I know I need to do, but I'm not doing.

**Speaker 3:** Okay, great.

**Speaker 1:** I don't need to know all this. Then that simplifies. Yeah. I mean, that simplifies everything, which is very helpful.

## 12. Framing the first read

**Speaker 2:** And then also just to reiterate, so, like, if we had a customer who started today, September, I don't know, 7th or 8th, where does the time go? We would start sending out emails now for renewals happening in October. We wouldn't have all of that information ready to show. Really, we wouldn't have a full month until December.

**Speaker 1:** Yeah.

**Speaker 2:** And so just to think through, like, as you guys put together how you do customer success and, like, check in with your existing customers and how we build, like, the MVP state of this to show maybe your insights will be available on November 1st or whatever. Is there going to be, like, a check-in where it's like, okay, let's go ahead and get some time on the books for November 1st. We'll walk you through your initial data. We'll strategize with your team some ways that you can get them through these, like, cross flows because we know that's a place where some agencies fail sometimes. And so at least you're framing the narrative of, like, they don't just walk in here and it's like 86% retention. That's what I already had. Yeah. I, I think it's also okay to call that out somewhere on here that, that we're on a 30-day lag on reporting or, you know.

**Speaker 1:** And even maybe, I like the idea of, like, your first time you do this, there's a trigger where you get on a phone call with them. We could password protect, like, a certain page or section where it's like, you get on the call and you're like, all right, let's pull up your account. Let's type in, let's take a look, and you can then explain some of this data the first time they're seeing it to help maybe control the narrative if that's beneficial for the first time. I don't know.

**Speaker 2:** Dummy proof it as much as possible with, like, a quick, quick little, like, pop-out guide.

**Speaker 1:** Yeah.

**Speaker 2:** Here's how to interpret this data. Click this, like, the book time.

**Speaker 1:** Yes. Because that's the risk with this wall of data. It just never ends. And it's like, there's just too much and too many opportunities for misinterpretation of stuff.

## 13. Mobile, month-in-review, progressive unlock

**Speaker 2:** To be honest, we need, I need to be able to see it on this.

**Speaker 1:** Yeah.

**Speaker 2:** Like, number up.

**Speaker 1:** That sounds great. So if I just do, like, a mobile version.

**Speaker 2:** Mobile-friendly.

**Speaker 1:** Then it's like, are you even just, like, doing push notifications of, like, it's Monday?

**Speaker 3:** Or just your, like, you know, when you, like, I have a budgeting app and it's like, oh, September in review.

**Speaker 2:** Yeah.

**Speaker 3:** And it's like, ah. It's like, let me see.

**Speaker 1:** I like that.

**Speaker 3:** It's like, oh, no.

**Speaker 1:** And then there's your just September in review. And you could almost have it as if it's like your invoices.

**Speaker 2:** Well, and EasyLinks has an agency pulse, I think I shared with you. So what's important about your current reporting? Like, what does that, you don't trust it?

## 14. What owners already know, and why current reporting isn't trusted

> Diarization note: the agency-owner voice describing the Medicare book appears here under Speaker 1. Treat the speaker numbers in this stretch as unreliable; the content is preserved.

**Speaker 1:** Yeah. So it's because there's no agency management system that's built for Medicare. Like, they typically, Medicare agency doesn't, the P&C, they don't do both. And those have no, they're no premium a lot of times, and there's no expiration date because they just stay in the plan until they don't. So then there's literally all of, like, we have 12,000 or something like that. There's people that are dead, but, like, it just shows that they, like, we had, I mean, we were originally because there was not even a function at all, we were putting, like, a renewal date of, like, 2045 or some shit. So it's showing that 100% of those are renewing, and then it's skewing the personalized numbers. And then, yeah, and we've changed management systems three times in three years, and there's duplicates and there's, yeah. So I have, like, we hired an engineer and she's going through, and we're doing, like, a single source of truth on data for everything for all the organizations. And it's outside of this. And then the idea is to kind of pump it back in and clean it up, hopefully.

**Speaker 3:** Do you know, is it, like, common for an owner to, like, have their book value number?

**Speaker 1:** Like, how much their premium?

**Speaker 3:** Yeah.

**Speaker 1:** Yeah.

**Speaker 3:** Okay.

**Speaker 1:** Yeah.

**Speaker 3:** So that's not, like.

**Speaker 1:** They're going to know their premium. They're going to know their revenue. They're going to know roughly how many policies they have in force. They're not going to know how many, they're not going to know, they don't ever say, like, I have 45 customers. Like, it's like, I've got premium, revenue, policies.

**Speaker 3:** Okay.

**Speaker 1:** They know.

**Speaker 3:** Do they know new policies month over month?

**Speaker 1:** Month over month. They, yeah.

**Speaker 3:** Okay.

**Speaker 1:** Yeah.

**Speaker 2:** So they've got some sales tool that's pumping or sales reporting.

**Speaker 1:** I mean, I have, like, I mean, because they wouldn't put the stuff in the system, I make them do, like, a spreadsheet.

**Speaker 2:** Yeah.

**Speaker 1:** It's all manual.

**Speaker 2:** Sell that.

**Speaker 1:** We are not going to pay you.

## 15. Ashley's takeaways, and the swap with Amanda

**Speaker 1:** Okay. So this streamlines things so much. So sorry this was underwhelming, but this conversation was incredibly beneficial for this because it was very easy to just get down a rabbit hole with all this stuff. So, okay, this is good. I think even with this in mind, there's a good chance my next iteration won't even be like its own designated page. Or if it is, it's more of, like, a month-end review style page, not like a, I have my dashboard that I go to to review whatever. It's more of just snapshot or.

**Speaker 2:** I've gotten about three different images of what this looks like too. I don't know why I won't share all of them, but.

**Speaker 1:** Yeah.

**Speaker 2:** One of them looks like the Atari, the end of it looks like the Atari logo.

**Speaker 1:** Yeah. On this?

**Speaker 2:** Yeah.

**Speaker 1:** Yeah. Yeah, this is like, yeah.

**Speaker 2:** Yeah, I just see.

**Speaker 1:** It's a lot going on.

**Speaker 2:** I think you simplified quite a bit.

**Speaker 1:** I agree.

**Speaker 2:** It's still possible. So, yeah.

**Speaker 1:** Hey, Amanda.

**Speaker 2:** Like.

**Speaker 1:** Okay.

**Speaker 2:** Do you have any stuff to, like, refine this or, like, do you have questions about, like, if this is technically feasible or, I don't know.

**Speaker 4:** No, I think everything looks pretty feasible.

**Speaker 1:** My thought was from three to five, I'm doing another version of this based on the feedback.

**Speaker 2:** This is that agency pulse that EasyLinks has.

**Speaker 1:** To put to everyone.

**Speaker 2:** After the end of the month, it's like, that's what they're putting on theirs. But I don't think anybody.

**Speaker 1:** Okay.

**Speaker 2:** What I do is I just take it and I dump it into this chat thread that I have on cloud every month, and then it tells me what changed month over month, but I don't trust the numbers that they.

**Speaker 1:** Okay. That's the thing I'm worried about. Is it just looking like another.

**Speaker 2:** Right. Which we don't want to do. That's why I think we just need to make it super simple.

**Speaker 1:** Yeah, I agree.

**Speaker 2:** We've had this many people.

**Speaker 1:** And also we're going to have feature flow with all this.

**Speaker 2:** And this is all the other stuff that we did that you don't do that you.

**Speaker 1:** Yeah. Okay.

## 16. Who else is actually in the product

**Speaker 3:** What else, will the agency owner have, like, a full product? They won't really be going in there to do anything else, right?

**Speaker 1:** They wouldn't go in there. Or at least the assumption is. The agency owner is not going in there, but they'd have access to the full, the way we handle it with, like, the non-interface is like it is a true combine board. So it's like you see all outreach queued up for the week, and then as it moves through the funnel. So the thought is the agency owner would have access to every individual person in the status, and they could look at all that.

**Speaker 3:** But they would, yeah.

**Speaker 1:** But they wouldn't.

**Speaker 3:** Unless they're like, we've said ICP agency owner is often a main producer.

**Speaker 2:** Yeah.

**Speaker 1:** Wait, what was that again?

**Speaker 3:** Agency owner is a producer.

**Speaker 2:** Yeah. But even then, not really.

**Speaker 3:** Not really.

**Speaker 2:** Personalized, no. Yeah. Even usually commercial and life is what the agency owner will do. Unless it's tiny, tiny, tiny. And even the.

**Speaker 3:** We had one.

**Speaker 1:** We did talk to one the other week. It was like just him and one other guy. But it was, or one other girl, but it was like, yeah, it's so tiny. Like, it was.

**Speaker 2:** Yeah. Yeah. I think a lot of those instances will be cut by our minimum threshold.

**Speaker 1:** Yeah, yeah.

**Speaker 2:** However, even in the scenarios where the agency owner is producing, there's a lot of delegation. Oh, yeah. I mean, hey, I just talked to Steve. He gets quote whipped up and gets filed for.

**Speaker 3:** I mean, what I do personally is like, you're like, I want insurance. I'm like, cool.

**Speaker 2:** Joelina is going to reach out to you. Like, I'm not, we can't connect link or something.

**Speaker 1:** Yeah. Yeah. Okay. Are you good to share? All right. I mean, I'm just going to jump into hers. This was super helpful. So I'm, between three and five, I'm going to do another version of this that tomorrow we can look at and get feedback on that direction there.

**Speaker 3:** What's your takeaway from the conversation we went back and forth a lot?

**Speaker 1:** Mine is number one is that we're going to simplify, like, basically everything into just, like, upcoming renewals coming up and then the number that renewed, knowing that, like, certain information might be like, you're blocked out until you've been using upline a certain amount of time. Also, like, the caveat that, like, this is, like, kind of a lagging number. Like, it's not as of, yeah. And then I may experiment with what it would look like to show just the next level there down of the activity that upline's doing, but I don't even know if we need that. If the agency owner has access to that full, like, the combo work board and they can basically see all those numbers there. So I'll play around with what that looks like. And then the other thing I'll play around with is whether that's going to be, like, invoice style, like, your year, like, your month-end review style that, like, you could get, like, a push notification, like, open that up. Or if it's more just going to be, like, maybe, like, a headline that only if you have certain permission levels instead of your combo board at the top, it just shows this is what it looks like. And it's like a kind of a thinner card, which is like an early iteration of the product had something like that-ish.

**Speaker 2:** So double clicking a push notification, is it fair to say for MVP, like, no native mobile apps.

**Speaker 1:** Yeah.

**Speaker 2:** But as an agency owner.

**Speaker 1:** Of email.

**Speaker 2:** They're just getting the emails from EasyLinks. So maybe it's like a monthly, like, that's your trigger to maybe it's attached as a PDF or maybe it's like an email or I don't think there'd be any, like, PII that would have needed to hide, like, we put all of it in the email.

**Speaker 1:** Right.

**Speaker 2:** PDF attachments.

**Speaker 1:** If that's the case to even need. Do you need anything in a dashboard? Is it all just an email you get once a month?

**Speaker 3:** I could.

**Speaker 1:** For the MVP, like, can I just literally you design a well-designed email that that data is updated once a month and you get it.

**Speaker 2:** Yeah, so it's just like a performance review.

**Speaker 1:** Yeah. And then that way you're not always walking in going, it has updated.

**Speaker 2:** Like, I just logged in, like, my credit card. Like, I'm trying to think of other things that show you, like, it has a credit score, has a change, has how much my mortgage is, how much my property is worth, how much I'm spending.

**Speaker 3:** Or like, your, like, Vanguard account or whatever. Your investment over time. You want to see growth and it's like your return, you know.

**Speaker 1:** But then it's like hard because, like, retention, it's like, it's like a weirdly almost a negative-based number.

**Speaker 2:** It's always not going to be 100.

**Speaker 1:** Yeah, so it's never going to be 100. And then, like, there's kind of like a cap and we're like operating with the assumption we're already almost at the cap. You know what I'm saying? Like, yeah. There's like kind of a weird visual.

**Speaker 2:** And then eventually, like, policies because we don't have a good way to.

**Speaker 1:** Yeah.

**Speaker 3:** Yeah.

**Speaker 2:** And I guess we could, like, try to.

**Speaker 1:** Watch the downloads or.

**Speaker 2:** I mean, it gets really tricky with our integration. Like, when we were doing this, like, bulk export with RPA, like, I would have it run overnight just to get, like, a handful of policies. So that gets tricky.

## 17. Why reporting exists at all

**Speaker 2:** So the fundamental reason a dashboard or some kind of reporting needs to exist is this makes it more likely that on month 13, you sign on to keep.

**Speaker 1:** For what?

**Speaker 2:** To leave the AMS.

**Speaker 1:** Oh, yeah. That was a question I didn't ask. Is that the number one driver of this page?

**Speaker 3:** Well, so I think also, like, if we do this whole, I think you could show, like, your insights being like unlocked and released the more you use it. And that builds kind of this expectation of, like, it's getting smarter. You're able to see more data. So it's kind of building to this, like, and now you.

**Speaker 2:** Like, I don't have my bank account connected to this, so it just has, like.

**Speaker 1:** Yeah. Of what's locked.

**Speaker 3:** Yeah. But if it's kind of like, oh, you've used it long enough that now you, we can unlock this dashboard because now there's, like, actually stuff to do it. And, like, it's just sort of like this. You didn't even know you were building this.

**Speaker 2:** Yeah.

**Speaker 3:** And now here it is.

**Speaker 1:** Okay. And maybe the trigger for that is that first email you get. And maybe you don't get a first an email on the first month.

**Speaker 3:** Maybe it will.

**Speaker 1:** You get an email on the two.

**Speaker 3:** It just shows you just, like, what's not even populated yet.

**Speaker 1:** Oh, true.

**Speaker 3:** Yeah.

**Speaker 2:** Yeah.

**Speaker 3:** But I think keeping that email cadence regular.

**Speaker 2:** Okay. The Wispr did a good job of this. Of, like, the first few days you wear it, it's like just collecting baseline and it's like, it doesn't even show you what your HRV is because everyone's HRV is different. And it's like, well, keep wearing it. You're on day three. On day seven, we're going to show you.

**Speaker 1:** Okay.

**Speaker 2:** I like that.

**Speaker 1:** All right. I'll go through to design that. The Humi Health app or whatever does that as well. Okay. And then Wispr does a lot of that.

**Speaker 3:** Damn it.

**Speaker 1:** Yeah, that's true. Okay. Yeah, I was using the, like, chat health integration feature and trying to pull from some of that. But I started running into, like, the same problem here is that all of a sudden now I'm just, like, adding data to, like, make it feel.

**Speaker 3:** We can review what I did too, but I'm just recalling the conversation we just had of how you were ruminating on how you weren't pulled into marketing conversations. This is essentially more of a marketing ask in my mind. It's like a product marketing split. So we can potentially swap.

**Speaker 1:** Ooh, yeah. Let's swap after this.

**Speaker 3:** Yeah.

**Speaker 1:** Yeah. Let's do that. That sounds awesome.

**Speaker 3:** So because when I'm.

**Speaker 1:** Right. Yeah. Her and I will then switch wireframe. So I'll wireframe her revision and she'll wireframe mine. That'd be great.

---

# Part 2 — Agent proposal and insured page (Amanda)

## 18. Walkthrough of the agent screen

**Speaker 3:** What I realized when I was putting this together is I do not have the technical knowledge of the founding seat. So a lot of the technical information here needs work. But what I'm showing you is essentially the same level that we just went through. Ashley's the way that we did because it's the same type of review where I'm looking for feedback on the general gist of what I put together. There's a ton of stuff that I would change.

So, but basically, this is the screen that the agent would get after they had shopped one of their policy holders. So here they would land on some of, so here's something that I realized that I glazed over quite a bit, which is just the details about that policy holder and what's included in that policy. And this is something that Ashley, because I have Ashley's attempt at this too, Ashley went into a lot more detail on what's included in that policy and what those details are. I had just kind of collected this information into Claude and had it organized in a way.

My primary concern here was that if agents are not doing this currently, this is something that needs to be extremely lightweight and extremely easy on them and not add an incredible additional workload on them to decide or stress out over what they actually want to recommend or what details they might be missing. It just needs to be as clear as possible.

So the way that I laid this out was keeping technical information off to the left and then off to the right. I get my left and my right next step. Off to the left is what upline would recommend a brief about why it would recommend that, what could possibly argue against that. And then these are just kind of auto-generated points about the documents that aren't reflected in the numbers off to.

**Speaker 1:** So I can see, sorry.

**Speaker 3:** I had to do the same thing.

**Speaker 1:** Yeah.

**Speaker 3:** So I'm going to glaze over this just to show you the process for the agent. So let's say this is pretty easy for them. They kind of glance at the stats that came back. They're like, okay, all right. I trust that. That checks out. They have the possibility here to shop other carriers if something like what happened to me happens to this client where they're just seeing really bad rates. Add additional PDFs if they got information outside of what's been drawn from here. And then here at the bottom is the main CTA, and that's where you would select what plan you want to recommend for your policy holder.

So here, let's say you go with the recommendation. I'm trying to work on wording here. I always knuckle down on wording and try to figure that out. But this would be something along the lines of continue to review, not continue to approve and send.

**Speaker 2:** Sheet to bind?

**Speaker 3:** Here, like, I'm.

**Speaker 2:** Oh, so this is, I'm ready to send an email to Claire that says, you should switch to Nationwide.

**Speaker 3:** Yeah. Yeah. You're saying, I want to prep that email. You're not saying, I'm sending that email. You're not saying, I'm approving this. You're just saying, let's review. So here I wanted to make sure that you have the ability to edit any of that information or add your own notes. I don't have the ability to add your own notes in this right now. This is the first time I'm going through the whole flow, so we'll see. But once you decide that, yes, this is what I want to recommend. On approval of that recommendation, this is the page that the policy holder would see.

## 19. What the insured sees, and which carriers to show

**Speaker 3:** So I made sure that this is white labeled. This would be the branding that the independent agency is under. That probably has its own series of questions because from what I've seen, they aren't. The branding isn't very in-depth. So I figured we could probably do quite a bit there to make them look good, but they aren't going to be doing that on their own. From what I've seen.

So here, the wording is all kind of iffy. I don't really like the stance of, like, we recommend. I feel like it should be more point blank than conversational. But this is super clear, super streamlined.

The only thing that I wanted to do, and I'm going to run this by you, Ashley, is we weren't going to show the additional shopped policies. We were just going to show the recommended and the current. Felt like we could show them because the information, the way that it was presented wasn't super complex. But I'm open to thoughts because I definitely.

**Speaker 2:** I would say if we could put logic in it, do we, if they stay with the incumbent because of price, we show all of them or multiple. If we're saving them money, we show the one that we're saving them money for.

**Speaker 4:** What if the price goes up?

**Speaker 3:** And you don't show the other options.

**Speaker 2:** Yeah.

**Speaker 4:** Like the renewal went up and everybody else is still up.

**Speaker 2:** I think it would follow the same. Well, yeah, maybe we show all of them. So maybe we show all of them if they all go up. We show all of them if every other option is more expensive.

**Speaker 3:** I wonder if you could have it to where the agent would be able to decide.

**Speaker 1:** Just click.

**Speaker 3:** Yeah, what they want to show.

**Speaker 4:** Somebody adds a team driver and has two claims. They're going up across the board no matter who you call.

**Speaker 2:** But we also don't want to, like, we don't want to do the work. If the first one we go to is a reputable company and it's saving them money, we're done. That's what I would think anyway.

**Speaker 3:** Yeah. That wouldn't change though. Like if you got to, so I'm thinking if you got to this screen, you say, yeah, I want to recommend this, continue. We could give you the ability to.

**Speaker 2:** I like that. Yeah.

**Speaker 3:** Turn on or off different versions of that table.

**Speaker 2:** Yeah.

## 20. Collapse what's the same, surface what's changed

**Speaker 3:** So then here, the only other thing I wanted to call out was just since this is for the policy holder, these are always, these always feel jargony to me. I give them a little.

**Speaker 2:** Yeah. I need to be jargoned, right? The other thing I would say too is back to the agent version. Do we have, like, all this, like, scroll down, like, all of the auto cover, like, is that, like, it just says auto coverage and then it's a, not a radio, whatever the button is that makes it drop down.

**Speaker 1:** Oh, the recording.

**Speaker 2:** I just feel like when I see this, I'm like, I don't even want to look at this.

**Speaker 3:** Yeah. Still too overwhelming.

**Speaker 2:** Yeah. But if it were like home coverage, like if it was, like, just where I could drop it down if I wanted to. Because I mean, honestly, like the type of operator I am, I'm going to look at the top. We're saving money. We're keeping the client.

**Speaker 3:** Yeah.

**Speaker 2:** Bitch, and send the email.

**Speaker 4:** Well, so my feedback was like, I just want to add a glance to figure out, like, what has changed and what has not. And so if collision deductible is $500 across the board, I would almost prefer that to be, like, collapsed. And, like, if I wanted to expand it, it would just be, like, maybe in green, same, same, same, same, toward full, full, full. But if there's something where, like, carrier number four only offers loss of use for $50 and they don't have the $40 tier.

**Speaker 3:** Oh, I like that.

**Speaker 4:** Then, like, I would want to know that.

**Speaker 3:** Yeah. I kind of agree. I like that, but I also like that within a totally collapsed table.

**Speaker 4:** Right.

**Speaker 3:** Are you still recording on here? Yeah.

**Speaker 4:** Can you go to the other option, like the other version?

**Speaker 3:** Ashley's.

**Speaker 4:** So, like, where, yeah, right here, like that, what changes? I think that is also acceptable to do the same thing that you're saying. Awesome.

**Speaker 3:** Oh, even for the agent view?

**Speaker 4:** Yeah. Everything is the same. Like, why do I, and honestly, what happens today, like, this is the argument maybe against this, but, like, if I'm getting a new business, but if you want your insurance quoted and you send me your deck page, what every agent in the country does is they just apples to apples. I'm just going to match all your coverages. That's not, I don't need a person to do that. I mean, right? But it's not always, that's what I thought until I went through the quoting process and it's like, there's always going to be something a little off, especially on home because I can't always get that home to be the same replacement cost.

**Speaker 2:** Right. Right. No, I, yeah, I think we're saying the same thing. So I think that if we're just copying what's there, we only need to show them what is different. We don't need to show them everything else. So I think we're saying the same thing.

**Speaker 3:** That's shocking for me because I felt like the version that I showed you for the agent was too simplified. So the fact that you can simplify it more is huge.

## 21. Endorsements, and checking the VA's work

**Speaker 4:** Well, the other thing that, and I want to hear your perspective on this, with endorsements, it was really challenging for me when shopping between different carriers where, like, Nationwide would have, like, their premium protect that has, like, 12 underlying endorsements, but they're not downhill. Like, I have to check 12 different individual boxes for those. And, like, thinking less of you as, like, CEO of Upland and you're an Upland fanboy and more almost as an agent, as if you had, like, hired a new VA and you thought they were going to, like, fuck some stuff up. What would you want to see on here to, like, fact-check their work and make sure that.

**Speaker 2:** I would want to be able to see it, but I don't want to see it when I pull it up. Like, I would want to be able to drop it down in the beginning because here's what I'm thinking psychologically. In the beginning, I'm like, they're going to fuck something up. It's my, you know.

**Speaker 4:** Totally.

**Speaker 2:** I'm going to check them, right? And I'm going to make sure they're doing the quotes the right way and they're making, how do we get the discounts, whatever. And then as I get comfortable, I'm never going to look at it again. I'm just going to send it, send it, send it.

**Speaker 3:** Okay. So I like that a lot then. So then you're saying, like, you basically just have your visual that's like your, like, what's changed overview or the new dollar.

**Speaker 2:** Yeah. What's, what's.

**Speaker 3:** What's changed.

**Speaker 2:** Not apples to apples. Yeah.

**Speaker 3:** Just listed and then section by section in a dropdown. And, like, that's all the same.

**Speaker 1:** And there you could see all the carriers shopped.

**Speaker 3:** Yeah.

## 22. Recommendation vs. talking points

**Speaker 4:** Ashley, you made a comment earlier about, like, language. You were saying more or less conversational. What was your take there?

**Speaker 1:** Yeah. She was talking about, like, wanting it less conversational and more like.

**Speaker 2:** Matter fact.

**Speaker 1:** Almost direct. Yeah. Matter of fact, like directive almost, which I think is a good question. I have personally waffled on that the last three months. Which way to lean?

**Speaker 4:** I've watched these other SaaS products, platforms, whatever, and the end user almost having an expectation that we're going to also deliver them some talking points.

**Speaker 1:** Oh, okay.

**Speaker 4:** So that they could be like, I'm the agent. I'm sitting in front of here and I want to take the thinking out of it. This says the deductible stayed the same. This happened and this happened. Hey, Steve, I'm sending you this thing. Three things I want to highlight so they don't have to search around for it and it's staring them in the face.

**Speaker 3:** It sounds almost like you would flip the hierarchy of what's going on right now. Sorry, I've got kind of a wonky demo going on. But, like, the stuff on the left, you would focus more so on as talking points for the agent, set them up for success.

**Speaker 4:** There you go.

**Speaker 3:** And then the table would be kind of either hidden behind a link or.

**Speaker 2:** Yeah. Yeah. Because all the detail from a client perspective is like, it's a contract. It's what insurance is, right? Which is nobody understands. So if we can help them tell what insurance does or what that coverage or what those changes does practically, how it impacts the customer versus like, here's all the shit that is different, that might help.

**Speaker 4:** That's what I'm saying. Three to five talking points that are right here. Hey, Steve, you added this. Your rate went here, so I moved you to this thing. The deductible's higher, but the premium's lower.

**Speaker 1:** Okay. That's another thing. So two other points is how important is it to explain upline rationale or even more generically, how much do we want the upline recommendation to be first and foremost, pushing that, explaining why versus here were the shopped carriers and it's like asterisks upline leans progressive versus.

**Speaker 2:** Let the agent decide.

**Speaker 1:** Yeah. Like how much is like the agent's deciding and you see like the upline rec is like a quick side note versus upline being like, here's the pitch of why progressive and, you know, here's all and that's when you get into like, you did this, but this, but this, and then the questionnaire told me that, like, how, what is the balance there?

**Speaker 3:** I think that's the stance where we should not lean too hard on what we recommend. This is me, but this is how I built this of like, I inherently don't trust AI until I see its logic. So if it's going to lean too hard into one recommendation and not really explain why it didn't recommend other things, I'm not going to trust it and I'm going to want to do more backend research on my end.

**Speaker 4:** Maybe not recommendations, but observations of what changed.

## 23. Household snapshot and questionnaire answers

**Speaker 1:** Because that's then the second question I have is we're going to have net new information from the questionnaires. We were seeing in some scenarios, we have eight new pieces of data that they didn't have before, which will strongly inform why we're recommending what we're recommending. You probably need to show answers to the questionnaire.

**Speaker 4:** How we got here.

**Speaker 1:** Yeah. Something around that. Yeah.

**Speaker 3:** That's where I saw that you had highlighted this information more so than I did. And I thought that that was pretty important, at least with the same caveat in mind that Justin brought up, which is like, we highlight what's changed. We give our rationale behind how that changed the quote and then like leave kind of the rest of the stuff more so hidden.

**Speaker 1:** Yeah.

**Speaker 4:** The original scenario, the first times I was to explain how this process worked from the day they bought their insurance to renewal date, they had a claim and added a driver. And so of course, their rates went up. At renewal date, insured doesn't care. They totally have forgotten that those things happen.

**Speaker 2:** Well, that's why I pay for insurance.

**Speaker 4:** Yeah. Since that it went up, upline represents an opportunity to set the agent up for success with information without having to be so bold as it being a recommendation.

**Speaker 1:** Yeah. Okay.

**Speaker 4:** However we can represent that so that they can take those talking points.

**Speaker 1:** So it sounds like then we don't need it to be full on the upline recommendation and that's like the thing, but it's upline, show your work. Like, how did we get here is more of what it is as opposed to like upline rec TM.

**Speaker 3:** I was about to do it. So show me your thinking and I might go to whatever.

**Speaker 1:** Well, the agent won't have looked at the profile between questionnaire received and policy shopped, right? So like that first, that first, it should be like Rainer House snapshot. Yes.

**Speaker 4:** Susie turned 16.

**Speaker 1:** Yeah. Susie turned 16. They had a new baby. Mentioned. Congratulate them on their new baby. And then like those things and like.

**Speaker 4:** Yes. That would be clipped. That's what I, when you said it, that's what I was describing. Thank you.

## 24. Where the email lives in the flow

**Speaker 2:** Who do you think most agents go back one screen who see this screen are planning to pick up the phone or like is the promise of upline, oh, I can glance at this. I can see which one's the cheapest. I can see, oh, there's a gap on travelers. I shouldn't recommend that one. And I can just end up an email and I don't have to take 10 minutes to go through one.

**Speaker 4:** Will this, based on whatever things are chosen here by the agent, will this also draft another email for them?

**Speaker 2:** Yes.

**Speaker 4:** So that was the other critique is click on the recommendation.

**Speaker 1:** The output is the email.

**Speaker 4:** The email draft rather than what's in here.

**Speaker 3:** Yeah. I think the.

**Speaker 1:** Which that was the newbie question I had is as a team though, how much is email, I'm going to word this terribly. How much is email for front and center versus like byproduct of this? Meaning like in this flow, it's like I'm looking at my, I'm looking at the shopped results, all this I'm seeing what the landing page looks like. And then I'm saying like, yep, go ahead and like send the email off. Versus there's an early draft where we really over and maybe not over and over, but we really emphasize the email. Where it was like, you see the shopping like, yeah, yeah, yeah, that sounds good. And your final was like reviewing that final thing because that was the client touch point. And I want to spend more time on saying like, what is the client going to see in my draft? Am I going to change things? That's when I toggle what I want to show. I don't know. Like where is the email in the agent experience? I don't know if that makes sense, that question.

**Speaker 4:** Yeah, I know what you're saying. I just think there's so much variance in how each agency will deliver that message. Some will say, screw it, just send them an email. They don't have time to be on the phones. Some will say, I'm going to call them and tell them I'm sending the email while they're on the phone with me so I can present it. And some won't even send it. They'll just call and talk through it. So I like the idea that it can create a nice email should they choose that path, whether they call and follow that up.

**Speaker 3:** This could be an email. Like if we do, there's not any information in here that's not too technical to include in an email. The table could be a link.

**Speaker 4:** But personal financial information.

**Speaker 1:** My thought is that that would be, that this would be the client landing page that you'd have a link embedded in the email that's sent.

**Speaker 4:** That I think is gated with a date of birth security check.

**Speaker 1:** Yes.

**Speaker 4:** You guys might know more about this than I do, but my interpretation was we can't put like a quote straight in an email.

**Speaker 1:** Wow. My insurance agent is.

**Speaker 2:** You're such a buzzkill.

**Speaker 4:** I could be wrong. I've never heard that. Okay. Yeah. I've never heard that. I mean, that's literally how, I mean, what we try to do as agency owners collectively is like, stop fucking emailing these in column. That's what we would typically say, which means like everyone just sends it over. Yeah.

**Speaker 3:** It was a question that was open in my mind when I was putting this together was, you know, for this demo. I can't remember. Anyway, for this demo, I'm just having it go straight from, all right, this is what you're recommending. Here's the recommendation. Preview what you're going to send to the agent. Here you set up this agent. But that's not the actual workflow that would happen. We just needed to show agent page.

**Speaker 1:** Yeah.

## 25. Long term: signature and payment

**Speaker 2:** I would also say that we need to be thinking about what, like what is the, I know not for MVP, but so that we can stay on the same roadmap is like, what is the one year from now, what is it going to be? Like I'm, hopefully it's like, we're just doing it. We're just finding the policy and.

**Speaker 4:** Yeah. I think the last step, the long term is there's a signature link and a payment link in the last email and it.

**Speaker 1:** Yes. Yeah. We in our very first concept demo had that where it was like, and then if you want, and it was like the agent had the control. It was like the agent saying, I'm going to call them, I'm going to email them. Like I'm going to email and they call me or I'm going to email and they click the link straight through, especially if you're staying with your current carrier. Or no, no, sorry. Then it just renews. If you're switching into apples to apples or type.

## 26. Who gets a phone call

**Speaker 2:** So in the today world, if I was going to prioritize who would get a phone call, there would be two people on the opposite side of the spectrum. It's going to be, it's going to be, holy shit, your shit went up and I can't help you. Like you're just screwed. Because of these reasons. Sorry, but this is what it is. So I want to try to save the relationship. And the other side would be like, we just had like this huge home run and I cut their cost in half, which I hate. So now I'm calling them because I need to cross sell them something to get the revenue back or I need to ask for a referral, which we've already done. So like I feel like we need to like lean into that piece where, you know, if we're saving somebody 700 bucks a year, send a fucking email. They're going to say, yeah, I'm in. Why do I need to, I don't need to talk to you. You just did your job. Great job. Good job. You know what I mean?

**Speaker 4:** Let the infrastructure of upline allow them to be better at their job. And those are some really soft ways that.

**Speaker 1:** Which this week is making me realize that the closing the loop on that is probably higher priorities than some of these other things that I had floating around of like things to do. But like as soon as we can be like the winner in that closed loop process.

**Speaker 4:** Yeah. Helps them get their business, helps them get their referral, and then it helps their credit.

## 27. Referrals and closing the loop

**Speaker 2:** And like, I mean, how do we even, again, I know this is not right now, I'm probably wasting time, but like when somebody says they, yes, I have a referral for you. Like how do we make that, turn that into like action? Is it quotamation link where we're getting deck pages or whatever? I'm talking about two different things, but or is it like they get a push notification immediately like in the subject time, referral, call within the next 30 minutes or something that it's like they know they need to do it, they're not doing it. So if they know they need to do it, they're not doing it, are they going to know how to do it?

**Speaker 1:** Yeah.

**Speaker 2:** Like we can't, I don't want to like bank all of a sudden and they.

**Speaker 1:** That is an interesting lens of like, tell them to call this person.

**Speaker 2:** Yeah.

**Speaker 1:** Because like this is going to be big news to them. Or like.

**Speaker 2:** Yeah.

**Speaker 1:** And like your referral engine turns into your sales. Or even on just your.

**Speaker 2:** In the normal space, and this is no, this is not demeaning, this is just factual. We're relying on somebody that we pay 40 grand a year to go in and do all of this.

**Speaker 4:** Yeah.

**Speaker 2:** So we have to be thinking.

**Speaker 4:** That's what I was talking about.

**Speaker 2:** Is that person that makes 40, back to don't spend other people's money, is the person that makes $40,000 a year going to be like, oh shit, this referral came through. Like this is real money. Oh shit, there's a life deal. Like no, they're going to be like, okay, cool. Jimmy, the sales guy will see this in AMS.

**Speaker 4:** Was the tool that my boss made me use easy to make my job easier.

**Speaker 1:** Yeah, man, if you had people like directed to like sales team and that, yeah, triggered your text message to a sales person.

**Speaker 2:** I'm thinking that it's like either they, so there's two little vendors. There's Canopy Connect, which is like you just log in and it gives them all your current deck pages. And then there's quotamation where they go and start their quote themselves. So that's two options. Or it's like literally we're setting an appointment on, you tell us, give us your producer who's going to write these referrals because we're going to get them. And we're literally just going to set the appointment right then.

**Speaker 1:** Yeah. That'd be cool.

**Speaker 2:** And again, I don't know if I need to repeat, but I just don't want to go down one path too far in the.

**Speaker 1:** I do think that's one of those things. It's like that's the risky part is like anything that's a potential loose end could easily come back and bite us sooner rather than later.

**Speaker 4:** I mean, just in onboarding, where do referrals go?

**Speaker 1:** Yeah.

**Speaker 4:** Is a huge part of the onboarding to say like, we want to make sure that a referral gets to the right person, the agency.

**Speaker 2:** I don't know.

**Speaker 1:** I almost.

**Speaker 2:** Right? You and I have talked about this. So what's our solution? Are we pairing them? Are we doing it in-house? I mean, I know none of this is going to be the next 30 days.

**Speaker 4:** We have like the pilot where I remember as first I can share that. It's probably not in the scope of over time already, but we have ideas on that.

**Speaker 2:** Right.

**Speaker 1:** Okay.

**Speaker 3:** So take words from this one. We're swapping.

**Speaker 1:** Yeah. We'll swap. I feel more energized about this than the other one I was drowning in potential data a little bit.

**Speaker 3:** That'll end up just being essentially like a monthly newsletter. I think moving forward, what I'll do is I'll design the prep state email because that'll be the first one that we send out. That's pretty important. And then I'll design out the info filled version because those are going to be pretty different.

**Speaker 2:** Do you want me to send you this easy links pulse?

**Speaker 3:** Yeah.

**Speaker 2:** You want to check?

**Speaker 3:** Yeah.

**Speaker 2:** And then I'm going to send something out, but now that my upline email's going, if we can stop emailing me on my other email.

**Speaker 3:** So I'll just move forward with those two things. If you can fill me in on the like technical details on that, I feel pretty comfortable marketing newsletter wise. We're okay with the marketing newsletter. Like it doesn't need to be from a specific agent.

**Speaker 1:** Oh. No, because it's going to the agent.

**Speaker 4:** Yeah.

**Speaker 2:** Yeah.

**Speaker 1:** It's from upline. So it's from upline to the agent. So it's super upline. We want it to be way upline looking. So that it's like, look what upline's over you do.

**Speaker 3:** All right. And then it's probably not going to be something that's going to be featured too much other than that. It just needs to be short. And then what's your plan on.

**Speaker 1:** Well, we had a lot of specific things on here, but like it was like simplifying like the stuff up top, focusing on like what's changed, having stuff hidden, especially the stuff that is the same. And then we need to incorporate more of like what that email preview is going to look like somewhere in this flow. Having the toggle options to say, I want to include or not include all carriers in addition to the one I recommended.

**Speaker 3:** Those are the biggest ones I have.

**Speaker 1:** I know there's most other ones, but I'm recording some of the other minors. Thanks.

---

# Part 3 — Validation and pilots

## 28. Getting this in front of real users

**Speaker 4:** Actually, how do we get them in for the agent to be in that business? I'm realizing we have one person in the room who is like half our ICP. So usually when we do these sprints, we'll get validation at the end from like actual people who would use this. And I'm like, well, we have Justin and he like has done the agent thing, but he's also like kind of agent C owner. Like how do we get this in front of like the 40K person that you're talking about? Like do we show Jillian's CC? Do we ask for people for feedback? Do we find people on? Because I don't want to like go all in on like this is what we should build based on the opinions of the people.

**Speaker 1:** Wow.

**Speaker 2:** Oh, I agree. Brandon's going to be instrumental because he's analytical and he's actually involved in the operation for a bit. Like Jolene, I put on that. Like Jolene makes a lot. She's actually sales. She's not service. She makes 160 grand a year or whatever. So she's a bad example. But yeah, I think Stockton Hill is good.

**Speaker 1:** But even like, I mean. What if we start with Stockton Hill?

**Speaker 2:** Yeah, Stacey's CSR. Yeah.

**Speaker 4:** But she, I think she would say something different from what you said.

**Speaker 2:** Okay.

**Speaker 4:** Based on our interactions, she was like, nope, you quoted this person at 40 a day in loss of use and it should have been 50 and you fucked up. And I don't know if she was just like, I don't know. And she didn't say like.

**Speaker 2:** I think we also, for some good reasons, and maybe didn't work out because it was something like that, I primed them of like, hey, we're evaluating this vendor. I need you to really look at this because we wanted honest feedback. I told them that I'm like, hey, we're involved and they're going to be like, it's great. It's great. But I think you're going to get that. And Brandon has a really good setup of like who's in service, who's in support. He's got VAs. Much better ran agency than my agency.

**Speaker 1:** What is the.

**Speaker 2:** I'm not, I'm just being completely honest. I mean, I make more money.

**Speaker 4:** What is the more skepticism in the process?

**Speaker 1:** What if we fold it into like you have review Fridays in a way where it's like our first Friday review with Stockton Hill, we're putting in front of them like we choose one person from the queue and we generate this for that one person. Do you know what I'm saying? Like in the flow and you just kind of vibe. I don't know yet how, I don't know the details yet, but like what if we vibe just like one single person and then like in one Friday we're like, okay, what do you think of this for the first shopped person? Like I would send that I would.

**Speaker 4:** We're doing a pilot while we are building and.

**Speaker 1:** Yeah, I was thinking about kicking that off next week with them to get started.

**Speaker 4:** Also, total side note, but like do they know that?

**Speaker 1:** No, I didn't think about that.

**Speaker 4:** We should get into that.

**Speaker 1:** Yeah.

**Speaker 4:** But like as we're building and depending on the extent to which we are like building very quickly with agents, we prototype some of this.

**Speaker 1:** In the flow. And then the business thing we could review with Brandon too when we get to the end. It's like, imagine this is what you saw at the end of your month one. And we show the business piece.

**Speaker 2:** Yeah. I mean, I can talk to Brandon too. Like we're very close friends. We own a business together too. So like I've got like I can have real talk and he'll tell me real talk too. Like, yeah. And I can tell him just to be like completely transparent.

**Speaker 1:** Okay. Cool. He's been, I mean, he seems pretty transparent. Every time we talk to him, he's pretty, yeah, open book with it also. Okay, so maybe we'll do that. Let me email and then I'll email Stockton Hill now to get that first meeting set up.

**Speaker 2:** Yeah. I think.

**Speaker 1:** I still have to set up the account because I just got it.

**Speaker 4:** Like want to state that based on the energy in the room in this session, it feels like there's not like super strong alignment across the board. And so like you guys will take another pass, but the best way to solve that is getting front users greeted.

**Speaker 1:** Yes.

**Speaker 2:** Yep. And feel free to bring in Stacey and Jolene and I mean, use them.

**Speaker 4:** Yeah.

**Speaker 1:** And.

**Speaker 4:** I've got room to add another agency if we need to to get some deeper insights. A few I can put on the list if we need to.

**Speaker 2:** And I have this other, that mastermind group that I'm in, the guys that are going to be staying in the room with them, we all have NDAs like amongst everybody. So like they would be willing to look at stuff too. And most of them are going to be potential investor targets too. So it might even help.

## 29. Pilot sequencing

**Speaker 1:** Would you want to do more pilots? I mean, it's maybe a little sales. I can get some too. Maybe.

**Speaker 4:** They're there. You can make it happen.

**Speaker 1:** The pilot thing is like, it's awesome.

**Speaker 4:** Until you have to shop.

**Speaker 1:** Yeah, until all of a sudden you're shopping. Like it goes from like great, steady, but like right now building and having more than one pilot going at the same time would be too much. Because it can like swing from like if no one says they want to be shopped, it's like, oh, we're cruising.

**Speaker 4:** Or like a, you know, we met once a week with three agency owners and three top CSRs and it was just like, hey, what are we doing?

**Speaker 1:** It could be that. Or even just stacking the pilots.

**Speaker 4:** On their first year of upline and exchange for their feedback or something. Like, yeah, I'd be pretty into that. I wouldn't want to focus group it. I would want individual sessions. So they don't like.

**Speaker 2:** Yeah, yeah, yeah, that's true.

**Speaker 1:** And I think after Stockton Hill, we could do another one. I think having three pilot would be awesome. To say you had three pilot runs. I just wouldn't want to run them concurrently with the build going at the same time.

**Speaker 3:** Are we trying to have a design partner during the build? Do you know?

**Speaker 1:** I mean, we could do that. I don't know which benefit is a third pilot customer because it's like the rinse and repeat process we've done before for additional learnings.

**Speaker 4:** Almost like members first was like the not even prototype version, but just like the workflow version. Stockton Hill is like the on the plane while it's being built. And then maybe there's a third pilot if we have someone. And again, three weeks, we give them access to like the beta version, assuming we can get that ready in the next.

**Speaker 1:** Will be nice. Yeah, the third one.

**Speaker 4:** Whatever that's maybe not fully featured, but like run them through it, work some bugs out. They will have the expectation like you're not paying for it. We'll do all the shopping for free. That gives us another dry run with like our VAs to get them like practice onboarding the VAs and the agency. And then by this November 6th date, when you have customers who are actually writing those checks, hopefully it's a little less rocky.

**Speaker 1:** Could you have like that third person, yeah, just dovetail into your first customer then?

**Speaker 3:** You're a good one then.

**Speaker 1:** Yeah.

**Speaker 3:** Maybe they get a couple extra months free.

**Speaker 1:** Which that would work out. September, Stockton Hill. Then October, design partner, pre-launch, early November, move into paid customer.

**Speaker 4:** Yeah, I was always thinking today, especially his coordination stuff. He's got everything there.

**Speaker 2:** Yeah.

**Speaker 4:** So I guess his partner and my mastermind will be good.

**Speaker 2:** Yeah, he'll be good.

**Speaker 1:** Okay, cool. I do.

**Speaker 4:** What's your appetite? We're being crazy. We would have people using in October software that you have built. Very friendly, aligned, keep their mouth shut allies. Frankly. No risk whatsoever to them.

## 30. Design partner and investor overlap

**Speaker 2:** Yeah.

**Speaker 3:** Maybe talk to Mike how he there's like a design partner.

**Speaker 2:** Okay. Any discussions about that at all?

**Speaker 3:** He's like worked on and I don't know if we would actually because we're so close to like customers. I don't know if he'd actually want to have like because that has like a teeny like a little equity agreement. I don't know if you want to do that. But at least that would be a good conversation.

**Speaker 2:** Yeah, I think the only way we could use it, like you said, as a recruiting tool for an investor. Like somebody that I know, like Brandon's going to invest, even just based on what I've told him so far. Bad example because we're using it as a pilot, but I don't know if Landry will, but I know a couple of leads that Jeff Brimmer's going to invest.

**Speaker 4:** Jeff's a great guy.

**Speaker 2:** And he's great. He's very into, you know, behind the scenes stuff. So maybe that's it. Maybe it's like, hey, I know you're going to invest, so we're going to make you the design part. You're going to get this little tiny sliver, but I'll talk to him.

**Speaker 3:** Or like preferable pricing for whatever.

**Speaker 4:** Yeah. I think there's like a cost that we can tweak. I think you probably signed this agreement already for members first.

**Speaker 2:** Yeah, but I hammered it pretty good. So we're not going to.

**Speaker 4:** We're not going to let him.

**Speaker 1:** Yeah, we can go back and forth a little bit.

**Speaker 2:** I was like, hey, listen, I'm not going to allow anybody else to do what I'm doing. I have to do what I'm doing.

---

# Part 4 — Logistics

## 31. Tomorrow: pricing, then feature prioritization

**Speaker 1:** Okay, cool. So then we'll keep working on that, but then just so everyone knows, the theme of tomorrow morning though is feature prioritization. So it's going to feel maybe a little awkward, but I think it's still okay. Is we'll want to talk features. We probably just won't get into like major specifics, but we'll want to go through the experience and say like, these are the things that are going to have to be built in order to execute on this. And like list them out and be like, okay, like what specifically does that mean? And when I say what that means, it's like what things are like AI generated, what things are optionality, which things are boilerplate and you can't choose. Like we need to make some of those level decisions. And then we can go away and like actually build out. Like we talked about specs yesterday and all that kind of stuff. We won't do in the room together, but it's just getting into like what's customizable, what is AI, what is a human, what is technology beginning to end. Exactly. So that's what we'll do tomorrow.

**Speaker 4:** We need to talk about pricing too. We got to talk about pricing.

**Speaker 1:** I may. Well, I don't know. We'll see. I was like.

**Speaker 3:** Do you have Jacob in the morning? Sorry.

**Speaker 1:** I think we have Jacob and Dan in the morning. Yes. We have Jacob and Dan from 9 to 12 or 9 to 11:30. So that's what we'll do then. Okay, great. So then let me then we will chisel out. Should we start with pricing or start with features?

**Speaker 4:** I don't think the pricing discussion is long.

**Speaker 2:** No.

**Speaker 1:** Let's start with pricing then. Because I would say honestly, worst case, I feel confident enough that we could go away and get the fidelity on features and like come back and review that a lived time. I think the pricing is something we have talked about so many times that I'd want all of us in the same room to, I think, right?

**Speaker 2:** Yeah.

**Speaker 4:** Well, I'm sure. We talked about it last night.

**Speaker 1:** Okay. Then let's square that one away and maybe the first hour is pricing.

**Speaker 4:** Is Patrick in there?

**Speaker 1:** I think I had Patrick Friday.

**Speaker 4:** It might be a better conversation for Friday.

**Speaker 1:** Yeah, but you're going to be remote.

**Speaker 2:** I'm online tomorrow.

**Speaker 4:** Yeah, yeah. If you're virtual. Virtual is fine for me.

**Speaker 1:** But it's from 11:30.

**Speaker 4:** He has the spreadsheet.

**Speaker 1:** 1:30.

**Speaker 2:** We're going to have to.

**Speaker 1:** Let me see if he's available. On Friday. It looks like Patrick's available. Oh no, that's Brandon. Just kidding. Let me see if Patrick's available and if I could, oh my, no way. I'll Slack him and see if it probably not.

**Speaker 3:** So we can't even really do that session.

**Speaker 1:** Well, unless you did at the end.

**Speaker 4:** And we got to do videos, right?

**Speaker 1:** Oh, maybe the first hour. Patrick might, he might.

**Speaker 3:** He's got a ton of prep.

**Speaker 1:** It looks like I might be able to snag Patrick for the first hour if I go talk to him right now. Because it looks like he's supposed to review candidates. That's like a solo work. And emails and writing emails. So I'm going to see if I can snag him the first hour to do pricing. And then we'll do the stuff, the rest of the stuff after.

**Speaker 4:** Ten scripts, basically a pro and a con.

**Speaker 2:** Tell me what to do.

**Speaker 3:** So we don't have to do them here, but I think we'll just get into it.

**Speaker 4:** I think today just to set expectations for next week.

**Speaker 3:** Yes, I forgot to do that. And then we can early next week. And then we can put them through an editor.

## 32. Scheduling

**Speaker 4:** Did you email them and just tell them we're chilling for this week? We talked to them.

**Speaker 1:** The last time I had emailed them before and I was like, just so you know, if I don't get it by like the previous Friday, we're going to have to, we have a big sprint week this week and we'll have to push it to like another time that's available. And she was like, I can get it by Friday. And then she didn't. So I didn't check in and be like, thanks, we're not starting yet. So my thought is I'll email then Megan and Josh and be like, hey, we have it now. As I mentioned, we're in a big sprint week. So how about we kick off next week and then reserve a few times? And then I'll CC you on that. So I'll write that right now. So I don't forget.

**Speaker 4:** I'll be realistic. I'll still share the network every Monday and Tuesday to like prep and get data ready and build out the first two months and all that.

**Speaker 1:** Yeah. But I think I'm out on Monday. I guess I could maybe move Monday to Thursday or something.

**Speaker 4:** That's what I was going for.

**Speaker 1:** Something. Move my day off to another day. Maybe.

**Speaker 4:** Crap. I have our tea.

**Speaker 1:** Yeah. Maybe I could do Wednesday afternoon. And then that would give me Tuesday and Wednesday.

**Speaker 4:** What's the.

**Speaker 1:** I'll say Wednesday or Thursday for them to meet with them.

**Speaker 3:** You guys to have meetings with us. Are there any days where it's like.

**Speaker 4:** Yeah. Next week is like pretty.

**Speaker 1:** Let's do Thursday afternoon. I would feel so much less like nervous about Thursday. Because then I'm driving back to Tulsa on Friday.

**Speaker 4:** My calendar that I now have was this week by.

**Speaker 1:** 18th.

**Speaker 4:** I will be updating my availability. I will be available Friday and maybe then go into Tuesday.

**Speaker 1:** So that's the thing is like. Then it's like if we met Thursday, because I wouldn't be able to meet Friday anyways. If we met Wednesday, then I wouldn't be able to meet Friday. So it's like might as well just do Thursday and then start fresh on like Monday the next week.
