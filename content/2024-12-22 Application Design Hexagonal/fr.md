![](assets/thumbnail.jpg)

# Design Applicatif: Séparer Le Métier De la Technique

## Structurons Notre Code, Pour De Vrai

Alors, comment on organise concrètement un projet? C'est l'une des plus grandes questions qu'on se pose. Si vous y répondez bien, votre application peut grandir et s'adapter pendant des années. Si vous vous plantez, vous vous préparez des jours sombres.

Dans ce chapitre, je veux vous guider à travers l'évolution de la manière dont on structure le code. On va commencer par les approches classiques, voir où elles échouent, puis plonger dans une bien meilleure façon de penser: l'**architecture hexagonale**. C'est un vrai *game-changer* pour isoler ce que votre application *fait* de la technologie qu'elle *utilise*.

**Navigation 📚**

1. [**Introduction : Le Design Applicatif, l'Art de Construire des Logiciels Durables et Évolutifs**](https://www.jterrazz.com/articles/9-software-design-0-why-architecture-matters/fr)
		*Les bases pour comprendre les enjeux et les objectifs d'une bonne architecture.*

2. [**Chapitre 1 : Le Concept de Dépendances**](https://www.jterrazz.com/articles/10-software-design-1-mastering-dependencies/fr)
		*Explorer les relations entre composants, l'importance des dépendances et les principes comme SOLID.*

3. [**Chapitre 2 : Comprendre les Architectures Métier et Technique**](https://www.jterrazz.com/articles/11-software-design-2-hexagonal-architecture/fr)
		*Comprendre comment isoler le métier des préoccupations techniques grâce aux ports et adaptateurs.*

4. [**Chapitre 3 : La Clean Architecture**](https://www.jterrazz.com/articles/12-software-design-3-clean-architecture-in-practice/fr)
		*Découvrir une approche centrée sur le métier avec une structuration claire en couches.*

---

## Le Point De Départ: Les Architectures Classiques

### L'Architecture Spaghetti: L'architecture "sans architecture"

On l'a tous vue. Certains d'entre nous l'ont même écrite. L'architecture spaghetti, c'est ce qui arrive quand il n'y a pas de règles. La logique métier, les appels à la base de données, le code de l'interface utilisateur—tout est mélangé dans un seul plat de nouilles inextricable.

**Le résultat?**

* Le code est impossible à lire.
* Les tests sont un cauchemar.
* Chaque modification risque de tout casser.

C'est le résultat naturel quand on veut aller vite sans avoir de plan. C'est le chaos.

---

### L'Architecture En Couches: Un Pas Dans la Bonne Direction

Pour combattre ce chaos, on a inventé l'**architecture en couches**. C'est probablement le pattern le plus répandu parce qu'il est simple et intuitif. On divise l'application en couches distinctes, chacune avec une mission claire.

#### Les Couches Habituelles

1. **Couche Présentation**: L'interface utilisateur ou l'API avec laquelle l'utilisateur interagit.
2. **Couche Application**: Elle orchestre les flux de travail. Elle ne contient pas de logique métier elle-même, mais dit à la couche domaine quoi faire.
3. **Couche Domaine**: Le cœur de l'application. C'est là que vivent toutes les règles métier essentielles.
4. **Couche Persistance**: Gère tout ce qui touche à la base de données.

#### La Règle d'Or: On Ne Parle Qu'à la Couche Du Dessous

La couche Présentation parle à la couche Application, qui parle au Domaine, qui parle à la Persistance. Simple. Ça respecte le principe de responsabilité unique (**S** de **SOLID**), car chaque couche a un seul rôle.

---

### Le Gros Problème De l'Architecture En Couches

À première vue, ça a l'air propre. Mais il y a un défaut fatal.

* **La Règle de Dépendance est un Piège**: Les couches dépendent directement des couches inférieures. Cela signifie que votre logique métier (Domaine) finit par dépendre de détails techniques (Persistance). Vos règles fondamentales sont maintenant liées à votre base de données.
* **Un Découpage Technique, pas Métier**: Le code est regroupé par *ce qu'il est* (du code d'UI, du code de BDD) plutôt que par *ce qu'il fait* pour le business.

Ce couplage entre la logique métier et la base de données est le point de départ de tous les problèmes. Ça rend les tests plus difficiles et changer de base de données devient un projet titanesque et douloureux.

---

## Le Vrai Objectif: Libérer Votre Logique Métier

Pour moi, c'est l'objectif numéro un de toute bonne architecture: **isoler votre logique métier de tout le reste.** Vos règles métier sont la raison d'être de votre logiciel. Elles devraient être indépendantes de l'interface utilisateur, de la base de données, des frameworks—de tout.

**Pourquoi c'est si important?**

1. **Les Choses Changent**: Vos règles métier évoluent lentement. Mais la technologie? Elle change tout le temps. Vous pourriez passer d'une API REST à GraphQL, ou de Postgres à une base NoSQL. Votre logique principale ne devrait pas avoir à changer quand votre stack technique change.
2. **Des Tests Faciles**: Quand votre logique métier est pure, sans aucun lien avec une base de données ou un serveur web, vous pouvez la tester avec des tests unitaires simples et rapides.
3. **Flexibilité**: En gardant le cœur propre, vous pouvez changer les composants techniques en périphérie sans casser le cœur de votre application.

La stratégie est simple: **mettez votre logique métier au centre, et poussez toute la technique à l'extérieur.**

---

## La Solution: l'Architecture Hexagonale (Ports & Adapters)

C'est là qu'intervient l'**Architecture Hexagonale**. Alistair Cockburn a eu cette idée géniale en 2005. C'est une conception qui place votre **logique métier** en plein centre et construit une barrière protectrice autour.

### Ce Qu'elle Vise à Faire

1. **Isoler le Cœur**: Votre domaine est complètement indépendant. Il ne connaît ni votre framework web, ni votre base de données.
2. **Rendre les Tests Simples comme Bonjour**: Puisque le cœur est isolé, tester vos règles métier devient trivial.
3. **Pérenniser votre App**: Vous voulez ajouter une nouvelle façon d'interagir avec votre application, comme une interface en ligne de commande? Il suffit d'ajouter un nouvel "adaptateur". La logique de base ne change pas.
4. **Des Points d'Entrée et de Sortie Clairs**: Toute communication avec le monde extérieur passe par des "ports" et des "adaptateurs" bien définis.

> ℹ️ **Pourquoi un hexagone?** Alistair Cockburn a juste choisi cette forme parce qu'elle avait assez de côtés pour représenter différents types de connexions (UI, BDD, autres API, etc.). Ne vous bloquez pas sur la forme. Le nom **"Ports & Adapters"** est en fait plus parlant.

![](assets/hexagonal-architecture.jpg)

L'hexagone montre visuellement votre logique métier au centre, protégée du monde extérieur désordonné par une couche de ports et d'adaptateurs. Tout est une question de **modularité** et de **neutralité technologique**.

> **ℹ️ Une Question de Noms**
> Les gens utilisent différents termes pour les deux côtés de l'hexagone:
> 1. Gauche/Droite (Left/Right)
> 2. Acteur/Acté (Driving/Driven)
> 3. Primaire/Secondaire (Primary/Secondary)
> 4. Côté Utilisateur/Côté Serveur (User Side/Server Side)
>
> Honnêtement, les noms importent moins que le concept. Choisissez-en un et soyez cohérent. Personnellement, j'aime bien **Driving/Driven** (qu'on pourrait traduire par Acteur/Acté) car ça sépare clairement ce qui *déclenche une action* de ce qui *répond à une demande*.

---

### Le Cœur De Votre Application, C'est Son "Moteur De Règles"

Voici un point crucial: **l'architecture hexagonale n'est utile que si vous avez VRAIMENT une logique métier à protéger.**

Si votre application est juste un simple service CRUD qui déplace des données d'une base de données vers une réponse JSON sans véritables règles ou transformations, alors c'est complètement surdimensionné. Un simple modèle en couches est probablement suffisant.

Mais si votre application contient de vraies règles métier—la logique qui fait gagner de l'argent à votre entreprise ou qui applique des contraintes critiques—alors ces règles sont précieuses. Elles doivent être au centre. **Sans règles métier, l'hexagone est vide.**

---

### Un Exemple Complet: Driving Side vs. Driven Side

Rendons ça concret. Imaginons qu'on construise un système de traitement de commandes.

* **Driving Side (Côté gauche / Acteur)**: C'est ce qui déclenche une action. Un utilisateur qui soumet une commande via un formulaire web est un acteur "driving".
* **Driven Side (Côté droit / Acté)**: C'est l'infrastructure que l'application utilise. La base de données où la commande est sauvegardée est un acteur "driven".

---

#### **1. Le Domaine (la Logique Métier pure)**

Au centre, nous avons nos règles métier, complètement indépendantes de toute technologie. Le domaine définit des "ports", qui sont des interfaces décrivant ce qu'il a besoin de faire.

```ts
// C'est une interface pour quelque chose qui va *piloter* notre application.
export interface OrderInputPort {
   processOrder(order: Order): void; // Un port "driving" (gauche)
}

// C'est une interface pour un service que notre application va *utiliser*.
export interface OrderOutputPort {
   saveOrder(order: Order): void; // Un port "driven" (droit)
}

// C'est notre logique métier principale.
export class OrderService implements OrderInputPort {
   // Elle dépend d'une *abstraction* (le port), pas d'une base de données concrète.
   constructor(private outputPort: OrderOutputPort) {}

   processOrder(order: Order): void {
      if (!order.isValid()) {
         throw new Error("Order is invalid");
      }

      console.log("Processing order:", order);
      // Elle appelle le port de sortie pour faire le travail.
      this.outputPort.saveOrder(order);
   }
}
```

**Qu'est-ce qui se passe ici?**

* `OrderInputPort` est le point d'entrée pour les commandes.
* `OrderOutputPort` est le point de sortie pour les choses dont l'application a besoin du monde extérieur (comme sauvegarder des données).
* `OrderService` est de la pure logique métier. Elle ne connaît ni les bases de données, ni les API. Elle sait juste qu'elle doit sauvegarder une commande via un port.

---

#### **2. L'Adaptateur Driving (le Contrôleur d'API)**

C'est le code qui traduit une requête entrante (du web, d'un CLI, etc.) en un appel sur le port d'entrée de notre application.

```ts
import express from "express";

// C'est un "adaptateur" qui connecte le monde extérieur (HTTP) à notre application.
export class OrderController {
   constructor(private orderInputPort: OrderInputPort) {}

   handleRequest(req: express.Request, res: express.Response): void {
      const order = req.body;

      try {
         // Le seul travail du contrôleur est de traduire et de déléguer.
         this.orderInputPort.processOrder(order); // Il appelle le domaine via le port.
         res.status(200).send("Order processed successfully!");
      } catch (err) {
         res.status(400).send(err.message);
      }
   }
}
```

Ce contrôleur est bête. Il connaît HTTP, mais il ne connaît rien aux règles métier. Il se contente de passer la requête.

---

#### **3. L'Adaptateur Driven (la Base De données)**

C'est l'implémentation concrète de notre port de sortie. C'est ici que vivent les détails techniques.

```ts
// Cet adaptateur implémente notre port de sortie avec une technologie spécifique.
export class DatabaseAdapter implements OrderOutputPort {
   saveOrder(order: Order): void {
      // Ici, vous auriez votre vraie logique de base de données.
      console.log("Saving order to database:", order);
   }
}
```

Cette classe ne s'occupe que de la base de données. Elle ne sait rien des règles métier qui ont mené à la sauvegarde de la commande.

---

### **4. On Assemble Le Tout**

Enfin, quelque part tout à la périphérie de notre application (comme dans `index.ts`), on connecte tout.

```ts
import express from "express";

// 1. On crée les adaptateurs concrets.
const databaseAdapter = new DatabaseAdapter(); // Driven Side

// 2. On crée le service du domaine, en lui injectant l'adaptateur.
const orderService = new OrderService(databaseAdapter);

// 3. On crée l'adaptateur "driving", en lui injectant le service du domaine.
const orderController = new OrderController(orderService); // Driving Side

// 4. On met en place le serveur web.
const app = express();
app.use(express.json());

app.post("/orders", (req, res) => orderController.handleRequest(req, res));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

C'est le seul endroit où la logique du domaine et les détails techniques se rencontrent. Les dépendances sont "injectées" de l'extérieur vers l'intérieur, protégeant le cœur.

---

### L'Impact Sur Les Tests Est Énorme

Cette structure rend les tests un vrai plaisir:

* **Tester le Contrôleur**: Donnez-lui un `OrderInputPort` mocké et vérifiez qu'il appelle `processOrder` correctement. Pas besoin de serveur web.
* **Tester la Logique Métier**: Donnez-lui un `OrderOutputPort` mocké et testez toutes vos règles métier en isolement complet. Ces tests sont ultra-rapides.
* **Tester l'Adaptateur de Base de Données**: Testez-le seul pour vous assurer qu'il peut réellement sauvegarder dans la base de données.

Chaque pièce peut être testée indépendamment. Fini les tests de bout en bout fragiles qui échouent pour des raisons obscures.

---

> **Le Conseil d'Alistair Cockburn en 2023: Nommez avec Intention**<br/>
> Alistair a récemment donné un excellent conseil sur la façon de nommer vos ports pour rendre leur but évident. Il suggère le format: **"For + Verbe-ing + Objectif"** (Pour + [Action] + [But]).
>
> **Exemple:**
>
> * **Port Driving:** `ForProcessingOrders` (PourTraiterLesCommandes)
> * **Port Driven:** `ForSavingOrders` (PourSauvegarderLesCommandes)
>
> J'adore ça, car ça rend le code auto-documenté. Vous savez immédiatement à quoi sert chaque interface. C'est un petit changement qui ajoute une tonne de clarté.

---

L'architecture hexagonale est un énorme pas en avant par rapport au simple modèle en couches. Elle vous force à mettre votre logique métier en premier et à traiter la technologie comme un détail.

Mais ce n'est pas la destination finale. La **Clean Architecture**, popularisée par Robert C. Martin (Uncle Bob), pousse ces idées encore plus loin. Elle fournit un ensemble de règles plus structurées pour les couches et les dépendances, créant une séparation des préoccupations encore plus forte.

Dans le prochain chapitre, on va plonger dans la Clean Architecture. Vous verrez comment elle s'appuie sur les fondations de l'Hexagonale pour vous donner un moyen puissant et évolutif de structurer n'importe quelle application. C'est parti

[Prochain Article](https://www.jterrazz.com/articles/12-software-design-3-clean-architecture-in-practice)
