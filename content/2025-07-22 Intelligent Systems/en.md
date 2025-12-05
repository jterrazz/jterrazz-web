![](assets/thumbnail.jpg)

# Programming intelligent systems

There's a moment when AI stops being your tool and becomes your product.

For me, it happened while building a news API. The feature seemed simple: deduplicate incoming articles so users don't see the same story twice. Traditional approach: compare titles, check for keyword overlap, maybe compute a similarity score.

Then I hit the real problem: Is "Fed raises rates" the same story as "Federal Reserve increases interest rates amid inflation concerns"? What about "Powell announces monetary policy shift"?

No amount of string matching solves this. The stories are semantically identical but lexically different. I needed the system to *understand* that these headlines describe the same underlying event.

That's when the architecture changed. AI wasn't helping me build the feature anymore. AI *was* the feature.

***

## The hybrid architecture

![](assets/bridge-merge.jpg)

The mistake I see developers make: treating AI as either a magic solution or a dangerous liability. The truth is more nuanced.

**Pure code** is predictable but rigid. An if/else deduplication system would catch exact matches but miss semantic duplicates. It would fail the moment headlines used different wording.

**Pure AI** is flexible but chaotic. Send every article to an LLM and ask "is this a duplicate?" You'll get inconsistent results, hallucinated reasoning, and no guarantee the output fits your data model.

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

The goal is to let AI do what it's good at (reasoning under ambiguity) while code handles what it's good at (deterministic guarantees).

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

```typescript
// The prompt focuses AI on semantic comparison
'Determine whether an incoming news report describes the same 
underlying event as any existing report. Focus on the core event, 
not surface-level similarities.'

// The AI reasons about WHO, WHAT, WHERE, WHEN
// Is "Fed raises rates" the same event as "Powell announces policy shift"?
```

The AI does what I can't hardcode: understand that two differently-worded headlines describe the same real-world event.

**Layer 3: Code (Validation)**

The AI's output is constrained by a schema:

```typescript
static readonly SCHEMA = z.object({
    duplicateOfReportId: z.string().nullable(),
    reason: z.string(),
});
```

The AI can't return "maybe" or "probably duplicate" or any structure I didn't anticipate. It either provides a valid report ID or null. The Zod schema enforces this at runtime.

If validation fails, the system logs the error and falls back to treating the article as unique. No crashes. No undefined behavior.

***

## Real agents, real constraints

Let me show you another agent from the same system—the fabrication agent. Yes, I generate *fake* news articles. On purpose.

The app includes a "spot the fake" game where users try to identify fabricated articles among real ones. The AI generates convincing-but-fictional stories, and users develop media literacy by finding the tells.

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

The AI can be creative with content. It cannot invent categories. It cannot skip the clarification. It cannot output anything that doesn't fit my domain model.

The prompt includes detailed guidelines:

```
**Complete Fabrication**: Story must be 100% fictional—no real events
**Convincing Presentation**: Should fool average reader initially
**Safe Content**: Never risk real-world harm or target vulnerable groups
**Educational Value**: Demonstrate misinformation techniques clearly
```

But I don't *trust* the AI to follow these guidelines. The validation layer catches violations. The human review queue exists for edge cases. The architecture assumes the AI will sometimes fail, and builds in fallbacks.

***

## Testing probabilistic systems

![](assets/lab-instruments.jpg)

Here's the uncomfortable truth about AI systems: they're not deterministic. Run the same input twice, you might get different outputs.

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

Building intelligent systems requires a mental model shift.

Traditional software: components are logical. Given input X, they produce output Y. Always.

Intelligent systems: some components are probabilistic. Given input X, they produce output Y *most of the time*. Sometimes they surprise you.

This changes how you architect:

- **Validation everywhere**: Never trust AI output. Always validate against schemas.
- **Fallbacks as first-class citizens**: What happens when the AI fails? Design that path explicitly.
- **Observability**: Log AI inputs and outputs. You'll need them for debugging.
- **Human gates**: Some decisions need human approval, even if AI could make them.

Your role shifts from writing logic to **orchestrating intelligence**. You're the designer of boundaries—ensuring the AI's reasoning creates value without creating chaos.

***

## The series in retrospect

We've covered four levels of AI integration:

- **1. Assistance**: Predicts your next keystroke — Execute with acceleration
- **2. Delegation**: Implements your specification — Direct and review
- **3. Autonomy**: Operates on triggers without you — Architect systems and trust
- **4. Integration**: Becomes part of the product — Design hybrid architectures

Most of my daily work lives at Levels 1 and 2. Copilot handles syntax; Claude handles boilerplate features. Level 3 runs in the background, keeping my projects healthy. Level 4 appears when I'm building products that genuinely need intelligence as a feature.

The Jarvis fantasy from the first article wasn't wrong—it was just one point on a spectrum. The real superpower isn't having an AI assistant. It's knowing which *type* of AI assistance the moment requires.

The technology moves fast. New models every few months. New capabilities every few weeks. But the fundamental principles—clear boundaries, validation layers, graceful degradation, human gates—remain constant.

Build systems that use AI's strengths while compensating for its weaknesses. That's the engineering challenge of this era. And honestly? It's a pretty exciting one to have.
