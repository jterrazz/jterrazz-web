![](assets/thumbnail.jpg)

# Décoder la Magie: Mon Aventure Au Cœur De `nm` Et `otool`

Vous êtes-vous déjà demandé comment un ordinateur *comprend* réellement un fichier binaire? Je veux dire, vraiment, au plus profond de sa logique. Si cette curiosité vous anime, alors attachez votre ceinture. J'ai récemment plongé dans le terrier du lapin blanc en réimplémentant les commandes `nm` et `otool` à partir de zéro en C. Ce fut un véritable voyage, et j'en suis ressorti avec une compréhension beaucoup plus intime du fonctionnement des binaires et des systèmes de type Unix. C'est un monde fascinant de programmation à bas niveau.

Dans cet article, je vais vous guider à travers tout ce dont vous avez besoin pour créer vos propres versions de ces outils. Mais laissez-moi vous donner un conseil avant de commencer: essayez de le faire vous-même d'abord. Vraiment. L'expérience de fouiller dans les **pages de manuel** et les **fichiers d'en-tête** du système vous apportera un niveau de compréhension qu'aucun article ne pourra jamais égaler.

> **Une précision importante**: Mon implémentation se concentre sur le format **Mach-O**, le format d'exécutable de prédilection d'Apple pour macOS et iOS. Mais même si vous êtes sur un autre système d'exploitation, les concepts fondamentaux sont quasiment universels.

Pour ceux qui veulent sauter directement au code, [voici le projet GitHub complet](https://github.com/jterrazz/42-nm-otool?source=post_page-----7d4fef3d7507--------------------------------).

## Qu'est-ce Qu'un Fichier Exécutable, Au Juste?

Lorsqu'un système d'exploitation lance un programme, il exige que le fichier soit organisé d'une manière bien précise. Pensez-y comme une sorte de poignée de main secrète. Chaque système a ses propres préférences:

* **macOS** utilise `Mach-O`
* **Linux** utilise principalement `ELF`
* **Windows** opte pour `PE`

Il existe une myriade d'autres formats. Si vous êtes curieux, vous pouvez consulter cette [longue liste de formats de fichiers exécutables](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats).

Pour une plongée en profondeur dans le format Mach-O, [ce document est une véritable carte au trésor](https://github.com/aidansteele/osx-abi-macho-file-format-reference?source=post_page-----7d4fef3d7507--------------------------------).

### Étape 1: S'assurer Que C'est Bien Un Fichier Mach-O

Chaque type de fichier possède une sorte d'identité secrète, une séquence d'octets située tout au début, appelée **nombre magique**. C'est comme l'empreinte digitale d'un fichier. Pour les fichiers Mach-O, il y a quatre possibilités:

```c
// Ceci est défini dans <mach-o/loader.h>

#define  MH_MAGIC       0xfeedface
#define  MH_CIGAM       NXSwapInt(MH_MAGIC)
#define  MH_MAGIC_64    0xfeedfacf
#define  MH_CIGAM_64    NXSwapInt(MH_MAGIC_64)
```

Les différences se résument à deux choses:

1. **L'architecture**: 32 bits ou 64 bits.
2. **L'endianness**: L'ordre dans lequel les octets sont stockés.

> **Pour l'anecdote**: "CIGAM" n'est autre que "MAGIC" écrit à l'envers. Plutôt malin, non?

Si le concept d'endianness est nouveau pour vous, cet [article sur le big vs. little endian (en anglais)](https://medium.com/worldsensing-techblog/big-endian-or-little-endian-37c3ed008c94?source=post_page-----7d4fef3d7507--------------------------------) l'explique très bien.

## Alors, Pourquoi Recréer `nm` Et `otool`?

Ces outils sont essentiellement des lunettes à rayons X pour les fichiers Mach-O. Ils vous permettent de:

1. **Analyser** (*parser*) la structure du fichier.
2. **Examiner** ce qu'il contient.
3. **Afficher** le tout d'une manière compréhensible pour un humain.

Voici le détail:

* **`nm`**: Affiche une liste des **symboles** (comme les noms de fonctions et de variables) contenus dans le fichier.
* **`otool`**: Affiche le **contenu hexadécimal** d'une partie spécifique du fichier, appelée un segment.

![Example output of nm and otool](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LyO3kfs-lQvJ-KmaKmyb9g.png)

## Plongée Dans la Structure Mach-O

Imaginez un fichier Mach-O comme l'une de ces poupées russes. Chaque couche que vous ouvrez révèle plus de détails.

![Mach-O file structure diagram](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gMKkvCSZXsGeVC0tH6PQ6w.png)

### Accéder Au Contenu Du Fichier

La toute première étape: nous devons lire le contenu du fichier en mémoire. J'ai utilisé la combinaison classique `open`, `fstat`, et `mmap` pour obtenir un pointeur vers le début des données du fichier.

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

Une fois le fichier en mémoire, il est temps de vérifier ce fameux nombre magique.

```c
#include <mach-o/loader.h>

uint32_t magic = *(uint32_t *)(file_start);

if (magic == MH_MAGIC || magic == MH_CIGAM || magic == MH_MAGIC_64 || magic == MH_CIGAM_64)
  handle_macho_file();
```

### L'en-tête Mach-O

Chaque fichier Mach-O s'ouvre sur un en-tête. C'est en quelque sorte la table des matières de l'exécutable.

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
* `filetype`: Est-ce un exécutable, une bibliothèque, ou autre chose?

### Les Commandes De Chargement: la Feuille De Route Du Binaire

Juste après l'en-tête se trouvent les commandes de chargement (*load commands*). Considérez-les comme des instructions qui indiquent au système d'exploitation comment charger le programme en mémoire. Vous pouvez trouver la liste complète des types de commandes dans le fichier d'en-tête `loader.h`.

Pour ce que je construisais, je me suis concentré sur deux commandes principales:

1. `LC_SYMTAB`: Pointeur vers les informations sur les symboles.
2. `LC_SEGMENT`: Définit les différents segments du binaire.

```c
struct load_command {
  uint32_t cmd;		/* type of load command */
  uint32_t cmdsize;	/* total size of command in bytes */
};
```

Itérer à travers elles est assez simple. On commence juste après l'en-tête et on saute de l'une à l'autre en utilisant `cmdsize`.

```c
uint32_t ncmds = ((struct mach_header *)file_start)->ncmds;

lc = (struct load_command *)(file_start + sizeof(struct mach_header);

while (ncmds--) {
  parse_load_command(lc)
  lc = (void *)lc +lc->cmdsize;
}
```

#### `LC_SEGMENT`: Les Briques De Construction

Les commandes de segment sont le véritable cœur du fichier. Elles définissent de grandes parties du binaire, comme le segment `__TEXT` (où réside le code) et le segment `__DATA` (pour les variables globales).

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

Chaque segment est ensuite subdivisé en sections.

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

Pour `otool`, l'objectif est de trouver la section `__text` à l'intérieur du segment `__TEXT` et d'afficher son contenu en hexadécimal. Pour `nm`, j'ai eu besoin de sauvegarder les informations de section pour les faire correspondre plus tard avec les symboles.

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

### `LC_SYMTAB`: La Table Des Symboles

La commande de table des symboles, `LC_SYMTAB`, agit comme l'index de notre exécutable. Elle nous indique où trouver la liste des symboles (structures `nlist`) et la table des chaînes de caractères (`strtab`) utilisée pour obtenir leurs noms.

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

Pour obtenir le nom d'un symbole, on utilise la valeur `n_strx` comme un décalage (*offset*) dans la table des chaînes.

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

![More symbol information](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Ib35tK7AbIyH_YPS6QhmJw.png)

Pour `nm`, la tâche principale est d'afficher une ligne pour chaque symbole, indiquant son adresse et une lettre représentant son type (par exemple, `T` pour une fonction dans la section texte, `U` pour non défini/externe).

[Vous pouvez trouver une liste complète des types de symboles sur la page de manuel de nm (en anglais)](https://linux.die.net/man/1/nm?source=post_page-----7d4fef3d7507--------------------------------).

Pour déterminer la bonne lettre, il faut examiner le champ `n_type` du symbole.

```c
// Ces valeurs sont définies dans <mach-o/nlist.h>
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
    if (sym->name_not_found) // C'est une vérification personnalisée que j'ai ajoutée
     return 'C'; // Symbole commun
    else if (sym->type & N_EXT)
     return = 'U'; // Non défini
    else
     return = '?';
  } else if ((N_TYPE & sym->type) == N_SECT) {
    return match_symbol_section(saved_sections, sym); // Faire correspondre avec une section sauvegardée
  } else if ((N_TYPE & sym->type) == N_ABS) {
    return = 'A'; // Absolu
  } else if ((N_TYPE & sym->type) == N_INDR) {
    return = 'I'; // Indirect
  }
}
```

Si le type d'un symbole est `N_SECT`, il faut regarder à quelle section il appartient.

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

    // Si le symbole n'est pas externe, mettre la lettre en minuscule
    if (!(mysym->type & N_EXT))
       ret += 'a' - 'A';
  }
}
```

## Pour Aller plus Loin: Les Défis Suivants

Une fois que vous maîtrisez les bases, vous disposez d'une fondation solide pour vos propres `nm` et `otool`. Si vous cherchez à pousser le projet plus loin, voici quelques défis avancés à relever.

### 1. Gérer Les Archives Et Les "fat files"

Un "fat binary" est essentiellement une enveloppe contenant plusieurs fichiers Mach-O, chacun pour une architecture de processeur différente. Pour les gérer, vous devrez explorer les fichiers d'en-tête `<mach-o/fat.h>` et `<ar.h>`. La logique d'analyse est similaire, avec simplement une couche supplémentaire à déchiffrer.

### 2. Gérer L'endianness

Vous vous souvenez du big et du little endian? Parfois, vous tomberez sur un fichier dont l'ordre des octets est différent de celui de votre machine. Cela signifie que vous devrez inverser l'ordre des octets pour toutes les valeurs entières que vous lisez dans les en-têtes. C'est un amusant petit casse-tête de jonglage d'octets.

### 3. Gérer à la Fois Le 32 Bits Et Le 64 Bits

Votre code devrait être capable de gérer les binaires 32 bits et 64 bits. C'est comme être bilingue dans le monde des exécutables, et cela implique principalement d'utiliser les structures de données appropriées pour chaque cas.

### 4. Se Protéger Des Fichiers Corrompus 🏴‍☠️

Tous les binaires que vous rencontrerez ne seront pas bien formés. Un fichier corrompu pourrait contenir des valeurs de taille ou des décalages pointant vers des emplacements aléatoires en mémoire. Ajoutez toujours des vérifications pour vous assurer que vos pointeurs et décalages restent dans les limites réelles du fichier. Pensez-y comme à l'installation de garde-fous pour votre exploration.

## En Conclusion

Construire mes propres versions de `nm` et `otool` a été comme recevoir une paire de lunettes à rayons X pour les exécutables. C'est un projet qui vous force à comprendre comment nos ordinateurs fonctionnent à un niveau beaucoup plus profond. Mon conseil est donc de retrousser vos manches, d'ouvrir votre éditeur de code préféré et de commencer à creuser dans le monde incroyable de l'analyse binaire.

La clé est d'être patient et curieux. N'ayez pas peur d'expérimenter et gardez ces pages de manuel à portée de main. Bon codage! 🖥️🔍
