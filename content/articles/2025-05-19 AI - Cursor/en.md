
![](assets/thumbnail.png)

# Cursor: Welcome to Prompt-Based Development

Compagnies: only a team of core people, not the unusual stuff around it like paperwork's simple markieting, things like that. We refocus on the stuff

- Mix de ChatGPT: pour poser des questions
- Mix de cursor
- Focus sur la progression de la fusion
- Agent capable de se poser lui meme les questions
- Faire des actions
- Lire le linter
- Lire les tests
- Chercher des fichiers
- En créer
- Les supprimer
- Etc

Les commits: faire des messages autonamtises 

Le piège du vibe coding: chercher sur internet et Twitter les erreurs. Mais aussi: maîtriser le truc pour le long terme, c'est l'archi du dev

La démocratisation du call to action / tab dans la vie de tous les jours: bouger un mail dans une boîte -> hop un clic et ça te sélectionne la proba 

La monnaie c'est l'abstraction du travail ajd mais de l'énergie demain.

---

**Forget the old way of coding. With Cursor, you're not just typing code–you're orchestrating it.**

---

## 🚀 From Code Monkey to Code Conductor

Most devs have already played with Copilot or ChatGPT in their editor. The promise is seductive: "write less code, get more done." But let's be honest—most of the time, it's still _you_ doing the heavy lifting. You're explaining, correcting, reviewing—and the tools still don't feel fully integrated.

**Cursor changes the game.**

Imagine if your IDE wasn't just assisting, but actively understanding and collaborating with you. That's what Cursor does. It's not a plugin. It's not a chat window you copy-paste into. It's a full-stack dev interface where AI becomes your pair programmer—and a pretty damn good one.

---

## 🧠 Why Cursor Feels Different

### 🔄 Full Context Awareness

Unlike Copilot's file-level suggestions, Cursor indexes your whole project. It understands architecture, dependencies, even naming conventions. You can say:

> "Make @test/login.spec.ts green again"

And Cursor will figure it out: run the right commands, fix the code, import the right utilities—all autonomously.

### 🔧 Example: Inline Edits

Highlight a chunk of code and press `Cmd+K`. You get an inline prompt:

```ts
// Before
function fetchUser(id: string) {
  return axios.get(`/api/user/${id}`);
}
```

Prompt: _"Make it retry on 500 error"_

```ts
// After
function fetchUser(id: string) {
  return axios.get(`/api/user/${id}`).catch(err => {
    if (err.response?.status === 500) {
      return axios.get(`/api/user/${id}`);
    }
    throw err;
  });
}
```

### 🧭 Example: Side Bar Chat

Cursor's sidebar isn't just chat—it's chat with _project memory_. Example:

> "What's the difference between AuthService and LegacyAuth?"

The response includes code snippets, links to the files, and often suggestions to refactor or merge components if they overlap.

### 🤖 Example: Agent Mode

Switch to agent mode, and now Cursor isn't just answering—it's acting. Example:

> Prompt: _"Rename all methods that use JWT to start with 'secure' and update their calls accordingly"_

Cursor will:

- Search across files
- Rename methods
- Update all imports and calls
- Explain the changes in a summary log

### 📦 Example: Create a New Component

> Prompt: _"Create a reusable `<Tooltip />` component that supports title, position, and delay"_

Cursor generates:

```tsx
export const Tooltip = ({ title, position = "top", delay = 300 }) => {
  return (
    <div className={`tooltip tooltip-${position}`} style={{ transitionDelay: `${delay}ms` }}>
      {title}
    </div>
  );
};
```

Plus: CSS stub and a usage example in `App.tsx`.

### 🧩 The Interface _is_ the Feature

Every pixel in Cursor's UI is tuned for one purpose: communication between _you_, the _AI_, and your _codebase_. Suggestions feel natural. Navigation is fluid. Inline edits, contextual options, and file linking all work together to reduce friction.

### 🧠 Model Choice & Personality

Cursor lets you choose between different AI models (GPT-4, Claude, etc.), which matters more than you think. Some are better at structure, others at guessing your style. It's like hiring different coworkers for different tasks.

---

## 👨‍💻 A New Kind of Workflow

With Cursor, you stop being the one typing everything. Instead, you:

- Write clear goals in plain language
- Let the AI produce a solution
- Review, re-prompt, or guide it with high-level instructions

**Example:**

> "Refactor the auth service to support multiple strategies, and keep backwards compatibility."

This isn't coding line-by-line. This is creative direction. Cursor turns the developer into a decision-maker, a strategist, a systems thinker.

### ✨ Cursor = Dev Productivity X10

Because you're not bogged down writing boilerplate, your brain stays in high-level mode:

- You name things better
- You write more tests
- You think about edge cases

Why? Because the boring part is handled. You're free to focus on what _matters_.

---

## ⚙️ Real-World Setup & Tips

1. **Go Pro (seriously)**: the 20€/month version gives access to better models and more power.
2. **Customize your Agent**: It should feel like your coworker. [Here’s my setup](https://github.com/jterrazz/jterrazz-configuration/tree/main/configurations/cursor)
3. **Use Agent Mode**: Don't just chat. Tag context files, use `@file.ts`, run commands, and give multi-step goals.
4. **Explore Cursor Rules**: Add rules to your repo to guide how the agent works for you.
5. **Connect to MCPs**: Add external docs (like AWS, Stripe) so Cursor can use real APIs in suggestions.

---

## 🧪 Cursor Vs Copilot/ChatGPT

|Feature|Cursor|Copilot/ChatGPT|
|---|---|---|
|Project Awareness|✅ Full project context|❌ Limited to open files|
|Interactive Instructions|✅ Agent executes commands|❌ You do everything|
|File Manipulation|✅ Create/edit/run/search files|❌ Manual only|
|UI Integration|✅ Deep UX for dev/code/AI|❌ Bolt-on/chat only|
|Model Flexibility|✅ Multiple model options|❌ Default only|

---

## 🧭 Final Thoughts: Dev 2.0

Using Cursor feels like working with a team of smart, slightly junior devs who never get tired and work fast. You still lead. You still architect. But you don't do the plumbing anymore.

This is not about replacing developers. It's about **replacing the tedious parts of development** so you can spend more time designing, refining, and building with intention.

**Cursor is not just a better IDE. It's a new interface for software creation.**

Start exploring. Start prompting. And stop typing like it's 2015.

👉 [Get started with Cursor](https://www.cursor.com/)
