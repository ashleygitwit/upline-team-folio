# Product standup — Thu Sep 17, 2026

**Session:** First twice-weekly product standup
**Attendees:** Ashley (PM), Doug (eng), Amanda (design), Davy (sales)
**Absent:** JV
**Transcript file:** this file

**Speaker mapping:** The recording named Ashley and Davie Holt. Unnamed labels from context: **Speaker 3 is Doug** (Linear, auth, email outage, Claude). **Speaker 4 is Amanda** (design hub). **Speaker 5 is Davy** (agent / CRM feedback). Labels in the body are left as the recording produced them.

---

## Commitments

**Ashley**
- Wrap OKRs this morning for the noon review
- Share the Stockton Hill Notion board in the Upline channel (check Austin on PII first)
- Stockton Hill kickoff tomorrow (Fri Sep 18)
- Get into Linear today — start tickets, maybe the Kanban
- End-to-end demo wireframe; hand to Amanda next week
- After wireframes, turn the outreach process into a workflow for the third pilot

**Doug**
- Resolve the email outage with Leander this morning (Squarespace / old registrar)
- Send Linear Claude prompt + protocols to Ashley and Amanda
- Finish testing auth (login, signup, forgot password, invite owner, downline/upline)
- Kanban board is next after auth
- Think through customer-import UX (admin tool, Chrome plugin, or VA checklist)

**Amanda**
- Design hub hard cutoff Monday — send to the full team

## Done since last time (first session, so this week)

- Ashley: Stockton Hill set up; first five clients in Notion; learnings folders; OKR first draft; Through Line update in progress
- Amanda: Design hub homepage + feedback form live
- Doug: Linear MVP project and board ready; auth surfaces built, in testing

## Blockers

- Email outage during the Squarespace transition. Only Leander has the old registrar. Mail sent during the outage is likely unrecoverable and would have to be resent. Doug + Leander on it this morning.

## Carry-forward

- Insured outreach: no Upline branding — should look like the agent hit Compose. Designed HTML is for Upline-to-agent, not insured-facing.
- Stockton Hill A/B: every five people → two boilerplate, two logic, one no-increase / decrease.
- AMS reports are not standard across agencies. Stockton Hill did not have Members First’s renewal report; onboarding has to hunt.
- Stockton Hill runs its own renewal campaigns — outreach copy has to dodge that.
- Linear: deployed ≠ released (feature flags).
- Skills = one-shot; workflows = sequenced skills that depend on each other.
- Agency-specific outreach logic belongs in an open spec.
- Post-MVP: “raider-style” round-one email with numbers already in hand; Agency Zoom / CRM sync; talking points for “do you integrate?”

---

## Transcript

Ashley Roberts (You): Hello.
Ashley Roberts (You):  Oh, wait. Oh, hello.
Davie Holt:  Hi, Ashley. What does your hat say, Ashley?
Ashley Roberts (You):  Oh, it says Wimberly, Texas. That's where I live, the town.
Davie Holt:  I love it.
Ashley Roberts (You):  Yeah.
Davie Holt:  I am driving, so unless you guys want to see the road between Kansas City and Tulsa, it's unnecessary.
Ashley Roberts (You):  Yeah. So how do.
Speaker 3:  I'm down.
Ashley Roberts (You):  Wait, the event was Tuesday and Wednesday, right?
Davie Holt:  Well, the networking event where I knew some people that could give us a little grease to the wheel was last night.
Ashley Roberts (You):  Last night.
Davie Holt:  Leander's there sitting through some of the classes, and Robin Elmo's there.
Ashley Roberts (You):  Nice.
Davie Holt:  And trying to make a connection with Bob Sullivan, who's a guy who's been surfaced to us, will be a good long-term connection down there. So yeah.
Ashley Roberts (You):  Cool. That's exciting.
Davie Holt:  Yep.
Speaker 3:  Very nice.
Davie Holt:  Yep. Got to practice the pitch a few times in the networking space, have some feedback for us, so all good stuff.
Ashley Roberts (You):  Oh, good. Good. That's awesome.
Speaker 3:  Yeah. That is really awesome. I'm going to meet up with Leander after this call, and we're going to take a look at the email outage issue.
Davie Holt:  Yep.
Speaker 3:  I'm pretty sure it's related to the transition to Squarespace. I think it's on the side of the old domain registrar, so only Leander has access to that. And I'm not sure if he really knows what he's looking for, but I sent him a whole bunch of notes to take a peek, and I'll hop on a call with him right after, so hopefully we can get that resolved this morning.
Speaker 3:  The bad news is that any emails that got sent during this time would have to be resent because there would be most likely no way to recover those. So that's going to suck, but it is what it is.
Ashley Roberts (You):  Gotcha.
Davie Holt:  That's okay because I've still been working with Claire on the press release. And so even though we were at the event, we've handed out business cards, they're all still going today, and there just hasn't been a huge I mean, there's some people, obviously, that we've introduced and whatever that know, but there hasn't been a big push. I don't think we've had a lot of loss in sent or received right now.
Ashley Roberts (You):  Okay.
Davie Holt:  We're okay. #StartupLife. We're good.
Ashley Roberts (You):  Yeah, yeah.
Speaker 3:  Mm-hmm.
Ashley Roberts (You):  Okay. Cool. Well, let me talk to Amanda real fast and see.
Ashley Roberts (You):  But we can, I think, just jump in. Let me see.
Speaker 3:  Yeah. You jump in.
Ashley Roberts (You):  Okay. So my thought is pretty informal for our first one, but this is exciting. First stand-up with product team.
Ashley Roberts (You):  So I thought we would just go around and kind of have your more "traditional" type stand-up. We just talked about what we did yesterday, what the plan is today, and then any blockers.
Ashley Roberts (You):  We can talk through that if we need to. Good news is we met Doug, Amanda and I met on Tuesday and kind of talked through that.
Ashley Roberts (You):  It was almost kind of in a way that was kind of a stand-up, to be honest. So yeah, just yesterday, today, and then blockers moving forward.
Ashley Roberts (You):  So I can go ahead and start. I yesterday finished setting up Stockton Hill.
Ashley Roberts (You):  So just a little thing. This is kind of for the product's sake also and even I don't think it necessarily affects sales right now, but in Stockton Hill, they have the exact same EZLink, but the way that they set everything up is actually a little different, or at least the reports that I have access to are a little bit different.
Ashley Roberts (You):  So I don't know yet if that's a permissions thing, and they just haven't given me access to a retention report, or if Members First had custom-generated, which I think Javier had mentioned he maybe did have some custom retention-specific reports, making it super easy not retention, renewal reports, making it super easy for me to see who has renewals coming up. I was able to figure it out, not a huge deal, but that's just something to know is the onboarding process isn't like, "Oh, there's always a
Ashley Roberts (You):  reports page, and there's always this report you can download." I had to kind of download a few different reports to make sure that I got the cross-section that I needed to pull the right customer data. Again, not the end of the world, but just something good to know moving forward, specifically in onboarding stuff.
Ashley Roberts (You):  So I got Stockton Hill all set up. I have the first five in the Notion.
Ashley Roberts (You):  I'll share that out with you all, actually, probably just in the upline channel. Well, I don't know.
Ashley Roberts (You):  Is there anything weird about sharing that in the channel when it's personal information of people, like the Notion? That's fine, right?
Davie Holt:  Yeah. I don't know.
Speaker 3:  It's high data.
Ashley Roberts (You):  I mean, we've signed paperwork, so I think it's okay. I'll check with Austin because he.
Speaker 3:  Actually, I think it probably is fine because it's not being leased to a third party.
Ashley Roberts (You):  Yeah.
Speaker 3:  It's not being sold.
Ashley Roberts (You):  Yeah. And the contract was signed with us. I think it's signed to our team.
Ashley Roberts (You):  Yeah, yeah, yeah. Okay.
Ashley Roberts (You):  So I'll share the Notion board in there so that y'all can track in real-time what that's looking like. But I have the first five, and then I also have learnings folders and everything set up, and that then dovetails into the next thing I did.
Ashley Roberts (You):  I am in the middle of updating the Throughline website with all the decisions from last week, and then that way I can continue to update stuff. So that is moving forward where we're going to find our Gantt chart timelines, our 90-day goals, our OKRs, all of that stuff, which then takes me to the third thing.
Ashley Roberts (You):  I did my first draft of OKRs. I'm going to wrap that up a little bit this morning because that is the number one thing we're going to review at 12 o'clock today.
Ashley Roberts (You):  So those are the main things I did. Like I said, OKRs is where I'm spending a little bit more time, making sure Austin doesn't need anything to we're kicking off tomorrow, the Stockton Hill one.
Ashley Roberts (You):  And then after that, I'm moving into wireframing. So that's really exciting.
Ashley Roberts (You):  My wireframe is going to be a full end-to-end demo based on all the decisions from last week with the goal to hand that off to Amanda next week. So that's what I have.
Ashley Roberts (You):  I don't have any blockers right now. I feel pretty good.
Ashley Roberts (You):  Pace has been pretty good. There haven't been any crazy things that came out of nowhere.
Ashley Roberts (You):  So yeah, that's it for me. Am I missing anything?
Speaker 3:  Awesome.
Ashley Roberts (You):  I think those are the main things. Oh, sorry. One actually caveat.
Ashley Roberts (You):  In lieu of or because I've focused more on specific things like knockdown from last week's conversations, things are less buttoned up in a PM standpoint, but that is on my radar. So that's why I'm updating the website and things like that, the internal website, so that we have a place to reference moving forward.
Ashley Roberts (You):  But just know it may feel a little bit out of source right now. I just prioritize Stockton Hill and OKRs and stuff first.
Ashley Roberts (You):  Okay. Now I'm done.
Speaker 3:  No, that's great. Thanks for the update. Hey, Amanda.
Speaker 3:  Thanks for joining us.
Speaker 3:  You're not muted, but we can't hear you. Oh, wait.
Speaker 3:  No, you are muted.
Ashley Roberts (You):  There's a little slide toggle. I'm not.
Speaker 4:  There we go.
Ashley Roberts (You):  Yeah. I'm not used to Google Meet, so I had to refresh myself when I joined.
Speaker 4:  Yeah. ISS, sorry about that.
Speaker 4:  I checked my Gmail, and for some reason, this invite wasn't in there. Usually, it's that I just didn't see it because it was from an external email address or something like that for the first email setup.
Speaker 4:  But this time, it just isn't there, so I'm going to look.
Speaker 3:  It's probably related to the email outage. I think I sent the invite during the outage, so I'm actually shocked that some of you guys are even here right now.
Speaker 3:  But yeah, I was just saying that email issue is probably going to be resolved this morning, hopefully.
Speaker 4:  Cool.
Speaker 3:  And then if you have any updates, you can go ahead.
Speaker 4:  Yeah. So this week, it's taken me a shockingly long time to update that design hub, which I guess shouldn't be shocking because it was created by an LLM, so it's just massive. So I'm trying to whittle that down.
Speaker 4:  My hard cutoff is Monday. Monday, I'm going to send it out to the full team, everybody kind of working on it.
Speaker 4:  As of now, the homepage has been updated. There's a feedback form that's on there where you can email me directly from the site, and I can hopefully my goal is to everything that everybody does.
Speaker 4:  I am not trying to govern it. I'm not trying to be like, "Here's the wrong fonts," that kind of stuff.
Speaker 4:  But if you put together a design using that design hub, it would be fantastic if you could just send it back to me so that I can get into nitty-gritty design updates and send it back to Claude. So that hopefully, as we work on stuff, it'll just keep getting better.
Speaker 4:  So it's not my goal to make nitty-gritty design updates and send that back to you guys. I don't think it's important at this point with a zero to one.
Speaker 4:  But I am definitely interested in seeing what we can do with a site like this with a continually updated repository. So working on that.
Speaker 4:  Going to have a hard cutoff on Monday, but otherwise, just kind of plugging away, getting prepared. So I think next week's going to be pretty busy.
Speaker 3:  Yeah. I agree. Thanks for the update.
Speaker 3:  You just set me up for a good segue into Linear. So Linear is fully ready to go.
Ashley Roberts (You):  Yay.
Speaker 3:  I'm not sure if you guys got the invites because of the email outage, but did those come through?
Ashley Roberts (You):  Yeah. I did, and I jumped in there. Yeah.
Ashley Roberts (You):  I didn't edit anything, though, yet.
Speaker 3:  So there's not a whole lot going on in Linear yet. Have you guys used it on any previous projects, or would this be the first?
Ashley Roberts (You):  No. Yeah, we've used it.
Speaker 3:  Oh, you guys always used it?
Ashley Roberts (You):  Yeah. For a few years now. Yeah.
Speaker 3:  Oh, okay. Got it.
Speaker 4:  It's very different. I still am interested in I am very interested in how you prefer operating in it because everybody is very different depending on what your role is or what your preference is. So I'm just curious of how you're setting things up.
Speaker 3:  Yeah. I've been experimenting with it for the past couple of months, and then this project would be the first one that I've actually used it properly. So I'm still kind of experimenting with it, but I'll give you guys the grand tour.
Speaker 3:  There's not much in it yet. All I did was create an MVP project.
Ashley Roberts (You):  Cool.
Speaker 3:  The MVP will be what we're all trying to deliver right now. I've got a board going. I've got all the columns visible.
Speaker 3:  So the to-do is kind of like the backlog, and then in progress, blocked, PR review, QA, and then ready for deployment, deployed, ready for release, done, and released. And then you got your canceled columns.
Speaker 3:  So those are all pretty self-explanatory, but there is one difference between deployed and released. What the cool thing to do is right now is to decouple deployments from releases.
Speaker 3:  So that's why there's a release column, which is done, and a deployed column, which is actually a not done status. And the reason for the decoupling is we typically use feature flags nowadays, and code can be deployed but not released, which basically means that the code has been deployed, but the feature flag is turned off.
Speaker 3:  And usually, you'll do that when something is still in testing, right? If you're still trying to validate whether or not it's a good feature, we'll deploy it up but not actually release it to the customer, and it'll really just be visible to a test account or internals.
Speaker 3:  And so that would be an example of an item that would sit in this column. And then after QA and product are like, "Yeah, this is ready for prime time," then we turn that feature flag on, and then it'll be available to all customers, and then finally, it can move into the released column.
Speaker 3:  So that's one little caveat to be aware of as we get going. And then the main way that I use Linear currently is I'll start off in Claude, and I'll tell Claude to I'll be like, "Hey, Claude, I'm working on blah, blah, blah, blah, blah."
Speaker 3:  And then I'll say, "Help me plan this out in Linear." And then it will go ahead and write the ticket for me.
Speaker 3:  And I've already trained it to give it an effort, put it under the MVP project or sorry, that's priority, and then it's a large, and then it tags it as a feature. And then it went ahead.
Speaker 3:  What's that?
Speaker 4:  I interrupt you really quick just to flag. Can you send us both what prompt you use and what you've trained it to do so that we can just feed that back into our LLMs?
Speaker 3:  Yeah. Yeah. I'll post some protocols that you guys can use.
Speaker 4:  I was flagging in my brain that I was like, "Ooh, I need to remember this so that I do the same thing." And I was like, "Can you just send that to us?"
Speaker 3:  Yeah. Absolutely.
Speaker 4:  Thank you.
Speaker 3:  Yep. So all the magic happens in the Claude connector, which now I'm forgetting how to get to that. Settings, settings, and then it's one of these guys.
Ashley Roberts (You):  Yeah. I'm going to have to get in. I've never done a I've never done Claude to Linear stuff, but I'm really excited to do this.
Ashley Roberts (You):  This is the part I'm super pumped about.
Speaker 4:  Make Linear actually work. Yeah.
Speaker 3:  Wait a minute. It's not in there. So if it's not in there, maybe it's in it's under plugins or something.
Speaker 4:  Yeah. You're all good. We'll sort through that on our side.
Speaker 4:  We've got to do that with other stuff. It's always hidden.
Ashley Roberts (You):  Yeah. The Notion.
Speaker 4:  Everything is.
Speaker 3:  Oh, actually, I think you have to start off in Claude, not Linear. You go to Claude, and then you go to connectors or plugins there, and then Linear is in the list.
Ashley Roberts (You):  Cool.
Speaker 4:  Makes sense.
Speaker 3:  So yeah, these two tickets right here are marked urgent because they're related to the email outage. And then this one is laying the foundations for security and compliance.
Ashley Roberts (You):  Perfect.
Speaker 3:  This is pretty much done. I'm just testing it. But basically, I've got the workings of auth figured out.
Speaker 3:  So login, sign up, forgot password, inviting an agency owner, and then all the tools that the agency owner needs to start inviting their agents and structuring the downline and the upline. So all the pieces are there for that.
Ashley Roberts (You):  Cool.
Speaker 3:  And that'll be the first major thing that I've shipped. And from there, then I'll be able to start getting started on the Kanban board. I think that'll be the next thing up to bat.
Ashley Roberts (You):  Okay. So I need to really get on there today or worst case, Monday. Really today.
Ashley Roberts (You):  So I may shortchange some of the OKR stuff, and we'll do a lot more in the working 12 so I can get a head start on maybe the common board. I don't know.
Ashley Roberts (You):  Yeah. I'm going to try to get that started, at least started today.
Speaker 3:  Yeah. That'd be great. But there is a lot in the design hub already that I can reference.
Ashley Roberts (You):  Oh, good.
Speaker 3:  So nothing too urgent.
Ashley Roberts (You):  Okay. All right. Good.
Speaker 3:  Yeah. So you should be good there. And then one thing that was on my mind, though, was what do you think the experience would look like for importing all of an agency's customers?
Speaker 3:  That's something that I haven't thought through yet. That might be a good experience to visualize.
Ashley Roberts (You):  Yeah. I'll have to put some thought it depends on how much we're manually turking it because I could tell you what I do now. It's not great.
Ashley Roberts (You):  But now I just go in and I pull in my mind, you would go and you'd pull the directory of every single client. But then that's when you're going in that's what I was talking about.
Ashley Roberts (You):  With Members First, I could go in and pull a retention or renewal not retention. You can say retention, but a renewal report, which will then give me the next 30 to 45 days out.
Ashley Roberts (You):  And then that is then what's prioritized for the next month. And then you have to go in and pull specific data from the system.
Ashley Roberts (You):  So in my mind's eye, for November 6, as not great as it is, you'd have a VA go do that, but you'd have this is where I don't know. But Austin and I have talked about what if we had a cursor or Claude, probably a Claude workflow that a VA could be like, "I'm logging in."
Ashley Roberts (You):  It's like, "Great. Do this first.
Ashley Roberts (You):  Pull the directory." And then it talks from Claude.
Ashley Roberts (You):  And then what it does is I don't know if this is the right way to think about it, but it creates placeholders for every single customer that's onboarding. And then it's like, "Okay, great.
Ashley Roberts (You):  Now go pull this report." And it pulls in a screenshot.
Ashley Roberts (You):  So it's almost like a workflow for your VA, but they're using Claude to do that. They pull in the PDFs or the downloads.
Ashley Roberts (You):  And then Claude is doing all the like, "Okay, great. Here's your 30 people for week one, week two, week three, week four."
Ashley Roberts (You):  And then it's like, "Okay, now you got to go take exact screenshots or downloads of these 10 or these 15 or whatever it is." So I think there's a manual in-between step, which sucks.
Ashley Roberts (You):  Ideally, we don't do that. But if we created almost even just a Claude interface for that, maybe that's the interim step for November 6.
Ashley Roberts (You):  But I'm very open. If we design a full true user experience, we can.
Ashley Roberts (You):  I just assumed we wouldn't have a that. So I think we can talk about that.
Speaker 3:  Yeah. Yeah. We can definitely do that.
Speaker 3:  Thanks for sharing your thoughts. That actually helped me a lot because have you guys seen how Claude, the desktop app, and even ChatGPT will do this, but they can actually open up a browser on the side, and it'll manipulate the browser?
Ashley Roberts (You):  Yeah.
Speaker 3:  We can actually create that too.
Ashley Roberts (You):  Oh, that'd be awesome.
Speaker 3:  And that was where we started getting more into the AOS type thing, the agency operating system.
Ashley Roberts (You):  Yes.
Speaker 3:  Because I can create a desktop app, and it might even work within the web app. I'm not really sure. But yeah, we could create a tool in the upline admin that basically says, "Okay, you're ready to start importing customers.
Speaker 3:  Click this button." And then boom, it opens up a side panel that has the AMS, and it'll have on the left side ways to trigger automation.
Speaker 3:  And then it'll just click around and do automated stuff. And then if that's not an option, then Austin was saying that a Chrome plugin might be cool, which I could easily whip that up too.
Speaker 3:  And then that Chrome plugin could get data populated for the VA, and then the VA will just have a checklist for each, I don't know, agency or client that they have to pull data for.
Ashley Roberts (You):  Yeah. Yeah. Linear is incredible.
Ashley Roberts (You):  Yeah. Kind of just bridging the gap for the VA a little bit.
Ashley Roberts (You):  And if you want to out the gate be this is my ignorance here, but I think maybe a Chrome plugin could do this also, but basically watching every single interaction a VA has with shopping because the hope is that's all the data that we're pulling in to at some point automate. But the sooner we get that set up out the gate, then we're able to learn from that from the get-go.
Speaker 3:  Yeah. Yeah. We can record the sessions.
Speaker 3:  We can record the screen and whatnot and their mouse movements. So that should be pretty easy, hopefully.
Ashley Roberts (You):  So yeah. So that's me just off the cuff. I haven't put any actual true user experience thought into that piece.
Ashley Roberts (You):  I kind of bundled all of that under upline admin type of work. Is that onboarding?
Ashley Roberts (You):  How are we getting all of the initial clients? But right now, it's not the same kind of slog as shopping, but it's a little bit of a slog.
Ashley Roberts (You):  That's what I've been doing the last two days. And then working with Cursor to make sure, is this the right person?
Ashley Roberts (You):  Oh, we found one-off piece of data. We can't use them anymore.
Ashley Roberts (You):  And even things like I'm finding that member or not Members First, but Stockton Hill sends these automated emails right before renewal comes up. And so there's a certain window, which means you have to change the way that the emails are worded because they run very structured campaigns with their clients, even if it's happy birthday style stuff, usually.
Ashley Roberts (You):  But they run campaigns that we then have to be like, "I don't want my email coming in." They're going to have a, "Your renewal's coming up," generic one.
Ashley Roberts (You):  I don't want ours to come in being like, "Your renewal's coming up." So I'm having to modify those and say, "If this, then this."
Ashley Roberts (You):  So there's these little pieces of logic. That's what I've been doing the last few days.
Ashley Roberts (You):  Nothing crazy on its own. It's just adapting because it's different enough from Members First, but just in the really small ways, so.
Speaker 3:  Yeah. That's really good information for us to have. And all that logic would eventually go into an open spec.
Speaker 3:  So that way, it is memorialized in the codebase, and then all the actual implementation code would get generated off that.
Ashley Roberts (You):  Exactly.
Speaker 3:  So yeah, keep doing that. I like it.
Ashley Roberts (You):  I'm trying to keep logs of all of this stuff. And literally, every activity is I'm just doing it inside Cursor. Even if I know the answers, I'm still dropping it in Cursor.
Ashley Roberts (You):  So Cursor keeps the same memory. And then Austin and I, just so y'all know, we're running A/B testing on the emails.
Ashley Roberts (You):  So with Members First, we'd started with super custom-tailored. We talked about in the strategy sprint week of like, "Oh, if you have an increase by X percent, X percent, we're strongly recommending you shop.
Ashley Roberts (You):  If it's an increase, but less than 10%, we're saying, 'I'm happy to shop for you, but it's up to you.'" Even the slight wording changes in the emails, that was what we were going to start with.
Ashley Roberts (You):  But Members First went with more of a boilerplate. Every single person gets the same email, but we still got good numbers there.
Ashley Roberts (You):  So Austin and I decided we're going to run a 50/50 split. So for every five people now, two get the boilerplate, two get the logic, and then one of the five is always going to be someone who had no price increase or even a price decrease because I want to see if those people still want to be shopped.
Ashley Roberts (You):  I'm sure they won't, but I don't know. So there's kind of a rogue one person that's like, "Even if you have a good rate and you're given the option, do you do anything with it?"
Ashley Roberts (You):  So that's how we're splitting. Every five are getting that.
Ashley Roberts (You):  So we'll get some A/B test results, even though it's going to be a really small sample set. But just so y'all know, those are some of the testing things we're doing next.
Speaker 3:  Okay. Yeah. Yeah.
Speaker 3:  We can definitely accommodate that. The emails can be as custom or as static as we need, which is awesome, and with the language copy and the imagery and the design.
Speaker 3:  So the world is our oyster. We can have radically different designs for emails as well.
Ashley Roberts (You):  True. Oh, yeah. Yeah.
Ashley Roberts (You):  True.
Speaker 4:  I would say, yeah, 9 times out of 10, I'm here for a non-branded email just because it seems less genuine when you get a super marketing-heavy email. I feel like people are more quickly just more quick to just ignore that kind of stuff. We've received a couple.
Speaker 4:  I think we did a couple for Metro that were more stock market kind of mailchimp style emails.
Speaker 4:  And I was on the receiving end of those, and it felt so wrong. But I am one data set of a bunch of different users, and I'm also very sensitive to that sort of thing because that's what I do.
Speaker 4:  But yeah, super interested to see what we can do with an HTML email. Are we still handcuffed to the fonts that email accepts?
Speaker 3:  No. We can pretty much send any font that we want, including custom fonts. But I do agree with you that it should look like a human sends it and that it wasn't auto-generated because if we go with a heavily branded email for that sort of outreach, I do feel like you're right.
Speaker 3:  People are just going to ignore it because they're going to think it's a marketing email.
Ashley Roberts (You):  I think so.
Speaker 3:  But we can create beautifully crafted templates that look like they were human-written with minimal branding, minimal marketing, and it would look like a human wrote it.
Ashley Roberts (You):  Which I think.
Speaker 5:  Yeah. Shouldn't it just look just like an agent sat down, hit compose email, their signature block showed up, and that's it, right?
Ashley Roberts (You):  Exactly. Yeah. So there will be no upline branding at all on the outreach because it should look like it came directly from the agent.
Ashley Roberts (You):  But I think the stuff you're all talking about could apply to upline emails to the agent. Then that could be where we maybe experiment more because I think, yeah, it needs to look like it's truly an agent whipped up a quick email to them.
Speaker 4:  Yeah. Policyholder or insured-facing, that's just from the agent. But upline to the agent, there's a lot of really cool stuff that we could do.
Ashley Roberts (You):  For sure. For sure. There's going to be one more thing.
Ashley Roberts (You):  Sorry, this is a quick detour, but before I forget, I was chatting with Trevor because he used Linear for Metro stuff, or I think he did. But anyway, I was talking to him about this and the Claude stuff, and he had this idea that we were talking or at least this is what I'm going to do.
Ashley Roberts (You):  With Linear, I'm going to use I used Cursor, obviously, but whatever, same thing. I'm going to use that to then generate the original tickets when I do the full user flow.
Ashley Roberts (You):  So I'm going to do the demo and then say, "Hey, from here, can you parse that out into specific tickets?" And then set up the use case and then set up my role type so that it knows I have an incomplete picture of this because I'm not the designer or the engineer.
Ashley Roberts (You):  So I'm being like, "Okay, well, I'm from a whatever, product manager type role for the sake of this conversation." And so put all that in.
Ashley Roberts (You):  But then when I pull tickets to QA and all this stuff, I think I'm going to have either MD or I don't know if in this case it'd be a skill. I don't think it'd be a skill in default, but I think I would then filter it back through my role type.
Ashley Roberts (You):  So I'd be like, "Okay, pull the tickets that I'm QAing through the role type of product manager now." And I'll basically have a filter layer between Linear and my workspace every time, I think, is what I'm saying.
Ashley Roberts (You):  I'm going to try that out. I don't know if that makes sense.
Speaker 3:  Yeah, that would be a skill, I think.
Ashley Roberts (You):  Okay. I was like, "I think it'll then help me frame." And then that way, when you guys pull tickets, I want y'all to have that framework too because I'm sure there's stuff I'm not going to no, I know there's stuff I'm not going to have considered, but more than anything, I want it to reflect basically learnings and user experience, but I don't even want to dabble in.
Ashley Roberts (You):  And so I worry that it's going to go ahead and fill all the gaps in that I don't know of like, "This is how it should be built," or, "This is how it should be." And so I'm going to kind of frame it that way of like, "Just stay within my boundaries."
Ashley Roberts (You):  I don't know. So I don't know if that makes any sense.
Ashley Roberts (You):  But I think I'm going to experiment with that. I'll let you guys know how that goes.
Ashley Roberts (You):  Yeah, that's a waste of time, but.
Speaker 3:  Yeah. I think that would be a great use case for a Claude skill or Cursor skill or if Cursor even has that.
Ashley Roberts (You):  Yeah.
Speaker 3:  They do. Nice. Yeah.
Speaker 3:  And then if you have to chain together multiple skills, then you could go for a workflow.
Ashley Roberts (You):  I have not gone all in that yet, but I have been itching to. I just haven't.
Speaker 4:  Same.
Ashley Roberts (You):  I haven't sat down and done it.
Speaker 4:  Does that make us bad 0 to 1 employees since we haven't dabbled in workflow yet?
Speaker 3:  Well, funnyly enough, I've never dabbled in AI workflows either, but we're going to absolutely have to build them for sure for the automation we're looking for.
Speaker 4:  I think I will always remain in a skeptic seat. So I never trust AI quite enough until it's proven itself over and over and over and over and over again. And I think with everything getting to where it's been, where we're at right now, I would say is probably as AI-savvy as we've ever been.
Speaker 4:  At least I'll speak for myself. I am as AI-savvy as I've ever been at this particular time, and it's new.
Speaker 4:  And so that's where I'm like, "Ah, workflows are probably a week or two down the line for me because I'm just still so skeptical, especially when it comes to design because of that whole thing that keeps popping up. It's like AI doesn't have any taste."
Speaker 4:  And I'm like, "That is the majority of what I'm doing." I'm like, "This design hub is kind of my experiment of trying to give it taste and see if that works."
Speaker 4:  But yeah, the workflows still kind of freak me out a little bit.
Ashley Roberts (You):  I think the workflows will definitely apply to me doing the setup piece we were just talking about, 100% a workflow thing because I'm triggering each one. I'm kind of like, "Oh, man, I'm with you," and that I've been manually doing review between each step instead of saying, "Just run with it." But by the end of Members First, I started to get into that point.
Ashley Roberts (You):  I just hadn't moved it over to the workflow type of thing. So at the beginning, I like to double-check and rinse and repeat and look at every single thing coming through.
Ashley Roberts (You):  But I think at one point, unless I'm not understanding exactly how I'd set up a workflow, I think at one point, I could literally just be like, "Here's everybody. Here's the pool.
Ashley Roberts (You):  Prioritize, build the logic, write the email, do the questionnaire, draft it, and push it to Notion." It can run through all of that.
Ashley Roberts (You):  I don't have to be in the loop for any of those things. So I think I can just build run outreach workflow, and it'll do all of that and populate, and then it just works for a day in the background, so.
Speaker 3:  Yeah. It is confusing because you can code, not code, but you can encode an entire workflow into a skill. And that's where everything kind of gets gray because you can definitely do all those things that you just said, Ashley.
Speaker 3:  That was a six-step process you just listed off. You can literally take all six of those steps and smash that into one skill.
Speaker 3:  And then you're like, "Well, wait a minute. What was the purpose of a workflow then?"
Speaker 3:  Well, the purpose of a workflow is to actually synchronize multiple skills together in a sequence. So the idea isn't to cram everything into one skill.
Speaker 3:  Skills are more for a one-shot. You just want to accomplish one quick thing.
Speaker 3:  And another good way to think about it is, let's say you create that six-step skill. How would that six-step skill plug into a larger workflow?
Speaker 3:  Because it's accomplishing six different things, but is it reusable across other workflows? And so the idea of a workflow is more to compose larger workflows.
Speaker 3:  What's that, Amanda?
Speaker 4:  I'm not sure if I'm going to actually add anything helpful. You've been very informative in a lot of what you're saying. It makes a lot of sense.
Speaker 4:  So I'm not going to I was like, "It's dumb. Every square is a rectangle, but not every rectangle is a square."
Speaker 4:  Every skill could be a workflow, but not every workflow in no way translates back to a skill.
Speaker 3:  Yeah. Exactly. Because the idea is to make it composable.
Speaker 3:  One option is to take those six steps and then make each one its own skill and then compose them as one workflow. And from an engineering standpoint, that would be more, I guess, maintainable because now you have six discrete skills that all focus on one thing, and you can actually take those six skills and repurpose them for other workflows.
Speaker 3:  So that way, you're not reinventing the wheel. So it's just two ways of solving the same problem.
Speaker 3:  And to be honest, you should just pick whatever is easiest and fastest and then make it more optimal later.
Ashley Roberts (You):  Okay. Cool. I think that makes sense.
Ashley Roberts (You):  Like I said, I think I'd probably have to get in and try to make a workflow to really I want to say I have to do it once to then actually truly understand how it works. But I think that works because at the end of Members First, I used to be able to say, "This was so informal.
Ashley Roberts (You):  This is not a good way to do it." But I would just be like, "Okay, run the outreach play."
Ashley Roberts (You):  Or I'd run the and then I would have to say, "Remember, it's these six things." And then it'd be like, "Oh, yeah, I remember."
Ashley Roberts (You):  And then it would go do that and pull on. But now that I'm adding even Stockton Hill, I think having individual skills does make sense because I'm adding so much nuance to each step now because I'll be like, "Remember with Members First, and then remember how this changed, but retain Members First, create that new for Stockton Hill, and then from the two, make a standard."
Ashley Roberts (You):  But I'm doing that for every step. And so I should probably have individual skills for each step because my phrase can get a little bit messy because it's already run into stuff where I'm like, "Remember I told you to do this?"
Ashley Roberts (You):  And it's like, "Oh, yeah," because I think there's too much going on, so.
Speaker 3:  Yeah. Another good way to know whether or not you should go the skill route or the workflow route is if you know for sure you have discrete steps and that those steps depend on each other.
Ashley Roberts (You):  Yes, they do.
Speaker 3:  And so if you have one step feeding into the next and step two can't really start until step one is done, then you start to get into more of the workflow territory.
Ashley Roberts (You):  Cool.
Speaker 4:  So you can't do sequencing in this skill, but that's baked into a workflow?
Speaker 3:  Yeah. I believe that is a default with workflows, is that if the whole workflow fails, you'll pretty much know which step failed. So you can just dive straight into that one area.
Speaker 3:  Whereas if your skill failed, it may not always be obvious because it's trying to just do the whole thing.
Ashley Roberts (You):  Yeah, yeah, yeah. Okay. So that's something I'd like to do next week.
Ashley Roberts (You):  Probably after wireframes, though, because I need to get that going. But then I may move over and try to transition what I've done into maybe a workflow so that our third pilot customer, it's a little bit cleaner, so.
Ashley Roberts (You):  Okay. Cool.
Speaker 3:  Sounds good.
Ashley Roberts (You):  Sorry, I've just hogged up a bunch of time. So is there anything else? Davey, did you have anything?
Speaker 5:  Yeah. I mean, I have some initial feedback to inject from an agent feedback that I don't think it's going to derail anything. It's just going to give context for the build.
Speaker 5:  So definitely on rate increases, a couple of agents already have shared in their current behavior. They already target rate-increased customers with their CRM tool, agency Zoom or otherwise.
Speaker 5:  And they say, "Hey, look, one thing we do is if we know we're getting a rate increase, we trigger an automation in the CRM tool to reach out proactively." And the question they asked, and we don't have to answer it, but it's something to know for the future is the sales question is, "If I already have my CRM doing that, why would upline do it?"
Speaker 5:  My quick answer on the fly was because we have more context by which to draft the personalized email. But it's important to note that at some point, an agency well-versed in CRM behavior is going to ask that question.
Speaker 5:  And maybe at a deeper level, they'll say, "Hey, can upline sync with agency Zoom to round out my customer record of touch activity?" That's number one.
Speaker 5:  Number two is it was another rate-increase question. Oh, in an agency that I really trust, it would maybe even qualify to be kind of design partner-ish.
Speaker 5:  He said, "Hey, in these rate-increase scenarios, I want to come out of the gate and email number one and say, 'Hey, I've already shopped for you anticipating the increase with an indication of where this panel will look.' And step two would be survey a questionnaire confirmation with step three being final shop."
Speaker 5:  So his workflow was like, "I know these rates are going up, and if I don't show the customer on round one that I'm working for them and I have some numbers, they're gone anyways." So again, a couple of pieces of feedback I don't think fundamentally change MVP, but definitely interaction, integration with CRM, and maybe kind of moving the shell game around of like, "No, no, no.
Speaker 5:  On round one, I want to hit somebody that I've kind of given them a raider-style shop," basically saying like, "Hey, trending towards up," as opposed to just a salesy relationship-style email. So just those are two immediate quick pieces of feedback.
Speaker 5:  Happy to expand or answer questions of both of those.
Ashley Roberts (You):  I think that's great. So I'll start with the second one first. On that second one, I think there's definitely a workflow we could build in.
Ashley Roberts (You):  Like you said, it's almost more like a multi-raider style, but what's nice is, then your outreach email, one of the biggest risks we have is people being like, "Oh, it's for sure going up, and it's for sure due to this reason." It's like you're a little hesitant to do that when you haven't really dug into them or shopping at all.
Ashley Roberts (You):  But if you have a multi-raider style, you could then specifically be like, "It looks like I'm able to get you something cheaper, but I really need to confirm that you still have a trampoline," or, "I still need to do whatever, and here's the questionnaire to get another one." It kind of dovetails into having it be a much more strongly worded personal email as well.
Ashley Roberts (You):  I think we could do that post-MVP. And then the other thing on the first one, though, or the first point, not necessarily the integration, but one thing to highlight too is I don't believe any of the other CRM tools have a totally custom built-in questionnaire at the same time, though.
Ashley Roberts (You):  So it's like we have an outreach email that gives you a heads-up and also a method for you to really get all the information so you're not having to jump on a call if they say that they're interested, so. But okay, cool.
Speaker 5:  And also, too, they're just honestly zombies with the question, "Do you integrate?" Right? They don't even know past that integration.
Speaker 5:  It's like, "Do you integrate with agency Zoom or my AMS?" It's like, "Yes or no.
Speaker 5:  But if I said yes, then what would you do with it?" I don't know.
Speaker 5:  I just know to ask that question. So I just have to really make sure from a sales perspective, but then also, do we have the right talking points to say, "Well, why?
Speaker 5:  Why do you want to integrate with agency Zoom? Why would you want to come back to the AMS with this longer AMS play that we have in our back pocket?"
Speaker 5:  Just good context that I want to inject there.
Ashley Roberts (You):  That's awesome. Yeah. Thank you.
Speaker 4:  Very helpful.
Speaker 3:  Well, thanks for joining. Hope you guys have a great rest of your Thursday. Keep you posted if you need anything.
Speaker 3:  And hopefully, I'll get this email issue sorted out, and I will let y'all know if I do. And I'll get that prompt over to you guys for linear.
Speaker 3:  And have a great rest of your day.
Ashley Roberts (You):  Thanks. Y'all too.
Speaker 4:  See you.
Ashley Roberts (You):  Bye.
Speaker 3:  Bye now.
