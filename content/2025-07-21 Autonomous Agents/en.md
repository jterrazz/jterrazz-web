![](assets/thumbnail.jpg)

# Collaborating with AI

I gave a single prompt: "Add CSV export to the analytics dashboard. Follow our existing PDF export patterns."

Then I watched. The agent explored my codebase, found the PDF export, analyzed the pattern, started implementing. Backend endpoint, data transformation, frontend component—all from one sentence.

When it hit an ambiguity, it made a choice. I caught it, corrected it. It adjusted. Generated tests, ran them, fixed a failure, presented the result.

It's disorienting at first. You're not coding—you're supervising. Having a conversation toward a solution, intervening when the direction drifts, accepting when it lands.

This is collaboration—working *with* AI on problems too big for surgical strikes. Hours of implementation compress into minutes of guided iteration.

***

## The collaborative loop

![](assets/lighthouse-night.jpg)

Direction is command-response. You say what to do; it does it; you review.

Collaboration is a conversation. You set a goal, the agent explores and implements, you watch and intervene, it adjusts, you refine, repeat.

The loop looks like this:

1. **Set direction.** "Add user authentication with email/password and OAuth. Follow our existing patterns."
2. **Watch.** The agent starts exploring, making decisions. You see where it's heading.
3. **Intervene.** "That's the wrong auth library—we use `next-auth`, not `passport`."
4. **It adjusts.** Continues with the correction applied.
5. **Refine.** "Good, but extract the config to a separate file."
6. **Repeat.** Until the feature is complete.

You're not reviewing line-by-line. You're reviewing *direction*—is this heading where I want? The thinking stays with you. But instead of typing every decision, you're guiding something that executes while you shape.

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
- Things it can't see (performance impact, security issues)
- Your unwritten conventions (the things you "just know")

Knowing these patterns lets you work with the agent more effectively:

**Chunk novel work into familiar pieces.** "Design a custom cache" fails. "Create a Map wrapper, then add TTL, then add LRU eviction" works.

**Make the implicit explicit.** State conventions that aren't in the code. "We always use early returns."

**Show examples for unusual patterns.** Write one case manually, then ask it to follow that pattern.

**Interrupt early.** If it's heading wrong, don't wait. Stop, correct, continue.

***

## Trust at the architectural level

![](assets/lock-vault.jpg)

Direction requires line-by-line review. Collaboration requires a different kind of trust.

You're not checking every line of a 500-line diff. You're checking:

- **Is this the right approach?** Does the overall architecture make sense?
- **Does it follow our patterns?** Or did it invent something incompatible?
- **Are the key decisions correct?** The places where it had to choose.
- **What did it miss?** Edge cases, error handling, the things it couldn't know.

This requires more judgment than directing. You need to read a large diff and understand the shape, not just the syntax.

The tradeoff: you gain speed on big features, but accept more risk that something slipped through. The mitigation is tests—good coverage lets you trust the implementation and focus review on architectural choices.

My approach:
1. **High-level structure first.** What files? What's the shape?
2. **Check decision points.** Where did it have to choose?
3. **Scan for red flags.** Unexpected dependencies, wrong patterns, suspicious complexity.
4. **Run the tests.** If they pass, trust the details more.
5. **Spot-check critical paths.**

***

## When to use each mode

Not every task needs collaboration. The skill is matching the approach to the task.

**Use direction when:**
- The change is contained to one file or function
- You know exactly what you want
- The diff will be small enough to review line-by-line

**Use collaboration when:**
- The feature spans multiple files
- The path is known but tedious (CRUD, boilerplate, patterns you've done before)
- You can describe the goal but not every step

**Stay hands-on when:**
- The problem is genuinely novel
- You need to think by typing
- Security or correctness is critical

Most of my work is direction—surgical precision. But collaboration is where the biggest time savings come. A feature that takes a day to implement manually might take an hour of guided iteration.

***

## The rhythm

After months of working this way, I've developed a rhythm.

Morning: tackle the big feature through collaboration. Set direction, iterate until it's done. Review the choices, run the tests, ship.

Throughout the day: direction for everything else. Quick refactors, bug fixes, small improvements. Cmd+K, review, accept.

The combination is powerful. Collaboration handles the big chunks; direction handles the polish. Together, they compress days into hours.

The thinking and decisions remain mine. The mechanical work of turning them into syntax? That's shared.

***

*Next: what happens when AI stops being a development tool and becomes part of the product itself?*
