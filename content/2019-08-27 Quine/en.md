![](assets/thumbnail.jpg)

# Building a program that writes itself (a quine)

I've always been fascinated by a simple, almost paradoxical question: can a program write its own code?

This isn't just a philosophical curiosity; it's a rigorous coding challenge known as a **Quine**.

## The Challenge

The goal is to write a program whose sole output is an exact copy of its own source code. The rules are simple but strict:

1.  **Self-replication:** The output must match the source file byte-for-byte.
2.  **No Cheating:** You cannot open your own source file (e.g., `fopen(__FILE__)` is forbidden).
3.  **No Input:** The program must be self-contained; no external data allowed.

It sounds like a magic trick, but it is purely logical.

## The Theory: How It Works

The core problem is an infinite regress. If you want to print the code, you need a print statement. But that print statement is *part* of the code, so you need to print the print statement. And then you need to print the code that prints the print statement.

It feels like standing between two mirrors.

### The Solution: Code = Data

The trick to solving this is to separate the program into two parts:
1.  **The Template (Data):** A string containing the *structure* of the code.
2.  **The Actor (Code):** The logic that prints the template and fills in the missing pieces.

In C, this often looks like a `printf` statement that takes a string as a format, and then passes *that same string* as the argument to fill itself in.

## A Solution in C

Here is a C program that solves the challenge. It includes comments and multiple functions to prove it handles complexity.

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

### Deconstructing the Magic

1.  **The String:** `get_str()` returns the entire source code as a single string, but with placeholders.
    *   `%1$c` is a placeholder for a newline (ASCII 10).
    *   `%4$s` is a placeholder for the string itself.
2.  **The Print:** Inside `main`, we call `printf(str, 10, 9, 34, str)`.
    *   We pass the ASCII codes for newline (`10`), tab (`9`), and quote (`34`) to fix the formatting.
    *   Crucially, we pass `str` *into itself* to fill the `%4$s` placeholder.

The program uses the string as both the **instructions** (the format) and the **data** (the content).

## Why "Quine"?

The term was coined by Douglas Hofstadter in *Gödel, Escher, Bach*. He named it after the philosopher **Willard Van Orman Quine**, who studied the logic of self-reference.

Quine (the philosopher) famously crafted this paradox:
> "yields falsehood when preceded by its quotation" yields falsehood when preceded by its quotation.

It’s a sentence that talks about itself, just like our program.

## Why Does This Matter?

Beyond being a clever party trick, quines teach a fundamental concept in computer science: **code and data are interchangeable**.

This is the same mechanism that allows:
*   **Compilers** (programs that read code to write code).
*   **Viruses** (programs that copy themselves into other files).
*   **DNA** (biological data that encodes the instructions to build the organism that carries it).

It completely changes how you see a source file. It's not just a set of instructions; it's a pattern capable of reproducing itself.
