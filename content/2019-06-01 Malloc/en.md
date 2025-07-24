![](assets/thumbnail.jpg)

# Master memory management: I built my own malloc, and you should too

Ever stop and think about how your computer is actually shuffling trillions of bytes around every second? 🤹‍♂️ It's a question that always fascinated me. So, I decided to peek behind the curtain and dive into one of the most fundamental pieces of the puzzle: **dynamic memory allocation**.

In this post, I'll walk you through why `malloc` even exists, how it works on a deep level, and how I built my own version from scratch using the `mmap` system call. If that sounds complex, don't worry. I'm going to break it down from first principles. For me, grappling with this was a real "aha!" moment. And if you want to get your hands dirty, my [completed project is on GitHub](https://github.com/jterrazz/42-malloc). Let's get into it. 🚀

```c
// These are the functions we're going to build.
void  malloc(size_t size);
void  free(void* ptr);
void  realloc(void* ptr, size_t size);
void  calloc(size_t count, size_t size);

// This is how we'll ask the OS for memory.
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
int   munmap(void* addr, size_t len);

// And these help us set some ground rules.
#include <sys/resource.h>

int   getrlimit(int resource, struct rlimit* rlp);
int   setrlimit(int resource, const struct rlimit* rlp);
```

## Memory: the rigid, the fleeting, and the on-demand

Let's quickly touch on how C normally handles memory. It's a pretty rigid system.

- **Static and global variables**: These are set in stone when you compile. They exist from the moment the program starts to the second it stops, living right alongside the code itself.
- **Automatic variables**: These are the ones inside functions. They get created on the "stack" when a function is called and disappear the moment the function returns.

This works, but it has two massive limitations:

1. **You need to know the size of everything upfront.** You can't just create an array and decide how big it is later.
2. **You're stuck with a fixed lifespan.** The memory either lasts forever or for the duration of a single function call. Nothing in between.

This is why we need dynamic allocation. It's for all the situations where you don't know the "what" or the "when" at compile time.

### The kernel's power tool: `mmap`

```c
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
```

So, how do we get memory on demand? We have to ask the operating system. The kernel provides a powerful tool for this called a **system call**. The specific one I focused on is `mmap()`. Think of it as a direct line to the OS, asking it to reserve a chunk of physical memory and map it to a virtual address in our program. It's the ultimate source of memory. 🌌

There's another tool called `sbrk`, but for this project, `mmap` is our weapon of choice. It's incredibly flexible for managing memory regions.

### If `mmap` is the source, why bother with `malloc`?

This was the first big question for me. If `mmap` gives us memory, why don't we just call it every time we need a new variable?

The answer is performance. System calls are expensive. They require a context switch from your program to the kernel, which is a time-consuming operation. Most applications request and release little bits of memory thousands of times a second. If every single one of those requests was a full-blown system call, our programs would grind to a halt.

This is where `malloc` comes in. It's a clever middleman. Instead of you going to the kernel for every little thing, `malloc` goes once and requests a huge chunk of memory. Then, it manages that chunk for you. When you ask for a bit of memory, `malloc` just slices off a piece from the chunk it's already holding. Yes, this adds a little bit of overhead (the `malloc` library itself uses some memory), but the speed gain is enormous. It's a classic engineering trade-off.

## Let's build this thing: my implementation

### The library: the memory toolkit

My `malloc` library provides the classic trio:

- `malloc`: Asks for a block of memory and returns a pointer to it.
- `free`: Takes that pointer back when you're done and marks the memory as available.
- `realloc`: Lets you resize a block of memory you already allocated, keeping the original data.

### The data structure: how I organized memory

To make this work, I had to decide how to keep track of everything. I settled on a two-level hierarchy:

- **Heap**: A large region of memory I request from the OS using `mmap`.
- **Block**: A smaller piece of a heap that I hand out when `malloc` is called.

Both of these need some metadata. I put a small header at the beginning of each heap and each block to store information. After a single `malloc` call, the memory map looks something like this:

![Heap and Block Structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iXHfrEUza03cFe5IXEvs0Q.png)

Here are the C `structs` I defined for that metadata:

```c
// Metadata for a whole mmap'd region
typedef struct s_heap {
  struct s_heap   *prev;
  struct s_heap   *next;
  t_heap_group    group; // TINY, SMALL, or LARGE
  size_t          total_size;
  size_t          free_size;
  size_t          block_count;
} t_heap;

// Metadata for a single allocated block
typedef struct s_block {
  struct s_block  *prev;
  struct s_block  *next;
  size_t          data_size;
  bool            freed;
} t_block;
```

By giving each block `next` and `prev` pointers, I effectively created a linked list. This lets me walk through the heap to find free spots or to find the neighbors of a block I want to `free`.

These little macros were helpers to quickly jump from the start of a heap or block to the user-data area.

```c
#define HEAP_SHIFT(start)   ((void*)start + sizeof(t_heap))
#define BLOCK_SHIFT(start)  ((void*)start + sizeof(t_block))
```

### Performance strategy: not all allocations are equal

I quickly realized that treating a 10-byte allocation the same as a 10-megabyte allocation was a bad idea. To optimize, I created three categories: `TINY`, `SMALL`, and `LARGE`. My strategy was to pre-allocate memory pages for `TINY` and `SMALL` requests, aiming to fit at least 100 blocks in each heap. `LARGE` blocks are the exception; they are allocated one-off without pre-allocation since they're usually rare.

A quick pro-tip I learned: it's far more efficient to make your heap sizes a multiple of the system's page size. You can get this with `getpagesize()` (or `getconf PAGE_SIZE` in the terminal). On my machine, it's 4096 bytes.

So, I did some math to define my heap sizes:

```c
// One page can hold 128 tiny blocks
#define  TINY_HEAP_ALLOCATION_SIZE   (4 * getpagesize())
#define  TINY_BLOCK_SIZE             (TINY_HEAP_ALLOCATION_SIZE / 128)

// Four pages can hold 128 small blocks
#define  SMALL_HEAP_ALLOCATION_SIZE  (16 * getpagesize())
#define  SMALL_BLOCK_SIZE            (SMALL_HEAP_ALLOCATION_SIZE / 128)
```

### The `malloc` algorithm: finding a home for data

When a `malloc` call comes in, here's the logic my code follows:

1. It first looks at a global pointer to see if any heaps already exist.
2. It then walks through the list of heaps, looking for a free block that's big enough. I used the **first-fit** strategy: grab the first one that works. It's simple and fast.
3. If it gets to the end of a heap and there's still room, it just adds a new block there.
4. If the last heap is totally full, it's time to ask the OS for more land by calling `mmap`.

```c
// The system call to create a new heap.
void *heap = (t_heap *)mmap(NULL, heap_size, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANON, -1, 0);
```

### `free` and the fragmentation problem

![Memory Fragmentation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y7xikxHO1Yoyv1eZm7l6aA.png)

When `free` is called, simply marking a block as "available" is easy, but it creates a problem called **fragmentation**. You end up with lots of small, useless holes in your memory, like a game of Tetris gone wrong.

To fight this, I implemented a couple of key strategies:

- **Coalescing:** When a block is freed, I check if its neighbors are also free. If so, I merge them into one larger free block.
- **Returning memory:** If the block being freed is the very last one in a heap, and I have other heaps available, I just release the entire empty heap back to the OS with `munmap`. No point in holding onto empty memory.

```c
// Give the memory back to the kernel.
munmap(heap, heap->total_size);
```

### `realloc`: the shape-shifter

`realloc` often boils down to a simple recipe: `malloc` a new block of the desired size, `memcpy` the data from the old block to the new one, and then `free` the old block.

One edge case to be aware of is `realloc(ptr, 0)`. The behavior here can vary. I took a "lazy" approach and just returned the original pointer. You should know, however, that some standards say this should be equivalent to `free(ptr)`. My advice: don't use `realloc` to `free` memory. Use the right tool for the job.

## Putting it to the test

The most rewarding part was seeing my `malloc` run real-world programs. I wrote a little script to force the dynamic linker to load my library instead of the standard system one.

```sh
#!/bin/sh
export DYLD_LIBRARY_PATH=.
export DYLD_INSERT_LIBRARIES=libft_malloc.so
export DYLD_FORCE_FLAT_NAMESPACE=1
$@
```

Saving this as `run.sh` let me do things like `sh run.sh ls -l` or `sh run.sh vim` and see if they worked.

### The `vim` crash and the alignment lesson

And of course, they didn't all work at first. `ls` was fine, but running `vim` immediately caused a segmentation fault. What was going on?

The culprit was **memory alignment**. It turned out that the standard `malloc` on macOS (where I was testing) doesn't just return any pointer. It guarantees the address is a multiple of 16. Certain programs and instructions rely on this for performance. My `malloc` didn't, and `vim` crashed.

The fix was a simple but powerful bitwise trick: `size = (size + 15) & ~15;`. This one line ensures that the size is always a multiple of 16, and thus the returned address will be properly aligned. A crucial lesson learned.

And that's the journey! We went from the kernel's `mmap` call all the way to a functioning, tested `malloc` library. For me, this project wasn't just about writing code; it was about demystifying a fundamental part of how our machines operate.

This was a powerful reminder that practice is everything. If you want to dig deeper, I encourage you to check out the [complete implementation on my GitHub](https://github.com/jterrazz/42-malloc). Fork it, break it, and make it better. When you truly understand the foundation, you gain the power to build anything on top of it. Happy coding.
