![](assets/thumbnail.jpg)

# J'ai codé mon propre malloc : voyage au cœur de la gestion mémoire

Comment votre ordinateur fait-il pour jongler avec des milliards d'octets chaque seconde ? 🤹‍♂️ Cette question m'a toujours intrigué. Alors j'ai décidé d'aller voir ce qui se passe sous le capot, en m'attaquant à l'un des piliers de l'informatique : **l'allocation dynamique de mémoire**.

Dans cet article, je vous raconte pourquoi `malloc` existe, comment il fonctionne vraiment, et comment j'ai construit ma propre version avec l'appel système `mmap`. Si ça vous paraît intimidant, pas de panique : on va tout reprendre depuis le début. Ce projet m'a ouvert les yeux sur pas mal de choses. Et si vous voulez mettre les mains dans le cambouis, mon [code complet est sur GitHub](https://github.com/jterrazz/42-malloc). Allez, on y va ! 🚀

```c
// Les fonctions qu'on va implémenter.
void  malloc(size_t size);
void  free(void* ptr);
void  realloc(void* ptr, size_t size);
void  calloc(size_t count, size_t size);

// Pour demander de la mémoire au système.
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
int   munmap(void* addr, size_t len);

// Pour fixer certaines limites.
#include <sys/resource.h>

int   getrlimit(int resource, struct rlimit* rlp);
int   setrlimit(int resource, const struct rlimit* rlp);
```

## La mémoire en C : un cadre assez rigide

Avant de foncer tête baissée, voyons comment le C gère la mémoire de base. Spoiler : c'est assez contraignant.

- **Variables statiques et globales** : leur taille est gravée dans le marbre dès la compilation. Elles vivent du début à la fin du programme, rangées à côté du code exécutable.
- **Variables automatiques** : celles qu'on déclare dans les fonctions. Elles apparaissent sur la pile quand on entre dans la fonction, et s'évaporent dès qu'on en sort.

Ça marche, mais ça pose deux gros problèmes :

1. **Il faut tout prévoir à l'avance.** Impossible de créer un tableau dont on ne connaîtra la taille qu'à l'exécution.
2. **La durée de vie est figée.** Soit la mémoire vit aussi longtemps que le programme, soit elle disparaît avec la fonction. Pas de juste milieu.

C'est là que l'allocation dynamique entre en jeu : elle nous sauve quand on ne sait ni « combien » ni « jusqu'à quand » au moment d'écrire le code.

### Le couteau suisse du noyau : `mmap`

```c
#include <sys/mman.h>

void* mmap(void* addr, size_t len, int prot, int flags, int fd, off_t offset);
```

Alors, comment récupérer de la mémoire à la volée ? Il faut passer par le système d'exploitation. Le noyau nous offre ce qu'on appelle un **appel système**, et celui qui nous intéresse ici, c'est `mmap()`. Voyez-le comme un coup de fil direct au système : « Réserve-moi un bout de mémoire physique et fais-le apparaître dans mon espace d'adressage. » C'est la source de toute mémoire. 🌌

Il existe aussi `sbrk`, mais pour ce projet, `mmap` est notre outil de choix. Beaucoup plus souple pour gérer des zones mémoire.

### OK, mais si `mmap` suffit, à quoi bon `malloc` ?

C'est la première question que je me suis posée. Si `mmap` peut nous donner de la mémoire, pourquoi ne pas l'appeler directement chaque fois qu'on en a besoin ?

La réponse tient en un mot : performance. Les appels système coûtent cher. Chaque appel force un changement de contexte entre votre programme et le noyau — et ça prend du temps. Or, la plupart des applications demandent et libèrent de la mémoire des milliers de fois par seconde. Si chaque requête déclenchait un appel système, tout s'effondrerait.

C'est là que `malloc` prend tout son sens. Plutôt que d'aller toquer chez le noyau pour chaque petit besoin, `malloc` y va une seule fois et récupère un gros bloc. Ensuite, il gère ce stock en interne. Quand vous demandez de la mémoire, il vous découpe juste une tranche de ce qu'il a déjà. Oui, ça ajoute un peu d'overhead — la bibliothèque `malloc` consomme elle-même de la mémoire — mais le gain en vitesse est énorme. Un compromis classique en ingénierie.

## Place au code : mon implémentation

### La bibliothèque : le trio de base

Ma bibliothèque expose les trois fonctions classiques :

- `malloc` : réserve un bloc de mémoire et renvoie un pointeur dessus.
- `free` : récupère ce pointeur quand on n'en a plus besoin et libère l'espace.
- `realloc` : redimensionne un bloc existant tout en gardant son contenu.

### L'organisation de la mémoire

Pour que tout tienne debout, il fallait décider comment structurer le tout. J'ai opté pour deux niveaux :

- **Heap (tas)** : une grosse zone mémoire que je demande au système via `mmap`.
- **Block (bloc)** : un morceau plus petit du heap, celui que je distribue quand on appelle `malloc`.

Chacun a besoin d'un peu de métadonnées. J'ai donc placé un en-tête au début de chaque heap et de chaque bloc. Après un premier appel à `malloc`, voilà à quoi ressemble la mémoire :

![Heap and Block Structure](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*iXHfrEUza03cFe5IXEvs0Q.png)

Et voici les structures C correspondantes :

```c
// En-tête d'une zone mappée via mmap
typedef struct s_heap {
    struct s_heap   *prev;
    struct s_heap   *next;
    t_heap_group    group;         // TINY, SMALL ou LARGE
    size_t          total_size;
    size_t          free_size;
    size_t          block_count;
} t_heap;

// En-tête d'un bloc alloué
typedef struct s_block {
    struct s_block  *prev;
    struct s_block  *next;
    size_t          data_size;
    bool            freed;
} t_block;
```

Avec les pointeurs `next` et `prev`, chaque bloc forme une liste chaînée. Pratique pour parcourir le heap à la recherche d'un espace libre, ou pour retrouver les voisins d'un bloc qu'on veut libérer.

Ces petites macros me permettent de sauter de l'en-tête vers la zone de données utile :

```c
#define HEAP_SHIFT(start)   ((void*)start + sizeof(t_heap))
#define BLOCK_SHIFT(start)  ((void*)start + sizeof(t_block))
```

### Stratégie de performance : adapter selon la taille

J'ai vite compris qu'on ne pouvait pas traiter une allocation de 10 octets comme une de 10 Mo. Pour optimiser, j'ai créé trois catégories : `TINY`, `SMALL` et `LARGE`. L'idée : pré-allouer des pages mémoire pour les petites requêtes (`TINY` et `SMALL`), en visant une centaine de blocs par heap. Les `LARGE`, eux, sont alloués au cas par cas — ils sont rares de toute façon.

Petit conseil au passage : alignez vos tailles de heap sur la taille de page du système. Récupérez-la avec `getpagesize()` (ou `getconf PAGE_SIZE` en ligne de commande). Chez moi, c'est 4096 octets.

Du coup, voici mes calculs :

```c
// Une page peut contenir 128 blocs tiny
#define  TINY_HEAP_ALLOCATION_SIZE   (4 * getpagesize())
#define  TINY_BLOCK_SIZE             (TINY_HEAP_ALLOCATION_SIZE / 128)

// Quatre pages peuvent contenir 128 blocs small
#define  SMALL_HEAP_ALLOCATION_SIZE  (16 * getpagesize())
#define  SMALL_BLOCK_SIZE            (SMALL_HEAP_ALLOCATION_SIZE / 128)
```

### L'algorithme de `malloc` : trouver une place

Quand un appel à `malloc` arrive, voici ce qui se passe :

1. On regarde d'abord si des heaps existent déjà (via un pointeur global).
2. On parcourt la liste des heaps à la recherche d'un bloc libre assez grand. J'utilise la stratégie **first-fit** : on prend le premier qui convient. Simple, efficace.
3. Si on arrive en fin de heap et qu'il reste de la place, on crée un nouveau bloc sur place.
4. Si tout est plein, on redemande de la mémoire au système avec `mmap`.

```c
// Appel système pour créer un nouveau heap.
void *heap = (t_heap *)mmap(NULL, heap_size, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANON, -1, 0);
```

### `free` et la fragmentation

![Memory Fragmentation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y7xikxHO1Yoyv1eZm7l6aA.png)

Marquer un bloc comme « libre » quand on appelle `free`, c'est facile. Le problème, c'est la **fragmentation** : on se retrouve avec plein de petits trous éparpillés, comme une partie de Tetris qui a mal tourné.

Pour lutter contre ça, j'ai mis en place deux mécanismes :

- **Fusion (coalescing)** : quand je libère un bloc, je regarde si ses voisins sont libres aussi. Si oui, je les fusionne en un seul gros bloc.
- **Restitution** : si le bloc libéré est le dernier d'un heap et que j'ai d'autres heaps disponibles, je rends carrément tout le heap au système avec `munmap`. Pas la peine de garder de la mémoire vide.

```c
// On rend la mémoire au noyau.
munmap(heap, heap->total_size);
```

### `realloc` : le couteau suisse

`realloc`, c'est assez direct : on alloue un nouveau bloc de la bonne taille avec `malloc`, on copie les données avec `memcpy`, puis on libère l'ancien bloc avec `free`.

Attention au cas `realloc(ptr, 0)`. Le comportement varie selon les implémentations. Moi, j'ai fait au plus simple : je renvoie le pointeur tel quel. Mais certaines normes considèrent que ça devrait équivaloir à un `free(ptr)`. Mon conseil : pour libérer, utilisez `free`. Chaque outil a son job.

## L'épreuve du feu

Le plus satisfaisant, c'est de voir son `malloc` faire tourner de vrais programmes. J'ai bricolé un petit script pour forcer le linker dynamique à utiliser ma bibliothèque plutôt que celle du système.

```sh
#!/bin/sh
export DYLD_LIBRARY_PATH=.
export DYLD_INSERT_LIBRARIES=libft_malloc.so
export DYLD_FORCE_FLAT_NAMESPACE=1
$@
```

En l'enregistrant sous `run.sh`, je pouvais tester avec `sh run.sh ls -l` ou `sh run.sh vim` et voir si ça passait.

### Quand `vim` plante : la leçon de l'alignement

Évidemment, tout n'a pas marché du premier coup. `ls` tournait nickel, mais `vim` crashait direct avec un segfault. Pourquoi ?

Le coupable : l'**alignement mémoire**. Le `malloc` standard de macOS garantit que les adresses retournées sont des multiples de 16. Certaines instructions processeur en dépendent. Mon `malloc` ne faisait pas ça, et `vim` n'aimait pas du tout.

La solution ? Une petite astuce de manipulation de bits : `size = (size + 15) & ~15;`. Cette ligne garantit que la taille est toujours un multiple de 16, donc l'adresse renvoyée sera correctement alignée. Leçon retenue.

---

Et voilà, le voyage est bouclé ! On est partis de l'appel système `mmap` pour arriver à une bibliothèque `malloc` qui tourne pour de vrai. Pour moi, ce projet n'était pas juste un exercice de code — c'était une vraie plongée dans les fondations de nos machines.

Rien ne vaut la pratique pour comprendre ces concepts. Si ça vous tente d'aller plus loin, [le code complet est sur mon GitHub](https://github.com/jterrazz/42-malloc). Forkez, cassez, améliorez. Quand on maîtrise les bases, on peut construire n'importe quoi dessus. Bon code ! 🚀
