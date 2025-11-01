![](./assets/thumbnail.jpg)

# Directing AI agents

A feature request lands: add newsletter subscription to the API. You know what needs to happen—a new database table, a POST endpoint, validation logic, error handling, tests. The mental checklist forms automatically.

In the old workflow, you'd open a blank file and start typing. Where should the route handler live? What's the right validation library again? You'd reference similar endpoints, copy some boilerplate, adjust it, run tests, debug the typo in line 47. Two hours later, you'd have working code.

But something fundamental has changed. You can now state your intention and let an AI agent build it.

Not autocomplete that finishes your line. Not a copilot that suggests the next function. An agent that takes a specification and produces working, tested code while you review and guide. Your role transforms from executor to evaluator, from typist to architect.

This is Level 2 AI integration for developers. Here's how it actually works.

***

![](assets/conductor.jpg)

## Intention-driven development

The traditional development loop starts with tests. You write a failing unit test, implement the code to make it pass, refactor. This works, but it still assumes you'll type the implementation yourself.

AI agents enable a different starting point: **intention**. Instead of writing low-level unit tests, you write high-level integration tests that describe business outcomes. Then you hand the implementation to an agent.

Here's the newsletter subscription feature from start to finish.

***

![](assets/editor.jpg)

### Step 1: Define the outcome

I create `subscribe.intent.test.ts` and write one integration test that describes what success looks like:

```typescript
test('newsletter subscription', async () => {
  const response = await request(app)
    .post('/api/subscribe')
    .send({ email: 'user@example.com' });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ success: true });
  
  const subscriber = await db.query(
    'SELECT * FROM subscribers WHERE email = ?',
    ['user@example.com']
  );
  expect(subscriber).toBeDefined();
});
```

This test fails immediately. Nothing exists yet. That's the point.

### Step 2: Delegate implementation

I open my AI-powered editor (Cursor in my case—essentially VS Code with full codebase context). Instead of creating files and typing implementations, I select the failing test and give the agent a single instruction:

**"Make this test pass. Follow our existing API patterns for validation and error handling."**

The agent has full context: my project structure, existing database schemas, current API conventions, validation approaches. It's not guessing—it understands the codebase the same way a teammate would after a thorough onboarding.

### Step 3: Review the plan

The agent responds with a proposed approach:

1. Create database migration for `subscribers` table (email, created_at, unique constraint)
2. Add POST route at `/api/subscribe`
3. Build controller with email validation (regex + DNS check)
4. Implement service layer to handle database insertion and duplicate detection
5. Add error handling for invalid emails and database failures

I review this architecture. It's solid, but I want one change: "Move the DNS validation to an async job—don't block the request on it." The agent adjusts the plan immediately.

### Step 4: Review the code

The agent generates each piece. I see diffs for every file:
- Migration file with proper schema
- Route registration following our conventions
- Controller with request validation
- Service with clean separation of concerns
- Error responses matching our API standards

Each diff appears for review. I can accept, reject, or request modifications. The validation regex looks too permissive—I ask for stricter rules around special characters. The agent updates it instantly. I accept the rest.

For some of the boilerplate (like the migration file structure), I can even switch to a faster, cheaper model to save costs. Complex logic gets the powerful "architect" model. Routine code generation gets the "workhorse" model.

### Step 5: Verify

The agent runs the test. It passes. The entire feature—database schema, API endpoint, validation, error handling, tested integration—took fifteen minutes. Most of that time was my review and architectural decisions.

I didn't type any implementation code. I defined the outcome, guided the architecture, and verified the quality.

***

![](assets/pyramid.jpg)

## What this changes

**Time compression.** The newsletter feature would have taken two hours traditionally: setting up the schema, writing the endpoint, debugging validation edge cases, writing tests. With directed AI, fifteen minutes. More importantly, those fifteen minutes are spent on high-value decisions (architectural choices, quality standards) rather than low-value execution (typing boilerplate, syntax lookup).

**Quality by default.** When you're not grinding through implementation details, you have attention left for quality. Every feature gets proper tests because writing test code is no longer tedious. Documentation happens because generating it is trivial. Error handling is comprehensive because you're reviewing rather than rushing.

**Exploration becomes cheap.** Want to try a different validation approach? Ask the agent to implement it. Compare both. Choose the better one. The cognitive cost of exploring alternatives drops from hours to minutes, so you actually do it. Better decisions follow.

**The work that remains is different.** You're not typing—you're defining outcomes, making architectural decisions, reviewing implementations, ensuring quality. This is higher-leverage work. The compound effect matters: when every developer on a team operates this way, the entire organization's output transforms.

**The trap is abdication.** You still need to understand what you're building. An AI agent will flawlessly implement a bad architecture if you direct it to. It will miss edge cases you don't mention. It will follow conventions it infers from your codebase, even if those conventions are flawed. The quality of the output depends entirely on the quality of your direction and review.

Think of it like this: you're managing an exceptionally fast junior developer who never gets tired, never makes typos, and has perfect recall of your entire codebase. But they have zero intuition, no product sense, and can't judge whether the feature they're building actually solves the user's problem. That judgment remains your responsibility.

## The new development workflow

Remember that feature request at the start—newsletter subscription? In the traditional workflow, you'd still be typing. Maybe debugging the validation logic. Possibly searching Stack Overflow for the right regex pattern.

With directed AI agents, you've moved on. The feature is done, tested, and merged. You're already thinking about the next problem: how to handle unsubscribe flows, or whether the subscription model should support preferences and segments.

This is the transformation. Not faster typing—faster thinking. Not more code—better architecture. Not automation of your job—elevation of your role to where it should have been all along.

**Start small this week.** Pick one feature you'd normally build manually. Write the integration test that describes the outcome you want. Then practice directing an AI agent to make it pass. Pay attention to what happens: not just the time saved, but where your attention goes when you're not typing implementation details.

The skill you're building isn't prompt engineering—it's architectural judgment under acceleration. The developers who master this will deliver more, learn faster, and build better systems than seemed possible a year ago.

The blank file is gone. The question is what you'll build with the time you've reclaimed.

***

*This article explores Level 2 AI integration for developers. The broader framework spans from embedded assistance to programmable intelligence, with each level representing deeper integration between human judgment and AI capability.*
