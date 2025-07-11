![](assets/thumbnail.jpg)

# Application Design: Let's Talk Clean Architecture

## Getting to the Heart of What Matters

Here's the big idea that changed how I build software: your architecture should not care about your database. It shouldn't care about your web framework. It shouldn't care about your UI. The only thing it should care about is what your application *actually does*.

This is the entire philosophy behind **Clean Architecture**. It's a way of building software that puts your **use cases**—the real business value—right at the absolute center. Everything else is just a detail. It's a powerful evolution of the ideas we saw in Hexagonal Architecture, with stricter rules that give you even more clarity and power.

**Navigation 📚**

1. [**Introduction: Application Design, The Art of Building Sustainable and Scalable Software**](https://www.jterrazz.com/articles/9-software-design-0-why-architecture-matters)
		*The basics to understand the stakes and objectives of good architecture.*

2. [**Chapter 1: The Concept of Dependencies**](https://www.jterrazz.com/articles/10-software-design-1-mastering-dependencies)
		*Exploring relationships between components, the importance of dependencies, and principles like SOLID.*

3. [**Chapter 2: Understanding Business and Technical Architectures**](https://www.jterrazz.com/articles/11-software-design-2-hexagonal-architecture)
		*How to isolate business logic from technical concerns using ports and adapters.*

4. [**Chapter 3: Clean Architecture**](https://www.jterrazz.com/articles/12-software-design-3-clean-architecture-in-practice)
		*Discovering an approach focused on business with a clear layered structure.*

---

# What Clean Architecture Looks Like in Theory

Clean Architecture is all about creating independent layers with a strict set of rules about how they can interact. Think of it like a series of concentric circles.

1. **Entities**: At the very core. These are your enterprise-wide business rules. The pure, unadulterated logic that defines your business.
2. **Use Cases**: This layer surrounds the entities. It contains the application-specific business rules. It orchestrates the flow of data to and from the entities to achieve a specific goal (e.g., "Register a User" or "Process a Payment").
3. **Interface Adapters**: This is the translation layer. It takes data from the format most convenient for the use cases and entities and converts it into the format most convenient for the outside world (like a database or the web).
4. **Frameworks and Drivers**: The outermost layer. This is where all the details live: the web framework, the database, the UI, etc. This stuff is the most likely to change.

The golden rule is the **Dependency Rule**: all dependencies must point inwards. Your UI can depend on your use cases, but your use cases know *nothing* about the UI. Your business logic is the king, and it is never, ever dethroned by a technical detail.

![](assets/clean-architecture.jpg)

---

# Clean Architecture vs. Hexagonal Architecture

So, how does this compare to the Hexagonal Architecture we just discussed?

They are built on the exact same philosophy: **protect the business logic**. I see Clean Architecture as a more specific, opinionated version of Hexagonal Architecture.

* Hexagonal Architecture gives you the "what": separate your app into an "inside" (domain) and an "outside" (infrastructure) using ports and adapters.
* Clean Architecture gives you a more detailed "how": it explicitly defines the layers within the "inside" part (Entities and Use Cases) and provides stricter rules about how they interact.

Think of it this way: Hexagonal Architecture drew the map. Clean Architecture added the highways and road signs. It makes the path clearer.

---

# Let's Build It: A Complete Example

Theory is great, but code is better. Let's build a small part of a hotel management app. The goal is to update room prices based on a new base price and a set of business rules (e.g., different floors have different price multipliers).

## Our File Structure

First, look at the project structure. This is what Robert C. Martin calls a "Screaming Architecture." Your folder structure should scream what the application *does*, not what frameworks it uses. You see `business`, `use-cases`, and `entity`. You don't see `models`, `views`, and `controllers` at the top level.

```sh
src/
├── business/
│ ├── entity/
│ │ └── floor.ts
│ │ └── room.ts
│ ├── gateway/
│ │ └── room.gateway.ts
│ ├── use-cases/
│ │ └── update-room-price.ts
├── container/
│ └── container.ts
├── controller/
│ ├── gateway/
│ │ └── room.repository.ts
│ ├── presenter/
│ │ └── room-presenter.json.ts
│ └── room.controller.ts
└── tests/
		└── update-price.test.ts
```

* `business/`: This is the heart of our application. All pure business logic lives here. It has zero dependencies on the outside world.
* `controller/`: This is our interface adapter layer. It handles the messy details of talking to the outside world (like implementing gateways and presenters).
* `container/`: This is our assembly plant. It's where we wire everything together using dependency injection.
* `tests/`: Tests that prove our business logic works.

---

## 1. The Entities: `Floor` & `Room`

Entities are not just dumb data bags. They contain the most fundamental business rules. This is logic that is true for the entire enterprise, regardless of the application using it.

```ts
// business/entity/floor.ts
export class Floor {
		constructor(public floor: number) {}

    // This is a core business rule.
    getFactor() {
        if (this.floor === 1) return 1.07;
        if (this.floor === 2) return 1.22;
        if (this.floor === 3) return 1.33;
        return 1;
    }
}
```

```ts
// business/entity/room.ts
import { Floor } from "./floor";

export class Room {
		public floor: Floor;
		constructor(
				floorNumber: number,
				public number: number,
				public price: number,
		) {
				this.floor = new Floor(floorNumber);
		}

    // Another core business rule.
    setPrice(basePrice: number) {
        const calculatedPrice = basePrice * this.floor.getFactor();
        this.price = Math.min(Number(calculatedPrice.toFixed(2)), 200);
    }
}
```

**Why put logic here?** Because the rule that "a room's price depends on its floor" is a fundamental truth of our hotel business. By putting it in the entity, we ensure this rule is always enforced, everywhere. It's encapsulated, reusable, and follows the Single Responsibility Principle.

---

## 2. The Gateway: `RoomGateway`

The gateway is an interface. It's a contract defined by the business layer that says, "I need to do these things with rooms, but I don't care *how* you do them." It's a promise that the outer layers will have to fulfill.

```ts
// business/gateway/room.gateway.ts
export interface RoomDTO {
		floor: number;
		number: number;
		price: number;
}

// This is the contract.
export interface RoomGateway {
		updateRoomPrice(roomNumber: number, newPrice: number): Promise<void>;
		getRooms(): Promise<Array<RoomDTO>>;
}
```

This interface lives in the `business` layer, ensuring the dependency points inwards. The use cases will depend on this abstraction, not on a concrete database class.

---

## 3. The Use Case: `UpdateRoomPrice`

The use case is the star of the show. It represents a single action the application can perform. It orchestrates the entities and uses gateways to interact with the outside world.

```ts
// business/use-cases/update-room-price.ts
import { Room } from "../entity/room";
import { RoomGateway } from "../gateway/room.gateway";

// Another contract: how the use case reports its results.
export interface Presenter {
    set: (rooms: Array<Room>) => void;
}

// The use case itself.
export type UpdateRoomPrice = (basePrice: number, presenter: Presenter) => Promise<void>;

// A factory to create the use case and inject its dependencies.
export const updateRoomPriceFactory = (repository: RoomGateway) => {
    return async (basePrice: number, presenter: Presenter) => {
        if (basePrice < 0) {
            throw new Error("Amount cannot be negative");
        }
        const roomsDto = await repository.getRooms();
        const rooms = roomsDto.map((r) => new Room(r.floor, r.number, r.price));

        for (const room of rooms) {
            room.setPrice(basePrice); // Use the entity's business logic.
            await repository.updateRoomPrice(room.number, room.price);
        }

        const updatedRooms = (await repository.getRooms()).map(
            (r) => new Room(r.floor, r.number, r.price)
        );
        
        // Hand off the results to the presenter.
        presenter.set(updatedRooms);
    };
};
```

This code is pure business logic. It gets rooms, loops through them, tells each room to update its price (using the `setPrice` method in the entity), and then saves them back. It knows nothing about databases, HTTP, or JSON. It just talks to abstractions (`RoomGateway`, `Presenter`).

---

## 4. The Gateway Implementation: `RoomRepository`

Now we're in the outer layers. The `RoomRepository` is the concrete implementation of the `RoomGateway` interface. This is where we write the actual database code. For this example, I'm just using an in-memory array, but this is where your `Prisma`, `TypeORM`, or `node-postgres` code would go.

```ts
// controller/gateway/room.repository.ts
import { RoomDTO, RoomGateway } from "../../business/gateway/room.gateway";

export class RoomRepository implements RoomGateway {
    constructor(private rooms: Array<RoomDTO>) {}

    async updateRoomPrice(roomNumber: number, newPrice: number): Promise<void> {
        const room = this.rooms.find((room) => room.number === roomNumber);
        if (!room) {
            throw new Error(`Failed to find room ${roomNumber}`);
        }
        room.price = newPrice;
        return Promise.resolve();
    }

    async getRooms(): Promise<Array<RoomDTO>> {
        return Promise.resolve(this.rooms);
    }
}
```

This class fulfills the promise made by the `RoomGateway` interface.

---

## 5. The Presenter Implementation: `RoomPresenterJson`

The presenter's job is to take the pure entity objects from the use case and format them for the outside world. Here, we're formatting them as simple JSON objects.

```ts
// controller/presenter/room-presenter.json.ts
import { Room } from "../../business/entity/room";

export class RoomPresenterJson {
    private r: Array<Room> = [];

    // The use case calls this method.
    set(rooms: Array<Room>) {
        this.r = rooms;
    }

    // The controller calls this method to get the final output.
    format() {
        return this.r.map((r) => ({
            floor: r.floor.floor,
            price: r.price,
            number: r.number,
        }));
    }
}
```

This creates a beautiful separation. The use case doesn't know about JSON. The controller doesn't know about `Room` entities. The presenter is the bridge.

---

## 6. The Controller: `RoomController`

The controller is the entry point from the web. Its only job is to parse the request, call the correct use case, and send the formatted response. It's a thin, dumb layer.

```ts
// controller/room.controller.ts
import { Request, Response } from "express";
import { createContainer } from "../container/container";
import { RoomPresenterJson } from "./presenter/room-presenter.json";

const express = require("express");
const app = express();

const container = createContainer();

app.put("/rooms", async (req: Request, res: Response) => {
    // 1. Create a new presenter for this request.
    const roomPresenterJson = new RoomPresenterJson();
    // 2. Get the use case from our container and execute it.
    await container.UpdateRoomPrice(200, roomPresenterJson);
    // 3. Send the formatted result from the presenter.
    res.send(roomPresenterJson.format());
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

Look how clean that is. The controller orchestrates the flow but contains zero business logic.

---

## 7. The Dependency Container

This is where the magic happens. The container is a single place where we construct our objects and inject their dependencies. This is Inversion of Control in action.

```ts
// container/container.ts
import { UpdateRoomPrice, updateRoomPriceFactory } from "../business/use-cases/update-room-price";
import { RoomRepository } from "../controller/gateway/room.repository";

interface Container {
    UpdateRoomPrice: UpdateRoomPrice;
}

export const createContainer = (): Container => {
    return {
        // Create the use case, injecting the concrete repository.
        UpdateRoomPrice: updateRoomPriceFactory(
            new RoomRepository([
                // Initial data for our in-memory repo.
                { floor: 0, number: 1, price: 0 },
                { floor: 1, number: 2, price: 0 },
                { floor: 2, number: 3, price: 0 },
                { floor: 3, number: 4, price: 0 },
            ])
        ),
    };
};
```

---

## 8. The Test: Where It All Pays Off

Now, the best part. Look how easy it is to test our core business logic.

```ts
// tests/update-price.test.ts
import assert from "assert";
import { describe, test } from "mocha";
import { createContainer } from "../container/container";
import { RoomPresenterJson } from "../controller/presenter/room-presenter.json";

describe("Update Room Price", () => {
    test("Update all room prices based on a base price of 100", async () => {
        // Given
        const container = createContainer();
        const presenter = new RoomPresenterJson();

        // When we run the use case
        await container.UpdateRoomPrice(100, presenter);

        // Then we check the output from the presenter
        const value = presenter.format();
        assert.deepStrictEqual(value, [
            { number: 1, price: 100, floor: 0 }, // 100 * 1
            { number: 2, price: 107, floor: 1 }, // 100 * 1.07
            { number: 3, price: 122, floor: 2 }, // 100 * 1.22
            { number: 4, price: 133, floor: 3 }, // 100 * 1.33
        ]);
    });
});
```

This test is lightning-fast. It runs in memory. It doesn't need a database or a web server. It tests our entire business process from end to end, proving that our logic is correct, all because we so carefully separated our concerns. This is the payoff.

---

# Conclusion: Build for the Business, Not the Tech

We've come a long way, from basic dependencies to Hexagonal Architecture, and now to the disciplined structure of Clean Architecture. The lesson through it all has been the same: **put your business logic first.**

Frameworks will change. Databases will be replaced. User interfaces will be redesigned. But your core business rules are what provide lasting value. Clean Architecture isn't just a pattern; it's a philosophy that forces you to protect that value.

It demands discipline and a bit more thought upfront, but the reward is a system that is testable, maintainable, flexible, and understandable. You build something that can evolve with the business, not something that holds it back.

Thank you for coming on this journey with me. Now go build something great. 🚀
