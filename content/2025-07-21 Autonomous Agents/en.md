![](assets/thumbnail.jpg)

# Collaborating with AI on larger problems

There is a distinct moment when you realize you aren't coding anymore. You are watching.

I gave a single prompt: *"Add CSV export to the analytics dashboard. Follow our existing PDF export patterns."* Then I sat back.

The agent explored my codebase, located the PDF export service, analyzed the pattern, and began to build. Backend route, data transformation layer, frontend component. All from one sentence.

When it hit an ambiguity—should the export include archived records?—it made a probabilistic choice. I caught it scrolling past and intervened: *"No, filter to active records only."* It adjusted and continued.

Twenty minutes later: a working feature, passing tests, ready for review.

This isn't autocomplete. It isn't even "Directing." It is something fundamentally different: **Collaboration**. You set a goal, the AI navigates toward it, and you intervene when the trajectory drifts. It is a conversation toward a solution, powered by models like **Claude Opus 4.5** that can hold complex context and reason over multiple steps.

---

## What makes collaboration different

Most AI-assisted coding is transactional. You ask for X, you get X.

Collaboration is iterative. The AI explores, decides, and builds. The shift looks like this:

*   **Autocomplete:** You type code. AI predicts tokens.
*   **Direction:** You specify changes. AI executes transformations.
*   **Collaboration:** You set goals. AI explores and builds. You guide.

In collaboration, you aren't reviewing every line—you are reviewing **direction**. Is this heading where I want? Did it make reasonable choices? What did it miss?

The thinking stays with you. But instead of translating every thought into syntax, you are guiding an entity that builds while you shape.

---

## The collaboration loop

![](assets/lighthouse-night.jpg)

Collaboration follows a rhythm. Once you recognize it, you can wield it deliberately.

### 1. Set direction
Start with a clear goal and enough context for the AI to make high-quality probabilistic choices.

> "Add user authentication with email/password and OAuth. Follow our existing patterns in the auth folder. Use next-auth—we already have it installed."

The more context you provide upfront (specific files, libraries, patterns), the fewer corrections you'll need later.

### 2. Watch actively
Do not walk away. Watch where the AI is heading.

This is different from reviewing a final diff. You are observing decisions *as they are made*. Is it looking at the right files? Did it choose the correct pattern? Is it about to go down a path you will need to undo?

Active watching lets you intervene *before* the AI builds on a flawed foundation.

### 3. Intervene precisely
When you see a deviation, be specific.

> "Stop—that's the wrong library. We use `jose` for JWT handling, not `jsonwebtoken`. Check `auth/utils.ts`."

Good interventions are surgical. You aren't restarting; you are course-correcting.

### 4. Refine progressively
As the feature takes shape, you shift from structural guidance to polish.

> "Good. Now extract the config values to environment variables."
> "The tests look right, but add a case for expired tokens."

Each refinement narrows the gap between the draft and production readiness.

---

## Learning your partner's limits

![](assets/scaffolding.jpg)

The more you collaborate, the more you learn your AI's profile—where it excels, where it stumbles.

### Where collaboration shines
*   **Following Existing Patterns:** When your codebase has clear examples, the AI extrapolates effectively.
*   **Tedious Multi-File Changes:** Adding a new CRUD entity touches models, routes, controllers, tests. Perfect for collaboration.
*   **Refactoring at Scale:** *"Convert all callback-based functions to async/await across fifty files."*

### Where collaboration fails
*   **Genuinely Novel Architecture:** If you are designing something that doesn't exist in your codebase, the AI has nothing to extrapolate from. It will struggle to align with your true intent, as architecture is a decision process, not just implementation.
*   **Invisible Constraints:** Performance budgets, security implications, tribal knowledge. The AI cannot see that *"we never use that library"* or *"this service is deprecated."*

### The senior partnership
Working with a high-reasoning agent isn't about "prompting"—it is about pair programming. To get the best out of it, you must apply the same rigor you would with a human partner.

This means bringing **Senior Developer** skills to the conversation:
*   **Foresight:** Anticipating architectural bottlenecks before they are coded.
*   **Domain Authority:** Enforcing the true meaning of business terms to prevent semantic drift.
*   **Strategic Focus:** Knowing what requires rigorous testing and what can be loose, or exactly what the frontend team expects beyond the JSON contract.
*   **Business Context:** Anchoring every decision in *why* the feature exists.

The agent can write the code, but it cannot know the business reality. Your role is to inject that reality into the collaboration loop.

---

## Reviewing collaborative work

![](assets/lock-vault.jpg)

Collaboration produces larger changes than directed edits. A single session might touch ten files and add hundreds of lines. You cannot review this the same way you review a surgical diff.

### The trust calibration
You are trusting more, so you must verify smarter. The questions shift from *"is this line correct?"* to:

1.  **Is this the right approach?** Does the architecture make sense?
2.  **Does it follow our patterns?** Or did it invent something incompatible?
3.  **What did it miss?** Edge cases, security, performance.

### My review process

1.  **High-Level Structure First:** What files changed? What is the shape of the solution?
2.  **Check Decision Points:** Locate the places where the AI had to make a choice. These are the highest-risk vectors.
3.  **Scan for Red Flags:** Unexpected dependencies, suspicious complexity, missing error handling.
4.  **Interrogate the Agent:** Don't just read the diff—ask the agent. *"Why did you choose this pattern?"* *"What trade-offs did you make?"* Treat the review as a dialogue. Often, the agent's explanation reveals the flaw you missed in the code.

**The Tradeoff:** You accept more risk in exchange for velocity. A 500-line feature in an hour instead of a day. The mitigation is tests—good coverage lets you trust the implementation and focus review on the choices tests can't verify.

---

## The new normal

I no longer switch between modes. My default state is collaboration.

I start every task by setting a direction for the agent. While it builds the infrastructure, the tests, and the boilerplate, I am already thinking about the next architectural move. When it gets stuck, I don't take over—I guide it out.

The combination is powerful not because it is faster (though it is), but because it elevates the nature of the work. I am no longer paid to type syntax. I am paid to think, to design, and to lead a synthetic partner that never sleeps, never complains, and executes exactly as well as I can lead it.

The decisions remain mine. The architecture is my judgment.
