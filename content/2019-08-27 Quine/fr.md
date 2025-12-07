![](assets/thumbnail.jpg)

# Créer un programme qui s'écrit lui-même (un quine)

J'ai toujours été fasciné par une question simple, presque paradoxale : un programme peut-il écrire son propre code ?

Ce n'est pas qu'une curiosité philosophique ; c'est un défi de programmation rigoureux connu sous le nom de **Quine**.

## Le défi

L'objectif est d'écrire un programme dont la seule sortie est une copie exacte de son propre code source. Les règles sont simples mais strictes :

1. **Auto-réplication :** La sortie doit correspondre au fichier source octet par octet.
2. **Pas de triche :** Vous ne pouvez pas ouvrir votre propre fichier source (par exemple, `fopen(__FILE__)` est interdit).
3. **Pas d'entrée :** Le programme doit être autonome ; aucune donnée externe n'est autorisée.

Cela ressemble à un tour de magie, mais c'est de la pure logique.

## La théorie : comment ça fonctionne

Le problème fondamental est une régression à l'infini. Si vous voulez afficher le code, vous avez besoin d'une instruction d'affichage. Mais cette instruction *fait partie* du code, donc vous devez aussi l'afficher. Et ensuite, vous devez afficher le code qui affiche l'instruction d'affichage.

C'est comme se tenir entre deux miroirs face à face.

### La solution : Code = Données

L'astuce pour résoudre ce problème est de séparer le programme en deux parties :
1. **Le modèle (Données) :** Une chaîne de caractères contenant la *structure* du code.
2. **L'acteur (Code) :** La logique qui affiche le modèle et comble les pièces manquantes.

En C, cela prend souvent la forme d'une instruction `printf` qui utilise une chaîne comme format, puis passe *cette même chaîne* comme argument pour se compléter elle-même.

## Une solution en C

Voici un programme C qui résout le défi. Il inclut des commentaires et plusieurs fonctions pour prouver qu'il gère la complexité.

```c
#include <stdio.h>

/*
   Hey, this is an outside comment
*/

char *get_str()
{
	return "#include <stdio.h>%1$c%1$c/*%1$c   Hey, this is an outside comment%1$c*/%1$c%1$cchar *get_str()%1$c{%1$c%2$creturn %3$c%4$s%3$c;%1$c}%1$c%1$cint main(void)%1$c{%1$c%2$c/*%1$c%2$c   Hey, this is an inside comment%1$c%2$c*/%1$c%2$cchar *str = get_str();%1$c%2$cprintf(str, 10, 9, 34, str);%1$c}%1$c";
}

int main(void)
{
	/*
	   Hey, this is an inside comment
	*/
	char *str = get_str();
	printf(str, 10, 9, 34, str);
}
```

### Déconstruire la magie

1. **La chaîne :** `get_str()` retourne l'intégralité du code source sous forme d'une seule chaîne, mais avec des marqueurs de position.
   * `%1$c` est un marqueur pour un saut de ligne (ASCII 10).
   * `%4$s` est un marqueur pour la chaîne elle-même.
2. **L'affichage :** Dans `main`, nous appelons `printf(str, 10, 9, 34, str)`.
   * Nous passons les codes ASCII pour le saut de ligne (`10`), la tabulation (`9`) et les guillemets (`34`) pour corriger le formatage.
   * Point crucial : nous passons `str` *à elle-même* pour remplir le marqueur `%4$s`.

Le programme utilise la chaîne à la fois comme **instructions** (le format) et comme **données** (le contenu).

## Pourquoi "Quine" ?

Le terme a été inventé par Douglas Hofstadter dans *Gödel, Escher, Bach*. Il l'a nommé d'après le philosophe **Willard Van Orman Quine**, qui a étudié la logique de l'auto-référence.

Quine (le philosophe) a formulé ce célèbre paradoxe :
> « produit une fausseté quand on le fait précéder de sa citation » produit une fausseté quand on le fait précéder de sa citation.

C'est une phrase qui parle d'elle-même, tout comme notre programme.

## Pourquoi est-ce important ?

Au-delà d'être un tour de passe-passe intellectuel, les quines enseignent un concept fondamental en informatique : **le code et les données sont interchangeables**.

C'est le même mécanisme qui permet :
* Les **compilateurs** (des programmes qui lisent du code pour écrire du code).
* Les **virus** (des programmes qui se copient eux-mêmes dans d'autres fichiers).
* L'**ADN** (des données biologiques qui encodent les instructions pour construire l'organisme qui les porte).

Cela change complètement la façon dont on perçoit un fichier source. Ce n'est pas simplement un ensemble d'instructions ; c'est un motif capable de se reproduire lui-même.
