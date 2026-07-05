![](assets/thumbnail.jpg)

# Reconstruire `nm` et `otool` : parser les binaires Mach-O en C

Comment votre ordinateur *comprend-il vraiment* un fichier exécutable ? Jusqu'au dernier octet. Cette question m'a poussé à réimplémenter `nm` et `otool` from scratch, en C. Un sacré voyage qui m'a donné une compréhension bien plus profonde des binaires et du fonctionnement bas niveau d'Unix.

Je vous partage ici ma démarche et une feuille de route pour construire vos propres versions. Mais un conseil : essayez d'abord par vous-même. Fouiller les **pages man** et les **headers système** vous apprendra plus que n'importe quel article.

> **Note** : Mon implémentation cible **Mach-O**, le format d'Apple pour macOS et iOS. Mais les concepts s'appliquent largement à d'autres formats.

[Le code complet est sur GitHub](https://github.com/jterrazz/42-nm-otool?source=post_page-----7d4fef3d7507--------------------------------).

## C'est quoi un exécutable, au juste ?

Quand un OS lance un programme, il s'attend à une structure bien précise. Une sorte de poignée de main secrète. Chaque système a son format :

- **macOS** : `Mach-O`
- **Linux** : `ELF`
- **Windows** : `PE`

[Liste complète des formats](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats) | [Référence Mach-O](https://github.com/aidansteele/osx-abi-macho-file-format-reference?source=post_page-----7d4fef3d7507--------------------------------)

### Étape 1 : identifier un fichier Mach-O

Chaque format a sa signature : une séquence d'octets au début du fichier appelée **magic number**. Pour Mach-O, quatre possibilités :

```c
// Dans <mach-o/loader.h>

#define  MH_MAGIC       0xfeedface
#define  MH_CIGAM       NXSwapInt(MH_MAGIC)
#define  MH_MAGIC_64    0xfeedfacf
#define  MH_CIGAM_64    NXSwapInt(MH_MAGIC_64)
```

Deux variables :

1. **Architecture** : 32 ou 64 bits.
2. **Endianness** : l'ordre des octets.

> "CIGAM", c'est juste "MAGIC" à l'envers. Malin.

[Pour comprendre l'endianness](https://medium.com/worldsensing-techblog/big-endian-or-little-endian-37c3ed008c94?source=post_page-----7d4fef3d7507--------------------------------)

## Pourquoi recréer `nm` et `otool` ?

Ces outils sont des rayons X pour binaires :

1. **Parser** la structure du fichier.
2. **Analyser** son contenu.
3. **Afficher** le tout de manière lisible.

Concrètement :

- **`nm`** : liste les **symboles** (noms de fonctions, variables).
- **`otool`** : affiche le **contenu hexadécimal** d'un segment.

![Exemple de sortie de nm et otool](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LyO3kfs-lQvJ-KmaKmyb9g.png)

## La structure Mach-O

Imaginez un fichier Mach-O comme une poupée russe. Chaque couche révèle plus de détails.

![Structure Mach-O](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gMKkvCSZXsGeVC0tH6PQ6w.png)

### Charger le fichier

Première étape : mapper le fichier en mémoire. Le combo classique `open` + `fstat` + `mmap` :

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

Ensuite, on vérifie le magic number :

```c
#include <mach-o/loader.h>

uint32_t magic = *(uint32_t *)(file_start);

if (magic == MH_MAGIC || magic == MH_CIGAM || magic == MH_MAGIC_64 || magic == MH_CIGAM_64)
  handle_macho_file();
```

### L'en-tête Mach-O

Tout fichier Mach-O commence par un header — la table des matières de l'exécutable.

```c
struct mach_header {
    uint32_t       magic;       /* magic number                     */
    cpu_type_t     cputype;     /* type de CPU                      */
    cpu_subtype_t  cpusubtype;  /* sous-type de CPU                 */
    uint32_t       filetype;    /* type de fichier                  */
    uint32_t       ncmds;       /* nombre de load commands          */
    uint32_t       sizeofcmds;  /* taille totale des load commands  */
    uint32_t       flags;       /* drapeaux                         */
};
```

Infos clés :

- `cpu_type` : quels processeurs peuvent l'exécuter.
- `filetype` : exécutable, bibliothèque, etc.

### Les load commands

Juste après le header, les load commands indiquent à l'OS comment charger le programme. Liste complète dans `loader.h`.

Deux nous intéressent particulièrement :

1. `LC_SYMTAB` : pointe vers la table des symboles.
2. `LC_SEGMENT` : définit les segments du binaire.

```c
struct load_command {
    uint32_t  cmd;      /* type de load command             */
    uint32_t  cmdsize;  /* taille totale de la commande     */
};
```

Pour les parcourir, on démarre après le header et on saute de l'un à l'autre via `cmdsize` :

```c
uint32_t ncmds = ((struct mach_header *)file_start)->ncmds;

lc = (struct load_command *)(file_start + sizeof(struct mach_header);

while (ncmds--) {
    parse_load_command(lc)
    lc = (void *)lc + lc->cmdsize;
}
```

#### `LC_SEGMENT` : les briques du binaire

Les segments définissent les grandes zones du fichier : `__TEXT` (le code), `__DATA` (les variables globales), etc.

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

Chaque segment se subdivise en sections :

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

Pour `otool` : trouver la section `__text` dans `__TEXT` et l'afficher en hexa. Pour `nm` : sauvegarder les infos de section pour les associer aux symboles plus tard.

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

`LC_SYMTAB` pointe vers l'index de l'exécutable : la liste des symboles (structures `nlist`) et la table de chaînes (`strtab`) pour leurs noms.

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

Pour récupérer le nom d'un symbole, on utilise `n_strx` comme offset dans la string table :

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

Pour `nm`, on affiche chaque symbole avec son adresse et une lettre indiquant son type (`T` = fonction text, `U` = undefined, etc.).

[Liste complète des types](https://linux.die.net/man/1/nm?source=post_page-----7d4fef3d7507--------------------------------)

Pour déterminer la lettre, on analyse le champ `n_type` :

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

Si le type est `N_SECT`, on regarde à quelle section appartient le symbole :

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

## Pour aller plus loin

Une fois les bases en place, quelques défis pour passer au niveau supérieur :

### 1. Archives et fat binaries

Un fat binary regroupe plusieurs Mach-O pour différentes architectures. Headers à explorer : `<mach-o/fat.h>` et `<ar.h>`. Même logique de parsing, juste une couche de plus.

### 2. Endianness

Parfois le fichier a un ordre d'octets différent de votre machine. Il faudra inverser les entiers lus depuis les headers.

### 3. Support 32/64 bits

Votre code doit gérer les deux. Principalement une question de choisir les bonnes structures.

### 4. Fichiers corrompus 🏴‍☠️

Un binaire malformé peut avoir des offsets qui pointent n'importe où. Toujours vérifier que vos pointeurs restent dans les limites du fichier.

## En résumé

Reconstruire `nm` et `otool`, c'est comme obtenir des rayons X pour exécutables. Un projet qui vous confronte au fonctionnement bas niveau des machines.

Soyez patient, curieux, et gardez les pages man à portée de main. Bon code ! 🖥️🔍
