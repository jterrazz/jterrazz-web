![](assets/thumbnail.jpg)

# Decoding the Magic: Building Your Own Nm and Otool

Have you ever wondered how your computer deciphers binary files? If you're curious about the inner workings of executables, you're in for a treat! Recently, I embarked on a journey to implement the **`nm`** and **`otool`** commands in C. This adventure not only deepened my understanding of binaries and Unix systems but also opened up a fascinating world of low-level programming.

In this article, I'll share everything you need to create your own implementations of these powerful tools. But first, a word of advice: I strongly encourage you to tackle this project on your own. The process of exploring **man pages** and system **header files** will sharpen your skills and deepen your understanding in ways that simply reading about it cannot match.

> **Note**: This implementation focuses on **Mach-O**, the current executable format for macOS. But don't worry if you're not on a Mac–the concepts we'll cover are applicable to other systems too!

[For the impatient, here's the complete GitHub project](https://github.com/jterrazz/42-nm-otool?source=post_page-----7d4fef3d7507--------------------------------).

## The Anatomy of Executables

When your operating system fires up a binary, it expects the file to follow a **predefined pattern**. Think of it as a secret handshake between the OS and the executable. Each operating system has its own conventions:

- macOS uses `Mach-O`
- Linux primarily uses `ELF`
- Windows opts for `PE`

Curious about other formats? Check out this [comprehensive list of executable file formats](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats).

For a deep dive into the Mach-O format, [this document is your treasure map](https://github.com/aidansteele/osx-abi-macho-file-format-reference?source=post_page-----7d4fef3d7507--------------------------------).

### Step 1: Identifying a Mach-O File

Every file has a secret identity, and in the world of executables, it's called the **magic number**. This special sequence of bytes, typically at the very beginning of the file, acts like a fingerprint. For Mach-O files, we have four possible magic numbers:

```c
// Defined in <mach-o/loader.h>

#define  MH_MAGIC       0xfeedface
#define  MH_CIGAM       NXSwapInt(MH_MAGIC)
#define  MH_MAGIC_64    0xfeedfacf
#define  MH_CIGAM_64    NXSwapInt(MH_MAGIC_64)
```

These magic numbers differ based on two factors:

1. **Structure size**: 32-bit vs. 64-bit
2. **Endianness**: The order in which bytes are arranged

> **Fun fact**: "CIGAM" is "MAGIC" spelled backwards. Clever, right?

If you're scratching your head about endianness, [this article on big vs. little endian](https://medium.com/worldsensing-techblog/big-endian-or-little-endian-37c3ed008c94?source=post_page-----7d4fef3d7507--------------------------------) will clear things up!

## Why Nm and Otool?

So, why are we building `nm` and `otool`? These commands are like X-ray glasses for Mach-O files. They allow us to:

1. **Parse** the file structure
2. **Analyze** the contents
3. **Display** the data in a human-readable format

Here's what each tool does:

- **`nm`**: Lists the **symbols** (like function names) in an executable.
- **`otool`**: Shows the **hexdump** of a specified segment. (Don't worry, we'll explain segments soon!)

![Example output of nm and otool](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LyO3kfs-lQvJ-KmaKmyb9g.png)

## Diving into the Mach-O Structure

Imagine a Mach-O file as a nesting doll, with each layer revealing more details about the executable:

![Mach-O file structure diagram](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gMKkvCSZXsGeVC0tH6PQ6w.png)

### Accessing the File

First things first, we need to get our hands on the file's contents. We'll use a combination of `open`, `fstat`, `mmap`, and `close` to get a pointer to the start of the data:

![Code snippet for file access](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2P9advEEZER1LaLSebOucA.png)

Once we have access, it's time to check that magic number:

![Code snippet for magic number check](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_477rmqdA6PR8WI7MKQJag.png)

### The Mach-O Header

Every Mach-O file starts with a header, which is like the table of contents for our executable:

![Mach-O header structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lEQ1Fc-L7t3JrWsZLPaMbw.png)

This header is packed with useful information, such as:

- `cpu_type`: Which CPUs can run this executable
- `filetype`: The type of file (executable, library, core dump, etc.)

### Load Commands: The Roadmap of the Binary

After the header come the load commands. Think of these as chapters in our executable book, dividing the binary into multiple sections. The complete list of load command types can be found in the [loader.h](https://opensource.apple.com/source/xnu/xnu-2050.18.24/EXTERNAL_HEADERS/mach-o/loader.h) header file.

For our purposes, we'll focus on two key commands:

1. `LC_SYMTAB`: Contains symbol information
2. `LC_SEGMENT`: Defines segments of the binary

![Load command structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BUqYPFgEHwtK4w5CvaKkmA.png)

We can iterate through these commands like this:

![Code snippet for iterating load commands](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N5X6RsMxix8S5hvZc90tJw.png)

#### LC_SEGMENT: The Building Blocks

Segment commands are like chapters in our executable book. They tell us:

- Where to find a segment in memory
- How many bytes to allocate for it
- How many sections it contains

![Segment command structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*yCDINaWcuLYaNFOxAXRQ0g.png)

Each segment contains sections, which are like paragraphs in our chapter:

![Section structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Iaj8IPtZLbzeNE61m0BsGw.png)

For `otool`, we'll need to hexdump the data at `addr`. For `nm`, we'll save the segment to match it later with symbols in the `SYMTAB`.

![Code snippet for segment processing](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*izSPVsY0HsWiDpZPJx9onw.png)

### LC_SYMTAB: The Symbol Table

The symbol table is like an index for our executable book. It contains a list of `nlist` symbols:

![Symbol table command structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Z2AszURFHXehcruzZNhosQ.png)

![nlist structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*1_ww_etKWj-RuyMo6tHddQ.png)

To get the name of a symbol, we need to parse the `strtab` (string table). The `nlist` structure provides a wealth of information about each symbol:

![Symbol information](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7JKYozfu6nAg5gc7KkRcDg.png)
![More symbol information](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ib35tK7AbIyH_YPS6QhmJw.png)

For `nm`, we need to construct a line for each symbol, showing:

1. The **address**
2. A **letter** describing the symbol type (e.g., `T` for exported methods, `U` for external methods)

[Here's a complete list of symbol types](https://linux.die.net/man/1/nm?source=post_page-----7d4fef3d7507--------------------------------).

Here's how we can determine the representation for a symbol:

![Code snippet for symbol representation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*UfyfZl05EnTvTL9S2L0MlA.png)

When the `N_SECT` mask is true with `sect->type`, we need to find the type based on the given segment:

![Code snippet for section type determination](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*De_TpMPgcxVz17p6yerOjA.png)

## Leveling Up: Advanced Challenges

Congratulations! You now have the building blocks to create your own `nm` and `otool`. But if you want to take your implementation to the next level, consider these advanced challenges:

### 1. Handling Archives and Fat Files

> "A fat binary, or multi-architecture binary, is a computer executable program which has been expanded with code native to multiple instruction sets which can consequently be run on multiple processor types." - Wikipedia

To parse these files, you'll need to dive into the `<mach-o/fat.h>` and `<ar.h>` header files. The process is similar to what we've covered, but with some extra layers.

### 2. Endian-ness Support

Remember how we mentioned big and little endian earlier? Sometimes you'll need to reverse the bit order of integers when reading header values. It's like solving a byte-order puzzle!

### 3. 32-bit And 64-bit Support

Be prepared to handle both 32-bit and 64-bit integers. It's like being bilingual in the world of binary!

### 4. Guarding Against Corrupt Files 🏴‍☠️

In the wild world of executables, not every file plays by the rules. A corrupted binary might try to send your program on a wild goose chase through memory. To prevent this, always check that your pointer stays within the bounds of the file. Think of it as putting guardrails on your binary exploration!

## Wrapping Up

Building your own `nm` and `otool` is like crafting a set of X-ray specs for executables. It's a journey that will deepen your understanding of how our computers really work under the hood. So roll up your sleeves, fire up your favorite text editor, and start exploring the fascinating world of binary analysis!

Remember, the key to mastering this project is patience and curiosity. Don't be afraid to experiment, and always keep your trusty man pages close at hand. Happy coding, and may your symbols always be in order! 🖥️🔍
