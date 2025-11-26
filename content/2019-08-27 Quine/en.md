![](assets/thumbnail.jpg)

# Building a program that writes itself (a quine)

I've always been fascinated by a simple, almost paradoxical question: can a program write its own code? This isn't just a philosophical curiosity; it's a real coding challenge. Welcome to the rabbit hole of **quines**.

## The challenge

The challenge is to write a program whose sole output is its own source code. The rules are simple but strict:

1. **Self-replication:** The program's output must be an exact copy of its source code.
2. **No peeking:** You can't just open the source file and print its contents. That's cheating.
3. **No input:** The program must be completely self-contained. It can't ask for any input to do its job.

It sounds like a magic trick, but it's pure logic. Let's break down the logic behind the magic.

## The theory behind the magic: Kleene's theorem

Long before we had programming languages that could easily build quines, a mathematician named Stephen Kleene proved it was possible. His work in the 1930s laid the foundation for self-replicating programs.

### First form, The fixed-point theorem

Kleene's first recursion theorem, a cornerstone of computability theory, states that for any computable function `f`, you can find a program `e` that behaves in a special way.

Essentially, transforming the program's logic (`e`) with the function `f` produces the same result as just running the program `e` directly.

`ϕe(x) = f(e,x)`

- `e` is the program's logic.
- `ϕe` is its syntax (the code itself).
- `x` is any input.
- `f` is a function that transforms the program.

This is wild because it proves that a program can meaningfully refer to itself.

### Second form, The quine theorem

This leads us to a conclusion that's even more direct and powerful for our purposes. For any computable function `f`, there exists a program `p` that acts as a "fixed point" for that function.

`p = f(p)`

In other words, a program `p` exists that, when you feed it into the function `f`, produces itself as the output. This is the theoretical green light for quines. It means that in any Turing-complete language, self-replication is possible.

## Let's build one

Theory is great, but code is better. Here are the specs for our quine, designed to prove it's more than just a simple trick:

1. **Print source without reading the file:** True self-replication.
2. **Include at least two comments:** Shows that even non-executable parts are replicated.
3. **Use at least two functions:** Demonstrates that structural complexity is possible.
4. **Perfect replication:** The command `diff <(./quine) quine.c` must produce no output, confirming the source and its output are identical.

### A solution in C

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

So, how does this sleight of hand work? The core trick lies in a two-part structure: a piece of data, and the code that uses that data.

The `get_str()` function returns a string that acts as a template for the entire program. It's riddled with `printf` format specifiers like `%1$c` (a character) and `%4$s` (a string). The `main` function fetches this template string and then feeds it *back into itself* using `printf`. It fills the placeholders with the ASCII codes for a newline (10), a tab (9), a double-quote (34), and the template string itself. Think of it as a blueprint that contains the instructions to print a perfect copy of itself.

## Where did the name "quine" come from?

The term was coined by Douglas Hofstadter in his Pulitzer-winning book, *Gödel, Escher, Bach*. He named it in honor of the philosopher **Willard Van Orman Quine**, who did extensive work on the logic of indirect self-reference.

Quine explored this concept with a paradox:

> "yields falsehood when preceded by its quotation" yields falsehood when preceded by its quotation.

This sentence is paradoxical because it asserts its own falsehood, much like how a programming quine contains a representation of itself. It's a beautiful bridge connecting the worlds of logic, philosophy, and code.

## Go deeper

This concept is more than just a clever party trick. When I was a student at 42 Paris, projects like *Dr. Quine* forced us to dive deep into these concepts, revealing how computer viruses can propagate. It fundamentally changes how you think about the relationship between code and data.

If you've caught the bug, there's a whole universe of self-replicating programs to explore. I've put some of my own work from 42 into a repository if you'd like to see more complex examples. You might just become a quine master yourself! 😊

Happy coding
