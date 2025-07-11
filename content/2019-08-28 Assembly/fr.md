![](assets/thumbnail.jpg)

# Plongée En Assembleur: Créons Nos Premières Fonctions (Intel x86-64)

J'ai toujours été fasciné par ce qui se passe au plus profond d'un ordinateur. On entend souvent dire que le C est un langage de "bas niveau", mais en toute honnêteté, il reste une confortable couche d'abstraction. Il masque les instructions brutes et puissantes que votre processeur exécute réellement.

Pour s'adresser directement au métal, il faut apprendre sa langue native. Cette langue, c'est l'Assembleur. 🖥️💓

Mais il ne s'agit pas que de théorie. Nous allons construire des choses. Je vais vous guider à travers les outils et les concepts pour que vous puissiez commencer à écrire vos propres fonctions en Assembleur dès aujourd'hui. Alors, au travail. 👷‍♂️🔧

## L'environnement De Travail: Votre Terrain De Jeu Pour l'Assembleur

D'abord, une petite précision: l'Assembleur n'est pas un langage unique. Il varie en fonction de l'architecture du processeur. Nous allons nous concentrer sur l'architecture Intel x86-64, celle qui équipe la plupart des ordinateurs de bureau et portables aujourd'hui.

### La Boîte à Outils: NASM

Nul besoin d'un IDE lourd ou d'une chaîne d'outils complexe. Pour ma part, je n'utilise que deux choses:

1. Un simple éditeur de texte (celui avec lequel vous êtes le plus à l'aise ⚔️)
2. Le compilateur NASM (qui transforme notre assembleur lisible en code machine 🪄)

Sur un Mac, obtenir NASM se fait en une seule ligne de commande avec Homebrew.

```sh
# Install nasm on MacOS
brew install nasm

# Compile an assembly file (.s) into an object file (.o)
nasm -f macho64 your_file.s -o your_file.o

# Link object files into an executable
ar rcs libyourstuff.a your_file.o
```

> Une petite astuce: ce drapeau `-f` est crucial. Il indique à NASM le format du fichier de sortie. `macho64` est le format requis par les versions modernes de macOS.

### Le Débogage: Votre Arme Secrète 🕵️‍♂️

Écrire de l'Assembleur sans débogueur, c'est comme naviguer à l'aveugle. Vous ferez des erreurs. Votre programme plantera. `lldb` (sur macOS) et `gdb` (sur Linux) sont vos meilleurs amis pour comprendre pourquoi. Ils vous permettent d'exécuter votre code instruction par instruction et de voir précisément ce qui se passe dans la mémoire et les registres. N'ignorez surtout pas l'apprentissage des bases de ces outils.

## Le Langage Du Processeur

Pensez à l'Assembleur comme à un ensemble d'ordres directs pour votre processeur. Chaque ligne est une seule et minuscule commande.

### Assembleur vs. Code Machine

On confond souvent " Assembleur " et " code machine ", mais ce ne sont pas les mêmes.

* **Le Code Machine:** C'est le binaire brut—les 1 et les 0—que le processeur exécute. Il est totalement illisible pour un humain.
* **L'Assembleur:** C'est la version lisible par un humain du code machine. Nous écrivons en Assembleur, puis un compilateur (comme NASM) le traduit en code machine.

Écrire en Assembleur nous offre un avantage considérable par rapport à la tentative d'écrire du binaire brut. Il nous apporte une structure: nous pouvons utiliser des étiquettes pour les fonctions, définir des variables et organiser notre logique en sections. C'est la plus fine couche d'abstraction possible au-dessus du matériel.

### L'organisation D'un Fichier Assembleur

J'organise mes fichiers Assembleur (`.s`) en quelques sections standards pour garder les choses propres.

```asm
; SECTION: Données initialisées
; Les variables qui ont une valeur au démarrage du programme.
.data
my_str db "hello world", 0 ; Une chaîne, terminée par un octet nul (0).
my_var db 42                ; Un seul octet initialisé à 42.
; db = 1 byte (byte)
; dw = 2 bytes (word)
; dd = 4 bytes (doubleword)
; dq = 8 bytes (quadword)

; SECTION: Données en lecture seule
; Les constantes qui ne devraient pas changer.
.rodata
pi dq 3.14

; SECTION: Données non initialisées
; Un espace pour réserver de la mémoire sans lui donner de valeur initiale.
.bss
my_buffer: resb 1024 ; Réserver 1024 octets d'espace.
; resb = reserve bytes
; resw = reserve words
; resd = reserve doublewords
; resq = reserve quadwords

; SECTION: Le Code
; C'est ici que réside la logique.
.text
global _start ; Rendre l'étiquette _start visible pour l'éditeur de liens.

_start:
    ; Votre code vient ici.
```

Si vous ne spécifiez pas de section, l'assembleur utilise généralement `.text` par défaut. C'est là que tout se passe.

### Où Vivent Vos Données

En Assembleur, vous passez votre temps à déplacer des données. Vous avez trois endroits où les stocker:

1. **Les registres:** Un petit nombre d'emplacements de stockage ultra-rapides directement à l'intérieur du processeur. C'est votre premier choix pour les calculs.
2. **La mémoire (RAM):** L'immense réservoir de stockage à l'extérieur du processeur. Bien plus vaste que les registres, mais aussi beaucoup plus lent d'accès.
3. **Les constantes:** Des valeurs codées en dur, directement intégrées dans vos instructions.

![Memory Types](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N6b1GTJFRIUNdcqCwrHAZA.png)

### Les Registres

Apprendre à connaître les registres est essentiel. C'est votre établi. Sur x86-64, voici les principaux que vous utiliserez:

#### Registres à Usage Général

Ce sont les poids lourds.

* `rax`: L'" accumulateur ". Souvent utilisé pour les valeurs de retour des fonctions et dans les opérations arithmétiques.
* `rbx`: Le registre de " base ". Peut être utilisé pour tout, mais sert parfois à l'adressage mémoire.
* `rcx`: Le " compteur ". Souvent utilisé pour les boucles.
* `rdx`: Le registre de " données ". Souvent utilisé dans les multiplications et divisions, ou simplement comme registre d'appoint.

#### Registres D'index Et De Pointeurs

Ceux-ci servent à garder la trace des emplacements en mémoire.

* `rdi`, `rsi`: Index de destination et de source. Très utilisés dans les opérations qui déplacent des blocs de mémoire. Ce sont aussi les deux premiers registres d'arguments dans les appels de fonction.
* `rbp`: Pointeur de base (*Base Pointer*). Utilisé pour suivre le "cadre de pile" (*stack frame*) de la fonction actuelle.
* `rsp`: Pointeur de pile (*Stack Pointer*). Pointe toujours vers le sommet de la pile.
* `rip`: Pointeur d'instruction (*Instruction Pointer*). Pointe vers la prochaine instruction CPU à exécuter. Vous ne pouvez pas le modifier directement.

Vous pouvez ignorer la plupart du temps les registres de segment (`CS`, `DS`, etc.) pour les programmes simples.

## Le Jeu D'instructions: Votre Boîte à Outils

Un programme en Assembleur n'est qu'une liste d'instructions. Le format est généralement `INSTRUCTION destination, source`. Jetons un œil aux plus courantes.

### Déplacer Des Données

**`mov`** `<dst>, <src>`
C'est l'instruction la plus fondamentale. Elle copie les données de `src` vers `dst`. La source peut être un registre, une adresse mémoire ou une constante. La destination doit être un registre ou une adresse mémoire. Pensez-y comme l'opérateur `=` de l'Assembleur.

**`push`** `<data>`
Prend une valeur et la place au sommet de la pile. La pile est une zone de mémoire pour le stockage temporaire. `push` est la manière de sauvegarder des choses dont vous aurez besoin plus tard.

**`pop`** `<dst>`
Prend la valeur au sommet de la pile et la place dans votre registre ou emplacement mémoire de destination. C'est l'inverse de `push`.

**`lea`** `<dst>, [<src>]`
Signifie "Load Effective Address" (Charger l'adresse effective). C'est un peu différent de `mov`. Plutôt que de charger la *valeur* à l'adresse source, il charge l'*adresse elle-même*. C'est extrêmement utile pour faire des calculs sur des pointeurs.

### Faire Des Mathématiques

**`add`** `<dst>, <src>`
`dst = dst + src`.

**`sub`** `<dst>, <src>`
`dst = dst - src`.

**`inc`** `<dst>`
Incrémente la destination de 1. Plus rapide que `add dst, 1`.

**`dec`** `<dst>`
Décrémente la destination de 1. Plus rapide que `sub dst, 1`.

### Contrôler Le Flux D'exécution

**`call`** `<function_label>`
Cette instruction saute vers une fonction, mais elle `push` d'abord l'adresse de l'instruction suivante sur la pile. C'est ainsi que le processeur sait où revenir une fois la fonction terminée.

```asm
extern malloc ; Indique à l'assembleur que nous utilisons une fonction externe

.text
call malloc  ; Appelle la fonction malloc
             ; Le résultat (une adresse mémoire) sera dans le registre rax
```

**`jmp`** `<label>`
Un saut inconditionnel. Il déplace simplement le pointeur d'exécution (`rip`) vers un nouvel emplacement. C'est la base des boucles et des `goto`.

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
Un saut conditionnel. C'est le cœur des instructions `if`. Il ne saute que si certains drapeaux (positionnés par `cmp` ou `test`) sont activés. Par exemple, `jz` saute si le résultat de la dernière comparaison était zéro.

### Comparer Et Tester

**`cmp`** `<reg1>, <reg2>`
Compare deux registres en effectuant en interne `reg1 - reg2`. Il ne stocke pas le résultat, mais il positionne des drapeaux d'état (comme le drapeau zéro, le drapeau de signe, etc.). Les instructions de saut conditionnel lisent ensuite ces drapeaux.

**`test`** `<reg1>, <reg2>`
Effectue un `ET` binaire sur les deux opérandes et positionne les drapeaux en fonction du résultat. Une astuce courante est `test rax, rax`. Si `rax` est nul, le résultat du `ET` est nul, ce qui active le drapeau zéro (*zero flag*). C'est une manière très efficace de vérifier si un registre est nul.

Voici comment vous pourriez les utiliser pour construire une fonction `_ft_isalnum` (qui vérifie si un caractère est alphanumérique):

```asm
extern ft_isalpha
extern ft_isdigit

.text
_ft_isalnum:
    call _ft_isalpha  ; Cette fonction retournera 1 dans rax si le caractère est une lettre
    test rax, rax     ; Vérifie si rax est nul
    jnz is_alnum      ; S'il n'est pas nul (jnz), alors c'était une lettre. On saute.

    call _ft_isdigit  ; Sinon, on vérifie si c'est un chiffre. Retourne aussi 1 dans rax si succès.
    test rax, rax     ; Vérifie si rax est nul
    jnz is_alnum      ; S'il n'est pas nul, c'était un chiffre. On saute.

is_not_alnum:
    xor rax, rax      ; Une façon astucieuse de mettre rax à 0 (toute valeur XORée avec elle-même donne 0)
    ret               ; Retourne 0

is_alnum:
    mov rax, 1        ; Met rax à 1
    ret               ; Retourne 1
```

**`ret`**
Quand une fonction est terminée, `ret` `pop` l'adresse de retour de la pile et y retourne. C'est ainsi que vous terminez une fonction et rendez le contrôle à l'appelant.

## Conventions D'appel: Le Code De la Route

Comment une fonction sait-elle comment en appeler une autre? Comment les arguments sont-ils passés? Comment les valeurs de retour sont-elles renvoyées? Tout cela est défini par une "convention d'appel". Si vous ne la respectez pas, tout casse de manière spectaculaire.

Pour x86-64 sur Linux et macOS, les six premiers arguments de type entier/pointeur sont passés dans les registres: `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9`. La valeur de retour est attendue dans `%rax`.

### Dialoguer Avec l'OS: Les Syscalls

Si vous voulez faire quelque chose d'intéressant comme lire un fichier, afficher du texte à l'écran ou ouvrir une connexion réseau, vous devez solliciter l'aide du noyau du système d'exploitation. Vous le faites avec un "syscall". C'est une instruction spéciale qui passe le contrôle au noyau pour effectuer une opération privilégiée.

## Assembler Le Tout: `ft_isascii`

Regardons une fonction très simple. Celle-ci vérifie si le caractère d'entrée (passé dans `rdi`) est un caractère ASCII valide (c'est-à-dire entre 0 et 127).

![ft_isascii function](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Zeu7RMnWR6HT_7ij3-9kVA.png)

Décortiquons-la:
1. `xor rax, rax`: C'est une manière rapide de mettre `rax` à 0. Nous partons du principe que le caractère n'est pas ASCII jusqu'à preuve du contraire.
2. `cmp rdi, 0`: Compare le caractère d'entrée avec 0.
3. `jl.end`: "Jump if Less" (Saut si inférieur). Si le caractère est inférieur à 0, il n'est pas ASCII, donc nous sautons à la fin.
4. `cmp rdi, 127`: Compare le caractère d'entrée avec 127.
5. `jg.end`: "Jump if Greater" (Saut si supérieur). Si le caractère est supérieur à 127, il n'est pas ASCII, donc nous sautons à la fin.
6. `mov rax, 1`: Si nous sommes arrivés jusqu'ici, le caractère est dans la bonne plage. Nous mettons notre valeur de retour `rax` à 1.
7. `.end:`: C'est notre étiquette de sortie.
8. `ret`: Retourne à l'appelant. La valeur dans `rax` est le résultat.

## Et Maintenant?

Nous n'avons fait qu'effleurer la surface. Comprendre en détail le fonctionnement de la pile est un sujet à part entière. Mais cela devrait suffire pour vous lancer.

* [x86-64 Cheatsheet](https://cs.brown.edu/courses/cs033/docs/guides/x64_cheatsheet.pdf): Gardez-le à portée de main. C'est une référence rapide inestimable.
* [Liste d'instructions](http://faydoc.tripod.com/cpu/index.htm): Une liste complète des instructions x86.

J'ai mis plusieurs de mes propres implémentations de fonctions de la bibliothèque standard C en Assembleur sur un dépôt. N'hésitez pas à le consulter et à l'utiliser comme référence.

Apprendre l'Assembleur est un travail de longue haleine, je ne vais pas vous mentir. Mais la vision qu'il vous donne sur la façon dont les ordinateurs fonctionnent *réellement* est une sorte de super-pouvoir. Cela changera votre manière d'écrire du code, même dans des langages de haut niveau.

Happy coding. Puissent vos registres toujours contenir les bonnes valeurs. 🖥️💪
