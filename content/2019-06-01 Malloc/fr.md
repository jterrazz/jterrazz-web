![](assets/thumbnail.jpg)

# Maîtriser la Gestion De la Mémoire: J'ai Créé Mon Propre `malloc`, Et Vous Devriez En Faire Autant

Vous êtes-vous déjà demandé comment votre ordinateur parvient à brasser des milliers de milliards d'octets chaque seconde? 🤹‍♂️ C'est une question qui m'a toujours fasciné. J'ai donc décidé de soulever le voile pour plonger au cœur de l'un des mécanismes les plus fondamentaux: **l'allocation dynamique de mémoire**.

Dans cet article, je vous emmène avec moi à la découverte de `malloc`: pourquoi cette fonction existe, comment elle fonctionne dans ses moindres détails, et comment j'en ai bâti ma propre version à partir de zéro en utilisant l'appel système `mmap`. Si cela vous semble complexe, n'ayez crainte. Nous allons tout décomposer en partant des bases. Pour moi, comprendre ces rouages a été une véritable révélation. Et si vous souhaitez mettre les mains dans le cambouis, [mon projet est disponible sur GitHub](https://github.com/jterrazz/42-malloc). C'est parti! 🚀

```c
// Voici les fonctions que nous allons réécrire.
void  malloc(size_t size);
void  free(void* ptr);
void  realloc(void* ptr, size_t size);
void  calloc(size_t count, size_t size);

// C'est ainsi que nous demanderons de la mémoire au système d'exploitation.
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
int   munmap(void* addr, size_t len);

// Et ces fonctions nous aideront à définir quelques règles du jeu.
#include <sys/resource.h>

int   getrlimit(int resource, struct rlimit* rlp);
int   setrlimit(int resource, const struct rlimit* rlp);
```

## La Mémoire: Le Rigide, L'éphémère Et Le Sur-mesure

Revenons rapidement sur la manière dont le C gère traditionnellement la mémoire. C'est un système plutôt rigide.

* **Les variables statiques et globales**: Leur sort est scellé à la compilation. Elles existent dès le lancement du programme jusqu'à son arrêt, cohabitant avec le code lui-même.
* **Les variables automatiques**: Ce sont celles que l'on déclare dans les fonctions. Elles sont créées sur la "stack" (la pile) lors d'un appel de fonction et s'évanouissent dès que la fonction se termine.

Ce système fonctionne, mais il présente deux limitations majeures:

1. **Il faut connaître la taille de chaque élément à l'avance.** Impossible de créer un tableau et de décider de sa taille plus tard.
2. **Leur durée de vie est immuable.** La mémoire allouée dure soit éternellement, soit le temps d'un appel de fonction. Rien entre les deux.

C'est précisément là qu'intervient l'allocation dynamique. Elle est la solution pour toutes les situations où l'on ne connaît ni le "quoi", ni le "quand" au moment de la compilation.

### L'outil Ultime Du Noyau: `mmap`

```c
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
```

Alors, comment obtenir de la mémoire à la demande? Il faut en faire la requête au système d'exploitation. Le noyau met à notre disposition un outil puissant pour cela: un **appel système**. Celui sur lequel je me suis concentré est `mmap()`. Imaginez-le comme une ligne directe avec le système d'exploitation, pour lui demander de réserver un bloc de mémoire physique et de le "mapper" sur une adresse virtuelle dans notre programme. C'est la source de mémoire ultime. 🌌

Il existe un autre outil, `sbrk`, mais pour ce projet, `mmap` est notre arme de prédilection. Sa flexibilité pour gérer des régions de mémoire est incomparable.

### Si `mmap` Est la Source, Pourquoi S'embêter Avec `malloc`?

C'était la première grande question que je me suis posée. Si `mmap` nous fournit de la mémoire, pourquoi ne pas simplement l'appeler chaque fois que nous avons besoin d'une nouvelle variable?

La réponse tient en un mot: performance. Les appels système sont coûteux. Ils exigent une bascule de contexte (*context switch*) de votre programme vers le noyau, une opération qui prend un temps précieux. La plupart des applications demandent et libèrent des petits morceaux de mémoire des milliers de fois par seconde. Si chacune de ces requêtes était un appel système à part entière, nos programmes s'effondreraient sous la charge.

C'est là que `malloc` entre en jeu. C'est un intermédiaire astucieux. Au lieu que vous alliez voir le noyau pour la moindre broutille, `malloc` y va une seule fois pour demander un énorme bloc de mémoire. Ensuite, il gère ce bloc pour vous. Lorsque vous demandez un peu de mémoire, `malloc` se contente de vous en découper un morceau. Certes, cela ajoute une légère surcouche (*overhead*)–la bibliothèque `malloc` elle-même consomme un peu de mémoire–mais le gain de vitesse est colossal. C'est un compromis d'ingénierie classique.

## Passons à la Construction: Mon Implémentation

### La Bibliothèque: la Boîte à Outils Mémoire

Ma bibliothèque `malloc` fournit le trio classique:

* `malloc`: Demande un bloc de mémoire et retourne un pointeur vers celui-ci.
* `free`: Récupère ce pointeur lorsque vous avez terminé et marque la mémoire comme disponible.
* `realloc`: Permet de redimensionner un bloc de mémoire que vous avez déjà alloué, en conservant les données d'origine.

### La Structure De Données: Comment Organiser la Mémoire

Pour que tout cela fonctionne, je devais décider comment tout orchestrer. J'ai opté pour une hiérarchie à deux niveaux:

* **Heap**: Une grande région de mémoire que je demande au système d'exploitation via `mmap`.
* **Block**: Un plus petit morceau d'un *heap*, que je distribue lorsqu'on appelle `malloc`.

Ces deux éléments ont besoin de quelques métadonnées. J'ai donc placé un petit en-tête (*header*) au début de chaque *heap* et de chaque *block* pour y stocker des informations. Après un simple appel à `malloc`, la carte de la mémoire ressemble à ceci:

![Heap and Block Structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iXHfrEUza03cFe5IXEvs0Q.png)

Voici les `structs` C que j'ai définies pour ces métadonnées:

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

En dotant chaque bloc de pointeurs `next` et `prev`, j'ai de fait créé une liste chaînée. Cela me permet de parcourir le *heap* pour trouver des emplacements libres ou pour retrouver les voisins d'un bloc que je souhaite libérer avec `free`.

Ces petites macros m'ont servi de raccourcis pour passer rapidement du début d'un *heap* ou d'un *block* à la zone de données utilisateur.

```c
#define HEAP_SHIFT(start)   ((void*)start + sizeof(t_heap))
#define BLOCK_SHIFT(start)  ((void*)start + sizeof(t_block))
```

### Stratégie De Performance: Toutes Les Allocations Ne Se Valent Pas

J'ai vite compris que traiter de la même manière une allocation de 10 octets et une de 10 mégaoctets était une mauvaise idée. Pour optimiser, j'ai créé trois catégories: `TINY`, `SMALL`, et `LARGE`. Ma stratégie a été de pré-allouer des pages mémoires pour les requêtes `TINY` et `SMALL`, avec pour objectif de faire tenir au moins 100 blocs dans chaque *heap*. Les blocs `LARGE` sont l'exception; ils sont alloués un par un, sans pré-allocation, car ils sont généralement plus rares.

Une astuce que j'ai apprise en chemin: il est beaucoup plus efficace de choisir des tailles de *heap* qui soient des multiples de la taille de page du système. On peut obtenir cette valeur avec `getpagesize()` (ou `getconf PAGE_SIZE` dans le terminal). Sur ma machine, c'est 4096 octets.

J'ai donc fait quelques calculs pour définir mes tailles de *heap*:

```c
// One page can hold 128 tiny blocks
#define  TINY_HEAP_ALLOCATION_SIZE   (4 * getpagesize())
#define  TINY_BLOCK_SIZE             (TINY_HEAP_ALLOCATION_SIZE / 128)

// Four pages can hold 128 small blocks
#define  SMALL_HEAP_ALLOCATION_SIZE  (16 * getpagesize())
#define  SMALL_BLOCK_SIZE            (SMALL_HEAP_ALLOCATION_SIZE / 128)
```

### L'algorithme De `malloc`: Trouver Une place Pour Les Données

Lorsqu'un appel à `malloc` survient, voici la logique que suit mon code:

1. Il consulte d'abord un pointeur global pour voir si des *heaps* existent déjà.
2. Il parcourt ensuite la liste des *heaps*, à la recherche d'un bloc libre suffisamment grand. J'ai utilisé la stratégie du **first-fit**: prendre le premier qui convient. C'est simple et rapide.
3. S'il arrive à la fin d'un *heap* où il reste de la place, il y ajoute simplement un nouveau bloc.
4. Si le dernier *heap* est complètement plein, il est temps de demander plus de "terrain" au système d'exploitation en appelant `mmap`.

```c
// L'appel système pour créer un nouveau heap.
void *heap = (t_heap *)mmap(NULL, heap_size, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANON, -1, 0);
```

### `free` Et Le Problème De la Fragmentation

![Memory Fragmentation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y7xikxHO1Yoyv1eZm7l6aA.png)

Quand `free` est appelé, il est facile de simplement marquer un bloc comme "disponible", mais cela engendre un problème appelé la **fragmentation**. On se retrouve avec une multitude de petits trous inutilisables dans la mémoire, un peu comme une partie de Tetris qui aurait mal tourné.

Pour contrer ce phénomène, j'ai mis en œuvre deux stratégies clés:

* **La fusion (*Coalescing*):** Lorsqu'un bloc est libéré, je vérifie si ses voisins sont également libres. Si c'est le cas, je les fusionne en un seul grand bloc libre.
* **La restitution de la mémoire:** Si le bloc libéré est le tout dernier d'un *heap* et que j'ai d'autres *heaps* disponibles, je restitue simplement l'intégralité du *heap* vide au système d'exploitation avec `munmap`. Inutile de s'accrocher à de la mémoire vide.

```c
// Rendre la mémoire au noyau.
munmap(heap, heap->total_size);
```

### `realloc`: Le Métamorphe

`realloc` n'est en réalité qu'une recette simple: appeler `malloc` pour un nouveau bloc plus grand, copier les données de l'ancien bloc vers le nouveau avec `memcpy`, et libérer l'ancien bloc avec `free`.

Attention à un cas particulier: `realloc(ptr, 0)`. Le comportement peut varier ici. J'ai adopté une approche "paresseuse" en retournant simplement le pointeur d'origine. Cependant, sachez que certaines normes stipulent que cela devrait être équivalent à `free(ptr)`. Mon conseil: n'utilisez pas `realloc` pour libérer la mémoire. À chaque outil sa fonction.

## L'épreuve Du Feu

La partie la plus gratifiante a été de voir mon `malloc` faire tourner de vrais programmes. J'ai écrit un petit script pour forcer l'éditeur de liens dynamique à charger ma bibliothèque à la place de celle du système.

```sh
#!/bin/sh
export DYLD_LIBRARY_PATH=.
export DYLD_INSERT_LIBRARIES=libft_malloc.so
export DYLD_FORCE_FLAT_NAMESPACE=1
$@
```

En sauvegardant ce script sous `run.sh`, je pouvais lancer des commandes comme `sh run.sh ls -l` ou `sh run.sh vim` et voir si elles fonctionnaient.

### Le Crash De `vim` Et la Leçon Sur L'alignement

Bien sûr, tout n'a pas fonctionné du premier coup. `ls` se lançait sans problème, mais `vim` provoquait immédiatement une erreur de segmentation (*segmentation fault*). Que se passait-il?

Le coupable: **l'alignement de la mémoire**. Il s'est avéré que le `malloc` standard de macOS (où je faisais mes tests) ne retourne pas n'importe quel pointeur. Il garantit que l'adresse retournée est un multiple de 16. Certains programmes et instructions en dépendent pour des raisons de performance. Mon `malloc` ne le faisait pas, et `vim` plantait.

La solution fut une astuce binaire simple mais puissante: `size = (size + 15) & ~15;`. Cette unique ligne de code assure que la taille est toujours un multiple de 16, et donc que l'adresse retournée sera correctement alignée. Une leçon cruciale, apprise à la dure.

Et voilà pour l'aventure! Nous sommes partis de l'appel système `mmap` pour arriver à une bibliothèque `malloc` fonctionnelle et testée. Pour moi, ce projet n'était pas qu'une affaire de code; il s'agissait de démystifier un mécanisme au cœur du fonctionnement de nos machines.

La pratique est essentielle. Si vous voulez creuser le sujet, n'hésitez pas à consulter [l'implémentation complète sur mon GitHub](https://github.com/jterrazz/42-malloc). Forkez-le, cassez-le, améliorez-le. Comprendre les fondations, c'est se donner le pouvoir de tout construire. Happy coding
