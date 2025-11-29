![](assets/thumbnail.jpg)

# Mon voyage dans les systèmes experts avec Python

J'ai toujours été fasciné par notre façon de raisonner. Comment relions-nous les points, suivons-nous une piste logique et assemblons-nous un puzzle ? Il s'avère que nous pouvons apprendre aux ordinateurs à faire quelque chose de remarquablement similaire. C'est là que les **systèmes experts** entrent en jeu.

Ce sont essentiellement de petits cerveaux d'IA que nous pouvons construire pour résoudre des problèmes complexes, du diagnostic de maladies à la gestion des finances. Ce sont les travailleurs de l'ombre derrière d'innombrables applications d'IA, faisant tranquillement leur travail.

Dans cet article, je vais lever le voile et vous montrer comment j'en ai construit un de zéro en utilisant Python. Pas de magie, juste de la logique. À la fin, vous aurez ce qu'il faut pour construire le vôtre. 🧠💻

## Alors, qu'est-ce qu'un système expert exactement ?

Voyez-le comme un Sherlock Holmes numérique. Il prend une collection de **faits et de règles** et les utilise pour déduire des réponses. C'est une machine à déduction, parfaite quand vous devez prouver une hypothèse ou prendre une décision difficile. Pour moi, c'est une pièce fondamentale de tout le puzzle de l'IA.

![Composants d'un Système Expert](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OQEJ09LSoMy5favPdGmRtQ.png)

## Les briques de construction de mon système

### Règles : les briques Lego logiques

![Visualisation des Règles](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3618kjRpRPZ8yUwjTEa9SA.png)

Le cœur de tout cela est un ensemble de **règles**. J'aime les voir comme des briques Lego logiques. Nous pouvons les emboîter pour construire des lignes de raisonnement assez complexes. Ces règles sont juste de simples équations qui lient des `faits` (que nous représenterons par des lettres majuscules) en utilisant quelques `connecteurs` clés :

- `&` : **ET**–Le connecteur sans détour. Tous les faits connectés doivent être `Vrai` (True). Pas d'exceptions.
- `|` : **OU**–Super cool. Juste un des faits a besoin d'être `Vrai`.
- `^` : **XOR** (OU exclusif)–Le difficile. Un fait doit être `Vrai`, mais pas les deux.
- `=>` : **IMPLIQUE**–Le classique "si-alors". Si le côté gauche est `Vrai`, le côté droit doit être `Vrai` aussi.

### La table de vérité d'inférence : notre antisèche logique

![Table de Vérité d'Inférence](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZ-xKiHeAcPBCnP2bgcOTQ.png)

Pour donner du sens à tout ça, nous avons besoin d'une antisèche. Cette table de vérité est notre boussole pour la logique. Elle montre comment les connecteurs fonctionnent. Regardez `p => q`. Si `p` est `faux`, `q` peut être n'importe quoi, un vrai joker. Mais si `p` est `vrai`, `q` *doit* aussi être `vrai`. Ce principe simple est le moteur de notre déduction.

### Faits et requêtes : les entrées et sorties

![Faits et Requêtes](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*qr7VSqmln95Si329hAIX4A.png)

Maintenant, pour les entrées et les sorties.

Les **Faits** sont nos vérités de départ, représentées par des lettres majuscules. Par défaut, je mets tout à `faux`, le système commence sans rien savoir. Un fait devient `vrai` seulement si nous le déclarons comme un fait initial (`=ABC`) ou si le système le prouve en utilisant les règles.

Les **Requêtes** (`?XYZ`) sont simplement les questions auxquelles nous voulons que notre système réponde.

## Comment construire le résolveur

### Chaînage avant vs arrière : choisissez votre voie

Ok, alors comment on *résout* vraiment quelque chose ? Il y a deux façons principales de procéder :

1. **Chaînage avant (Forward chaining)** : Commencez avec ce que vous savez (les faits) et voyez où les règles vous mènent. C'est comme commencer un labyrinthe par le début.
2. **Chaînage arrière (Backward chaining)** : Commencez avec ce que vous voulez prouver (la requête) et travaillez à rebours pour voir si les faits le soutiennent. C'est comme commencer un labyrinthe par la fin et trouver votre chemin vers le retour.

Pour ce projet, j'ai choisi le chaînage arrière. Cela me semble plus intuitif, comme résoudre un mystère en commençant par le suspect et en cherchant des indices.

## La structure de données : assembler le set Lego

### La classe Node : le composant universel

Pour construire ceci, j'avais besoin d'une structure de données solide. J'ai commencé avec une classe `Node` générique.

```python
class Node:
    def __init__(self):
        self.children = []     # Dans A => B, => est enfant de B
        self.visited = False   # Lors du parcours récursif du Graphe, évite la boucle infinie
        self.state = False     # Sauvegarde si le résultat est True
```

Voyez-le comme la brique de construction universelle. Elle contient un état (`vrai`/`faux`), suit si nous l'avons visitée (pour éviter de rester coincé dans des boucles infinies), et se connecte à d'autres nœuds. Dans une règle comme `A => B`, par exemple, `A` devient un enfant du nœud `=>`, qui est lui-même un enfant du nœud `B`. C'est une manière simple mais efficace de cartographier une chaîne logique.

### AtomNode et ConnectorNode : outils spécialisés

De là, j'ai créé deux nœuds spécialisés qui héritent de la classe de base.

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
        self.operands = []     # Par exemple, dans A + B, A et B sont opérandes de +
        self.state = None
```

`AtomNode` gère nos faits (A, B, C), et `ConnectorNode` gère nos opérateurs logiques (AND, XOR, OR, IMPLY). Cette approche garde le code propre et organisé.

## Le résolveur : le faire penser

### Étape 1 : créer une liste unique d'atomes

Première chose, je parse l'entrée et je crée une liste unique de tous les atomes uniques. C'est la clé. Cela assure que chaque fois que le système voit la lettre 'A' dans les règles, elle pointe vers le *même objet* `AtomNode`. C'est notre source unique de vérité pour chaque fait.

### Étape 2 : la magie de la NPI

![Représentation NPI](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*m27ch2wzXuwq6C0FLKAlqw.png)

Ensuite, la Notation Polonaise Inverse (NPI, ou RPN en anglais). Si vous avez déjà utilisé une vieille calculatrice HP, vous savez ce que c'est. Au lieu d'écrire `A + B`, vous écrivez `A B +`. Ça semble bizarre, mais pour un ordinateur, ça change la donne. Cela rend l'ordre des opérations parfaitement clair et simplifie énormément le parsing. Nous lisons juste de gauche à droite, et au fur et à mesure que nous utilisons des opérandes, ils sont consommés et remplacés par le résultat. Super efficace.

### Étape 3 : relier les points

Avec nos règles NPI prêtes, il est temps de construire le réseau. Je boucle à travers l'expression NPI et je connecte les nœuds.

```python
stack = []

for x in npi_rule:
    if x not in OPERATORS:
        stack.append(self.atoms[x])
    else:
        pop0 = stack.pop()
        pop1 = stack.pop()
        # Si un des éléments dépilés est le même connecteur que nous allons créer (AND, OR, XOR)
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

Quand je tombe sur un atome, je le pousse sur une pile. Quand je tombe sur un opérateur, je dépile les atomes dont il a besoin, je les lie comme opérandes au nouveau nœud connecteur, et je pousse toute la nouvelle structure sur la pile. C'est comme ça que le château Lego logique se construit, pièce par pièce.

### Étape 4 : le grand final, résoudre les requêtes

Et maintenant, le moment de vérité. Pour résoudre une requête, j'ai construit une fonction récursive qui plonge dans le graphe logique.

```python
# Pseudocode

def resolve(nodeX):
    if nodeX is True:
        return True

    for child in nodeX.children:
        res = resolve(child)
        if res is True:
            # Besoin que d'un seul enfant soit Vrai pour déduire que le courant est Vrai
            return True

    if Node is Connector:  # AND OR XOR IMPLY
        op_results = []
        for op in nodeX.operands:
            op_results.append(resolve(op))
        self.set_state_from_operands(op_results)
        # Exemple : pour un nœud AND, tous les éléments dans op_results doivent être Vrai
```

Cela commence au nœud de la requête et travaille à rebours à travers ses enfants. Si un enfant peut être prouvé `Vrai`, il le signale en remontant. Pour un nœud connecteur comme `AND`, il vérifie si tous ses opérandes peuvent être résolus à `Vrai`. Pour `OR`, il en a juste besoin d'un. La fonction utilise la logique de la table de vérité que nous avons vue plus tôt pour faire remonter une réponse finale jusqu'au sommet. C'est vraiment satisfaisant de le voir fonctionner.

## Dernières pensées : à vous de construire

Et c'est à peu près tout ! Nous avons parcouru la logique centrale de la construction d'un système expert à chaînage arrière. À partir de règles simples, nous avons créé un système qui peut réellement *raisonner*.

C'est un concept puissant, et nous n'avons fait qu'effleurer la surface. Ce que nous avons construit est une fondation. Si vous voulez aller plus loin, vous pourriez essayer d'implémenter le chaînage avant ou d'ajouter le support pour une logique plus complexe. Les possibilités sont énormes.

Pour quiconque veut mettre les mains dans le code, j'ai mis le projet Python complet sur [mon GitHub](https://github.com/jterrazz/42-expert-system). Allez voir, jouez avec, cassez-le, et construisez par-dessus.

Bon code ! 🚀🧠

