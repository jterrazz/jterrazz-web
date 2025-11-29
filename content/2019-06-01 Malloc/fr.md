![](assets/thumbnail.jpg)

# Maîtriser la gestion de la mémoire : j'ai codé mon propre malloc, et vous devriez essayer

Vous êtes-vous déjà demandé comment votre ordinateur jongle avec des milliers de milliards d'octets chaque seconde ? 🤹‍♂️ C'est une question qui m'a toujours fasciné. J'ai donc décidé de soulever le capot et de plonger dans l'un des éléments les plus fondamentaux du puzzle : **l'allocation dynamique de mémoire**.

Dans cet article, je vais vous expliquer pourquoi `malloc` existe, comment il fonctionne en profondeur, et comment j'ai construit ma propre version de zéro en utilisant l'appel système `mmap`. Si cela semble complexe, ne vous inquiétez pas. Je vais tout déconstruire à partir des premiers principes. Pour moi, comprendre cela a été un véritable déclic. Et si vous voulez mettre les mains dans le cambouis, mon [projet complet est sur GitHub](https://github.com/jterrazz/42-malloc). C'est parti. 🚀

```c
// Voici les fonctions que nous allons construire.
void  malloc(size_t size);
void  free(void* ptr);
void  realloc(void* ptr, size_t size);
void  calloc(size_t count, size_t size);

// C'est ainsi que nous demanderons de la mémoire à l'OS.
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
int   munmap(void* addr, size_t len);

// Et ceci nous aide à fixer quelques règles de base.
#include <sys/resource.h>

int   getrlimit(int resource, struct rlimit* rlp);
int   setrlimit(int resource, const struct rlimit* rlp);
```

## La mémoire : le rigide, l'éphémère et l'à la demande

Touchons rapidement un mot sur la façon dont le C gère normalement la mémoire. C'est un système assez rigide.

- **Variables statiques et globales** : Elles sont gravées dans le marbre lors de la compilation. Elles existent du moment où le programme démarre jusqu'à la seconde où il s'arrête, vivant aux côtés du code lui-même.
- **Variables automatiques** : Ce sont celles à l'intérieur des fonctions. Elles sont créées sur la "stack" (pile) lorsqu'une fonction est appelée et disparaissent dès que la fonction se termine.

Cela fonctionne, mais avec deux limites majeures :

1. **Vous devez connaître la taille de tout à l'avance.** Impossible de créer un tableau et de décider de sa taille plus tard.
2. **Vous êtes coincé avec une durée de vie fixe.** La mémoire dure soit pour toujours, soit le temps d'un appel de fonction. Rien entre les deux.

C'est pourquoi nous avons besoin de l'allocation dynamique. C'est pour toutes les situations où vous ne connaissez ni le "quoi" ni le "quand" au moment de la compilation.

### L'outil puissant du noyau : `mmap`

```c
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
```

Alors, comment obtenir de la mémoire à la demande ? Nous devons demander au système d'exploitation. Le noyau fournit un outil puissant pour cela appelé un **appel système**. Celui sur lequel je me suis concentré est `mmap()`. Voyez-le comme une ligne directe vers l'OS, lui demandant de réserver un morceau de mémoire physique et de le mapper à une adresse virtuelle dans notre programme. C'est la source ultime de mémoire. 🌌

Il existe un autre outil appelé `sbrk`, mais pour ce projet, `mmap` est notre arme de choix. Il est incroyablement flexible pour gérer les régions mémoire.

### Si `mmap` est la source, pourquoi s'embêter avec `malloc` ?

C'était ma première grande interrogation. Si `mmap` nous donne de la mémoire, pourquoi ne pas simplement l'appeler chaque fois que nous avons besoin d'une nouvelle variable ?

La réponse est la performance. Les appels système sont coûteux. Ils nécessitent un changement de contexte de votre programme vers le noyau, ce qui est une opération lente. La plupart des applications demandent et libèrent de petits bouts de mémoire des milliers de fois par seconde. Si chacune de ces demandes était un appel système complet, nos programmes seraient incroyablement lents.

C'est là que `malloc` intervient. C'est un intermédiaire astucieux. Au lieu d'aller voir le noyau pour chaque petite chose, `malloc` y va une fois et demande un énorme bloc de mémoire. Ensuite, il gère ce bloc pour vous. Quand vous demandez un peu de mémoire, `malloc` découpe simplement une tranche du bloc qu'il détient déjà. Oui, cela ajoute un peu de surcharge (la bibliothèque `malloc` elle-même utilise de la mémoire), mais le gain de vitesse est énorme. C'est un compromis d'ingénierie classique.

## Construisons la chose : mon implémentation

### La bibliothèque : la boîte à outils mémoire

Ma bibliothèque `malloc` fournit le trio classique :

- `malloc` : Demande un bloc de mémoire et renvoie un pointeur vers celui-ci.
- `free` : Reprend ce pointeur quand vous avez fini et marque la mémoire comme disponible.
- `realloc` : Vous permet de redimensionner un bloc de mémoire déjà alloué, en conservant les données d'origine.

### La structure de données : mon organisation de la mémoire

Pour faire fonctionner cela, je devais décider comment garder une trace de tout. J'ai opté pour une hiérarchie à deux niveaux :

- **Heap (Tas)** : Une grande région de mémoire que je demande à l'OS via `mmap`.
- **Block (Bloc)** : Un morceau plus petit d'un tas que je distribue quand `malloc` est appelé.

Les deux ont besoin de métadonnées. Je place un petit en-tête au début de chaque tas et de chaque bloc pour stocker des informations. Après un seul appel `malloc`, la carte mémoire ressemble à ceci :

![Structure Heap et Block](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iXHfrEUza03cFe5IXEvs0Q.png)

Voici les `structs` C que j'ai définies pour ces métadonnées :

```c
// Métadonnées pour toute une région mmap'ée
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

En donnant à chaque bloc des pointeurs `next` et `prev`, j'ai effectivement créé une liste chaînée. Cela me permet de parcourir le tas pour trouver des espaces libres ou pour trouver les voisins d'un bloc que je veux libérer (`free`).

Ces petites macros servaient d'aides pour sauter rapidement du début d'un tas ou d'un bloc vers la zone de données utilisateur.

```c
#define HEAP_SHIFT(start)   ((void*)start + sizeof(t_heap))
#define BLOCK_SHIFT(start)  ((void*)start + sizeof(t_block))
```

### Stratégie de performance : toutes les allocations ne se valent pas

J'ai vite réalisé que traiter une allocation de 10 octets de la même manière qu'une de 10 mégaoctets était une mauvaise idée. Pour optimiser, j'ai créé trois catégories : `TINY`, `SMALL` et `LARGE`. Ma stratégie était de pré-allouer des pages mémoire pour les requêtes `TINY` et `SMALL`, en visant à faire tenir au moins 100 blocs dans chaque tas. Les blocs `LARGE` sont l'exception ; ils sont alloués au coup par coup sans pré-allocation car ils sont généralement rares.

Une petite astuce de pro que j'ai apprise : il est bien plus efficace de dimensionner vos tas comme un multiple de la taille de page du système. Vous pouvez l'obtenir avec `getpagesize()` (ou `getconf PAGE_SIZE` dans le terminal). Sur ma machine, c'est 4096 octets.

J'ai donc fait quelques calculs pour définir les tailles de mes tas :

```c
// Une page peut contenir 128 blocs minuscules (tiny)
#define  TINY_HEAP_ALLOCATION_SIZE   (4 * getpagesize())
#define  TINY_BLOCK_SIZE             (TINY_HEAP_ALLOCATION_SIZE / 128)

// Quatre pages peuvent contenir 128 petits blocs (small)
#define  SMALL_HEAP_ALLOCATION_SIZE  (16 * getpagesize())
#define  SMALL_BLOCK_SIZE            (SMALL_HEAP_ALLOCATION_SIZE / 128)
```

### L'algorithme `malloc` : trouver une place pour les données

Quand un appel `malloc` arrive, voici la logique que mon code suit :

1. Il regarde d'abord un pointeur global pour voir si des tas existent déjà.
2. Il parcourt ensuite la liste des tas, cherchant un bloc libre assez grand. J'ai utilisé la stratégie du **first-fit** (premier adapté) : prendre le premier qui convient. C'est simple et rapide.
3. S'il arrive à la fin d'un tas et qu'il reste de la place, il y ajoute simplement un nouveau bloc.
4. Si le dernier tas est totalement plein, il est temps de demander plus de terrain à l'OS en appelant `mmap`.

```c
// L'appel système pour créer un nouveau tas.
void *heap = (t_heap *)mmap(NULL, heap_size, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANON, -1, 0);
```

### `free` et le problème de la fragmentation

![Fragmentation Mémoire](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y7xikxHO1Yoyv1eZm7l6aA.png)

Quand `free` est appelé, marquer simplement un bloc comme "disponible" est facile, mais cela crée un problème appelé **fragmentation**. Vous vous retrouvez avec plein de petits trous inutiles dans votre mémoire, comme une partie de Tetris qui a mal tourné.

Pour combattre cela, j'ai implémenté quelques stratégies clés :

- **Fusion (Coalescing) :** Quand un bloc est libéré, je vérifie si ses voisins sont aussi libres. Si c'est le cas, je les fusionne en un seul bloc libre plus grand.
- **Rendre la mémoire :** Si le bloc libéré est le tout dernier d'un tas, et que j'ai d'autres tas disponibles, je relâche simplement le tas vide entier à l'OS avec `munmap`. Aucun intérêt à garder de la mémoire vide.

```c
// Rendre la mémoire au noyau.
munmap(heap, heap->total_size);
```

### `realloc` : le métamorphe

`realloc` se résume souvent à une recette simple : `malloc` un nouveau bloc de la taille désirée, `memcpy` les données de l'ancien bloc vers le nouveau, puis `free` l'ancien bloc.

Un cas particulier à connaître est `realloc(ptr, 0)`. Le comportement ici peut varier. J'ai adopté une approche "paresseuse" en renvoyant simplement le pointeur d'origine. Sachez cependant que certains standards disent que cela devrait équivaloir à `free(ptr)`. Mon conseil : n'utilisez pas `realloc` pour `free` de la mémoire. Utilisez le bon outil pour le job.

## Mise à l'épreuve

La partie la plus gratifiante a été de voir mon `malloc` faire tourner des programmes réels. J'ai écrit un petit script pour forcer le linker dynamique à charger ma bibliothèque au lieu de celle standard du système.

```sh
#!/bin/sh
export DYLD_LIBRARY_PATH=.
export DYLD_INSERT_LIBRARIES=libft_malloc.so
export DYLD_FORCE_FLAT_NAMESPACE=1
$@
```

Sauvegarder ceci en `run.sh` m'a permis de faire des choses comme `sh run.sh ls -l` ou `sh run.sh vim` et de voir si ça marchait.

### Le crash de `vim` et la leçon sur l'alignement

Et bien sûr, tout n'a pas marché du premier coup. `ls` passait, mais lancer `vim` causait immédiatement une "segmentation fault". Que se passait-il ?

Le coupable était **l'alignement mémoire**. Il s'est avéré que le `malloc` standard sur macOS (où je testais) ne renvoie pas n'importe quel pointeur. Il garantit que l'adresse est un multiple de 16. Certains programmes et instructions comptent là-dessus pour la performance. Mon `malloc` ne le faisait pas, et `vim` plantait.

La correction fut une astuce binaire simple mais puissante : `size = (size + 15) & ~15;`. Cette seule ligne assure que la taille est toujours un multiple de 16, et donc que l'adresse retournée sera correctement alignée. Une leçon cruciale.

Et voilà l'aventure ! Nous sommes passés de l'appel `mmap` du noyau jusqu'à une bibliothèque `malloc` fonctionnelle et testée. Pour moi, ce projet n'était pas juste écrire du code ; c'était démystifier une partie fondamentale du fonctionnement de nos machines.

C'était un rappel puissant que la pratique est tout. Si vous voulez creuser plus loin, je vous encourage à jeter un œil à l'[implémentation complète sur mon GitHub](https://github.com/jterrazz/42-malloc). Forkez-le, cassez-le, et améliorez-le. Quand vous comprenez vraiment les fondations, vous gagnez le pouvoir de construire n'importe quoi par-dessus. Bon code.
