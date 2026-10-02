# Upline Wednesday Late Afternoon Transcript - Dashboard Reframe with Jacob and Dan

**Date:** Wednesday, September 9, 2026 (late afternoon, ~4:00–4:30pm)
**Session:** Strategy sprint · replay of the 2:00 sketch review for Jacob and Dan
**Reviewed:** Business dashboard wireframe ([`product/wireframes/business-dashboard.html`](../../product/wireframes/business-dashboard.html)), then a fast pass over Amanda's agent proposal and insured page wires
**Immediately follows:** [Upline Wednesday Afternoon Transcript - MVP Sketch Review](Upline%20Wednesday%20Afternoon%20Transcript%20-%20MVP%20Sketch%20Review.md) — this session catches up the two people who weren't in that room

**Source note:** The recording labeled turns as Speaker 1–4 and did not name them. Labels are left exactly as the recording produced them rather than corrected by guess. From context: Speaker 1 is Ashley (presenting the dashboard and recapping the 2:00 meeting), Speaker 2 is Jacob (wrote the investor pitch deck that day, and calls time on the meeting), Speaker 3 is Dan, and Speaker 4 is Amanda (who is taking the dashboard forward and asks what to keep in mind while redesigning it). Note that this mapping differs from the 2:00 transcript, where Speaker 3 was Amanda — diarization numbering does not carry across files. Names mentioned aloud (Davey, West, Jacob, JV) are preserved as spoken.

---

## Contents

1. [Why the funnel misleads](#1-why-the-funnel-misleads)
2. [The promise of the independent agent: producing vs. servicing](#2-the-promise-of-the-independent-agent-producing-vs-servicing)
3. [Agent back office, not a report of our tasks](#3-agent-back-office-not-a-report-of-our-tasks)
4. [Their victory, not ours](#4-their-victory-not-ours)
5. [Month in review, and leading vs. lagging](#5-month-in-review-and-leading-vs-lagging)
6. [Why the screen felt self-serving](#6-why-the-screen-felt-self-serving)
7. [Upline as the agency's COO](#7-upline-as-the-agencys-coo)
8. [The metric list](#8-the-metric-list)
9. [What did you do, what do you need me to do](#9-what-did-you-do-what-do-you-need-me-to-do)
10. [Above the line and below the line on one screen](#10-above-the-line-and-below-the-line-on-one-screen)
11. [What makes it about the owner](#11-what-makes-it-about-the-owner)
12. [Amanda's agent proposal walkthrough](#12-amandas-agent-proposal-walkthrough)
13. [The WYSIWYG proposal editor](#13-the-wysiwyg-proposal-editor)
14. [Talking points in plain language](#14-talking-points-in-plain-language)
15. [Comments on the proposal, and the Loom idea](#15-comments-on-the-proposal-and-the-loom-idea)

---

## What came out of the room

**The reframe (this is the headline):** The owner dashboard is not a report of Upline's funnel. It is the communication *"I have been doing work to protect your book of business."* Upline is the servicing half of the agency — the back-office concierge, the COO — and the screen exists so the owner can see that half working. The producing half is the human on the golf course.

**Business dashboard — decided:**
- Kill the funnel presentation. A descending funnel reads as "only 16 renewed" when the real story is 116 of 120 renewed but didn't need every step. The funnel actively misleads.
- Structure the screen as two halves: **above the line = what we need you to do**, **below the line = what we've been doing**. Clicking an item above the line takes you to the page where you do the action.
- Metrics named in the room: proactive customer touchpoints (of people up for renewal, what % have we actually reached), percentage that elected to be shopped, number of customers shopped, rolling-12 retention with direction (up or down), cross-sell opportunities surfaced, referrals generated.
- Retention is the anchor. Everything else is leading; retention is the lagging outcome.
- Low touchpoint coverage is a feature, not an embarrassment — "we didn't have an email address, we should fix that, because they haven't heard from us."
- Explicitly **not** wanted: how many people switched carriers. "No, I care if they stay."
- Financial detail stays out of MVP — we won't have access to most of it.
- Measure interactions, not tasks completed.

**Business dashboard — open:**
- Whether the action center *is* the home screen with the dashboard below it, or a separate view of the same queue. Jacob pushed for one screen; left unresolved and handed to Amanda.
- Whether the monthly month-with-Upline email survives alongside the screen. Amanda still wants it, to keep Upline a live conversation through year one ahead of the AMS replacement.
- How granular the cross-sell breakdown gets.

**Agent proposal — decided (consistent with the 2:00 session):**
- Only surface what's different. If everything matches and it's cheaper, it's a dash — "check, check, check, check, save."
- Give the agent a toggle over which carriers the insured sees (only Nationwide, or Nationwide plus Travelers and Progressive).
- Bring the email copy back into the flow, and let the agent edit the wording.
- The room preferred the simplified insured view over the agent-side table — lead with recommended / what you had / what changed, details on click-through.
- Talking points should be conversational, not technical, and explain why we emphasized what we did. An LLM can do that well.

**Agent proposal — rejected or deferred:**
- **Accordions: no.** Too many interactions on the page, too much scanning to know what's hidden where. Amanda pushed back on her own wire here.
- **Google Docs / DocuSign-style comments: cool, too much for MVP.** The compromise is notes that sit next to line items without being a full comment thread.
- **A 45-second Loom from the agent: no for MVP.** Regulatory issues, and it depends entirely on whether that specific agent would ever record themselves.

**Session note:** Jacob and Dan both closed with "this is good." Ashley's own read on the dashboard as it stood: "going through this entire thing, I don't like any of it."

---

## The transcript

### 1. Why the funnel misleads

**Speaker 1:** Had and it came to fruition was that it easily gets out of control, and it's like, this is now, like, this overwhelming BI dashboard. What do we even need it for? The use case, especially Dan, because I don't think you're in the conversation latest, is like, the use case is: I'm the agency owner, how do I get proof points?

**Speaker 1:** Like, oh, UpLane's working. Thought is: I'm out, ideally, now that I have UpLine, I'm pursuing new sales.

**Speaker 1:** I'm out at, like, the golf course, or getting coffee, or lunches, or whatever. I want to make sure that, like, UpLane is delivering on this.

**Speaker 1:** And kind of the biggest thing that we decided was, more than anything, it's: how many renewals are supposed to— were coming up, and how many of those people renewed? Kind of regardless of what the specifics of what UpLane did.

**Speaker 1:** And that's where I got way too lost in the weeds is, I almost don't even care what UpLane did or didn't do. We already know I'm doing basically nothing today.

**Speaker 1:** So I can attribute, arguably, all of the increased retention to UpLine. And so this was the initial version, and there is just absolutely way too much.

**Speaker 1:** It is just a dump of information. Thought was you would show, oh, here's your funnel of, like, who we've reached out to, and who has responded, and who has switched.

**Speaker 1:** Immediate feedback here was, yeah, but, like, that doesn't mean you've— we've only had 120 people that have had renewals coming up and that have renewed. That is only 120 people that, like, you've reached out to, if that makes sense.

**Speaker 1:** Like, when you get to the bottom of the thing, it's looking like, oh, only 16 people renewed. It's like, no, of the 120, you can have 116 of them renew, but they didn't all make it all the way down the funnel, and that's fine.

**Speaker 1:** Does that make sense? Like, it gets kind of weird.

### 2. The promise of the independent agent: producing vs. servicing

**Speaker 2:** Yeah, so this is— I wrote the investor pitch deck today.

**Speaker 1:** Okay.

**Speaker 2:** The vision of this company, the promise of the independent agent, is the service. It's— this is a product. Insurance is a product that needs trust.

**Speaker 2:** The trap is, I get this high-touch feeling of trust when they sell me, and then it goes away forever because they can't deliver on it. And to deliver on it requires expensive humans and expensive software designed for humans to use, and it still falls short of actually managing.

**Speaker 2:** So think of an agency as a dude on a golf course or a woman in high heels knocking on doors. Like, I'm hustling, I'm out there making relationships.

**Speaker 2:** And then the other side of the house of, you did all that work and now we're going to keep them happy? We are the other side of the house.

**Speaker 2:** So if you look into this, what are you doing for my customers? What are you doing for me?

**Speaker 2:** Are you taking care of my book of business? I worked so hard to get these people.

**Speaker 2:** What are you doing to keep them happy? So a funnel is like, cool, you're running this play.

**Speaker 2:** I do want to know you have talked to a certain number of people, right? So you have reached out, you've offered to shop, or even like saying questionnaires completed, right?

**Speaker 1:** Yeah.

**Speaker 2:** Versus like, hey, no, we had a conversation, I got some new data from them. So this needs to feel like, oh, this is my agent back office.

### 3. Agent back office, not a report of our tasks

**Speaker 1:** Like interactions that you had with them, not just like tasks that were completed.

**Speaker 2:** This is everything you could tell me of you are protecting my book of business. You're doing proactive outreach. You're talking to them, you're shopping for them, you're, oh, and you have some tasks for me to do?

**Speaker 2:** Because that's what their back office does too. So anything that'll make this start to feel like, don't worry about it, we've got this.

**Speaker 2:** You heard Davey say, like, they're the shield, we're protecting your book. It's more like, no, we're the concierge, we're servicing.

**Speaker 2:** So what are the things that let me know? Hey, you're staying in touch with them.

**Speaker 1:** Yeah.

**Speaker 2:** You're asking questions, you're surfacing things to me and opportunities. So the idea is let the human be more human.

**Speaker 1:** Yeah.

**Speaker 2:** And then let the AI agent be the concierge that's taking care of everything else.

### 4. Their victory, not ours

**Speaker 3:** But it's— if we're doing it, we're making him or her look good. So it's like their victory is— it's not our victory, it's their victory.

### 5. Month in review, and leading vs. lagging

**Speaker 1:** Yeah. Yeah, where we left the meeting was that— and we can talk about this too— but like where we left it was like, it almost is more of like for MVP's sake, it's almost more like your monthly, like month with UpLine type of like email that you're getting more than anything. That is like a review of, here are all the ways in which we interacted with your customer base type of thing.

**Speaker 1:** Or all of the— your retention is number one, is what we came back to over and over again. Yeah.

**Speaker 1:** Because like.

**Speaker 2:** I think that's the outcome.

**Speaker 3:** Yeah.

**Speaker 2:** But it could show, like some of this stuff, there could be like a daily, like, hey, we generated X number of quotes, hey, we interviewed X number of customers, we updated this customer profile, we— like what are the— so there's leading and lagging. The leading— so you got to remember, the reason for the leading is not to show a funnel. It's because I know that when you're proactively reaching out, you're creating value for me.

**Speaker 2:** And you're taking care of people and they're feeling good. Even if that didn't turn into a renewal, even if that didn't turn into a cross-sell or an upsell, I value that you, my back office concierge company, are actually doing things.

**Speaker 1:** Okay.

**Speaker 2:** So what I would do is I'd get the metrics down. What are the leading metrics that let me know, dang, you're reaching out to them, thank you. We're getting these personalized touchpoints.

**Speaker 2:** And then what are the lagging of like, oh, and my retention rate.

**Speaker 1:** Is the byproduct of it.

### 6. Why the screen felt self-serving

**Speaker 4:** Because I want to— when we were talking about that yesterday, it's the moment that I took away has been most, like, lasting after the whole— the whole day sprint, was that it's essentially we are the tool that helps you be the agent that you want to be. We make you look really good. And that there's this compounding effect where you can kind of leverage it as, yes, we let you be who you want to be.

**Speaker 4:** We make you look really good. We expand your book.

**Speaker 4:** We allow you to have the capacity to handle that expanded book. And there's also the side of it where it's if you're not doing this, you're falling behind because everybody's going to have this capacity with AI.

**Speaker 4:** And I was struggling with this screen because it felt like we were just trying to show you how much— how much we were doing on, like, on the UpLine side of how much value UpLine is adding. It just felt too self-servicing on the standpoint of UpLine.

**Speaker 1:** Yeah.

**Speaker 4:** But the way that you're leveraging it as in, here's how good we're making you look, feels a lot more aligned with that.

### 7. Upline as the agency's COO

**Speaker 2:** Yeah, if I were your COO who were running the back— again, if you just divide the agency into two lines. One is producing, the other is servicing. If I'm your COO who's servicing, and it's my job to tell you, here's what our team did, and here's what our— it could be today, it could be this week, it could be this month, but here are— hey, we're cranking away.

**Speaker 1:** Okay.

**Speaker 2:** And then it could also be, hey, cross-sell opportunity, you need to reach out to this person.

**Speaker 1:** Yeah. Yeah.

**Speaker 2:** Hey, referral.

**Speaker 3:** I was going to say, where's that part of the—

**Speaker 1:** This is not— this is not what y'all are talking about.

**Speaker 2:** Yeah.

**Speaker 1:** Well, this is kind of what you're talking about. This does not show any, like, cross-sell stuff, but the thought was, like, this would be your recent activity and then anything that relates to you specifically, like closing that loop of, like, this is ready for you to bind, it's approved a new umbrella policy, and then clicking into that would go into that specific client, like, profile page. I don't know.

**Speaker 1:** To be honest, like, going through this entire thing, I like don't like any. I don't like any of it.

**Speaker 1:** So, yeah.

**Speaker 4:** What's the best standpoint? Because I'm taking this moving forward. I am still interested in looking at it as a monthly newsletter just from the opportunity of keeping that conversation alive and keeping UpLine on people's email inboxes.

**Speaker 4:** Because I'm really interested too in keeping UpLine like a live conversation for the first year if we're planning on that AMS replacement. But that's— but what's the best thing for me to keep in mind when I'm going through and redesigning this?

**Speaker 4:** Like, what's the— what's the biggest value add for this particular screen?

**Speaker 1:** Yeah, because the biggest thing we talked about in the meeting we just had was it being like— like, yeah, it was very, like, specific of, like, who has renewals coming up and then how many people have renewed.

**Speaker 1:** And, like, seeing the positive impact there.

### 8. The metric list

**Speaker 2:** So, I mean, I think I would— I want to know, oh, you've touched— so not email sent, but this is, oh, of people who are up for renewals, you've hit 92% of them. And then maybe there's worse than 80%, oh, we didn't have an email address, we didn't have— we should fix that because they haven't heard from us.

**Speaker 1:** Okay.

**Speaker 2:** Right? So this could truly be customer— yeah, renewal touchpoints.

**Speaker 3:** In percentage of— I mean, percentage that elected to be shopped, so.

**Speaker 2:** Yeah, so then you could say, yeah, so, yeah, customer touchpoints. Yeah, proactive customer touchpoints.

**Speaker 1:** Okay.

**Speaker 2:** And then it could be number of customers shopped. Then I kind of have, like, my ongoing retention number, which should be some level of, like, my rolling 12 and, like, is it increasing, is it going up, going down? Like, that is— that is the huge number that we're after.

**Speaker 2:** I think we should do a— I think there should be a cross-sell as well.

**Speaker 1:** Okay. Which then would break it down by, like, how granular— granular we wanted to show that.

**Speaker 2:** Cross-sell opportunities surface. That's— I would want that on the dashboard for my COO.

**Speaker 1:** Just saying.

**Speaker 2:** I'm not hustling, I built this book, are you finding opportunities to cross-sell?

**Speaker 1:** Yeah. Okay.

**Speaker 2:** Referrals generated.

**Speaker 3:** Yeah, referrals generated.

**Speaker 4:** Are you taking the standpoint that this is, like, UpLine is your COO?

**Speaker 2:** Yeah, I'm saying in the future, you will have one person. Agencies, where the human is the person who's like, this is all I've ever wanted, is to golf, land, advise, and AI takes care of the rest. I don't manage humans, I don't— yeah.

**Speaker 1:** Okay, so then we said the referrals. Okay, referrals, cross-sells. Okay, but then when we talk about, like, later in the— do you care— do you care how many people switched carriers?

**Speaker 1:** Do you care— Davey mentioned a lot of, like, the financial piece. Again, for the MVP, we're not going to have, like, access to a lot of that stuff.

**Speaker 1:** But, like, do you care to know, like, how many people switched over carriers?

**Speaker 2:** No, I care if they stay.

**Speaker 1:** And that's kind of it.

### 9. What did you do, what do you need me to do

**Speaker 3:** Yeah, I mean, for— especially for MVP, just give me the— those and then my other question becomes the action center of, like, what.

**Speaker 1:** What do I do to close that loop?

**Speaker 3:** What do I do to—

**Speaker 2:** What do you need me to do?

**Speaker 3:** Yeah, what did you do? What do you need me to do? Think about those frames.

**Speaker 1:** Okay, so then of the things you would need me to do, brainstorm what are the things. It would say, we need to bind a policy. We need—

**Speaker 2:** We need you to review these proposals. So you have a cross—

**Speaker 1:** Ooh.

**Speaker 2:** So you have a cross-sell opportunity that, like, I want you to know about and you should review.

**Speaker 1:** Okay.

**Speaker 2:** You have a referral that you need to jump on ASAP.

**Speaker 1:** Oh, yeah, we did talk about that. Okay.

**Speaker 2:** You have a proposal that we need you to review.

### 10. Above the line and below the line on one screen

**Speaker 1:** Okay, wait, but are we going to— okay, so that's a great— in my mind, this lives separate from the queue of proposals to review. Like, there's a funnel of, like, you have outreach emails, you need to approve and send, here's the task, all the people, here's now—

**Speaker 2:** Why not have that be the home screen of, like, here's—

**Speaker 1:** And this is just a particular view of that.

**Speaker 2:** And when you close now, you're into the thing where you do the action. So, no, no, no.

**Speaker 1:** Okay. Okay.

**Speaker 2:** You can answer this. But I would say in general, there's the, like, if I log in here, it's like, oh, you need me to do stuff. So maybe there's this, like, here's some shitty boxes, some pretend it says something.

**Speaker 2:** Maybe there is this up here, like, above the line is stuff you need to do, and there is the outreach, and there's the referrals, right? There's the, hey, here's the queue of what's going on.

**Speaker 1:** Okay, so you're saying.

**Speaker 2:** And boom, I click it, I go to that page.

**Speaker 1:** Okay.

**Speaker 2:** And then down here is stuff we've done.

**Speaker 1:** Gotcha.

**Speaker 2:** And now this becomes a dashboard. And so now you're getting to see both of those things.

### 11. What makes it about the owner

**Speaker 4:** I'm looking too, since you stood up here, I was looking at how we were categorizing these. The business dashboard and the way that it's formatted right now, and it's like, no, it's all to you. But, like, I'm asking you about value.

**Speaker 1:** No, insult away. It's terrible.

**Speaker 4:** This, I'm looking at this in the way that you described the business dashboard. I was like, yes, that's our top. And I'm like, how did you describe it that made it me?

**Speaker 2:** Because it's not— because it's not a reporting of our funnel. It is the communication of, I've been doing work to protect your book of business.

**Speaker 3:** Yeah.

**Speaker 2:** And so that's the stuff that you're approving. And I've surfaced some— so again, let the human be the human. So that's what this view is of, hey, these are the things that should be a human.

**Speaker 1:** Okay.

**Speaker 2:** All of this stuff, I've been doing this. And so this is the full value of this of, now all I have to do, I want to see what you've been doing.

**Speaker 1:** Yeah.

**Speaker 2:** And I want to know that you've been reaching out to my customers. I want to know that we've been shopping them. And then you let me know when I need to review something that's been shopped.

**Speaker 2:** And this will evolve over time to be, hey, you've got a meeting that's being scheduled, that this is.

**Speaker 4:** Entirely that different from what we're going to look at or what we've decided on for the shopping experience. In terms of, like, it doesn't have to be a dashboard as much as it's showing your opinion.

**Speaker 2:** What up? Dan, I have, like, six more minutes.

**Speaker 4:** Yeah.

**Speaker 2:** I apologize.

**Speaker 1:** No, you're good. Yeah, do you want to show that really fast? Okay, good.

**Speaker 1:** This is good. Okay, this is good.

**Speaker 4:** I'll send you the link on Slack if you want.

**Speaker 1:** Oh, yeah. Let's see.

**Speaker 4:** And I do think you're going to do a better concise job of explaining what we reviewed and where we're taking it than I would.

### 12. Amanda's agent proposal walkthrough

**Speaker 1:** Okay. Just jump in. Okay, so I— so this one, Amanda took this fast.

**Speaker 1:** So there was, like, multiple iterations of this in the past. So Amanda came at it with fresh eyes.

**Speaker 1:** On this moment is, I'm the agent. UpLine has shopped carriers.

**Speaker 1:** This is the, like, results page of what was shopped. So we had a lot of feedback here as well, but this is the version, like, right now.

**Speaker 1:** So you'd have, like, your current policy listed here with what's recommended. You'd have a breakdown of all of this information.

**Speaker 1:** One of the biggest pieces of feedback we had was, the information, although good, at the end of the day, the agent, I don't want to see— really, I don't want to see stuff that's the same. I only want you to highlight the things that are different and, like, bring those to the surface.

**Speaker 1:** Anytime it's not a true apples to apples. If it's all the same across the board and it's cheaper, it's just dash.

**Speaker 1:** It's like, check, check, check, check, save. You can— like, you have accordion folder.

**Speaker 1:** Like, I don't want to be overwhelmed with data in the form of a, like, category. And then when you go through the recommendations, another thing too, we've talked about, okay, we need to bring back in the email piece more and, like, the wording of the email as well.

**Speaker 1:** And then also when toggling, we decided we do want to give this one of the feature things. We want to give the agent the ability to say, yeah, nationwide's going to be a recommendation, but I also want to show travelers and progressive or only show nationwide or, like, in whatever I present to the end customer.

**Speaker 1:** So then this.

### 13. The WYSIWYG proposal editor

**Speaker 2:** So this kind of a Wizzy Wig style proposal editor where we're showing the agent the thing that ultimately the customer will see.

**Speaker 1:** Yes.

**Speaker 2:** And they're getting to edit, say, no, show this, no, kill this one.

**Speaker 1:** Yes.

**Speaker 2:** And then it's done.

**Speaker 1:** Yeah, so then this would look more like an email, yeah, with the edit stuff. But then Amanda added in, then what would the customer see in your approving, white-labeled that version? And so copy modifications, you were talking about, like, wanting to spend more time in there and, like, all that kind of stuff.

**Speaker 1:** But, like, the team overall kind of actually preferred how simplified this was of, like, recommended what you had, what changed.

**Speaker 4:** Like, they kind of wanted what changed that selection or the best presented instead of the table on the agent side as well.

**Speaker 1:** Yeah. Or at least have that be the summary and then you could get into all the, like, details later, like, in the clicking around if you wanted to.

### 14. Talking points in plain language

**Speaker 4:** And then the talking points, one of the points that they brought up was that the people who are going through this aren't necessarily wanting to be overwhelmed with information and aren't necessarily, like, spectacular at their job, which I was curious about. I feel like I'm making too fast, but.

**Speaker 3:** I wanted talking points of, like, under very understandable talking points in terms of what I see the customer's going to see of, like, hey, going with this, your actual deductible is in the— I don't know.

**Speaker 4:** What are we talking about?

**Speaker 3:** LLM can do a good job on that.

**Speaker 4:** This would be. On that side to the main page, so it's a little more conversational than technical. And that essentially breaks down why we emphasize what we did, what it means.

### 15. Comments on the proposal, and the Loom idea

**Speaker 2:** You know what would be— you know what could be cool is if you did, like, Google Docs or DocuSign style comments. So I've got this table.

**Speaker 1:** Oh, that'd be cool.

**Speaker 2:** And then as an agent, I just click on a box and I just say, hey, so I'm thinking here on the auto, and then it puts a little note there. So then as a consumer, I go through, I see this proposal and I see my advisor's notes through this thing.

**Speaker 1:** Oh, that's good.

**Speaker 2:** And then at the end, it's like, love to chat the reading of this stuff. I would prefer that up with West because he sent me this and I kind of squinted at it and then he showed me and talked me through it and I'm like, oh, gotcha.

**Speaker 4:** Yeah, I feel like, yeah, a combo of both because I was going to put that on there, on here. The thing I don't like about that is that it's hard to scan.

**Speaker 3:** Yeah, it's like too much for MVP. What I wanted was, this is smart enough to call out the differences and put it in simple language of, hey, here's the new plan that I think you should go with. Here's just a little bit of why.

**Speaker 3:** And then the points next to some of these things can be just notes that you could put in, but it looks like it's not just a comment added.

**Speaker 4:** I do feel like that approach and then just kind of consolidating anything that's the same kind of gets aligned, but I don't feel like the accordion is a good idea because I think we start introducing too many interactions on the page.

**Speaker 3:** Yeah, that's a lot.

**Speaker 4:** And then you have to scan too much on the page to know what you're going to put go on, what you need to expand, where stuff is hidden.

**Speaker 1:** Okay.

**Speaker 4:** And I don't want to hide too much on a page like this, but that's my— that's my—

**Speaker 1:** Yeah, I think that's fine.

**Speaker 2:** Honestly, a 45-second loom video.

**Speaker 1:** Yeah. Oh, of if you recorded that talking through it?

**Speaker 2:** Of just like there's my face on screen. It's like, hey, Jacob, just want to walk you through this and I can see West's face. I don't think that's smart for MVP, but.

**Speaker 1:** Well, and it depends on who the user is that's actually doing it. If you were like JV, doing that would be awesome. But, like, it depends.

**Speaker 1:** Like, also I've worked with some people and it's like, they're— some of the people I've worked with, there's no way they'd ever record a video of themselves talking through it.

**Speaker 2:** After a while, just, yeah, no, we got regulatory issues. This is good, y'all.

**Speaker 1:** So lots of iteration.

**Speaker 2:** This is good.

**Speaker 1:** Yeah. Lots of it. Okay, cool.

**Speaker 4:** Before that, we're both freaking out.

**Speaker 1:** We are like this.

**Speaker 2:** We are freaking out.

---

## Reference

**Amanda's wires that Ashley takes forward:** https://upline-design-hub.vercel.app/review/reyner — the agent-facing shopped-carriers + recommendation screen, and the insured-facing proposal page. Per the [2:00 session](Upline%20Wednesday%20Afternoon%20Transcript%20-%20MVP%20Sketch%20Review.md), Ashley and Amanda swapped: Amanda takes the business dashboard, Ashley takes these two.
