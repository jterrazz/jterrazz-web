![](assets/thumbnail.jpg)

# Décoder la magie : mon aventure pour recréer `nm` et `otool`

Vous êtes-vous déjà demandé comment votre ordinateur comprend _réellement_ un fichier binaire ? Je veux dire, jusqu'au dernier octet. Si cette curiosité résonne en vous, accrochez-vous. Je me suis récemment lancé dans l'aventure d'implémenter les commandes `nm` et `otool` de zéro en C. Ce fut tout un voyage. J'en suis ressorti avec une intuition bien plus profonde sur la façon dont les binaires et les systèmes de type Unix fonctionnent, un monde fascinant et de bas niveau.

Ici, je vais retracer mes pas et partager une feuille de route pour construire vos propres versions de ces outils. Mais laissez-moi vous donner un conseil d'emblée : essayez de le construire vous-même d'abord. Sérieusement. L'expérience de fouiller dans les **man pages** et les **fichiers d'en-tête** (headers) du système vous donnera un niveau de compréhension qu'aucun article ne peut reproduire.

> **Note** : Mon implémentation se concentre sur **Mach-O**, qui est le format exécutable de choix d'Apple pour macOS et iOS. Mais même si vous êtes sur un OS différent, les idées centrales sont pratiquement universelles.

Pour ceux qui veulent aller directement au code, [voici le projet complet sur GitHub](https://github.com/jterrazz/42-nm-otool?source=post_page-----7d4fef3d7507--------------------------------).

## Qu'est-ce qu'un fichier exécutable exactement ?

Quand un système d'exploitation lance un programme, il a besoin que le fichier soit agencé d'une manière très spécifique. Voyez ça comme une poignée de main secrète. Chaque OS a sa propre préférence :

- **macOS** utilise `Mach-O`
- **Linux** utilise principalement `ELF`
- **Windows** opte pour `PE`

Il existe des tonnes d'autres formats. Si vous êtes curieux, vous pouvez consulter cette [grande liste de formats de fichiers exécutables](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats).

Pour une plongée approfondie dans le format Mach-O, [ce document est essentiellement une carte au trésor](https://github.com/aidansteele/osx-abi-macho-file-format-reference?source=post_page-----7d4fef3d7507--------------------------------).

### Étape 1 : S'assurer que c'est un fichier Mach-O

Chaque type de fichier a une identité secrète, une séquence d'octets tout au début appelée un **nombre magique** (magic number). C'est comme l'empreinte digitale d'un fichier. Pour les fichiers Mach-O, il y a quatre possibilités :

```c
// Ceci est défini dans <mach-o/loader.h>

#define  MH_MAGIC       0xfeedface
#define  MH_CIGAM       NXSwapInt(MH_MAGIC)
#define  MH_MAGIC_64    0xfeedfacf
#define  MH_CIGAM_64    NXSwapInt(MH_MAGIC_64)
```

Les différences se résument à deux choses :

1. **Architecture** : 32-bit ou 64-bit.
2. **Endianness (boutisme)** : L'ordre dans lequel les octets sont arrangés.

> **Fait amusant** : "CIGAM" est juste "MAGIC" épelé à l'envers. Plutôt malin, non ?

Si l'endianness est un nouveau concept pour vous, cet [article sur big vs. little endian](https://medium.com/worldsensing-techblog/big-endian-or-little-endian-37c3ed008c94?source=post_page-----7d4fef3d7507--------------------------------) est une excellente explication.

## Alors, pourquoi construire `nm` et `otool` ?

Ces outils sont comme des lunettes à rayons X pour les fichiers Mach-O, vous permettant de :

1. **Parser** la structure du fichier.
2. **Analyser** ce qu'il y a dedans.
3. **Afficher** le tout dans un format lisible par un humain.

Voici le détail :

- **`nm`** : Affiche une liste de **symboles** (comme les noms de fonctions et de variables) dans le fichier.
- **`otool`** : Affiche le **contenu hexadécimal** d'une partie spécifique du fichier, appelée un segment.

![Exemple de sortie de nm et otool](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LyO3kfs-lQvJ-KmaKmyb9g.png)

## Entrer dans la structure Mach-O

Imaginez un fichier Mach-O comme une de ces poupées russes. Chaque couche que vous ouvrez révèle plus de détails.

![Diagramme de structure de fichier Mach-O](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gMKkvCSZXsGeVC0tH6PQ6w.png)

### Obtenir l'accès au fichier

Première chose : nous devons lire le contenu du fichier en mémoire. J'ai utilisé le combo classique `open`, `fstat`, et `mmap` pour obtenir un pointeur vers le début des données du fichier.

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

Avec le fichier en mémoire, il est temps de vérifier ce nombre magique.

```c
#include <mach-o/loader.h>

uint32_t magic = *(uint32_t *)(file_start);

if (magic == MH_MAGIC || magic == MH_CIGAM || magic == MH_MAGIC_64 || magic == MH_CIGAM_64)
  handle_macho_file();
```

### L'en-tête Mach-O

Tout fichier Mach-O démarre avec un en-tête (header). C'est comme la table des matières de l'exécutable.

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

Cette structure est une mine d'or, avec :

- `cpu_type` : Quels processeurs peuvent exécuter ce fichier.
- `filetype` : Est-ce un exécutable, une bibliothèque, ou autre chose ?

### Commandes de chargement : la feuille de route du binaire

Juste après l'en-tête, vous trouverez les commandes de chargement (load commands). Voyez-les comme des instructions qui disent à l'OS comment charger le programme en mémoire. Vous pouvez trouver la liste complète des types de commandes dans le fichier d'en-tête `loader.h`.

Pour ces outils, deux commandes de chargement sont particulièrement importantes :

1. `LC_SYMTAB` : Pointe vers les informations des symboles.
2. `LC_SEGMENT` : Définit les différents segments du binaire.

```c
struct load_command {
  uint32_t cmd;		/* type of load command */
  uint32_t cmdsize;	/* total size of command in bytes */
};
```

Les parcourir est assez simple. Vous commencez juste après l'en-tête et vous sautez simplement de l'une à l'autre en utilisant `cmdsize`.

```c
uint32_t ncmds = ((struct mach_header *)file_start)->ncmds;

lc = (struct load_command *)(file_start + sizeof(struct mach_header);

while (ncmds--) {
  parse_load_command(lc)
  lc = (void *)lc +lc->cmdsize;
}
```

#### `LC_SEGMENT` : les briques de construction

Les commandes de segment sont la vraie substance du fichier. Elles définissent de gros morceaux du binaire, comme le segment `__TEXT` (où vit le code) et le segment `__DATA` (pour les variables globales).

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

Chaque segment est divisé davantage en sections.

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

Pour `otool`, le but est de trouver la section `__text` à l'intérieur du segment `__TEXT` et d'afficher son contenu sous forme de dump hexadécimal. Pour `nm`, j'avais besoin de sauvegarder les infos de la section pour les faire correspondre avec les symboles plus tard.

```c
int	parse_mach_segment(void *segment_command) {
	uint32_t nsects;
	void *section;

	section = segment_command + sizeof(struct segment_command);
	nsects = ((struct segment_command *) segment_command)->nsects;

	while (nsects--) {
		// Faire des trucs avec chaque section
		if (bin == OTOOL) {
		    // Si la section est __text, hexdump les données
		} else if (bin == NM) {
		    // Sauvegarder la section en mémoire pour matcher plus tard avec la SYMTAB
		}
		section += sizeof(struct s_section);
	}
}
```

### `LC_SYMTAB` : la table des symboles

La commande de table des symboles, `LC_SYMTAB`, pointe vers l'index de notre exécutable. Elle nous dit où trouver la liste des symboles (structures `nlist`) et la table des chaînes (`strtab`) utilisée pour obtenir leurs noms.

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

Pour obtenir le nom d'un symbole, vous utilisez la valeur `n_strx` comme un décalage (offset) dans la table des chaînes.

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

		// Ajouter à la liste pour usage ultérieur
		handle_symbol(symbol_data, symbol_name);
		i++;
	}
}
```

![Plus d'informations sur les symboles](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ib35tK7AbIyH_YPS6QhmJw.png)

Pour `nm`, la tâche principale est d'imprimer une ligne pour chaque symbole montrant son adresse et une lettre représentant son type (par ex., `T` pour une fonction dans la section text, `U` pour indéfini/externe).

[Vous pouvez trouver une liste complète des types de symboles sur la page man de nm](https://linux.die.net/man/1/nm?source=post_page-----7d4fef3d7507--------------------------------).

Trouver la bonne lettre implique de vérifier le champ `n_type` du symbole.

```c
// Ceux-ci sont définis dans <mach-o/nlist.h>
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

Si le type d'un symbole est `N_SECT`, vous devez regarder la section à laquelle il appartient.

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

## Monter en niveau : les prochains défis

Une fois que vous avez les bases, vous avez une fondation solide pour votre propre `nm` et `otool`. Si vous cherchez à pousser plus loin, voici quelques défis avancés à relever.

### 1. Gérer les archives et les fat files

Un "fat binary" est essentiellement une enveloppe qui contient plusieurs fichiers Mach-O, chacun pour une architecture de processeur différente. Pour gérer cela, vous devrez creuser dans les fichiers d'en-tête `<mach-o/fat.h>` et `<ar.h>`. La logique de parsing est similaire, juste avec une couche supplémentaire par-dessus.

### 2. Supporter l'endianness

Vous vous souvenez du big et little endian ? Parfois, vous recevrez un fichier avec un ordre d'octets différent de celui de votre machine. Cela signifie que vous devrez intervertir l'ordre des octets pour toutes les valeurs entières que vous lisez des en-têtes. C'est comme un petit puzzle de jonglage d'octets amusant.

### 3. Supporter à la fois le 32-bit et le 64-bit

Votre code devrait être capable de gérer à la fois les binaires 32-bit et 64-bit. C'est comme être bilingue dans le monde des exécutables, et cela implique principalement d'utiliser les structures de données correctes pour chacun.

### 4. Se prémunir contre les fichiers corrompus 🏴‍☠️

Tous les binaires dans la nature ne sont pas bien élevés. Un fichier corrompu pourrait avoir des valeurs de taille ou des offsets qui pointent vers des endroits aléatoires en mémoire. Ajoutez toujours des vérifications pour vous assurer que vos pointeurs et offsets restent dans les limites réelles du fichier. Voyez ça comme installer des garde-fous sur votre exploration.

## Pour conclure

Construire mon propre `nm` et `otool` était comme obtenir une paire de lunettes à rayons X pour les exécutables. C'est un projet qui vous force à confronter le fonctionnement des ordinateurs à un niveau profondément plus bas. Alors, mon conseil est le suivant : retroussez vos manches, ouvrez votre éditeur préféré, et commencez à creuser dans le monde incroyable de l'analyse binaire.

La clé est d'être patient et curieux. N'ayez pas peur d'expérimenter, et gardez ces man pages à portée de main. Bon code ! 🖥️🔍
