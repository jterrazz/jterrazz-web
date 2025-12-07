![](assets/thumbnail.jpg)

# Plongeons dans l'assembleur et créons nos premières fonctions (Intel x86-64)

J'ai toujours été obsédé par ce qui se passe au plus profond d'un ordinateur. On entend souvent dire que le C est un langage "bas niveau", mais franchement, c'est encore une couche d'abstraction confortable. Il masque les instructions brutes et puissantes que votre processeur exécute réellement.

Si vous voulez parler directement au matériel, vous devez apprendre sa langue maternelle. Cette langue, c'est l'assembleur. 🖥️💓

Cet article n'est pas que de la théorie. Nous allons construire des choses. Je vais vous guider à travers les outils et les concepts pour que vous puissiez commencer à écrire vos propres fonctions en assembleur dès aujourd'hui. C'est parti. 👷‍♂️🔧

## L'environnement : votre terrain de jeu assembleur

Tout d'abord, une précision importante : l'assembleur n'est pas un langage unique ; il varie selon l'architecture du processeur. Nous allons nous concentrer sur Intel x86-64, ce qui équipe la plupart des ordinateurs de bureau et portables actuels.

### La boîte à outils : NASM

Pas besoin d'un IDE lourd ni d'une chaîne d'outils complexe. Pour moi, il suffit de deux choses :

1. Un éditeur de texte simple (celui avec lequel vous êtes à l'aise ⚔️)
2. Le compilateur NASM (il transforme notre assembleur lisible par l'homme en code machine 🪄)

Sur Mac, installer NASM se fait en une ligne avec Homebrew.

```sh
# Installer nasm sur MacOS
brew install nasm

# Compiler un fichier assembleur (.s) en fichier objet (.o)
nasm -f macho64 your_file.s -o your_file.o

# Lier les fichiers objets en un exécutable
ar rcs libyourstuff.a your_file.o
```

> Petite astuce : le flag `-f` est crucial. Il indique à NASM le format du fichier de sortie. `macho64` est ce dont macOS moderne a besoin.

### Le débogage : votre arme secrète 🕵️‍♂️

Écrire de l'assembleur sans débogueur, c'est comme voler à l'aveugle. Vous ferez des erreurs. Ça plantera. `lldb` (sur macOS) et `gdb` (sur Linux) sont vos meilleurs alliés pour comprendre pourquoi. Ils vous permettent d'avancer dans votre code instruction par instruction et de voir exactement ce qui se passe en mémoire et dans les registres. N'ignorez pas l'apprentissage des bases de ces outils.

## Le langage du processeur

Voyez l'assembleur comme un ensemble d'ordres directs pour votre CPU. Chaque ligne est une commande unique et minuscule.

### Assembleur vs code machine

On utilise souvent "assembleur" et "code machine" de façon interchangeable, mais ce n'est pas la même chose.

- **Code machine :** C'est le binaire brut, les 0 et les 1, que le processeur exécute. C'est totalement illisible pour les humains.
- **Assembleur :** C'est la version lisible du code machine. On écrit en assembleur, puis un compilateur (comme NASM) le traduit en code machine.

Écrire en assembleur nous donne un énorme avantage par rapport à l'écriture de binaire brut. Cela nous offre une structure : nous pouvons utiliser des labels pour les fonctions, définir des variables et organiser notre logique en sections. C'est la couche d'abstraction la plus fine possible au-dessus du matériel.

### L'organisation d'un fichier assembleur

J'organise mes fichiers assembleur (`.s`) en quelques sections standards. Cela garde les choses propres.

```asm
; SECTION : Données Initialisées
; Ce qui a une valeur au démarrage du programme.
.data
my_str db "hello world", 0 ; Une chaîne, terminée par un octet nul (0).
my_var db 42                ; Un seul octet initialisé à 42.
; db = 1 octet (byte)
; dw = 2 octets (word)
; dd = 4 octets (doubleword)
; dq = 8 octets (quadword)

; SECTION : Données en Lecture Seule
; Constantes qui ne doivent pas changer.
.rodata
pi dq 3.14

; SECTION : Données Non Initialisées
; Un espace pour réserver de la mémoire sans valeur initiale.
.bss
my_buffer: resb 1024 ; Réserver 1024 octets d'espace.
; resb = réserver des octets
; resw = réserver des words
; resd = réserver des doublewords
; resq = réserver des quadwords

; SECTION : Le Code
; C'est ici que vit la logique.
.text
global _start ; Rendre le label _start visible pour l'éditeur de liens.

_start:
    ; Votre code va ici.
```

Si vous ne spécifiez pas de section, l'assembleur utilise généralement `.text` par défaut. C'est là que l'action se passe.

### Où vivent vos données

En assembleur, vous déplacez constamment des données. Vous avez trois endroits où les stocker :

1. **Les registres :** Un petit nombre d'emplacements de stockage ultra-rapides directement dans le CPU. C'est votre premier choix pour les calculs.
2. **La mémoire (RAM) :** C'est le vaste réservoir de stockage en dehors du CPU. Bien plus grand que les registres, mais aussi bien plus lent d'accès.
3. **Les constantes :** Des valeurs codées en dur directement dans vos instructions.

![Types de mémoire](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N6b1GTJFRIUNdcqCwrHAZA.png)

### Les registres

Bien connaître les registres est essentiel. Ce sont votre établi. Sur x86-64, les principaux que vous utiliserez sont :

#### Registres à usage général

Ce sont les chevaux de trait.

- `rax` : L'"accumulateur". Souvent utilisé pour les valeurs de retour des fonctions et en arithmétique.
- `rbx` : Le registre "base". Peut servir à tout, mais parfois utilisé pour l'adressage mémoire.
- `rcx` : Le "compteur". Souvent utilisé pour les boucles.
- `rdx` : Le registre "données". Souvent utilisé en multiplication et division, ou simplement comme registre de secours.

#### Registres d'index et de pointeurs

Ceux-ci servent à garder trace des emplacements mémoire.

- `rdi`, `rsi` : Index de Destination et de Source. Très utilisés dans les opérations qui déplacent des blocs de mémoire. Ce sont aussi les deux premiers registres d'arguments dans les appels de fonction.
- `rbp` : Pointeur de Base. Utilisé pour garder trace du "stack frame" de la fonction courante.
- `rsp` : Pointeur de Pile (Stack Pointer). Pointe toujours vers le sommet de la pile.
- `rip` : Pointeur d'Instruction. Pointe vers la prochaine instruction CPU à exécuter. Vous ne pouvez pas le modifier directement.

Vous pouvez généralement ignorer les Registres de Segment (`CS`, `DS`, etc.) pour les programmes simples.

## Le jeu d'instructions : votre boîte à outils

Un programme assembleur n'est qu'une liste d'instructions. Le format est généralement `INSTRUCTION destination, source`. Voyons les plus courantes.

### Déplacer des données

**`mov`** `<dst>, <src>`
C'est l'instruction la plus fondamentale. Elle copie les données de `src` vers `dst`. La source peut être un registre, une adresse mémoire ou une constante. La destination doit être un registre ou une adresse mémoire. Voyez-la comme l'opérateur `=` de l'assembleur.

**`push`** `<data>`
Prend une valeur et la place au sommet de la pile. La pile est une région de mémoire pour le stockage temporaire. `push` est la façon de sauvegarder des choses dont vous aurez besoin plus tard.

**`pop`** `<dst>`
Retire la valeur du sommet de la pile et la place dans votre registre ou emplacement mémoire de destination. C'est l'inverse de `push`.

**`lea`** `<dst>, [<src>]`
Celle-ci est "Load Effective Address" (Charger l'Adresse Effective). Elle diffère un peu de `mov`. Au lieu de charger la *valeur* à l'adresse source, elle charge *l'adresse elle-même*. Très utile pour faire des calculs sur les pointeurs.

### Faire des calculs

**`add`** `<dst>, <src>`
`dst = dst + src`.

**`sub`** `<dst>, <src>`
`dst = dst - src`.

**`inc`** `<dst>`
Incrémente la destination de 1. Plus rapide que `add dst, 1`.

**`dec`** `<dst>`
Décrémente la destination de 1. Plus rapide que `sub dst, 1`.

### Contrôler le flux

**`call`** `<function_label>`
Saute vers une fonction, mais d'abord elle `push` l'adresse de l'instruction suivante sur la pile. C'est ainsi que le CPU sait où revenir quand la fonction est terminée.

```asm
extern malloc ; Dire à l'assembleur qu'on utilise une fonction externe

.text
call malloc  ; Appeler la fonction malloc
             ; Le résultat (une adresse mémoire) sera dans le registre rax
```

**`jmp`** `<label>`
Un saut inconditionnel. Il déplace simplement le pointeur d'exécution (`rip`) vers un nouvel emplacement. C'est votre `goto`, la base pour construire des boucles.

```asm
.text
section_1:
    ; ... du code ...
    jmp section_2 ; Saute immédiatement à section_2

    ; ... ce code est ignoré ...

section_2:
    jmp section_1 ; Crée une boucle infinie
```

**`j<condition>`** `<label>`
Un saut conditionnel. C'est le cœur de toute instruction `if`. Il saute uniquement quand certains drapeaux, définis par `cmp` ou `test`, sont activés. Par exemple, `jz` saute si le résultat de la dernière comparaison était zéro.

### Comparer et tester

**`cmp`** `<reg1>, <reg2>`
Compare deux registres en effectuant internement `reg1 - reg2`. Elle ne stocke pas le résultat, mais elle définit des drapeaux d'état (comme le drapeau zéro, le drapeau de signe, etc.). Les instructions de saut conditionnel lisent ensuite ces drapeaux.

**`test`** `<reg1>, <reg2>`
Effectue un `AND` bit à bit sur les deux opérandes et définit les drapeaux en fonction du résultat. Une astuce courante est `test rax, rax`. Si `rax` est zéro, le résultat du `AND` est zéro, ce qui active le drapeau zéro. C'est une façon très efficace de vérifier si un registre est nul.

Voici comment vous pourriez les utiliser pour construire une fonction `_ft_isalnum` (vérifie si un caractère est alphanumérique) :

```asm
extern ft_isalpha
extern ft_isdigit

.text
_ft_isalnum:
    call _ft_isalpha  ; Met rax à 1 si le char est une lettre
    test rax, rax     ; Vérifie si rax est zéro
    jnz is_alnum      ; Si non zéro (jnz), c'était une lettre. Sauter.

    call _ft_isdigit  ; Sinon, vérifier si c'est un chiffre (retourne aussi 1 dans rax).
    test rax, rax     ; Vérifie si rax est zéro
    jnz is_alnum      ; Si non zéro, c'était un chiffre. Sauter.

is_not_alnum:
    xor rax, rax      ; Une façon astucieuse de mettre rax à 0 (tout XOR avec lui-même = 0)
    ret               ; Retourner 0

is_alnum:
    mov rax, 1        ; Mettre rax à 1
    ret               ; Retourner 1
```

**`ret`**
Quand une fonction est terminée, `ret` `pop` l'adresse de retour de la pile et y saute. C'est ainsi que vous terminez une fonction et rendez le contrôle à l'appelant.

## Les conventions d'appel : les règles du jeu

Comment une fonction sait-elle comment en appeler une autre ? Comment les arguments sont-ils passés ? Comment les valeurs de retour sont-elles renvoyées ? Tout cela est défini par une "convention d'appel". Si vous ne la respectez pas, les choses cassent spectaculairement.

Pour x86-64 sur Linux et macOS, les six premiers arguments entiers/pointeurs sont passés dans les registres : `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9`. La valeur de retour est attendue dans `%rax`.

### Parler à l'OS : les syscalls

Si vous voulez faire quoi que ce soit d'intéressant comme lire un fichier, afficher à l'écran ou ouvrir une connexion réseau, vous devez demander de l'aide au noyau du système d'exploitation. Vous faites cela avec un "syscall". C'est une instruction spéciale qui transfère le contrôle au noyau pour effectuer une opération privilégiée.

## Mettre tout ensemble : ft_isascii

Regardons une fonction vraiment simple. Celle-ci vérifie si le caractère en entrée (passé dans `rdi`) est un caractère ASCII valide (c'est-à-dire entre 0 et 127).

![Fonction ft_isascii](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Zeu7RMnWR6HT_7ij3-9kVA.png)

Décortiquons :
1. `xor rax, rax` : C'est une façon rapide de mettre `rax` à 0. On suppose que le caractère n'est pas ASCII jusqu'à preuve du contraire.
2. `cmp rdi, 0` : Compare le caractère en entrée avec 0.
3. `jl.end` : "Jump if Less" (Sauter si Inférieur). Si le caractère est inférieur à 0, ce n'est pas ASCII, donc on saute à la fin.
4. `cmp rdi, 127` : Compare le caractère en entrée avec 127.
5. `jg.end` : "Jump if Greater" (Sauter si Supérieur). Si le caractère est supérieur à 127, ce n'est pas ASCII, donc on saute à la fin.
6. `mov rax, 1` : Si on est arrivé jusqu'ici, le caractère est dans la plage. On met notre valeur de retour `rax` à 1.
7. `.end:` : C'est notre label de sortie.
8. `ret` : Retourne à l'appelant. La valeur dans `rax` est le résultat.

## Pour aller plus loin

Nous n'avons fait qu'effleurer la surface. Comprendre en détail le fonctionnement de la pile est un sujet à part entière. Mais cela devrait suffire pour vous lancer.

- [Aide-mémoire x86-64](https://cs.brown.edu/courses/cs033/docs/guides/x64_cheatsheet.pdf) : Gardez-le sous la main. C'est une référence rapide inestimable.
- [Liste des instructions](http://faydoc.tripod.com/cpu/index.htm) : Une liste complète des instructions x86.

J'ai mis en ligne un dépôt avec mes propres implémentations de fonctions de la bibliothèque standard C en assembleur. N'hésitez pas à y jeter un œil et à l'utiliser comme référence.

Apprendre l'assembleur est un travail de longue haleine, je ne vais pas mentir. Mais la compréhension qu'il vous donne sur le fonctionnement *réel* des ordinateurs est une sorte de super-pouvoir. Cela changera votre façon d'écrire du code, même dans les langages de haut niveau.

Bon code. Que vos registres contiennent toujours les bonnes valeurs. 🖥️💪
