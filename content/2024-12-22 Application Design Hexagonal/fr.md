![](assets/thumbnail.jpg)

# Conception applicative: séparer le métier de la technique

## Structurer son code

Comment organiser concrètement un projet? C'est l'une des questions les plus fondamentales qui soient. Une bonne réponse, et votre application pourra évoluer et s'adapter pendant des années. Une mauvaise, et vous vous condamnez à un véritable calvaire.

Dans cet article, je vous propose d'explorer l'évolution de nos approches en matière de structuration du code. Nous commencerons par les modèles classiques, identifierons leurs limites, pour ensuite plonger dans une manière de penser bien plus puissante: **l'architecture hexagonale**. C'est une approche qui change radicalement la donne, en isolant ce que votre application *fait* de la technologie qu'elle *utilise*.

---

# Le point de départ: les architectures courantes

## L'architecture spaghetti: l'absence d'architecture

Nous l'avons tous vue. Certains d'entre nous l'ont même écrite. L'architecture spaghetti est le résultat de l'absence totale de règles. Logique métier, appels à la base de données, code de l'interface utilisateur—tout est jeté dans un imbroglio inextricable.

**Le résultat?**

- Le code est impossible à lire.
- Les tests sont un cauchemar.
- Chaque modification risque de faire s'effondrer l'ensemble du système.

C'est la conséquence naturelle d'un développement mené à la hâte, sans plan. C'est le chaos.

---

## L'architecture en couches: un premier pas dans la bonne direction

Pour combattre ce chaos, nous avons inventé **l'architecture en couches** (*layered architecture*). C'est probablement le modèle le plus répandu, car il est simple et intuitif. L'idée est de diviser l'application en couches distinctes, chacune ayant une mission claire.

### Les couches habituelles

1. **Couche de présentation**: L'interface utilisateur ou l'API avec laquelle l'utilisateur interagit.
2. **Couche applicative**: Elle orchestre les flux de travail. Elle ne contient pas de logique métier en elle-même, mais indique à la couche domaine quoi faire.
3. **Couche domaine**: Le cœur de l'application. C'est ici que résident toutes les règles métier essentielles.
4. **Couche de persistance**: Elle gère tout ce qui touche à la base de données.

### La règle d'or: une couche communique uniquement avec celle du dessous

La couche de présentation parle à la couche applicative, qui parle au domaine, qui parle à la persistance. Simple. Cela impose le principe de responsabilité unique (le **S** de **SOLID**), car chaque couche a un seul objectif clair.

---

## Le problème fondamental de l'architecture en couches

À première vue, tout semble propre. Mais une faille fatale se cache sous la surface.

- **La règle des dépendances est un piège**: Les couches dépendent directement de celles qui se trouvent en dessous. Cela signifie que votre logique métier (le domaine) finit par dépendre de détails techniques (la persistance). Vos règles fondamentales sont maintenant menottées à votre base de données.
- **Une vision technique, pas métier**: Le code est regroupé par *ce qu'il est* (UI, code de base de données) plutôt que par *ce qu'il fait* pour le métier.

Ce couplage entre la logique métier et la base de données est la racine du mal. Il complexifie les tests et transforme le moindre changement de base de données en un chantier titanesque et douloureux.

---

# Le véritable objectif: libérer votre logique métier

Pour moi, c'est la mission numéro un de toute bonne architecture: **isoler votre logique métier de tout le reste.** Vos règles métier sont la raison d'être du logiciel, son âme. Elles doivent être indépendantes de l'interface utilisateur, de la base de données, des frameworks—de tout.

**Pourquoi est-ce si crucial?**

1. **Le changement est une constante**: Vos règles métier évoluent lentement. La technologie, elle, change en permanence. Vous pourriez passer d'une API REST à GraphQL, ou de Postgres à une base de données NoSQL. Votre logique fondamentale ne devrait pas avoir à changer au gré des modes technologiques.
2. **Des tests d'une simplicité déconcertante**: Quand votre logique métier est pure, découplée de toute base de données ou serveur web, vous pouvez la valider avec des tests unitaires simples et ultra-rapides.
3. **Une flexibilité à toute épreuve**: En gardant le cœur intact, vous pouvez remplacer les composants techniques en périphérie sans jamais risquer de briser ce qui fait la valeur de votre application.

La stratégie est simple: **placez votre logique métier au centre et poussez tout ce qui est technique en périphérie.**

---

# La solution: l'architecture hexagonale (Ports & Adapters)

C'est ici qu'intervient **l'architecture hexagonale**. Alistair Cockburn a eu cette idée brillante en 2005. Il s'agit d'une conception qui place votre **logique métier** au cœur même de l'application et érige une barrière protectrice tout autour.

## Ses objectifs

1. **Isoler le cœur**: Votre domaine est complètement indépendant. Il ne sait rien de votre framework web ou de votre base de données.
2. **Rendre les tests simples comme bonjour**: Le cœur étant isolé, tester vos règles métier devient trivial.
3. **Pérenniser votre application**: Vous voulez ajouter une nouvelle façon d'interagir avec votre application, comme une interface en ligne de commande? Il suffit d'ajouter un nouvel "adaptateur". La logique centrale, elle, ne bouge pas.
4. **Des points d'entrée et de sortie clairs**: Toute communication avec le monde extérieur passe par des "ports" et des "adaptateurs" bien définis.

> ℹ️ **Pourquoi un hexagone?** Alistair Cockburn a simplement choisi cette forme car elle avait assez de côtés pour représenter différents types de connexions (UI, base de données, autres API, etc.). Ne vous focalisez pas sur la forme. Le nom **"Ports & Adapters"** est en réalité bien plus descriptif.

![](assets/hexagonal-architecture.jpg)

L'hexagone illustre parfaitement cette idée: votre logique métier au centre, protégée du monde extérieur tumultueux par une couche de ports et d'adaptateurs. Tout est une question de **modularité** et de **neutralité technologique**.

> **ℹ️ Une question de nom**
> On utilise différents termes pour désigner les deux côtés de l'hexagone:
> 1. Gauche/Droite
> 2. Pilotant/Piloté (*Driving/Driven*)
> 3. Primaire/Secondaire
> 4. Côté utilisateur/Côté serveur
>
> Honnêtement, les noms importent moins que le concept. Choisissez une terminologie et tenez-vous-y. Personnellement, j'aime **Pilotant/Piloté** (*Driving/Driven*), car cette distinction sépare clairement ce qui *est à l'origine* d'une action de ce qui *y répond*.

---

# Le cœur de votre application est son " moteur de règles "

Voici un point essentiel: **l'architecture hexagonale n'est utile que si vous avez réellement une logique métier à protéger.**

Si votre application se résume à un simple service CRUD qui déplace des données d'une base de données vers une réponse JSON, sans véritables règles ou transformations, alors cette approche est une complexité superflue. Un simple modèle en couches fera amplement l'affaire.

Mais si votre application contient de vraies règles métier—la logique qui fait gagner de l'argent à votre entreprise ou qui applique des contraintes critiques—alors ces règles sont un trésor. Elles doivent être au centre. **Sans règles métier, l'hexagone n'est qu'une coquille vide.**

---

# Un exemple complet: pilotant vs. piloté

Rendons cela concret. Imaginons que nous construisons un système de traitement de commandes.

- **Côté pilotant (gauche)**: C'est ce qui déclenche une action. Un utilisateur qui soumet une commande via un formulaire web est un acteur pilotant.
- **Côté piloté (droite)**: C'est l'infrastructure que l'application utilise. La base de données où la commande est sauvegardée est un acteur piloté.

---

## **1. Le domaine (la logique métier pure)**

Au centre, nous avons nos règles métier, complètement indépendantes de toute technologie. Le domaine définit des "ports", qui sont des interfaces décrivant ce dont il a besoin du monde extérieur pour fonctionner.

```ts
// Ceci est une interface pour quelque chose qui va *piloter* notre application.
export interface OrderInputPort {
   processOrder(order: Order): void; // Un port "pilotant" (côté gauche)
}

// Ceci est une interface pour un service que notre application va *utiliser*.
export interface OrderOutputPort {
   saveOrder(order: Order): void; // Un port "piloté" (côté droit)
}

// Voici notre logique métier centrale.
export class OrderService implements OrderInputPort {
   // Elle dépend d'une *abstraction* (le port), et non d'une base de données concrète.
   constructor(private outputPort: OrderOutputPort) {}

   processOrder(order: Order): void {
      if (!order.isValid()) {
         throw new Error("Order is invalid");
      }

      console.log("Processing order:", order);
      // Elle appelle le port de sortie pour accomplir sa tâche.
      this.outputPort.saveOrder(order);
   }
}
```

**Que se passe-t-il ici?**

- `OrderInputPort` est le point d'entrée pour les commandes.
- `OrderOutputPort` est le point de sortie pour les services dont l'application a besoin (comme la sauvegarde de données).
- `OrderService` est de la logique métier pure. Il ne connaît ni les bases de données, ni les API. Il sait juste qu'il doit sauvegarder une commande en passant par un port.

---

## **2. L'adaptateur pilotant (le contrôleur d'API)**

C'est le code qui traduit une requête entrante (venant du web, d'un CLI, etc.) en un appel sur le port d'entrée de notre application.

```ts
import express from "express";

// Cet "adaptateur" connecte le monde extérieur (HTTP) à notre application.
export class OrderController {
   constructor(private orderInputPort: OrderInputPort) {}

   handleRequest(req: express.Request, res: express.Response): void {
      const order = req.body;

      try {
         // Son unique rôle est de traduire la requête et de la déléguer.
         this.orderInputPort.processOrder(order); // Il appelle le domaine via le port.
         res.status(200).send("Order processed successfully!");
      } catch (err) {
         res.status(400).send(err.message);
      }
   }
}
```

Ce contrôleur est volontairement simple. Il connaît le protocole HTTP, mais il ignore tout des règles métier. Son seul travail est de faire le traducteur.

---

## **3. L'adaptateur piloté (la base de données)**

C'est l'implémentation concrète de notre port de sortie. C'est ici que vivent les détails techniques.

```ts
// Cet adaptateur implémente notre port de sortie avec une technologie spécifique (ex: une base de données).
export class DatabaseAdapter implements OrderOutputPort {
   saveOrder(order: Order): void {
      // Ici, vous auriez votre logique de base de données réelle.
      console.log("Saving order to database:", order);
   }
}
```

Cette classe est entièrement dédiée à la base de données. Elle ignore tout des règles métier qui ont mené à cette sauvegarde.

---

## **4. Assembler les pièces du puzzle**

Enfin, quelque part à l'extrémité de notre application (typiquement dans `index.ts`), nous connectons tous les éléments.

```ts
import express from "express";

// 1. Créer les adaptateurs concrets.
const databaseAdapter = new DatabaseAdapter(); // Côté Piloté

// 2. Créer le service du domaine, en lui injectant l'adaptateur.
const orderService = new OrderService(databaseAdapter);

// 3. Créer l'adaptateur pilotant, en lui injectant le service du domaine.
const orderController = new OrderController(orderService); // Côté Pilotant

// 4. Configurer le serveur web.
const app = express();
app.use(express.json());

app.post("/orders", (req, res) => orderController.handleRequest(req, res));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

C'est l'unique point de contact entre la logique du domaine et les détails techniques. Les dépendances sont "injectées" de l'extérieur vers l'intérieur, protégeant ainsi le cœur de l'application.

---

## L'impact sur les tests est immense

Cette structure transforme les tests en un véritable plaisir:

- **Tester le contrôleur**: Fournissez-lui un mock de `OrderInputPort` et vérifiez qu'il appelle `processOrder` correctement. Pas besoin de démarrer un serveur web.
- **Tester la logique métier**: Fournissez-lui un mock de `OrderOutputPort` et testez toutes vos règles métier en isolation complète. Ces tests sont d'une rapidité foudroyante.
- **Tester l'adaptateur de base de données**: Testez-le de manière autonome pour vous assurer qu'il peut réellement sauvegarder des données dans la base.

Chaque pièce du puzzle peut être testée indépendamment. Fini les tests de bout en bout fragiles qui échouent pour des raisons obscures.

---

> **Conseil d'Alistair Cockburn (2023): nommer avec intention**
> Alistair a récemment partagé un excellent conseil pour nommer les ports de manière à rendre leur objectif limpide. Il suggère d'adopter en anglais le format: **"For + Verbe-ing + Objectif"**.
>
> **Exemple:**
>
> - **Port pilotant:** `ForProcessingOrders`
> - **Port piloté:** `ForSavingOrders`
>
> J'adore cette approche, car elle rend le code auto-documenté. On sait immédiatement à quoi sert chaque interface. C'est un petit changement qui apporte une clarté considérable.

---

L'architecture hexagonale représente une avancée majeure par rapport à la simple architecture en couches. Elle vous force à placer votre logique métier au premier plan et à traiter la technologie comme un simple détail d'implémentation. En isolant le cœur du domaine, vous construisez des systèmes plus testables, plus flexibles et plus résilients face aux changements technologiques. C'est un modèle puissant pour créer des logiciels qui durent.

---

### Lire la suite dans cette série

1.  [Conception applicative: bâtir des logiciels conçus pour durer](https://www.jterrazz.com/articles/9-software-design-0-why-architecture-matters/fr)
2.  [Conception applicative: maîtriser le flux des dépendances](https://www.jterrazz.com/articles/10-software-design-1-mastering-dependencies/fr)
3.  **Conception applicative: séparer le métier de la technique**
4.  [Conception applicative: un voyage au cœur de la clean architecture](https://www.jterrazz.com/articles/12-software-design-3-clean-architecture-in-practice/fr)
