![](assets/thumbnail.jpg)

# Master Memory Management: Create Your Own Malloc Library from Scratch

Have you ever wondered how your computer juggles all those bytes behind the scenes? 🤹‍♂️ Well, buckle up, because we're about to dive deep into the fascinating world of **dynamic memory allocation**!

In this article, we'll unravel the mysteries of `malloc`—its raison d'être, its inner workings, and most excitingly, how to build it yourself using `mmap/munmap` functions and some clever memory handling algorithms. Don't worry if that sounds like a mouthful; we'll break it down step by step. And for those who love to get their hands dirty with code, I've got a treat for you: my [completed project is available on GitHub](https://github.com/jterrazz/42-malloc) for your perusal and tinkering pleasure. So, let's roll up our sleeves and become memory management maestros! 🎩✨

```c
// We will implement these methods
void  malloc(size_t size) ;
void  free(void ptr);
void  realloc(void ptr, size_t size);
void  calloc(size_t count, size_t size);

// Calls to request memory
#include <sys/mman.h>

void  mmap(void addr, size_t len, int prot, int flags, int fd, off_t offset);
int   munmap(void addr, size_t len);

// Calls to limit our memory calls
#include <sys/resource.h>

int   getrlimit(int resource, struct rlimit rlp);
int   setrlimit(int resource, const struct limit rlp);
```

## Memory Management: The Good, The Bad, and The Dynamic

Let's start with a quick refresher on how C manages variables in memory. It's like a well-organized library, but with some quirks:

- **Static and global variables**: Think of these as the reference section. They're always there, from the moment the program starts until it ends. They live in the main memory alongside the program's code.
- **Automatic duration variables**: These are like short-term loans. They pop into existence when a function is called and vanish when it returns. You'll find them hanging out on the stack.

Now, this system works great for many things, but it has two major limitations:

1. **Size Rigidity**: Imagine trying to fit a novel into a bookshelf when you don't know how many pages it has. That's the problem with compile-time allocation—you need to know the size in advance.
2. **Lifespan Inflexibility**: It's like books that can only be checked out for a fixed duration. Sometimes you need more flexibility in when to create or destroy variables.

Enter the hero of our story: dynamic allocation! 🦸‍♂️

### Dynamic Allocation and Mmap: The Dynamic Duo

```c
#include <sys/mman. h>

void mmap(void addr, size_t len, int prot, int flags, int fd, off_t offset);
```

Here's where things get interesting. The UNIX kernel, in its infinite wisdom, provides us with a superpower called a **system call**. One such call is the `mmap()` function, which acts like a magical bridge between physical memory and virtual addresses. It's like having a teleporter for data! 🌌

While `mmap` is our focus today, it's worth noting that there's another contender in town: [sbrk](http://manpagesfr.free.fr/man/man2/brk.2.html). Both are tools in our memory management utility belt, but `mmap` is particularly adept at juggling memory and virtual addresses.

### Malloc: The Unsung Hero

Now, you might be wondering, "If `mmap` can give us memory, why do we need `malloc`?" Excellent question, dear reader! 🧐

Imagine if every time you needed a new piece of paper, you had to go to the store. That's essentially what happens with system calls—they're time-consuming. Most programs are memory gluttons, constantly requesting and releasing memory. If we made a system call for each of these operations, our programs would crawl along like snails in molasses.

This is where `malloc` swoops in to save the day. Think of it as your personal paper hoarder. It grabs a big stack of paper (memory) in advance, so when you need a sheet, it's right there waiting for you. Sure, you might have a bit of extra paper lying around (a small memory overhead), but the speed boost is well worth it!

## Implementation: Let's Build This Thing

### The Library: Your Memory Management Toolkit

The `malloc` library is like a Swiss Army knife for memory management. Here's what it offers:

- `malloc`: Allocates a block of memory and hands you the keys (a pointer to its start).
- `free`: When you're done with the memory, you give the keys back to `free()`, and it takes care of the cleanup.
- `realloc`: Need more (or less) space? `realloc` has got you covered. It adjusts the size of your memory block while keeping your data intact.

### Data Structure: The Blueprint of Our Memory Kingdom

Let's break down the architecture of our memory management system:

- **Heap**: This is a memory zone allocated by `mmap`. Think of it as a large plot of land.
- **Blocks**: These are the buildings on our land. Each heap is filled with blocks.

Both heaps and blocks have metadata at their start, like a signpost giving information about the property. Here's what a heap with one block looks like (imagine this after a single `malloc` call):

![Heap and Block Structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iXHfrEUza03cFe5IXEvs0Q.png)

Let's get a bit more technical with our metadata structures:

```c
typedef struct s_heap {
  struct s_heap   *prev;
  struct s_heap   *next;
  t_heap_group    group;
  size_t          total_size;
  size_t          free_size;
  size_t          block_count;
} t_heap;

typedef struct s_block {
  struct s_block  *prev;
  struct s_block  *next;
  size_t          data_size;
  bool            freed;
} t_block;
```

By chaining blocks with `next` and `prev` pointers, we create a linked list of memory blocks. This allows us to navigate through the heap and access any block we need. It's like creating a map of our memory kingdom!

```c
#define HEAP_SHIFT(start)   ((void *)start + sizeof(t_heap))
#define BLOCK_SHIFT(start)  ((void *)start + sizeof(t_block))
```

### Performance: Size Matters

To make our memory allocation more efficient, we categorize blocks into three sizes: `SMALL`, `TINY`, and `LARGE`. It's like having different-sized moving boxes for different items. As a rule of thumb, we aim to fit at least 100 `SMALL` and `TINY` blocks inside their own heap. `LARGE` blocks, being the odd ones out, don't get the preallocation treatment.

Here's a pro tip: When defining the size of a heap, it's more efficient to use a multiple of the system's page size. You can find this value using the `getpagesize()` function or by running `getconf PAGE_SIZE` in your terminal. On my system, it's 4096 bytes.

Let's crunch some numbers to determine our heap sizes:

```c
#define  TINY_HEAP_ALLOCATION_SIZE   (4 * getpagesize())
#define  TINY_BLOCK_SIZE             (TINY_HEAP_ALLOCATION_SIZE / 128)
#define  SMALL_HEAP_ALLOCATIONSIZE   (16 * getpagesize( ))
#define  SMALL_BLOCK_SIZE            (SMALL_HEAP_ALLOCATION_SIZE / 128)
```

### The Malloc Algorithm: Finding the Perfect Spot

When `malloc` is called, it's like a real estate agent looking for the perfect property. Here's how it goes about its search:

1. It checks its records (a global variable) for any existing heap lists.
2. It tours each heap, looking for a suitable vacant space using the [first fit strategy](https://www.quora.com/With-the-help-of-the-examples-that-you-also-provide-what-are-the-first-fit-next-fit-and-best-fit-algorithms-for-memory-management/answer/Varun-Agrawal-1). This means it grabs the first free block that's big enough.
3. If no suitable block is found, it adds a new block to the end of the last heap.
4. If the last heap is full, it creates a new heap by calling `mmap` (time to buy more land!).

```c
void *heap = (t_heap *)mmap(NULL, heap_size, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANON, -1, 0) ;
```

### Free and the Fragmentation Problem: Memory Tetris

![Memory Fragmentation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y7xikxHO1Yoyv1eZm7l6aA.png)

When `free` is called, it marks the requested block as available. However, this can lead to a fragmentation problem, much like a game of memory Tetris where the pieces don't quite fit together.

To combat this, we employ a few strategies:

- If adjacent blocks are free, we merge them (combining Tetris pieces).
- If it's the last block in the heap and we have more than one preallocated heap, we return the memory to the system using `munmap`.

```c
munmap (heap, heap->total_size);
```

### Realloc: The Shape-shifter

Think of `realloc` as a shape-shifting spell for your memory blocks. It's essentially a combination of `malloc`, `memcpy`, and `free`.

A word of caution: if you call `realloc` with a size of zero, the behavior can vary. In my implementation, I chose a "lazy" approach that simply returns the original pointer. However, it's important to note that `realloc(ptr, 0)` should not be used as a substitute for `free`. Always use the right tool for the job!

## Testing: Putting Our Creation to Work

The best way to test our `malloc` implementation is to use it in real-world scenarios. Let's create a simple script to inject our malloc into existing commands:

```c
#!/bin/sh
export DYLD_LIBRARY_PATH=.
export DYLD_INSERT_LIBRARIES=libft_malloc.so
export DYLD_FORCE_FLAT_NAMESPACE=1
$@
```

Save this as `run.sh` and use it like so: `sh run.sh ${CMD}`. Now you can test your malloc with commands like `ls` or `vim`!

### A Note on Memory Alignment

During my testing, I encountered an interesting quirk: certain commands like `vim` would cause a segmentation fault on MacOS. The culprit? Memory alignment.

It turns out that the MacOS `malloc` aligns data on 16-byte boundaries. To implement this in our version, we can use a simple trick: `size = (size + 15) & ~15`. This ensures our memory allocations play nicely with MacOS expectations.

And there you have it, folks! We've journeyed through the intricate world of memory management, built our own `malloc` library, and even tackled some real-world challenges along the way. I hope this deep dive has illuminated the inner workings of memory allocation for you.

Remember, practice makes perfect. If you want to explore further or need a reference, don't forget to check out the [complete implementation on my GitHub](https://github.com/jterrazz/42-malloc). Happy coding, and may your memory always be well-managed! 🚀🧠
