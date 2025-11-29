![](assets/thumbnail.jpg)

# Plongeons dans l'assembleur et construisons nos premières fonctions (Intel x86-64)

J'ai toujours été obsédé par ce qui se passe au plus profond d'un ordinateur. On entend souvent dire que le C est un langage de "bas niveau", mais honnêtement, c'est encore une couche d'abstraction bien confortable. Elle cache les instructions brutes et puissantes que votre processeur exécute réellement.

Si vous voulez parler directement au métal, vous devez apprendre sa langue maternelle. Cette langue, c'est l'Assembleur. 🖥️💓

Ce n'est pas juste de la théorie. Nous allons construire des choses. Je vais vous guider à travers les outils et les concepts pour que vous puissiez commencer à écrire vos propres fonctions en assembleur dès aujourd'hui. Allons-y. 👷‍♂️🔧

## La configuration : votre terrain de jeu assembleur

D'abord, une petite note : l'Assembleur n'est pas un langage unique ; il change avec l'architecture du processeur. Nous allons nous concentrer sur l'Intel x86-64, qui est ce que la plupart des ordinateurs de bureau et portables utilisent de nos jours.

### La boîte à outils : NASM

Vous n'avez pas besoin d'un IDE lourd ou d'une chaîne d'outils complexe. Pour moi, c'est juste deux choses :

1. Un éditeur de texte simple (celui avec lequel vous êtes à l'aise ⚔️)
2. Le compilateur NASM (c'est lui qui transforme notre assembleur lisible en code machine 🪄)

Sur un Mac, obtenir NASM se fait en une ligne avec Homebrew.

```sh
# Installer nasm sur MacOS
brew install nasm

# Compiler un fichier assembleur (.s) en un fichier objet (.o)
nasm -f macho64 your_file.s -o your_file.o

# Lier les fichiers objets en un exécutable
ar rcs libyourstuff.a your_file.o
```

> Une petite astuce : ce flag `-f` est crucial. Il indique à NASM le format du fichier de sortie. `macho64` est ce dont le macOS moderne a besoin.

### Débogage : votre arme secrète 🕵️‍♂️

Écrire de l'assembleur sans débogueur, c'est comme voler à l'aveugle. Vous ferez des erreurs. Les choses vont planter. `lldb` (sur macOS) et `gdb` (sur Linux) sont vos meilleurs amis pour comprendre pourquoi. Ils vous permettent d'avancer pas à pas dans votre code, une instruction à la fois, et de voir exactement ce qui se passe dans la mémoire et les registres. Ne sautez pas l'apprentissage des bases de ces outils.

## La langue du CPU

Voyez l'assembleur comme un ensemble d'ordres directs pour votre CPU. Chaque ligne est une seule et unique petite commande.

### Assembleur vs Code Machine

Les gens utilisent souvent "assembleur" et "code machine" de manière interchangeable, mais ce n'est pas la même chose.

- **Code Machine :** C'est le binaire brut, les 1 et les 0, que le processeur exécute. C'est totalement illisible pour les humains.
- **Assembleur :** C'est la version lisible par l'humain du code machine. Nous écrivons en assembleur, et ensuite un compilateur (comme NASM) le traduit en code machine.

Écrire en assembleur nous donne un énorme avantage par rapport à essayer d'écrire du binaire brut. Cela nous donne une structure : nous pouvons utiliser des étiquettes (labels) pour les fonctions, définir des variables, et organiser notre logique en sections. C'est la couche d'abstraction la plus fine possible au-dessus du matériel.

### La structure d'un fichier assembleur

J'organise mes fichiers assembleur (`.s`) en quelques sections standard. Cela garde les choses propres.

```asm
; SECTION: Initialized Data
; Trucs qui ont une valeur quand le programme démarre.
.data
my_str db "hello world", 0 ; Une chaîne, terminée par un octet nul (0).
my_var db 42                ; Un seul octet initialisé à 42.
; db = 1 byte (octet)
; dw = 2 bytes (mot)
; dd = 4 bytes (double mot)
; dq = 8 bytes (quadruple mot)

; SECTION: Read-Only Data
; Constantes qui ne devraient pas changer.
.rodata
pi dq 3.14

; SECTION: Uninitialized Data
; Un endroit pour réserver de la mémoire sans lui donner de valeur initiale.
.bss
my_buffer: resb 1024 ; Réserve 1024 octets d'espace.
; resb = reserve bytes
; resw = reserve words
; resd = reserve doublewords
; resq = reserve quadwords

; SECTION: The Code
; C'est là que vit la logique.
.text
global _start ; Rend l'étiquette _start visible pour le linker.

_start:
    ; Votre code va ici.
```

Si vous ne spécifiez pas de section, l'assembleur utilise généralement `.text` par défaut. C'est là que l'action se passe.

### Où vivent vos données

En assembleur, vous déplacez constamment des données. Vous avez trois endroits pour les mettre :

1. **Registres :** Un petit nombre d'emplacements de stockage super rapides directement à l'intérieur du CPU. C'est votre premier choix pour les calculs.
2. **Mémoire (RAM) :** C'est l'énorme piscine de stockage à l'extérieur du CPU. C'est bien plus grand que les registres, mais aussi bien plus lent d'accès.
3. **Constantes :** Des valeurs codées en dur directement dans vos instructions.

![Types de Mémoire](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N6b1GTJFRIUNdcqCwrHAZA.png)

### Les registres

Connaître les registres est la clé. C'est votre établi. Sur x86-64, les principaux que vous utiliserez sont :

#### Registres à usage général

Ce sont les gros bras.

- `rax` : L'"accumulateur". Souvent utilisé pour les valeurs de retour des fonctions et en arithmétique.
- `rbx` : Le registre de "base". Peut être utilisé pour tout, mais parfois utilisé dans l'adressage mémoire.
- `rcx` : Le "compteur". Souvent utilisé pour les boucles.
- `rdx` : Le registre de "données". Souvent utilisé dans la multiplication et la division, ou juste comme réserve.

#### Registres d'index et de pointeur

Ils servent à garder une trace des emplacements mémoire.

- `rdi`, `rsi` : Destination et Source Index. Utilisés massivement dans les opérations qui déplacent des blocs de mémoire. Ce sont aussi les deux premiers registres d'arguments dans les appels de fonction.
- `rbp` : Base Pointer (Pointeur de base). Utilisé pour garder une trace du "cadre de pile" (stack frame) de la fonction courante.
- `rsp` : Stack Pointer (Pointeur de pile). Pointe toujours vers le haut de la pile.
- `rip` : Instruction Pointer (Pointeur d'instruction). Pointe vers la prochaine instruction CPU à exécuter. Vous ne pouvez pas changer celui-ci directement.

Vous pouvez globalement ignorer les Registres de Segment (`CS`, `DS`, etc.) pour les programmes simples.

## Le jeu d'instructions : votre boîte à outils

Un programme assembleur est juste une liste d'instructions. Le format est généralement `INSTRUCTION destination, source`. Regardons les plus communes.

### Déplacer des données

**`mov`** `<dst>, <src>`
C'est l'instruction la plus fondamentale. Elle copie les données de `src` vers `dst`. La source peut être un registre, une adresse mémoire ou une constante. La destination doit être un registre ou une adresse mémoire. Voyez ça comme l'opérateur `=` de l'assembleur.

**`push`** `<data>`
Prend une valeur et la met au sommet de la pile. La pile est une région de mémoire pour le stockage temporaire. `push` est la façon dont vous sauvegardez des choses dont vous aurez besoin plus tard.

**`pop`** `<dst>`
Prend la valeur au sommet de la pile et la met dans votre registre ou emplacement mémoire de destination. C'est l'inverse de `push`.

**`lea`** `<dst>, [<src>]`
Celle-ci est "Load Effective Address" (Charger l'Adresse Effective). C'est un peu différent de `mov`. Au lieu de charger la _valeur_ à l'adresse source, elle charge l'_adresse elle-même_. Super utile pour faire des maths sur les pointeurs.

### Faire des maths

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
Ceci saute vers une fonction, mais d'abord elle `push` l'adresse de l'instruction suivante sur la pile. C'est ainsi que le CPU sait où revenir quand la fonction est terminée.

```asm
extern malloc ; Dire à l'assembleur qu'on utilise une fonction externe

.text
call malloc  ; Appeler la fonction malloc
             ; Le résultat (une adresse mémoire) sera dans le registre rax
```

**`jmp`** `<label>`
Un saut inconditionnel. Il déplace juste le pointeur d'exécution (`rip`) vers un nouvel emplacement. C'est votre `goto`, la fondation pour construire des boucles.

```asm
.text
section_1:
    ; ... du code ...
    jmp section_2 ; Saute immédiatement à section_2

    ; ... ce code est sauté ...

section_2:
    jmp section_1 ; Crée une boucle infinie
```

**`j<condition>`** `<label>`
Un saut conditionnel. C'est le cœur de chaque instruction `if`. Il saute seulement quand certains drapeaux (flags), définis par `cmp` ou `test`, sont rencontrés. Par exemple, `jz` saute si le résultat de la dernière comparaison était zéro.

### Comparer et tester

**`cmp`** `<reg1>, <reg2>`
Compare deux registres en faisant internement `reg1 - reg2`. Il ne stocke pas le résultat, mais il définit des drapeaux d'état (comme le drapeau zéro, drapeau de signe, etc.). Les instructions de saut conditionnel lisent ensuite ces drapeaux.

**`test`** `<reg1>, <reg2>`
Ceci fait un `ET` binaire (bitwise AND) sur les deux opérandes et définit les drapeaux basés sur le résultat. Une astuce commune est `test rax, rax`. Si `rax` est zéro, le résultat du `ET` est zéro, ce qui active le drapeau zéro. C'est une manière très efficace de vérifier si un registre est zéro.

Voici comment vous pourriez utiliser cela pour construire une fonction `_ft_isalnum` (vérifie si un caractère est alphanumérique) :

```asm
extern ft_isalpha
extern ft_isdigit

.text
_ft_isalnum:
    call _ft_isalpha  ; Met rax à 1 si le char est une lettre
    test rax, rax     ; Vérifie si rax est zéro
    jnz is_alnum      ; Si pas zéro (jnz), c'était une lettre. Saut.

    call _ft_isdigit  ; Sinon, vérifie si c'est un chiffre (renvoie aussi 1 dans rax).
    test rax, rax     ; Vérifie si rax est zéro
    jnz is_alnum      ; Si pas zéro, c'était un chiffre. Saut.

is_not_alnum:
    xor rax, rax      ; Une façon astucieuse de mettre rax à 0 (tout XORé avec lui-même vaut 0)
    ret               ; Retourne 0

is_alnum:
    mov rax, 1        ; Met rax à 1
    ret               ; Retourne 1
```

**`ret`**
Quand une fonction est terminée, `ret` `pop` l'adresse de retour depuis la pile et saute vers elle. C'est comme ça qu'on termine une fonction et qu'on rend le contrôle à l'appelant.

## Conventions d'appel : les règles de la route

Comment une fonction sait-elle comment en appeler une autre ? Comment les arguments sont-ils passés ? Comment les valeurs de retour sont-elles renvoyées ? Tout cela est défini par une "convention d'appel". Si vous ne la suivez pas, les choses cassent de manière spectaculaire.

Pour x86-64 sur Linux et macOS, les six premiers arguments entiers/pointeurs sont passés dans les registres : `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9`. La valeur de retour est attendue dans `%rax`.

### Parler à l'OS : appels système (syscalls)

Si vous voulez faire quoi que ce soit d'intéressant comme lire un fichier, imprimer à l'écran, ou ouvrir une connexion réseau, vous devez demander de l'aide au noyau (kernel) du système d'exploitation. Vous faites cela avec un "syscall". C'est une instruction spéciale qui donne le contrôle au noyau pour effectuer une opération privilégiée.

## Tout assembler : ft_isascii

Regardons une fonction vraiment simple. Celle-ci vérifie si le caractère d'entrée (passé dans `rdi`) est un caractère ASCII valide (c'est-à-dire entre 0 et 127).

![Fonction ft_isascii](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Zeu7RMnWR6HT_7ij3-9kVA.png)

En décomposant :

1. `xor rax, rax` : C'est une manière rapide de mettre `rax` à 0. On suppose que le caractère n'est pas ASCII jusqu'à preuve du contraire.
2. `cmp rdi, 0` : Comparer le caractère d'entrée avec 0.
3. `jl.end` : "Jump if Less" (Saut si Plus Petit). Si le caractère est plus petit que 0, ce n'est pas de l'ASCII, donc on saute à la fin.
4. `cmp rdi, 127` : Comparer le caractère d'entrée avec 127.
5. `jg.end` : "Jump if Greater" (Saut si Plus Grand). Si le caractère est plus grand que 127, ce n'est pas de l'ASCII, donc on saute à la fin.
6. `mov rax, 1` : Si on est arrivé jusqu'ici, le caractère est dans la plage. On met notre valeur de retour `rax` à 1.
7. `.end:` : C'est notre étiquette de sortie.
8. `ret` : Retour à l'appelant. La valeur dans `rax` est le résultat.

## Où aller à partir d'ici

Nous n'avons fait qu'effleurer la surface. Comprendre comment la pile fonctionne en détail est un sujet entier en soi. Mais cela devrait suffire pour vous lancer.

- [Cheatsheet x86-64](https://cs.brown.edu/courses/cs033/docs/guides/x64_cheatsheet.pdf) : Gardez ceci sous la main. C'est une référence rapide inestimable.
- [Liste d'Instructions](http://faydoc.tripod.com/cpu/index.htm) : Une liste complète des instructions x86.

J'ai mis un tas de mes propres implémentations des fonctions de la bibliothèque standard C en assembleur sur un dépôt. N'hésitez pas à y jeter un œil et à l'utiliser comme référence.

Apprendre l'assembleur est un labeur, je ne vais pas mentir. Mais l'aperçu que cela vous donne sur comment les ordinateurs fonctionnent _réellement_ est une sorte de super-pouvoir. Cela changera la façon dont vous écrivez du code, même dans des langages de haut niveau.

Bon code. Que vos registres contiennent toujours les bonnes valeurs. 🖥️💪
