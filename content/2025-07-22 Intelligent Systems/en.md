![](assets/thumbnail.jpg)

# Programming intelligent systems

There's a moment when AI stops being your tool and becomes your product.

For me, it happened while building a news API. The feature seemed simple: deduplicate incoming articles so users don't see the same story twice. Compare titles, check keyword overlap, compute similarity scores.

Then I hit the real problem: Is "Fed raises rates" the same story as "Federal Reserve increases interest rates amid inflation concerns"? What about "Powell announces monetary policy shift"?

No amount of string matching solves this. The stories mean the same thing but use different words. I needed the system to *understand* that these headlines describe the same event.

That's when the architecture changed. AI wasn't helping me build the feature anymore. AI *was* the feature.

***

## The hybrid architecture

![](assets/bridge-merge.jpg)

The mistake I see developers make is treating AI as either magic or dangerous. It's neither.

**Pure code** is predictable but rigid. It catches exact matches but misses semantic duplicates.

**Pure AI** is flexible but unpredictable. Inconsistent results, hallucinations, no guarantee the output fits your model.

The answer is **hybrid architecture**: code for constraints, AI for reasoning.

Here's how I think about the split:

**Code handles:**
- Data fetching and validation
- Schema enforcement
- Business rules (rate limits, permissions)
- State management (database records)
- Audit trails and logging

**AI handles:**
- Semantic understanding
- Classification with fuzzy boundaries
- Content generation
- Pattern recognition in unstructured data

Let AI do what it's good at (handling ambiguity) while code does what it's good at (enforcing rules).

***

## The sandwich pattern

![](assets/layered-cake.jpg)

Every AI call in my news API follows the same structure: **Code → AI → Code**.

Let me show you with the deduplication agent.

**Layer 1: Code (Preparation)**

Before the AI sees anything, code runs:

```typescript
// Fetch existing reports from the database
const existingReports = await this.reportRepository.findRecent({
    country: newReport.country,
    limit: 50,
});

// Format the data for the prompt
const formattedReports = existingReports.map(r => ({
    id: r.id,
    core: r.core.value,
    background: r.background.value,
}));
```

The AI doesn't query the database. It doesn't decide how many reports to compare against. Code makes those decisions.

**Layer 2: AI (Reasoning)**

The agent receives the formatted data and a clear instruction:

> "Determine whether an incoming news report describes the same underlying event as any existing report. Focus on the core event, not surface-level similarities."

The AI reasons about WHO, WHAT, WHERE, WHEN. Is "Fed raises rates" the same event as "Powell announces policy shift"? That's what I can't hardcode.

**Layer 3: Code (Validation)**

The AI's output is constrained by a schema:

```typescript
static readonly SCHEMA = z.object({
    duplicateOfReportId: z.string().nullable(),
    reason: z.string(),
});
```

The AI can't return "maybe" or "probably duplicate." It either provides a valid report ID or null. If validation fails, the system falls back to treating the article as unique. No crashes.

***

## Real agents, real constraints

The app includes a "spot the fake" game—users try to identify fabricated articles among real ones. They develop media literacy by finding the tells.

This means I need to generate convincing fake news. On purpose. That's the fabrication agent.

Here's the constraint architecture:

```typescript
static readonly SCHEMA = z.object({
    headline: headlineSchema,      // Validated headline format
    body: bodySchema,              // Length-constrained body
    category: categorySchema,      // Must be a valid category enum
    clarification: z.string(),     // Explanation for post-guess reveal
    tone: z.enum(['satirical']),   // Only allowed tone for now
});
```

The AI can be creative with content. It cannot invent categories. It cannot skip the clarification. Every output must fit my model.

The prompt includes detailed guidelines:

```
**Complete Fabrication**: Story must be 100% fictional—no real events
**Convincing Presentation**: Should fool average reader initially
**Safe Content**: Never risk real-world harm or target vulnerable groups
**Educational Value**: Demonstrate misinformation techniques clearly
```

But I don't *trust* the AI to follow these guidelines. The validation layer catches violations. The human review queue handles edge cases. The architecture assumes failure and builds in fallbacks.

***

## Testing probabilistic systems

![](assets/lab-instruments.jpg)

AI systems aren't deterministic. Run the same input twice, you might get different outputs.

This breaks traditional testing. You can't assert that `deduplicate("Fed raises rates")` always returns the same report ID. The AI might phrase its reasoning differently. The confidence might vary.

My testing strategy has three layers:

**1. Unit tests for code**

The preparation and validation layers are deterministic. Test them normally.

```typescript
test('schema rejects invalid classification', () => {
    const invalid = { classification: 'MAYBE', reason: 'unsure' };
    expect(() => ClassificationSchema.parse(invalid)).toThrow();
});
```

**2. Evals for AI**

I maintain a dataset of ~100 test cases with known correct answers. The classification agent runs against all of them, and I measure accuracy.

```
Classification accuracy: 94.2% (threshold: 90%)
Deduplication precision: 91.7% (threshold: 85%)
```

If accuracy drops below threshold after a model update or prompt change, the deploy fails.

**3. Guardrail tests**

What happens when the AI misbehaves? Test the fallbacks.

```typescript
test('falls back to unique when deduplication fails', async () => {
    // Force the AI to return invalid output
    mockModel.mockReturnValue({ invalid: 'response' });
    
    const result = await pipeline.process(newReport);
    
    // System should treat as unique, not crash
    expect(result.isDuplicate).toBe(false);
    expect(logger.warn).toHaveBeenCalled();
});
```

The system must be robust to AI failures, not just AI successes.

***

## The orchestrator mindset

Building intelligent systems requires a mental shift.

Traditional software: input X produces output Y. Always.

Intelligent systems: input X produces output Y *most of the time*. Sometimes it surprises you.

This changes how you build:

- **Validate everything**: Never trust AI output.
- **Design fallbacks**: What happens when the AI fails?
- **Log everything**: You'll need it for debugging.
- **Add human gates**: Some decisions need approval.

Your role shifts from writing logic to **orchestrating intelligence**.

***

## The series in retrospect

| Level | Mode | Your role |
|-------|------|-----------|
| 1. Assistance | AI predicts | Execute faster |
| 2. Direction | AI implements | Guide each step |
| 3. Collaboration | AI explores | Set direction, iterate |
| 4. Integration | AI reasons | Design hybrid systems |

The technology moves fast. But the principles remain constant: clear boundaries, validation layers, graceful degradation, human gates.

Build systems that use AI's strengths while compensating for its weaknesses.
