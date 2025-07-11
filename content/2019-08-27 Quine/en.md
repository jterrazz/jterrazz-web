![](assets/thumbnail.jpg)

# Building a Program That Writes Itself (A Quine)

I've always been fascinated by a simple, almost paradoxical idea: can a program build itself? This isn't just a philosophical question; it's a real coding challenge. Welcome to the rabbit hole of **quines**.

## The Challenge

The goal is to write a program that prints its own source code as its only output. The rules are simple but strict:

1. **Self-Replication:** The program's output must be an exact copy of its source code.
2. **No Peeking:** You can't just open the source file and print its contents. That's cheating.
3. **No Input:** The program has to be completely self-contained. It can't ask for any input to do its job.

It sounds like a magic trick, but it's pure logic. Let's break down how it's possible.

## The Theory Behind the Magic: Kleene's Theorem

Long before we had the programming languages to easily build quines, the concept was proven possible by a mathematician named Stephen Kleene. His work in the 1930s laid the foundation for self-replicating programs.

### First Form—The Fixed-Point Theorem

Kleene's first recursion theorem is a core concept in computability theory. It basically states that for any computable function `f`, you can find a program `e` that behaves in a special way.

Essentially, transforming the program's logic (`e`) with the function `f` produces the same result as just running the program `e` directly.

`ϕe(x) = f(e,x)`

* `e` is the program's logic.
* `ϕe` is its syntax (the code itself).
* `x` is any input.
* `f` is a function that transforms the program.

This is wild because it proves that a program can meaningfully refer to itself.

### Second Form—The Quine Theorem

This leads to a more direct and powerful conclusion for our purposes. For any computable function `f`, there's a program `p` that is a "fixed point" of that function.

`p = f(p)`

In other words, a program `p` exists that, when you feed it into the function `f`, produces itself as the output. This is the theoretical green light for quines. It means that in any Turing-complete language, self-replication is possible.

## Let's Build One

Theory is great, but code is better. Here are the specs for our quine, designed to show it's not just a simple trick:

1. **Print source without reading the file:** True self-replication.
2. **Include at least two comments:** Shows that even non-executable parts are replicated.
3. **Use at least two functions:** Demonstrates structural complexity is possible.
4. **Perfect replication:** The command `diff <(./quine) quine.c` must return nothing, proving the output and source are identical.

### A Solution in C

Here's a C program that meets all the criteria.

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

So how does this work? The core trick is a two-part structure: data and code that uses that data.

The `get_str()` function returns a string that is a template of the entire program, complete with `printf` format specifiers like `%1$c` (a character) and `%4$s` (a string). The `main` function fetches this template string and then feeds it *back into itself* using `printf`. It fills the placeholders with the ASCII codes for a newline (10), a tab (9), a double-quote (34), and the template string itself. It's a blueprint that contains the instructions to rebuild itself.

## Where Did the Name "Quine" Come From?

The term was coined by Douglas Hofstadter in his book *Gödel, Escher, Bach*. He named it after the philosopher **Willard Van Orman Quine**, who did extensive work on indirect self-reference.

Quine explored this concept with a paradox:

> "yields falsehood when preceded by its quotation" yields falsehood when preceded by its quotation.

This sentence is paradoxical because it asserts its own falsehood, much like how a programming quine contains a representation of itself. It's a beautiful link between logic, philosophy, and code.

## Go Deeper

This stuff isn't just a party trick. When I was a student at 42 Paris, we had projects like Dr. Quine that forced us to dive deep into these concepts as an introduction to how viruses can propagate. It fundamentally changes how you think about the relationship between code and data.

If you've caught the bug, there's a whole world of self-replicating programs to explore. I've put some of my own work from 42 into a repository if you want to see more complex examples. You might just become a quine master yourself! 😊

Happy coding
