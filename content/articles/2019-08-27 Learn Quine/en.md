![](assets/thumbnail.jpg)

# Build a Self-Replicating Program (Quine)

Have you ever wondered if a program could write itself? Welcome to the fascinating world of **quines**!

## The Challenge

The rules are deceptively simple:

1. Create a program that **outputs its own source code**.
2. **No cheating** allowed–opening and reading the source file is strictly forbidden.
3. The program must be **self-contained**–receiving any kind of input invalidates the quine.

Sounds impossible? Let's dive in and see how it's done!

## The Kleene's Theorem: A Theoretical Foundation

Before we get our hands dirty with code, let's explore the theoretical basis for quines. Enter **Kleene's theorem**, a concept that predates modern computers but lays the groundwork for our self-replicating programs.

### First Form—The Fixed-Point Theorem

Kleene's Fixed-Point Theorem is a fundamental concept in computability theory. Let's break it down:

For every **conditional program** `e`, there exists a program that satisfies:

`ϕe(x) = f(e,x)`

Where:

- `e` represents the program logic (the algorithm or function)
- `ϕe` represents its syntax (how the program is written)
- `x` is any input
- `f` is a computable function that takes the program and input as arguments

In simpler terms, this theorem guarantees the existence of a program whose execution results in its own source code. It's saying that for any computable function `f`, we can find a program `e` that, when given to `f` along with some input `x`, produces the same result as running `e` on `x`.

This is mind-bending because it suggests that programs can reference themselves in a meaningful way!

### Second Form—The Quine Theorem

Building on the first form, we can deduce a more specific and powerful statement:

For every computable function `f`, there exists a program `p` such that:

`p = f(p)`

In other words, there's always a program `p` that, when given as input to `f`, produces itself as output. This is the essence of a quine!

This form directly implies that for any programming language powerful enough to represent all computable functions, we can write a program that prints its own source code.

## Let's Build a Quine

Now that we understand the theoretical foundation, let's create our first quine. Here are the requirements, explained:

1. Print the source code without opening the file.
   - This ensures true self-replication without external dependencies.
2. Include at least two comments.
   - Comments demonstrate that even non-executable parts of the code can be replicated.
3. Use at least two functions.
   - This shows that quines can work with more complex program structures.
4. Ensure that `diff <(./quine) quine.c` returns nothing (indicating perfect replication).
   - This Unix command compares the output of running the quine with its source file.
   - If they're identical, `diff` will produce no output, confirming successful self-replication.

### A C Solution

Here's an example of a quine in C that meets our criteria:

```c
#include <stdio.h>

/*
   Hey, this is an outside comment
*/

char *get_str()
{
	return "#include <stdio.h>%1$c%1$c/*%1$c   Hey, this is an outside comment%1$c*/%1$c%1$cchar *get_str()%1$c{%1$c%2$creturn %3$c%4$s%3$c;%1$c}%1$c%1$cint main(void)%1$c{%1$c%2$c/*%1$c%2$c   Hey, this is an inside comment%1$c%2$c*/%1$c%2$cchar *str = get_str();%1$c%2$cprintf(str, 10, 9, 34, str);%1$c}%1$c";
}

int main(void)
{
	/*
	   Hey, this is an inside comment
	*/
	char *str = get_str();
	printf(str, 10, 9, 34, str);
}
```

Take a moment to analyze this code. Can you see how it manages to print itself?

## The Name "Quine"

You might be wondering about the origin of the term "quine." It's named after **Willard Van Orman Quine**, a philosopher who explored the concept of [indirect self-reference](https://en.wikipedia.org/wiki/Indirect_self-reference). His work in logic and philosophy laid the groundwork for understanding these self-referential programs.

## Want to Explore Further?

If you've caught the quine bug (pun intended), there's a whole world of self-replicating programs to discover! During my time at 42 Paris School, I worked on numerous quine-related exercises. Feel free to check out my repository for more challenging quine implementations. Who knows? You might just become a quine master yourself! 😊

Remember, the journey of a thousand quines begins with a single self-replicating step. Happy coding!
