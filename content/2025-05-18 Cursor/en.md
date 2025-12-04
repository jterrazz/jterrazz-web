![](assets/thumbnail.jpg)

# Cursor: The compression of mechanical work

The task was OAuth integration. Add Google login to an existing auth system. Service layer, route handlers, database schema, config files, tests—nothing architecturally novel, but a lot of files to touch consistently.

Traditionally, that's a three-hour job. Not because the problem is hard—I knew exactly what needed to happen. The architecture was clear in my head within minutes. What took forever was the mechanical part: opening files, typing boilerplate, wiring imports, making sure everything stayed consistent across layers.

Cursor compresses that mechanical layer. You describe what should exist, the AI handles the typing, you review the result. Three hours became forty-five minutes.

But here's what matters: the thinking stays with you. You're still the one deciding what to build, how to structure it, what patterns to follow. You still start with a test, work toward your intent, discover edge cases as you go. The process of building—of conceptualizing the application—remains yours. Cursor just removes the bottleneck between having the idea and seeing it exist.

That's the shift. Not "AI writes code for you." It's: you build the application, AI handles the transcription.

***

## Semantic understanding at scale

![](assets/indexing.jpg)

Traditional autocomplete predicts the next token based on the open file. Cursor is different—it indexes your entire codebase. It builds a semantic model of how your system connects: your patterns, your naming conventions, your architectural decisions.

The first time I realized this, I typed:

> "Refactor the user service to match how we handle organization entities."

And it *worked*. It understood both patterns without me showing them. It knew what "how we handle" meant in my codebase.

This kind of prompt works even better today. Models like Claude Opus 4.5 handle cross-codebase reasoning almost perfectly—they'll trace the patterns, identify the differences, and apply changes consistently across files. What felt like magic a year ago is now reliable.

This isn't keyword matching. It's reasoning about structure. And it extends beyond code—Cursor reads your test output, your linter errors, your framework documentation. The context isn't just what you've written; it's your entire development environment.

***

## The four modes

Cursor isn't a single feature. It's a workflow that adapts to task granularity. I use different modes for different moments, and knowing which one to reach for has become its own skill.

### 1. Flow state (Tab)

![](assets/single-line.jpg)

![](assets/multi-line.jpg)

At the lowest level, Tab completion generates entire function bodies instantly. But here's what makes it different from standard copilots: it predicts your *next action*, not just your next line.

Accept a change, and your cursor jumps to the logical next edit point. Add a parameter to a function signature, and it highlights the call sites that need updating. It feels less like autocomplete and more like pair programming with someone who's always one step ahead.

I noticed it learning my patterns. I favor early returns over nested conditionals. Functional composition over class hierarchies. After a few days, its suggestions matched my style—not generic "best practices" style.

The trap here is the same as with any autocomplete: Tab-Tab-Tab without reading. I catch myself doing it. The suggestions look right. But "looks right" isn't the same as "is right."

### 2. Surgical strikes (Cmd+K)

![](assets/inline-diff.jpg)

For specific, localized changes, I don't need a chat window. Select code, hit `Cmd+K`, describe the change in English:

> "Refactor this to use async/await."
> "Add rate limiting with a 100 req/min cap."
> "Handle the case where user is null."

A diff appears inline. Accept or reject. The editor becomes a command line for logic.

This mode shines for refactoring. "Extract this into a custom hook." "Convert this to TypeScript with proper types." "Add error handling for network failures." Changes that would take five minutes of careful editing happen in seconds of careful *reviewing*.

### 3. Architectural dialogue (Chat)

![](assets/chat.jpg)

For broader questions, Chat provides full codebase awareness. I use it when I'm orienting in unfamiliar code:

- "How does our caching layer invalidate entries?"
- "Why would this test fail given our auth setup?"
- "What's the data flow from API request to database write?"

The `@` reference system makes this precise. Tag `@filename` to focus on specific files, `@folder` to include a module, `@docs` to pull in framework documentation. It answers with your codebase as context, not generic knowledge.

The **Apply** button then inserts generated code directly into files, handling imports automatically. It bridges the gap between "here's what you could do" and "here's the code, already in place."

### 4. Agent mode

![](assets/agent.jpg)

This is where the paradigm shift happens. Agent mode handles multi-step tasks that require exploration.

> "Add CSV export to the analytics dashboard. Follow our existing PDF export patterns."

I watched it work: explored the codebase to find the PDF export, analyzed the pattern, implemented the backend logic, updated the frontend component, generated tests, ran them, saw a failure, *fixed its own failure*, and presented a complete diff.

The feeling is strange. You're not coding; you're supervising. You interrupt when it veers off course. You accept or reject the final result. But the hours of mechanical implementation? The agent handled them.

***

## Where it fails

After months of daily use, I've learned where to trust it and where to stay skeptical.

**Novelty breaks it.** It excels at pattern replication—doing what your codebase already does, in a new place. It struggles with genuinely new architecture. If not correctly guided.

**Ambiguity produces garbage.** "Make this faster" yields nothing useful. "Reduce response time below 200ms by implementing Redis caching for the user lookup" yields working code. Precision in, precision out.

**The "vibe coding" trap.** This is the real danger. Code appears fully formed, professionally formatted, passing tests. Your brain pattern-matches it to "good code" and your finger hovers over Accept.

I shipped a bug this way. The generated code looked correct. The tests passed. But there was a subtle race condition that only appeared under load. I hadn't *read* the code; I had *accepted* it.

The lesson wasn't "always scrutinize everything." It was: **decide upfront what level of quality this context requires.**

Like delegating to a team member, you make choices about acceptable risk:
- **MVP prototype**: Vibe code the whole thing. Speed matters more than edge cases. You'll rewrite it anyway.
- **Internal dashboard**: Vibe code the UI, but require proper error handling and data validation. Acceptable to break occasionally.
- **Payment flow**: Review every line. Test edge cases manually. No acceptable failure rate.

The question isn't "should I trust the AI?" It's "what are my requirements here, and what failure rate can I accept?" Be deliberate about it. The bugs I shipped weren't because AI is unreliable—they were because I hadn't decided what I actually needed.

***

## Learning to work with your agent

Here's the thing about those limitations: they're not fixed walls. They're starting points.

The more I've worked with Cursor, the more I've learned to guide it. Novelty breaks it—unless you break the novelty into familiar pieces. Ambiguity produces garbage—unless you've learned what precision looks like for *this* agent.

It's like working with a new team member. At first, you don't know their strengths or blind spots. You give vague instructions and get vague results. But over time, you learn how they think. You know when to give them autonomy and when to be prescriptive. You know which tasks they'll nail and which need closer supervision.

The same applies here. I've learned:
- **When to chunk**: Novel architecture works if I break it into steps the agent recognizes. "Design a custom cache" fails. "Create a Map wrapper with TTL expiration, then add LRU eviction, then add persistence" succeeds.
- **When to show examples**: For unusual patterns, I'll write one case manually, then ask the agent to follow that pattern for the rest.
- **When to constrain**: Sometimes I'll specify what *not* to do. "Don't use any external libraries." "Keep this under 50 lines." Constraints focus the output.
- **When to iterate**: The first generation is rarely perfect. But the second, guided by "fix this edge case" or "refactor this to match our style," often is.

The agent isn't a black box you throw prompts at. It's a collaborator you learn to direct. The better you know it, the further you can push it.

***

## Intent-driven development

Once you've learned to work with your agent, the question becomes: what's the best way to express intent?

I've landed on tests. Not tests written after the fact—tests written *before* the implementation exists:

```
user_can_purchase_with_saved_card.intent.test.ts
```

The test defines *what* should happen: user with saved card, clicks purchase, transaction succeeds, card is charged. Then I direct the agent: "Make this test pass, following our payment service patterns."

The AI handles the mechanics—the service logic, the API calls, the error states. I review the architecture and security.

This is test-driven development, but the "driven" part now includes an AI that does the implementation. You write the specification; the machine writes the code; you verify the result.

***

## The freed attention

Cursor compresses mechanical work from maybe 60% of my day to 20%. The question I keep asking myself: what do I do with the freed attention?

The AI handles the "how" exceptionally well. The "what" and the "why" remain mine. A tool that generates flawless code for the wrong feature is worse than useless.

My value used to be partially defined by typing speed and syntax memory. Now it's defined almost entirely by:
- **Architectural vision**—knowing what to build
- **Domain expertise**—understanding the problem deeply
- **Taste**—recognizing good solutions from merely functional ones
- **Specification clarity**—describing intent precisely enough for a machine to execute

Cursor amplifies these qualities by removing the mechanical barriers between thought and software. The ideas that used to take a weekend now take an afternoon. The prototypes that used to take a week now take a day.

Use it to build better systems, not just to build faster. The mechanical work is compressed. What you do with the freed cycles is up to you.

