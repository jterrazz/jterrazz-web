![](assets/thumbnail.jpg)

# Les bases de l'assembleur x86-64 : écrire ses premières fonctions

Ce qui se passe vraiment au cœur d'un ordinateur m'a toujours fasciné. On dit que le C est "bas niveau", mais c'est encore une abstraction confortable. Il cache les instructions brutes que votre processeur exécute.

Pour parler directement au matériel, il faut apprendre sa langue : l'assembleur. 🖥️💓

Pas de théorie pure ici — on va coder. Je vous donne les outils et concepts pour écrire vos premières fonctions en assembleur. C'est parti. 👷‍♂️🔧

## L'environnement

Précision importante : l'assembleur varie selon l'architecture. On se concentre sur **Intel x86-64**, le standard des PC actuels.

### Les outils : NASM

Pas besoin d'IDE lourd. Juste :

1. Un éditeur de texte (celui que vous maîtrisez ⚔️)
2. NASM (transforme l'assembleur en code machine 🪄)

Sur Mac, une ligne avec Homebrew :

```sh
# Installer nasm sur MacOS
brew install nasm

# Compiler un fichier assembleur (.s) en fichier objet (.o)
nasm -f macho64 your_file.s -o your_file.o

# Lier les fichiers objets en un exécutable
ar rcs libyourstuff.a your_file.o
```

> Le flag `-f` est crucial : il indique le format de sortie. `macho64` pour macOS moderne.

### Le débogage 🕵️‍♂️

Assembleur sans débogueur = vol à l'aveugle. Vous ferez des erreurs, ça plantera. `lldb` (macOS) ou `gdb` (Linux) vous permettent d'avancer instruction par instruction et de voir ce qui se passe dans les registres. Apprenez les bases.

## Le langage du processeur

L'assembleur, c'est des ordres directs au CPU. Chaque ligne = une commande.

### Assembleur vs code machine

Souvent confondus, mais différents :

- **Code machine** : le binaire brut (0 et 1) que le processeur exécute. Illisible.
- **Assembleur** : la version lisible. On écrit en assembleur, NASM traduit en code machine.

L'assembleur nous donne une structure : labels, variables, sections. C'est l'abstraction la plus fine au-dessus du matériel.

### Structure d'un fichier assembleur

Un fichier `.s` s'organise en sections :

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

Sans section spécifiée, `.text` est utilisé par défaut.

### Où stocker les données

Trois options :

1. **Registres** : stockage ultra-rapide dans le CPU. Premier choix pour les calculs.
2. **Mémoire (RAM)** : plus vaste, mais plus lente.
3. **Constantes** : valeurs codées en dur dans les instructions.

![Types de mémoire](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N6b1GTJFRIUNdcqCwrHAZA.png)

### Les registres

Essentiel à maîtriser. Votre établi. Sur x86-64 :

#### Usage général

- `rax` : accumulateur. Valeurs de retour, arithmétique.
- `rbx` : base. Usage général, parfois adressage mémoire.
- `rcx` : compteur. Souvent pour les boucles.
- `rdx` : données. Multiplication/division, ou registre de secours.

#### Index et pointeurs

- `rdi`, `rsi` : index destination/source. Arguments 1 et 2 des fonctions.
- `rbp` : pointeur de base. Stack frame de la fonction courante.
- `rsp` : pointeur de pile. Toujours au sommet de la stack.
- `rip` : pointeur d'instruction. Prochaine instruction à exécuter (non modifiable).

Les registres de segment (`CS`, `DS`, etc.) peuvent être ignorés pour commencer.

## Le jeu d'instructions

Un programme = une liste d'instructions. Format : `INSTRUCTION destination, source`.

### Déplacer des données

**`mov`** `<dst>, <src>`
Copie `src` vers `dst`. L'équivalent de `=` en assembleur.

**`push`** `<data>`
Place une valeur au sommet de la pile (stockage temporaire).

**`pop`** `<dst>`
Retire la valeur du sommet de la pile vers `dst`.

**`lea`** `<dst>, [<src>]`
"Load Effective Address". Charge *l'adresse* au lieu de la valeur. Utile pour les pointeurs.

### Arithmétique

**`add`** `<dst>, <src>` → `dst = dst + src`

**`sub`** `<dst>, <src>` → `dst = dst - src`

**`inc`** `<dst>` → `dst++` (plus rapide que `add dst, 1`)

**`dec`** `<dst>` → `dst--`

### Contrôle de flux

**`call`** `<function_label>`
Saute vers une fonction après avoir `push` l'adresse de retour sur la pile.

```asm
extern malloc ; fonction externe

.text
call malloc  ; résultat dans rax
```

**`jmp`** `<label>`
Saut inconditionnel. Votre `goto` pour les boucles.

```asm
.text
section_1:
    ; ... code ...
    jmp section_2 ; saute à section_2

section_2:
    jmp section_1 ; boucle infinie
```

**`j<condition>`** `<label>`
Saut conditionnel. Le cœur des `if`. Saute selon les drapeaux définis par `cmp` ou `test`. Ex : `jz` saute si zéro.

### Comparer et tester

**`cmp`** `<reg1>, <reg2>`
Compare via `reg1 - reg2`. Ne stocke pas le résultat, mais définit les drapeaux (zéro, signe, etc.) que lisent les sauts conditionnels.

**`test`** `<reg1>, <reg2>`
`AND` bit à bit, définit les drapeaux. Astuce : `test rax, rax` vérifie si `rax` est nul.

Exemple avec `_ft_isalnum` (vérifie si alphanumérique) :

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
Pop l'adresse de retour et y saute. Fin de fonction.

## Les conventions d'appel

Comment passer les arguments ? Renvoyer les valeurs ? Les "conventions d'appel" définissent tout ça. Si vous ne les respectez pas, crash assuré.

Sur x86-64 (Linux/macOS), les 6 premiers arguments vont dans : `rdi`, `rsi`, `rdx`, `rcx`, `r8`, `r9`. Valeur de retour dans `rax`.

### Les syscalls

Pour lire un fichier, afficher à l'écran, ouvrir une connexion... il faut demander au noyau. Le syscall transfère le contrôle au kernel pour les opérations privilégiées.

## Exemple complet : ft_isascii

Vérifie si un caractère (dans `rdi`) est ASCII (0-127).

![ft_isascii](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Zeu7RMnWR6HT_7ij3-9kVA.png)

Décomposition :
1. `xor rax, rax` : met `rax` à 0 (on suppose non-ASCII).
2. `cmp rdi, 0` : compare avec 0.
3. `jl .end` : si < 0, pas ASCII → sortie.
4. `cmp rdi, 127` : compare avec 127.
5. `jg .end` : si > 127, pas ASCII → sortie.
6. `mov rax, 1` : dans la plage → retourne 1.
7. `.end:` + `ret` : retour à l'appelant.

## Ressources

On a juste effleuré la surface. La pile mériterait son propre article.

- [Cheatsheet x86-64](https://cs.brown.edu/courses/cs033/docs/guides/x64_cheatsheet.pdf)
- [Liste des instructions](http://faydoc.tripod.com/cpu/index.htm)

J'ai un dépôt avec mes implémentations de la libc en assembleur, jetez-y un œil.

L'assembleur demande du temps. Mais la compréhension qu'il apporte sur le fonctionnement *réel* des machines est un super-pouvoir. Ça change votre façon de coder, même en haut niveau.

Bon code. Que vos registres soient toujours justes. 🖥️💪
