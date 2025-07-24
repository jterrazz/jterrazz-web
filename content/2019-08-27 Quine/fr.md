![](assets/thumbnail.jpg)

# Le paradoxe du code, à la découverte du quine, le programme qui s'écrit lui-même

Il existe une idée simple, presque un paradoxe, qui m'a toujours fasciné: un programme peut-il s'écrire lui-même? Loin d'être une simple interrogation philosophique, c'est un authentique défi de programmation. Bienvenue dans l'univers vertigineux des **quines**.

## Le défi

Le défi est le suivant: écrire un programme dont l'unique sortie est son propre code source. Les règles sont simples, mais la rigueur est de mise:

1. **Auto-réplication:** La sortie du programme doit être une copie conforme, au caractère près, de son code source.
2. **Pas de triche:** Il est interdit d'ouvrir le fichier source pour en lire le contenu. Ce serait tricher.
3. **Aucune entrée:** Le programme doit être parfaitement autonome et ne solliciter aucune information extérieure pour fonctionner.

On pourrait y voir un tour de magie, mais tout n'est que pure logique. Voyons ensemble comment cette prouesse est possible.

## La théorie derrière l'illusion: le théorème de Kleene

Bien avant que les langages de programmation modernes ne nous permettent de construire des quines, leur existence fut démontrée par un mathématicien du nom de Stephen Kleene. Ses travaux dans les années 1930 ont posé les fondations théoriques des programmes auto-réplicatifs.

### Première forme—Le théorème du point fixe

Le premier théorème de la récursion de Kleene est un pilier de la théorie de la calculabilité. Il énonce que pour toute fonction calculable `f`, on peut trouver un programme `e` qui se comporte d'une manière très singulière.

En substance, si l'on applique une transformation `f` à la logique du programme `e`, le résultat est identique à l'exécution de ce même programme `e`.

`ϕe(x) = f(e,x)`

- `e` est la logique du programme.
- `ϕe` est sa syntaxe (le code lui-même).
- `x` est une entrée quelconque.
- `f` est une fonction qui transforme le programme.

C'est une idée vertigineuse, car elle prouve mathématiquement qu'un programme peut faire référence à lui-même de manière cohérente et fonctionnelle.

### Seconde forme—Le principe du quine

Cela nous conduit à une conclusion encore plus directe et puissante pour notre objectif. Pour toute fonction calculable `f`, il existe un programme `p` qui est un " point fixe " de cette fonction.

`p = f(p)`

Autrement dit, il existe un programme `p` qui, lorsqu'il est traité par la fonction `f`, produit une copie de lui-même en sortie. C'est le feu vert théorique qui rend les quines possibles. Cela signifie que dans n'importe quel langage Turing-complet, l'auto-réplication est non seulement envisageable, mais inévitable.

## Construisons-en un

La théorie, c'est bien. Le code, c'est mieux. Voici le cahier des charges de notre quine, conçu pour prouver qu'il ne s'agit pas d'un simple artifice:

1. **Afficher le code source sans lire le fichier:** une véritable auto-génération.
2. **Inclure au moins deux commentaires:** pour prouver que même les parties non exécutables sont fidèlement reproduites.
3. **Utiliser au moins deux fonctions:** pour démontrer qu'une complexité structurelle est possible.
4. **Réplication parfaite:** la commande `diff <(./quine) quine.c` ne doit retourner aucune différence, prouvant que la sortie et la source sont identiques.

### Une solution en C

Voici un programme en C qui remplit tous ces critères.

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

Alors, comment cela fonctionne-t-il? L'astuce repose sur une dualité: le programme est à la fois données et code qui exploite ces données.

La fonction `get_str()` retourne une chaîne de caractères qui est un gabarit (*template*) de l'ensemble du programme. Ce gabarit inclut des spécificateurs de format pour `printf`, comme `%1$c` (un caractère) et `%4$s` (une chaîne). La fonction `main`, elle, récupère ce gabarit et le réinjecte *en lui-même* via `printf`. Elle remplit les espaces réservés avec les codes ASCII pour le saut de ligne (10), la tabulation (9), le guillemet double (34), et surtout, la chaîne gabarit elle-même.

C'est un peu comme posséder le plan d'un bâtiment qui contiendrait, dans ses moindres détails, les instructions pour imprimer ce même plan.

## D'où vient le nom " quine "?

Le terme fut popularisé par Douglas Hofstadter dans son livre culte *Gödel, Escher, Bach*. Il l'a nommé ainsi en l'honneur du philosophe **Willard Van Orman Quine**, qui a longuement exploré le concept d'auto-référence indirecte.

Quine a illustré cette idée à travers un paradoxe célèbre:

> " est fausse si précédée de sa propre citation " est fausse si précédée de sa propre citation.

Cette phrase est paradoxale car elle énonce sa propre fausseté, tout comme un quine en programmation contient une représentation de lui-même. Un pont magnifique entre la logique, la philosophie et le code.

## Pour aller plus loin

Ce concept est bien plus qu'une simple curiosité intellectuelle. Lorsque j'étais étudiant à 42 Paris, des projets comme Dr. Quine nous forçaient à plonger au cœur de ces mécanismes, notamment pour comprendre comment les virus informatiques peuvent se propager. Cela transforme fondamentalement votre regard sur la relation entre le code et les données.

Si le virus de la curiosité vous a piqué, tout un univers de programmes auto-réplicatifs s'ouvre à vous. J'ai d'ailleurs rassemblé certains de mes travaux de 42 dans un dépôt si vous souhaitez explorer des exemples plus complexes. Qui sait, peut-être deviendrez-vous à votre tour un maître en l'art du quine! 😊

Bon code.
