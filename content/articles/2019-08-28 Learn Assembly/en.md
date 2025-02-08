![](assets/thumbnail.jpg)

# Dive into Assembly: Crafting Your First Functions (Intel x86–64 syntax)

Ever wondered what's happening under the hood of your computer? While C is often considered a low-level language, it still abstracts many of the **raw instructions** executed by your processor. That's where Assembly comes in–the language that speaks directly to your machine's heart. 🖥️💓

In this article, we'll equip you with the essential tools to understand and create your own Assembly functions. So, put on your hard hat, and let's start building! 👷‍♂️🔧

## Getting Started: The Assembly Playground

Assembly language varies depending on your processor's architecture. We'll focus on the Intel x86–64 syntax, the lingua franca of most desktop computers.

### Your Toolkit: NASM and Friends

To begin your Assembly adventure, you'll need:

1. A text editor (your trusty code sword ⚔️)
2. The NASM compiler (your magic wand for transforming Assembly into machine code 🪄)

Here's how you use NASM:

```sh
# Install nasm on MacOS
brew install nasm

# Compile assembly files
nasm -f macho64 <asm_file>.s -o <object_file>.o
ar rcs <exec_name> <object_files>
```

> **Pro Tip:** The `-f` argument specifies the output format. For instance, `macho64` is the format for modern macOS executables.

### Debugging: Your Assembly Detective Kit 🕵️‍♂️

As you venture deeper into Assembly, debugging tools will become your best friends. Get acquainted with `lldb` and `gdb`–they'll help you solve the mysteries of your code.

[Learn more about debugging x86-64 Assembly here](https://nickdesaulniers.github.io/blog/2016/01/20/debugging-x86-64-assembly-with-lldb-and-dtrace/?source=post_page-----43c2032ebfda--------------------------------)

## The Language of the Machine

Assembly is like a choreographed dance of commands for your processor. Each line represents a single step–one instruction for your CPU to execute.

### Assembly vs. Machine Code: Not Twins, but Close Cousins

A common misconception is that Assembly and machine code are identical. While they're closely related, they're not the same:

- **Machine Code:** The binary language your computer ultimately executes.
- **Assembly:** A human-readable representation that still requires compilation.

Assembly offers several advantages:

1. **Readability:** Easier for humans to understand
2. **Structure:** Allows for better program organization (variables, macros, sections)
3. **Abstraction:** A thin layer above raw binary, but still very close to the metal

### Anatomy of an Assembly File

An Assembly file (`.s`) is typically divided into four main sections:

```python
# SECTION: Initialized data
.data
my_str db "001101" # You can save strings and adds the terminating /0     
my_var db 0 # The integer i is initialized to 0
# db 1 declares 1 byte (b = byte)
# dw 1 declares 2 bytes (w = word)
# dd 1 declares 4 bytes (d = doubleword)
# dq 1 declares 8 bytes (q = quadword)

# SECTION: Constant data
.rodata
my_var db 6
# Same as .data but the data can't be changed

# SECTION: Uninitialized data     
.bss
my_var: resb 4 # Allocates 4 uninitialized bytes
# resb 1 allocates 1 byte (b = byte)
# resw 1 allocates 2 bytes (w = word)
# resd 1 allocates 4 bytes (d = doubleword)
# resq 1 allocates 8 bytes (q = quadword)
```

1. **data:** Initialized data storage
2. **rodata:** Read-only data (constants)
3. **bss:** Uninitialized data storage
4. **text:** Where the actual code logic resides

If no section is specified, `.text` is the default–that's where the action happens!

### Memory: Your Assembly Playground

In the world of Assembly, you have three types of memory at your disposal:

1. **Registers:** Lightning-fast, but limited in number
2. **Memory Addresses (RAM):** Vast storage, but slower to access
3. **Constants:** Immutable values embedded in your code

![Memory Types](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N6b1GTJFRIUNdcqCwrHAZA.png)

### The Register Family

Registers are like the VIP lounge of memory–exclusive and fast. Here are the key players:

#### General-Purpose Registers

- `rax`, `rbx`, `rcx`, `rdx`: The workhorses of Assembly instructions
		- `a`: Accumulator (often for arithmetic)
		- `b`: Base (often for memory addressing)
		- `c`: Counter (loops, anyone?)
		- `d`: Data (general data operations)

#### Index Registers

- `EDI`: Destination index
- `ESI`: Source index
- `EBP`: Stack base pointer
- `ESP`: Stack pointer
- `EIP`: Instruction pointer (next instruction's address)

#### Segment Registers

For simple functions, you can usually ignore these: `CS`, `DS`, `SS`, `ES`, `FS`, `GS`

## The Assembly Instruction Set: Your Programming Toolkit

Each line in Assembly is a single instruction, typically following this format:

```asm
COMMAND ARG1, ARG2
```

Let's explore some essential instructions:

### Data Movement: The Assembly Shuffle

**mov**—`<dst> [reg, mem]`, `<src> [reg, mem, const]`
Copies data from `src` to `dst`. It's like teleportation for data! 🌟

**push**—`<data> [reg, mem, const]`
Adds data to the top of the stack. Think of it as stacking plates.

**pop**—`<dst> [reg, mem]`
Removes the top item from the stack and puts it in `dst`. Like taking the top plate off the stack.

**lea**—`<dst> [reg]`, `[<src>] [mem]`
"Load Effective Address"–Saves the address of `src` in the register. It's like remembering where you put something without actually moving it.

### Math Operations: Assembly Arithmetic

**add**—`<dst> [reg]`, `<src> [reg]`
Adds `src` to `dst` and stores the result in `dst`.

**sub**—`<dst> [reg]`, `<src> [reg]`
Subtracts `src` from `dst` and saves the result in `dst`.

**dec**—`<dst> [reg]`
Decreases the given register by 1. It's like a tiny countdown.

**inc**—`<dst> [reg]`
Increases the given register by 1. Small steps, big results!

### Control Flow: Navigating Your Code

**call**—`<function_name>`
Calls a function. It's like shouting "Hey, function_name, do your thing!"

```python
extern malloc

.text
call malloc # We will see arguments in the calling convention section

# Result is stored in rax
```

**jmp**—`<dst_location>`
Unconditional jump to a section. Like teleporting in your code!

```python
.text

my_section_1:
...
jmp my_section_2 # Go at my_section_2
... # Will be skipped

my_section_2:
jmp my_section_1 # Go at my_section_1
```

**j<condition>**—`<dst_location>`
Conditional jump. It's like a "Choose Your Own Adventure" for your code.

### Comparison and Testing

**cmp**—`<reg0> [reg]`, `<reg1> [reg]`
Compares `reg0` and `reg1`, setting flags for conditional jumps.

**test**—`<reg0> [reg]`, `<reg1> [reg]`
Performs a bitwise AND between `reg0` and `reg1`, setting flags.

```python
extern ft_ isalpha
extern ft_isdigit

.text
_ft_isalnum:
call _ft_isalpha # Returns 1 in rax if isalpha
test rax, rax
jnz is_alnum # If not 0, then jump

call _ft_isdigit # Returns 1 in rax if isdigit
test rax, rax
jnz is_alnum # If not 0, then jump

is_not_ alnum:
xor rax, rax # Sets return to 0
ret

is_alnum:
mov rax, 1 # Sets return to 1
ret
```

**ret**
Ends the function and returns to the caller. Like saying "My job here is done!"

## Calling Conventions: The Assembly Etiquette

When functions talk to each other in Assembly, they follow certain rules. For example, arguments are often passed in this order: `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, and `%r9`.

[Dive deeper into calling conventions here](https://stackoverflow.com/questions/2535989/what-are-the-calling-conventions-for-unix-linux-system-calls-and-user-space-f?source=post_page-----43c2032ebfda--------------------------------)

### Syscalls: Talking to the Kernel

The kernel provides many system calls for interacting with the OS. It's like having a direct hotline to the core of your computer!

[Check out the complete syscall list here](https://syscalls.kernelgrok.com/)

## Putting It All Together: A Simple Example

Let's look at a basic Assembly function: `ft_isascii`

![ft_isascii function](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Zeu7RMnWR6HT_7ij3-9kVA.png)

This function checks if a given character is within the ASCII range. It's like a bouncer for the ASCII club! 🚫🎉

### Memory and the Stack: A Deeper Dive

The intricacies of memory management and stack operations in Assembly deserve their own spotlight. Stay tuned for a future article where we'll unravel these mysteries!

## Resources for Your Assembly Journey

- [x86-64 Cheatsheet](https://cs.brown.edu/courses/cs033/docs/guides/x64_cheatsheet.pdf): Your quick reference guide
- [Instruction List](http://faydoc.tripod.com/cpu/index.htm): An extensive catalog of Assembly instructions

Ready to flex your Assembly muscles? Check out my repo where I've implemented various basic functions in Assembly. It's like a playground for low-level coding enthusiasts! 😊

Remember, mastering Assembly is like learning to speak directly to your computer. It takes time and practice, but the insights you gain are invaluable. Happy coding, and may your registers always be full! 🖥️💪
