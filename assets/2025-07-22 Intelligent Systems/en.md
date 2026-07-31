![](assets/thumbnail.jpg)

# When AI becomes the product

There is a moment when AI stops being your assistant and starts being your architecture.

For me, it happened while building a news aggregation API. The feature seemed straightforward: deduplicate incoming articles. Compare titles, check keyword overlap. Standard engineering.

Then I hit the wall. Is *"Fed raises rates"* the same story as *"Federal Reserve increases interest rates amid inflation concerns"*? What about *"Powell signals hawkish monetary stance"*?

The headlines share almost no words, yet they describe the same underlying reality. No amount of string matching solves this. The problem requires *understanding*.

That was when the architecture changed. AI wasn't helping me build the feature anymore. **AI was the feature.**

This shift—from AI as a tool to AI as a component—requires a different way of thinking. Traditional engineering intuitions break down. New patterns emerge.

---

## The trap of pure approaches

Most developers fall into one of two traps when integrating AI:

1.  **The Magic Trap:** Treat AI as a black box that solves everything. Pipe in data, get answers. This works until the model hallucinates or returns unparseable JSON.
2.  **The Fear Trap:** Treat AI as too unreliable to trust. Wrap it in so many layers that it rarely executes.

Both traps stem from treating AI as absolute. The reality is nuanced. AI is **reliably good at some things** (semantic understanding, fuzzy classification) and **unreliably bad at others** (precision, math, strict adherence to rules).

---

## The hybrid principle

![](assets/bridge-merge.jpg)

The solution is **Hybrid Architecture**: code for constraints, AI for reasoning.

*   **Code** is deterministic, verifiable, fast, and precise.
*   **AI** is flexible, semantic, creative, and fuzzy.

The division of labor becomes clear:
*   **Give to Code:** Data fetching, schema validation, business rules, state management.
*   **Give to AI:** Semantic understanding, fuzzy classification, content generation, summarization.

**Code protects invariants. AI handles ambiguity.**

---

## The sandwich pattern

![](assets/layered-cake.jpg)

Every AI call in my system follows the same structure: **Code → AI → Code**.

I call it the **Sandwich Pattern**. Code prepares the input, AI reasons over it, code validates the output. The AI's flexibility is contained entirely within code's constraints.

### Layer 1: preparation (code)
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

Code controls **what** data the AI sees, **how much**, and in **what format**. The AI receives a curated view.

### Layer 2: reasoning (AI)
The AI receives the formatted data and a clear instruction:
> "Determine whether the incoming news report describes the same underlying event as any existing report. Focus on the core event—who did what, when, where."

This is the task I cannot hardcode. The AI reasons about semantic equivalence.

### Layer 3: validation (code)
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

The AI cannot return "maybe" or invent new states. If validation fails, the system falls back gracefully. The sandwich ensures AI's flexibility operates strictly within code's constraints.

---

## A real example: the fabrication agent

My news app includes a "spot the fake" game. I need an agent to generate convincing fake news.

**Preparation:** Code selects a real article for style inspiration and sets the difficulty level.
```typescript
const prompt = buildFabricationPrompt({
    inspiration: realArticle,
    targetCategory: 'technology',
    difficulty: 'medium',
});
```

**Reasoning:** The AI generates the fake article.

**Validation:**
```typescript
const FabricatedArticle = z.object({
    headline: z.string().min(10).max(100),
    body: z.string().min(200).max(2000),
    tone: z.enum(['satirical']),
});
```
But schema validation isn't enough for content safety.
```typescript
const safetyResult = await this.safetyChecker.analyze(article);
if (safetyResult.flagged) {
    return this.sendToHumanReview(article);
}
```
Some content goes to a human review queue. The architecture assumes AI will occasionally produce something problematic and builds in the gate.

---

## Testing probabilistic systems

![](assets/lab-instruments.jpg)

Traditional testing assumes determinism: given input X, expect output Y. AI breaks this.

This requires a three-layer testing strategy:

1.  **Unit Tests for Code:** The preparation and validation layers are deterministic. Test them normally.
2.  **Evals for AI:** Maintain a dataset of test cases with known correct answers. Run the AI against all of them and measure accuracy. If accuracy drops below a threshold (e.g., 90%), the deploy fails.
3.  **Guardrail Tests:** Test what happens when the AI misbehaves.
    ```typescript
    test('gracefully handles malformed AI response', async () => {
        mockModel.mockReturnValue({ invalid: 'garbage' });
        const result = await pipeline.process(newReport);
        expect(result.fallbackUsed).toBe(true);
    });
    ```

The system must be robust to AI failures, not just AI successes.

---

## The orchestrator mindset

Building systems with AI components requires a mental shift from writing logic to **orchestrating behavior**.

You define constraints and goals. The AI figures out how to achieve them. Your job is ensuring it stays within bounds.

**Principles of the Orchestrator:**
1.  **Validate Everything:** Never trust AI output.
2.  **Design Fallbacks:** Every AI call should have a graceful degradation path.
3.  **Log Extensively:** Logs are your only window into the "black box."
4.  **Expect Drift:** AI behavior changes over time. Monitor continuously.

AI gives you capabilities that were impossible before. Semantic understanding. Fuzzy classification. The tradeoff is unpredictability.

Good architecture makes that tradeoff worthwhile. You get the capabilities. You contain the unpredictability. Let code do code's job. Let AI do AI's job. Design the boundaries with care.

