![](assets/thumbnail.jpg)

# Application Design: The Concept of Dependencies

## Understand Software Architecture and Code Better

Dependencies are at the core of software architecture. They dictate how different pieces of code interact and connect with one another. Understanding and managing these dependencies is crucial for building robust, maintainable, and scalable applications.

**Navigation 📚**
1. [**Introduction: Application Design, The Art of Building Sustainable and Scalable Software**](https://www.jterrazz.com/articles/9)
	 *The basics to understand the stakes and objectives of good architecture.*

2. [**Chapter 1: The Concept of Dependencies**](https://www.jterrazz.com/articles/10)
	 *Exploring relationships between components, the importance of dependencies, and principles like SOLID.*

3. [**Chapter 2: Understanding Business and Technical Architectures**](https://www.jterrazz.com/articles/11)
	 *How to isolate business logic from technical concerns using ports and adapters.*

4. [**Chapter 3: Clean Architecture**](https://www.jterrazz.com/articles/12)
	 *Discovering an approach focused on business with a clear layered structure.*

---

# Understanding a Dependency

A dependency exists when one piece of code (A) is directly affected by changes in another piece of code (B). In other words, **A depends on B if, when B changes, A must also change**.

Let's look at a concrete example in TypeScript:

```ts
function hello() {
	const instance = new Something(); // A dependency exists here
	// …
}
```

In this example, the `hello` function depends on the `Something` class. If `Something` changes (e.g., its constructor requires new parameters), `hello` will also need to be modified.

# The Direction of Dependency

The **direction** of a dependency is fundamental to understand. Ask yourself this question: **If the link between two files is cut, which file stops working?** In the example above, if `Something` is removed, `hello` cannot function properly. Thus, we say that `hello` depends on `Something`.

---

# Using Test Doubles to Manage Dependencies in Testing

Dependencies can complicate code validation when creating tests. Imagine a function that depends on a database. If the database is unavailable, your test fails, even though the problem lies in the environment and not your code.

Martin Fowler outlines several types of **test doubles** to manage these dependencies effectively. Here's an overview:

# Category 1: Test Doubles for **Returns**

1. **Dummy**:
	 An object that holds no importance in the test and is used solely to satisfy a requirement.

	 *Example:*

```ts
function greet(user: User) {
	console.log(`Hello, ${user.name}`);
}
greet(new DummyUser());
```

2. **Fake**:
	 An object with a mock implementation that isn't used in production.<br/>

	 *Example: An in-memory database for unit testing.*

3. **Stub**:
	 An object that returns predefined values to allow the test to proceed.<br/>

	 *Example:*

```ts
class StubUserService {
	getUser() {
		return { id: 1, name: "Test User" };
	}
}
const userService = new StubUserService();
```

# Category 2: Test Doubles for **Collaboration**

1. **Spy**:
	 A spy records interactions to verify them after the test.<br/>

	 *Example:*

```ts
class SpyLogger {
	logs: string[] = [];
	log(message: string) {
		this.logs.push(message);
	}
}
```

2. **Mock**:
	 A mock ensures it was called in a specific way.<br/>

	 *Example:*

```ts
const mockLogger = { log: jest.fn() };
mockLogger.log("Test log");
```

---

# The Dependency Inversion Principle (DIP)

The Dependency Inversion Principle (the "D" in **SOLID**) states that high-level modules should not depend on low-level modules. **Both should depend on abstractions.**

# A Brief Overview of SOLID Principles

1. **S - Single Responsibility Principle (SRP):**
	 A class or module should have only one responsibility, meaning one reason to change. This keeps the code simple and clear.
	 *Example: A class should not handle both business logic and database operations.*

2. **O - Open/Closed Principle (OCP):**
	 Software entities (classes, modules, functions) should be **open for extension** but **closed for modification**. This means new features can be added without altering existing code.
	 *Example: Use interfaces or abstract classes to add new implementations without changing the existing code.*

3. **L - Liskov Substitution Principle (LSP):**
	 Derived classes should be usable in place of their parent classes without altering the expected behavior. This ensures logical inheritance.
	 *Example: Replacing a "Rectangle" class with a "Square" class should not break the program.*

4. **I - Interface Segregation Principle (ISP):**
	 Clients should not be forced to depend on interfaces they do not use. Smaller, specific interfaces are better than one large general interface.
	 *Example: Instead of a single `Animal` interface with `fly()` and `swim()` methods, use separate `Bird` and `Fish` interfaces.*

5. **D - Dependency Inversion Principle (DIP):**
	 **High-level modules (which contain core logic) should not depend on low-level modules (which implement technical details).** Both should depend on abstractions (interfaces). This reduces coupling and makes testing easier.

---

# Managing Dependencies with Inversion of Control (IoC)

**Inversion of Control** delegates the responsibility of managing dependencies to another entity, such as a dependency injection container. This promotes loose coupling.

# Implementation Examples in TypeScript

## Before: Tight Coupling

```ts
class HelloService {
	private db: Database;

	constructor() {
		this.db = new Database(); // Tight coupling
	}

	sayHello() {
		return this.db.getGreeting();
	}
}
```

## After: Loose Coupling with IoC

```ts
class HelloService {
	private db: Database;

	constructor(db: Database) { // Dependency injection
		this.db = db;
	}

	sayHello() {
		return this.db.getGreeting();
	}
}
```

---

Mastering dependencies is an essential skill for any developer. By reducing tight coupling and adopting principles such as Dependency Inversion and Dependency Injection, developers can design robust, scalable, and testable systems. Test doubles and the SOLID principles are valuable tools for achieving this. Let's now move on to another key concept: hexagonal architectures.
