![](assets/thumbnail.jpg)

# Let's dive into assembly and build our first functions (Intel x86-64)

I've always been obsessed with what happens deep inside a computer. You hear people call C a "low-level" language, but honestly, it's still a cushy layer of abstraction. It hides the raw, powerful instructions your processor is actually running.

If you want to talk directly to the metal, you need to learn its native tongue. That language is Assembly. 🖥️💓

This isn't just about theory. We're going to build things. I'll walk you through the tools and concepts so you can start writing your own assembly functions today. Let's get to it. 👷‍♂️🔧

## The setup: your assembly playground

First, a quick note: Assembly isn't a single language; it changes with the processor's architecture. We're going to focus on Intel x86-64, which is what most desktops and laptops are running these days.

### The toolkit: NASM

You don't need a heavy IDE or a complex toolchain. For me, it's just two things:

1. A simple text editor (whatever you're comfortable with ⚔️)
2. The NASM compiler (this turns our human-readable assembly into machine code 🪄)

On a Mac, getting NASM is a one-liner with Homebrew.

```sh
# Install nasm on MacOS
brew install nasm

# Compile an assembly file (.s) into an object file (.o)
nasm -f macho64 your_file.s -o your_file.o

# Link object files into an executable
ar rcs libyourstuff.a your_file.o
```

> A quick tip: that `-f` flag is crucial. It tells NASM the format for the output file. `macho64` is what modern macOS needs.

### Debugging: your secret weapon 🕵️‍♂️

Writing assembly without a debugger is like flying blind. You will make mistakes. Things will crash. `lldb` (on macOS) and `gdb` (on Linux) are your best friends for figuring out why. They let you step through your code one instruction at a time and see exactly what's happening in memory and the registers. Don't skip learning the basics of these tools.

## The language of the CPU

Think of assembly as a set of direct orders for your CPU. Each line is one single, tiny command.

### Assembly vs. machine code

People often use "assembly" and "machine code" interchangeably, but they aren't the same.

- **Machine Code:** This is the raw binary, the 1s and 0s, that the processor executes. It's completely unreadable for humans.
- **Assembly:** This is the human-readable version of machine code. We write in assembly, and then a compiler (like NASM) translates it into machine code.

Writing in assembly gives us a huge advantage over trying to write raw binary. It gives us structure: we can use labels for functions, define variables, and organize our logic into sections. It's the thinnest possible layer of abstraction over the hardware.

### The layout of an assembly file

I organize my assembly files (`.s`) into a few standard sections. This keeps things clean.

```asm
; SECTION: Initialized Data
; Stuff that has a value when the program starts.
.data
my_str db "hello world", 0 ; A string, terminated by a null byte (0).
my_var db 42                ; A single byte initialized to 42.
; db = 1 byte (byte)
; dw = 2 bytes (word)
; dd = 4 bytes (doubleword)
; dq = 8 bytes (quadword)

; SECTION: Read-Only Data
; Constants that shouldn't change.
.rodata
pi dq 3.14

; SECTION: Uninitialized Data
; A place to reserve memory without giving it an initial value.
.bss
my_buffer: resb 1024 ; Reserve 1024 bytes of space.
; resb = reserve bytes
; resw = reserve words
; resd = reserve doublewords
; resq = reserve quadwords

; SECTION: The Code
; This is where the logic lives.
.text
global _start ; Make the _start label visible to the linker.

_start:
    ; Your code goes here.
```

If you don't specify a section, the assembler usually defaults to `.text`. That's where the action is.

### Where your data lives

In assembly, you're constantly moving data around. You have three places to put it:

1. **Registers:** A small number of super-fast storage spots right inside the CPU. This is your go-to for calculations.
2. **Memory (RAM):** This is the huge pool of storage outside the CPU. It's much bigger than the registers, but also much slower to access.
3. **Constants:** Hard-coded values baked directly into your instructions.

![Memory Types](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N6b1GTJFRIUNdcqCwrHAZA.png)

### The registers

Getting to know the registers is key. They're your workbench. On x86-64, the main ones you'll use are:

#### General-purpose registers

These are the heavy lifters.

- `rax`: The "accumulator." Often used for return values from functions and in arithmetic.
- `rbx`: The "base" register. Can be used for anything, but sometimes used in memory addressing.
- `rcx`: The "counter." Often used for loops.
- `rdx`: The "data" register. Often used in multiplication and division, or just as a spare.

#### Index and pointer registers

These are for keeping track of memory locations.

- `rdi`, `rsi`: Destination and Source Index. Used heavily in operations that move blocks of memory. They are also the first two argument registers in function calls.
- `rbp`: Base Pointer. Used to keep track of the current function's "stack frame."
- `rsp`: Stack Pointer. Always points to the top of the stack.
- `rip`: Instruction Pointer. Points to the next CPU instruction to be executed. You can't change this one directly.

You can mostly ignore the Segment Registers (`CS`, `DS`, etc.) for simple programs.

## The instruction set: your toolbox

An assembly program is just a list of instructions. The format is usually `INSTRUCTION destination, source`. Let's look at the most common ones.

### Moving data around

**`mov`** `<dst>, <src>`
This is the most fundamental instruction. It copies the data from `src` to `dst`. The source can be a register, a memory address, or a constant. The destination has to be a register or a memory address. Think of it as the `=` operator of assembly.

**`push`** `<data>`
Takes a value and puts it on top of the stack. The stack is a region of memory for temporary storage. `push` is how you save things you'll need later.

**`pop`** `<dst>`
Takes the top value off the stack and puts it into your destination register or memory location. It's the reverse of `push`.

**`lea`** `<dst>, [<src>]`
This one is "Load Effective Address." It's a bit different from `mov`. Instead of loading the _value_ at the source address, it loads the _address itself_. Super useful for doing math on pointers.

### Doing math

**`add`** `<dst>, <src>`
`dst = dst + src`.

**`sub`** `<dst>, <src>`
`dst = dst - src`.

**`inc`** `<dst>`
Increments the destination by 1. Faster than `add dst, 1`.

**`dec`** `<dst>`
Decrements the destination by 1. Faster than `sub dst, 1`.

### Controlling the flow

**`call`** `<function_label>`
This jumps to a function, but it first `push`es the address of the next instruction onto the stack. This is how the CPU knows where to return to when the function is done.

```asm
extern malloc ; Tell the assembler we're using an external function

.text
call malloc  ; Call the malloc function
             ; The result (a memory address) will be in the rax register
```

**`jmp`** `<label>`
An unconditional jump. It just moves the execution pointer (`rip`) to a new location. This is your `goto`, the foundation for building loops.

```asm
.text
section_1:
    ; ... some code ...
    jmp section_2 ; Immediately jumps to section_2

    ; ... this code is skipped ...

section_2:
    jmp section_1 ; Creates an infinite loop
```

**`j<condition>`** `<label>`
A conditional jump. This is the heart of every `if` statement. It jumps only when certain flags, set by `cmp` or `test`, are met. For example, `jz` jumps if the result of the last comparison was zero.

### Comparing and testing

**`cmp`** `<reg1>, <reg2>`
Compares two registers by internally doing `reg1 - reg2`. It doesn't store the result, but it sets status flags (like the zero flag, sign flag, etc.). The conditional jump instructions then read these flags.

**`test`** `<reg1>, <reg2>`
This does a bitwise `AND` on the two operands and sets the flags based on the result. A common trick is `test rax, rax`. If `rax` is zero, the result of the `AND` is zero, which sets the zero flag. This is a very efficient way to check if a register is zero.

Here's how you might use these to build an `_ft_isalnum` function (checks if a character is alphanumeric):

```asm
extern ft_isalpha
extern ft_isdigit

.text
_ft_isalnum:
    call _ft_isalpha  ; Sets rax to 1 if the char is an alphabet
    test rax, rax     ; Check if rax is zero
    jnz is_alnum      ; If not zero (jnz), it was an alphabet. Jump.

    call _ft_isdigit  ; Otherwise, check if it's a digit (also returns 1 in rax).
    test rax, rax     ; Check if rax is zero
    jnz is_alnum      ; If not zero, it was a digit. Jump.

is_not_alnum:
    xor rax, rax      ; A clever way to set rax to 0 (anything XORed with itself is 0)
    ret               ; Return 0

is_alnum:
    mov rax, 1        ; Set rax to 1
    ret               ; Return 1
```

**`ret`**
When a function is done, `ret` `pop`s the return address from the stack and jumps back to it. It's how you end a function and give control back to the caller.

## Calling conventions: the rules of the road

How does one function know how to call another? How are arguments passed? How are return values sent back? This is all defined by a "calling convention." If you don't follow it, things break spectacularly.

For x86-64 on Linux and macOS, the first six integer/pointer arguments are passed in registers: `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9`. The return value is expected in `%rax`.

### Talking to the OS: syscalls

If you want to do anything interesting like read a file, print to the screen, or open a network connection, you need to ask the operating system's kernel for help. You do this with a "syscall." It's a special instruction that hands control over to the kernel to perform a privileged operation.

## Putting it all together: ft_isascii

Let's look at a really simple function. This one checks if the input character (passed in `rdi`) is a valid ASCII character (i.e., between 0 and 127).

![ft_isascii function](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Zeu7RMnWR6HT_7ij3-9kVA.png)

Breaking it down:

1. `xor rax, rax`: This is a fast way to set `rax` to 0. We're assuming the character is not ASCII until proven otherwise.
2. `cmp rdi, 0`: Compare the input character with 0.
3. `jl.end`: "Jump if Less." If the character is less than 0, it's not ASCII, so we jump to the end.
4. `cmp rdi, 127`: Compare the input character with 127.
5. `jg.end`: "Jump if Greater." If the character is greater than 127, it's not ASCII, so we jump to the end.
6. `mov rax, 1`: If we made it this far, the character is in the range. We set our return value `rax` to 1.
7. `.end:`: This is our exit label.
8. `ret`: Return to the caller. The value in `rax` is the result.

## Where to go from here

We've only scratched the surface. Understanding how the stack works in detail is a whole topic on its own. But this should be enough to get you started.

- [x86-64 Cheatsheet](https://cs.brown.edu/courses/cs033/docs/guides/x64_cheatsheet.pdf): Keep this handy. It's an invaluable quick reference.
- [Instruction List](http://faydoc.tripod.com/cpu/index.htm): A comprehensive list of x86 instructions.

I've put a bunch of my own implementations of standard C library functions in assembly up on a repo. Feel free to check it out and use it as a reference.

Learning assembly is a grind, I won't lie. But the insight it gives you into how computers _actually_ work is a kind of superpower. It'll change the way you write code, even in high-level languages.

Happy coding. May your registers always hold the right values. 🖥️💪
