![](assets/thumbnail.jpg)

# Construire un programme qui s'écrit lui-même (Un Quine)

J'ai toujours été fasciné par une question simple, presque paradoxale : un programme peut-il écrire son propre code ?

Ce n'est pas juste une curiosité philosophique ; c'est un défi de programmation rigoureux connu sous le nom de **Quine**.

## Le Défi

Le but est d'écrire un programme dont l'unique sortie est une copie exacte de son propre code source. Les règles sont simples mais strictes :

1.  **Auto-réplication :** La sortie doit correspondre au fichier source à l'octet près.
2.  **Pas de triche :** Vous ne pouvez pas ouvrir votre propre fichier source (par exemple, `fopen(__FILE__)` est interdit).
3.  **Pas d'entrée :** Le programme doit être autonome ; aucune donnée externe n'est autorisée.

Cela ressemble à un tour de magie, mais c'est purement logique.

## La Théorie : Comment ça marche

Le problème central est une régression infinie. Si vous voulez imprimer le code, vous avez besoin d'une instruction d'impression (comme `print` ou `printf`). Mais cette instruction fait _partie_ du code, donc vous devez imprimer l'instruction d'impression. Et ensuite, vous devez imprimer le code qui imprime l'instruction d'impression.

On a l'impression de se tenir entre deux miroirs.

### La Solution : Code = Données

L'astuce pour résoudre cela est de séparer le programme en deux parties :

1.  **Le Modèle (Données) :** Une chaîne contenant la _structure_ du code.
2.  **L'Acteur (Code) :** La logique qui imprime le modèle et remplit les pièces manquantes.

En C, cela ressemble souvent à une instruction `printf` qui prend une chaîne comme format, puis passe _cette même chaîne_ comme argument pour se remplir elle-même.

## Une Solution en C

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

### Déconstruction de la Magie

1.  **La Chaîne :** `get_str()` renvoie le code source entier comme une seule chaîne, mais avec des espaces réservés (placeholders).
    - `%1$c` est un espace réservé pour un saut de ligne (ASCII 10).
    - `%4$s` est un espace réservé pour la chaîne elle-même.
2.  **L'Impression :** Dans `main`, nous appelons `printf(str, 10, 9, 34, str)`.
    - Nous passons les codes ASCII pour le saut de ligne (`10`), la tabulation (`9`), et les guillemets (`34`) pour corriger le formatage.
    - De manière cruciale, nous passons `str` _dans elle-même_ pour remplir l'espace réservé `%4$s`.

Le programme utilise la chaîne à la fois comme **instructions** (le format) et comme **données** (le contenu).

## Pourquoi "Quine" ?

Le terme a été inventé par Douglas Hofstadter dans _Gödel, Escher, Bach_. Il l'a nommé d'après le philosophe **Willard Van Orman Quine**, qui a étudié la logique de l'autoréférence.

Quine (le philosophe) a célèbrement formulé ce paradoxe :

> "produit une fausseté lorsqu'il est précédé par sa citation" produit une fausseté lorsqu'il est précédé par sa citation.

C'est une phrase qui parle d'elle-même, tout comme notre programme.

## Pourquoi est-ce important ?

Au-delà d'être un tour de passe-passe astucieux, les quines enseignent un concept fondamental en informatique : **le code et les données sont interchangeables**.

C'est le même mécanisme qui permet :

- **Les Compilateurs** (des programmes qui lisent du code pour écrire du code).
- **Les Virus** (des programmes qui se copient eux-mêmes dans d'autres fichiers).
- **L'ADN** (des données biologiques qui encodent les instructions pour construire l'organisme qui les porte).

Cela change complètement la façon dont vous voyez un fichier source. Ce n'est pas juste un ensemble d'instructions ; c'est un motif capable de se reproduire lui-même.
