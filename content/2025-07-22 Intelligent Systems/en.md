![](assets/thumbnail.jpg)

# Programming intelligent systems

**Intelligent systems** represent a fundamental shift. In previous approaches, AI is a tool that helps _you_ build software. Here, AI becomes a component of the software _itself_.

You are no longer just writing code; you are architecting systems that combine **deterministic logic** (traditional code) with **probabilistic reasoning** (AI).

Consider a modern customer support bot.

- A **pure code** approach (if/else statements) is safe but rigid. It breaks whenever a user asks a question that doesn't fit the pre-defined script.
- A **pure AI** approach is flexible but risky. It might invent a refund policy that doesn't exist or promise things it can't deliver.

The **hybrid architecture** addresses this. It uses code for constraints and AI for flexibility.

---

## The Hybrid Architecture

![](assets/bridge-merge.jpg)

The core principle is **Separation of Responsibilities**.

**Code handles constraints:**

- Business logic (pricing, refunds).
- Permissions and security (who can see what).
- State management (database records).
- Audit trails.

**AI handles ambiguity:**

- Understanding user intent from natural language.
- Summarizing complex data.
- Generating personalized explanations.
- Transforming unstructured data (emails, images) into structured data.

The goal is to build a "sandwich": Code prepares the context, AI performs the reasoning task, and Code validates the output.

---

## The "Sandwich" Pattern

![](assets/layered-cake.jpg)

Let's apply this to the support bot example.

**Layer 1: Code (Preparation)**
When a user asks about a refund, the system doesn't just send the query to an LLM. First, traditional code runs:

- Is the user logged in?
- Fetch their recent orders from the database.
- Fetch the official refund policy document.
- _Construct a prompt_ that includes this specific data.

**Layer 2: AI (Reasoning)**
The model receives the user's question along with the _facts_ provided by Layer 1. It is instructed: "Answer the user based _only_ on the provided policy and order history." The AI generates a response.

**Layer 3: Code (Validation)**
Before showing the response to the user, traditional code runs again:

- Does the response contain prohibited words?
- Does it attempt to execute a tool call (like `refund_user`)? If so, enforce limits (e.g., "Max refund $50 without human approval").

This architecture allows the system to be conversational and helpful (AI) while remaining safe and compliant (Code).

---

## Testing probabilistic systems

![](assets/lab-instruments.jpg)

Testing hybrid systems requires a mindset shift. Traditional software is binary: a test passes or fails. AI systems are probabilistic: they are "mostly right."

Testing strategy involves:

1. **Unit Tests for Code:** The constraints and data fetching logic must be 100% correct.
2. **Evals for AI:** You run the model against a dataset of 100 example questions and grade the answers. You accept the system if it scores above a threshold (e.g., 95% accuracy).
3. **Guardrails:** You test the safety mechanisms. What happens if the AI tries to hallucinate? The validation layer must catch it.

---

## The future of software

We are moving toward a world where most complex applications will be hybrids.

- Legal apps will use AI to read contracts, but code to calculate deadlines.
- Medical apps will use AI to analyze symptoms, but code to check drug interactions.
- Finance apps will use AI to summarize market news, but code to execute trades.

The role of the engineer evolves from writing logic to **orchestrating intelligence**. You become the designer of the boundaries, ensuring that the "magic" of AI creates value without creating chaos.

---

This concludes our series on the Four Levels of AI Integration. From the **Predictive Accelerator**, to the **Director**, to the **Architect** of autonomous agents, and finally to the **Systems Designer** of hybrid applications.

The technology is moving fast, but the fundamental engineering principles—modularity, safety, and clear specification—remain more important than ever.

---

1. [The four levels of AI integration](https://jterrazz.com/articles/20-the-four-levels-of-ai)
2. [Directing AI agents](https://jterrazz.com/articles/21-guided-ai-for-developers)
3. [Autonomous AI agents](https://jterrazz.com/articles/22-autonomous-ai-agents)
4. [**Programming intelligent systems**](https://jterrazz.com/articles/23-programming-intelligence)
