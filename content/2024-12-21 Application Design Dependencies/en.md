![](assets/thumbnail.jpg)

# Application design, let's talk about dependencies

## How your code is connected

Dependencies are the invisible threads holding your entire application together. Every piece of code that talks to another creates a dependency. For me, understanding these connections is the single most important skill in software architecture. If you get this right, you can build anything. If you get it wrong, you're just creating a future nightmare for yourself.

Mastering dependencies is what allows us to build software that is flexible, easy to test, and ready to scale.

**Navigation 📚**

1. [**Introduction: Application design, the art of building sustainable and scalable software**](https://www.jterrazz.com/articles/9-software-design-0-why-architecture-matters)
		*The basics to understand the stakes and objectives of good architecture.*

2. [**Chapter 1: The concept of dependencies**](https://www.jterrazz.com/articles/10-software-design-1-mastering-dependencies)
		*Exploring relationships between components, the importance of dependencies, and principles like SOLID.*

3. [**Chapter 2: Understanding business and technical architectures**](https://www.jterrazz.com/articles/11-software-design-2-hexagonal-architecture)
		*How to isolate business logic from technical concerns using ports and adapters.*

4. [**Chapter 3: Clean architecture**](https://www.jterrazz.com/articles/12-software-design-3-clean-architecture-in-practice)
		*Discovering an approach focused on business with a clear layered structure.*

---

# So what *is* a dependency?

It's simple: a dependency exists whenever a change in one piece of code forces a change in another. Think of it like this: **Code A depends on Code B if breaking B also breaks A.**

Let's look at a super basic TypeScript example:

```ts
function hello() {
	const instance = new Something(); // Right here. This is a dependency.
	// …
}
```

In this snippet, my `hello` function is directly tied to the `Something` class. If I change the `Something` class—say, its constructor now needs an argument—my `hello` function breaks. It has to be updated. That's a dependency in action.

## The flow of dependency

The direction of a dependency is critical. To make it crystal clear, I always ask myself one question: **If I delete the connection between two things, which one stops working?**

In our example, if I delete the `Something` class, the `hello` function is dead in the water. It can't run. So, `hello` depends on `Something`, not the other way around.

---

# How to tame dependencies in your tests with test doubles

Dependencies are a huge pain when it comes to testing. We've all been there: you write a test for a simple function, but it fails because it can't connect to the database. The problem isn't your code; it's the environment. This is where tests become fragile and useless.

To solve this, we use what Martin Fowler calls **test doubles**. These are stand-ins for the real dependencies, allowing you to test your code in isolation.

Here are the main types:

## Category 1: Doubles that **return values**

1. **Dummy**:
		A placeholder you pass just to make the code run. It's not actually used.

		*Example:* A function needs a `User` object, but you don't care which one.

```ts
function greet(user: User) {
  console.log(`Hello, ${user.name}`);
}

// We just need *something* to pass.
greet(new DummyUser());
```

1. **Fake**:
		A simplified, working implementation of a dependency. The classic example is an in-memory database that you use for tests instead of a real one. It works, but it's not for production.

2. **Stub**:
		An object that just returns hardcoded values. You use it when your test needs a specific answer from a dependency to proceed.

*Example:*

```ts
class StubUserService {
    getUser() {
        // Always returns the same thing.
        return { id: 1, name: "Test User" };
    }
}
const userService = new StubUserService();
```

## Category 2: Doubles that **check behavior**

1. **Spy**:
		A spy is a wrapper that watches how a dependency is used. It records all the calls so you can check them after your test runs. "Did my function call `logger.log` three times?" A spy can tell you.

*Example:*

```ts
class SpyLogger {
    logs: string[] = [];
    log(message: string) {
        this.logs.push(message);
  }
}
```

1. **Mock**:
		A mock is like a spy, but smarter. You tell it *beforehand* what to expect. It knows which methods should be called, with what arguments, and in what order. The test passes only if the mock's expectations are met.

*Example:*

```ts
// Using a library like Jest
const mockLogger = { log: jest.fn() };
mockLogger.log("Test log");
// Now you can assert that mockLogger.log was called correctly.
```

---

# The secret weapon: the dependency inversion principle (DIP)

This is the "D" in **SOLID**, and for me, it's one of the most powerful ideas in software design. The principle is: high-level modules shouldn't depend on low-level modules. **Both should depend on abstractions.**

In simple terms, your core business logic shouldn't depend on technical details like a specific database or framework. Instead, both should depend on a contract (like an interface). This "inverts" the typical dependency flow and gives you incredible flexibility.

## A quick SOLID refresher

These five principles are the foundation of good object-oriented design.

1. **S - Single Responsibility Principle (SRP):**
		A class should only have one job, one reason to change. Don't mix your business rules with your database code. Keep it clean.

2. **O - Open/Closed Principle (OCP):**
		Your code should be **open for extension** but **closed for modification**. You should be able to add new functionality without rewriting existing, working code. Think plugins.

3. **L - Liskov Substitution Principle (LSP):**
		If you have a class `Square` that inherits from `Rectangle`, you should be able to use `Square` anywhere you use `Rectangle` without breaking anything. It ensures inheritance makes sense.

4. **I - Interface Segregation Principle (ISP):**
		Don't force classes to implement methods they don't need. Keep your interfaces small and focused. A `Bird` interface shouldn't have a `swim()` method.

5. **D - Dependency Inversion Principle (DIP):**
		As we've covered: depend on abstractions, not on concrete, low-level details. This decouples your core logic from its technical plumbing, making it far easier to test and change.

---

# Making it happen with inversion of control (IoC)

So how do you actually implement dependency inversion? Through a pattern called **inversion of control (IoC)**.

Instead of a class creating its own dependencies (like a database connection), you "invert the control" and have something else provide that dependency from the outside. This is usually done with **dependency injection**.

Let's see it in action.

## Before: a mess of tight coupling

Here, my `HelloService` is directly responsible for creating its own `Database` instance. This forges a tight bond, making it impossible to test `HelloService` without a real database.

```ts
class HelloService {
	private db: Database;

	constructor() {
		// My service is creating its own dependency. Bad idea.
		this.db = new Database(); // Tight coupling
	}

	sayHello() {
		return this.db.getGreeting();
	}
}
```

## After: freedom through loose coupling

Now, `HelloService` just asks for a `Database` in its constructor. It doesn't know or care how it was created. I can easily pass a real database in production or a fake one for my tests. This is freedom.

```ts
class HelloService {
	private db: Database;

	// The dependency is "injected" from the outside.
	constructor(db: Database) { // Dependency injection
		this.db = db;
	}

	sayHello() {
		return this.db.getGreeting();
	}
}
```

---

Getting a handle on dependencies is a game-changer. When you learn to control this flow, apply principles like DIP, and use patterns like IoC, you start building systems that are robust, testable, and ready for whatever the future throws at them.

Next, we'll look at how these ideas come together in a full-blown architecture, like the hexagonal architecture.

[Next Article](https://www.jterrazz.com/articles/11-software-design-2-hexagonal-architecture)
