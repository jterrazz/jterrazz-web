![](assets/thumbnail.jpg)

# Construire Un Cerveau: Mon Aventure Au Cœur Des Systèmes Experts Avec Python

La manière dont nous raisonnons m'a toujours fasciné. Comment connectons-nous les points, suivons-nous une piste logique et résolvons-nous une énigme? Il se trouve que nous pouvons enseigner aux ordinateurs à faire quelque chose de similaire. C'est là qu'entrent en jeu les **systèmes experts**.

Imaginez-les comme de petits cerveaux artificiels que nous pouvons construire pour résoudre des problèmes complexes, du diagnostic de maladies à la gestion financière. Ce sont les piliers méconnus de nombreuses applications d'intelligence artificielle, accomplissant leur mission en toute discrétion.

Dans cet article, je vais vous guider à travers la construction de l'un d'eux, que j'ai réalisé à partir de zéro avec Python. Pas de magie, juste de la logique. À la fin de cette lecture, vous aurez toutes les clés pour construire le vôtre. 🧠💻

## Mais Au Fait, Qu'est-ce Qu'un Système Expert?

Pensez-y comme à un Sherlock Holmes numérique. Il s'appuie sur un ensemble de **faits et de règles** pour en déduire des réponses. C'est une machine à déduction, parfaite lorsqu'il faut prouver une hypothèse ou prendre une décision difficile. Pour moi, c'est une pièce fondamentale du grand puzzle de l'IA.

![Expert System Components](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OQEJ09LSoMy5favPdGmRtQ.png)

## Les Briques De Construction De Mon Système

### Les Règles: Les Briques De Lego Logiques

![Rules Visualization](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3618kjRpRPZ8yUwjTEa9SA.png)

Au cœur de ce système se trouve un ensemble de **règles**. J'aime les voir comme des briques de Lego logiques. Nous pouvons les assembler pour construire des raisonnements d'une grande complexité. Ces règles sont de simples équations qui relient des `facts` (que nous représenterons par des lettres majuscules) à l'aide de quelques `connectors` clés:

- `&`: **AND**–Le connecteur pragmatique. Tous les faits connectés doivent être `True`. Sans exception.
- `|`: **OR**–Le connecteur décontracté. Un seul des faits a besoin d'être `True`.
- `^`: **XOR**–Le pointilleux. Un seul fait doit être `True`, mais pas les deux.
- `=>`: **IMPLY**–Le classique "si-alors". Si la partie gauche est `True`, la partie droite doit l'être aussi.

### La Table De Vérité: Notre Antisèche Logique

![Inference Truth Table](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZ-xKiHeAcPBCnP2bgcOTQ.png)

Pour donner un sens à tout cela, il nous faut une antisèche. Cette table de vérité est notre boussole logique. Elle montre comment fonctionnent les connecteurs. Regardez `p => q`. Si `p` est `false`, `q` peut être n'importe quoi—un vrai joker. Mais si `p` est `true`, `q` *doit* aussi être `true`. Ce simple principe est le moteur de notre machine à déduction.

### Les Faits Et Les Requêtes: Entrées Et Sorties

![Facts and Queries](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qr7VSqmln95Si329hAIX4A.png)

Passons maintenant aux entrées et aux sorties.

Les **Facts** sont nos vérités de départ, représentées par des lettres majuscules. Par défaut, j'ai tout initialisé à `false`—le système commence en ne sachant rien. Un fait ne devient `true` que si nous le déclarons comme un fait initial (`=ABC`) ou si le système le prouve en utilisant les règles.

Les **Queries** (`?XYZ`) sont simplement les questions auxquelles nous voulons que notre système réponde.

## Comment Construire Le Solveur

### Chaînage Avant Ou Arrière: Choisissez Votre Voie

Bon, comment *résoudre* concrètement quelque chose? Il y a deux approches principales:

1. **Le chaînage avant (Forward chaining)**: Partir de ce que l'on sait (les faits) et voir où les règles nous mènent. C'est comme commencer un labyrinthe par l'entrée.
2. **Le chaînage arrière (Backward chaining)**: Partir de ce que l'on veut prouver (la requête) et remonter le fil pour voir si les faits le confirment. C'est comme commencer un labyrinthe par la fin pour retrouver le chemin de l'entrée.

Pour ce projet, j'ai choisi le chaînage arrière. L'approche me semble plus intuitive—comme résoudre un mystère en partant du suspect pour chercher des indices.

## La Structure De Données: L'assemblage Des Lego

### La Classe Node: Le Composant Universel

Pour construire ce système, j'avais besoin d'une structure de données solide. J'ai commencé par une classe générique `Node`.

```python
class Node:
  def __init__(self):
    self.children = [] # In A => B, => is child of B 
    self.visited = False # When recursively parsing the Graph, it avoids infinite loop
    self.state = False # Saves if the result is True
```

Voyez-la comme la brique de construction universelle. Elle contient un état (`true`/`false`), garde une trace de sa visite (pour éviter les boucles infinies) et se connecte à d'autres nœuds. Dans la règle `A => B`, par exemple, `A` est un enfant de `=>`, qui est à son tour un enfant de `B`. C'est une manière simple de bâtir une chaîne logique.

### AtomNode Et ConnectorNode: Des Outils Spécialisés

À partir de là, j'ai créé deux types de nœuds spécialisés qui héritent du premier.

```python
class AtomNode(Node):
  def __init__(self, name):
    super(AtomNode, self).__init__()
    self.name = name
```

```python
class ConnectorNode(Node):
  def __init__(self, connector_type):
    super(ConnectorNode, self).__init__(tree)
    self.type = connector_type
    self.operands = [] # For example, in A + B, A and B are operands of +
    self.state = None
```

`AtomNode` gère nos faits (A, B, C), et `ConnectorNode` nos opérateurs logiques (AND, XOR, OR, IMPLY). Cette approche garde le code propre et organisé.

## Le Solveur: Le Faire Réfléchir

### Étape 1: Créer Une Liste Unique D'atomes

Avant toute chose, j'analyse l'entrée et je crée une liste unique de tous les atomes. C'est une étape clé. Elle garantit que chaque fois que le système rencontre la lettre 'A' dans les règles, il pointe vers le *même et unique* objet `AtomNode`. C'est notre source de vérité unique pour chaque fait.

### Étape 2: La Magie De la NPI

![RPN Representation](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*m27ch2wzXuwq6C0FLKAlqw.png)

Ensuite, la Notation Polonaise Inversée (NPI), ou *Reverse Polish Notation* (RPN). Si vous avez déjà utilisé une vieille calculatrice HP, vous savez de quoi il s'agit. Au lieu d'écrire `A + B`, on écrit `A B +`. Cela peut paraître étrange, mais pour un ordinateur, c'est révolutionnaire. L'ordre des opérations devient limpide et cela simplifie énormément l'analyse. On lit de gauche à droite, et à mesure que les opérandes sont utilisés, ils sont consommés et remplacés par le résultat. C'est d'une efficacité redoutable.

### Étape 3: Connecter Les Points

Avec nos règles prêtes au format NPI, il est temps de construire le réseau. Je parcours l'expression NPI et je connecte les nœuds.

```python
stack = []

for x in npi_rule:
  if x not in OPERATORS:
    stack.append(self.atoms[x])
  else:
    pop0 = stack.pop()
    pop1 = stack.pop()
    # If one of the popped element is the same connector that we will create (AND, OR, XOR)
    if isinstance(pop0, ConnectorNode) and pop0.type is LST_OP[x]:
      pop0.add_operand(pop1)
      new_connector = pop0
      self.connectors.pop()
    elif isinstance(pop1, ConnectorNode) and pop1.type is LST_OP[x]:
      pop1.add_operand(pop0)
      new_connector = pop1
      self.connectors.pop()
    else:
      connector_x = self.create_connector(LST_OP[x])
      connector_x.add_operands([pop0, pop1])
      new_connector = connector_x
    self.connectors.append(new_connector)
    stack.append(new_connector)

return stack.pop()
```

Quand je rencontre un atome, je le pousse sur une pile. Quand je rencontre un opérateur, je dépile les atomes dont il a besoin, je les lie comme opérandes au nouveau nœud connecteur, et je repousse la nouvelle structure sur la pile. C'est ainsi que le château de Lego logique se construit, pièce par pièce.

### Étape 4: Le Grand final—la Résolution Des Requêtes

Et maintenant, le moment de vérité. Pour résoudre une requête, j'ai bâti une fonction récursive qui plonge dans le graphe logique.

```python
# Pseudocode

def resolve(nodeX):
  if nodeX is True:
    return True
  
  for child in nodeX.children:
    res = resolve(child)
    if res is True:
      # Only need one of the children to be True for deducting the current is True
      return True
    
  if Node is Connector: # AND OR XOR IMPLY
    op_results = []
    for op in nodeX.operands:
      op_results.append(resolve(op))
    self.set_state_from_operands(op_results)
    # Example: for AND all op_results elements must be True
```

Elle part du nœud de la requête et remonte le fil à travers ses enfants. Si un enfant peut être prouvé `True`, il remonte l'information. Pour un nœud connecteur comme `AND`, la fonction vérifie si tous ses opérandes peuvent être résolus comme `True`. Pour `OR`, un seul suffit. La fonction utilise la logique de notre table de vérité pour faire remonter une réponse finale jusqu'au sommet. C'est vraiment satisfaisant de le voir fonctionner.

## Réflexions Finales: à Vous De Jouer

Et c'est à peu près tout! Nous avons exploré la logique fondamentale de la construction d'un système expert en chaînage arrière. À partir de règles simples, nous avons créé un système capable de *raisonner*.

C'est un concept puissant, et nous n'avons fait qu'effleurer la surface. Ce que nous avons bâti est une fondation. Si vous voulez aller plus loin, vous pourriez essayer d'implémenter le chaînage avant ou d'ajouter le support d'une logique plus complexe. Les possibilités sont immenses.

Pour tous ceux qui souhaitent mettre les mains dans le cambouis, j'ai mis le projet Python complet sur [mon GitHub](https://github.com/jterrazz/42-expert-system). Allez y jeter un œil, jouez avec, cassez-le, et améliorez-le.

Happy coding! 🚀🧠
