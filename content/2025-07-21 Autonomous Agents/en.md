![](assets/thumbnail.jpg)

# Collaborating with AI on larger problems

There is a distinct moment when you realize you aren't coding anymore. You are watching.

I gave a single prompt: *"Add CSV export to the analytics dashboard. Follow our existing PDF export patterns."* Then I sat back.

The agent explored my codebase. It located the PDF export service. It analyzed the pattern—how we structure exports, where the endpoints live, how we handle streaming for large datasets. Then it began to build. Backend route. Data transformation layer. Frontend component. All from one sentence.

When it hit an ambiguity—should the export include archived records?—it made a probabilistic choice. I caught it scrolling past and intervened: *"No, filter to active records only, same as PDF."* It adjusted and continued.

Twenty minutes later: a working feature, passing tests, ready for review.

This isn't autocomplete. It isn't even "Directing"—giving commands and verifying diffs. It is something fundamentally different: **Collaboration**. You set a goal, the AI navigates toward it, and you intervene when the trajectory drifts. It is a conversation toward a solution.

The first time it works, it is disorienting. The tenth time, it becomes the default way you build software.

---

## What makes collaboration different

Most AI-assisted coding is transactional. You ask for X, you get X. You accept or reject.

Collaboration is iterative. You set a direction, watch the AI work, intervene when needed, and refine as it progresses. The AI isn't just executing commands; it is exploring your codebase, making architectural decisions, and building toward a goal you have defined.

The shift looks like this:

| Mode | You do | AI does | Interaction |
|------|--------|---------|-------------|
| **Autocomplete** | Type code | Predict next tokens | Accept/reject suggestions |
| **Direction** | Specify changes | Execute transformations | Review diffs |
| **Collaboration** | Set goals | Explore, decide, build | Guide, intervene, iterate |

In collaboration, you aren't reviewing every line—you are reviewing **direction**. Is this heading where I want? Did it make reasonable choices? What did it miss?

The thinking stays with you. But instead of translating every thought into syntax, you are guiding an entity that builds while you shape.

---

## The collaboration loop

![](assets/lighthouse-night.jpg)

Collaboration follows a rhythm. Once you recognize it, you can wield it deliberately.

### 1. Set direction
Start with a clear goal and enough context for the AI to make high-quality probabilistic choices.

> "Add user authentication with email/password and OAuth. Follow our existing patterns in the auth folder. Use next-auth—we already have it installed."

The more context you provide upfront, the fewer corrections you'll need later. Name specific files, libraries, or patterns you want followed.

### 2. Watch actively
Do not walk away. Watch where the AI is heading.

This is different from reviewing a final diff. You are observing decisions *as they are made*. Is it looking at the right files? Did it choose the correct pattern? Is it about to go down a path you will need to undo?

Active watching lets you intervene *before* the AI builds on a flawed foundation.

### 3. Intervene precisely
When you see a deviation, be specific.

> "Stop—that's the wrong library. We use `jose` for JWT handling, not `jsonwebtoken`. Check `auth/utils.ts`."

Good interventions are surgical. You aren't restarting; you are course-correcting. The AI should continue with your correction applied, not reboot the entire process.

### 4. Refine progressively
As the feature takes shape, you shift from structural guidance to polish.

> "Good. Now extract the config values to environment variables."
> "Add error handling for the OAuth callback—check how we handle auth errors elsewhere."
> "The tests look right, but add a case for expired tokens."

Each refinement narrows the gap between the draft and production readiness.

### 5. Know when you're done
Collaboration ends when:
*   The feature works as intended.
*   Tests pass.
*   You've reviewed the architectural choices.
*   Edge cases are covered.

Do not over-iterate. If it works, ship it.

---

## Learning your partner's limits

![](assets/scaffolding.jpg)

The more you collaborate, the more you learn your AI's profile—where it excels, where it stumbles, and how to mitigate its blind spots.

### Where collaboration shines
*   **Following Existing Patterns:** When your codebase has clear examples, the AI extrapolates effectively. *"Follow the pattern in UserService"* works because the AI can see the pattern.
*   **Tedious Multi-File Changes:** Adding a new CRUD entity touches models, routes, controllers, tests. Tedious but mechanical. Perfect for collaboration.
*   **Boilerplate-Heavy Features:** Form components, API endpoints, test suites—features where the shape is predictable and the details are voluminous.
*   **Refactoring at Scale:** *"Convert all callback-based functions to async/await across fifty files."* You would never do this manually. Collaboration makes it feasible.

### Where collaboration fails
*   **Genuinely Novel Architecture:** If you are designing something that doesn't exist in your codebase, the AI has nothing to extrapolate from. It will guess—often confidently, often wrongly.
*   **Ambiguous Requirements:** The AI doesn't ask clarifying questions. It makes assumptions. If your goal is vague, its assumptions will diverge from your intent.
*   **Invisible Constraints:** Performance budgets, security implications, deployment considerations—things the AI cannot see in the text files. It will generate solutions that work functionally but fail in reality.
*   **Tribal Knowledge:** The unwritten conventions. The AI doesn't know that *"we never use that library"* or *"this service is deprecated"* or *"this pattern causes race conditions in production."*

### Working around limitations
*   **Chunk Novel Work:** Don't ask for "a custom caching system." Ask for "a Map wrapper," then "add TTL," then "add LRU eviction." Each step is familiar; the combination is novel.
*   **Make Implicit Knowledge Explicit:** State the tribal knowledge. *"We always use early returns."* *"Errors must use our `AppError` class."* *"Never import from the legacy folder."*
*   **Provide Examples:** If you want something the AI hasn't seen, write one example manually. Then ask it to mimic that pattern.
*   **Interrupt Early:** The moment you see a wrong vector, stop it. Do not wait to see how it plays out. Every minute of wrong work is debt you will pay back correcting it.

---

## Reviewing collaborative work

![](assets/lock-vault.jpg)

Collaboration produces larger changes than directed edits. A single session might touch ten files and add hundreds of lines. You cannot review this the same way you review a surgical diff.

### The trust calibration
Directed changes are small enough to verify line-by-line. Collaboration requires a different calibration: you are trusting more, so you must verify smarter.

The questions shift from *"is this line correct?"* to:
*   **Is this the right approach?** Does the architecture make sense?
*   **Does it follow our patterns?** Or did it invent something incompatible?
*   **Are the key decisions correct?** The places where the AI had to choose between options.
*   **What did it miss?** Edge cases, security, performance.

### My review process

1.  **High-Level Structure First:** What files changed? What is the shape of the solution? Before looking at code, understand the architecture.
2.  **Check Decision Points:** Locate the places where the AI had to make a choice. These are the highest-risk vectors. Did it choose the right library? The right pattern?
3.  **Scan for Red Flags:** Quick pass for obvious issues: unexpected dependencies, wrong patterns, suspicious complexity, missing error handling, magic numbers.
4.  **Run the Tests:** If tests pass, you can trust implementation details more. Focus your manual review on architectural choices rather than syntax.
5.  **Spot-Check Critical Paths:** Don't read every line, but *do* read the important ones. The business logic. The security boundaries. The places where bugs would be catastrophic.

### The tradeoff
You are accepting more risk in exchange for velocity. A 500-line feature in an hour instead of a day. The mitigation is tests—good coverage lets you trust the implementation and focus review on the choices tests can't verify.

If your test coverage is poor, collaboration is riskier. You will need to review more carefully, eroding the time savings. **Invest in tests first.**

---

## Matching mode to task

Not every task deserves collaboration. Sometimes direction is better. Sometimes you must code manually.

**Use Collaboration When:**
*   The feature spans multiple files.
*   The implementation path is known but tedious.
*   Your codebase has clear patterns to follow.
*   The change is well-defined but lengthy to type.
*   You have good test coverage as a safety net.

**Use Direction When:**
*   The change is contained to one file.
*   You know exactly what you want, line by line.
*   The diff will be small enough to review completely.
*   Precision matters more than speed.

**Stay Hands-On When:**
*   The problem is genuinely novel and you need to think by typing.
*   Security or correctness is critical and you cannot afford AI mistakes.
*   You are exploring—not building, but learning *what* to build.
*   The task requires understanding that comes only from doing.

Most of my day is direction—surgical strikes, precisely specified, carefully verified. But the massive time savings come from collaboration. A feature that takes a day to build manually might take an hour of guided iteration.

---

## The daily rhythm

After months of working this way, I have settled into a pattern.

**Morning: Collaboration.** Start with the substantial feature—the multi-file addition, the major refactor. Set direction, iterate until done. Review architecture, run tests, ship.

**Throughout the Day: Direction.** Quick refactors, bug fixes, small additions. Select code, describe the change, verify the diff. `Cmd+K`, review, accept.

**When Stuck: Hands-On.** If I'm not sure what I want, I write code myself until I figure it out. Collaboration requires knowing the destination. You cannot guide something toward a goal you haven't defined.

The combination is powerful. Collaboration handles the big chunks fast. Direction handles the precision work. Manual coding handles the thinking.

The decisions remain mine. The architecture is my judgment. The mechanical work of translating decisions into syntax—that is shared.

What used to take days now takes hours. Not because the AI is thinking for me, but because it is typing for me while I focus on what actually matters: **the choices that shape the software.**
