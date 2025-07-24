![](assets/thumbnail.jpg)

# Maîtriser la gestion de la mémoire, le jour où j'ai codé mon `malloc`

Vous êtes-vous déjà demandé comment votre ordinateur jongle avec des milliards d'octets chaque seconde? 🤹‍♂️ C'est une question qui m'a toujours fasciné. J'ai donc décidé de soulever le capot pour explorer l'une des pièces maîtresses de cette mécanique: **l'allocation dynamique de la mémoire**.

Dans cet article, je vous guide à travers la raison d'être de `malloc`, ses rouages internes, et le récit de la création de ma propre version, de A à Z, en m'appuyant sur l'appel système `mmap`. Si l'idée vous intimide, n'ayez crainte: je vais tout décomposer, en repartant des fondations. Pour moi, percer ces mystères fut une révélation. Et pour ceux qui aiment mettre les mains dans le cambouis, [mon projet final est disponible sur GitHub](https://github.com/jterrazz/42-malloc). Embarquons. 🚀

```c
// Voici les fonctions que nous allons construire.
void  malloc(size_t size);
void  free(void* ptr);
void  realloc(void* ptr, size_t size);
void  calloc(size_t count, size_t size);

// C'est ainsi que nous demanderons de la mémoire au système d'exploitation.
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
int   munmap(void* addr, size_t len);

// Et ceci nous aidera à définir quelques règles de base.
#include <sys/resource.h>

int   getrlimit(int resource, struct rlimit* rlp);
int   setrlimit(int resource, const struct rlimit* rlp);
```

## Les trois visages de la mémoire: statique, sur la pile et dynamique

Revenons un instant aux fondamentaux: comment le C gère-t-il la mémoire par défaut? C'est un système plutôt rigide.

- **Variables statiques et globales**: Elles sont figées dans le marbre à la compilation. Leur place est réservée pour toute la durée de vie du programme, au même titre que le code exécutable lui-même.
- **Variables automatiques**: Celles que l'on déclare au sein des fonctions. Elles naissent sur la " stack " (la pile) à l'appel d'une fonction et s'évanouissent dès que celle-ci se termine.

Ce système fonctionne, mais il bute sur deux limitations majeures:

1. **La taille de toutes les données doit être connue à l'avance.** Impossible, donc, de créer un tableau dont la taille serait décidée en cours de route.
2. **La durée de vie est immuable.** La mémoire persiste soit pour toute l'exécution du programme, soit le temps d'un appel de fonction. Pas d'entre-deux.

C'est ici qu'entre en scène l'allocation dynamique, conçue pour toutes les situations où l'on ne connaît ni le " quoi " ni le " quand " au moment de la compilation.

### `mmap`: le dialogue direct avec le noyau

```c
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
```

Comment donc obtenir de la mémoire à la demande? Il faut la solliciter auprès du système d'exploitation. Le noyau met à notre disposition un outil puissant pour cela: un **appel système** (*system call*). Celui sur lequel je me suis concentré est `mmap()`. Imaginez une ligne directe avec le noyau, lui demandant de réserver une parcelle de mémoire physique et de la " mapper " à une adresse virtuelle dans notre programme. C'est notre source première de mémoire brute. 🌌

Il existe un autre outil, `sbrk`, mais pour ce projet, `mmap` est notre arme de prédilection. Sa souplesse pour manipuler des régions mémoire est sans égale.

### Si `mmap` est la source, pourquoi s'encombrer de `malloc`?

Ce fut ma première grande interrogation. Si `mmap` nous fournit la mémoire, pourquoi ne pas simplement l'appeler chaque fois que nous en avons besoin?

La réponse tient en un mot: performance. Les appels système sont coûteux. Chaque appel implique un changement de contexte (*context switch*) entre votre programme et le noyau, une opération particulièrement coûteuse en temps. La plupart des applications demandent et libèrent de petites quantités de mémoire des milliers de fois par seconde. Si chacune de ces requêtes était un appel système à part entière, les performances de nos applications s'effondreraient.

C'est là que `malloc` entre en jeu. Il joue le rôle d'un gestionnaire avisé. Au lieu que vous ne sollicitiez le noyau pour chaque broutille, `malloc` demande au système *une seule fois* un vaste territoire de mémoire, qu'il se charge ensuite de morceler pour vous. Lorsque vous demandez un peu de mémoire, `malloc` se contente de découper une tranche du segment qu'il détient déjà. Certes, cela ajoute une légère surcouche de gestion (*overhead*), mais le gain en vitesse est colossal. C'est un compromis d'ingénierie des plus classiques.

## Passons à la construction: mon implémentation

### La bibliothèque: la boîte à outils mémoire

Ma bibliothèque `malloc` fournit le trio classique:

- `malloc`: Demande un bloc de mémoire et retourne un pointeur vers celui-ci.
- `free`: Récupère ce pointeur lorsque vous avez terminé et marque la mémoire comme de nouveau disponible.
- `realloc`: Permet de redimensionner un bloc de mémoire déjà alloué, tout en préservant les données qu'il contient.

### La structure des données: l'anatomie de ma mémoire

Pour que cela fonctionne, je devais savoir à tout instant où se trouvait chaque allocation. Mon approche repose sur une hiérarchie à deux niveaux:

- **Heap** (ou tas): Une large région de mémoire que je demande au système d'exploitation via `mmap`.
- **Bloc**: Un plus petit morceau d'un *heap* que je distribue à chaque appel à `malloc`.

Ces deux entités nécessitent des métadonnées. J'ai donc placé un petit en-tête (*header*) juste avant chaque *heap* et chaque *bloc* pour y stocker des informations cruciales. Après un simple appel à `malloc`, la carte mémoire ressemble à ceci:

![Heap and Block Structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iXHfrEUza03cFe5IXEvs0Q.png)

Voici les `structs` C que j'ai définies pour ces métadonnées:

```c
// Métadonnées pour une région entière mappée par mmap
typedef struct s_heap {
  struct s_heap   *prev;
  struct s_heap   *next;
  t_heap_group    group; // TINY, SMALL, ou LARGE
  size_t          total_size;
  size_t          free_size;
  size_t          block_count;
} t_heap;

// Métadonnées pour un seul bloc alloué
typedef struct s_block {
  struct s_block  *prev;
  struct s_block  *next;
  size_t          data_size;
  bool            freed;
} t_block;
```

En dotant chaque bloc de pointeurs `next` et `prev`, j'ai de fait créé une liste doublement chaînée. Cette chaîne me permet de traverser le *heap* pour dénicher un espace libre ou pour identifier les voisins d'un bloc que je souhaite libérer.

Ces petites macros m'ont servi de raccourcis pour naviguer rapidement du début d'un *heap* ou d'un *bloc* à la zone de données utilisable par l'utilisateur.

```c
#define HEAP_SHIFT(start)   ((void*)start + sizeof(t_heap))
#define BLOCK_SHIFT(start)  ((void*)start + sizeof(t_block))
```

### Stratégie de performance: toutes les allocations ne naissent pas égales

J'ai vite compris que traiter une allocation de 10 octets de la même manière qu'une de 10 mégaoctets relevait du non-sens. Pour optimiser, j'ai créé trois catégories: `TINY`, `SMALL` et `LARGE`. Ma stratégie: pré-allouer des pages mémoire pour les requêtes `TINY` et `SMALL`, avec pour objectif de pouvoir y loger au moins 100 blocs. Les allocations `LARGE` sont une exception; elles sont gérées au cas par cas, sans pré-allocation, car elles sont bien plus rares.

Une astuce d'initié, apprise sur le tas: il est bien plus efficace de choisir des tailles de *heap* qui soient des multiples de la taille de page système. On peut l'obtenir avec `getpagesize()` (ou `getconf PAGE_SIZE` dans le terminal). Sur ma machine, c'est 4096 octets.

J'ai donc fait quelques calculs pour définir les tailles de mes *heaps*:

```c
// Une page peut contenir 128 blocs "tiny"
#define  TINY_HEAP_ALLOCATION_SIZE   (4 * getpagesize())
#define  TINY_BLOCK_SIZE             (TINY_HEAP_ALLOCATION_SIZE / 128)

// Quatre pages peuvent contenir 128 blocs "small"
#define  SMALL_HEAP_ALLOCATION_SIZE  (16 * getpagesize())
#define  SMALL_BLOCK_SIZE            (SMALL_HEAP_ALLOCATION_SIZE / 128)
```

### L'algorithme de `malloc`: trouver un foyer pour les données

Lorsqu'un appel à `malloc` survient, voici la logique que suit mon code:

1. Il consulte d'abord un pointeur global pour voir si des *heaps* existent déjà.
2. Il parcourt ensuite la liste des *heaps*, à la recherche d'un bloc libre suffisamment grand. J'ai opté pour une stratégie **first-fit** (*premier ajustement*): prendre le premier qui convient. C'est simple et généralement rapide.
3. S'il arrive à la fin d'un *heap* où il reste de l'espace, il y greffe simplement un nouveau bloc.
4. Si tous les *heaps* existants sont pleins, il est temps de demander plus de " terrain " au système d'exploitation en appelant `mmap`.

```c
// L'appel système pour créer un nouveau heap.
void *heap = (t_heap *)mmap(NULL, heap_size, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANON, -1, 0);
```

### `free` et le spectre de la fragmentation

![Memory Fragmentation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y7xikxHO1Yoyv1eZm7l6aA.png)

Quand `free` est appelé, marquer un bloc comme " disponible " est simple. Mais cela crée un problème redoutable: la **fragmentation**. On se retrouve alors avec une mémoire mitée de petits trous inutilisables, tel un gruyère ou une partie de Tetris qui aurait viré au cauchemar.

Pour contrer ce phénomène, j'ai mis en œuvre deux stratégies clés:

- **La fusion (*coalescing*)**: Lorsqu'un bloc est libéré, je vérifie si ses voisins immédiats sont eux aussi libres. Si oui, je les fusionne pour former un seul grand bloc disponible.
- **La restitution de la mémoire**: Si le bloc en cours de libération est le tout dernier d'un *heap* et que d'autres *heaps* sont encore actifs, je libère l'intégralité du *heap* devenu vide en le retournant au système d'exploitation via `munmap`. Inutile de conserver de la mémoire inoccupée.

```c
// Rendre la mémoire au noyau.
munmap(heap, heap->total_size);
```

### `realloc`: le polymorphe

`realloc` n'est, au fond, qu'une chorégraphie bien huilée: allouer un nouveau bloc plus grand avec `malloc`, copier les données de l'ancien bloc vers le nouveau avec `memcpy`, puis libérer l'ancien avec `free`.

Il y a un cas limite à connaître: `realloc(ptr, 0)`. Le comportement attendu peut varier. J'ai adopté une approche " paresseuse " en retournant simplement le pointeur original. Cependant, certaines normes stipulent que cela devrait être équivalent à `free(ptr)`. Mon conseil: n'utilisez pas `realloc` pour libérer de la mémoire. À chaque outil sa fonction.

## L'épreuve du feu

La partie la plus gratifiante fut de voir mon `malloc` faire tourner de vrais programmes. J'ai écrit un petit script pour forcer l'éditeur de liens dynamique (*dynamic linker*) à charger ma bibliothèque à la place de celle du système.

```sh
#!/bin/sh
export DYLD_LIBRARY_PATH=.
export DYLD_INSERT_LIBRARIES=libft_malloc.so
export DYLD_FORCE_FLAT_NAMESPACE=1
$@
```

En sauvegardant ce fichier sous le nom `run.sh`, je pouvais lancer des commandes comme `sh run.sh ls -l` ou `sh run.sh vim` et observer le comportement.

### Le crash de `vim` et la leçon sur l'alignement

Évidemment, le succès ne fut pas immédiat. Si `ls` se lançait sans broncher, `vim`, lui, provoquait une erreur de segmentation fatale. Que se passait-il?

Le coupable: **l'alignement mémoire** (*memory alignment*). J'ai découvert que le `malloc` standard de macOS (où je faisais mes tests) ne se contente pas de retourner un pointeur. Il garantit que l'adresse fournie est un multiple de 16. Certains programmes et certaines instructions en dépendent pour des raisons de performance. Mon `malloc` ne respectait pas cette contrainte, et `vim` plantait.

La solution tenait en une ligne, une astuce binaire (*bitwise*) aussi simple qu'efficace: `size = (size + 15) & ~15;`. Cette unique ligne de code assure que la taille allouée est systématiquement un multiple de 16, et que l'adresse retournée sera donc correctement alignée. Une leçon capitale, apprise à la dure.

Ainsi s'achève notre périple. Partis d'un simple appel système au noyau, `mmap`, nous avons abouti à une bibliothèque `malloc` complète et éprouvée. Pour moi, ce projet n'était pas seulement une question de code; le véritable enjeu était de démystifier une mécanique au cœur de nos machines.

Rien ne vaut la pratique. Si vous souhaitez creuser le sujet, n'hésitez pas à consulter [l'implémentation complète sur mon GitHub](https://github.com/jterrazz/42-malloc). Forkez-le, cassez-le, améliorez-le. Car comprendre les fondations, c'est se donner le pouvoir de tout construire. Bon code à tous.
