![](assets/thumbnail.jpg)

# Séparer le métier de la technologie

## Structurer votre code

Alors, comment organisez-vous un projet ? C'est l'une des questions les plus fondamentales auxquelles nous faisons face en tant que développeurs. Réussissez-le, et votre application peut grandir et s'adapter pendant des années. Ratez-le, et vous signez pour un monde de douleur.

Dans ce chapitre, je vais vous guider à travers l'évolution de la façon dont nous structurons le code. Nous commencerons avec les approches classiques, verrons où elles échouent, et ensuite nous plongerons dans une bien meilleure façon de penser : l'**architecture hexagonale**. C'est un changement radical pour isoler ce que votre application *fait* de la technologie qu'elle *utilise*.

---

# Le point de départ : architectures communes

## Architecture spaghetti : l'architecture "sans architecture"

Nous l'avons tous vue. Certains d'entre nous l'ont même écrite. L'architecture spaghetti est ce qui arrive quand il n'y a pas de règles. Logique métier, appels base de données, et code UI, tout est jeté dans un seul désordre emmêlé.

**Le résultat ?**

- Le code est impossible à lire.
- Les tests sont un cauchemar.
- Chaque changement risque de casser le système entier.

C'est le résultat naturel d'aller vite sans plan. C'est le chaos.

---

## Architecture en couches : un pas dans la bonne direction

Pour combattre le chaos, nous avons inventé l'**architecture en couches**. C'est sans doute le pattern le plus commun, et pour une bonne raison : c'est simple et cela fait sens intuitivement. Vous divisez votre appli en couches distinctes, chacune avec un job clair.

### Les couches habituelles

1. **Couche Présentation** : L'UI ou l'API avec laquelle l'utilisateur interagit.
2. **Couche Application** : Orchestre les workflows. Elle ne contient pas la logique métier elle-même mais dit à la couche domaine quoi faire.
3. **Couche Domaine** : Le cœur de l'application. C'est là que vivent toutes les règles métier centrales.
4. **Couche Persistance** : Gère tout ce qui touche à la base de données.

### La règle d'or : ne parlez qu'à la couche en dessous de vous

La couche Présentation parle à la couche Application, qui parle au Domaine, qui parle à la Persistance. Simple. Cette structure suit proprement le Principe de Responsabilité Unique (le **S** dans **SOLID**), car chaque couche a un but clair.

---

## Le gros problème avec l'architecture en couches

En surface, ça a l'air propre. Mais il y a un défaut fatal.

- **La règle de dépendance est un piège** : Les couches dépendent directement des couches en dessous d'elles. Cela signifie que votre logique métier (Domaine) finit par dépendre de détails techniques (Persistance). Vos règles centrales sont maintenant enchaînées à votre base de données.
- **Focus technique, pas métier** : Le code est groupé par *ce qu'il est* (UI, code base de données) plutôt que par *ce qu'il fait* pour le métier.

Ce couplage entre la logique métier et la base de données est là où tout commence à mal tourner. Cela rend les tests plus difficiles et changer votre base de données devient un projet massif et douloureux.

---

# Le vrai but : libérer votre logique métier

Pour moi, c'est le but numéro un de toute bonne architecture : **isoler votre logique métier de tout le reste.** Vos règles métier sont la raison même pour laquelle le logiciel existe. Elles devraient être indépendantes de l'UI, de la base de données, des frameworks, de tout ça.

**Pourquoi est-ce si important ?**

1. **Les choses changent** : Vos règles métier évoluent lentement. Mais la technologie ? Ça change tout le temps. Vous pourriez passer d'une API REST à GraphQL, ou de Postgres à une base NoSQL. Votre logique centrale ne devrait pas avoir à changer quand votre stack technique change.
2. **Tests faciles** : Quand votre logique métier est pure et n'a aucun lien avec une base de données ou un serveur web, vous pouvez la tester avec des tests unitaires simples et rapides comme l'éclair.
3. **Flexibilité** : En gardant le cœur propre, vous pouvez échanger des composants techniques aux extrémités sans casser le cœur de votre application.

La stratégie est simple : **Mettez votre logique métier au centre et repoussez tous les trucs techniques vers l'extérieur.**

---

# La solution : architecture hexagonale (ports & adaptateurs)

C'est là que l'**architecture hexagonale** entre en jeu. Alistair Cockburn a conçu cette idée en 2005, et c'est brillant. C'est un design qui met votre **logique métier** juste au centre et construit une barrière protectrice autour d'elle.

## Ce qu'elle vise à faire

1. **Isoler le cœur** : Votre domaine est complètement indépendant. Il ne connaît pas votre framework web ou votre base de données.
2. **Rendre les tests faciles** : Puisque le cœur est isolé, tester vos règles métier devient trivial.
3. **Pérenniser votre appli** : Vous voulez ajouter une nouvelle façon d'interagir avec votre appli, comme une interface en ligne de commande ? Ajoutez juste un nouvel "adaptateur". La logique centrale ne change pas.
4. **Points d'entrée et de sortie clairs** : Toute communication avec le monde extérieur se passe à travers des "ports" et "adaptateurs" bien définis.

> ℹ️ **Pourquoi un hexagone ?** Alistair Cockburn a juste choisi la forme parce qu'elle avait assez de côtés pour représenter différents types de connexions (UI, base de données, autres APIs, etc.). Ne bloquez pas sur la forme. Le nom **"ports & adaptateurs"** est en fait plus descriptif.

![](assets/hexagonal-architecture.jpg)

L'hexagone représente visuellement votre logique métier au centre, protégée du monde extérieur désordonné par une couche de ports et d'adaptateurs. Tout est question de **modularité** et de **neutralité technologique**.

> **ℹ️ Qu'y a-t-il dans un nom ?**
> Les gens utilisent différents termes pour les deux côtés de l'hexagone :
> 1. Gauche/Droite (Left/Right)
> 2. Pilotant/Piloté (Driving/Driven)
> 3. Primaire/Secondaire (Primary/Secondary)
> 4. Côté Utilisateur/Côté Serveur (User Side/Server Side)
>
> Honnêtement, les noms importent moins que le concept. Choisissez-en un et soyez cohérent. J'aime personnellement **pilotant/piloté (driving/driven)** parce que cela sépare clairement ce qui *initie une action* de ce qui *remplit une requête*.

---

# Le cœur de votre application est son "moteur de règles"

Voici un point critique : **l'architecture hexagonale est utile seulement si vous avez réellement de la logique métier à protéger.**

Si votre appli est juste un service CRUD simple qui déplace des données d'une base de données vers une réponse JSON sans aucune règle réelle ou transformation, c'est exagéré (overkill). Un modèle en couches simple est probablement suffisant.

Mais si votre application contient de vraies règles métier, la logique qui fait gagner de l'argent à votre entreprise ou applique des contraintes critiques, alors ces règles sont précieuses. Elles doivent être au centre. **Sans règles métier, l'hexagone est vide.**

---

# Un exemple complet : pilotant vs piloté

Rendons cela concret. Imaginez que nous construisons un système de traitement de commandes.

- **Côté Pilotant (Gauche)** : C'est ce qui déclenche une action. Un utilisateur soumettant une commande via un formulaire web est un acteur pilotant.
- **Côté Piloté (Droite)** : C'est l'infrastructure que l'application utilise. La base de données où la commande est sauvegardée est un acteur piloté.

---

## **1. Le domaine (la logique métier pure)**

Au centre, nous avons nos règles métier, complètement indépendantes de toute technologie. Le domaine définit des "ports", qui sont des interfaces décrivant ce dont il a besoin du monde autour de lui.

```ts
// C'est une interface pour quelque chose qui va *piloter* notre application.
export interface OrderInputPort {
   processOrder(order: Order): void; // Un port "pilotant" côté gauche
}

// C'est une interface pour un service par lequel notre application sera *pilotée*.
export interface OrderOutputPort {
   saveOrder(order: Order): void; // Un port "piloté" côté droit
}

// C'est notre logique métier centrale.
export class OrderService implements OrderInputPort {
   // Il dépend d'une *abstraction* (le port), pas d'une base de données concrète.
   constructor(private outputPort: OrderOutputPort) {}

   processOrder(order: Order): void {
      if (!order.isValid()) {
         throw new Error("Order is invalid");
      }

      console.log("Processing order:", order);
      // Il appelle le port de sortie pour faire le job.
      this.outputPort.saveOrder(order);
   }
}
```

**Que se passe-t-il ici ?**

- `OrderInputPort` est le point d'entrée pour les commandes.
- `OrderOutputPort` est le point de sortie pour les choses dont l'appli a besoin du monde extérieur (comme sauvegarder des données).
- `OrderService` est de la logique métier pure. Il ne connaît pas les bases de données ou les APIs. Il sait juste qu'il a besoin de sauvegarder une commande via un port.

---

## **2. L'adaptateur pilotant (le contrôleur API)**

C'est le code qui traduit une requête entrante (du web, d'une CLI, etc.) en un appel sur le port d'entrée de notre application.

```ts
import express from "express";

// C'est un "adaptateur" qui connecte le monde extérieur (HTTP) à notre application.
export class OrderController {
   constructor(private orderInputPort: OrderInputPort) {}

   handleRequest(req: express.Request, res: express.Response): void {
      const order = req.body;

      try {
         // Le seul job du contrôleur est de traduire et déléguer.
         this.orderInputPort.processOrder(order); // Il appelle le domaine via le port.
         res.status(200).send("Order processed successfully!");
      } catch (err) {
         res.status(400).send(err.message);
      }
   }
}
```

Ce contrôleur est merveilleusement bête. Il connaît HTTP, mais il ne connaît rien aux règles métier. Il passe juste la requête.

---

## **3. L'adaptateur piloté (la base de données)**

C'est l'implémentation concrète de notre port de sortie. C'est là que vivent les détails techniques.

```ts
// Cet adaptateur implémente notre port de sortie avec une technologie spécifique (ex: une DB).
export class DatabaseAdapter implements OrderOutputPort {
   saveOrder(order: Order): void {
      // Ici vous auriez votre logique de base de données réelle.
      console.log("Saving order to database:", order);
   }
}
```

Cette classe concerne uniquement la base de données. Elle ne sait rien des règles métier qui ont mené à la sauvegarde de la commande.

---

## **4. Tout connecter ensemble**

Enfin, quelque part tout au bord de notre application (comme `index.ts`), nous câblons tout.

```ts
import express from "express";

// 1. Créer les adaptateurs concrets.
const databaseAdapter = new DatabaseAdapter(); // Côté Piloté

// 2. Créer le service de domaine, en injectant l'adaptateur.
const orderService = new OrderService(databaseAdapter);

// 3. Créer l'adaptateur pilotant, en injectant le service de domaine.
const orderController = new OrderController(orderService); // Côté Pilotant

// 4. Configurer le serveur web.
const app = express();
app.use(express.json());

app.post("/orders", (req, res) => orderController.handleRequest(req, res));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

C'est le seul endroit où la logique de domaine et les détails techniques se rencontrent. Les dépendances sont "injectées" de l'extérieur vers l'intérieur, protégeant le cœur.

---

## L'impact sur les tests est énorme

Cette structure fait des tests un rêve :

- **Tester le Contrôleur** : Donnez-lui un mock `OrderInputPort` et vérifiez s'il appelle `processOrder` correctement. Pas besoin de serveur web.
- **Tester la Logique Métier** : Donnez-lui un mock `OrderOutputPort` et testez toutes vos règles métier en complète isolation. Ces tests sont super rapides.
- **Tester l'Adaptateur Base de Données** : Testez-le tout seul pour vous assurer qu'il peut réellement sauvegarder dans la base de données.

Chaque pièce peut être testée indépendamment. Plus de tests de bout en bout fragiles qui échouent pour des raisons aléatoires.

---

> **Le conseil d'Alistair Cockburn de 2023 : nommer avec intention**
> Alistair a récemment donné un excellent conseil sur comment nommer vos ports pour rendre leur but évident. Il suggère le format : **"For + Verbe-ing + But"** (Pour + Verbe + But).
>
> **Exemple :**
>
> - **Port Pilotant :** `ForProcessingOrders` (PourTraiterCommandes)
> - **Port Piloté :** `ForSavingOrders` (PourSauvegarderCommandes)
>
> J'adore ça parce que cela rend le code auto-documenté. Vous savez immédiatement à quoi sert chaque interface. C'est un petit changement, mais cela ajoute une tonne de clarté.

---

L'architecture hexagonale est une avancée massive par rapport aux simples couches. Elle vous force à mettre votre logique métier en premier et à traiter la technologie comme un détail. En isolant le domaine central, vous construisez des systèmes qui sont plus testables, flexibles et résilients au changement technologique. C'est un pattern puissant pour créer des logiciels qui durent.

---

### Lire la suite de cette série

1. [Conception d'application : construire des logiciels qui durent](https://www.jterrazz.com/articles/9-software-design-0-why-architecture-matters)
2. [Conception d'application : maîtriser le flux des dépendances](https://www.jterrazz.com/articles/10-software-design-1-mastering-dependencies)
3. **Conception d'application : séparer le métier de la technologie**
4. [Conception d'application : un voyage dans la clean architecture](https://www.jterrazz.com/articles/12-software-design-3-clean-architecture-in-practice)

