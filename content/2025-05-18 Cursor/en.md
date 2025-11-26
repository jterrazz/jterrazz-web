![](assets/thumbnail.jpg)

# Cursor: the compression of mechanical work

The authentication system needs OAuth support. This touches the auth service, route handlers, database schema, config files, and tests. The architecture is known. The challenge isn't complexity—it's the mechanical effort of updating each file consistently. This often takes three hours minimum.

Or forty-five minutes if you shift from typing to directing.

That's the promise of Cursor. Not just faster autocomplete—a fundamental compression of the gap between architectural decision and working implementation. You define what should exist, the AI helps make it exist, you review and ship.

## Semantic understanding at scale

![](assets/indexing.jpg)

Traditional autocomplete predicts the next token from local context. Cursor indexes your entire codebase and builds a semantic model of how everything connects—patterns, architectural decisions, naming conventions.

The practical consequence: reference anything without copy-pasting context. "Refactor the user service to match how we handle organization entities" works because the AI has mapped both systems. It's not searching keywords—it's reasoning about structure.

This extends beyond static analysis. Cursor can run tests, analyze failures, and propose fixes. It invokes your linter and applies corrections matching your style. The context isn't just code—it's the development environment.

## Four modes of engagement

### Completion

![](assets/single-line.jpg)
*Single-line completion*

![](assets/multi-line.jpg)
*Multi-line completion*

Tab generates entire function bodies, test cases, config blocks. It recognizes patterns across the codebase—if you use async/await, it generates async. If you favor functional composition, it suggests that style.

![](assets/inline-predictions.jpg)

After accepting, tab jumps to the logical next edit point. One-click suggestions appear inline: verbose comments get concise alternatives, inconsistent names get better options.

### Inline edits

![](assets/inline-diff.jpg)

Select code, `Cmd+K`, describe the change. "Refactor this to async/await." Accept or reject. Works across multiple selections—modify ten similar functions with one instruction.

Terminal mode: `Cmd+K` translates English to shell commands. "Find all TypeScript files modified in the last week" becomes the right incantation.

### Chat

![](assets/chat.jpg)

Full codebase awareness. Ask architectural questions ("How does our caching layer work?"), debugging questions ("Why would this throw a timeout?"), implementation questions ("Best way to add an API endpoint given our patterns?").

The `@` reference system makes this surgical:

![](assets/include.jpg)

`@filename.ts` includes a file, `@symbolName` references a function, `@foldername` includes a directory, `@docs` pulls framework documentation, `@web` searches the web, `@codebase` searches your project semantically.

![](assets/context.jpg)

The Apply button inserts code directly into files, handling imports automatically:

![](assets/apply.jpg)

Works across multiple files—"Add input validation to all API routes" applies consistent changes to dozens of files. Review, approve, done.

### Agent mode

![](assets/agent.jpg)

Multi-step tasks requiring exploration and iteration. Describe the objective: "Add CSV export to the analytics dashboard. Follow our existing PDF export patterns."

The agent explores existing implementations, creates backend logic, updates frontend, generates tests, runs them, fixes failures, presents a complete diff. You see its reasoning, interrupt anytime, review the full diff before accepting.

Excels at well-defined tasks with clear success criteria. Struggles with novel architectures or ambiguous requirements.

## Configuration

### Rules

![](assets/rules.jpg)

Define project conventions in `.cursor/rules`—the AI follows them without repeating in every prompt:

> Test descriptions follow Given-When-Then. API responses use camelCase. Public functions require JSDoc. Prefer functional composition.

[Example rules file](https://github.com/jterrazz/fake-news-api/blob/main/.cursor/rules)

### Models

**Planning:** GPT-4, Claude Opus for architectural decisions. **Code generation:** Claude Sonnet, Gemini Pro for implementation. **Quick fixes:** Faster models for simple edits.

Pro tier (~$20/month) provides frontier models. Free tier produces noticeably weaker code.

### Patterns worth knowing

**Reapply commits:** "Reapply changes from commit [hash], adapted for the new structure."

**Test-driven fixes:** "Run the test suite and fix all failures." Agent iterates until tests pass.

**Batch operations:** Select multiple functions, `Cmd+K`, one instruction. "Add error handling to all these API calls."

## Where it fails

**Novel architectures:** Designing something genuinely new—custom caching, novel data structures—produces mediocre results. Cursor follows patterns; it can't innovate them.

**Ambiguous requirements:** "Make this faster" produces generic changes. "Reduce response time below 200ms by implementing caching" works.

**Complex debugging:** Bugs requiring deep domain knowledge get surface-level fixes. Excellent at clear test failures, weak at reasoning about unexpected behavior.

**Cost:** Agent mode racks up API costs on complex tasks, especially stuck loops. Monitor usage, interrupt agents not making progress.

**Context limits:** Very large codebases (100k+ lines) exceed context windows, causing inconsistent implementations.

**The "vibe coding" trap:** Easy generation encourages accepting code without understanding it. Technical debt accumulates. Treat every generated change like code from a junior developer: Does it solve the problem? Handle edge cases? Is it maintainable?

## Intent-driven development

Write high-level tests describing desired outcomes, then direct the AI to make them pass. Test-driven development elevated.

Create `user_can_purchase_with_saved_card.intent.test.ts` describing the complete checkout flow, then: "Make this test pass. Follow our existing payment processing patterns."

The AI implements service logic, updates the API, handles edge cases, writes supporting tests. You review architecture and security. Development stays focused on outcomes, not mechanics.

## How to adopt

**Start with Pro.** Free tier limits model access enough that you won't experience real capabilities. $20/month is often cheaper than one avoided debugging session.

**Configure deliberately.** Thirty minutes on keybindings, models, rules. [Example configuration](https://github.com/jterrazz/jterrazz-configuration/tree/main/configurations/cursor).

**Learn progressively.** Week 1: autocomplete. Week 2: `Cmd+K` inline edits. Week 3: chat with `@` references. Week 4: agent mode on small features.

**Review discipline.** Every generated change gets the same rigor as junior developer code. The ease of generation makes skipping tempting. Maintain the discipline.

## What this changes

Less typing implementation details, more defining architecture. Less debugging syntax, more reasoning about behavior. Less mechanical refactoring, more strategic decisions.

Mechanical work compresses from sixty percent of your time to twenty. The freed attention goes somewhere—the question is where.

The AI handles "how" exceptionally well. "What" and "why" remain yours. A tool that generates flawless code for the wrong feature is worse than useless.

Your value comes from architectural vision, domain expertise, quality judgment. Cursor amplifies those by removing mechanical barriers. The compression is real. Use it to build better systems, not just to build faster.
