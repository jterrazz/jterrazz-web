![](assets/thumbnail.jpg)

# La Clean Architecture - Chapitre 3

L'architecture logicielle ne devrait pas dépendre de détails techniques comme les bases de données ou les frameworks utilisés. **Les cas d'utilisation (use cases) doivent être au centre de votre application.** C'est le fondement de la **Clean Architecture**, une méthodologie qui repose sur des couches bien définies et découplées, avec des dépendances strictement orientées vers le métier.

**Navigation 📚**

1. [**Introduction: Le Design Applicatif, L'Art De Construire Des Logiciels Durables Et Évolutifs**](https://www.jterrazz.com/articles/9)
	 *Les bases pour comprendre les enjeux et les objectifs d'une bonne architecture.*

2. [**Chapitre 1: Le concept de dépendances**](https://www.jterrazz.com/articles/10)
	 *Explorer les relations entre composants, l'importance des dépendances, et les principes comme SOLID.*

3. [**Chapitre 2: Comprendre Les Architectures Métier Et Technique**](https://www.jterrazz.com/articles/11)
	 *Comprendre comment isoler le métier des préoccupations techniques grâce aux ports et adaptateurs.*

4. [**Chapitre 3: La Clean Architecture**](https://www.jterrazz.com/articles/12)
	 *Découvrir une approche centrée sur le métier avec une structuration claire en couches.*

---

## Ce Que la Clean Architecture Implique En Théorie

Mettre en œuvre la Clean Architecture demande une structuration méthodique de votre application en couches indépendantes, où chaque couche a un rôle bien défini:

1. **Les entités (Entities)**: Contiennent les règles métier fondamentales, indépendantes des cas d'utilisation spécifiques.
2. **Les cas d'utilisation (Use Cases)**: Orchestrent les interactions entre les entités et définissent les règles spécifiques à chaque besoin de l'application.
3. **Les adaptateurs d'interface (Interface Adapters)**: Traduisent les données entre le domaine métier et le monde extérieur (ex.: API, UI, base de données).
4. **Les frameworks et drivers**: Contiennent les détails techniques (bases de données, serveurs web, frameworks).

Chaque couche est indépendante et les dépendances sont strictement orientées vers le métier.

![](assets/clean-architecture.jpg)

---

## Comparaison Avec L'architecture Hexagonale

La **Clean Architecture** et l'**architecture hexagonale** partagent une philosophie commune: **isoler la logique métier** du reste de l'application et découpler les couches techniques. Cependant, la Clean Architecture structure ces concepts de manière plus explicite en introduisant des distinctions claires entre les différentes couches:

1. **Entités (Entities)**: Ces règles métier fondamentales, au cœur de la Clean Architecture, sont similaires au **domaine** dans l'architecture hexagonale.
2. **Cas d'utilisation (Use Cases)**: La Clean Architecture consacre une couche spécifique aux cas d'utilisation, alors que dans l'hexagonale, ces règles sont souvent impliquées implicitement via les ports.
3. **Interface Adapters**: Les ports et adaptateurs de l'hexagonale trouvent leur équivalent ici. Les adaptateurs traduisent les données entre le métier et les couches externes.
4. **Frameworks & Drivers**: Cette couche périphérique regroupe les dépendances techniques (ex.: bases de données, API, UI), équivalente aux adaptateurs techniques de l'hexagonale.

**Différences clés**

• **Structure explicite**: La Clean Architecture formalise les couches (Entities, Use Cases, Interface Adapters) là où l'architecture hexagonale est plus abstraite.

• **Orientation métier**: La Clean Architecture place une emphase plus forte sur les cas d'utilisation comme éléments centraux, tandis que l'hexagonale reste focalisée sur la modularité via les ports/adaptateurs.

---

## Exemple Complet: Application De Gestion De Commandes

Dans cet exemple, nous modéliserons une application e-commerce où l'on calcule le montant total d'une commande en appliquant une réduction spécifique. Ce cas d'utilisation illustre bien la séparation entre les couches métier et les couches techniques.

---

### Structure Des Fichiers

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

**Explication de la structure**

- `business/`: Contient la logique métier (entités, cas d'utilisation, et abstraction des gateways).
- `container/`: Configure les dépendances (injection) et assemble les différentes couches.
- `controller/`: Implémente les gateways et presenters. Traduit les données entre le métier et le monde extérieur.
- `tests/`: Teste isolément les cas d'utilisation avec des mocks pour les gateways et presenters.

---

### 1. Entités: `Floor` & `Room`

```ts
// business/entity/floor.ts
export class Floor {
    constructor(public floor: number) {}

    getFactor() {
        if (this.floor === 1) {
            return 1.07;
        }
        if (this.floor === 2) {
            return 1.22;
        }
        if (this.floor === 3) {
            return 1.33;
        }
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

    setPrice(basePrice: number) {
        this.price = Math.min(Number((basePrice * this.floor.getFactor()).toFixed(2)), 200)
    }
}
```

**Pourquoi ces entités portent des fonctions liées au métier?**

Dans la **Clean Architecture**, les entités comme Floor et Room représentent les **Enterprise Business Rules**: les règles métier fondamentales de l'application. Ces règles encapsulent des comportements qui sont directement liés au domaine métier de l'entreprise. Par exemple:

1. **Encapsulation des règles métier**:

• La méthode getFactor de Floor traduit une règle métier: chaque étage a un facteur de prix spécifique. Cette logique appartient au cœur du métier et ne dépend pas des couches techniques.

• La méthode setPrice de Room applique une autre règle métier: calculer le prix d'une chambre en fonction du facteur d'étage et limiter ce prix à un maximum de 200. Cette logique est également une responsabilité métier.

2. **Isolation des responsabilités**:

En plaçant ces comportements dans les entités, on évite que les règles métier soient dispersées dans les cas d'utilisation ou les couches techniques. Cela rend le code plus lisible, testable et aligné avec les principes **SRP** (Single Responsibility Principle) et **encapsulation**.

3. **Réutilisabilité**:

Ces entités peuvent être utilisées dans plusieurs cas d'utilisation sans duplication de logique. Par exemple, Room peut être utilisée pour des calculs de prix dans différents contextes (affichage, mise à jour des prix, génération de rapports).

---

### 2. Gateway: `RoomGateway`

```ts
// business/gateway/room.gateway.ts
export interface RoomDTO {
    floor: number;
    number: number;
    price: number;
}

export interface RoomGateway {
    updateRoomPrice(roomNumber: number, newPrice: number): Promise<void>
    getRooms(): Promise<Array<RoomDTO>>
}
```

Le **RoomGateway** sert d'abstraction entre la logique métier et les détails techniques (ex.: base de données). Il expose des méthodes nécessaires au métier (updateRoomPrice, getRooms) tout en masquant les implémentations spécifiques.

---

### 3. Cas D'utilisation: `UpdateRoomPrice`

```ts
// business/use-cases/update-room-price.ts
import { Room } from "../entity/room";
import { RoomGateway } from "../gateway/room.gateway";

export interface Presenter {
    set: (rooms: Array<Room>) => void
}

export type UpdateRoomPrice = (basePrice: number, presenter: Presenter) => Promise<void>

export const updateRoomPriceFactory = (repository: RoomGateway) => {
    return async (basePrice: number, presenter: Presenter) => {
        if (basePrice < 0) {
            throw new Error('Amount cannot be negative number')
        }
        const roomsDto = await repository.getRooms()
        const rooms = roomsDto.map(r => new Room(r.floor, r.number, r.price));
        for (const room of rooms) {
            room.setPrice(basePrice)
            await repository.updateRoomPrice(room.number, room.price)
        }
        const updatedRooms = (await repository.getRooms()).map(r => new Room(r.floor, r.number, r.price));
        presenter.set(updatedRooms);
    }
}
```

Le **cas d'utilisation** UpdateRoomPrice orchestre les interactions entre le métier et les couches externes (gateway et presenter) pour appliquer une logique spécifique: mettre à jour les prix des chambres.

1. **Responsabilité métier**:

Ce cas d'utilisation encapsule la règle métier principale: calculer et mettre à jour les prix des chambres en fonction d'un prix de base, tout en validant les contraintes (ex.: montant non négatif).

2. **Orchestration des dépendances**:

• Le **Gateway** (RoomGateway) est utilisé pour accéder aux données des chambres et persister les modifications.

• Le **Presenter** est appelé à la fin pour transmettre les résultats au contrôleur, garantissant que la logique métier ne gère pas la présentation.

3. **Testabilité et modularité**:

Ce design rend le cas d'utilisation testable isolément grâce à l'injection des abstractions (RoomGateway et Presenter). De plus, il peut être modifié ou étendu sans affecter les entités ou le contrôleur.

---

### 4. Implémentation Du Gateway Côté Contrôleur: `RoomRepository`

```ts
// controller/gateway/room.repository.ts
import { RoomDTO, RoomGateway } from "../../business/gateway/room.gateway";

export class RoomRepository implements RoomGateway {
    constructor(private rooms: Array<RoomDTO>) {}

    updateRoomPrice(roomNumber: number, newPrice: number): Promise<void> {
        const room = this.rooms.find(room => room.number === roomNumber);
        if (!room) {
            throw new Error(`Failed to find room ${roomNumber}`)
        }
        room.price = newPrice;
        return Promise.resolve()
    }

    getRooms(): Promise<Array<RoomDTO>> {
        return Promise.resolve(this.rooms);
    }
}
```

---

### 5. Implémentation Du Presenter: `RoomPresenterJson`

```ts
// controller/presenter/room.presenter-json.ts
import { Room } from "../../business/entity/room";

export class RoomPresenterJson {
    private r: Array<Room> = [];

    set(rooms: Array<Room>) {
        this.r = rooms;
    }

    format() {
        return this.r.map(r => {
            return {
                floor: r.floor.floor,
                price: r.price,
                number: r.number,
            }
        })
    }
}
```

---

### 6. Contrôleur: `RoomController`

```ts
// controller/room.controller.ts
import { Request, Response } from "express"
import { createContainer } from "../container/container"
import { RoomPresenterJson } from "./presenter/room-presenter.json";

// A bouger quelque part
const express = require('express')
const app = express()

const container = createContainer();

app.put('/rooms', async (req: Request, res: Response) => {
    const roomPresenterJson = new RoomPresenterJson();
    await container.UpdateRoomPrice(200, roomPresenterJson)
    res.send(roomPresenterJson.format())
})

app.listen(3000)
```

Isoler le **presenter** dans le contrôleur permet de **respecter le principe de séparation des responsabilités** et d'assurer un découplage clair entre les couches. Dans cet exemple, le **Use Case** se concentre uniquement sur la logique métier, sans se préoccuper de la manière dont les résultats seront formatés ou présentés à l'utilisateur. Cela apporte plusieurs avantages:

1. **Séparation des préoccupations**:

Le **Use Case** (dans UpdateRoomPrice) s'occupe exclusivement de traiter les règles métier et de transmettre les données via une interface définie (par exemple, `set`).
Le **Presenter** est responsable de la mise en forme des données pour l'utilisateur (par exemple, transformer les données en JSON ou tout autre format).

2. **Flexibilité et réutilisabilité**:

En isolant le **Presenter**, vous pouvez facilement changer ou ajouter des formats de présentation (HTML, XML, JSON, etc.) sans impacter la logique métier.

3. **Contrôle explicite dans le contrôleur**:

Le contrôleur gère les détails de la présentation et peut, par exemple, choisir quel format de **Presenter** utiliser en fonction de la requête (JSON pour une API, HTML pour une page Web).

4. **Testabilité accrue**:

En découplant le **Presenter** et en l'injectant explicitement, il devient facile de tester le **Use Case** indépendamment de la logique de présentation. De même, le **Presenter** peut être testé séparément pour vérifier qu'il formate correctement les données.

5. **Respect du principe de dépendance inversée (D de SOLID)**:

Le **Use Case** dépend d'une abstraction (RoomPresenter ou similaire) et non d'une implémentation spécifique. Cela garantit que les changements dans le format de présentation n'affectent pas la logique métier.

---

### 7. Conteneur: `Container`

```ts
// business/container/container.ts
import { UpdateRoomPrice, updateRoomPriceFactory } from "../business/use-cases/update-room-price"
import { RoomRepository } from "../controller/gateway/room.repository"

interface Container {
    UpdateRoomPrice: UpdateRoomPrice
}

export const createContainer = (): Container => {
    return {
        UpdateRoomPrice: updateRoomPriceFactory(new RoomRepository([
            {
                floor: 0,
                number: 1,
                price: 0,
            },
            {
                floor: 1,
                number: 2,
                price: 0,
            },
            {
                floor: 2,
                number: 3,
                price: 0,
            },
            {
                floor: 3,
                number: 4,
                price: 0,
            }
        ]))
    }
}
```

Le **conteneur** centralise la configuration et l'instanciation des dépendances de l'application. En utilisant createContainer, toutes les relations entre les cas d'utilisation (UpdateRoomPrice) et leurs dépendances (ex.: RoomRepository) sont définies en un seul endroit.

---

### 8. Test: `CalculateOrderTotal Test`

```ts
// update-price.test.ts
import assert from "assert";
import { describe, test } from "mocha";
import { createContainer } from "./container/container";
import { RoomPresenterJson } from "./controller/presenter/room-presenter.json";

describe('Update price', () => {
    test('Update room number 1 price to 100', async () => {
        // Given
        const container = createContainer()
        const presenter = new RoomPresenterJson()

        // When
        await container.UpdateRoomPrice(100, presenter);

        // Then
        const value = presenter.format()
        assert.deepStrictEqual(value, [
            { "number": 1, "price": 100, "floor": 0 },
            { "number": 2, "price": 107, "floor": 1 },
            { "number": 3, "price": 122, "floor": 2 },
            { "number": 4, "price": 133, "floor": 3 },
        ]);
    });
})
```

Ce test est essentiel car il vérifie que la logique métier de mise à jour des prix des chambres fonctionne correctement, en appliquant les règles spécifiques définies, comme les facteurs par étage ou la limite maximale de prix. Grâce à la Clean Architecture, il est facile à écrire et à maintenir, car les dépendances sont bien séparées. L'utilisation d'un conteneur pour injecter les cas d'utilisation (UpdateRoomPrice) et d'un presenter comme RoomPresenterJson permet de simuler le comportement complet sans nécessiter de détails techniques lourds, comme une vraie base de données. Cela rend le test rapide, clair et ciblé sur le métier.

---

## Pourquoi la Screaming Architecture Est Utile Ici

Dans cet exemple, la Screaming Architecture est utilisée pour refléter le métier:
- Les noms des fichiers (`Order`, `CalculateOrderTotal`) décrivent clairement leur rôle métier.
- Les responsabilités sont isolées et alignées avec les besoins métier.
- Une duplication raisonnable (comme les interfaces et classes spécifiques à chaque couche) permet de garder le code clair et compréhensible.

---

## Conclusion: Une Architecture Centrée Sur Le Métier

À travers cette série, nous avons exploré les principes fondamentaux de l'architecture logicielle, en passant des bases aux concepts avancés de la **Clean Architecture**. L'objectif principal a toujours été de **placer le métier au centre**, tout en isolant les aspects techniques pour garantir une application modulaire, testable et évolutive.

La **Clean Architecture** incarne cette vision en structurant le code en couches indépendantes, où chaque couche a une responsabilité unique et des dépendances strictement orientées vers le domaine métier. Elle nous enseigne que les frameworks, bases de données et interfaces utilisateurs ne doivent jamais dicter l'organisation du code. Au contraire, ces détails techniques doivent s'adapter à une architecture où le métier, représenté par des entités et des cas d'utilisation, reste immuable et autonome.

En adoptant ces principes, vous pouvez construire des applications robustes qui:

- **Évoluent facilement** pour répondre aux nouveaux besoins métier.
- **Restent maintenables** malgré la complexité croissante.
- **Encouragent la collaboration** entre développeurs grâce à une structure claire et bien définie.

Cette approche nécessite de la rigueur et parfois des choix plus complexes au début, mais elle offre une résilience inestimable face aux changements technologiques et organisationnels. En fin de compte, une architecture bien pensée est celle qui valorise ce qui importe le plus: **la logique métier et la valeur qu'elle apporte à l'utilisateur**.

Merci d'avoir suivi cette série. J'espère qu'elle vous aura permis de mieux comprendre comment concevoir des architectures logicielles élégantes et solides, tout en gardant le métier comme boussole principale. À vous de bâtir le futur! 🚀
