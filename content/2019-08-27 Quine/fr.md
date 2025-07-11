![](assets/thumbnail.jpg)

# L'art De Créer Un Programme Qui S'écrit Lui-même: Le Quine

J'ai toujours été fasciné par une idée simple, presque paradoxale: un programme peut-il se construire lui-même? Loin d'être une simple question philosophique, c'est un véritable défi de programmation. Bienvenue dans l'univers fascinant des **quines**.

## Le Défi

L'objectif est d'écrire un programme dont l'unique sortie est son propre code source. Les règles sont simples mais strictes:

1. **Autoréplication:** La sortie du programme doit être une copie exacte de son code source.
2. **Sans tricher:** Il est interdit de simplement ouvrir le fichier source pour en imprimer le contenu. Ce serait trop facile.
3. **Aucune entrée:** Le programme doit être entièrement autonome. Il ne peut solliciter aucune information extérieure pour accomplir sa tâche.

Cela ressemble à un tour de magie, mais ce n'est que pure logique. Voyons comment c'est possible.

## La Théorie Derrière la Magie: Le Théorème De Kleene

Bien avant que nous ayons les langages de programmation pour construire facilement des quines, la possibilité même de leur existence a été prouvée par un mathématicien nommé Stephen Kleene. Ses travaux dans les années 1930 ont jeté les bases théoriques des programmes autoréplicatifs.

### Première forme—Le Théorème Du point Fixe

Le premier théorème de la récursion de Kleene est un concept fondamental de la théorie de la calculabilité. Il énonce essentiellement que pour toute fonction calculable `f`, on peut trouver un programme `e` qui se comporte d'une manière très spéciale.

En substance, transformer la logique du programme (`e`) avec la fonction `f` produit le même résultat que d'exécuter directement le programme `e`.

`ϕe(x) = f(e,x)`

* `e` est la logique du programme.
* `ϕe` est sa syntaxe (le code lui-même).
* `x` est une entrée quelconque.
* `f` est une fonction qui transforme le programme.

C'est une idée vertigineuse, car elle prouve qu'un programme peut faire référence à lui-même de manière significative.

### Seconde forme—Le Théorème Du Quine

Cela nous mène à une conclusion plus directe et puissante. Pour toute fonction calculable `f`, il existe un programme `p` qui est un "point fixe" de cette fonction.

`p = f(p)`

En d'autres termes, il existe un programme `p` qui, lorsqu'on l'utilise comme entrée de la fonction `f`, se produit lui-même en sortie. C'est le feu vert théorique pour les quines. Cela signifie que dans n'importe quel langage Turing-complet, l'autoréplication est possible.

## Passons à la Pratique

La théorie, c'est bien, mais le code, c'est mieux. Voici les spécifications de notre quine, conçues pour montrer qu'il ne s'agit pas d'une simple astuce:

1. **Afficher son code source sans lire le fichier:** une véritable autoréplication.
2. **Inclure au moins deux commentaires:** pour montrer que même les parties non exécutables sont répliquées.
3. **Utiliser au moins deux fonctions:** pour démontrer que la complexité structurelle est possible.
4. **Une réplication parfaite:** la commande `diff <(./quine) quine.c` ne doit rien retourner, prouvant que la sortie et le source sont identiques.

### Une Solution En C

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

Comment cela fonctionne-t-il? L'astuce repose sur une structure en deux parties: des données d'un côté, et du code qui utilise ces données de l'autre.

La fonction `get_str()` retourne une chaîne de caractères qui est un *modèle* de l'ensemble du programme, truffé de spécificateurs de format `printf` comme `%1$c` (un caractère) et `%4$s` (une chaîne). La fonction `main` récupère ce modèle puis l'injecte *en retour dans lui-même* via `printf`. Elle remplit les espaces réservés avec les codes ASCII pour un retour à la ligne (10), une tabulation (9), un guillemet double (34), et le modèle lui-même. C'est un plan qui contient les instructions pour sa propre reconstruction.

## D'où Vient Le Nom "Quine"?

Le terme a été popularisé par Douglas Hofstadter dans son livre *Gödel, Escher, Bach*. Il l'a nommé en l'honneur du philosophe **Willard Van Orman Quine**, qui a beaucoup travaillé sur l'autoréférence indirecte.

Quine a exploré ce concept à travers un paradoxe:

> "yields falsehood when preceded by its quotation" yields falsehood when preceded by its quotation.
>
> *"donne une fausseté si précédée de sa propre citation" donne une fausseté si précédée de sa propre citation.*

Cette phrase est paradoxale car elle affirme sa propre fausseté, tout comme un quine en programmation contient une représentation de lui-même. Un lien magnifique entre la logique, la philosophie et le code.

## Pour Aller plus Loin

Ce concept n'est pas qu'une simple astuce de salon. Lorsque j'étais étudiant à 42 Paris, nous avions des projets comme Dr. Quine qui nous forçaient à nous plonger dans ces idées, comme une introduction à la manière dont les virus peuvent se propager. Cela change fondamentalement votre manière de penser la relation entre le code et les données.

Si le virus vous a piqué, tout un monde de programmes autoréplicatifs s'offre à vous. J'ai rassemblé certains de mes travaux de 42 dans un dépôt si vous souhaitez voir des exemples plus complexes. Vous pourriez bien devenir vous-même un maître des quines! 😊

Happy coding
