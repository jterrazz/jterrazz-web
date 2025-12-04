![](assets/thumbnail.jpg)

# Architecting with AI

Directing gets you far. But some tasks are bigger than surgical strikes.

> "Add CSV export to the analytics dashboard. Follow our existing PDF export patterns."

This isn't a Cmd+K refactor. It's a multi-file feature: backend endpoint, data transformation, frontend component, tests. Dozens of decisions along the way.

I watched the agent work: explored the codebase to find the PDF export, analyzed the pattern, started implementing the backend. Then it hit an ambiguity—should the CSV include all columns or just visible ones? It made a choice. I caught it. "Just visible columns, and add a parameter to optionally include all."

The agent adjusted, continued, generated tests, ran them, fixed a failure, presented the result.

This is **working with the AI on bigger problems**. Not commanding—collaborating. You set the direction, watch it execute, course-correct when needed, iterate toward the solution together.

***

## The collaborative loop

![](assets/lighthouse-night.jpg)

Directing is command-response. You say what to do; it does it; you review.

Architecting is a conversation. You set a goal, the agent explores and implements, you watch and intervene, it adjusts, you refine, repeat.

The loop looks like this:

1. **Set direction.** "Add user authentication with email/password and OAuth. Follow our existing patterns."
2. **Watch.** The agent starts exploring, making decisions. You see where it's heading.
3. **Intervene.** "That's the wrong auth library—we use `next-auth`, not `passport`."
4. **It adjusts.** Continues with the correction applied.
5. **Refine.** "Good, but extract the config to a separate file."
6. **Repeat.** Until the feature is complete.

You're not reviewing line-by-line (that's directing). You're reviewing *direction*—is this heading where I want it to go?

The thinking stays with you. You're still the one who understands the architecture, the constraints, the goals. But instead of transcribing every decision into code, you're guiding something that can hold context and execute while you shape the direction.

***

## Learning your agent

![](assets/scaffolding.jpg)

The more you work with an agent, the more you learn its patterns.

**Where it excels:**
- Following existing patterns in your codebase
- Multi-file changes that are tedious but not novel
- Boilerplate-heavy features (CRUD endpoints, form components, test suites)
- Refactoring at scale ("convert all callbacks to async/await")

**Where it struggles:**
- Genuinely novel architecture (custom data structures, unusual patterns)
- Ambiguous requirements (it will guess, often wrong)
- Cross-cutting concerns it can't see (performance implications, security subtleties)
- Your unwritten conventions (the things you "just know")

Knowing these patterns lets you work with the agent more effectively:

**Chunk novel work into familiar pieces.** "Design a custom cache" might fail. "Create a Map wrapper, then add TTL expiration, then add LRU eviction" gives it familiar steps.

**Make the implicit explicit.** If you have conventions that aren't in the code, state them. "We always use early returns, never nested if/else."

**Show examples for unusual patterns.** Write one case manually, then ask the agent to follow that pattern for the rest.

**Interrupt early.** If you see it heading in the wrong direction, don't wait for it to finish. Stop, correct, continue.

The agent isn't a black box. It's a collaborator you learn to work with. The better you know it, the more you can accomplish together.

***

## Trust at the architectural level

![](assets/lock-vault.jpg)

Directing requires line-by-line review. Architecting requires a different kind of trust.

You're not checking every line of a 500-line diff. You're checking:

- **Is this the right approach?** Does the overall architecture make sense?
- **Does it follow our patterns?** Or did it invent something incompatible?
- **Are the key decisions correct?** The places where it had to choose.
- **What did it miss?** Edge cases, error handling, the things it couldn't know.

This requires more architectural judgment than directing. You need to be able to read a large diff and understand the shape of the solution, not just the syntax.

The tradeoff is explicit: you gain speed on big features, but you accept more risk that something slipped through. The mitigation is tests—if the feature has good test coverage, you can trust the implementation more and focus your review on the architectural choices.

My approach:
1. **Read the high-level structure first.** What files were created? What's the overall shape?
2. **Check the key decision points.** Where did it have to make choices?
3. **Scan for red flags.** New dependencies I didn't expect, patterns that don't match ours, suspiciously complex logic.
4. **Run the tests.** If they pass and cover the cases I care about, trust the details more.
5. **Spot-check specifics.** Pick a few critical paths and trace them through.

This is slower than directing review (small diffs) but much faster than implementing the feature myself.

***

## When to use each mode

Not every task needs architectural collaboration. The skill is matching the approach to the task.

**Use directing when:**
- The change is contained to one file or function
- You know exactly what you want
- The diff will be small enough to review line-by-line
- Precision matters more than speed

**Use architecting when:**
- The feature spans multiple files
- The path is known but tedious (CRUD, boilerplate, patterns you've done before)
- You can describe the goal but not every step
- You're comfortable reviewing at the architectural level

**Stay hands-on when:**
- The problem is genuinely novel
- You need to think by typing
- The architecture is unclear and you need to discover it
- Security or correctness is critical and you can't trust high-level review

Most of my work is directing—surgical precision. But architecting is where the biggest time savings come. A feature that takes a day to implement manually might take an hour of collaborative iteration.

***

## The rhythm

After months of working this way, I've developed a rhythm.

Morning: tackle the big feature through architectural collaboration. Set the direction, iterate with the agent until it's done. Review the architectural choices, run the tests, ship.

Throughout the day: directing for everything else. Quick refactors, bug fixes, small improvements. Cmd+K, review, accept.

The combination is powerful. Architecting handles the big chunks; directing handles the polish. Together, they compress days of work into hours.

The thinking is still mine. The architecture is still mine. The decisions are still mine. But the transcription—the tedious mechanical work of turning decisions into syntax—is shared with something that never gets tired.

***

*Next: What happens when AI stops being a development tool and becomes part of the product itself? We explore intelligent systems—hybrid architectures where code and AI work together.*
