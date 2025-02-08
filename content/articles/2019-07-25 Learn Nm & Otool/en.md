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

## Diving into the Mach-O Structure

Imagine a Mach-O file as a nesting doll, with each layer revealing more details about the executable:

![Mach-O file structure diagram](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gMKkvCSZXsGeVC0tH6PQ6w.png)

### Accessing the File

First things first, we need to get our hands on the file's contents. We'll use a combination of `open`, `fstat`, `mmap`, and `close` to get a pointer to the start of the data:

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

Once we have access, it's time to check that magic number:

```c
#include <mach-o/loader.h>

uint32_t magic = *(uint32_t *)(file_start);

if (magic == MH_MAGIC || magic == MH_CIGAM || magic == MH_MAGIC_64 || magic == MH_CIGAM_64)
  handle_macho_file();
```

### The Mach-O Header

Every Mach-O file starts with a header, which is like the table of contents for our executable:

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

This header is packed with useful information, such as:

- `cpu_type`: Which CPUs can run this executable
- `filetype`: The type of file (executable, library, core dump, etc.)

### Load Commands: The Roadmap of the Binary

After the header come the load commands. Think of these as chapters in our executable book, dividing the binary into multiple sections. The complete list of load command types can be found in the [loader.h](https://opensource.apple.com/source/xnu/xnu-2050.18.24/EXTERNAL_HEADERS/mach-o/loader.h) header file.

For our purposes, we'll focus on two key commands:

1. `LC_SYMTAB`: Contains symbol information
2. `LC_SEGMENT`: Defines segments of the binary

```c
struct load_command {
  uint32_t cmd;		/* type of load command */
  uint32_t cmdsize;	/* total size of command in bytes */
};
```

We can iterate through these commands like this:

```c
uint32_t ncmds = ((struct mach_header *)file_start)->ncmds;

lc = (struct load_command *)(file_start + sizeof(struct mach_header);

while (ncmds--) {
  parse_load_command(lc)
  lc = (void *)lc +lc->cmdsize;
}
```

#### LC_SEGMENT: The Building Blocks

Segment commands are like chapters in our executable book. They tell us:

- Where to find a segment in memory
- How many bytes to allocate for it
- How many sections it contains

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

Each segment contains sections, which are like paragraphs in our chapter:

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

For `otool`, we'll need to hexdump the data at `addr`. For `nm`, we'll save the segment to match it later with symbols in the `SYMTAB`.

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

### LC_SYMTAB: The Symbol Table

The symbol table is like an index for our executable book. It contains a list of `nlist` symbols:

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

To get the name of a symbol, we need to parse the `strtab` (string table). The `nlist` structure provides a wealth of information about each symbol:

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

For `nm`, we need to construct a line for each symbol, showing:

1. The **address**
2. A **letter** describing the symbol type (e.g., `T` for exported methods, `U` for external methods)

[Here's a complete list of symbol types](https://linux.die.net/man/1/nm?source=post_page-----7d4fef3d7507--------------------------------).

Here's how we can determine the representation for a symbol:

```c
// Defined in <mach-o/nlist.h>
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
    return '-'; // Debug symbols
  else if ((N_TYPE & sym->type) == N_UNDF) {
    if (sym->name_not_found)
     return 'C';
    else if (sym->type & N_EXT)
     return = 'U';
    else
     return = '?';
  } else if ((N_TYPE & sym->type) == N_SECT) {
    return match_symbol_section(saved_sections, sym); // We have to match it with our saved sections
  } else if ((N_TYPE & sym->type) == N_ABS) {
    return = 'A';
  } else if ((N_TYPE & sym->type) == N_INDR) {
    return = 'I';
  }
}
```

When the `N_SECT` mask is true with `sect->type`, we need to find the type based on the given segment:

```c
char match_symbol_section(saved_sections, symbol)
{
  if (sect = find_mysection(saved_sections, symbol->n_sect)) # 
  {
    if (!ft_strcmp(sect->name, SECT_TEXT))
      ret = 'T';
    else if (!ft_strcmp(sect->name, SECT_DATA))
      ret = 'D';
    else if (!ft_strcmp(sect->name, SECT_BSS))
      ret = 'B';
    else
      ret = 'S';

    if (!(mysym->type & N_EXT))
       ret -= 'A' - 'a';
  }
}
```

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
