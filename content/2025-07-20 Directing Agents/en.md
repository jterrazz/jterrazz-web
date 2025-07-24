![](assets/thumbnail.jpg)

# AI in development, level 2: from coder to conductor

Alright, let's get into it.

In the first piece of this series, I laid out a simple four-level framework for thinking about AI's role in our work. It's a universal map, whether you're in marketing or project management. If you missed it, I'd give it a quick scan—it sets the stage for everything we're about to cover.

Today, we're zeroing in on my world: software development. We're diving deep into **Level 2: The guided agent**.

Let's nail down the core idea. At Level 2, you're no longer just *using* a tool; you're *directing* an agent. Think of yourself as the conductor of an orchestra or the manager of a highly-skilled—if sometimes naive—team member. You set the objective, and then you iteratively guide and refine the output. The fundamental shift is from doing the task yourself to supervising its completion.

For a developer, this isn't a small tweak; it's a seismic shift in how you build. You go from being a typist of code to a technical director of an AI. I formulate an intention—"Refactor this module for better performance," or "Build out this API endpoint from the spec"—and the AI does the heavy lifting, steered by my expertise. For me, this change brought back a feeling of magic, allowing me to build and iterate at a speed I hadn't thought possible. My brainpower is now spent on high-level architecture and product strategy, not hunting for misplaced semicolons.

Let's break down the mindset, the tools, and the workflows that define this new reality.

***

![](assets/conductor.jpg)

## The mindset shift: from executor to director

The biggest change at Level 2 isn't on your screen; it's in your head. The new mantra is simple and direct: **I instruct, I guide, I review. I do not execute.**

I've found it helpful to think of my AI agent as an incredibly fast junior developer—brilliant, but in need of clear direction. A good "prompt" isn't a single cryptic command. It's a proper brief, packed with context, just like one you'd give a human teammate.

- **The Power:** The friction between a good idea and working code practically vanishes. All that time spent typing, fixing typos, and looking up syntax on Stack Overflow simply melts away. This frees up your mental RAM to operate at a higher level of abstraction. You start thinking more about clean architecture, elegant user experiences, and the *why* behind the *what*.
- **The Trap:** It's easy to fall into the "YOLO coding" trap—just throwing vague prompts at the AI and hoping for the best. Don't do it. The key is to visualize the solution as if you were coding it yourself, but at the speed of thought. You still need a firm grasp of the logic and data flow to provide meaningful feedback. A great director doesn't need to play every instrument, but they damn well better know how the music is supposed to sound.

What I found most surprising? My code quality actually went *up*. When you spend less time typing and more time reviewing from a high level, your attention naturally shifts to what truly matters: clear logic, robust tests, and simple, elegant design.

![](assets/pyramid.jpg)

## Choosing your tools: the right AI for the job

You wouldn't use a sledgehammer to hang a picture frame. Picking the right AI model for the task is just as critical. Your choice boils down to a trade-off between complexity, speed, and cost.

Here's a simple way I think about the tiers of models available today:

- **The Senior Architects (e.g., Claude 4 Sonnet, Grok 4, o3):** These are the heavy thinkers. I pull them in for complex, multi-step operations: a major refactor, architecting a new microservice from scratch, or hunting down a nasty, logic-based bug. They have incredible reasoning power, but they're also the most expensive. Use them deliberately.
- **The Workhorses (e.g., o3, Claude 4 Opus, Gemini 2.5 Pro):** These models are my daily drivers. They hit the sweet spot of speed, intelligence, and cost. I use them for analyzing large chunks of code, generating boilerplate, writing unit tests, and iterating on new features. They are fantastically capable.
- **The Sprinters (Smaller, faster models):** For quick-fire tasks like autocompleting a line of code or answering a simple "how do I do X in Python?" question, these faster, cheaper models are perfect.

My workflow is a fluid mix of all three. I'll use a workhorse for 80% of my tasks and call in the senior architect when I need a moment of brilliance. Learning to optimize your model usage is a new, and I would argue essential, skill for developers.

![](assets/editor.jpg)

## In practice: guiding an agent with Cursor

Theory is one thing, but let's see what this looks like on the ground. For me, an editor like **Cursor**—which is basically VS Code with AI superpowers—is the ultimate guided agent tool. It works by indexing your entire codebase, giving the AI the same deep context a human teammate would have after a week of onboarding.

**Getting started:**
It's dead simple. You clone your repo, open the folder in Cursor, and let it do its thing. The editor scans and indexes everything—files, folder structures, dependencies. The AI now *knows* your project.

**The magic of `Cmd + K` (or `Ctrl + K`):**
This key command is your new best friend. Instead of typing code, you pop open an inline chat and state your intent.

- **Use Case 1: Quick refactor**
    I'll highlight a clunky function and hit `Cmd + K`: "Refactor this to use modern async/await and add JSDoc comments for each parameter." Cursor generates the changes right there, showing me a clean `diff` view. I review, hit accept, and I'm done.
- **Use Case 2: Crushing bugs**
    Got a failing test file? I'll just type `Cmd + K` and say: "Run the tests in `@monTest.test.ts`. Figure out why they're failing and fix the underlying code until they all pass." The AI will then start a cycle of analyzing, proposing a fix, and re-testing, all while I supervise and approve the changes.
- **Use Case 3: Ambitious migrations**
    You can even tackle massive projects. I started a recent migration with a simple prompt: `Cmd + K`, "Give me a step-by-step plan to migrate this entire project from JavaScript to TypeScript." The AI laid out a coherent strategy. From there, I could instruct it to execute each step, one by one, across dozens of files.

With features like **Cursor Rules**, you can even enforce your team's coding conventions, like telling it to always use a "Given-When-Then" structure for new tests. It's like handing your AI a personalized style guide.

## A new paradigm: intention-driven development (IDD)

This guided workflow led me to a concept I've started calling **intention-driven development (IDD)**. It's a twist on test-driven development (TDD), but it elevates the starting point from a low-level unit test to a high-level business intention.

Here's how it works in practice:

- I create a new test file, something like `feature-x.intent.test.ts`. In it, I write a single, high-level integration test that describes the exact business outcome I want. For example: "When a user POSTs to `/api/subscribe` with a valid email, the API must return a 200 status with `{ success: true }` in the body, and the entire response must take less than 200ms."
- Then comes the pivotal moment. I hand this "intent file" to my AI agent and give it a simple directive: "Make this test pass."

The AI is now free to implement whatever it needs to—the controller, the service logic, the database interaction—as long as the final result satisfies my stated intention. This approach keeps me laser-focused on shipping actual product value, not just lines of code.

## The positive fallout: a better way to build

When you truly lean into this conductor role, you become something more than a coder. You become an AI-assisted architect. You offload the cognitive grind of manual execution, freeing your mind to focus on what humans do best: innovation, creativity, and strategic thinking.

Your AI becomes a partner that learns to operate in sync with your style and your project's needs. High-quality code—tested and documented—becomes the default, not a "nice-to-have." The result is a massive productivity spike, cleaner and more maintainable code, and honestly, it just makes building things fun again.

## Conclusion: are you ready for autonomy?

The guided agent isn't a theoretical concept; it's a game-changer, and it's here now. In my own work, I can build and ship features that used to take a week in a single day, simply by giving clear, high-level instructions to an AI like Claude within Cursor. The idea that "prompting" is a trivial skill is officially dead. A well-crafted prompt, rich with context and intent, is one of the highest-leverage skills a modern developer can possess.

This level perfectly embodies the principle from our first article: you're managing a virtual team member. For developers, the impact is concrete and immediate. I really encourage you to download Cursor or try a similar workflow today. Just jump in.

In our next article, we'll push the envelope even further and explore **Level 3: The autonomous agent**, where the AI goes from being your direct report to a fully independent, supervised member of your team.

What have your experiences been with guided AI agents in your workflow? I'd love to hear your stories—both successes and frustrations—in the comments below.

[**Next Article**](http://localhost:3000/articles/22-autonomous-ai-agents)

---

1. [**The Four Levels of AI: How to Ride the Wave and Amplify Your Potential**](https://jterrazz.com/articles/20-the-four-levels-of-ai) *A practical framework for integrating AI into any field, from assistant to programmable intelligence, empowering you to supercharge your work and creativity.*
2. [**AI in Development, Level 2: From Coder to Conductor**](https://jterrazz.com/articles/21-guided-ai-for-developers) *A guide for developers to direct AI as a guided agent, transforming coding into high-level orchestration with tools like Cursor and intention-driven development.*
3. [**AI in Development, Level 3: The Rise of the Autonomous Agent**](https://jterrazz.com/articles/22-autonomous-ai-agents) *Exploring how developers can delegate entire workflows to autonomous AI agents, leveraging model-centric protocols and sandboxes for secure, scalable outcomes.*
4. [**AI in Development, Level 4: Programming Intelligence Itself**](https://jterrazz.com/articles/23-programming-intelligence) *A deep dive into designing intelligent systems that blend deterministic code with creative AI reasoning, enabling developers to architect self-optimizing solutions.*
