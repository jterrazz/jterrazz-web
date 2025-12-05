![](./assets/thumbnail.jpg)

# Directing AI agents

Every edit has two parts: knowing what to change, and typing the change. The first takes seconds. The second takes minutes. What if you could skip the second part entirely?

Select a function. Cmd+K. "Add error handling for network timeouts." Ten seconds later, try-catch blocks wrap the fetch calls, with proper retry logic and error messages. The change you conceived in five seconds now exists in five seconds.

This is directing—surgical strikes where you point at something specific, describe exactly what you want, and the agent executes. No ambiguity. No exploration. Just precise transformation.

But there's a catch. Speed without verification is technical debt in disguise. I've shipped bugs by accepting code I didn't read. The art isn't just in directing—it's in knowing how to verify, when to trust, and how to express intent so precisely that the output matches your vision.

***

## What actually gets compressed

![](assets/split-thread.jpg)

Every edit has two parts: knowing what to change, and typing the change.

"Add null checks to this function." I know exactly where and how. But typing it out—finding each reference, adding the conditions, making sure the syntax is right—takes minutes. The thinking took seconds.

"Refactor this callback to async/await." I can see the shape of the result in my head. But mechanically transforming every `.then()` chain, handling the error cases, updating the callers—that's tedious transcription.

**Directing compresses the transcription, not the thinking.**

The thinking is still yours. You decide *what* needs to change and *why*. You understand the context, the constraints, the patterns. The agent handles the mechanical execution—the part that's tedious but not cognitively demanding.

The first few times I tried it, I failed. My prompts were vague because my thinking was vague. "Make this better" produced garbage. "Add retry logic with exponential backoff, max 3 attempts, 1s base delay" produced exactly what I wanted.

Precision in, precision out. You can't direct what you haven't thought through.

***

## Precision through specification

![](assets/architect-table.jpg)

The more precise your specification, the better the output. I've found several ways to be precise:

**Tests as contracts.** For behavior changes, write the test first:

```typescript
test('retries failed requests up to 3 times', async () => {
    const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce({ ok: true });
    
    await fetchWithRetry('/api/data', { fetch: mockFetch });
    
    expect(mockFetch).toHaveBeenCalledTimes(3);
});
```

Then: "Make this test pass." The test is the specification. No ambiguity about what success looks like.

**Examples as patterns.** For style changes, show one example:

```typescript
// Before: "Convert error handling to match this pattern"
if (!user) {
    throw new NotFoundError('User not found', { userId });
}

// Then the agent applies it to the rest of the file
```

**Constraints as guardrails.** Sometimes what you *don't* want matters most:
- "Don't add any external dependencies"
- "Keep the public API unchanged"
- "No more than 50 lines"

Each technique gives the agent less room to guess. Less guessing means better results.

***

## Review every diff

Even surgical changes require verification. The agent is fast, not infallible.

Common issues I catch:
- **Hallucinated methods.** It uses a library function that doesn't exist, or uses the wrong signature.
- **Subtle logic errors.** The refactoring changed behavior, not just form.
- **Pattern violations.** It solved the problem differently than the rest of the codebase.
- **Missing edge cases.** The happy path works; the null case crashes.

These aren't rare. They happen regularly, especially with less common libraries or project-specific patterns.

The agent is confident but not careful. It will produce something that looks right but isn't. Your job is to catch the difference.

***

## The speed trap

The danger of directing is that it's *fast*. A diff appears in seconds. Your brain sees familiar patterns and pattern-matches to "looks good."

I've caught myself accepting changes without actually reading them. The structure seemed right. The tests passed. Ship it.

My rule: **if I can't explain what changed and why, I don't accept it.**

This is easier with directed changes than with big features—the scope is small, the diff is contained. But "easier" doesn't mean "automatic." You still have to read it. Speed without verification isn't productivity; it's technical debt in disguise.

***

## The directing skill set

What I've gotten better at:

**1. Scoping.** Knowing what's "directed" vs what needs a bigger approach. Refactoring a function? Directed. Adding a new feature with multiple components? That needs collaborative iteration.

**2. Precision language.** Saying exactly what I mean. "Add validation" is vague. "Add zod schema validation for the email and password fields, return 400 with field-specific errors" is precise.

**3. Pattern recognition.** Scanning a 20-line diff and quickly spotting what's wrong—the hallucinated method, the missed edge case, the style violation.

**4. Iteration speed.** When the first attempt isn't right, knowing how to adjust the prompt rather than rewriting manually. "That's close, but use our AppError class instead of a raw Error."

Directing is a skill. The better you get at it, the more of your day compresses into precise, fast, verified edits.

***

## When directing isn't enough

Directing works for contained changes. But some tasks are bigger.

"Add CSV export to the analytics dashboard, following our PDF export patterns." This isn't a surgical strike—it's a multi-file feature that requires exploration, decision-making, and iteration.

That's a different mode entirely: working *with* the agent on larger problems. You set the direction, the agent explores and implements, you course-correct together. Collaborative rather than commanded.

***

*Next: Architecting with AI—how to work with agents on bigger problems, iterating toward solutions together.*
