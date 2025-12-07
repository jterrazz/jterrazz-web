![](assets/thumbnail.jpg)

# Séparer le métier de la technologie

## Structurer votre code

Alors, comment organise-t-on un projet ? C'est l'une des questions les plus fondamentales que nous affrontons en tant que développeurs. Faites-le bien, et votre application pourra grandir et s'adapter pendant des années. Faites-le mal, et vous vous engagez dans un monde de souffrances.

Dans ce chapitre, je vais vous guider à travers l'évolution de la façon dont nous structurons le code. Nous commencerons par les approches classiques, verrons où elles échouent, puis plongerons dans une bien meilleure façon de penser : **l'architecture hexagonale**. C'est un changement radical pour isoler ce que votre application *fait* de la technologie qu'elle *utilise*.

---

# Le point de départ : les architectures classiques

## L'architecture spaghetti : l'architecture "sans architecture"

On l'a tous vue. Certains d'entre nous l'ont même écrite. L'architecture spaghetti, c'est ce qui arrive quand il n'y a pas de règles. Logique métier, appels à la base de données et code d'interface utilisateur — tout est jeté dans un seul amas emmêlé.

**Le résultat ?**

- Le code est impossible à lire.
- Les tests sont un cauchemar.
- Chaque modification risque de casser le système entier.

C'est l'issue naturelle quand on avance vite sans plan. C'est le chaos.

---

## L'architecture en couches : un pas dans la bonne direction

Pour combattre le chaos, nous avons inventé **l'architecture en couches**. C'est sans doute le pattern le plus répandu, et pour de bonnes raisons : il est simple et intuitivement logique. Vous divisez votre application en couches distinctes, chacune avec une mission claire.

### Les couches habituelles

1. **Couche Présentation** : L'interface utilisateur ou l'API avec laquelle l'utilisateur interagit.
2. **Couche Application** : Orchestre les workflows. Elle ne contient pas de logique métier mais indique à la couche domaine quoi faire.
3. **Couche Domaine** : Le cœur de l'application. C'est là que vivent toutes les règles métier centrales.
4. **Couche Persistance** : Gère tout ce qui touche à la base de données.

### La règle d'or : ne parler qu'à la couche du dessous

La couche Présentation parle à la couche Application, qui parle au Domaine, qui parle à la Persistance. Simple. Cette structure suit élégamment le principe de responsabilité unique (le **S** de **SOLID**), car chaque couche a un but clair.

---

## Le gros problème de l'architecture en couches

En surface, ça a l'air propre. Mais il y a un défaut fatal.

- **La règle de dépendance est un piège** : Les couches dépendent directement des couches du dessous. Cela signifie que votre logique métier (Domaine) finit par dépendre de détails techniques (Persistance). Vos règles centrales sont désormais enchaînées à votre base de données.
- **Focus technique, pas métier** : Le code est regroupé par *ce qu'il est* (UI, code de base de données) plutôt que par *ce qu'il fait* pour le métier.

Ce couplage entre logique métier et base de données est le point où tout commence à mal tourner. Cela rend les tests plus difficiles et changer de base de données devient un projet massif et douloureux.

---

# Le vrai objectif : libérer votre logique métier

Pour moi, c'est l'objectif numéro un de toute bonne architecture : **isoler votre logique métier de tout le reste.** Vos règles métier sont la raison même pour laquelle le logiciel existe. Elles doivent être indépendantes de l'interface utilisateur, de la base de données, des frameworks — de tout.

**Pourquoi est-ce si important ?**

1. **Les choses changent** : Vos règles métier évoluent lentement. Mais la technologie ? Elle change tout le temps. Vous pourriez passer d'une API REST à GraphQL, ou de Postgres à une base NoSQL. Votre logique centrale ne devrait pas avoir à changer quand votre stack technique change.
2. **Tests faciles** : Quand votre logique métier est pure et n'a aucun lien avec une base de données ou un serveur web, vous pouvez la tester avec des tests unitaires simples et ultra-rapides.
3. **Flexibilité** : En gardant le cœur propre, vous pouvez remplacer les composants techniques en périphérie sans casser le cœur de votre application.

La stratégie est simple : **Placez votre logique métier au centre et poussez tout le technique vers l'extérieur.**

---

# La solution : l'architecture hexagonale (ports & adapters)

C'est là qu'intervient **l'architecture hexagonale**. Alistair Cockburn a conçu cette idée en 2005, et c'est brillant. C'est une conception qui place votre **logique métier** au cœur même et construit une barrière protectrice autour.

## Ce qu'elle vise à accomplir

1. **Isoler le cœur** : Votre domaine est complètement indépendant. Il ne connaît ni votre framework web ni votre base de données.
2. **Rendre les tests un jeu d'enfant** : Puisque le cœur est isolé, tester vos règles métier devient trivial.
3. **Pérenniser votre app** : Vous voulez ajouter une nouvelle façon d'interagir avec votre app, comme une interface en ligne de commande ? Ajoutez simplement un nouvel "adapter". La logique centrale ne change pas.
4. **Points d'entrée et de sortie clairs** : Toute communication avec le monde extérieur passe par des "ports" et "adapters" bien définis.

> ℹ️ **Pourquoi un hexagone ?** Alistair Cockburn a simplement choisi cette forme car elle avait assez de côtés pour représenter différents types de connexions (UI, base de données, autres APIs, etc.). Ne vous focalisez pas sur la forme. Le nom **"ports & adapters"** est en fait plus descriptif.

![](assets/hexagonal-architecture.jpg)

L'hexagone représente visuellement votre logique métier au centre, protégée du monde extérieur désordonné par une couche de ports et d'adapters. Tout tourne autour de la **modularité** et de la **neutralité technologique**.

> **ℹ️ Question de terminologie**
> Les gens utilisent différents termes pour les deux côtés de l'hexagone :
> 1. Gauche/Droite
> 2. Pilotant/Piloté (Driving/Driven)
> 3. Primaire/Secondaire
> 4. Côté Utilisateur/Côté Serveur
>
> Honnêtement, les noms importent moins que le concept. Choisissez-en un et soyez cohérent. Personnellement, j'aime **pilotant/piloté** car cela sépare clairement ce qui *initie une action* de ce qui *répond à une demande*.

---

# Le cœur de votre application est son "moteur de règles"

Voici un point crucial : **l'architecture hexagonale n'est utile que si vous avez réellement de la logique métier à protéger.**

Si votre app n'est qu'un simple service CRUD qui déplace des données d'une base vers une réponse JSON sans vraies règles ni transformations, c'est excessif. Un modèle en couches simple suffira probablement.

Mais si votre application contient de vraies règles métier — la logique qui fait gagner de l'argent à votre entreprise ou qui applique des contraintes critiques — alors ces règles sont précieuses. Elles doivent être au centre. **Sans règles métier, l'hexagone est vide.**

---

# Un exemple complet : pilotant vs piloté

Rendons cela concret. Imaginons que nous construisons un système de traitement de commandes.

- **Côté Pilotant (Gauche)** : C'est ce qui déclenche une action. Un utilisateur soumettant une commande via un formulaire web est un acteur pilotant.
- **Côté Piloté (Droite)** : C'est l'infrastructure que l'application utilise. La base de données où la commande est sauvegardée est un acteur piloté.

---

## **1. Le domaine (la logique métier pure)**

Au centre, nous avons nos règles métier, complètement indépendantes de toute technologie. Le domaine définit des "ports", qui sont des interfaces décrivant ce dont il a besoin du monde extérieur.

```ts
// Ceci est une interface pour quelque chose qui va *piloter* notre application.
export interface OrderInputPort {
   processOrder(order: Order): void; // Un port "pilotant" côté gauche
}

// Ceci est une interface pour un service par lequel notre application sera *pilotée*.
export interface OrderOutputPort {
   saveOrder(order: Order): void; // Un port "piloté" côté droit
}

// Ceci est notre logique métier centrale.
export class OrderService implements OrderInputPort {
   // Elle dépend d'une *abstraction* (le port), pas d'une base de données concrète.
   constructor(private outputPort: OrderOutputPort) {}

   processOrder(order: Order): void {
      if (!order.isValid()) {
         throw new Error("La commande est invalide");
      }

      console.log("Traitement de la commande:", order);
      // Elle appelle le port de sortie pour accomplir la tâche.
      this.outputPort.saveOrder(order);
   }
}
```

**Que se passe-t-il ici ?**

- `OrderInputPort` est le point d'entrée pour les commandes.
- `OrderOutputPort` est le point de sortie pour ce dont l'app a besoin du monde extérieur (comme sauvegarder des données).
- `OrderService` est de la logique métier pure. Elle ne connaît ni les bases de données ni les APIs. Elle sait juste qu'elle doit sauvegarder une commande via un port.

---

## **2. L'adapter pilotant (le contrôleur API)**

C'est le code qui traduit une requête entrante (du web, d'un CLI, etc.) en un appel sur le port d'entrée de notre application.

```ts
import express from "express";

// Ceci est un "adapter" qui connecte le monde extérieur (HTTP) à notre application.
export class OrderController {
   constructor(private orderInputPort: OrderInputPort) {}

   handleRequest(req: express.Request, res: express.Response): void {
      const order = req.body;

      try {
         // Le seul job du contrôleur est de traduire et déléguer.
         this.orderInputPort.processOrder(order); // Il appelle le domaine via le port.
         res.status(200).send("Commande traitée avec succès !");
      } catch (err) {
         res.status(400).send(err.message);
      }
   }
}
```

Ce contrôleur est merveilleusement stupide. Il connaît HTTP, mais il ne sait rien des règles métier. Il passe simplement la requête.

---

## **3. L'adapter piloté (la base de données)**

C'est l'implémentation concrète de notre port de sortie. C'est là que vivent les détails techniques.

```ts
// Cet adapter implémente notre port de sortie avec une technologie spécifique (ex: une BDD).
export class DatabaseAdapter implements OrderOutputPort {
   saveOrder(order: Order): void {
      // Ici vous auriez votre vraie logique de base de données.
      console.log("Sauvegarde de la commande en base:", order);
   }
}
```

Cette classe ne concerne que la base de données. Elle ne sait rien des règles métier qui ont mené à la sauvegarde de la commande.

---

## **4. Assembler le tout**

Enfin, quelque part à la périphérie de notre application (comme `index.ts`), nous câblons tout.

```ts
import express from "express";

// 1. Créer les adapters concrets.
const databaseAdapter = new DatabaseAdapter(); // Côté Piloté

// 2. Créer le service domaine, en injectant l'adapter.
const orderService = new OrderService(databaseAdapter);

// 3. Créer l'adapter pilotant, en injectant le service domaine.
const orderController = new OrderController(orderService); // Côté Pilotant

// 4. Configurer le serveur web.
const app = express();
app.use(express.json());

app.post("/orders", (req, res) => orderController.handleRequest(req, res));

app.listen(3000, () => console.log("Serveur démarré sur http://localhost:3000"));
```

C'est le seul endroit où la logique domaine et les détails techniques se rencontrent. Les dépendances sont "injectées" de l'extérieur vers l'intérieur, protégeant le cœur.

---

## L'impact sur les tests est énorme

Cette structure rend les tests un vrai plaisir :

- **Tester le Contrôleur** : Donnez-lui un mock de `OrderInputPort` et vérifiez qu'il appelle `processOrder` correctement. Pas besoin de serveur web.
- **Tester la Logique Métier** : Donnez-lui un mock de `OrderOutputPort` et testez toutes vos règles métier en isolation complète. Ces tests sont ultra-rapides.
- **Tester l'Adapter Base de Données** : Testez-le séparément pour vous assurer qu'il peut réellement sauvegarder en base.

Chaque pièce peut être testée indépendamment. Fini les tests end-to-end fragiles qui échouent pour des raisons aléatoires.

---

> **Le conseil d'Alistair Cockburn de 2023 : nommer avec intention**
> Alistair a récemment donné d'excellents conseils sur comment nommer vos ports pour rendre leur but évident. Il suggère le format : **"For + Verbe-ing + Objectif"**.
>
> **Exemple :**
>
> - **Port Pilotant :** `ForProcessingOrders`
> - **Port Piloté :** `ForSavingOrders`
>
> J'adore ça car cela rend le code auto-documenté. Vous savez immédiatement à quoi sert chaque interface. C'est un petit changement, mais il ajoute énormément de clarté.

---

L'architecture hexagonale est un progrès massif par rapport au simple découpage en couches. Elle vous force à mettre votre logique métier en premier et à traiter la technologie comme un détail. En isolant le domaine central, vous construisez des systèmes plus testables, plus flexibles et plus résistants aux changements technologiques. C'est un pattern puissant pour créer des logiciels qui durent.
