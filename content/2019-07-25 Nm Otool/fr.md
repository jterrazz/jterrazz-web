![](assets/thumbnail.jpg)

# Décoder la magie : mon aventure pour recréer `nm` et `otool`

Vous êtes-vous déjà demandé comment votre ordinateur *comprend réellement* un fichier binaire ? Je parle de descendre jusqu'au dernier octet. Si cette curiosité vous parle, accrochez-vous. Je me suis récemment lancé dans l'implémentation des commandes `nm` et `otool` de zéro, en C. Ce fut un voyage. J'en suis ressorti avec une intuition bien plus profonde du fonctionnement des binaires et des systèmes Unix — un monde bas niveau fascinant.

Ici, je vais retracer mes pas et partager une feuille de route pour construire vos propres versions de ces outils. Mais laissez-moi vous donner un conseil d'entrée : essayez de le construire vous-même d'abord. Sérieusement. L'expérience de fouiller dans les **pages man** et les **fichiers d'en-tête système** vous accordera un niveau de compréhension qu'aucun article ne peut reproduire.

> **À noter** : Mon implémentation se concentre entièrement sur **Mach-O**, le format d'exécutable privilégié par Apple pour macOS et iOS. Mais même si vous êtes sur un autre OS, les concepts fondamentaux sont largement universels.

Pour ceux qui veulent plonger directement dans le code, [voici le projet GitHub complet](https://github.com/jterrazz/42-nm-otool?source=post_page-----7d4fef3d7507--------------------------------).

## Qu'est-ce qu'un fichier exécutable, exactement ?

Quand un système d'exploitation lance un programme, il a besoin que le fichier soit organisé d'une manière très précise. C'est comme une poignée de main secrète. Chaque OS a ses préférences :

- **macOS** utilise `Mach-O`
- **Linux** privilégie `ELF`
- **Windows** opte pour `PE`

Il existe une multitude d'autres formats. Si vous êtes curieux, vous pouvez consulter cette [liste complète des formats de fichiers exécutables](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats).

Pour une exploration approfondie du format Mach-O, [ce document est une véritable carte au trésor](https://github.com/aidansteele/osx-abi-macho-file-format-reference?source=post_page-----7d4fef3d7507--------------------------------).

### Étape 1 : S'assurer qu'il s'agit d'un fichier Mach-O

Chaque type de fichier possède une identité secrète : une séquence d'octets au tout début appelée **nombre magique** (magic number). C'est comme l'empreinte digitale du fichier. Pour les fichiers Mach-O, il y a quatre possibilités :

```c
// Défini dans <mach-o/loader.h>

#define  MH_MAGIC       0xfeedface
#define  MH_CIGAM       NXSwapInt(MH_MAGIC)
#define  MH_MAGIC_64    0xfeedfacf
#define  MH_CIGAM_64    NXSwapInt(MH_MAGIC_64)
```

Les différences se résument à deux choses :

1. **L'architecture** : 32 bits ou 64 bits.
2. **L'endianness** : L'ordre dans lequel les octets sont arrangés.

> **Anecdote** : "CIGAM" n'est rien d'autre que "MAGIC" écrit à l'envers. Astucieux, non ?

Si l'endianness est un concept nouveau pour vous, cet [article sur big vs. little endian](https://medium.com/worldsensing-techblog/big-endian-or-little-endian-37c3ed008c94?source=post_page-----7d4fef3d7507--------------------------------) est un excellent point de départ.

## Alors, pourquoi recréer `nm` et `otool` ?

Ces outils sont comme des lunettes à rayons X pour fichiers Mach-O, permettant de :

1. **Parser** la structure du fichier.
2. **Analyser** son contenu.
3. **Afficher** le tout dans un format lisible par un humain.

Voici le détail :

- **`nm`** : Affiche la liste des **symboles** (comme les noms de fonctions et de variables) contenus dans le fichier.
- **`otool`** : Affiche le **contenu hexadécimal** d'une partie spécifique du fichier, appelée segment.

![Exemple de sortie de nm et otool](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LyO3kfs-lQvJ-KmaKmyb9g.png)

## Plongée dans la structure Mach-O

Imaginez un fichier Mach-O comme une poupée russe. Chaque couche que vous ouvrez révèle plus de détails.

![Diagramme de la structure d'un fichier Mach-O](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gMKkvCSZXsGeVC0tH6PQ6w.png)

### Accéder au fichier

Première chose : nous devons charger le contenu du fichier en mémoire. J'ai utilisé le combo classique `open`, `fstat` et `mmap` pour obtenir un pointeur vers le début des données du fichier.

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

Une fois le fichier en mémoire, il est temps de vérifier ce fameux nombre magique.

```c
#include <mach-o/loader.h>

uint32_t magic = *(uint32_t *)(file_start);

if (magic == MH_MAGIC || magic == MH_CIGAM || magic == MH_MAGIC_64 || magic == MH_CIGAM_64)
  handle_macho_file();
```

### L'en-tête Mach-O

Tout fichier Mach-O débute par un en-tête. C'est en quelque sorte la table des matières de l'exécutable.

```c
struct mach_header {
    uint32_t       magic;       /* identifiant magic number mach    */
    cpu_type_t     cputype;     /* spécificateur de CPU             */
    cpu_subtype_t  cpusubtype;  /* spécificateur de machine         */
    uint32_t       filetype;    /* type de fichier                  */
    uint32_t       ncmds;       /* nombre de load commands          */
    uint32_t       sizeofcmds;  /* taille de toutes les load cmds   */
    uint32_t       flags;       /* drapeaux                         */
};
```

Cette structure regorge d'informations précieuses, comme :

- `cpu_type` : Quels processeurs peuvent exécuter ce fichier.
- `filetype` : Est-ce un exécutable, une bibliothèque, ou autre chose ?

### Les load commands : la feuille de route du binaire

Juste après l'en-tête, vous trouverez les load commands. Voyez-les comme des instructions qui indiquent à l'OS comment charger le programme en mémoire. Vous pouvez trouver la liste complète des types de commandes dans le fichier d'en-tête `loader.h`.

Pour ces outils, deux load commands sont particulièrement importantes :

1. `LC_SYMTAB` : Pointe vers les informations sur les symboles.
2. `LC_SEGMENT` : Définit les différents segments du binaire.

```c
struct load_command {
    uint32_t  cmd;      /* type de load command             */
    uint32_t  cmdsize;  /* taille totale de la commande     */
};
```

Les parcourir est assez simple. On démarre juste après l'en-tête et on saute de l'un à l'autre en utilisant `cmdsize`.

```c
uint32_t ncmds = ((struct mach_header *)file_start)->ncmds;

lc = (struct load_command *)(file_start + sizeof(struct mach_header);

while (ncmds--) {
    parse_load_command(lc)
    lc = (void *)lc + lc->cmdsize;
}
```

#### `LC_SEGMENT` : les blocs de construction

Les commandes de segment constituent la substance même du fichier. Elles définissent de gros morceaux du binaire, comme le segment `__TEXT` (où réside le code) et le segment `__DATA` (pour les variables globales).

```c
struct segment_command {            /* pour architectures 32 bits        */
    uint32_t   cmd;                 /* LC_SEGMENT                        */
    uint32_t   cmdsize;             /* inclut sizeof section structs     */
    char       segname[16];         /* nom du segment                    */
    uint32_t   vmaddr;              /* adresse mémoire de ce segment     */
    uint32_t   vmsize;              /* taille mémoire de ce segment      */
    uint32_t   fileoff;             /* offset dans le fichier            */
    uint32_t   filesize;            /* quantité à mapper depuis fichier  */
    vm_prot_t  maxprot;             /* protection VM maximale            */
    vm_prot_t  initprot;            /* protection VM initiale            */
    uint32_t   nsects;              /* nombre de sections dans segment   */
    uint32_t   flags;               /* drapeaux                          */
}
```

Chaque segment est ensuite subdivisé en sections.

```c
struct section {                    /* pour architectures 32 bits        */
    char       sectname[16];        /* nom de cette section              */
    char       segname[16];         /* segment contenant cette section   */
    uint32_t   addr;                /* adresse mémoire de cette section  */
    uint32_t   size;                /* taille en octets                  */
    uint32_t   offset;              /* offset dans le fichier            */
    uint32_t   align;               /* alignement (puissance de 2)       */
    uint32_t   reloff;              /* offset des entrées de relocation  */
    uint32_t   nreloc;              /* nombre d'entrées de relocation    */
    uint32_t   flags;               /* drapeaux (type et attributs)      */
    uint32_t   reserved1;           /* réservé (pour offset ou index)    */
    uint32_t   reserved2;           /* réservé (pour count ou sizeof)    */
}
```

Pour `otool`, l'objectif est de trouver la section `__text` à l'intérieur du segment `__TEXT` et d'afficher son contenu sous forme de dump hexadécimal. Pour `nm`, j'avais besoin de sauvegarder les informations de section pour les faire correspondre aux symboles plus tard.

```c
int parse_mach_segment(void *segment_command) {
    uint32_t  nsects;
    void      *section;

    section = segment_command + sizeof(struct segment_command);
    nsects = ((struct segment_command *) segment_command)->nsects;

    while (nsects--) {
        // Traiter chaque section
        if (bin == OTOOL) {
            // Si section est __text, hexdump les données
        } else if (bin == NM) {
            // Sauvegarder la section pour correspondance avec SYMTAB
        }
        section += sizeof(struct s_section);
    }
}
```

### `LC_SYMTAB` : la table des symboles

La commande de table des symboles, `LC_SYMTAB`, pointe vers l'index de notre exécutable. Elle nous indique où trouver la liste des symboles (structures `nlist`) et la table de chaînes (`strtab`) utilisée pour obtenir leurs noms.

```c
struct symtab_command {
    uint32_t  cmd;      /* LC_SYMTAB                        */
    uint32_t  cmdsize;  /* sizeof(struct symtab_command)    */
    uint32_t  symoff;   /* offset de la table des symboles  */
    uint32_t  nsyms;    /* nombre d'entrées                 */
    uint32_t  stroff;   /* offset de la table de chaînes    */
    uint32_t  strsize;  /* taille de la table de chaînes    */
};
```

```c
struct nlist {
    union {
        char  *n_name;   /* pour utilisation en mémoire       */
        long  n_strx;    /* index dans la table de chaînes    */
    } n_un;
    unsigned char  n_type;   /* drapeau de type                   */
    unsigned char  n_sect;   /* numéro de section ou NO_SECT      */
    short          n_desc;   /* voir <mach-o/stab.h>              */
    unsigned long  n_value;  /* valeur du symbole (ou offset stab)*/
};
```

Pour obtenir le nom d'un symbole, on utilise la valeur `n_strx` comme offset dans la table de chaînes.

```c
int parse_mach_symtab(struct symtab_command *symtab_command)
{
    void      *strtab = file_start + symtab_command->stroff;
    void      *symtab = file_start + symtab_command->symoff;
    uint32_t  nsyms = symtab_command->nsyms;
    uint32_t  i = 0;

    while (i < nsyms) {
        // Données du symbole
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

Pour `nm`, la tâche principale est d'afficher une ligne pour chaque symbole montrant son adresse et une lettre représentant son type (par exemple, `T` pour une fonction dans la section text, `U` pour undefined/externe).

[Vous pouvez trouver une liste complète des types de symboles sur la page man de nm](https://linux.die.net/man/1/nm?source=post_page-----7d4fef3d7507--------------------------------).

Déterminer la bonne lettre implique de vérifier le champ `n_type` du symbole.

```c
// Définis dans <mach-o/nlist.h>
#define  N_UNDF  0x0   /* indéfini, n_sect == NO_SECT                           */
#define  N_ABS   0x2   /* absolu, n_sect == NO_SECT                             */
#define  N_SECT  0xe   /* défini dans la section numéro n_sect                  */
#define  N_PBUD  0xc   /* prebound undefined (défini dans une dylib)            */
#define  N_INDR  0xa

#define  N_STAB  0xe0  /* si un de ces bits est set, entrée de débogage         */
#define  N_PEXT  0x10  /* bit symbole externe privé                             */
#define  N_TYPE  0x0e  /* masque pour les bits de type                          */
#define  N_EXT   0x01  /* bit symbole externe, set pour symboles externes       */

char get_symbol_letter(sym) {
    if (N_STAB & sym->type)
        return '-'; // Symbole de débogage
    else if ((N_TYPE & sym->type) == N_UNDF) {
        if (sym->name_not_found) // Vérification personnalisée
            return 'C'; // Symbole commun
        else if (sym->type & N_EXT)
            return 'U'; // Indéfini
        else
            return '?';
    } else if ((N_TYPE & sym->type) == N_SECT) {
        return match_symbol_section(saved_sections, sym); // Correspondance avec section sauvegardée
    } else if ((N_TYPE & sym->type) == N_ABS) {
        return 'A'; // Absolu
    } else if ((N_TYPE & sym->type) == N_INDR) {
        return 'I'; // Indirect
    }
}
```

Si le type d'un symbole est `N_SECT`, il faut examiner la section à laquelle il appartient.

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

## Passer au niveau supérieur : les défis avancés

Une fois les bases maîtrisées, vous disposez d'une fondation solide pour vos propres `nm` et `otool`. Si vous voulez aller plus loin, voici quelques défis avancés à relever.

### 1. Gérer les archives et les fat files

Un "fat binary" est essentiellement un conteneur qui regroupe plusieurs fichiers Mach-O, chacun pour une architecture de processeur différente. Pour les gérer, vous devrez explorer les fichiers d'en-tête `<mach-o/fat.h>` et `<ar.h>`. La logique de parsing est similaire, juste avec une couche supplémentaire par-dessus.

### 2. Supporter l'endianness

Vous vous souvenez du big et little endian ? Parfois vous recevrez un fichier avec un ordre d'octets différent de celui utilisé par votre machine. Cela signifie que vous devrez inverser l'ordre des octets pour toutes les valeurs entières lues depuis les en-têtes. C'est comme un petit puzzle de jonglage d'octets.

### 3. Supporter le 32 bits et le 64 bits

Votre code devrait pouvoir gérer les binaires 32 bits et 64 bits. C'est comme être bilingue dans le monde des exécutables, et cela implique principalement d'utiliser les bonnes structures de données pour chaque cas.

### 4. Se protéger contre les fichiers corrompus 🏴‍☠️

Tous les binaires que vous rencontrerez ne seront pas bien formés. Un fichier corrompu pourrait avoir des valeurs de taille ou des offsets pointant vers des emplacements aléatoires en mémoire. Ajoutez toujours des vérifications pour vous assurer que vos pointeurs et offsets restent dans les limites réelles du fichier. Voyez cela comme installer des garde-fous sur votre exploration.

## Pour conclure

Construire mes propres `nm` et `otool` fut comme obtenir une paire de lunettes à rayons X pour exécutables. C'est un projet qui vous force à confronter le fonctionnement des ordinateurs à un niveau profondément plus bas. Alors, mon conseil est le suivant : retroussez vos manches, ouvrez votre éditeur favori, et commencez à creuser dans l'incroyable monde de l'analyse binaire.

La clé est d'être patient et curieux. N'ayez pas peur d'expérimenter, et gardez ces pages man à portée de main. Bon code ! 🖥️🔍
