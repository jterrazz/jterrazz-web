# 🛠️ **Software Architecture Cheatsheet**

## 🚀 **Core Principles**

- **Separation of Concerns**: Keep distinct responsibilities in separate layers/components.
- **Single Responsibility Principle (SRP)**: Each class/module should have one purpose.
- **Dependency Inversion Principle (DIP)**: Code should depend on abstractions, not concrete implementations.

---

## 📚 **Architectures Overview**

### 🥪 **Layered Architecture**

- Layers: **Presentation**, **Application**, **Domain**, **Persistence**.
- **Pros**: Easy to understand; logical separation.
- **Cons**: Dependency flow only **downwards**; tight coupling between layers.

---

### 🧵 **Hexagonal Architecture (Ports & Adapters)**

- **Key Idea**: Isolate the domain (business logic) from the technical details.
- **Structure**:
  - **Ports**: Define communication points (e.g., interfaces).
  - **Adapters**: Implement the ports to connect with external systems (e.g., DB, UI).
- **Benefits**: Testable, modular, and framework-agnostic.

---

### 🧼 **Clean Architecture**

- **Core Concept**: Keep the **business logic (Entities)** at the center.
- **Layers**:
  1.  **Entities** (Enterprise Business Rules): Core rules of the domain.
  2.  **Use Cases** (Application Business Rules): Orchestrate entity interactions.
  3.  **Interface Adapters**: Translate data between domain and external systems.
  4.  **Frameworks & Drivers**: External tech like DB, UI, APIs.
- **Dependency Rule**: Always depend inward towards the domain.
- **Screaming Architecture**: Your code structure should "scream" the domain's purpose.

---

## ⚙️ **Key Concepts**

### 🔗 **Dependencies**

- **Definition**: A depends on B if changes to B require changes to A.
- **Principles**: Use **Dependency Injection (DI)** and abstractions to decouple dependencies.

### 🧹 **SOLID Principles**

1. **S**: Single Responsibility Principle (SRP).
2. **O**: Open/Closed Principle: Open to extension, closed to modification.
3. **L**: Liskov Substitution Principle: Subclasses must respect the base class behavior.
4. **I**: Interface Segregation: Prefer small, specific interfaces.
5. **D**: Dependency Inversion: Depend on abstractions, not concrete implementations.

### 🧪 **Testing**

- Use **mocks**, **stubs**, and **spies** to isolate behavior:
  - **Mock**: Verifies interactions (e.g., method calls).
  - **Stub**: Returns predefined data for tests.
  - **Spy**: Tracks usage during a test.

---

## 🌟 **Practical Tips**

1. **Business Logic First**: Focus on the rules that define your domain.
2. **DTO vs DAO**:
   - **DTO (Data Transfer Object)**: Holds data only (struct).
   - **DAO (Data Access Object)**: Encapsulates data and domain logic (object).
3. **Explicit Naming**: Use `For + Verbing + Objective` for clear interfaces (e.g., `ForCalculatingPrices`).
4. **Presenter Separation**: Presenters receive data from Use Cases and handle formatting for controllers.

---

## 🏗️ **Code Structure Example**

```
src/
├── business/
│   ├── entity/               # Core domain models
│   ├── gateway/              # Abstractions for persistence/API
│   ├── use-cases/            # Application business rules
├── controller/               # API controllers and adapters
│   ├── presenter/            # Presenters for formatting
│   ├── gateway/              # Gateways for external services
├── container/                # Dependency injection and assembly
└── tests/                    # Unit and integration tests
```

---

## 💡 **Key Takeaways**

1. Always **decouple the business logic** from frameworks and technical details.
2. Test the **core domain independently** of external systems.
3. Use **clear boundaries** to isolate concerns for better maintainability.
4. Keep your architecture **modular and extensible**, with the domain as the priority.

![[https://cdn.jsdelivr.net/gh/jterrazz/jterrazz-web@main/content/articles/2019-06-01](https://cdn.jsdelivr.net/gh/jterrazz/jterrazz-web@main/content/articles/2019-06-01) Learn Malloc/assets/thumbnail.jpg]]
