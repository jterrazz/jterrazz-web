![](assets/thumbnail.jpg)

# Demystifying Expert Systems: Implementing a Backward Chaining Resolver in Python

Have you ever wondered how computers can mimic human decision-making? Enter the world of **expert systems**–powerful tools that reproduce cognitive mechanisms to solve complex problems. These systems are the unsung heroes behind many AI applications, quietly working their magic in fields ranging from medical diagnosis to financial planning.

In this article, we'll dive into the fascinating realm of expert systems and learn how to implement a backward chaining resolver using Python. By the end, you'll have the knowledge to create your own miniature AI brain! 🧠💻

## What is an Expert System?

An expert system is like a digital Sherlock Holmes. It uses a set of **facts and rules** to deduce answers to queries, much like our favorite detective uses clues to solve mysteries. This **deduction system** is invaluable for decision-making and proving hypotheses, serving as a cornerstone in the grand edifice of artificial intelligence.

![Expert System Components](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OQEJ09LSoMy5favPdGmRtQ.png)

## The Building Blocks of Our Expert System

### Rules: The Logical Lego Pieces

![Rules Visualization](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3618kjRpRPZ8yUwjTEa9SA.png)

At the heart of our expert system lie the **rules**. Think of them as logical Lego pieces that we can combine to build complex reasoning structures. These rules are equations that mix `facts` (represented by uppercase letters) with `connectors`:

- `&`: **AND**—The Swiss Army knife of logic. All operands must be `True`.
- `|`: **OR**—The easy-going connector. Only one operand needs to be `True`.
- `^`: **XOR**—The picky eater. One operand must be `True`, but not both.
- `=>`: **IMPLY**—The "if-then" mastermind. If the left side is `True`, the right side must follow suit.

### The Inference Truth Table: Logic's Cheat Sheet

![Inference Truth Table](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZ-xKiHeAcPBCnP2bgcOTQ.png)

This table is our logical compass. It guides us through the treacherous waters of inference. For instance, in the case of `p => q`, if `p` is `false`, `q` becomes a wild card–it could be either `true` or `false`. But if `p` is `true`, `q` must toe the line and be `true` as well.

### Facts and Queries: The System's Input and Output

![Facts and Queries](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qr7VSqmln95Si329hAIX4A.png)

**Facts** are the building blocks of our knowledge base, represented by uppercase letters. By default, they're all false (our system is a bit pessimistic). A fact can become true either through initial declaration (`=XXX`) or by logical deduction from the rules.

**Queries**, marked with `?XXX`, are the questions we pose to our digital oracle.

## Crafting the Resolver: A Tale of Two Approaches

### Forward vs. Backward Chaining: Choose Your Adventure

When it comes to solving an expert system, we have two paths:

1. **Forward chaining**: The eager beaver approach. We start with the facts and work our way to the conclusion.
2. **Backward chaining**: The lazy genius method. We begin with the hypothesis and trace back to the supporting facts.

In this article, we'll focus on the backward resolver. It's like solving a mystery novel by starting with the last page!

## The Data Structure: Building Our Logical Lego Set

### The Node Class: The Versatile Building Block

![Node Class](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qdOZI0gZsK-ppQ7NFhdEzg.png)

Nodes are the Swiss Army knives of our system. They handle logic, store states, and connect with other nodes through the `children` list. For example, in the rule `A => B`, `A` is the child of `=>`, which is the child of `B`. If `A` is true, we can deduce that `B` is true.

### AtomNode and ConnectorNode: The Specialized Tools

![AtomNode Class](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*effi4JDwJZETJinrhcF5ZQ.png)

![ConnectorNode Class](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vq9IFTiRDtsCgRMd3jlM8A.png)

These classes inherit from the Node class, adding specialized behaviors for atoms (like A, B, C) and connectors (AND, XOR, OR, IMPLY).

## The Resolver: Bringing It All Together

### Step 1: Creating a Unique Atom List

First, we parse the input and create a list of unique atoms. It's like creating a cast of characters for our logical play–each letter in different rules points to the same `AtomNode` instance.

### Step 2: The RPN Magic

![RPN Representation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*m27ch2wzXuwq6C0FLKAlqw.png)

We use the Reverse Polish Notation (RPN) to represent our rules. It's like writing a recipe where you list the ingredients before the cooking method. This notation has several perks:

- It maintains the order of operands
- You read it from left to right (no more mental gymnastics!)
- Operands vanish as they're used, replaced by the calculated value

### Step 3: Connecting the Dots

![Node Relations](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3jj8f3eJ_yLxGOAxBlVItw.png)

We create relationships between nodes, building our logical network.

### Step 4: The Grand Finale - Resolving Queries

![Query Resolution](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QK1uVVixYp0su7ju6bikqQ.png)

Finally, we put our system to work, resolving the queries and unveiling the logical truths hidden within our rules and facts.

## Conclusion: Your Journey into Expert Systems

Congratulations! You've just taken your first steps into the world of expert systems. We've covered the basics of implementing a backward chaining resolver in Python, from understanding the core concepts to building the data structures and resolver steps.

Remember, this is just the tip of the iceberg. Expert systems have countless applications and variations. If you're hungry for more, why not try implementing a forward chaining resolver or expanding the system to handle more complex rules?

For those ready to dive deeper, I've prepared a complete Python implementation in [this GitHub repository](https://github.com/jterrazz/42-expert-system?source=post_page-----bf7d8924f72f--------------------------------). Feel free to explore, experiment, and expand upon it!

Happy coding, and may your expert system adventures be logical and bug-free! 🚀🧠