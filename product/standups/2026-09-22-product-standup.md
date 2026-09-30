# Product standup — Tue Sep 22, 2026

**Session:** Twice-weekly product standup
**Attendees:** Ashley (PM), Austin, Davy, Amanda (design), JV
**Addressed, not clearly on mic:** Doug (onboarding / quoting-preference admin)
**Transcript file:** this file

**Speaker mapping:** The recording named Ashley. Unnamed labels from context: **Speaker 1 is Austin** (ads recap, VA list, journey map, Stockton Hill quoting today, EZLynx RPA). **Speaker 2 is Davy** (VA hire, carrier-portal data entry, Looms as training, appetite, LinkedIn/PR). **Speaker 4 is JV** (auto-owners contingency, EZLynx Applied / Members First data warehouse; left for another meeting). **Speaker 5 is Amanda** (design hub). Labels in the body are left as the recording produced them.

Austin’s first block is a leftover campaign recap from GTM the same morning (Google live, 0 impressions, conversion tracking). Then the standup proper: VA, shopping ops, appetite, design hub, sales/investor.

---

## Commitments

**Austin**
- VA: waiting on Davy’s read of the top five from onlinejobs.ph — answer today
- Journey map / ops by **Thursday**: what VAs do vs what we RPA. May become an EZLynx RPA build
- Today: sit with Stockton Hill, record three carriers and their quoting preferences
- Investigate Meta form auto-scroll (from GTM)

**Davy**
- Deep-dive the onlinejobs.ph top five **today**; also running other VA searches
- VA work is data-entry transfer in carrier portals, not the Upline handoff
- Next shops: record Looms (narrate if possible) and save them — onboarding material, and a first VA task is “watch and write the SOP”
- LinkedIn welcome post, banner, $149 press release in motion
- Leander switching LinkedIn outreach from Ashley’s seat to Davy’s

**Ashley**
- Ideal: VAs only shop carriers; Upline (or Ashley, or RPA) does the initial AMS download. Handoff should be PDFs in, extraction in a back-office, minimum VA-in-Upline
- Keep recording shops; coordinate flyer/wire timing with Amanda (Thu/Fri possible)

**Amanda**
- Design hub email going out (link + feedback form). Updates Sundays. Product UI pages coming
- Investor deck this week with Justin; website with Claire; wires/flyers with Ashley
- Hub is public on Vercel, noindex, prototype stripped — Through Line holds business content

**JV**
- Investor group starting Sunday (teased Friday)
- Brandon at EZLynx Applied next week — “deleting your AMS”
- Follow-up today with Members First engineer: data warehouse + morning RPA for carrier updates, possibly bypass EZLynx for commissions/downloads. Full build diary coming

---

## Direction from the room (not tickets yet)

- VAs are good at **hammer and nails**: copy customer data into carrier sites. They will not natively solve Upline → carrier → Upline. That handoff is ours (guided portal, or email PDFs into a back-office).
- White-glove onboarding at first: producer codes, min limits vs cheapest, “never re-shop Auto-Owners” (Stockton Hill / contingency). Codify in Upline so VAs are not re-educated every appetite email.
- Appetite PDFs / carrier emails: pull in, stoplight guide (Risk Advisor pattern). Shopping authority stays with Upline. Bias: we give agencies insight, they don’t have to push every update at us.
- By January, 10 customers × ~4 carriers = ~40 portals. Loom training does not scale that far. Guided VA flow is the error-proof path.

---

## Transcript

Speaker 1: I'll probably share some screen recordings in the next call, so I think there is just some stuff we can tighten up on the website, like make the story a little bit clearer, make the call to action a little bit more prominent.
Speaker 2:  Yeah.
Speaker 1:  That hopefully will, like, turn into more demos. Um, because we're kind of missing the mark on that so far. Obviously super early, and like, we're just going to keep testing and iterating, but, um, that's where we're at on that.
Speaker 1:  Uh, Google launched yesterday, um, no impressions so far, and Google is going to be kind of more of an experiment just because, like, this product category is not something that people search for super commonly. So we're going to, like, try to pick off anyone that is searching for, like, insurance agency retention tool or, like, a search similar to that.
Speaker 1:  Um, and I've kind of got some, like, AI, uh, insurance keywords also. We'll see what happens.
Speaker 1:  Um, conversion tracking is mostly set up with all of that, so if someone, like, books a demo with Calendly, uh, or fills out the website form, that data is now flowing back into Google and Facebook. So assuming we do get some people who take those actions, uh, the algorithm should start to learn a little bit more quickly.
Speaker 1:  Um, what else? On the VA front, wanted to talk about that.
Speaker 1:  Um, Davy, I don't know if you had a chance to look at kind of those top five from onlinejobs.ph and, like, if.
Speaker 2:  Yeah.
Speaker 1:  Any of those are people who we'd want to talk to.
Speaker 2:  Yeah, um, I skimmed them. I have them queued up to do more of a deep dive. I will get you an answer today.
Speaker 2:  I've also been concurrently running some other searches through some of my contacts too to see if any of those surface. So that's my afternoon project, was to look back at the VA stuff.
Speaker 1:  Cool. Um, and then that kind of overlaps with what Ashley was talking about, where it's like, we're working on this journey map so that by Thursday I think we want to have a little bit more clarity on, like, all of the operational stuff that would integrate with the product. And so a big part of that is, like, I think we need to stack hands on what is it the VAs do versus what we going to try to RPA.
Speaker 1:  And then over the coming weeks, that might give me some tasks to maybe just, like, build out the EasyLinks RPA system if we think that we're going to go down that road versus doing to build out something so that VAs can go extract that information and, like, get it into a database. What's the structure of that?
Speaker 1:  Is there an LLM layer that's going to, like, take that data and put it into some structured format? So, uh, hoping that by Thursday we at least have more clarity on that direction.
Speaker 2:  Yeah. To add some context there, the easiest thing for the VAs to do, because a lot of them that we interview or some that I have connections with potentially that they're going to be used to or have infrastructure with are, um, quoting in the carrier websites, truly. Like, actually entering the customer data, copying it from a source, and entering it.
Speaker 2:  So the lion's share of what they'll be capable of doing and good at is data entry transfer. Um, so that helps kind of start to hone in what a VA will be doing.
Speaker 2:  It'll be like, "Hey, here's process. Go hit carriers.
Speaker 2:  Go."
Speaker 1:  Yeah.
Speaker 2:  "Go do the carriers. Come back."
Speaker 1:  Okay.
Ashley Roberts (You):  It'd be ideal world where, like, the VAs exclusively did that. I don't know if that's possible for November 6th without some kind of maybe it's not the VA. Maybe it's me doing the initial download of data.
Ashley Roberts (You):  Like, us kind of figuring out some of that stuff, or, like, us assigning it to an RPA tool or something like that. And I think there's also, like, ideal or dream world where it's like, if the VA did all that data transfer, how do we make it super hands-off so that we make sure that the upline, whatever, AI-driven experience gets what it needs with the absolute minimum amount of, like, VA, like, interfacing with upline, really?
Ashley Roberts (You):  Like, do they just email these PDFs to upline, and then we have a, like, back-office experience that then extracts everything?
Speaker 2:  The handoff, like, you're describing there, upline to carriers, carriers back to upline, that'll be the problem that they won't natively, you know, just institutionally be able to solve.
Ashley Roberts (You):  Yeah.
Speaker 2:  It's more like, "Hey, give me a give me a hammer and find me the nails. I'm good at that."
Ashley Roberts (You):  Yeah.
Speaker 2:  Um, you guys, I'm sure, have used, like, Looms and things like that before to record.
Ashley Roberts (You):  Yeah.
Speaker 2:  Do you have some of those quoting processes already recorded?
Ashley Roberts (You):  Some.
Speaker 2:  If, like.
Ashley Roberts (You):  Like.
Speaker 2:  The more the more that you do, when you do a quote, when you do shopping.
Ashley Roberts (You):  Yeah.
Speaker 2:  The more that you Loom and save in a folder, the more that I can go to a VA and go, "Hey, watch those videos. Learn everything you can about it. Tell me what you learned.
Speaker 2:  Tell me what you didn't like." Narration is great, right?
Speaker 2:  To be like, "All right. Hey, what's up, guys?
Speaker 2:  It's Austin."
Ashley Roberts (You):  Oh, that's good.
Speaker 2:  "I'm doing a shop." They learn experientially by using real examples the best. So, like, literally just narrate and do what you do.
Speaker 2:  Almost like you were teaching Claude, like, you know, you do your web browser show at a workflow. Same thing, but talk if you can.
Speaker 2:  Even if you don't talk, I we can like, I used to give VAs, um, videos with no audio. I'd be like, "Tell me describe for me what's happening here."
Ashley Roberts (You):  Oh.
Speaker 2:  And they're like, "All right. It looks like they're going into Travelers, and they're logging in, and they're doing ."
Speaker 2:  So, like, the more that you are whatever I would always say to people I place VAs, "Whatever you want them to do, do now on screen record Loom style, and just start saving and saving and saving." And another way to keep them busy when they're onboarding is, "Take this video and write up documentation on the process for me of what you saw and make an SOP for me." Like, that's a fair expectation for them to deliver back.
Speaker 2:  "Go watch the training videos. Write me a process as a result of that training video."
Ashley Roberts (You):  Okay. We don't really have that then. I thought you were talking in terms of just, like, having a recording of someone doing it, but, like, in terms of it, like, serving as, like, an onboarding style, no, we don't have any of that.
Ashley Roberts (You):  I mean, we can make one.
Speaker 2:  Yeah. Just the next time you do the regular work, just record it and talk if you can.
Ashley Roberts (You):  Well, and also, we also talked, like, is there a world where you're just then feeding it through an interface and then, like, the interface is telling you what to fill out? Like, I don't know. Like, where you're not having to, like.
Speaker 1:  See, that's where I'm at, where the scalability of this, for us to, you know, by January, let's say we have 10 customers, and each of those customers has 4 different like, that's 40 carriers.
Ashley Roberts (You):  Yeah.
Speaker 1:  Potentially that we need to be able to support. Um, like, I think we can do the video recording thing. And so actually, today, I'm sitting down with Stockton Hill, and they're going to walk me through, and I'll record this.
Speaker 1:  Uh, they'll walk through three carriers and, like, their preferences for quoting. But that's the other layer is, like, well, do they prefer that we, like, find the lowest price, or do they prefer that we.
Speaker 4:  Minimum limit.
Speaker 1:  Match the price and increase the coverage? Are there any, like, special things about, like, you always have to use this producer code when you, uh, quote in this state? Or, like, whatever it is, that's something that maybe is, like, a hands-on, like, white-glove onboarding to start.
Speaker 1:  But, like, we've got to get that codified in the upline system somehow, and probably sooner rather than later have some platform where the VAs can go in, and it'll just walk them through, like, "Okay. We're quoting with Smith Insurance Agency.
Speaker 1:  We're going to go through the nationwide portal. Here's every single thing that you should do because our AI knows that."
Speaker 1:  And I feel like that would be more error-proof than, like, training up a VA from Looms.
Speaker 2:  Great. That, that works too, yeah. And infusing any of those thing those models.
Speaker 2:  Um, also too, Justin can, can share this too. One of the things agencies deal with on a regular basis is updated appetite from carriers.
Speaker 2:  You know, they'll get an email that basically says, "Our appetite is changing," and that most of the time doesn't really affect the trajectory of the quoting behavior, but sometimes it can.
Ashley Roberts (You):  Mm-hmm.
Speaker 2:  And so those emails, those PDFs that come in, you know, that's just going to affect behavior. So to be able to pull those in and integrate those, "Hey, we just got an email from Progressive that said this, this, this, and this. How do we account for that in upline?
Speaker 2:  How does that update the, the flow and whatever?" That's something to take into account as well.
Ashley Roberts (You):  That'd be so great if we just, like, never had to then re-educate a VA on all that. It's just, like, now the system does that. Like, they don't even really have to know any updates have ever happened.
Speaker 2:  Yeah.
Ashley Roberts (You):  It's just anytime you go shop, it's just that's now the data you put in.
Speaker 1:  It has all of these applications. Also, like, not just for what the VA does, but how we communicate with the client too. So with Stockton Hill, what we've learned is they don't want to ever re-shop someone on auto-owners.
Speaker 1:  They have incentives to, like, keep people with auto-owners. Um, that's, Davy, to your point, something that could change next quarter.
Speaker 2:  Yeah.
Speaker 1:  And, you know, Doug, as you're thinking about, like, what does onboarding look like and kind of, like, registering new users, that flow, there's that piece of it, but it's also, like, for the ongoing management, how much of it is, like, upline team codifies those preferences through our onboarding, or is there, like, a form that they fill out ahead of time? Do they have.
Speaker 2:  Well.
Speaker 1:  An admin portal they can go in and change, like.
Speaker 2:  Yep.
Speaker 1:  "Here's who we're quoting this quarter." I don't know.
Speaker 2:  Rank, rank one to four. There was a, a, a one of the other tools I helped consult with called Risk Advisor. It was such an underutilized part of his SaaS platform, but he had, at the end of the intake process so a customer would do all their intake in, in our scenario, I'd be like, "Fill out questionnaire, blah, blah, blah."
Speaker 2:  He'd have the PDFs of the appetite updates pulled automatically into this appetite guide.
Ashley Roberts (You):  Mm-hmm.
Speaker 2:  And it would be a stoplight, green, yellow, red. This'll fit. This won't fit.
Speaker 2:  This is a great fit. And that was just, uh, kind of a flag to whoever was touching it, like, "Hey, don't even waste your time going into the portals and quoting those red ones.
Speaker 2:  The yellow ones may be the green ones push." Um, I'll tell you the, you know, the agents are, are, are doing all kinds of random things with appetites.
Speaker 2:  They're taking those emails from the carriers, forwarding to the team, and going, "Hey, this is our update. Anywhere where we can have those PDFs pulled in and automatically update an appetite guide would be.
Speaker 2:  So again, these individual CSRs and agents don't have to think about it, and upline is rendering what the app the new up-updated appetite is. But what the agency has to do is put in the surrounding workflow with appetite updates, right?
Speaker 2:  Like, someone has to push, or we push, those polls into the system, or someone has to make that call. It's almost, like, kind of like a review necessary process.
Speaker 2:  "Hey, we got an email from Travelers. Now is the business owner agency on it.
Speaker 2:  What should we do with that?"
Speaker 1:  Yeah.
Speaker 4:  Yeah. Personally, outside of, like, like, Brandon's reason to keep auto-owners is contingency, right? Like, that bonus that we talked about.
Speaker 4:  So he's got a good loss ratio with them through two and a half quarters here. Um, so that's why he wants to, to keep those locked in.
Speaker 4:  So I would say, though, if we could get to a place quickly where we're decide like, we're educating them versus, like, "Oh, you got an email that, that Travelers has taken a 1.2% rate decrease." Like, I think if we have more to offer saying, "Hey, this is what we're seeing," like, you can make adjustments on your ranking, but, like, I would rather us give them insights versus them giving us insight.
Speaker 2:  That, that was also one of the things that I think I surfaced to you, Austin, in the agreement is we want to preserve our. We want to have the shopping authority vested in us.
Ashley Roberts (You):  Yeah.
Speaker 2:  So.
Ashley Roberts (You):  And the ramp I mean, if we also wanted to keep in just kind of that ramp style, like, you can forward updates, you can email to upline, whatever.
Speaker 2:  Yeah.
Ashley Roberts (You):  I mean, I was able to build something like that for my own personal account, so I know Doug and Austin can make a way better version of that probably pretty quickly. So it'd be.
Speaker 2:  Yeah.
Ashley Roberts (You):  I think easy option as well.
Speaker 2:  Yeah, we could.
Ashley Roberts (You):  Yeah, to do, so.
Speaker 2:  Yeah. It would be easy.
Ashley Roberts (You):  Okay. Cool. Amanda?
Speaker 5:  Um, I spent some considerable time last week updating the upline design hub. I think I've mentioned that a couple times. It's just a resource to point your LLM to.
Speaker 5:  Um, it does sorry, excuse me. So it does add upline design logos, colors, fonts to just about everything pretty well if you're creating that, um, with Claude or ChatGPT or any other LLM, hopefully.
Speaker 5:  Um, it does slide decks and web pages incredibly well. Um, I did just test that on the upline investor deck, the last version that I had access to, um, and it worked pretty good.
Speaker 5:  It doesn't do custom things. It doesn't do, like, custom charts.
Speaker 5:  It doesn't do custom illustrations or anything like that, but it does get a pretty good layout set up. Um, I've got pages for social assets, ads, um, emails, and product UI will be coming soon.
Speaker 5:  So I've got an email drafted up that details out all of that stuff, sends you the link to the design hub. And then on that design hub, I have a form that goes to my email just for feedback.
Speaker 5:  Um, I just wanted to push that. Since this is the first time we've ever done anything like this, um, you guys will help shape, um, what the site ends up having on it, and then hopefully that ends up making it super useful for this team.
Speaker 5:  But the goal is that, uh, I don't ever do a slide deck again, so.
Speaker 4:  Love it. Love it.
Speaker 5:  Um, but yeah, so I've been working on that just in anticipation of this week being pretty heavy for me on, um, design requests. I'll be working with Ashley. I'll be working with Claire on the website, and then Justin, I'll be working with you here and here and there on the investor deck.
Speaker 5:  Um, I think that's all that I have on my plate for now, but if there's anything else, let me know. Um, and then everything I do this week, I'll be feeding back into the design hub.
Speaker 5:  I'll update it on Sunday evenings so that you'll have, uh, hopefully, new and better access to that hub every week.
Speaker 1:  That's awesome. Thank you.
Ashley Roberts (You):  And then is this the week for the, the sorry, you might have already said this, the investor deck for Justin your thing?
Speaker 2:  Yep.
Ashley Roberts (You):  Okay. Cool.
Speaker 5:  And then I took a pass, um, and scrubbed any private information, any, like, upline-specific business type of, um, information from that website so that I could keep it public, um, public. It's on a Vercel domain, so it's not going to be the first thing that people see. And then I added a what do you call that, Austin, the SEO, um, noindex?
Speaker 1:  A robots.txt.
Speaker 5:  Sure. I added that or intended to do that, um, so that it doesn't come up when you when you Google search. But yeah, I so I pulled that used to have the design hub used to have the product prototype for demos, um, but that will be on the through line instead.
Speaker 5:  So we'll kind of let the through line be what has any sort of business decisions or actual content, and the design hub is more just re-skinning that information.
Speaker 1:  Cool. Doug, let's see that dog.
Speaker 5:  Oh, hello.
Speaker 5:  Doesn't even know what a computer is. Oh my goodness.
Speaker 5:  She's tiny.
Speaker 1:  Here we go.
Speaker 4:  The ears weigh more than the whole, uh, dog there.
Speaker 1:  This little girl's Daisy. She's two years old.
Speaker 5:  Nice.
Speaker 1:  And she's a little Spitfire.
Speaker 5:  Didn't know you had a baby at home.
Speaker 5:  So cute.
Ashley Roberts (You):  Okay. Davey or Justin, y'all want to jump in? I don't know if y'all want to give updates on your end or anything there.
Speaker 2:  Yeah. I, I'm just navigating Leander's really awesome tech stack and my warm list. Um, just grinding, honestly, on, uh, an update to the slide deck, uh, to put in some sales psychology and some, some of my spin on it.
Speaker 2:  Uh, right now, I'm actually writing my I'm welcome, I am, uh, joining upline LinkedIn post. I've got a banner created for my LinkedIn, um, and just kind of, uh, not only in my, my LinkedIn, but my other socials and stuff like that, kind of, "Hey, welcome to upline.
Speaker 2:  Book a demo. Let's start having the conversations."
Speaker 2:  I bought the, um, $149 press release via the press release service. I'm getting that written.
Speaker 2:  Put the, uh, Facebook and LinkedIn page in there. It's got language that fits for me and, and everybody else.
Speaker 2:  Um, it's like where to start, but it's all good problems right now.
Ashley Roberts (You):  Cool. I need to ask Leander in the next meeting about, um, like, right now, I think, like, he was doing outreach through my LinkedIn and, like, scheduling demos and all that kind of stuff, and I don't know.
Speaker 2:  Yeah. He switched he's going to yeah. He's going to switch that LinkedIn to mine.
Ashley Roberts (You):  Okay. Cool.
Speaker 2:  JVs.
Ashley Roberts (You):  Okay.
Speaker 2:  And, and he was going to move, move your seats off since.
Ashley Roberts (You):  Cool.
Speaker 2:  We've got all the insurance and connections.
Ashley Roberts (You):  Cool.
Speaker 4:  Yeah. Uh, similar update to yesterday's call. Um, just kind of grinding away on, uh, contacts.
Speaker 4:  So I've got that investor meeting starting on Sunday or that investor group. Um, kind of teased them up a little bit.
Speaker 4:  We had a call on, uh, Friday with that with that group on a different networking call or networking group that we're a part of. So excited about that.
Speaker 4:  Um, Brandon is also going to the Easy Links Applied conference, same, same time next week. And so his plan is to, you know, talk about deleting your AMS.
Speaker 4:  Um, so I, I think I told you guys, like, we, we have an engineer at Numbers First, well, technically, like, over all the three companies. And yesterday, I was in a meeting with them, and, like, they think they have a way to not use, uh, Easy Links, like, right now, maybe.
Ashley Roberts (You):  Really?
Speaker 4:  So yeah. So I have a follow-up call with them today. I've been kind of hands-off on that project just because I don't need to be.
Speaker 4:  But I heard some like, they, they have done a lot of work in the last, like, three weeks. So I'm going to try to I'm I sit in another meeting this afternoon and try to extract some of that information, but they think that they've figured out a way to, to get rid of Easy Links now.
Speaker 4:  So and that's not considering any of the any of the retention work, just, like, solving for commissions and downloads. They think they have.
Ashley Roberts (You):  Okay.
Speaker 4:  They think they have a, a solution, so.
Ashley Roberts (You):  So all of that onboarding stuff, we could bypass Easy Links from the get-go?
Speaker 4:  Maybe. Maybe.
Ashley Roberts (You):  Okay.
Speaker 4:  But I know she.
Ashley Roberts (You):  Ooh.
Speaker 4:  She's worked, like, three weeks on this on this data warehouse. So basically, what she's done is taken, like, data from, like, six different places, put it into a data warehouse, and then that's, like, feeding in and out and via HubSpot.
Ashley Roberts (You):  Okay.
Speaker 4:  Um, and then she thinks she can do RPA, like, in the morning each day for each carrier, bring it in you know, bring in any updates to the policies, and then just update the actual file itself that then pushes out to any CRM. Um, I don't know. I, I was it was the it was the most that I had heard any progress being done on this, uh, out of any of the groups that I'm in or any of the you know.
Speaker 4:  Yeah. So.
Ashley Roberts (You):  Yeah. That'd be awesome. Yeah.
Ashley Roberts (You):  Let's.
Speaker 4:  Yeah. Yeah.
Ashley Roberts (You):  Because that would be yeah. That'd be great.
Speaker 4:  And she's keeping track. She's doing, like, a full build diary of what she's touching and why and stuff. So I'll provide that.
Ashley Roberts (You):  Okay. Great.
Speaker 4:  Yeah. All right. Cool.
Speaker 4:  So I just have to kick off this other meeting, and then, uh and then I'll jump on this one.
Ashley Roberts (You):  Okay.
Speaker 4:  All right. Cool. Thanks.
Ashley Roberts (You):  You too.
Speaker 1:  Thanks, everybody.
Ashley Roberts (You):  Bye.
Speaker 1:  Happy Tuesday.
