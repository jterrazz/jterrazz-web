![](assets/thumbnail.jpg)

# Décrypter la magie: mon aventure au cœur de `nm` et `otool`

Vous êtes-vous déjà demandé comment votre ordinateur *comprend* réellement un fichier binaire? Je veux dire, au plus profond de ses circuits. Si cette curiosité vous anime, alors vous êtes au bon endroit. J'ai récemment plongé dans les abysses de l'implémentation des commandes `nm` et `otool`, en repartant de zéro avec le langage C. Ce fut une véritable odyssée, et j'en suis ressorti avec une compréhension bien plus intime du fonctionnement des binaires et des systèmes Unix. C'est un monde fascinant que celui de la programmation de bas niveau.

Dans cet article, je vais vous guider pas à pas pour que vous puissiez créer vos propres versions de ces outils. Mais permettez-moi un conseil d'ami: essayez d'abord par vous-même. Vraiment. L'expérience de fouiller dans les **man pages** et les **fichiers d'en-tête** système vous apportera un niveau de compréhension qu'aucun tutoriel ne pourra jamais égaler.

> **Petite précision**: Mon implémentation se concentre exclusivement sur le format **Mach-O**, qui est le format d'exécutable de prédilection d'Apple pour macOS et iOS. Cependant, même si vous travaillez sur un autre système d'exploitation, les concepts fondamentaux restent universels.

Pour celles et ceux qui souhaitent plonger directement dans le code, [le projet GitHub complet est disponible ici](https://github.com/jterrazz/42-nm-otool?source=post_page-----7d4fef3d7507--------------------------------).

## Au fond, qu'est-ce qu'un fichier exécutable?

Lorsqu'un système d'exploitation lance un programme, il s'attend à ce que le fichier soit structuré d'une manière bien précise. Imaginez cela comme une poignée de main secrète. Chaque système a ses propres conventions:

* **macOS** utilise `Mach-O`
* **Linux** utilise principalement `ELF`
* **Windows** opte pour le format `PE`

Il existe une multitude d'autres formats. Si le sujet vous passionne, vous pouvez consulter cette [impressionnante liste de formats de fichiers exécutables](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats).

Pour une exploration en profondeur du format Mach-O, [ce document est une véritable carte au trésor](https://github.com/aidansteele/osx-abi-macho-file-format-reference?source=post_page-----7d4fef3d7507--------------------------------).

### Étape 1: S'assurer qu'il s'agit bien d'un fichier Mach-O

Chaque type de fichier possède une sorte d'identité secrète, une séquence d'octets située à son tout début, appelée **magic number**. C'est en quelque sorte l'empreinte digitale du fichier. Pour les fichiers Mach-O, il existe quatre possibilités:

```c
// Ceci est défini dans <mach-o/loader.h>

#define  MH_MAGIC       0xfeedface
#define  MH_CIGAM       NXSwapInt(MH_MAGIC)
#define  MH_MAGIC_64    0xfeedfacf
#define  MH_CIGAM_64    NXSwapInt(MH_MAGIC_64)
```

Les différences se résument à deux aspects:

1. **L'architecture**: 32 bits ou 64 bits.
2. **L'endianness** (ou boutisme): L'ordre dans lequel les octets sont stockés.

> **Pour la petite histoire**: " CIGAM " n'est autre que " MAGIC " épelé à l'envers. Plutôt malin, n'est-ce pas?

Si le concept d'endianness est nouveau pour vous, cet [article sur le big-endian et le little-endian](https://medium.com/worldsensing-techblog/big-endian-or-little-endian-37c3ed008c94?source=post_page-----7d4fef3d7507--------------------------------) l'explique très clairement.

## Alors, pourquoi recréer `nm` et `otool`?

Ces outils sont de véritables lunettes à rayons X pour les fichiers Mach-O. Ils vous permettent de:

1. **Parser** la structure du fichier.
2. **Analyser** ce qu'il contient.
3. **Afficher** le tout d'une manière lisible pour un humain.

Voici la répartition des rôles:

* **`nm`**: Affiche une liste de **symboles** (comme les noms de fonctions et de variables) présents dans le fichier.
* **`otool`**: Affiche le **contenu hexadécimal** d'une section spécifique du fichier, généralement celle contenant le code.

![Example output of nm and otool](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LyO3kfs-lQvJ-KmaKmyb9g.png)

## Plongée dans la structure Mach-O

Imaginez un fichier Mach-O comme une série de poupées russes. Chaque couche que vous ouvrez révèle de nouveaux détails.

![Mach-O file structure diagram](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gMKkvCSZXsGeVC0tH6PQ6w.png)

### Accéder au contenu du fichier

Commençons par le commencement: nous devons lire le contenu du fichier et le charger en mémoire. J'ai utilisé le trio classique `open`, `fstat`, et `mmap` pour obtenir un pointeur vers le début des données du fichier.

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

Une fois le fichier en mémoire, il est temps de vérifier ce fameux *magic number*.

```c
#include <mach-o/loader.h>

uint32_t magic = *(uint32_t *)(file_start);

if (magic == MH_MAGIC || magic == MH_CIGAM || magic == MH_MAGIC_64 || magic == MH_CIGAM_64)
  handle_macho_file();
```

### L'en-tête Mach-O (Header)

Chaque fichier Mach-O débute par un en-tête. Considérez-le comme la table des matières de l'exécutable.

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

Cette structure regorge d'informations précieuses, comme:

* `cpu_type`: Quels processeurs peuvent exécuter ce fichier.
* `filetype`: S'agit-il d'un exécutable, d'une bibliothèque, ou autre chose?

### Les Load Commands: la feuille de route du binaire

Juste après l'en-tête se trouvent les *load commands*. Voyez-les comme des instructions qui expliquent au système d'exploitation comment charger le programme en mémoire. Vous trouverez la liste complète des types de commandes dans le fichier d'en-tête `loader.h`.

Pour mon projet, je me suis concentré sur deux commandes principales:

1. `LC_SYMTAB`: Pointeur vers les informations sur les symboles.
2. `LC_SEGMENT`: Définition des différents segments du binaire.

```c
struct load_command {
  uint32_t cmd;		/* type of load command */
  uint32_t cmdsize;	/* total size of command in bytes */
};
```

Les parcourir est assez direct. On commence juste après l'en-tête et on saute de l'une à l'autre en utilisant `cmdsize`.

```c
uint32_t ncmds = ((struct mach_header *)file_start)->ncmds;

lc = (struct load_command *)(file_start + sizeof(struct mach_header);

while (ncmds--) {
  parse_load_command(lc);
  lc = (void *)lc + lc->cmdsize;
}
```

#### `LC_SEGMENT`: Les briques de construction

Les commandes de segment sont le véritable cœur du fichier. Elles définissent de larges sections du binaire, comme le segment `__TEXT` (où réside le code) et le segment `__DATA` (pour les variables globales).

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
};
```

Chaque segment est lui-même subdivisé en sections.

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
};
```

Pour `otool`, notre mission est de trouver la section `__text` à l'intérieur du segment `__TEXT` et d'afficher son contenu sous forme de dump hexadécimal. Pour `nm`, j'ai dû sauvegarder les informations de chaque section pour les faire correspondre plus tard avec les symboles.

```c
int	parse_mach_segment(void *segment_command) {
	uint32_t nsects;
	void *section;

	section = segment_command + sizeof(struct segment_command);
	nsects = ((struct segment_command *) segment_command)->nsects;

	while (nsects--) {
		// Traiter chaque section
		if (bin == OTOOL) {
		    // Si la section est __text, afficher les données en hexadécimal
		} else if (bin == NM) {
		    // Sauvegarder la section en mémoire pour la faire correspondre plus tard avec SYMTAB
		}
		section += sizeof(struct s_section);
	}
}
```

### `LC_SYMTAB`: La table des symboles

La commande de table des symboles, `LC_SYMTAB`, pointe vers l'index de notre exécutable. Elle nous indique où trouver la liste des symboles (des structures `nlist`) et la table des chaînes de caractères (`strtab`) qui contient leurs noms.

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

Pour récupérer le nom d'un symbole, on utilise la valeur `n_strx` comme un décalage (offset) dans la table des chaînes de caractères.

```c
int parse_mach_symtab(struct symtab_command *symtab_command)
{
	void *strtab = file_start + symtab_command->stroff;
	void *symtab = file_start + symtab_command->symoff;
	uint32_t nsyms = symtab_command->nsyms;
	uint32_t i = 0;

	while (i < nsyms) {
		// Données du symbole ici
		struct nlist *symbol_data = (nlist *)symtab + i;
		
		// Nom du symbole
		char *symbol_name = strtab + ((struct nlist *)symtab + i)->n_un.n_strx;
		
		// Ajouter à une liste pour usage ultérieur
		handle_symbol(symbol_data, symbol_name);
		i++;
	}
}
```

![More symbol information](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ib35tK7AbIyH_YPS6QhmJw.png)

Pour `nm`, le gros du travail consiste à afficher une ligne pour chaque symbole, indiquant son adresse et une lettre représentant son type (par exemple, `T` pour une fonction dans la section de texte, `U` pour un symbole non défini/externe).

[Vous trouverez une liste complète des types de symboles sur la page de man de nm](https://linux.die.net/man/1/nm?source=post_page-----7d4fef3d7507--------------------------------).

Pour déterminer la bonne lettre, il faut inspecter le champ `n_type` du symbole.

```c
// Ces constantes sont définies dans <mach-o/nlist.h>
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
    return '-'; // Symbole de débogage
  else if ((N_TYPE & sym->type) == N_UNDF) {
    if (sym->name_not_found) // C'est une vérification que j'ai ajoutée
     return 'C'; // Symbole commun (Common)
    else if (sym->type & N_EXT)
     return = 'U'; // Non défini (Undefined)
    else
     return = '?';
  } else if ((N_TYPE & sym->type) == N_SECT) {
    return match_symbol_section(saved_sections, sym); // À faire correspondre avec une section sauvegardée
  } else if ((N_TYPE & sym->type) == N_ABS) {
    return = 'A'; // Absolu
  } else if ((N_TYPE & sym->type) == N_INDR) {
    return = 'I'; // Indirect
  }
}
```

Si le type d'un symbole est `N_SECT`, il faut alors examiner la section à laquelle il appartient.

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

    // Si le symbole n'est pas externe, la lettre est en minuscule
    if (!(mysym->type & N_EXT))
       ret += 'a' - 'A';
  }
}
```

## Passer au niveau supérieur: les prochains défis

Une fois les bases acquises, vous disposez d'une fondation solide pour vos propres versions de `nm` et `otool`. Si vous cherchez à aller plus loin, voici quelques défis stimulants à relever.

### 1. Gérer les archives et les fichiers "fat"

Un "fat binary" est essentiellement une enveloppe contenant plusieurs fichiers Mach-O, chacun destiné à une architecture de processeur différente. Pour les gérer, vous devrez vous plonger dans les fichiers d'en-tête `<mach-o/fat.h>` et `<ar.h>`. La logique de parsing est similaire, avec simplement une couche d'analyse supplémentaire.

### 2. Gérer l'endianness

Vous vous souvenez du big-endian et du little-endian? Vous tomberez parfois sur un fichier dont l'ordre des octets est inversé par rapport à celui de votre machine. Cela signifie que vous devrez inverser les octets pour toutes les valeurs entières que vous lisez dans les en-têtes. C'est un fascinant casse-tête de jonglage d'octets.

### 3. Gérer à la fois le 32-bit et le 64-bit

Votre code doit être capable de traiter les binaires 32-bit et 64-bit. C'est comme être bilingue dans le monde des exécutables, et cela implique principalement d'utiliser les structures de données appropriées pour chaque cas.

### 4. Se prémunir contre les fichiers corrompus 🏴‍☠️

Tous les binaires que l'on trouve dans la nature ne sont pas bien élevés. Un fichier corrompu peut contenir des tailles ou des décalages qui pointent vers des zones aléatoires de la mémoire. Ajoutez systématiquement des vérifications pour vous assurer que vos pointeurs et offsets restent dans les limites réelles du fichier. C'est comme installer des garde-fous pour sécuriser votre exploration.

## Le mot de la fin

Développer mes propres `nm` et `otool`, c'était comme acquérir une vision à rayons X pour les exécutables. C'est un projet qui vous force à comprendre le fonctionnement de nos ordinateurs à un niveau bien plus profond. Mon conseil est donc simple: retroussez vos manches, ouvrez votre éditeur de code préféré, et commencez à creuser dans le monde incroyable de l'analyse binaire.

La clé est d'être patient et curieux. N'ayez pas peur d'expérimenter et gardez les *man pages* à portée de main. Bon code! 🖥️🔍
