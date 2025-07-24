![](assets/thumbnail.jpg)

# Plongeon dans l'assembleur, nos premières fonctions (Intel x86-64)

J'ai toujours été fasciné par ce qui se trame au plus profond d'un ordinateur. On entend souvent qualifier le C de langage dit de " bas niveau ", mais pour être honnête, il ne s'agit encore que d'une confortable couche d'abstraction. Elle dissimule les instructions brutes et puissantes que votre processeur exécute réellement.

Pour dialoguer directement avec le métal, il faut apprendre sa langue natale. Et cette langue, c'est l'assembleur. 🖥️💓

Loin d'un simple exposé théorique, nous allons mettre la main à la pâte. Je vous guiderai à travers les outils et les concepts pour que vous puissiez commencer à écrire vos propres fonctions en assembleur dès aujourd'hui. Alors, mettons-nous au travail. 👷‍♂️🔧

## L'environnement de travail: votre terrain de jeu

Commençons par une précision: l'assembleur n'est pas un langage unique. Il varie en fonction de l'architecture du processeur. Nous nous concentrerons ici sur l'architecture Intel x86-64, celle qui équipe la grande majorité des ordinateurs de bureau et portables actuels.

### La boîte à outils: NASM

Nul besoin d'un IDE lourd ou d'une chaîne de compilation complexe. Pour ma part, deux éléments suffisent:

1. Un simple éditeur de texte (celui avec lequel vous êtes le plus à l'aise ⚔️)
2. Le compilateur NASM (qui transforme notre assembleur lisible en code machine 🪄)

Sur un Mac, installer NASM se fait en une seule ligne avec Homebrew.

```sh
# Installer nasm sur macOS
brew install nasm

# Compiler un fichier assembleur (.s) en fichier objet (.o)
nasm -f macho64 votre_fichier.s -o votre_fichier.o

# Lier les fichiers objets dans un exécutable
ar rcs libvotrestuff.a votre_fichier.o
```

> Petite astuce: l'option `-f` est primordiale. Elle indique à NASM le format du fichier de sortie. `macho64` est le format requis par les versions modernes de macOS.

### Le débogage: votre arme secrète 🕵️‍♂️

Écrire de l'assembleur sans débogueur, c'est comme piloter à l'aveugle. Vous ferez des erreurs. Des programmes planteront. `lldb` (sur macOS) et `gdb` (sur Linux) sont vos meilleurs alliés pour comprendre pourquoi. Ils vous permettent d'exécuter votre code instruction par instruction et de voir précisément ce qui se passe dans la mémoire et les registres. Ne négligez surtout pas l'apprentissage des bases de ces outils.

## Le langage du CPU

Imaginez l'assembleur comme un ensemble d'ordres directs donnés à votre CPU. Chaque ligne correspond à une seule et unique micro-commande.

### Assembleur vs. code machine

On confond souvent les termes " assembleur " et " code machine ", mais ils ne sont pas identiques.

- **Code Machine:** C'est le binaire brut—les 1 et les 0—que le processeur exécute. Il est totalement illisible pour un humain.
- **Assembleur:** C'est la version lisible par l'homme du code machine. Nous écrivons en assembleur, puis un compilateur (comme NASM) le traduit en code machine.

Écrire en assembleur nous offre un avantage considérable par rapport à la tentative d'écrire du binaire brut. Cela nous apporte une structure: nous pouvons utiliser des étiquettes pour les fonctions, définir des variables et organiser notre logique en sections. C'est la plus fine couche d'abstraction possible au-dessus du matériel.

### La structure d'un fichier assembleur

J'organise mes fichiers assembleur (`.s`) en quelques sections standard pour garantir la clarté.

```asm
; SECTION : Données initialisées
; Variables qui ont une valeur au démarrage du programme.
.data
my_str db "hello world", 0 ; Une chaîne de caractères, terminée par un octet nul (0).
my_var db 42                ; Un seul octet initialisé à 42.
; db = 1 octet (byte)
; dw = 2 octets (word)
; dd = 4 octets (doubleword)
; dq = 8 octets (quadword)

; SECTION : Données en lecture seule
; Constantes qui ne devraient pas être modifiées.
.rodata
pi dq 3.14

; SECTION : Données non initialisées
; Un espace pour réserver de la mémoire sans lui donner de valeur initiale.
.bss
my_buffer: resb 1024 ; Réserve 1024 octets d'espace.
; resb = reserve bytes
; resw = reserve words
; resd = reserve doublewords
; resq = reserve quadwords

; SECTION : Le Code
; C'est ici que réside la logique.
.text
global _start ; Rend l'étiquette _start visible pour l'éditeur de liens.

_start:
    ; Votre code vient ici.
```

Si vous ne spécifiez aucune section, l'assembleur se place généralement par défaut dans `.text`. C'est là que se déroule l'action.

### Où vivent vos données

En assembleur, vous passez votre temps à déplacer des données. Vous disposez de trois emplacements pour les stocker:

1. **Les Registres:** Un petit nombre d'espaces de stockage ultra-rapides situés directement dans le CPU. C'est votre premier choix pour les calculs.
2. **La Mémoire (RAM):** Le vaste espace de stockage à l'extérieur du CPU. Bien plus grand que les registres, mais aussi bien plus lent d'accès.
3. **Les Constantes:** Des valeurs inscrites en dur directement dans vos instructions.

![Memory Types](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N6b1GTJFRIUNdcqCwrHAZA.png)

### Les registres

Se familiariser avec les registres est la clé. C'est votre établi. Sur x86-64, voici les principaux que vous utiliserez:

#### Registres à usage général

Ce sont eux qui font le gros du travail.

- `rax`: L'" accumulateur ". Souvent utilisé pour les valeurs de retour des fonctions et dans les opérations arithmétiques.
- `rbx`: Le registre de " base ". Peut servir à tout, mais est parfois utilisé dans l'adressage mémoire.
- `rcx`: Le " compteur " (*counter*). Fréquemment utilisé pour les boucles.
- `rdx`: Le registre de " données " (*data*). Sert souvent dans les multiplications et divisions, ou simplement comme registre d'appoint.

#### Registres d'index et de pointeurs

Ceux-ci servent à suivre des emplacements en mémoire.

- `rdi`, `rsi`: Index de Destination et de Source. Très utilisés dans les opérations qui déplacent des blocs de mémoire. Ce sont aussi les deux premiers registres d'arguments lors des appels de fonction.
- `rbp`: Pointeur de Base (*Base Pointer*). Utilisé pour suivre le " cadre de pile " (*stack frame*) de la fonction actuelle.
- `rsp`: Pointeur de Pile (*Stack Pointer*). Pointe toujours vers le sommet de la pile.
- `rip`: Pointeur d'Instruction (*Instruction Pointer*). Pointe vers la prochaine instruction CPU à exécuter. Celui-ci, vous ne pouvez pas le modifier directement.

Pour des programmes simples, vous pouvez ignorer la plupart du temps les registres de segment (`CS`, `DS`, etc.).

## Le jeu d'instructions: votre caisse à outils

Un programme en assembleur n'est qu'une liste d'instructions. Le format est généralement `INSTRUCTION destination, source`. Jetons un œil aux plus courantes.

### Déplacer les données

**`mov`** `<dst>, <src>`
C'est l'instruction la plus fondamentale. Elle copie les données de `src` vers `dst`. La source peut être un registre, une adresse mémoire ou une constante. La destination doit être un registre ou une adresse mémoire. Voyez-la comme l'opérateur d'affectation `=` de l'assembleur.

**`push`** `<data>`
Prend une valeur et la place au sommet de la pile (*stack*). La pile est une zone de mémoire pour le stockage temporaire. `push` est le moyen de sauvegarder des éléments dont vous aurez besoin plus tard.

**`pop`** `<dst>`
Récupère la valeur au sommet de la pile et la place dans votre registre ou emplacement mémoire de destination. C'est l'inverse de `push`.

**`lea`** `<dst>, [<src>]`
Celle-ci signifie " Load Effective Address " (Charger l'Adresse Effective). Elle est un peu différente de `mov`. Au lieu de charger la *valeur* à l'adresse source, elle charge l'*adresse elle-même*. Extrêmement utile pour effectuer des calculs sur des pointeurs.

### Faire des maths

**`add`** `<dst>, <src>`
`dst = dst + src`.

**`sub`** `<dst>, <src>`
`dst = dst - src`.

**`inc`** `<dst>`
Incrémente la destination de 1. Plus rapide que `add dst, 1`.

**`dec`** `<dst>`
Décrémente la destination de 1. Plus rapide que `sub dst, 1`.

### Contrôler le flux d'exécution

**`call`** `<etiquette_fonction>`
Cette instruction saute vers une fonction, mais juste avant, elle `push` l'adresse de l'instruction suivante sur la pile. C'est ainsi que le CPU sait où revenir une fois la fonction terminée.

```asm
extern malloc ; Indique à l'assembleur que nous utilisons une fonction externe

.text
call malloc  ; Appelle la fonction malloc
             ; Le résultat (une adresse mémoire) sera dans le registre rax
```

**`jmp`** `<etiquette>`
Un saut inconditionnel. Il déplace simplement le pointeur d'instruction (`rip`) vers un nouvel emplacement. C'est la base des boucles et des `goto`.

```asm
.text
section_1:
    ; ... du code ...
    jmp section_2 ; Saute immédiatement à section_2

    ; ... ce code est ignoré ...

section_2:
    jmp section_1 ; Crée une boucle infinie
```

**`j<condition>`** `<etiquette>`
Un saut conditionnel. C'est le cœur des instructions `if`. Il ne saute que si certains indicateurs (*flags*), définis par `cmp` ou `test`, sont remplis. Par exemple, `jz` saute si le résultat de la dernière comparaison était zéro.

### Comparer et tester

**`cmp`** `<reg1>, <reg2>`
Compare deux registres en effectuant en interne `reg1 - reg2`. L'instruction ne stocke pas le résultat, mais elle met à jour les indicateurs de statut (comme le *zero flag*, le *sign flag*, etc.). Les instructions de saut conditionnel lisent ensuite ces indicateurs.

**`test`** `<reg1>, <reg2>`
Cette instruction effectue un `AND` bit à bit sur les deux opérandes et met à jour les indicateurs en fonction du résultat. Une astuce courante est `test rax, rax`. Si `rax` est nul, le résultat du `AND` est zéro, ce qui active le *zero flag*. C'est une manière très efficace de vérifier si un registre est nul.

Voici comment vous pourriez utiliser ces instructions pour créer une fonction `_ft_isalnum` (qui vérifie si un caractère est alphanumérique):

```asm
extern ft_isalpha
extern ft_isdigit

.text
_ft_isalnum:
    call _ft_isalpha  ; Cette fonction retournera 1 dans rax si le caractère est une lettre
    test rax, rax     ; Vérifie si rax est nul
    jnz is_alnum      ; S'il n'est pas nul (jnz), c'était une lettre. On saute.

    call _ft_isdigit  ; Sinon, on vérifie si c'est un chiffre. Retourne aussi 1 dans rax en cas de succès.
    test rax, rax     ; Vérifie si rax est nul
    jnz is_alnum      ; S'il n'est pas nul, c'était un chiffre. On saute.

is_not_alnum:
    xor rax, rax      ; Une façon astucieuse de mettre rax à 0 (une valeur XORée avec elle-même donne toujours 0)
    ret               ; Retourne 0

is_alnum:
    mov rax, 1        ; Met rax à 1
    ret               ; Retourne 1
```

**`ret`**
Quand une fonction a terminé, `ret` `pop` l'adresse de retour depuis la pile et y retourne. C'est ainsi que vous terminez une fonction et rendez la main à l'appelant.

## Les conventions d'appel: les règles du jeu

Comment une fonction sait-elle comment en appeler une autre? Comment les arguments sont-ils passés? Comment les valeurs de retour sont-elles renvoyées? Tout cela est défini par une " convention d'appel ". Si vous ne la respectez pas, votre programme se brisera de manière spectaculaire.

Pour x86-64 sur Linux et macOS, les six premiers arguments de type entier/pointeur sont passés dans les registres: `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9`. La valeur de retour est attendue dans `%rax`.

### Dialoguer avec l'OS: les syscalls

Si vous voulez faire quoi que ce soit d'un peu complexe comme lire un fichier, afficher du texte à l'écran ou ouvrir une connexion réseau, vous devez demander de l'aide au noyau du système d'exploitation. Vous le faites via un " appel système " (*syscall*). C'est une instruction spéciale qui passe la main au noyau pour effectuer une opération privilégiée.

## Mettons tout en pratique: `ft_isascii`

Voyons une fonction très simple. Celle-ci vérifie si le caractère en entrée (passé dans `rdi`) est un caractère ASCII valide (c'est-à-dire entre 0 et 127).

![ft_isascii function](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Zeu7RMnWR6HT_7ij3-9kVA.png)

Décortiquons-la:
1. `xor rax, rax`: C'est une façon rapide de mettre `rax` à 0. Nous partons du principe que le caractère n'est pas ASCII jusqu'à preuve du contraire.
2. `cmp rdi, 0`: Compare le caractère d'entrée avec 0.
3. `jl.end`: " Jump if Less " (saut si inférieur). Si le caractère est inférieur à 0, il n'est pas ASCII, donc nous sautons à la fin.
4. `cmp rdi, 127`: Compare le caractère d'entrée avec 127.
5. `jg.end`: " Jump if Greater " (saut si supérieur). Si le caractère est supérieur à 127, il n'est pas ASCII, donc nous sautons à la fin.
6. `mov rax, 1`: Si nous sommes arrivés jusqu'ici, le caractère est dans la bonne plage. Nous mettons notre valeur de retour `rax` à 1.
7. `.end:`: C'est notre étiquette de sortie.
8. `ret`: Retourne à l'appelant. La valeur dans `rax` est le résultat.

## Pour aller plus loin

Nous n'avons fait qu'effleurer la surface. Comprendre en détail le fonctionnement de la pile est un sujet à part entière. Mais cela devrait suffire à vous mettre le pied à l'étrier.

- [x86-64 Cheatsheet](https://cs.brown.edu/courses/cs033/docs/guides/x64_cheatsheet.pdf): Gardez-le à portée de main. C'est une référence rapide inestimable.
- [Instruction List](http://faydoc.tripod.com/cpu/index.htm): Une liste exhaustive des instructions x86.

J'ai publié sur un dépôt plusieurs de mes propres implémentations de fonctions de la bibliothèque standard C en assembleur. N'hésitez pas à le consulter et à l'utiliser comme référence.

Apprendre l'assembleur est un travail de longue haleine, je ne vais pas vous mentir. Mais la compréhension profonde qu'il vous offre sur le fonctionnement *réel* des ordinateurs est une sorte de super-pouvoir. Cela changera votre façon de coder, même dans des langages de haut niveau.

Bon codage! Puissent vos registres toujours contenir les bonnes valeurs. 🖥️💪
