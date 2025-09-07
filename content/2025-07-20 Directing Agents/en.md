![](./assets/thumbnail.jpg)

# Using AI: Prompting the implementation

The biggest shift for developers isn't AI that just autocompletes code; it's a fundamental change in our role—from a typist of code to a technical director of an AI. This is the reality of the **guided agent**.

At this stage, you're no longer just *using* a tool; you're *directing* an agent. You become the conductor of an orchestra, the director of a film. The fundamental shift is from doing the task yourself to supervising its completion.

For a developer, this is a seismic shift. I formulate an intention—"Build out this API endpoint from the spec"—and the AI does the heavy lifting, steered by my expertise. My brainpower is now spent on high-level architecture and product strategy, not hunting for misplaced semicolons.

Let's break down the mindset and the workflow that define this new reality.

***

![](assets/conductor.jpg)

## **The Mindset: from executor to director**

The biggest change at Level 2 isn't on your screen; it's in your head. The new mantra is simple: **I instruct, I guide, I review. I do not execute.**

I've found it helpful to think of my AI agent as an incredibly fast junior developer—brilliant, but in need of clear direction. A good "prompt" isn't a single command; it's a proper brief, packed with context, just like one you'd give a human teammate.

The power of this is that the friction between a good idea and working code practically vanishes. Time spent on boilerplate, syntax lookup, and typos just melts away, freeing your mental RAM to operate at a higher level of abstraction. You start thinking more about clean architecture, elegant user experiences, and the *why* behind the *what*.

The trap, however, is getting lazy. Don't just throw vague prompts at the AI and hope for the best. You still need a firm grasp of the logic to provide meaningful feedback. A great director doesn't need to play every instrument, but they damn well better know how the music is supposed to sound. When you spend less time typing and more time reviewing, your attention naturally shifts to what truly matters: clear logic, robust tests, and simple, elegant design.

***

![](assets/editor.jpg)

## **The Workflow: intention-driven development**

Theory is one thing, but let's see what this looks like on the ground. For me, an editor like **Cursor**—which is basically VS Code with AI superpowers—is the ultimate guided agent tool. It works by indexing your entire codebase, giving the AI the same deep context a human teammate would have.

This leads to a powerful new workflow I call **Intention-Driven Development (IDD)**. It elevates the starting point from a low-level unit test to a high-level business intention.

Here's how it works. I want to build a new feature: an API endpoint that lets users subscribe to a newsletter.

**Step 1: State the Intention**
I start by creating a new test file, `subscribe.intent.test.ts`. In it, I write a single, high-level integration test that describes the exact business outcome I want:

*"When a user POSTs to `/api/subscribe` with a valid email, the API must return a 200 status with `{ success: true }`, and the database must contain the new subscriber's email."*

This test will fail, obviously. Nothing has been built yet.

**Step 2: Delegate to the Agent**
Now, the pivotal moment. Instead of opening a blank file and starting to type, I simply tell the AI agent: **"Make this test pass."**

This is where you, as the director, choose your actors. For this initial, high-level task of architecting the feature, I'll tell the editor to use a "senior architect" model—a powerful, heavy thinker AI that understands complex systems.

**Step 3: Guide and Review**
The AI gets to work. It lays out a plan:
1. Create a new database migration for the `subscribers` table.
2. Add a route for `POST /api/subscribe`.
3. Create a controller to handle the request logic.
4. Implement a service to validate the email and save it to the database.

It presents this plan to me. I review it, maybe suggest a small change ("Actually, let's put the validation logic in a separate helper function"), and then give the green light. The agent generates the code for each part, and I review the `diff` for each change, accepting it with a click. For the boilerplate code generation, I can even tell the editor to switch to a faster, cheaper "workhorse" model to save on costs.

The entire process is a conversation. I am not typing code; I am directing the construction of a feature at the speed of thought. The agent handles the tedious execution, while I focus entirely on ensuring the quality, logic, and structure are sound.

Finally, the AI runs the test again. This time, it passes.

***

![](assets/pyramid.jpg)

## **The Payoff: a better way to build**

When you lean into this conductor role, you become something more than a coder. You become an AI-assisted architect. You offload the cognitive grind of manual execution, freeing your mind to focus on what humans do best: innovation, creativity, and strategic thinking.

High-quality, tested, and documented code becomes the default, not a "nice-to-have." The result is a massive productivity spike, cleaner and more maintainable code, and honestly, it just makes building things fun again.

## **Conclusion: are you ready to delegate?**

The guided agent is a game-changer, and it's here now. A well-crafted prompt, rich with context and intent, is one of the highest-leverage skills a modern developer can possess.

This new role is just one step in a broader journey of AI integration, which begins with simple [AI assistants](https://jterrazz.com/articles/20-the-four-levels-of-ai) and progresses toward fully [autonomous agents](https://jterrazz.com/articles/22-autonomous-ai-agents). For developers, the impact at this stage is concrete and immediate. The next step is to explore how we can delegate entire workflows, not just individual tasks.

---

1. [Using AI: A practical four-level framework](https://jterrazz.com/articles/20-the-four-levels-of-ai) *A practical framework for integrating AI into any field, from assistant to programmable intelligence, empowering you to supercharge your work and creativity.*
2. [**Using AI: Prompting the implementation**](https://jterrazz.com/articles/21-guided-ai-for-developers) *A guide for developers to direct AI as a guided agent, transforming coding into high-level orchestration with tools like Cursor and intention-driven development.*
3. [Using AI: Delegating the workflow](https://jterrazz.com/articles/22-autonomous-ai-agents) *Exploring how developers can delegate entire workflows to autonomous AI agents, leveraging model-centric protocols and sandboxes for secure, scalable outcomes.*
4. [Using AI: Designing the intelligence](https://jterrazz.com/articles/23-programming-intelligence) *A deep dive into designing intelligent systems that blend deterministic code with creative AI reasoning, enabling developers to architect self-optimizing solutions.*
