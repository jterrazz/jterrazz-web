![](assets/thumbnail.jpg)

# La Clean Architecture: Le Métier Avant Tout

## Revenons à L'essentiel

Voici l'idée qui a changé ma façon de développer: votre architecture ne devrait pas se soucier de votre base de données. Ni de votre framework web. Ni de votre interface utilisateur. La seule chose qui devrait l'importer, c'est ce que votre application *fait* réellement.

C'est toute la philosophie de la **Clean Architecture**. C'est une manière de construire des logiciels qui place vos **cas d'utilisation** (*use cases*)—la vraie valeur métier—au centre absolu de tout. Le reste n'est qu'un détail. C'est une évolution puissante des idées que nous avons vues avec l'Architecture Hexagonale, mais avec des règles plus strictes qui vous apportent encore plus de clarté et de puissance.

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

## La Clean Architecture En Théorie

La Clean Architecture, c'est avant tout une histoire de couches indépendantes avec des règles de communication strictes. Imaginez des cercles concentriques, comme un oignon.

1. **Les Entités (Entities)**: Au cœur du réacteur. Ce sont les règles métier de votre entreprise. La logique pure, sans fioritures, qui définit votre business.
2. **Les Cas d'Utilisation (Use Cases)**: La couche qui entoure les entités. Elle contient les règles métier spécifiques à l'application. C'est le chef d'orchestre qui organise les flux de données avec les entités pour atteindre un but précis (ex: "Inscrire un utilisateur").
3. **Les Adaptateurs d'Interface (Interface Adapters)**: La couche de traduction. Elle prend les données dans le format pratique pour les use cases et les entités, et les convertit dans le format pratique pour le monde extérieur (la base de données, le web, etc.).
4. **Les Frameworks et Drivers**: La couche la plus externe. C'est là que vivent tous les détails: le framework web, la base de données, l'UI… C'est cette couche qui est la plus susceptible de changer.

La règle d'or est la **Règle de Dépendance**: toutes les dépendances doivent pointer vers l'intérieur. Votre UI peut dépendre de vos use cases, mais vos use cases, eux, ne savent MÊME PAS que l'UI existe. Votre logique métier est reine, et elle n'est jamais, au grand jamais, détrônée par un détail technique.

![](assets/clean-architecture.jpg)

---

## Clean Architecture vs. Architecture Hexagonale

Alors, comment ça se compare à l'Architecture Hexagonale dont on vient de parler?

Elles partagent exactement la même philosophie: **protéger la logique métier**. Pour moi, la Clean Architecture est une version plus spécifique et plus "opinionnée" de l'Hexagonale.

* L'Architecture Hexagonale vous donne le "quoi": séparez votre appli en un "intérieur" (le domaine) et un "extérieur" (l'infrastructure) avec des ports et des adaptateurs.
* La Clean Architecture vous donne un "comment" plus détaillé: elle définit explicitement les couches à l'intérieur (Entités et Use Cases) et fournit des règles plus strictes sur leurs interactions.

Pensez-y comme ça: l'Hexagonale a dessiné la carte du monde. La Clean Architecture a ajouté les autoroutes et les panneaux de signalisation. Le chemin est plus clair.

---

## Passons à la Pratique: Un Exemple Complet

La théorie, c'est bien. Le code, c'est mieux. Construisons un petit bout d'une application de gestion hôtelière. Le but: mettre à jour le prix des chambres en fonction d'un nouveau prix de base et de règles métier (par exemple, chaque étage a un coefficient de prix différent).

### Structure De Nos Fichiers

D'abord, regardez la structure du projet. C'est ce que Robert C. Martin appelle une "Screaming Architecture" (une architecture qui "crie" son intention). Votre arborescence de dossiers doit crier ce que l'application *fait*, pas quels frameworks elle utilise. Vous voyez `business`, `use-cases`, `entity`. Vous ne voyez pas `models`, `views`, `controllers` au premier niveau.

```sh
src/
├── business/
│   ├── entity/
│   │   └── floor.ts
│   │   └── room.ts
│   ├── gateway/
│   │   └── room.gateway.ts
│   ├── use-cases/
│   │   └── update-room-price.ts
├── container/
│   └── container.ts
├── controller/
│   ├── gateway/
│   │   └── room.repository.ts
│   ├── presenter/
│   │   └── room-presenter.json.ts
│   └── room.controller.ts
└── tests/
    └── update-price.test.ts
```

* `business/`: Le cœur de notre application. Toute la logique métier pure vit ici. Elle n'a aucune dépendance envers le monde extérieur.
* `controller/`: Notre couche d'adaptateurs. Elle gère les détails techniques de la communication avec l'extérieur (implémenter les gateways, les presenters, etc.).
* `container/`: Notre "usine d'assemblage". C'est là qu'on branche tout ensemble grâce à l'injection de dépendances.
* `tests/`: Les tests qui prouvent que notre logique métier fonctionne.

---

### 1. Les Entités: `Floor` & `Room`

Les entités ne sont pas de simples conteneurs de données. Elles embarquent les règles métier les plus fondamentales. C'est la logique qui est vraie pour toute l'entreprise, peu importe l'application qui l'utilise.

```ts
// business/entity/floor.ts
export class Floor {
    constructor(public floor: number) {}

    // Ça, c'est une règle métier fondamentale.
    getFactor() {
        if (this.floor === 1) return 1.07;
        if (this.floor === 2) return 1.22;
        if (this.floor === 3) return 1.33;
        return 1;
    }
}
```

```ts
// business/entity/room.ts
import { Floor } from "./floor";

export class Room {
    public floor: Floor;
    constructor(
        floorNumber: number,
        public number: number,
        public price: number,
    ) {
        this.floor = new Floor(floorNumber);
    }

    // Une autre règle métier.
    setPrice(basePrice: number) {
        const calculatedPrice = basePrice * this.floor.getFactor();
        this.price = Math.min(Number(calculatedPrice.toFixed(2)), 200);
    }
}
```

**Pourquoi mettre de la logique ici?** Parce que la règle "le prix d'une chambre dépend de son étage" est une vérité fondamentale de notre business hôtelier. En la plaçant dans l'entité, on s'assure qu'elle est toujours respectée, partout. C'est encapsulé, réutilisable et ça suit le Principe de Responsabilité Unique.

---

### 2. La Gateway: `RoomGateway`

La gateway, c'est une interface. C'est un contrat, défini par la couche métier, qui dit: "J'ai besoin de faire ces choses-là avec des chambres, mais je me fiche de savoir *comment* vous le faites." C'est une promesse que les couches externes devront tenir.

```ts
// business/gateway/room.gateway.ts
export interface RoomDTO {
    floor: number;
    number: number;
    price: number;
}

// Voici le contrat.
export interface RoomGateway {
    updateRoomPrice(roomNumber: number, newPrice: number): Promise<void>;
    getRooms(): Promise<Array<RoomDTO>>;
}
```

Cette interface vit dans la couche `business`, ce qui garantit que la dépendance pointe vers l'intérieur. Les use cases dépendront de cette abstraction, pas d'une classe de base de données concrète.

---

### 3. Le Cas d'Utilisation: `UpdateRoomPrice`

Le use case, c'est la star du spectacle. Il représente une action unique que l'application peut accomplir. Il orchestre les entités et utilise les gateways pour interagir avec le monde extérieur.

```ts
// business/use-cases/update-room-price.ts
import { Room } from "../entity/room";
import { RoomGateway } from "../gateway/room.gateway";

// Un autre contrat : comment le use case communique ses résultats.
export interface Presenter {
    set: (rooms: Array<Room>) => void;
}

// Le use case lui-même.
export type UpdateRoomPrice = (basePrice: number, presenter: Presenter) => Promise<void>;

// Une factory pour créer le use case et injecter ses dépendances.
export const updateRoomPriceFactory = (repository: RoomGateway) => {
    return async (basePrice: number, presenter: Presenter) => {
        if (basePrice < 0) {
            throw new Error("Amount cannot be negative");
        }
        const roomsDto = await repository.getRooms();
        const rooms = roomsDto.map(r => new Room(r.floor, r.number, r.price));

        for (const room of rooms) {
            room.setPrice(basePrice); // On utilise la logique de l'entité !
            await repository.updateRoomPrice(room.number, room.price);
        }

        const updatedRooms = (await repository.getRooms()).map(
            r => new Room(r.floor, r.number, r.price)
        );
        
        // On transmet les résultats au presenter.
        presenter.set(updatedRooms);
    };
};
```

Ce code est de la pure logique métier. Il récupère des chambres, boucle dessus, dit à chaque chambre de mettre à jour son prix (en utilisant la méthode `setPrice` de l'entité), puis les sauvegarde. Il ne connaît rien aux bases de données, à HTTP ou au JSON. Il ne parle qu'à des abstractions (`RoomGateway`, `Presenter`).

---

### 4. L'Implémentation De la Gateway: `RoomRepository`

Maintenant, on passe aux couches externes. Le `RoomRepository` est l'implémentation concrète de l'interface `RoomGateway`. C'est ici qu'on écrit le code de base de données. Pour l'exemple, j'utilise un simple tableau en mémoire, mais c'est ici que votre code `Prisma`, `TypeORM` ou `node-postgres` irait.

```ts
// controller/gateway/room.repository.ts
import { RoomDTO, RoomGateway } from "../../business/gateway/room.gateway";

export class RoomRepository implements RoomGateway {
    constructor(private rooms: Array<RoomDTO>) {}

    async updateRoomPrice(roomNumber: number, newPrice: number): Promise<void> {
        const room = this.rooms.find(room => room.number === roomNumber);
        if (!room) {
            throw new Error(`Failed to find room ${roomNumber}`);
        }
        room.price = newPrice;
        return Promise.resolve();
    }

    async getRooms(): Promise<Array<RoomDTO>> {
        return Promise.resolve(this.rooms);
    }
}```

Cette classe tient la promesse faite par l'interface `RoomGateway`.

---

### 5. L'Implémentation du Presenter : `RoomPresenterJson`

Le job du presenter, c'est de prendre les objets `Room` purs du use case et de les formater pour le monde extérieur. Ici, on les formate en objets JSON simples.

```ts
// controller/presenter/room.presenter-json.ts
import { Room } from "../../business/entity/room";

export class RoomPresenterJson {
    private r: Array<Room> = [];

    // Le use case appelle cette méthode.
    set(rooms: Array<Room>) {
        this.r = rooms;
    }

    // Le contrôleur appelle cette méthode pour avoir le résultat final.
    format() {
        return this.r.map(r => ({
            floor: r.floor.floor,
            price: r.price,
            number: r.number,
        }));
    }
}
```

Ça crée une séparation magnifique. Le use case ne connaît pas le JSON. Le contrôleur ne connaît pas les entités `Room`. Le presenter fait le pont.

---

### 6. Le Contrôleur: `RoomController`

Le contrôleur est le point d'entrée depuis le web. Son seul travail est de parser la requête, d'appeler le bon use case, et d'envoyer la réponse formatée. C'est une couche fine et bête.

```ts
// controller/room.controller.ts
import { Request, Response } from "express";
import { createContainer } from "../container/container";
import { RoomPresenterJson } from "./presenter/room-presenter.json";

const express = require('express');
const app = express();
const container = createContainer();

app.put('/rooms', async (req: Request, res: Response) => {
    // 1. On crée un nouveau presenter pour cette requête.
    const roomPresenterJson = new RoomPresenterJson();
    // 2. On récupère le use case du conteneur et on l'exécute.
    await container.UpdateRoomPrice(200, roomPresenterJson);
    // 3. On envoie le résultat formaté par le presenter.
    res.send(roomPresenterJson.format());
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

Regardez comme c'est propre. Le contrôleur orchestre le flux mais ne contient aucune logique métier.

---

### 7. Le Conteneur De Dépendances

C'est ici que la magie opère. Le conteneur est le seul endroit où l'on construit nos objets et où l'on injecte leurs dépendances. C'est l'Inversion de Contrôle en action.

```ts
// container/container.ts
import { UpdateRoomPrice, updateRoomPriceFactory } from "../business/use-cases/update-room-price";
import { RoomRepository } from "../controller/gateway/room.repository";

interface Container {
    UpdateRoomPrice: UpdateRoomPrice;
}

export const createContainer = (): Container => {
    return {
        // On crée le use case, en lui injectant le repository concret.
        UpdateRoomPrice: updateRoomPriceFactory(
            new RoomRepository([
                // Données initiales pour notre repo en mémoire.
                { floor: 0, number: 1, price: 0 },
                { floor: 1, number: 2, price: 0 },
                { floor: 2, number: 3, price: 0 },
                { floor: 3, number: 4, price: 0 },
            ])
        ),
    };
};
```

---

### 8. Le Test: Là Où Tout Prend Son Sens

Et maintenant, le meilleur pour la fin. Regardez comme il est facile de tester notre logique métier principale.

```ts
// tests/update-price.test.ts
import assert from "assert";
import { describe, test } from "mocha";
import { createContainer } from "../container/container";
import { RoomPresenterJson } from "../controller/presenter/room-presenter.json";

describe('Update Room Price', () => {
    test('Met à jour tous les prix en se basant sur un prix de 100', async () => {
        // Given
        const container = createContainer();
        const presenter = new RoomPresenterJson();

        // When on exécute le use case
        await container.UpdateRoomPrice(100, presenter);

        // Then on vérifie la sortie du presenter
        const value = presenter.format();
        assert.deepStrictEqual(value, [
            { "number": 1, "price": 100, "floor": 0 }, // 100 * 1
            { "number": 2, "price": 107, "floor": 1 }, // 100 * 1.07
            { "number": 3, "price": 122, "floor": 2 }, // 100 * 1.22
            { "number": 4, "price": 133, "floor": 3 }, // 100 * 1.33
        ]);
    });
});
```

Ce test est ultra-rapide. Il tourne en mémoire. Il n'a besoin ni de base de données, ni de serveur web. Il teste tout notre processus métier de bout en bout et prouve que notre logique est correcte, tout ça parce qu'on a soigneusement séparé nos préoccupations. C'est ça, la récompense.

---

## Conclusion: Codez Pour Le Métier, Pas Pour la Tech

Nous avons parcouru un long chemin, des dépendances de base à l'Architecture Hexagonale, et maintenant à la structure disciplinée de la Clean Architecture. La leçon a toujours été la même: **faites passer votre logique métier en premier.**

Les frameworks changeront. Les bases de données seront remplacées. Les interfaces utilisateur seront redessinées. Mais vos règles métier fondamentales sont ce qui apporte une valeur durable. La Clean Architecture n'est pas juste un pattern; c'est une philosophie qui vous force à protéger cette valeur.

Elle exige de la rigueur et un peu plus de réflexion au départ, mais la récompense est un système testable, maintenable, flexible et compréhensible. Vous construisez quelque chose qui peut évoluer avec le business, pas quelque chose qui le freine.

Merci de m'avoir suivi dans cette aventure. Maintenant, à vous de jouer et de construire le futur! 🚀
