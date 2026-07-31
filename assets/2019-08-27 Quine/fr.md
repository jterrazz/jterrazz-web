![](assets/thumbnail.jpg)

# Quine : un programme qui s'écrit lui-même

Un programme peut-il afficher son propre code source ? Cette question m'a toujours fasciné. C'est plus qu'une curiosité — c'est un vrai défi de programmation appelé **Quine**.

## Les règles du jeu

Écrire un programme dont la seule sortie est une copie exacte de son code source. Contraintes :

1. **Auto-réplication** : la sortie doit correspondre au source, octet pour octet.
2. **Pas de triche** : interdit de lire son propre fichier (`fopen(__FILE__)` = disqualifié).
3. **Pas d'entrée** : le programme doit être totalement autonome.

Ça ressemble à de la magie, mais c'est de la pure logique.

## Le problème

Une régression infinie. Pour afficher le code, il faut une instruction d'affichage. Mais cette instruction *fait partie* du code, donc il faut aussi l'afficher. Et ainsi de suite.

C'est comme se tenir entre deux miroirs.

### La solution : Code = Données

L'astuce : séparer le programme en deux parties :
1. **Le modèle (Données)** : une chaîne contenant la *structure* du code.
2. **L'acteur (Code)** : la logique qui affiche le modèle en le complétant.

En C, ça se traduit souvent par un `printf` qui utilise une chaîne comme format, puis passe *cette même chaîne* comme argument.

## Une solution en C

Un programme qui résout le défi, avec commentaires et plusieurs fonctions pour prouver qu'il gère la complexité :

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

### Décortiquons

1. **La chaîne** : `get_str()` retourne tout le code source avec des marqueurs.
   * `%1$c` → saut de ligne (ASCII 10).
   * `%4$s` → la chaîne elle-même.
2. **L'affichage** : `printf(str, 10, 9, 34, str)`.
   * On passe les codes ASCII : newline (`10`), tab (`9`), guillemet (`34`).
   * Point clé : `str` est passée *à elle-même* pour remplir `%4$s`.

La chaîne sert à la fois de **format** et de **contenu**.

## Pourquoi "Quine" ?

Le terme vient de Douglas Hofstadter dans *Gödel, Escher, Bach*, en hommage au philosophe **Willard Van Orman Quine** qui étudiait l'auto-référence.

Son paradoxe célèbre :
> « produit une fausseté quand on le fait précéder de sa citation » produit une fausseté quand on le fait précéder de sa citation.

Une phrase qui parle d'elle-même. Exactement comme notre programme.

## Pourquoi c'est important ?

Au-delà du tour de force intellectuel, les quines illustrent un concept fondamental : **code et données sont interchangeables**.

C'est le même principe derrière :
* Les **compilateurs** (du code qui génère du code).
* Les **virus** (des programmes qui se copient).
* L'**ADN** (des données qui encodent les instructions pour construire l'organisme qui les porte).

Un fichier source n'est pas juste des instructions — c'est un motif capable de se reproduire.
