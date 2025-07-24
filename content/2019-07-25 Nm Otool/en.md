![](assets/thumbnail.jpg)

# Decoding the magic, my journey building `nm` and `otool`

Ever wondered how your computer *actually* understands a binary file? I mean, down to the last byte. If that curiosity resonates with you, you're in for a ride. I recently tumbled down the rabbit hole of implementing the `nm` and `otool` commands from scratch in C. It was a journey. I emerged with a much deeper intuition for how binaries and Unix-like systems tick—a fascinating, low-level world.

Here, I'll retrace my steps and share a roadmap for building your own versions of these tools. But let me offer a piece of advice upfront: try to build it yourself first. Seriously. The experience of digging through **man pages** and system **header files** will grant you a level of understanding no article can replicate.

> **A heads-up**: My implementation is all about **Mach-O**, which is Apple's go-to executable format for macOS and iOS. But even if you're on a different OS, the core ideas are pretty much universal.

For those who want to jump straight to the code, [here’s the complete GitHub project](https://github.com/jterrazz/42-nm-otool?source=post_page-----7d4fef3d7507--------------------------------).

## What exactly is an executable file?

When an operating system runs a program, it needs the file to be laid out in a very specific way. Think of it as a secret handshake. Every OS has its own preference:

- **macOS** uses `Mach-O`
- **Linux** mainly uses `ELF`
- **Windows** goes with `PE`

There are tons of other formats out there. If you're curious, you can check out this [big list of executable file formats](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats).

For a deep dive into the Mach-O format, [this document is basically a treasure map](https://github.com/aidansteele/osx-abi-macho-file-format-reference?source=post_page-----7d4fef3d7507--------------------------------).

### Step 1: Making sure it's a Mach-O file

Every file type has a secret identity, a sequence of bytes at the very beginning called a **magic number**. It's like a file's fingerprint. For Mach-O files, there are four possibilities:

```c
// This is defined in <mach-o/loader.h>

#define  MH_MAGIC       0xfeedface
#define  MH_CIGAM       NXSwapInt(MH_MAGIC)
#define  MH_MAGIC_64    0xfeedfacf
#define  MH_CIGAM_64    NXSwapInt(MH_MAGIC_64)
```

The differences come down to two things:

1. **Architecture**: 32-bit or 64-bit.
2. **Endianness**: The order in which bytes are arranged.

> **Fun fact**: "CIGAM" is just "MAGIC" spelled backward. Pretty clever, huh?

If endianness is a new concept for you, this [article on big vs. little endian](https://medium.com/worldsensing-techblog/big-endian-or-little-endian-37c3ed008c94?source=post_page-----7d4fef3d7507--------------------------------) is a great explainer.

## So, why build `nm` and `otool`?

These tools are like X-ray glasses for Mach-O files, letting you:

1. **Parse** the file's structure.
2. **Analyze** what's inside.
3. **Display** it all in a human-readable format.

Here's the breakdown:

- **`nm`**: Shows a list of **symbols** (like function and variable names) in the file.
- **`otool`**: Dumps the **hexadecimal content** of a specific part of the file, called a segment.

```c
struct stat buf;

if ((fd = open(filename, O_RDONLY)) < 0)
      return FAILURE;
if (fstat(fd, &buf) < 0)
      return FAILURE;
if (buf.st_size == 0)
      return FAILURE;
if ((file_start = mmap(NULL, buf.st_size, PROT_READ, MAP_PRIVATE, fd, 0)) == MAP_FAILED)
      return FAILURE;

handle_file(file_start);
```

![Example output of nm and otool](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LyO3kfs-lQvJ-KmaKmyb9g.png)

## Getting into the Mach-O structure

Picture a Mach-O file as one of those Russian nesting dolls. Each layer you open reveals more detail.

![Mach-O file structure diagram](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gMKkvCSZXsGeVC0tH6PQ6w.png)

### Getting access to the file

First things first: we need to read the file's contents into memory. I used a classic combo of `open`, `fstat`, and `mmap` to get a pointer to the start of the file data.

```c
struct stat buf;

if ((fd = open(filename, O_RDONLY)) < 0)
      return FAILURE;
if (fstat(fd, &buf) < 0)
      return FAILURE;
if (buf.st_size == 0)
      return FAILURE;
if ((file_start = mmap(NULL, buf.st_size, PROT_READ, MAP_PRIVATE, fd, 0)) == MAP_FAILED)
      return FAILURE;

handle_file(file_start)
```

With the file in memory, it's time to check that magic number.

```c
#include <mach-o/loader.h>

uint32_t magic = *(uint32_t *)(file_start);

if (magic == MH_MAGIC || magic == MH_CIGAM || magic == MH_MAGIC_64 || magic == MH_CIGAM_64)
  handle_macho_file();
```

### The Mach-O header

Every Mach-O file kicks off with a header. It's like the table of contents for the executable.

```c
struct mach_header {
  uint32_t	magic;		/* mach magic number identifier */
  cpu_type_t	cputype;	/* cpu specifier */
  cpu_subtype_t	cpusubtype;	/* machine specifier */
  uint32_t	filetype;	/* type of file */
  uint32_t	ncmds;		/* number of load commands */
  uint32_t	sizeofcmds;	/* the size of all the load commands */
  uint32_t	flags;		/* flags */
};
```

This struct is loaded with gold, like:

- `cpu_type`: Which processors can run this file.
- `filetype`: Is this an executable, a library, or something else?

### Load commands: the binary's roadmap

Right after the header, you'll find the load commands. Think of them as directions that tell the OS how to load the program into memory. You can find the full list of command types in the `loader.h` header file.

For these tools, two load commands are especially important:

1. `LC_SYMTAB`: Points to the symbol information.
2. `LC_SEGMENT`: Defines the different segments of the binary.

```c
struct load_command {
  uint32_t cmd;		/* type of load command */
  uint32_t cmdsize;	/* total size of command in bytes */
};
```

Iterating through them is pretty straightforward. You start right after the header and just hop from one to the next using `cmdsize`.

```c
uint32_t ncmds = ((struct mach_header *)file_start)->ncmds;

lc = (struct load_command *)(file_start + sizeof(struct mach_header);

while (ncmds--) {
  parse_load_command(lc)
  lc = (void *)lc +lc->cmdsize;
}
```

#### `LC_SEGMENT`: the building blocks

Segment commands are the real meat of the file. They define big chunks of the binary, like the `__TEXT` segment (where the code lives) and the `__DATA` segment (for global variables).

```c
struct segment_command {        /* for 32-bit architectures */
	uint32_t	cmd;	     	/* LC_SEGMENT */
	uint32_t	cmdsize;	    /* includes sizeof section structs */
	char		segname[16];	/* segment name */
	uint32_t	vmaddr;		    /* memory address of this segment */
	uint32_t	vmsize;		    /* memory size of this segment */
	uint32_t	fileoff;	    /* file offset of this segment */
	uint32_t	filesize;	    /* amount to map from the file */
	vm_prot_t	maxprot;	    /* maximum VM protection */
	vm_prot_t	initprot;	    /* initial VM protection */
	uint32_t	nsects;	        /* number of sections in segment */
	uint32_t	flags;	        /* flags */
}
```

Each segment is broken down further into sections.

```c
struct section {                /* for 32-bit architectures */
	char		sectname[16];	/* name of this section */
	char		segname[16];	/* segment this section goes in */
	uint32_t	addr;		    /* memory address of this section */
	uint32_t	size;		    /* size in bytes of this section */
	uint32_t	offset;		    /* file offset of this section */
	uint32_t	align;		    /* section alignment (power of 2) */
	uint32_t	reloff;		    /* file offset of relocation entries */
	uint32_t	nreloc;		    /* number of relocation entries */
	uint32_t	flags;		    /* flags (section type and attributes)*/
	uint32_t    reserved1;		/* reserved (for offset or index)*/
	uint32_t    reserved2;		/* reserved (for count or sizeof)*/
}
```

For `otool`, the goal is to find the `__text` section inside the `__TEXT` segment and print its contents as a hex dump. For `nm`, I needed to save the section info to match it up with symbols later.

```c
int	parse_mach_segment(void *segment_command) {
	uint32_t nsects;
	void *section;

	section = segment_command + sizeof(struct segment_command);
	nsects = ((struct segment_command *) segment_command)->nsects;

	while (nsects--) {
		// Do stuff with each section
		if (bin == OTOOL) {
		    // If section is __text, hexdump the data
		} else if (bin == NM) {
		    // Save the section in memory to match later with the SYMTAB
		}
		section += sizeof(struct s_section);
	}
}
```

### `LC_SYMTAB`: the symbol table

The symbol table command, `LC_SYMTAB`, points to the index of our executable. It tells us where to find the list of symbols (`nlist` structures) and the string table (`strtab`) used to get their names.

```c
struct symtab_command {
	uint32_t	cmd;		/* LC_SYMTAB */
	uint32_t	cmdsize;	/* sizeof(struct symtab_command) */
	uint32_t	symoff;		/* symbol table offset */
	uint32_t	nsyms;		/* number of symbol table entries */
	uint32_t	stroff;		/* string table offset */
	uint32_t	strsize;	/* string table size in bytes */
};
```

```c
struct nlist {
	union {
		char *n_name;	/* for use when in-core */
		long  n_strx;	/* index into the string table */
	} n_un;
	unsigned char n_type;	/* type flag, see below */
	unsigned char n_sect;	/* section number or NO_SECT */
	short	      n_desc;	/* see <mach-o/stab.h> */
	unsigned long n_value;	/* value of this symbol (or stab offset) */
};
```

To get a symbol's name, you use the `n_strx` value as an offset into the string table.

```c
int parse_mach_symtab(struct symtab_command *symtab_command)
{
	void *strtab = file_start + symtab_command->stroff;
	void *symtab = file_start + symtab_command->symoff;
	uint32_t nsyms = symtab_command->nsyms;
	uint32_t i = 0;

	while (i < nsyms) {
		// Symbol data here
		struct nlist *symbol_data = (nlist *)symtab + i;
		
		// Symbol name
		char *symbol_name = strtab + ((struct nlist *)symtab + i)->n_un.n_strx;
		
		// Add to list for later use
		handle_symbol(symbol_data, symbol_name);
		i++;
	}
}
```

![More symbol information](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ib35tK7AbIyH_YPS6QhmJw.png)

For `nm`, the main task is to print a line for each symbol showing its address and a letter representing its type (e.g., `T` for a function in the text section, `U` for undefined/external).

[You can find a complete list of symbol types on the nm man page](https://linux.die.net/man/1/nm?source=post_page-----7d4fef3d7507--------------------------------).

Figuring out the right letter involves checking the symbol's `n_type` field.

```c
// These are defined in <mach-o/nlist.h>
#define	N_UNDF	0x0		/* undefined, n_sect == NO_SECT */
#define N_ABS 0x2  /* absolute, n_sect == NO_SECT */
#define N_SECT 0xe  /* defined in section number n_sect */
#define N_PBUD 0xc  /* prebound undefined (defined in a dylib) */
#define N_INDR 0xa

#define N_STAB 0xe0  /* if any of these bits set, a symbolic debugging entry */
#define N_PEXT 0x10  /* private external symbol bit */
#define N_TYPE 0x0e  /* mask for the type bits */
#define N_EXT 0x01  /* external symbol bit, set for external symbols */

char get_symbol_letter(sym) {
  if (N_STAB & sym->type)
    return '-'; // Debugging symbol
  else if ((N_TYPE & sym->type) == N_UNDF) {
    if (sym->name_not_found) // This is a custom check I added
     return 'C'; // Common symbol
    else if (sym->type & N_EXT)
     return 'U'; // Undefined
    else
     return '?';
  } else if ((N_TYPE & sym->type) == N_SECT) {
    return match_symbol_section(saved_sections, sym); // Match with a saved section
  } else if ((N_TYPE & sym->type) == N_ABS) {
    return 'A'; // Absolute
  } else if ((N_TYPE & sym->type) == N_INDR) {
    return 'I'; // Indirect
  }
}
```

If a symbol's type is `N_SECT`, you have to look at the section it belongs to.

```c
char match_symbol_section(saved_sections, symbol)
{
  if (sect = find_mysection(saved_sections, symbol->n_sect))
  {
    if (!ft_strcmp(sect->name, SECT_TEXT))
      ret = 'T';
    else if (!ft_strcmp(sect->name, SECT_DATA))
      ret = 'D';
    else if (!ft_strcmp(sect->name, SECT_BSS))
      ret = 'B';
    else
      ret = 'S';

    // If the symbol is not external, make the letter lowercase
    if (!(mysym->type & N_EXT))
       ret += 'a' - 'A';
  }
}
```

## Leveling up: the next challenges

Once you've got the basics down, you have a solid foundation for your own `nm` and `otool`. If you're looking to push it further, here are a few advanced challenges to tackle.

### 1. Handling archives and fat files

A "fat binary" is essentially a wrapper that holds multiple Mach-O files, each for a different processor architecture. To handle these, you'll need to dig into the `<mach-o/fat.h>` and `<ar.h>` header files. The parsing logic is similar, just with an extra layer on top.

### 2. Supporting endianness

Remember big and little endian? Sometimes you'll get a file with a different byte order than your machine uses. This means you'll have to swap the byte order for all the integer values you read from the headers. It's like a fun little byte-juggling puzzle.

### 3. Supporting both 32-bit and 64-bit

Your code should be able to handle both 32-bit and 64-bit binaries. It's like being bilingual in the world of executables, and mostly involves using the correct data structures for each.

### 4. Guarding against corrupt files 🏴‍☠️

Not every binary in the wild is well-behaved. A corrupted file could have size values or offsets that point to random places in memory. Always add checks to make sure your pointers and offsets stay within the actual bounds of the file. Think of it as putting up guardrails on your exploration.

## Wrapping up

Building my own `nm` and `otool` was like getting a pair of X-ray specs for executables. It's a project that forces you to confront how computers work on a profoundly deeper level. So, my advice is this: roll up your sleeves, open your favorite editor, and start digging into the incredible world of binary analysis.

The key is to be patient and curious. Don't be afraid to experiment, and keep those man pages handy. Happy coding! 🖥️🔍
