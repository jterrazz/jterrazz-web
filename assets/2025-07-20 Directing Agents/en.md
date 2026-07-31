![](./assets/thumbnail.jpg)

# The art of directing AI

There is a mode of working with AI that sits between the passivity of autocomplete and the delegation of full autonomy. You select code, describe a desired state, and the AI executes the transformation. It isn't predicting your next keystroke; it is rewriting logic based on your intent.

I call this **Directing**. You specify the transformation, the AI performs it, and you verify the result. This behavior is typical of models like **Claude Haiku 4.5** or **Sonnet 4.5**—fast, precise, and optimized for low-latency instruction following.

On the surface, it seems trivial. Select, describe, accept. A glorified find-and-replace. But when I first started, "Make this better" produced chaos. "Add error handling" introduced the wrong abstractions. The AI was doing exactly what I asked—I just wasn't asking with enough precision.

Directing is a skill. Developers who master it compress hours of work into minutes. Those who don't simply generate bugs faster than they can fix them.

---

## What directing actually compresses

![](assets/split-thread.jpg)

Every code change consists of two distinct acts: the **decision** and the **transcription**.

The **decision** is the intellectual spark. *"This function needs null checks."* *"These callbacks should be async/await."* The **transcription** is the mechanical labor: locating references, typing syntax, balancing brackets.

**Directing compresses the transcription. The decision remains yours.**

This distinction defines the boundary of trust. You are not outsourcing your judgment; you are outsourcing your keyboard. The architecture, the edge cases, the question of *"should we even do this?"*—that remains your responsibility.

---

## The precision hierarchy

![](assets/architect-table.jpg)

Vague input produces garbage. Precise input produces production-ready code. Precision isn't just about verbosity—it's about choosing the right *mechanism* of specification.

### Level 1: constraints
Sometimes the most critical instruction isn't what you want—it's what you *don't* want.

*   "Do not add external dependencies."
*   "Keep the public API unchanged."
*   "Do not modify the database schema."

Constraints are essential when you trust the AI's implementation details but need to enforce boundaries. They act as guardrails, not blueprints.

### Level 2: patterns
Don't describe the style. Show it.

```typescript
// Current error handling:
if (error) {
    console.log(error);
    return null;
}

// Transform to this pattern:
if (error) {
    logger.error('Operation failed', { error, context: operationName });
    throw new AppError('OPERATION_FAILED', { cause: error });
}

// Instruction: Apply this pattern to all error handlers in this file.
```

The AI doesn't have to guess your coding conventions. It sees them. Pattern-based prompts consistently outperform abstract descriptions.

### Level 3: contracts
The ultimate form of precision is a specification that is machine-verifiable: a test.

```typescript
test('retries failed requests with exponential backoff', async () => {
    const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce({ ok: true, data: 'success' });
    
    const result = await fetchWithRetry('/api/data', { 
        fetch: mockFetch,
        maxRetries: 3,
        baseDelay: 100 
    });
    
    expect(mockFetch).toHaveBeenCalledTimes(3);
});
```

The instruction: *"Make this test pass."* There is no ambiguity. The AI cannot misinterpret success because success is defined by the test runner.

---

## The verification discipline

Precision gets you 80% of the way there. The remaining 20% is verification.

The AI is confident, not careful. It produces code that *looks* right with the same fluency that it produces code that *is* right. Your job is to tell the difference.

### Common failure modes

**1. Hallucinated APIs**
The AI invents methods that don't exist or uses the wrong signatures. This is endemic with less common libraries.
```typescript
// AI wrote:
await redis.setWithExpiry(key, value, 3600);
// Actually exists:
await redis.set(key, value, { EX: 3600 });
```

**2. Semantic Drift**
The refactoring changes behavior, not just structure. The code looks equivalent but handles edge cases differently.
```typescript
// Original:
const result = items.find(x => x.id === id) || defaultItem;
// "Refactored":
const result = items.find(x => x.id === id) ?? defaultItem;
```
These behave differently when `find()` returns a falsy item.

**3. Pattern Violations**
The AI solves the problem correctly but violates local conventions (e.g., using a raw `Error` instead of your custom `AppError`).

**4. Missed Edge Cases**
The happy path works perfectly. Null inputs crash the system. Empty arrays throw exceptions. The AI optimizes for the common case.

### The verification checklist
Before accepting any directed change:
1.  **Read the Diff:** Every line. If it's too large to read, use collaboration instead.
2.  **Check Boundaries:** What happens with null? Empty sets?
3.  **Run the Tests:** Obvious, yet easily skipped.
4.  **Explain it to Yourself:** If you can't articulate what changed and why, you don't understand it well enough to ship it.

---

## The speed trap

Direction is fast. Dangerously fast.

A diff appears in two seconds. Your brain pattern-matches against familiar structures. *"Looks like standard error handling. Ship it."*

I have done this. I have shipped code that worked in dev but failed in prod because I missed an edge case the AI also missed. I call this **Approval Fatigue**. When every change takes seconds, your review discipline erodes.

My rule: **The faster the change, the slower the review.**

A two-second generation deserves a two-minute review. The cost of finding bugs in production far exceeds the cost of careful verification now.

---

## Developing the instinct

After a year of daily practice, I’ve developed instincts for effective direction.

### Scoping
Not every task belongs in a directed change.
*   **Good for Direction:** Single-function changes, clear transformations, refactoring within a file, diffs <100 lines.
*   **Bad for Direction:** Multi-file features, architectural decisions, exploration.

If I catch myself writing a long, multi-step prompt, that is a signal. Direction is for surgical strikes, not military campaigns.

### Prompt iteration
The first prompt rarely produces the perfect result. Knowing *how* to iterate matters more than getting it right the first time.

*   **Narrow, Don't Restart:** *"That's close, but use our `AppError` class"* is better than rewriting the initial prompt.
*   **Add Constraints Incrementally:** If the output drifts, add a constraint to pin it down. *"Same thing, but keep the function under 30 lines."*
*   **Show What's Wrong:** *"The retry logic looks correct, but the delay calculation is linear, not exponential."*

### Pattern recognition
After reviewing hundreds of AI-generated diffs, I scan for specific red flags:
*   **Unusual Imports:** Possible hallucinated dependencies.
*   **Complex One-Liners:** High risk of semantic drift.
*   **Missing Error Handling:** Edge cases likely ignored.
*   **Magic Numbers:** Constants that should be configurable.

Speed in review comes from knowing *where* to look, not looking faster.

### The compound effect

Every precisely specified change sharpens your ability to articulate intent. Every caught mistake refines your mental linter.

After a year of practice, I direct changes in seconds that would have taken minutes to type—and I catch problems before they ship. The goal isn't just to accept changes faster. It is to develop the judgment that makes fast verification reliable. That judgment is the difference between an AI that accelerates you and an AI that generates technical debt.

