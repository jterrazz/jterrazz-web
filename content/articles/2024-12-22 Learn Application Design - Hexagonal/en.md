![](assets/thumbnail.jpg)

# Application Design: Understanding Business and Technical Architectures

## Understand Software Architecture and Code Better

When designing a software application, one of the fundamental questions is how to organize the code to remain maintainable, scalable, and aligned with the business objectives. In this chapter, we'll explore the foundations of classical architectures, focusing on their strengths, limitations, and how modern approaches, such as **hexagonal architecture**, address critical challenges.

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

# The Basics: An Introduction to Classical Architectures

# Spaghetti Architecture

Spaghetti architecture is often cited as an example of organizational failure. It refers to disorganized code where everything is tangled: business logic, technical calls, user interfaces, etc.

**Consequences:**

- Difficult to understand.
- Very hard to test.
- Nearly impossible to evolve without breaking everything.

This is often the starting point when there are no clear rules or methodical organization.

---

# Layered Architecture: A Classic Approach

**Layered architecture** is a common response for structuring code modularly. It is simple to understand and is based on dividing the application into multiple layers, where each layer has a specific responsibility.

## Common Layers

1. **Presentation**: Interacts with the user (UI, API).
2. **Application**: Contains orchestration logic, i.e., workflows.
3. **Domain (or business)**: Contains the core business logic of the enterprise.
4. **Persistence**: Manages access to databases or other storage systems.

## Key Principle: Each Layer Only Knows the One Below

- The application layer can call the domain layer.
- The domain layer can call the persistence layer.
- But not the other way around.

This respects the **S** in **SOLID** (Single Responsibility Principle), as each layer has a unique responsibility.

---

# The Limitations of Layered Architecture

Despite its advantages, layered architecture has several **major drawbacks**:

- **No dependency inversion**: Layers depend on each other in a downward manner.
- **Business-technical coupling**: Business logic often directly depends on the persistence layer, making testing and evolution more challenging.
- **Purely technical division**: Code is grouped based on technical aspects (UI, database) rather than business concerns.

---

# The Goal: Separate Business Logic from Technical Concerns

A successful architecture must isolate business logic (the core of the software) from technical concerns (user interfaces, databases, frameworks).

**Why?**

1. **Durability**: Business logic evolves with the company's needs, while technical aspects change with tools or technologies.
2. **Testability**: Decoupled business logic is easier to test.
3. **Scalability**: By isolating business logic, technical layers can be replaced without impacting the application's core.

The goal is to **keep business logic independent** and **push technical concerns to the periphery**.

---

# A Solution: Hexagonal Architecture

**Hexagonal architecture** (or Ports & Adapters architecture), introduced by **Alistair Cockburn in 2005**, addresses this need. It proposes structuring code by placing the **business logic** at the center and protecting it from technical dependencies.

---

# Goals of Hexagonal Architecture

1. **Isolate business logic**: The domain is independent of frameworks, persistence, or the user interface.
2. **Facilitate testing**: Isolating technical dependencies makes the domain easier to test.
3. **Promote scalability**: Technical aspects (databases, APIs, etc.) can be modified or replaced without affecting the business core.
4. **Create clear entry and exit points**: Interactions with the outside world go through ports and adapters.

> ℹ️ The term **"hexagonal architecture"** comes from the hexagon-shaped visual representation chosen by **Alistair Cockburn** to illustrate the concept. This shape has no strict technical significance.

![](assets/hexagonal-architecture.jpg)

The hexagon emphasizes that:

- **Each side can represent a port** used to interact with the outside world (APIs, databases, user interfaces, etc.).
- All entry and exit points are equivalent: they are treated as interchangeable adapters.

In essence, the hexagon embodies **modularity** and **technological neutrality**. It visually represents business logic at the center, shielded from technical interactions by ports and adapters.

> **ℹ️ Naming**
> In hexagonal architecture, ports and adapters can be named differently depending on the perspective. Common terminologies include:
> 1. Left/Right
> 2. Driving/Driven
> 3. Primary/Secondary
> 4. User Side/Server Side
>
> The naming depends on the team's technical culture but aligns with the central idea: separating what initiates an action from what is used to accomplish it.

---

# The Central Application as the "Rule Engine"

Hexagonal architecture rests on a fundamental principle: **place business logic at the application's center**. This core, or "domain," represents the **business rules**, i.e., the processes, constraints, and decisions that define the software's value.

**Without these business rules, hexagonal architecture loses its purpose.** If your application merely acts as a gateway between technical sources (e.g., reading data from a database and displaying it as-is), there is little value in isolating non-existent business logic. In such cases, layered architecture or a simple transactional model may suffice.

---

# A Complete Example: Driving Side and Driven Side

Here's a practical example illustrating the two sides of hexagonal architecture:

- **Driving Side (Left)**: Initiates actions in the system (e.g., user requests, external events).
- **Driven Side (Right)**: Provides dependencies the system relies on to execute actions (e.g., databases, external APIs).

---

## **1. Domain (Business Logic)**

The domain contains the system's core, defining business rules and remaining independent of technical layers.

```ts
export interface OrderInputPort {
   processOrder(order: Order): void; // Left-side port
}

export interface OrderOutputPort {
   saveOrder(order: Order): void; // Right-side port
}

export class OrderService implements OrderInputPort {
   constructor(private outputPort: OrderOutputPort) {}

   processOrder(order: Order): void {
      if (!order.isValid()) {
         throw new Error("Order is invalid");
      }

      console.log("Processing order:", order);
      this.outputPort.saveOrder(order); // Calls the output port
   }
}
```

**Explanation:**
- `OrderInputPort` (left-side port) defines how actions are initiated.
- `OrderOutputPort` (right-side port) abstracts the dependencies required to save orders.
- `OrderService` contains the business rules and uses both ports to operate.

---

## **2. Driving Side Adapter: Handling User Requests**

A left-side adapter transforms user actions into domain calls via the `OrderInputPort`.

```ts
import express from "express";

export class OrderController {
   constructor(private orderInputPort: OrderInputPort) {}

   handleRequest(req: express.Request, res: express.Response): void {
      const order = req.body;

      try {
         this.orderInputPort.processOrder(order); // Calls the domain
         res.status(200).send("Order processed successfully!");
      } catch (err) {
         res.status(400).send(err.message);
      }
   }
}
```

**Explanation:**
This controller translates an HTTP request into a call to the domain's `processOrder`.

---

## **3. Driven Side Adapter: Handling Persistence**

A right-side adapter implements the `OrderOutputPort` for saving data.

```ts
export class DatabaseAdapter implements OrderOutputPort {
   saveOrder(order: Order): void {
      console.log("Saving order to database:", order);
   }
}
```

**Explanation:**
This adapter saves orders to a database by implementing the `saveOrder` method.

---

# **4. Orchestrating Dependencies**

Here's how to connect the components:

```ts
import express from "express";

const databaseAdapter = new DatabaseAdapter();
const orderService = new OrderService(databaseAdapter);
const orderController = new OrderController(orderService); // Driving Side
const app = express();

app.use(express.json());

app.post("/orders", (req, res) => orderController.handleRequest(req, res));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

**Explanation:**
- The user sends an HTTP `POST /orders` request.
- The controller (`OrderController`) initiates an action through the `OrderInputPort`.
- The business logic (`OrderService`) processes the order and uses the `OrderOutputPort` for persistence.

---

# Impact on Testing

With this architecture, every component is independently testable:

- **Driving Side (Controller)**: Mock the `OrderInputPort` to verify request handling.
- **Business Logic**: Mock the `OrderOutputPort` to test rules independently.
- **Driven Side (Database)**: Test the adapter in isolation from the rest of the system.

---

> **Advice from Alistair Cockburn in 2023: Use For + Verb "-ing" + Goal**
> In his recent advice, Alistair Cockburn emphasized the importance of giving explicit, goal-oriented names to ports and adapters. A good practice is to name them using the structure: **"For + Verb-ing + Goal"**.
>
> **Example:**
> Imagine an order management application. Here's how you could name the ports:
> - **Driving Port (Left):** `ForProcessingOrders`. This port initiates the processing of an order.
> - **Driven Port (Right):** `ForSavingOrders`. This port is used to save orders in a database.
>
> By following this naming convention, ports and adapters clearly reflect their roles and purpose, making your code more understandable and aligned with its intent.

---

Hexagonal architecture emphasizes the importance of placing business logic at the center while delegating technical concerns to the periphery. Through its **ports** and **adapters**, it fosters modularity, testability, and scalability. However, it is just one step toward an even more universal architecture.

**Clean architecture**, popularized by Robert C. Martin (Uncle Bob), extends these concepts further. It provides strict dependency structuring rules to ensure the business core remains entirely independent of implementation details. Clean architecture is often viewed as a generalization of hexagonal principles while adding additional layers to handle complex needs.

In the next chapter, we'll delve deeper into clean architecture. We'll explore how it builds on these solid principles to offer a clear, cohesive, and powerful approach to structuring your applications. Get ready to simplify your architectural decisions while making your projects more robust!
