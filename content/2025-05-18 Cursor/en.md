![](assets/thumbnail.jpg)

# Cursor: The compression of mechanical work

The task was OAuth integration. Add Google login to an existing auth system. Service layer, route handlers, database schema, config files, tests—nothing new, but a lot of files to touch.

Traditionally, that's a three-hour job. Not because the problem is hard—I knew exactly what needed to happen. The architecture was clear in my head within minutes. What took forever was the mechanical part: opening files, typing boilerplate, wiring imports, making sure everything stayed consistent across layers.

Cursor compresses that mechanical layer. You describe what should exist, the AI handles the typing, you review the result. Three hours became forty-five minutes.

But here's what matters: the thinking stays with you. You're still the one deciding what to build, how to structure it, what patterns to follow. The creative process remains yours. Cursor just removes the friction between having the idea and seeing it exist.

That's the shift. Not "AI writes code for you." It's: you build the application, AI handles the transcription.

***

## Codebase awareness

![](assets/indexing.jpg)

Traditional autocomplete predicts the next token based on the open file. Cursor indexes your entire codebase. It learns your patterns, your naming conventions, your architectural decisions.

The first time I realized this, I typed:

> "Refactor the user service to match how we handle organization entities."

And it *worked*. It understood both patterns without me showing them. It knew what "how we handle" meant in my codebase.

This isn't keyword matching. It's reasoning about structure. And it extends beyond code—Cursor reads your test output, your linter errors, your framework documentation. The context isn't just what you've written; it's your entire development environment.

***

## The four modes

Cursor isn't a single feature. It's a workflow that scales with the task—from single-line completions to multi-file refactors.

### 1. Flow state (Tab)

![](assets/single-line.jpg)

![](assets/multi-line.jpg)

Tab completion generates entire function bodies instantly. What sets it apart is the *flow*: accept a change, and your cursor jumps to the next edit point. Add a parameter to a function, and it highlights the call sites that need updating.

It feels less like autocomplete and more like pair programming with someone who's always one step ahead.

I noticed it learning my patterns—early returns over nested conditionals, functional composition over class hierarchies. After a few days, its suggestions matched my style, not generic "best practices."

The risk is muscle memory. Tab-Tab-Tab without reading. The suggestions look right, but "looks right" isn't the same as "is right."

### 2. Surgical strikes (Cmd+K)

![](assets/inline-diff.jpg)

For specific, localized changes, I don't need a chat window. Select code, hit `Cmd+K`, describe the change in English:

> "Refactor this to use async/await."
> "Add rate limiting with a 100 req/min cap."
> "Handle the case where user is null."

A diff appears inline. Accept or reject.

This mode shines for refactoring. "Extract this into a custom hook." "Convert this to TypeScript with proper types." "Add error handling for network failures." Changes that would take five minutes of careful editing happen in seconds of careful *reviewing*.

### 3. Questions (Chat)

![](assets/chat.jpg)

For broader questions, Chat provides full codebase awareness. I use it when navigating unfamiliar code:

- "How does our caching layer invalidate entries?"
- "Why would this test fail given our auth setup?"
- "What's the data flow from API request to database write?"

The `@` reference system makes this precise. Tag `@filename` to focus on specific files, `@folder` to include a module, `@docs` to pull in framework documentation. It answers with your codebase as context, not generic knowledge.

### 4. Agent mode

![](assets/agent.jpg)

Agent mode handles multi-step tasks that require exploration.

> "Add CSV export to the analytics dashboard. Follow our existing PDF export patterns."

I watched it work: explored the codebase to find the PDF export, analyzed the pattern, implemented the backend logic, updated the frontend component, generated tests, ran them, saw a failure, *fixed its own failure*, and presented a complete diff.

It's disorienting at first. You're not coding; you're supervising. You interrupt when it veers off course. You accept or reject the final result. But the hours of mechanical implementation? The agent handled them.

***

## Where it fails

After months of daily use, I've learned where to trust it and where to stay skeptical.

**Novelty breaks it.** It excels at pattern replication—doing what your codebase already does, in a new place. New architecture requires you to lead: break it into familiar steps, provide examples, set boundaries.

**Ambiguity produces garbage.** "Make this faster" yields nothing useful. "Reduce response time below 200ms by implementing Redis caching for the user lookup" yields working code. Precision in, precision out.

**Accepting without reading.** This is the real danger. Code appears fully formed, professionally formatted, passing tests. It *looks* right, so your finger hovers over Accept.

I shipped a bug this way. The generated code looked correct. The tests passed. But there was a subtle race condition that only appeared under load. I hadn't *understood* the code; I had *accepted* it.

The lesson wasn't "always scrutinize everything." It was: **decide upfront how much review this code needs.**

Like delegating to a team member, you make choices about acceptable risk:
- **MVP prototype**: Accept fast, iterate faster. Speed matters more than edge cases. You'll rewrite it anyway.
- **Internal dashboard**: Trust the UI, but require proper error handling and data validation. Acceptable to break occasionally.
- **Payment flow**: Review every line. Test edge cases manually. No acceptable failure rate.

The question isn't "should I trust the AI?" It's "what failure rate can I accept here?" The bugs I shipped weren't because AI is unreliable—they were because I hadn't decided what I needed.

***

## Learning to work with your agent

Those limitations aren't fixed—they're the starting point.

Working with Cursor is like onboarding a new team member. At first, you don't know their strengths or blind spots. But over time, you learn how they think—when to give autonomy, when to be prescriptive, which tasks they'll nail and which need closer supervision.

After months of iteration, I've built a mental model of what works:
- **When to chunk**: Novel architecture works if I break it into steps the agent recognizes. "Design a custom cache" fails. "Create a Map wrapper with TTL expiration, then add LRU eviction, then add persistence" succeeds.
- **When to show examples**: For unusual patterns, I'll write one case manually, then ask the agent to follow that pattern for the rest.
- **When to constrain**: Sometimes I'll specify what *not* to do. "Don't use any external libraries." "Keep this under 50 lines." Constraints focus the output.
- **When to iterate**: The first generation is rarely perfect. But the second, guided by "fix this edge case" or "refactor this to match our style," often is.

The agent isn't a black box you throw prompts at. It's a collaborator you learn to direct. The better you know it, the further you can push it.

***

## Intent-driven development

Once you've learned to direct your agent, the bottleneck shifts. The agent executes well when it knows *exactly* what you want. The question becomes: how do you express intent precisely?

Natural language is fuzzy. "Add user authentication" could mean a dozen implementations. But a failing test is precise—it defines the exact behavior you expect.

I've started writing tests *before* the implementation exists. The test specifies the contract: user with saved card, clicks purchase, transaction succeeds, card is charged. Then I direct the agent: "Make this test pass, following our payment service patterns."

The AI handles the mechanics—the service logic, the API calls, the error states. I review the architecture and edge cases.

This is TDD evolved for the AI era. You write the specification; the machine writes the implementation; you verify the result. The test becomes both your intent and your validation.

***

## The freed attention

Cursor compresses mechanical work. Tasks that used to fill half my day now take an hour or two. So what do I do with the freed attention?

The AI handles the "how" exceptionally well. The "what" and the "why" remain mine. A tool that generates flawless code for the wrong feature is worse than useless.

My value used to include typing speed and syntax memory. Now it's almost entirely:
- **Architectural vision**—knowing what to build
- **Domain expertise**—understanding the problem deeply
- **Taste**—recognizing good solutions from merely functional ones
- **Clarity**—describing intent precisely enough for a machine to execute

Cursor amplifies these qualities by removing the mechanical barriers between thought and software. The ideas that used to take a weekend now take an afternoon. The prototypes that used to take a week now take a day.

The bottleneck is no longer typing. It's thinking clearly about what should exist.

