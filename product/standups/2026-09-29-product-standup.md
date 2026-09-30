# Product standup — Tue Sep 29, 2026

**Session:** Twice-weekly product standup. Amanda walked the team through the v3 Upline prototype ahead of the Stockton Hill demo (Wed Sep 30).
**Attendees:** Ashley (PM), Amanda (design), Austin, Doug
**Absent:** Davy, JV
**Transcript file:** this file

**Speaker mapping:** The recording named Ashley Roberts, Amanda, and Austin Boardman. **Speaker 4 is Doug** (“Dougie” — “just jamming out,” then the landing-page call). Labels in the body are left as the recording produced them.

---

## What this session was for

Identify what must change before showing Stockton Hill tomorrow, and what can wait until Members First. Demos should lead with the magic moments and the primary workspace, not a walk of every screen.

Amanda had just merged v3 to the throughline and published it. Content is still real and needs anonymizing before the demo. Chat insights modal stays as a conversational placeholder; not MVP.

---

## Decisions

- **Policyholder landing page is out of MVP.** Fast-follow. Austin called it below the line; Doug agreed. The recommendation can live in the email. Ashley wants it first after the core experience ships; the pilot does not use a landing page.
- **Shopping summary goes back to bullets.** The paragraph-form summary failed readability. Amanda is reverting it.
- **Whether to offer shopping is an agency setting.** Stockton Hill will not offer shopping on Auto-Owners. The questionnaire still goes to everyone so the agency gets updated data and can offer a cross-sell. If the outreach email does not offer shopping, filling out the questionnaire does not trigger a shop. This matches what the pilot already does.
- **Homepage priority area becomes one list:** “actions required this week,” with snooze, plus a separate scheduled-tasks section for things that are happening but do not need the agent. Empty sections depopulate. Do not split the top into closing / shopped / scheduled as three equal priority buckets.
- **Policyholder list gets a Kanban view alongside the list view.** Kanban is a power-user toggle, not the default homepage. Austin: after the new homepage, a full Kanban is a lot of cognitive load (“which of these actually need my attention?”).
- **Cross-sell requests and questionnaire data updates get a chip/tag on the account card** for now, so the team can learn whether those need their own flow.
- **“Closed” today is wrong.** It fires when the recommendation email sends and hides the real work (carrier switch, calls, binding, new payment info, a separate line of business). The card’s primary actions (add memo, mark closed, buried under three dots) get ahead of that work.

---

## How the workflows actually branch

Ashley asked for these written down so they do not get twisted again.

1. **Shop path.** Questionnaire comes back, agency allows shopping, we shop, agent reviews, sends the recommendation. That is the path the prototype already tells.
2. **Cross-sell, no shop (path 1B).** Questionnaire comes back, we are not shopping (Auto-Owners at Stockton Hill, or no price increase worth the shop), but they asked for something else (life). That is an **immediate** action on “this week,” not something that waits until five days before renewal. A hot life lead does not wait 27 days. If it belongs to a sales team (Members First), the agent snoozes it. Tie the chip to the renewal date so it still asks for a status update and does not float forever.
3. **Data changed, nothing else to do.** Questionnaire came back with hygienic updates (occupation, etc.) and there is no shop and no cross-sell. Someone still has to update EZLynx. **Open:** this currently disappears after the email sends and never hits the homepage. Amanda’s sketch: recent activity says “questionnaire filled out, eight points changed,” highlight the fields, tooltip “change this in EZLynx.” Where it surfaces is unresolved.
4. **No questionnaire back.** **Open.** Maybe a phone-call task. Maybe an agency setting.

Cross-sell and the renewal can live on the same household card on different timelines. Surface the household when something is pertinent to the next seven days, and surface a cross-sell immediately even if renewal is further out. Snooze is the first step toward task management: “sales is calling them next week — snooze until then.”

Ashley’s framing she then walked back: she had thought Upline would still shop quietly even when the email does not offer shopping, and bring a better price proactively. The room landed on the opposite. No offer in the email means no shop. Updated data still needs to land in the AMS.

---

## Homepage, email, drawer

- The new email summarizes each policyholder with a CTA per section. Renewal date shows as days-until when it is inside a week, not a big red alert.
- Scheduled renewal emails are de-emphasized. Agents cannot realistically review all of them. Still viewable in Upline.
- Amanda moved “needs attention” out of a variable header into three sections (closing, shopped, scheduled) because the header logic was too variable. The room then collapsed the top of that into one actions-this-week list. Scheduled stays in the background.
- Recent activity log on the policyholder drawer replaces the context that the combine board used to hold (shopping → closing → closed) once the homepage only shows items that need the agent.
- **Drawer + modal.** Ashley does not want a modal floating on a drawer. She prefers an Asana-style stacked drawer. She can live with a modal if it is shorter and wider, not a floating drawer. Her real issue: reviewing the email is the primary reason you opened the account, and it is behind an extra click. Amanda will make that review open directly. She had used a modal so you do not lose your place (RAMP’s stack made “how do I get back?” unclear). She is not fighting the feedback.
- **Questionnaire preview.** Austin and Amanda want the agent to see the actual email the insured will get. Ashley would rather list the questions in the same view and will not die on that hill. Austin’s caveat: the current email looks editable (subject line, and you could delete the questionnaire link) and there is no recover path. Skip birthdate / identity verification in the preview so the demo does not require fake data to reach required fields. Pre-launch pass: which fields are actually editable, and how that is signaled.
- Login was skipped. Amanda’s assumption is the email CTA can log you in. Not discussed further.
- Shopping flow is split into steps: read results, view the raw carrier PDFs, select a recommendation, review the email. One screen was doing three jobs.
- RAMP-style memo on the card stays useful (“waiting on a signature, client is out for two weeks”).

---

## Commitments

**Amanda — before Stockton Hill (tomorrow), and the v3 pass**
- Anonymize prototype data
- Add `robots.txt` / noindex on the throughline (same as the design hub). Austin: do not let prospects Google into it. Amanda will push it herself.
- Email review opens directly instead of drawer, then another click, then a modal
- Collapse the homepage top into one “actions required this week” section with snooze, and a separate scheduled-tasks section
- Chip/tag for cross-sell requests and for questionnaire data updates on the account card
- Kanban view toggle on the policyholder list (list stays the default)

**Ashley**
- Drop the v3 screens into Figma, share the link in the team channel (even before the notes), and add sticky-note feedback. Nitpicks included; Amanda can take or leave them.
- Write down the workflow paths from this call so they do not get twisted again.

**Austin**
- Feedback on Ashley’s Figma. A Loom is fine; Amanda would rather have comments, because scrubbing a Loom for a specific note is hard to use while designing.
- Later, not now: which of Claude’s privacy advice to take. SEO answer already given — `robots.txt` or noindex. She does not need a Google removal request for an internal prototype if it is noindexed.

**Doug**
- No commitments. Can add notes on the Figma with everyone else.

---

## Open questions

- Where a “update this in EZLynx” action lives when we are not shopping and there is no cross-sell.
- No questionnaire returned: is a phone call the agent’s task, and is that an agency setting?
- Pre-launch: which email fields are user-editable, and how the UI says so (subject line especially).
- Exact chip language (“life insurance requested” was a placeholder).

---

## Transcript

Amanda: Hello.
Ashley Roberts (You):  Hello.
Amanda:  How are you?
Ashley Roberts (You):  Good. I just got pictures from daycare, and Archie has the nastiest-looking rash I've ever seen, so it's awesome.
Amanda:  I also just got pictures from daycare. My child, for herself again, she—what did they say? I got an incident report just now.
Amanda:  She fell into a shelf.
Ashley Roberts (You):  Oh, goodness.
Amanda:  Stevie was playing near the shelves and then fell into the shelf. She has a red mark on her eyelid.
Amanda:  Of course she does.
Ashley Roberts (You):  Because I was like, "Yay." Yeah, they sent those rash photos, and I was like, "Should I come get him?" And they were like, "I don't know.
Ashley Roberts (You):  It looks pretty bad." And I'm like, "Can it wait a few hours?"
Ashley Roberts (You):  Like, I feel like such a bad mom. I'm like, "How about 3 more hours so I can come pick him up?"
Amanda:  My daycare would never—my daycare would never ask me to pick her up for a rash. I've had to, like.
Ashley Roberts (You):  Really?
Amanda:  Request. I've requested that if she is inconsolable, that they let me know. If they're—because they'll just be like, "Oh, yeah, she's been pretty inconsolable for the last couple hours.
Amanda:  She can't sleep. She can't sit."
Amanda:  And I'm like.
Ashley Roberts (You):  That's really—
Amanda:  "Call me."
Ashley Roberts (You):  Yeah.
Amanda:  I don't want her to be at daycare screaming. That's insane. And they'll be like, "Every time they call me," because she has a fever of 101 and over, they're like, "We're so sorry."
Amanda:  And I'm like, "You should be sorry about the way that you take her temperature," which is over her shirt, under her armpit.
Ashley Roberts (You):  Yeah.
Amanda:  And you shouldn't be sorry about calling me to pick her up. I have specific issues, and they are not that you call me to pick her up. They are that you don't know what you're doing sometimes.
Amanda:  But we go to, like, a local—super small local—daycare, so it's not.
Ashley Roberts (You):  Yeah.
Amanda:  You know.
Ashley Roberts (You):  We—our nanny is Archie's teacher, and so, like, we know her really well, so she, like, texts me things when she's like—because she's known Archie since he was born, so she'll be like, "This is not normal for Archie."
Amanda:  Mm-hmm.
Ashley Roberts (You):  The problem is, Archie has really bad eczema. He has the most sensitive skin of anyone in the entire world, apparently. I don't know.
Ashley Roberts (You):  So, like, last night we were playing outside, and he wants to be outside all the time, which is great. So we're outside, and I'm not going to lie, he's naked a large portion of the time that we're outside.
Ashley Roberts (You):  And then they send me these pictures, and I'm like, "Okay, cool."
Amanda:  Yeah, I know. So Stevie had—I didn't give her a bath on Saturday. I usually bathe her every day because she's at daycare every day, but I didn't give her a bath on Saturday.
Amanda:  And she got hives all over her front and back of her torso, and I don't know.
Ashley Roberts (You):  Yeah.
Amanda:  Where these kids fade out of these days. I don't feel like this was a problem I had.
Ashley Roberts (You):  It was just a delicate, little, fragile baby.
Amanda:  Yes! Like, these delicate babies of, like, just stuck it out, pushed the rash back.
Ashley Roberts (You):  God. What? Can you not play outside?
Ashley Roberts (You):  Jesus Christ.
Amanda:  But I got—so back off of—off of rashes and delicate, fragile, glass babies. I just wrapped up some changes to v3, and I didn't realize that I can merge requests on my own from—for the throughline. So I just went and published.
Ashley Roberts (You):  Nice.
Amanda:  The changes that I've been making to the prototypes. This is public now. I'm going to have to scrub all the data, all that stuff.
Amanda:  Hopefully that's not permanent.
Ashley Roberts (You):  Yeah.
Amanda:  Claude told me I had to request information to be scrubbed from Google, and I didn't do that for the design hub. Austin, if you want to, like, maybe not now, but at some point, just give me some pointers on what advice to take and what I can ignore on the privacy standpoint, that would be great.
Austin Boardman:  Yeah, at least from an SEO perspective, we probably don't want potential customers stumbling on that if they Google uplines. So just tell Claude to add a robots.txt or a noindex file.
Amanda:  The same as the guidance he gave me a while back?
Austin Boardman:  Probably.
Amanda:  Probably. Yeah. I did that for—I did that for the design hub.
Amanda:  I haven't done that for the throughline yet, but now that I know that I can do stuff like that and just push it, I'll probably just do that. Unless that bothers you, Ashley?
Amanda:  I don't feel like it'll change anything other than just the—that noindex state.
Ashley Roberts (You):  Yeah. Honestly, the throughline, since it's just an internal thing.
Amanda:  Yeah.
Ashley Roberts (You):  I have very little stake in that, so.
Amanda:  So I just did that, just pushed the stuff that I've been working on. A couple of the last things that I really wanted to get a first pass together on, so they're kind of—like, they're not designed pixel perfectly. They're just a good iteration of what I thought the screen needed to be from a user experience perspective.
Amanda:  So that is the shopping results. And then just kind of that drawer in general.
Amanda:  I think there was some—there was just a lot I was trying to work through on terms of, like, talk to Austin about Members First kind of adding all those notes into the policyholder drawers that you guys had in the Notion for the combine.
Ashley Roberts (You):  Mm-hmm.
Amanda:  So I wanted to just have something there to placehold that idea. And then I added a recent activity log to keep better track of the policyholders' progress through the renewal process, because we kind of had stuff popping up and going away.
Amanda:  So when you had the combine, you could have it in those categories of, like, "Now it's in shopping. Now it's in closing.
Amanda:  Now it's been closed." Like, all of that kind of stuff.
Amanda:  But once you remove the combine and you just have it popping up with only things that need attention to from Stacey or this agent, you kind of lost that context. So I tried to add that back in in a permanent way where you could always see where it's at and what's been done and what's about to happen.
Amanda:  And then also added a table of all of the policyholders, like I was talking about. So our thought—before I pull you guys through what I did, I wanted to address, like, what we need from this session, what I'm thinking we need, which could be wrong, is we need to identify if and what needs to change specifically before we show this to Stockton.
Amanda:  It's Stockton, right?
Ashley Roberts (You):  Mm-hmm.
Amanda:  Stockton Hill. That would be tomorrow.
Ashley Roberts (You):  Mm-hmm.
Amanda:  So we need to know what needs to change before that, which is probably definitely content needs to be anonymized. And then what needs to happen before we potentially show this to Members First. And then outside of that, I am never going to show you guys something with the—especially not with product—with the intention that there's not going to be edits.
Amanda:  Like, I know that edits is the goal so that we keep getting better. So if there's no edits from this, that means we're all bad at our jobs.
Amanda:  So I definitely need feedback. I'm thinking long-term feedback is good too.
Amanda:  Like, if you guys want to gather your thoughts after this session and get more feedback, or, like, Ashley, if you want to take a pass on your own, that's all good too. I just think that we need to identify what our priorities are because we have such a short timeline moving into this just being done.
Amanda:  So I also thought that we probably need to address what's—what we talk about in the demos, because I've been in a few of them where we don't really address, like, what our top priorities are, and then we end up just blah, blah, blah, blah, blah, talk, talk, talk, talk, and then we don't get to everything, and then we don't get the feedback that we need. So that might be good too, if we can talk about the primary things.
Amanda:  It's probably those magic moments, is what I'm thinking. But I'll give you guys—I'll stop talking.
Amanda:  I'll give you guys some room to weigh in on that plan.
Ashley Roberts (You):  No, I think it's the magic moments. I think the number one thing is, like, what is your primary workspace? Like, it was the combine board and my sketch thing, but, like, what is that going to be is probably number one in my mind.
Austin Boardman:  I think it's having a couple options we can show to users and get their feedback on, like you said, what gaps are there. There's just so much, especially about, like, the end of the funnel, that was really tricky for Members First because they were like, "Oh, well, they asked for a life quote, but then this other guy is going to do the life quote, and that's going to take a 2-week-long process." And so just, like, some mechanism to make sure, like, that stuff doesn't get
Austin Boardman:  forgotten is, like, almost half of the workflow, and it's almost, like, sending out the emails is the easy piece. And I kind of like, like, what you showed this morning where it did de-emphasize, like, nitpicking the copy in every email.
Ashley Roberts (You):  Yeah, same.
Amanda:  Anything on your end, Dougie?
Speaker 4:  Nope. Just jamming out.
Amanda:  Cool. Sweet. Okay, then I'll share my screen, and then I gave—hopefully the link shows up for all of you guys too.
Ashley Roberts (You):  Mm-hmm.
Amanda:  In the chat.
Ashley Roberts (You):  Yeah, I got it.
Amanda:  Let's see.
Amanda:  This is probably going to be painful for me, by the way. It was already painful for me to look through and be like, "Oh, my God, there's so many design things I would change."
Amanda:  This one, though, I spent plenty of time on. So one of the main changes here—so this is v2 up here—is just the reskinned version of Ashley what you did, which is also retained.
Amanda:  So we have a login screen that's maintained here. Here, I changed the login to an email that would prompt you to go to the web app, and I did completely ignore the login because I was like, "Isn't there a world where we can just have that automatically log you in?"
Amanda:  And then didn't address that anymore on my side. So we can talk about that more if we need to, but I figured I'd breeze past it for now and just show you guys what I've worked on.
Amanda:  The intention of this email was to make everything as easy to understand as possible and then kind of reflect what RAMP does and give you a CTA that describes what you need to do under each section. So here it tells you what's going on with Anika, what's going on with Linda, leveraging the things that I anticipated, so it renews in 4 days.
Amanda:  What I didn't want to do is make it big and red and really scary. Instead, I wanted to just put it up there and let them—because I really hate big red scary notifications when you know that it needs to get done—that can be challenged.
Amanda:  But for now, I just wanted to put it at the top. This is renewing here soon.
Amanda:  I changed the renewal date to how long you have until it renews, if it is renewing within the week. For shopped and ready for review, this comes kind of secondary.
Amanda:  And then here I added a different styling to the renewal emails. I thought we had decided that we weren't really—like, that people didn't really need to review that.
Amanda:  I think that's what you just mentioned before. We kind of de-emphasized.
Amanda:  You don't really need to look at those. You probably—and my assumption is you probably can't.
Amanda:  You probably don't have time to. So I didn't want to put too much space or assign too much space to something they probably can't do, but still giving them the ability to view that on upline.
Amanda:  All of these would probably go to the same place. I hadn't really determined yet what that does.
Amanda:  But moving past that, I did change one quick thing from—and I don't know if it was a good idea or not, but it was, like, a technical feasibility change that I made. So originally, when you logged into the upline homepage, I had it with the things that needed your attention the most up at the top within this header.
Amanda:  I could just see that being really variable depending on what it is that you needed to get done. And it was easier for me to think of how we would do the logic if we just had the three sections beneath that.
Amanda:  So if they don't have anything in closing, they don't have anything in shopped, it seems like there's pretty much always something in scheduled emails.
Ashley Roberts (You):  Mm-hmm.
Amanda:  But if they don't have anything in either of these, they would just depopulate. They wouldn't be there. And then that made it kind of—I'll breeze past this too—but, like, there just introduces a lot of complexity here.
Amanda:  So we don't need this chat modal. I kept deciding to keep it in there because it gives us a little room to say, like, "We do have business insights."
Amanda:  Like, you can put in, "How's my retention this session?" And you can just kind of use it as a, like, a conversational point.
Amanda:  It's not thought through from the technical standpoint, and I don't know if it's important for MVP. So I'm just going to put that out there.
Amanda:  What I think is more important is this really little line here. I do like that this is a text link because ideally, you shouldn't be working from your policy list, like your policyholder list, because it should be easier for you to work from this than by viewing the default table.
Amanda:  But I wanted to add a text link that takes you to this just in, like, so that it's easily available just in case someone's like, "Why am I not seeing anything?" I want to see everything.
Amanda:  You can quickly go to that. I also have it linked here in the user settings.
Amanda:  So you would have your profile, your policyholder list, and your account settings. Profile and account settings are not active.
Ashley Roberts (You):  Mm-hmm.
Amanda:  So I'm breezing past so much stuff here, but basically, I took an intentional pass at making it as easy as possible to close out renewals as you can while not de-emphasizing that we need information from them.
Amanda:  And I know that we were going to go through that flow a little more in-depth later, but I like that RAMP has a section where you can add a memo. We can change wording here, but you can just directly fill in that from this page.
Amanda:  Let's say you're waiting on something that's like, "Oh, I need the client to—I need the client to send, like, to sign a document.
Amanda:  They're not available for the next 2 weeks." But as soon as they sign that document, I can go in here and just add in that memo.
Amanda:  Also, these three dots here at the top give you the capability to view the profile or view the renewal history.
Amanda:  I think that would be in the profile now. There's been some updates that I've made since this, or a report an error, of course, with AI.
Amanda:  I wanted to include that. I don't know if this is clickable.
Amanda:  This isn't. So I'll just go through the flow here.
Amanda:  Each of these, when you view the full report, so you'd be able to view the profile, which would be that drawer. But the idea is that you'd be able to view just that kind of shopping experience if you were to just click view the full report.
Amanda:  That might be a little confusing, but I thought it would be helpful to just have it one click instead of have to go through the drawer through another click. I'll explain that more later.
Amanda:  Here, the six renewal emails. Since we had it flowed like this originally, I would probably change it to maybe quickly do a closing flow or something because it feels a little odd.
Amanda:  Maybe it doesn't. So here you would say, like, "Here's your screen."
Amanda:  You'd go down to the renewal emails where you would see that there was a renewal email scheduled to go to Dana and Mike. You can click review, though you don't really need to.
Amanda:  And here, not a lot has changed other than that this is now a modal, whereas before, everything was in this tab. So the reason I changed that is because I wanted to introduce the idea here of, like, a place where all of your renewal activity could live, which is what I was talking about before.
Amanda:  So you would be able to click through this renewal email. I'll show you how it changes.
Amanda:  Review this. It would be retained.
Amanda:  Let's see if it actually retains. Let's see.
Amanda:  So it says sent, view, but also it should, yeah. So it'll be the status of that will be retained in this recent activity section.
Amanda:  Do you guys have any—I don't feel like I did a very good job explaining that. Do you guys have any questions about that?
Ashley Roberts (You):  No. No, I'm following.
Austin Boardman:  About what specifically?
Amanda:  The experience of the recent activity tab and the review modal. Does that make sense? Or that was something that I was working on today, so I haven't really put it through my, uh, does it actually make sense or was it just a vibe codey thing?
Speaker 4:  It makes sense to me.
Austin Boardman:  A little bit like there's sort of a pop-up over a pop-up when you pull up the email and then open question of, like, "Can I view the questionnaire?"
Amanda:  Yes. So here, I kind of changed it to where you can view it. This is my quick way of showing that because you're just jumping to the other page.
Amanda:  But you can't change it.
Austin Boardman:  And so what are the mechanics of how the questionnaire gets viewed? Because we wouldn't want to, like, visit the direct link. It would need to be like a, like, preview version of it.
Amanda:  Yeah. I was thinking that the preview version would pop up in another tab in your browser. It'd be like a—but you'd have to determine if that was like a PDF or be like an HTML preview, probably.
Austin Boardman:  Okay.
Ashley Roberts (You):  I think I'd almost prefer to have just the questions listed below, going back to, like, almost more of like the wireframe thing.
Amanda:  Mm-hmm.
Ashley Roberts (You):  All being like, "This is what you're sending." And, like, that's within one view of, like, all the stuff instead of, like, another click out.
Amanda:  What I—
Ashley Roberts (You):  I also think what—oh, go ahead.
Amanda:  What I liked about it, and this could—I don't know. What I liked about it is that you see the same thing that they would see because you're kind of seeing just a draft version. And whenever I would set up something, like with MailChimp, I was like, "Great, that's the draft, but what is this actually going to look like?"
Ashley Roberts (You):  Mm-hmm.
Amanda:  And that's what I liked about something like this if we weren't going to give them the ability to change anything anyway. But you can still add, like, a little eyeball that's, like, preview. It puts you in a different tab that shows you the full email with the questionnaire.
Amanda:  And then you can still have your form at the bottom. That'd be more work, though.
Ashley Roberts (You):  I think I'd prefer that, but I would not die on that hill, so.
Austin Boardman:  I think I'm team showing exactly what it's going to look like. The downsides are if we're missing information, you have to, like, type in some bullshit information to be able to progress through the form so that we can demonstrate what the required fields look like. There's the, like, identity verification.
Austin Boardman:  We ask for birthdate as the first question on the questionnaire. We would skip that just to, like, make their life easier, I think.
Austin Boardman:  I think the preview directly in the email—
Amanda:  Hold on. I'm going to record. Sorry.
Ashley Roberts (You):  I'm recording it.
Amanda:  You're okay. Thank you. Thank you for that.
Amanda:  What were you saying?
Austin Boardman:  Okay. So the idea is when I'm looking at this, I'm seeing an email that is editable. And so there's a scenario where I just, like.
Amanda:  Delete the questionnaire.
Austin Boardman:  Delete the questionnaire link. And then.
Amanda:  That's what I was just.
Austin Boardman:  Is there a way to recover that? I don't know. As it's designed currently, it doesn't scream, like, editable to me.
Austin Boardman:  Like, subject line in particular, I'm not sure what to change about that to, like, indicate that that can be modified to the user.
Amanda:  Yeah. I've been working back and forth with this email box. That's something that I would continue to, like, I'm going to make a broad statement here without thinking about it much, but I feel like the points of interaction from the user are probably what need to be prioritized before launch.
Amanda:  Like, the stuff that is editable by them, to narrow that in. I'm just thinking for now, I'm thinking broad experience.
Amanda:  But before we launch, I would definitely want to take a pass at making this form more user-friendly.
Ashley Roberts (You):  I also—I am not a fan, just, like, user experience of, like, the drawer and then the modal on top. I see the interaction, but can we do the same type of thing with, like, I'm going to say Asana again, even though we don't use it anymore. I think Asana does the double drawer, which I always thought was weird until I interacted with it.
Ashley Roberts (You):  And then I like interacting with it.
Amanda:  Like double click?
Ashley Roberts (You):  So it'll, like, draw right on top until you, like, like, minimize back in. Or not minimize, but, like, you draw it back in, and then that's what, like, refreshes the main drawer. I'm doing a terrible job explaining it.
Amanda:  No, I know what you mean.
Ashley Roberts (You):  But I'm using the existing one as opposed to a standalone modal.
Amanda:  RAMP does a version of that. Hold on. I didn't close out my RAMP tasks just so that I could show you guys.
Amanda:  If they're wondering where my receipt is, they're never going to get it.
Ashley Roberts (You):  I have so many receipts on my notebook.
Amanda:  So they—let me see. Where does this go again? Let's say expenses, home.
Amanda:  Oh, that's what I did. This is where I got the idea for the three-stack thing.
Amanda:  It's not the best, but at the same time, if you're meant to understand everything at a glance, I understand the point of having that. So here, that's what the—it's the idea is the same as the drawer, though it is not a drawer where you can just kind of go back from here.
Ashley Roberts (You):  Yeah.
Amanda:  The reason I went with the modal, and I know this is something that I prefer, so it's definitely worth poking at. Like, it's not feedback that I'm fighting at all. The modal, though, I liked that you didn't lose where you were.
Amanda:  Whereas with the RAMP version, when I referenced that, I was like, "How do I get back to where I was?" So that's, like, my one little point of why I did it this way.
Amanda:  But I can definitely move it to the drawer overlay.
Ashley Roberts (You):  My—so two things. One, I can be on modal team if even just the modal did not look like a floating drawer.
Amanda:  Oh, my gosh.
Ashley Roberts (You):  Even shorter.
Amanda:  Real estate space.
Ashley Roberts (You):  Yeah, like shorter, wider. Like, even that would help.
Amanda:  Let me show you something. Hold on.
Ashley Roberts (You):  The biggest thing on that is that, like, I feel like when I'm in here, though, like, reviewing those emails feels more like a primary activity if I am opening a drawer. But now it's behind an additional click as if it's like a tertiary or, like, edge case scenario when, like, if I'm opening the drawer, I'm most likely going in and modifying the email. So that's like the biggest, like, true UX beef I had not been working on.
Amanda:  That actually makes a ton of sense based off of how I reframed the other screens and not that one. So this is what I just went through with the—I don't feel like you're losing any points in the story if I just jump ahead to this. You guys know what happens.
Amanda:  So this is Thursday now. You've got your shopping results back.
Amanda:  And instead, so I kept the profile here. You don't click through the profile.
Amanda:  It's just pointing out, like, it's not pointing out Dana and Mike's profile. It's pointing out the shopping thing came back for Dana and Mike.
Amanda:  You don't have to skip through anything. You just get the modal of the shopping results.
Amanda:  I am 100% only confirming probably both of your guys' fears about translating this to a more paragraph form summary instead of bullet points. My intention is that this is easier to read than the bullet points, but I just did it a minute ago.
Amanda:  And this is definitely way harder to read than the bullet points were. So I might just translate it to bullet points.
Amanda:  My intention here was to say, like, "Here's your shopping results. Here's the main points that you need to be aware of that you can't get out of just reading the table.
Amanda:  And here's our recommendation without too much in the way." The result is just a bunch of copy that I'm not reading.
Amanda:  And I can't tell that you even made a recommendation. I'm just looking at the table.
Amanda:  So that failed. But outside of that, what I did was separate it into steps because one of my issues with the way that the shopping screen was set up before was that it felt like I was taking three separate steps in one screen.
Amanda:  So I separated it to first, you're going to read the results. Ideally, it's formatted way better than this.
Amanda:  You can view the quotes from your carriers, which I just have as, like, a pop-up here. Then you make your recommendation.
Austin Boardman:  Where does the pop-up?
Austin Boardman:  Oh, so this would just be the PDFs?
Amanda:  Just the PDFs. Raw PDFs that they got that the data was pulled from to make the shopping recommendation.
Austin Boardman:  Okay.
Amanda:  So then you assess this. You continue to select your recommendation. It gives you a little brief of what each plan is.
Amanda:  You review your email after you—I was just trying to think of something that we had said during the demo, which I was like, "What was it that we were going to add?" We were going to add the ability to—or during the design sprint, we were going to add the ability to add or not add specific information in the email to the user, which was going to include a link to a webpage.
Amanda:  I know that that's overlooked in this. I don't feel like we need to be doing a webpage for MVP.
Amanda:  That's it.
Ashley Roberts (You):  I don't think so.
Amanda:  We can—I'm interested in your guys' thoughts on that too. I don't want to just make that statement and then be like, and then have them be like, "Where's the webpage?"
Ashley Roberts (You):  I think it's cool. I think it should be the first thing we do next. But I am just worried about getting this full experience at the bottom of it.
Ashley Roberts (You):  So I'm like, "I want to kill that off," especially because, like, our pilot doesn't even do that. I think it will be super valuable, but I don't really.
Amanda:  It looks like right now, yeah, we have the link to see the details. I don't know if it's necessary. What's your thought, Austin?
Austin Boardman:  If the lens is, "What do we need to build to have a successful MVP," I think this would be below the line for me.
Amanda:  I saw a nod. Dougie, what's your thoughts?
Speaker 4:  Are we just deciding on whether or not to surface this modal?
Amanda:  We're talking about—we originally wanted to have a whole customized webpage that the policyholder would look at and read that would just, like, boil down what we were recommending and what changed from their last renewal and all of that. We can put that information in an email. It doesn't really have to be a landing page.
Amanda:  The landing page was something I feel like we kind of thought would be a really good marketing tactic during the design sprint.
Speaker 4:  Oh, I see what you mean.
Ashley Roberts (You):  But then we have a policyholder landing page that's like all their own—the problem is—sorry. No, you go ahead. What's your—
Speaker 4:  I see what you mean. So I think if Austin feels it's below the line, I say we just roll with that. And it could be a fast follow.
Amanda:  Austin has bad opinions sometimes.
Austin Boardman:  All the time.
Speaker 4:  And I only say that because he knows the market and the end users better than I do. And it is definitely something that we could bolt on quickly later, so.
Amanda:  That's very true. Yeah. I feel like that's not a big lift.
Amanda:  And then part of it too, I feel like the need to have—this is going to feel really—this is going to feel wrong for me to even say it's going to feel really egocentric. But I feel like we anticipated that this app was going to be less design-forward.
Amanda:  But then in application, it feels a little bit more refined than what I thought it was going to be. So part of the want for that landing page was to have something that looked impressive to show to people.
Amanda:  But I'm like, if the rest of it is good enough on its own, do we really need to just throw something together for that purpose? That doesn't feel right.
Amanda:  Anyway, so that was my thoughts behind the shopping experience. Sounds like we're not going to pursue the landing page for now.
Amanda:  I think that that's most of what I did. Then it gives you the email.
Amanda:  The closing experience is still really—like, this is just really dumb. We closed.
Amanda:  I'd like something better here, but I know we were going to talk about that because we weren't really sure what that involved.
Ashley Roberts (You):  Yeah.
Austin Boardman:  Can I share my thoughts?
Amanda:  Yes.
Austin Boardman:  Okay. Can you undo that?
Austin Boardman:  So I feel like there is high complexity to the closed workflow, and the card doesn't reflect that fact. In order to, like, close a policy, I'm going to need to every single time click into it, refresh my memory on what we recommended, figure out what carrier we're switching them to.
Austin Boardman:  And so having this interaction be buried under, like, three dots feels a bit off. And having, like, add memo and mark as closed as the primary action feels like we're getting ahead of ourselves.
Austin Boardman:  And it's like, "Oh, if I have a task to, like, close this deal, I'm going to spend the next 30 minutes going to the existing carrier, logging into their portal, canceling their policy, notifying them of whatever happened, going to the new carrier, double-checking the quote that the VA put in, binding, picking up the phone, calling the client, getting their new bank account information, putting that in the carrier, closing that." That assumes that everything happens in a single carrier, and we don't have a separate, like, new
Austin Boardman:  line that we're selling. And so the way I'm thinking about this is default action is probably that I open up the drawer and refresh my memory on what needs to happen and take or leave this note. But, like, a snooze function could be interesting as, like, the first baby step towards, like, task management and, like, collaborative, like, task delegation of just saying, "Okay, I know that this is something that needs to happen.
Austin Boardman:  Someone else was going to have a chat with them next week about the life quote, so let me just snooze this till next week."
Austin Boardman:  My fear is that these stack up with lots of to-dos, and then as a user, I have to, like, read through all of them and be like, "Oh, Dana and Mike, yeah, I'm still waiting on a callback from them. Bruce and Susan, shit, I still need to get their life quote, but I won't have time until next week."
Amanda:  Yeah. That was what I kept looking at the screen specifically and being like, "Can I imagine this with actual information?"
Ashley Roberts (You):  Well, especially because, like, what we are considering closed, like to Austin's point, like, that's a massive chunk of the actual experience. So it moves to close the moment you send the recommendation, which means we don't actually know if someone's staying with their carrier, they're switching carriers, they had an additional question. Like, we don't know any of those things.
Ashley Roberts (You):  So it's just like, send recommendation, go to closed state. And then I think snooze could, like, get us part of the way there of like, "Okay, I at least know what I'm doing, and I can snooze it so it's not, like, cluttering up."
Ashley Roberts (You):  But then the other side is then I think you'd want it to be persistent within a certain date range of the renewal coming up.
Amanda:  Yeah, that's what I was just thinking.
Ashley Roberts (You):  I think now and on, it should stay persistent at the top until you've taken it.
Amanda:  I kind of feel like closing should switch to the headline should be closing this week instead of just closing. And so anything that's not closing that week is not notifying you on your homepage. But if it is closing that week, it pops up here with a better so it wouldn't say, "Mark as closed with this memo."
Amanda:  From what Austin says, you're not really usually closing it out as closely to the renewal as I thought you would be or, like, your recommendation as I thought you would be. So the action here would probably be taking you to their profile with, like, this big CTA that says, "View their profile," with it still having this kind of banner up here for closing.
Austin Boardman:  Or maybe it's like action needed this week.
Amanda:  I don't know what this is. Yeah.
Austin Boardman:  Or something. Because the other instance where I would want to be, like, notified very soon is, man, maybe I don't even believe it. So I'm trying to think through the cross-sell piece of it.
Austin Boardman:  This would happen after we get the questionnaire back, and you could surface this and shop and ready for review. But let's say Alina Vasquez says, "Yes, I want a life insurance quote."
Austin Boardman:  That almost I don't want to split it into a separate workflow, but it does sort of, like, run on a separate timeline.
Austin Boardman:  Is there a way that we can surface that in this, like, shopped and ready to review section? Because we're not going to shop cross-sells.
Amanda:  Let's just add a do you think we could just, for now, just add a chip that says for one of them that says life insurance requested or I don't know what that terminology would be. But I feel like for the purpose now, the flow will need I just want to get feedback on whether or not we're correct that that needs a different flow that they would want.
Ashley Roberts (You):  I think the chip and tag, I think that works well for, like, an MVP state of what that is. Because then I'm like, I want to know that they should have been triggered into a cross-sell or sales team workflow. But then if we are adopting the idea that then closing is, like, anyone with, like, five to seven days out, let's say five business days out from the renewal date, they're then going to have that tag on there so that you know you need to go check
Ashley Roberts (You):  in also with sales team. Get an update of that.
Austin Boardman:  Yeah, because the other thing that makes this annoying is without the landing page, we don't get any indication from the user that they decided they wanted to switch. The communication lines will be option one, email, or option two, phone call. And then this just becomes a CRM where the agent has to go in and, like, they had a phone call with someone and shit, I have to update the notes in my CRM.
Austin Boardman:  So I think I do like that as, like, let's just surface the loose end renewals in this top section.
Austin Boardman:  I don't care if it's called closing or whatever.
Austin Boardman:  And then I suppose if they asked for a life policy, we would still, like, surface that as a loose end, even if I don't know.
Austin Boardman:  There's the other edge case where there wasn't a big policy increase and we chose not to shop.
Austin Boardman:  And so those people, if they requested a cross-sell, we would still want to surface those, but not in the section where it's shopped and ready because we won't have shopped them.
Ashley Roberts (You):  I think those go straight to closing, though. And then they're popped back up here when it's, like, five days out from renewal. And so then if it's like, they didn't say they want to be shopped, well, we don't even have that option in our workflow, though.
Ashley Roberts (You):  If you fill out the questionnaire, we will shop you.
Amanda:  I'm taking away from this.
Ashley Roberts (You):  No?
Austin Boardman:  We said we want everyone to fill out the questionnaire. We're not going to shop everyone, but we should get hygienic data from everyone. I guess that's the other action that an agent could need to take from this information is, like, "Oh, we need to update their occupations because we learned some new information, but we're not going to shop them."
Amanda:  Yeah. So right now, there's no option to not shop. It just default shops based off of the thing.
Ashley Roberts (You):  Well, that's how the pilot worked. I guess I missed the part where we changed.
Amanda:  I don't know if we intentionally we went back and forth on it, and I don't know. I think there was a part because that was what I kept getting stuck on. I was like, "How do we decide if they shop, what they shop, where they shop?"
Speaker 4:  I think it was the results of the questionnaire that helps the agent determine whether or not to shop.
Amanda:  It was that, yeah. It was the shape of the shop section, which I don't this is marketing terminology that doesn't feel like it needs to be there, that you can somewhat decide what you want to be shopped. If you want to make any recommendations moving forward, that feels like that should be optional.
Austin Boardman:  Well.
Ashley Roberts (You):  Well, that's the question.
Austin Boardman:  My recollection was when we talked about this module at the bottom, it was for cross-sells.
Amanda:  So that was just cross-sells. And then there was another let me look at my photos.
Ashley Roberts (You):  So we're saying then so you're saying, Austin, like, in this new flow for MVP, it's like, fill out the questionnaire. No matter what, we're asking everyone to do that. And then just one of the questions in the end of the questionnaire is, "Would you like us to shop for your renewal?"
Ashley Roberts (You):  You check yes.
Amanda:  That's what we were.
Ashley Roberts (You):  And that's.
Amanda:  We were debating whether or not we wanted to for our recommendation to be prioritized for price sensitive or, like, make your book as valuable as possible for the insurance agent.
Austin Boardman:  I think that's an unrelated thing. So deciding whether we shop or not was it takes us a lot of resources to shop every policy. And if someone doesn't have a price increase, it's not worth our time.
Austin Boardman:  Or if the agency is incentivized to not move someone from a specific carrier, this is what's happening with Stockton Hill, then we don't want to offer to shop. We do still want to send the questionnaire so we can get updated data and offer to cross-sell.
Ashley Roberts (You):  Okay. So then the user opt-in is happening inside the questionnaire. I think that logic makes sense.
Ashley Roberts (You):  But then is that trigger happening inside the questionnaire questions?
Austin Boardman:  We're saying different things. For Stockton Hill, if the user has auto-owners, we're not going to allow them to opt into shopping.
Austin Boardman:  The agency determines that.
Ashley Roberts (You):  Gotcha.
Ashley Roberts (You):  Okay.
Ashley Roberts (You):  That feels weird to me, but okay. That's fine.
Ashley Roberts (You):  So then if I'm like, "No, I do want to be shopped," I have to now email them and be like, "I filled out your questionnaire. Also, can you please shop me?"
Ashley Roberts (You):  That feels so weird.
Austin Boardman:  But this is what we're already doing with Stockton. Like, this is not a change from what we've already decided. Like, we actively do this on Stockton Hill.
Austin Boardman:  We send them an email. We say, "Hey, your renewal is coming up.
Austin Boardman:  Let me get some information from you so I can process your renewal." And if someone has beef with their premium, then they email.
Speaker 4:  That's not too terrible of a user experience.
Amanda:  Wait, hold on. You said if your renewal is coming up.
Amanda:  What's that? What did you say after that?
Amanda:  Because I thought you said, "We're going to shop your renewal."
Austin Boardman:  No, we're going to process your renewal.
Amanda:  We're going to process your renewal.
Austin Boardman:  Your policy is renewing. We want to make sure we have the most up-to-date information. Fill out the questionnaire, and you'll renew with us.
Austin Boardman:  Thanks for your business.
Amanda:  Okay.
Ashley Roberts (You):  Yeah. My breakdown was this is just I just misunderstood. My breakdown was, yes, we frame it as we aren't shopping, which now as I'm saying this out loud, I see where this sounds dumb.
Ashley Roberts (You):  But like, we aren't shopping. But for the sake of it, we will still shop on our end just to see if there is something that's better.
Ashley Roberts (You):  And then we would proactively bring that to them if it applies. But like, literally just filling out the questionnaire is the trigger to do that.
Ashley Roberts (You):  But I was saying that out loud, that doesn't make sense. So that works.
Ashley Roberts (You):  That works.
Ashley Roberts (You):  Especially with the Stockton Hill stuff. So never mind.
Ashley Roberts (You):  So just scratch all the confusion I just had.
Austin Boardman:  Okay.
Ashley Roberts (You):  I just thought, yeah, whatever. Okay.
Amanda:  So do I add an offer to shop toggle on the shopping page?
Ashley Roberts (You):  No, we're saying the logic well, let me say this to make sure.
Amanda:  Yeah, I need clarification.
Ashley Roberts (You):  The logic that is going through of saying how we frame that email. If the email says either, "I'm happy to shop it for you if you want," or, "I strongly recommend you shop," when they fill out the questionnaire, we would shop. If we do not offer to shop at all in the initial email, even if they fill out the questionnaire, we will not shop that.
Ashley Roberts (You):  We are just saying, "Hey, there's updated information. You should make sure all your account records are the same, i.e., update your AMS."
Amanda:  So nothing needs to change here other than that experience.
Austin Boardman:  I think nothing here, but I think it's like, how do we surface to the agent that they need to go into EasyLinks and change Ashley's job title?
Amanda:  Yeah. Yeah. Okay.
Amanda:  Open question.
Ashley Roberts (You):  And in the members first, I'm not saying the UX needs to show this, but I felt like it was powerful to literally highlight and say, "Eight pieces of data have changed," or, "There are eight net new." Like, highlighting kind of like how much doesn't match now.
Amanda:  Yeah.
Ashley Roberts (You):  I kind of liked that.
Amanda:  I feel like we can pretty easily do that in the combo of, like, recent activity. You can have the note that says, "Questionnaire filled out. Eight points changed."
Amanda:  And then these points that changed could be highlighted with just a little icon. And then you could have, like, a tooltip that says, "Change this in EasyLinks."
Austin Boardman:  Yes. And where does that get surfaced to the user? Because if we're not shopping for them and if we're not doing a cross-sell, there's not really an action.
Austin Boardman:  This doesn't get surfaced on, like, the home screen.
Austin Boardman:  It disappeared after we sent the email to them.
Amanda:  Hold on one second. Let me think.
Ashley Roberts (You):  So it's like, is that part of the closing thing? Is it treated completely separately?
Amanda:  Probably needs separate. Right.
Amanda:  Another open question. I'll address that one afterwards.
Ashley Roberts (You):  So there's three, it sounds like, jumping off I'm right here, three states that could potentially be combined in some ways. One is they fill out the questionnaire, you're shopping, you'll get a recommendation, you send the recommendation, you close the account. That's like the one we always talk about.
Ashley Roberts (You):  There's the, like, you may or may not want to well, wait, hold on.
Ashley Roberts (You):  What's the scenario if it's like, "I have a cross-sell, but nothing else"? Does that ever apply?
Ashley Roberts (You):  It's just like, "I will want to be shopped and a cross-sell"? Or will there ever be just cross-sell?
Austin Boardman:  Yeah. Everyone with auto-owners.
Amanda:  Yeah.
Ashley Roberts (You):  The auto-owners is like, "Okay. So let's say I'm not being shopped, but I have a I'm interested in a cross-sell opportunity. So I need to highlight that there's like a cross-sell path that's happening that's gone to the sales team."
Austin Boardman:  So that's.
Ashley Roberts (You):  So in closing, I just need to give an update.
Austin Boardman:  That's why I'm like, the closing section up top, I would just have that be like, "Here's what's on my plate this week. Actions required this week," or something like that.
Ashley Roberts (You):  Yeah.
Amanda:  I'm kind of thinking actions required this week is the majority of it. And so then we lose every section except for the difference between these kind of scheduled things that are being sent out. So those would be their own section because it doesn't need your action, but it is something that's happening this week.
Amanda:  So it'd be like in the background, this stuff's happening. And then this stuff up here isn't going to be separated into like three different sections because that feels unnecessary.
Austin Boardman:  Closing does make sense for the cross-sells too. Maybe it's that these cards could be expanded because it's like the card represents one account. An account could have multiple actions associated.
Austin Boardman:  One is a renewal, which is what we're showing here. The second is a cross-sell.
Austin Boardman:  And those can be on different timelines. But like, do we surface the household or client card only with the event that's pertinent to the next seven days timeline?
Ashley Roberts (You):  Yes. Yes.
Austin Boardman:  Or to simplify that, we could go back to the tag UI where we just tag that there's a cross-sell attached. But that kind of lacks, I guess, urgency or a clear deadline or who's owning it.
Ashley Roberts (You):  The cross-sell thing that we're.
Amanda:  Yeah. I want to.
Ashley Roberts (You):  I think I like, it's not needed, but I think I still want to tie everything to a renewal date. Like, I know it doesn't have to be like that, but like, I think I still want that framing of being like, "Was interested in cross-sell. They renew in three days.
Ashley Roberts (You):  Do you have an update?" Ugh.
Ashley Roberts (You):  I don't know. I just don't want floater things hanging out for a while.
Ashley Roberts (You):  And like, from my perspective and like, the vibe I got from like members first was like, if that's like over in sales, it's like, that's sales team. Like, I did my thing.
Ashley Roberts (You):  That's in sales team. And I like want to create some I don't know.
Ashley Roberts (You):  Like, it's all fabricated at that point, though. Like, I want to create some kind of like feeling like I need to close that out and give an update.
Ashley Roberts (You):  So that's why I'm like, if I put the renewal date, will that urge someone to just like close out with a status? I don't know.
Ashley Roberts (You):  And same with the updated information.
Austin Boardman:  Because there are still cards on the members first board that are in like needs sales team or whatever.
Amanda:  Yeah.
Austin Boardman:  But they're also like one model. Like, there's if we sell to like that guy where it's only two of them, like they're going to handle all their own cross-sells.
Austin Boardman:  So that's why I'm just back to like snooze. Like, if it's something you don't want to fuck with this week, snooze it till next week.
Austin Boardman:  And then I can like Teams message the sales team and see if they had the call with Linda for the life insurance policy.
Ashley Roberts (You):  But I'm game for that. But then when is it being prompted to me? Is it just the moment I send that email out, immediately in this closing to-do list, or is that then structured based on a certain number of days out from renewal date?
Austin Boardman:  When you send the questionnaire email?
Ashley Roberts (You):  When I send the well, yeah, depends on the state. Yeah. So if I send the questionnaire email.
Austin Boardman:  Then path one is you get a questionnaire back and then we shop it. Path one B is we get a questionnaire back that doesn't need shopped, but has a cross-sell, and then that's an immediate closing action. Path two is we don't get a questionnaire back, and then, I don't know, open question of like, do we want to make it my task to do a phone call or something?
Austin Boardman:  Maybe that's an agency setting that they can choose.
Ashley Roberts (You):  I'm talking about for 1B scenario. Like a 1B like if I'm not having a trigger of like, I send a questionnaire, someone answers it, questionnaire is completed, I'm going to shop, blah, blah, blah. That funnel makes sense.
Ashley Roberts (You):  But if it's like, got a questionnaire back, not shopping, but I have a cross-sell, is now that going to populate immediately in my to-do this week, there's a sales opportunity, and I just snooze from basically the git. Or is that then only popping up like a week out from the renewal date?
Ashley Roberts (You):  And it's like, "Hey, remember, you have whatever. Is there a status update?"
Austin Boardman:  I think it's immediate.
Ashley Roberts (You):  Because you're not going to.
Austin Boardman:  Because if it doesn't renew for like 27 more days or whatever, but I have a hot lead that wants me to quote them on life, I'm going to drop everything and do that today.
Ashley Roberts (You):  Yes. Unless you're a members first where that goes to the sales team, and I'm going to snooze for three weeks. And it's going to clutter up my interface.
Austin Boardman:  It won't clutter it up. You snoozed it.
Ashley Roberts (You):  No, I have to go in and snooze now every single one that's done that. It's not a big deal.
Ashley Roberts (You):  That's fine. I feel like I'm being more argumentative than I feel.
Amanda:  That's just a sticky problem. It's not like an easy solution problem.
Austin Boardman:  It'd be pretty easy if this was a Kanban.
Amanda:  You're welcome.
Austin Boardman:  We should be the anti-Kanban.
Amanda:  Fucking Kanban.
Austin Boardman:  That actually looks really good.
Ashley Roberts (You):  I can't.
Austin Boardman:  It looks noisy. Like after seeing the new version, the Kanban is it's a lot of cognitive load. It's like, "Shit, which ones of these actually need my attention?"
Ashley Roberts (You):  I do like the familiarity of it. I do like that you can get to this type of like all of the data, like how you had that interaction, Amanda. I do like that.
Austin Boardman:  I think it's more of a power user feature.
Ashley Roberts (You):  Yeah.
Amanda:  Do we want to view the policyholder list in a Kanban? Just make that switch.
Ashley Roberts (You):  Are you saying as the primary interface?
Amanda:  As.
Ashley Roberts (You):  So this is basically a stopgap for, let's say you want more information than this, we did a bad job. The things that we just talked about. Like if we want to just surface this or Kanban, streamlined or Kanban, does it make more sense to just make this a Kanban?
Ashley Roberts (You):  Or make this have a Kanban capability where you can view it like this is a list view, and then we just do, we just add the Kanban view.
Austin Boardman:  I kind of like that.
Amanda:  Yes. Let's do that.
Amanda:  Okay. And I think technically I'm over.
Amanda:  I'm one minute until this meeting is over, right?
Austin Boardman:  Yeah. I can hang back though if you want.
Amanda:  Well, I think I can just review what I've taken away as what needs to happen like today. So after this meeting, what I think I'm going to do is resolve this issue to where this actually just pops up this instead of the drawer. I'm going to make all of this one section so it'll be something like what needs to happen this week, and then this is scheduled tasks or something.
Amanda:  So it'll be two sections. But I'll still have the snooze capability.
Amanda:  Add a chip for now, just today for the cross-sell kind of question and the questionnaire update.
Amanda:  Information capability.
Amanda:  And the Kanban view.
Amanda:  Is that it?
Amanda:  Do you guys want to keep sending me notes if you have time to kind of review on your own?
Ashley Roberts (You):  Yeah. How do you want those notes? Because I can go in and like get I had some like nitpicky stuff on here that you can take or leave, but how do you want me to just send those over?
Amanda:  What works for you? I was trying what I would like to do is add that capability in the prototype like it does in like Vimeo or something, but I didn't do that, and I don't have time to do that right now. So ultimately, it's however works best for you.
Amanda:  Maybe Slack or take a screenshot, put it in with a Slack message, and I just won't reply to your Slacks until you're done. And put it.
Ashley Roberts (You):  I will. I have a Figma connection. I'll drop in these screens into Figma and then add notes as little sticky notes.
Amanda:  That sounds good.
Ashley Roberts (You):  If that works.
Amanda:  Do you want to link that to the team once you've or like when you put that together, probably even before you put the sticky notes, just link the Figma link to the team and the do we have like a prototype channel or just the whatever channel works best? And then everybody can add the notes as they need them. I also need to anonymize data.
Ashley Roberts (You):  Yeah, that sounds good.
Amanda:  And add no index.
Ashley Roberts (You):  I'm going to have to write down all the paths we just talked about because I am going to get them twisted around again. I know for a fact. So I'm going to write those down.
Amanda:  Yeah. I'm glad we have everything recorded all the time. But at the same time, the like main takeaways I always have to recap because it is impossible to search through those transcripts.
Ashley Roberts (You):  Yeah.
Amanda:  Cool.
Austin Boardman:  Hey, Amanda.
Ashley Roberts (You):  This is really good.
Austin Boardman:  Is Figma like a thing of the past for your flow? Do you even use it at all?
Amanda:  I'm not using it currently because I need to work really fast and it's more vibe codey at this point in time. But once we get down to nitty-gritty details, so that would probably be next week, what we hand off to you will be Figma. I'm open to it.
Austin Boardman:  I'm not advocating for Figma at all. I'm just wanting to know if Figma is dead.
Amanda:  Historically, Figma is not dead. It changes every day. So Figma may end up being dead right now.
Amanda:  So just to like loop you in on the way that I'm currently working is that generally I start with Figma so that I can design the basics. And then I pull it into Claude so that I can see how it works when it's interacting and like going from page to page.
Amanda:  And I generally change a lot when I do that because it really changes the way that the design views. And so once I'll do that, I might take other sections and have Claude recreate them in Figma so that I can get nitty-gritty about exactly what I want if Claude's being a little fussy and doing its Claude thing.
Amanda:  Sometimes I work in tandem, so I'll do some stuff in Figma while it does that. So it's back and forth.
Amanda:  Figma's not dead yet, but it could possibly end up being dead.
Austin Boardman:  Nice. Okay. Good to know.
Austin Boardman:  Thanks for the walkthrough and everything. It's coming along really well.
Austin Boardman:  I love it.
Amanda:  Thanks.
Austin Boardman:  If I send you a Loom with notes, is that okay?
Amanda:  I hate that, but it'll work. Loom with notes is the worst to reference.
Austin Boardman:  Add comments to Ashley's Figma.
Amanda:  Thank you. You can still do the Loom with notes, but I might do the same thing that you're saying you would do anyway. So it's just hard to reference when I have to scrub back to specific time points to hear what you said to get that info when I'm working.
Austin Boardman:  Cool.
Amanda:  Thanks, guys. Bye.
Ashley Roberts (You):  Thanks.
Austin Boardman:  Thank you.
Ashley Roberts (You):  Bye.
