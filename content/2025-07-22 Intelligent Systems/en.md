![](assets/thumbnail.jpg)

# AI in development, level 4: Programming intelligence itself

Alright, we've arrived at the final post in this series on AI in software development. We've journeyed from AI as a simple **Assistant (Level 1)**, to a **Guided Agent (Level 2)**, and then to a powerful **Autonomous Agent (Level 3)**. If you're just joining us, I highly recommend starting with the [first article](https://www.jterrazz.com/articles/20-the-four-levels-of-ai), which lays the foundation for this entire framework.

Today, we're at the summit: **Level 4, Programmable Intelligence**. This is the part that, for me, changes the game entirely. We move beyond just *using* AI and start to program the *nature of its reasoning*.

Forget development for a second. The general idea is to plug "bricks of intelligence" into any workflow to build systems that can handle real-world ambiguity. Imagine an AI financial advisor that doesn't just execute trades based on rules but actually interprets the nuances of market sentiment. That's the kind of power we're talking about.

For developers, this is the ultimate creative shift. You're no longer writing rigid, step-by-step algorithms. You're designing intelligent agents that can reason, improvise, and orchestrate workflows too complex and unpredictable to manage otherwise. This is how you automate the things that once seemed impossible—creating systems that learn, adapt, and optimize themselves on the fly.

Let's dive into the mindset, the tools, and a concrete example of what it means to become an architect of intelligence.

***

![](assets/bricks.jpg)

## **The mindset shift: From code architect to AI choreographer**

At Level 4, your job becomes a balancing act. You're choreographing a dance between two forces: **determinism** (the predictable world of code, logic, and rules) and **non-determinism** (the creative, sometimes fuzzy world of AI reasoning). As NVIDIA's CEO Jensen Huang has said, the future of software isn't just about writing code; it's about building intelligent systems that can navigate ambiguity and find solutions we can't explicitly program.

You're the one who has to find that perfect harmony.

- **The Power:** The upside is massive. You can build systems that solve problems too sprawling for a single human mind to track. Think of a codebase that spots emergent bugs *before* they crash production, or a deployment pipeline that intelligently reroutes itself around an unexpected cloud outage. You're building systems that can handle the messiness of reality.
- **The Pitfall:** But here's the catch: the balance is delicate. Too much rigid structure, and you suffocate the AI's ability to solve problems creatively. Too much freedom, and you get unreliable chaos. This isn't about becoming a "vibe coder" who just wings it. It's about being a master choreographer who knows exactly when to give the AI strict instructions and when to let it improvise.

In my own work, this has meant modeling the complexity of a problem by giving my AI agents a "personality"—a set of guiding principles—while making sure they're still grounded in the solid, deterministic foundation of my core business logic.

## **The tools for programming intelligence**

To operate at this level, I've found you need tools that are less about writing code and more about orchestrating intelligence.

- **OpenRouter:** Think of this as an intelligent traffic cop for AI models. Instead of hard-coding your app to a single model like GPT-4o or Claude 3.5 Sonnet, OpenRouter lets you route each request to the *best* model for that specific job, in real time. Need deep, logical reasoning for generating code? It can send the request to a high-powered model. Just need a quick, cheap summary of some text? It can route to a smaller, faster one. This lets you build incredibly sophisticated and cost-effective AI systems without getting locked into one vendor.
- **LMArena:** This is the ultimate sparring ring for AIs. It's a platform where you can pit models against each other on your specific tasks to see which one actually performs best. Before I build a new intelligent agent, I often use the Arena to "audition" the available models. It's a practical, data-driven way to make sure you're choosing the most capable AI for each role in your workflow.

The glue holding all this together is usually a language like Python, with frameworks like **LangChain** or **LlamaIndex**. They provide the plumbing to "chain" different models and data sources together, creating what are essentially sophisticated pipelines of thought.

## **Use case in action: The self-healing code pipeline**

Let's make this concrete. We can adapt our "news agency" analogy from the last article into a fully automated development pipeline—a system that monitors, diagnoses, fixes, and verifies code with almost no human oversight.

Here's how I would build it using these "bricks" of programmable intelligence:

**Step 1: The watcher (intelligent detection)**
First, a "Watcher" agent constantly monitors all inputs: new commits pushed to Git, error logs streaming from production, and performance metrics. It's not just programmed to spot an error; its job is to *interpret ambiguity*. Is a spike in 404s just a nuisance, or is it a sign of a critical, system-wide failure? It uses its core programming (and maybe some of the MCP techniques from Level 3) to pull in external context and make an informed judgment call.

**Step 2: The creator (intelligent generation)**
Once the watcher identifies a real problem, it passes it to a "Creator" agent. This is where the personality comes in. I might program this agent to be a "clean code zealot." Its core directive isn't just to fix the bug, but to do so in a way that is perfectly formatted, well-documented, and includes robust unit tests. It then generates the new code to solve the problem according to its principles.

**Step 3: The guardian (intelligent verification)**
The proposed fix is then handed off to a "Guardian" agent. This is where that dance between strict rules and creative thinking really happens. The guardian runs all the deterministic checks we'd expect (like linters and our existing test suite). But it *also* uses its non-deterministic intelligence to look for weird edge cases a human might miss. It thinks, "What if a user pastes an emoji into this form? What if this API returns a null value?" It validates the fix from every angle in a secure sandbox.

**Step 4: The deliverer (automated output)**
Once the fix is fully validated, the final agent in the pipeline generates a clean, clear pull request. It includes a summary of the original problem, the proposed solution, and a log of all the tests it passed. At this point, human review is the final, optional gate before hitting merge.

The result is a dynamic, self-optimizing system that doesn't just speed up my work—it multiplies my output. This same pattern can be applied to almost any complex workflow, from migrating an entire tech stack to continuously optimizing a CI/CD pipeline for cost and speed.

## **The hard parts (and how to solve them)**

Operating at this level introduces some unique challenges, but I've found they're all solvable puzzles.

- **The problem: Testing an unpredictable system.** How do you write a test for something that's designed to be creative?
    - **My take:** You shift your focus. Instead of testing the *process*, you evaluate the *quality of the outcome*. Frameworks like **LangSmith** are emerging for this. You define metrics—like relevance, correctness, or adherence to a specific style—and test whether the AI's output meets that bar.
- **The problem: Local development is tough.** The best models are massive and live in the cloud as APIs.
    - **My take:** A hybrid model is the pragmatic answer. I use locally-hosted open-source models (like Llama 3 running via **Ollama**) for most of my development, testing, and non-critical tasks. It's fast and free. Then, for the heavy-lifting production workloads that need maximum power, the system calls out to the best-in-class cloud APIs. It's just smart engineering.
- **The problem: Cost and complexity.** These systems can get expensive and complicated, fast.
    - **My take:** Start small. Seriously. I didn't build my most complex systems overnight. I started by automating one small, annoying part of my workflow. Once that worked, I added another piece. Use tools like OpenRouter to be smart about costs, routing simple tasks to cheap models. The complexity is manageable if you build incrementally.

## **The grand conclusion: where we go from here**

With programmable intelligence, our journey comes full circle. We've moved from simple **Assistants (Level 1)** that sharpen our tools to fully **Programmable Systems (Level 4)** that amplify our intellect. In my day-to-day work, this has completely changed the game. I no longer just write code; I design and orchestrate intelligent systems that let me operate at a scale I never thought possible.

The pace of AI improvement is staggering—some people estimate a 10x jump in capability every single year. This isn't a wave you can just wait out or ignore.

The four levels we've discussed are a map for navigating this new reality, not just for developers but for anyone in any field. The goal is to keep climbing that ladder—to move from being a passive user of AI to an active architect. Don't be an improvised "vibe coder." Be a deliberate choreographer of intelligence.

> AI will not automate developers out of existence. It will elevate the ones who learn to become architects of intelligence. The future of our craft is not about writing code by hand; it's about building worlds.

Thanks for coming along for the ride. The adventure is really just beginning.

---

1. [**The Four Levels of AI: How to Ride the Wave and Amplify Your Potential**](https://jterrazz.com/articles/20-the-four-levels-of-ai) *A practical framework for integrating AI into any field, from assistant to programmable intelligence, empowering you to supercharge your work and creativity.*
2. [**AI in Development, Level 2: From Coder to Conductor**](https://jterrazz.com/articles/21-guided-ai-for-developers) *A guide for developers to direct AI as a guided agent, transforming coding into high-level orchestration with tools like Cursor and intention-driven development.*
3. [**AI in Development, Level 3: The Rise of the Autonomous Agent**](https://jterrazz.com/articles/22-autonomous-ai-agents) *Exploring how developers can delegate entire workflows to autonomous AI agents, leveraging model-centric protocols and sandboxes for secure, scalable outcomes.*
4. [**AI in Development, Level 4: Programming Intelligence Itself**](https://jterrazz.com/articles/23-programming-intelligence) *A deep dive into designing intelligent systems that blend deterministic code with creative AI reasoning, enabling developers to architect self-optimizing solutions.*
