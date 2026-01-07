![](assets/thumbnail.jpg)

# When AI Becomes the Product

There is a moment when AI stops being your assistant and starts being your architecture.

For me, it happened while building a news aggregation API. The feature seemed straightforward: deduplicate incoming articles. Users shouldn't see the same story twice. Compare titles, check keyword overlap, compute similarity scores. Standard engineering.

Then I hit the wall.

Is *"Fed raises rates"* the same story as *"Federal Reserve increases interest rates amid inflation concerns"*? What about *"Powell signals hawkish monetary stance"*?

The headlines share almost no words, yet they describe the same underlying reality.

No amount of string matching solves this. No edit distance calculation. The problem requires *understanding*.

That was when the architecture changed. AI wasn't helping me build the feature anymore. **AI was the feature.**

This shift—from AI as a tool to AI as a component—requires a different way of thinking about software. Traditional engineering intuitions break down. New patterns emerge. This article is about those patterns.

---

## The Trap of Pure Approaches

Most developers I speak with fall into one of two traps when integrating AI.

**The Magic Trap**
Treat AI as a black box that solves everything. Pipe in data, get answers. Don't worry about edge cases—the model will figure it out. This works until the model hallucinates a category that doesn't exist in your database, returns unparseable JSON, or confidently produces false information.

**The Fear Trap**
Treat AI as too unreliable to trust. Wrap it in so many validation layers that latency becomes unusable. Add so many fallbacks that the AI path rarely executes. Build immense complexity to hedge against a problem that thoughtful architecture could prevent.

Both traps stem from the same misunderstanding: treating AI as either reliable or unreliable in absolute terms.

The reality is nuanced. AI is **reliably good at some things** and **unreliably bad at others**. The architecture must reflect this profile.

---

## The Hybrid Principle

![](assets/bridge-merge.jpg)

The solution is **Hybrid Architecture**: code for constraints, AI for reasoning.

This isn't a compromise—it is playing to each system's strengths.

**Code is:**
*   **Deterministic:** Same input, same output.
*   **Verifiable:** You can prove correctness.
*   **Fast:** Nanoseconds, not seconds.
*   **Precise:** Exact rules, exact enforcement.

**AI is:**
*   **Flexible:** Handles cases you didn't anticipate.
*   **Semantic:** Understands meaning, not just syntax.
*   **Creative:** Generates content, finds patterns.
*   **Fuzzy:** Thrives on ambiguity.

The division of labor becomes clear:

| Give to Code | Give to AI |
|--------------|------------|
| Data fetching | Semantic understanding |
| Schema validation | Fuzzy classification |
| Business rules | Content generation |
| State management | Pattern recognition |
| Rate limiting | Summarization |
| Audit logging | Sentiment analysis |

**Code protects invariants. AI handles ambiguity.**

When you let code do what code does best and AI do what AI does best, the system becomes both reliable and capable—more than either could achieve alone.

---

## The Sandwich Pattern

![](assets/layered-cake.jpg)

Every AI call in my system follows the same structure: **Code → AI → Code**.

I call it the **Sandwich Pattern**. Code prepares the input, AI reasons over it, code validates the output. The AI's flexibility is contained entirely within code's constraints.

### Layer 1: Preparation (Code)
Before the AI sees anything, code runs:

```typescript
const existingReports = await this.reportRepository.findRecent({
    country: newReport.country,
    limit: 50,
});

const formattedReports = existingReports.map(r => ({
    id: r.id,
    core: r.core.value,
    background: r.background.value,
}));

const prompt = buildDeduplicationPrompt(newReport, formattedReports);
```

Notice what code controls:
*   **What data the AI sees:** It fetches from the database—AI never touches persistence directly.
*   **How much data:** The `limit: 50` is a code decision, not an AI judgment call.
*   **Format:** The AI receives structured, sanitized data.
*   **The Prompt:** Code constructs it, ensuring consistency.

The AI doesn't decide what to look at. It receives a curated view.

### Layer 2: Reasoning (AI)
The AI receives formatted data and a clear instruction:

> "Determine whether the incoming news report describes the same underlying event as any existing report. Focus on the core event—who did what, when, where—not surface-level similarities in wording."

This is the task I cannot hardcode. The AI reasons about semantic equivalence, considering the underlying reality rather than word overlap.

### Layer 3: Validation (Code)
The AI's output is constrained by a schema:

```typescript
const DeduplicationResult = z.object({
    duplicateOfReportId: z.string().uuid().nullable(),
    reason: z.string().max(500),
    confidence: z.enum(['high', 'medium', 'low']),
});

const parsed = DeduplicationResult.safeParse(aiResponse);

if (!parsed.success) {
    logger.warn('AI returned invalid response', { error: parsed.error });
    return { isDuplicate: false, reason: 'Validation failed' };
}
```

The AI cannot:
*   Return "maybe" or invent new states.
*   Provide an invalid UUID format.
*   Skip required fields.
*   Return unbounded text.

If validation fails, the system doesn't crash—it falls back gracefully. The article is treated as unique, a warning is logged, and the pipeline continues.

**The sandwich ensures AI's flexibility operates strictly within code's constraints.**

---

## A Real Example: The Fabrication Agent

Theory is clean. Let me show you a messier example.

My news app includes a "spot the fake" game. Users see articles—some real, some fabricated—and try to identify the fakes. The goal is building media literacy.

This means I need an AI agent that generates convincing fake news. On purpose.

Here is how the sandwich pattern handles this:

**Preparation:**
```typescript
const realArticle = await this.articleRepository.findRecent({ limit: 1 });

const prompt = buildFabricationPrompt({
    inspiration: realArticle,  // Style reference, not content to copy
    targetCategory: 'technology',
    difficulty: 'medium',
});
```
Code controls the stylistic inspiration, the category, and the difficulty level.

**Reasoning:**
The AI generates a fabricated article with a plausible headline, convincing body text, and subtle tells.

**Validation:**
```typescript
const FabricatedArticle = z.object({
    headline: z.string().min(10).max(100),
    body: z.string().min(200).max(2000),
    category: z.enum(['technology', 'business', 'politics', 'science']),
    tells: z.array(z.string()).min(1).max(5),
    clarification: z.string().min(50),
    tone: z.enum(['satirical']),  // Only allowed tone for now
});
```
But schema validation isn't enough for this use case. The content could be valid structurally but harmful substantively. So there's an additional layer:

```typescript
// Automated safety checks
const safetyResult = await this.safetyChecker.analyze(article);
if (safetyResult.flagged) {
    logger.warn('Fabricated article flagged for safety review', { article, flags: safetyResult.flags });
    return this.sendToHumanReview(article);
}
```
Some content goes to a human review queue. The architecture assumes AI will occasionally produce something problematic and builds in the gate.

---

## Testing Probabilistic Systems

![](assets/lab-instruments.jpg)

Traditional testing assumes determinism: given input X, expect output Y. Always.

AI breaks this. The same input might produce different outputs across runs. The output format is consistent (we enforce that), but the content varies.

This requires a three-layer testing strategy:

### Layer 1: Unit Tests for Code
The preparation and validation layers are deterministic. Test them normally.

```typescript
test('schema rejects invalid classification', () => {
    const invalid = { classification: 'MAYBE', reason: 'unsure' };
    expect(() => ClassificationSchema.parse(invalid)).toThrow();
});
```

### Layer 2: Evals for AI
Maintain a dataset of test cases with known correct answers. Run the AI against all of them and measure accuracy.

```
Dataset: 100 article pairs with human-labeled duplicate status
Deduplication precision: 94.2%
Deduplication recall: 91.8%
Threshold: 90% precision, 85% recall
```

If accuracy drops below threshold, the deploy fails. This catches regressions before they reach users.

### Layer 3: Guardrail Tests
Test what happens when the AI misbehaves.

```typescript
test('gracefully handles malformed AI response', async () => {
    mockModel.mockReturnValue({ invalid: 'garbage' });
    
    const result = await pipeline.process(newReport);
    
    expect(result.isDuplicate).toBe(false);
    expect(result.fallbackUsed).toBe(true);
    expect(logger.warn).toHaveBeenCalled();
});
```

The system must be robust to AI failures, not just AI successes.

---

## The Orchestrator Mindset

Building systems with AI components requires a mental shift.

Traditional software engineering is about writing logic. You define exact transformations: *if this, then that*. The code does what you tell it.

Intelligent systems are about **orchestrating behavior**. You define constraints and goals. The AI figures out how to achieve them. Your job is ensuring it stays within bounds.

This changes the questions you ask:

| Traditional | Intelligent |
|-------------|-------------|
| What should this function return? | What range of outputs is acceptable? |
| How do I handle this edge case? | What fallback should I use when AI fails? |
| Is this code correct? | Is this output within constraints? |
| What's the test assertion? | What's the accuracy threshold? |

**Principles of the Orchestrator:**
1.  **Validate Everything:** Never trust AI output.
2.  **Design Fallbacks:** Every AI call should have a graceful degradation path.
3.  **Log Extensively:** Logs are your only window into the "black box."
4.  **Add Human Gates:** Some decisions shouldn't be fully automated.
5.  **Expect Drift:** AI behavior changes over time. Monitor continuously.

---

## The Architecture That Emerges

After building several AI-integrated systems, a consistent architecture has emerged:

```
┌─────────────────────────────────────────────────┐
│                   Request                       │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Preparation (Code)                 │
│  - Fetch data                                   │
│  - Format for AI                                │
│  - Build prompt                                 │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Reasoning (AI)                     │
│  - Process input                                │
│  - Generate output                              │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Validation (Code)                  │
│  - Parse response                               │
│  - Check schema                                 │
│  - Enforce constraints                          │
└─────────────────┬───────────────────────────────┘
                  │
          ┌───────┴───────┐
          │               │
     Valid│          Invalid
          │               │
┌─────────▼─────┐   ┌─────▼─────────┐
│   Continue    │   │   Fallback    │
│   processing  │   │   + logging   │
└───────────────┘   └───────────────┘
```

The AI is never autonomous. It operates within guardrails. It is powerful precisely *because* we constrain where it can fail.

---

## The Shift

Building intelligent systems isn't harder than traditional software—it is different.

You are writing less logic and more structure. Less *"if this then that"* and more *"within these bounds, figure it out."*

The skill isn't making AI work. It is knowing where to let it work and where to constrain it. The **Hybrid Principle**. The **Sandwich Pattern**. The **Three-Layer Testing Strategy**. The **Orchestrator Mindset**.

AI gives you capabilities that were impossible to build before. Semantic understanding. Fuzzy classification. Content generation. The tradeoff is unpredictability.

Good architecture makes that tradeoff worthwhile. You get the capabilities. You contain the unpredictability. You build systems that are both intelligent and reliable.

That is the goal: harness what AI is good at while protecting against what it is bad at. Let code do code's job. Let AI do AI's job. Design the boundaries with care.

