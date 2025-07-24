![](assets/thumbnail.jpg)

# Mon aventure au cœur des systèmes experts avec Python

La manière dont nous raisonnons m'a toujours fasciné. Comment notre esprit parvient-il à tisser des liens, à remonter le fil d'une logique, à résoudre une énigme? Il se trouve que nous pouvons enseigner aux ordinateurs un processus très similaire. C'est précisément là qu'interviennent les **systèmes experts**.

Ce sont, en somme, de petits cerveaux d'intelligence artificielle que nous pouvons façonner pour dénouer des problèmes complexes, du diagnostic médical à la gestion financière. Ce sont les véritables artisans de l'ombre de nombreuses applications d'IA, œuvrant discrètement en coulisses.

Dans cet article, je vais vous guider pas à pas dans la création de mon propre système expert, conçu de A à Z en Python. Pas de tour de passe-passe, juste de la logique pure. À la fin de cette lecture, vous aurez toutes les clés en main pour bâtir le vôtre. 🧠💻

## Qu'est-ce qu'un système expert, au juste?

Imaginez-le comme un Sherlock Holmes numérique. Il s'appuie sur un ensemble de **faits (`facts`) et de règles (`rules`)** pour forger ses déductions. C'est une pure machine à raisonner, idéale lorsqu'il faut prouver une hypothèse ou trancher dans une situation délicate. Pour moi, c'est une pièce maîtresse du grand puzzle de l'IA.

![Composants d'un système expert](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OQEJ09LSoMy5favPdGmRtQ.png)

## Les fondations de mon système

### Les règles: des briques de Lego logiques

![Visualisation des règles](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3618kjRpRPZ8yUwjTEa9SA.png)

Le cœur de ce projet bat au rythme d'un ensemble de **règles**. J'aime les imaginer comme des briques de Lego logiques. En les assemblant, nous pouvons construire des raisonnements d'une complexité surprenante. Ces règles ne sont que de simples équations qui relient des `facts` (que nous représenterons par des lettres majuscules) à l'aide de quelques `connectors` essentiels:

- `&`: **AND (ET)**–Le connecteur le plus strict. Tous les faits liés doivent être `True`. Aucune exception.
- `|`: **OR (OU)**–Le plus flexible. Il suffit qu'un seul des faits soit `True` pour que la condition soit remplie.
- `^`: **XOR (OU EXCLUSIF)**–Le pointilleux. Un seul fait doit être `True`, mais pas les deux.
- `=>`: **IMPLY (IMPLIQUE)**–Le grand classique " si… alors… ". Si la partie gauche est `True`, la partie droite doit impérativement l'être aussi.

### La table de vérité: notre aide-mémoire logique

![Table de vérité des inférences](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZ-xKiHeAcPBCnP2bgcOTQ.png)

Pour donner un sens à tout cela, il nous faut un aide-mémoire. Cette table de vérité est notre boussole logique; elle illustre le fonctionnement de chaque connecteur. Prenons `p => q`. Si `p` est `false`, `q` peut prendre n'importe quelle valeur–un véritable joker. Mais si `p` est `true`, alors `q` *doit* obligatoirement être `true` également. Ce principe simple est le moteur de toute notre machine à déduction.

### Faits et requêtes: les entrées et les sorties

![Faits et requêtes](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qr7VSqmln95Si329hAIX4A.png)

Passons maintenant aux données d'entrée et de sortie.

Les **faits (`Facts`)** sont nos vérités de départ, représentées par des lettres majuscules. Par défaut, je définis tout à `false`: le système part d'une feuille blanche, sans aucune connaissance. Un fait ne devient `true` que si nous le déclarons comme tel au départ (`=ABC`) ou si le système parvient à le prouver lui-même grâce aux règles.

Les **requêtes (`Queries`, `?XYZ`)** sont tout simplement les questions auxquelles nous souhaitons que notre système réponde.

## Comment construire le solveur

### Chaînage avant ou arrière: choisir sa stratégie

Très bien, mais comment *résoudre* concrètement un problème? Il existe deux grandes stratégies:

1. **Le chaînage avant (forward chaining)**: On part de ce que l'on sait (les faits) et on observe où les règles nous mènent. C'est comme aborder un labyrinthe par l'entrée.
2. **Le chaînage arrière (backward chaining)**: On part de ce que l'on veut prouver (la requête) et on remonte le fil pour voir si les faits confirment l'hypothèse. C'est comme aborder un labyrinthe par la sortie pour retrouver le chemin de l'entrée.

Pour ce projet, j'ai opté pour le chaînage arrière. L'approche me semble plus intuitive, un peu comme résoudre une enquête en partant du suspect pour remonter jusqu'aux indices qui l'incriminent.

## La structure des données: l'assemblage du jeu de Lego

### La classe `Node`: le composant universel

Pour bâtir ce système, il me fallait une structure de données robuste. J'ai donc commencé par une classe générique `Node`.

```python
class Node:
  def __init__(self):
    self.children = [] # Dans A => B, => est un enfant de B 
    self.visited = False # Évite les boucles infinies lors du parcours récursif du graphe
    self.state = False # Sauvegarde si le résultat est True
```

Voyez-la comme une brique de base universelle. Elle détient un état (`true`/`false`), une trace de sa visite (pour éviter de se perdre dans des boucles infinies) et des connexions vers d'autres nœuds. Dans la règle `A => B`, par exemple, `A` est un enfant de `=>`, qui est lui-même un enfant de `B`. C'est une manière élégante de construire une chaîne logique.

### `AtomNode` et `ConnectorNode`: les outils spécialisés

À partir de cette base, j'ai créé deux types de nœuds spécialisés qui en héritent.

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
    self.operands = [] # Par exemple, dans A + B, A et B sont les opérandes de +
    self.state = None
```

`AtomNode` prend en charge nos faits (A, B, C), tandis que `ConnectorNode` gère nos opérateurs logiques (AND, XOR, OR, IMPLY). Cette séparation des rôles permet de conserver un code propre et bien organisé.

## Le solveur: apprenons-lui à penser

### Étape 1: Créer une liste unique d'atomes

Avant toute chose, j'analyse les données d'entrée pour créer une liste unique de tous les atomes. C'est une étape cruciale. Elle garantit que chaque fois que le système rencontre la lettre 'A' dans les règles, il pointe vers le *même et unique* objet `AtomNode`. C'est notre seule et unique source de vérité pour chaque fait.

### Étape 2: La magie de la Notation Polonaise Inversée (NPI)

![Représentation en NPI](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*m27ch2wzXuwq6C0FLKAlqw.png)

Place maintenant à la Notation Polonaise Inversée (NPI), ou *Reverse Polish Notation* (RPN). Si vous avez déjà utilisé une vieille calculatrice HP, le concept vous est familier. Au lieu d'écrire `A + B`, on écrit `A B +`. Aussi étrange que cela puisse paraître, pour un ordinateur, c'est une véritable révolution. L'ordre des opérations devient d'une clarté limpide, et l'analyse syntaxique (le *parsing*) est incroyablement simplifiée. On lit de gauche à droite, et à mesure que les opérandes sont utilisés, ils sont "consommés" et remplacés par le résultat. D'une efficacité redoutable.

### Étape 3: Tisser la toile logique

Mes règles étant prêtes au format NPI, il est temps de construire le réseau. Je parcours l'expression NPI et je connecte les nœuds entre eux.

```python
stack = []

for x in npi_rule:
  if x not in OPERATORS:
    stack.append(self.atoms[x])
  else:
    pop0 = stack.pop()
    pop1 = stack.pop()
    # Si l'un des éléments dépilés est le même connecteur que celui que nous allons créer (AND, OR, XOR)
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

Quand je tombe sur un atome, je l'empile sur une pile. Quand je tombe sur un opérateur, je dépile les atomes nécessaires, je les lie comme opérandes au nouveau nœud connecteur, et je rempile cette nouvelle structure. C'est ainsi que notre château de Lego logique se construit, brique par brique.

### Étape 4: Le bouquet final–la résolution des requêtes

Et maintenant, le moment de vérité. Pour résoudre une requête, j'ai mis au point une fonction récursive qui plonge au cœur du graphe logique.

```python
# Pseudocode

def resolve(nodeX):
  if nodeX is True:
    return True
  
  for child in nodeX.children:
    res = resolve(child)
    if res is True:
      # On n'a besoin que d'un seul enfant True pour déduire que le nœud actuel l'est aussi
      return True
    
  if Node is Connector: # AND, OR, XOR, IMPLY
    op_results = []
    for op in nodeX.operands:
      op_results.append(resolve(op))
    self.set_state_from_operands(op_results)
    # Exemple : pour AND, tous les éléments de op_results doivent être True
```

Elle part du nœud de la requête et remonte le fil de ses dépendances (ses enfants). Si un enfant peut être prouvé `True`, l'information est propagée vers le haut. Pour un connecteur comme `AND`, la fonction vérifie si tous ses opérandes peuvent être résolus à `True`. Pour `OR`, un seul suffit. Elle s'appuie sur la logique de notre table de vérité pour faire émerger une réponse finale. C'est un spectacle vraiment gratifiant à observer.

## Le mot de la fin: à vous de jouer

Et voilà, le tour est joué. Nous avons exploré les mécanismes fondamentaux qui animent un système expert à chaînage arrière. À partir de quelques règles simples, nous avons donné vie à un système capable de *raisonner*.

C'est un concept d'une grande puissance, et nous n'avons fait qu'en effleurer la surface. Ce que nous avons bâti est une fondation solide. Si l'envie vous prend d'aller plus loin, vous pourriez implémenter le chaînage avant ou intégrer des logiques plus complexes. Les possibilités sont immenses.

Pour tous ceux qui souhaitent mettre les mains dans le cambouis, j'ai rendu le projet Python complet disponible sur [mon GitHub](https://github.com/jterrazz/42-expert-system). N'hésitez pas à y jeter un œil, à jouer avec, à le pousser dans ses retranchements et, bien sûr, à l'améliorer.

Bon code! 🚀🧠
