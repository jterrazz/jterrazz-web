![](assets/thumbnail.jpg)

# Un voyage dans la clean architecture

## Aller au cœur de ce qui compte

Voici la grande idée qui a changé la façon dont je construis des logiciels : votre architecture ne devrait pas se soucier de votre base de données. Elle ne devrait pas se soucier de votre framework web. Elle ne devrait pas se soucier de votre UI. La seule chose dont elle devrait se soucier est ce que votre application _fait réellement_.

C'est la philosophie derrière la **Clean Architecture**. C'est une approche de conception qui place vos **cas d'utilisation** (use cases), la vraie valeur métier, au cœur même de votre système. Tout le reste n'est qu'un détail, menant à un système testable, maintenable, et indépendant de sa tuyauterie technique.

---

# À quoi ressemble la clean architecture en théorie

La Clean Architecture consiste à créer des couches indépendantes régies par un ensemble strict de règles sur la façon dont elles peuvent interagir. Imaginez une série de cercles concentriques.

1. **Entités** : Au cœur même. Ce sont vos règles métier à l'échelle de l'entreprise. La logique pure et non altérée qui définit votre business.
2. **Cas d'Utilisation (Use Cases)** : Cette couche entoure les entités. Elle contient les règles métier spécifiques à l'application. Elle orchestre le flux de données vers et depuis les entités pour atteindre un objectif spécifique (ex: "Enregistrer un Utilisateur" ou "Traiter un Paiement").
3. **Adaptateurs d'Interface** : C'est la couche de traduction. Elle prend les données du format le plus pratique pour les cas d'utilisation et les entités et les convertit au format le plus pratique pour le monde extérieur (comme une base de données ou le web).
4. **Frameworks et Pilotes (Drivers)** : La couche la plus externe. C'est là que vivent tous les détails : le framework web, la base de données, l'UI, etc. Ces trucs sont les plus susceptibles de changer.

La règle d'or est la **Règle de Dépendance** : toutes les dépendances doivent pointer vers l'intérieur. Votre UI peut dépendre de vos cas d'utilisation, mais vos cas d'utilisation ne savent _rien_ de l'UI. Votre logique métier est le roi, et elle n'est jamais, au grand jamais, détrônée par un détail technique.

![](assets/clean-architecture.jpg)

---

# Clean architecture vs. architecture hexagonale

Alors, comment cela se compare-t-il à l'Architecture Hexagonale dont nous venons de discuter ?

Elles sont construites sur exactement la même philosophie : **protéger la logique métier**. Je vois la Clean Architecture comme une version plus spécifique et opinionated (avec des opinions fortes) de l'Architecture Hexagonale.

- L'Architecture Hexagonale vous donne le "quoi" : séparez votre appli en un "intérieur" (domaine) et un "extérieur" (infrastructure) en utilisant des ports et des adaptateurs.
- La Clean Architecture vous donne un "comment" plus détaillé : elle définit explicitement des couches _au sein_ de la partie "intérieure" (Entités et Cas d'Utilisation) et fournit des règles plus strictes régissant leur interaction.

Voyez-le comme ça : l'Architecture Hexagonale a dessiné la carte. La Clean Architecture a ajouté les autoroutes et les panneaux de signalisation. Elle rend le chemin plus clair.

---

# Construisons-le : un exemple complet

La théorie c'est bien, mais le code c'est mieux. Construisons une petite partie d'une application de gestion d'hôtel. Le but est de mettre à jour les prix des chambres basés sur un nouveau prix de base et un ensemble de règles métier (ex: différents étages ont différents multiplicateurs de prix).

## Notre structure de fichiers

D'abord, regardons la structure du projet. C'est ce que Robert C. Martin appelle une "Screaming Architecture" (Architecture Hurlante), une où votre structure de dossiers hurle ce que l'application _fait_, pas quels frameworks elle utilise. Vous voyez `business`, `use-cases`, et `entity`. Vous ne voyez pas `models`, `views`, et `controllers` au niveau supérieur.

```sh
src/
├── business/
│ ├── entity/
│ │ └── floor.ts
│ │ └── room.ts
│ ├── gateway/
│ │ └── room.gateway.ts
│ ├── use-cases/
│ │ └── update-room-price.ts
├── container/
│ └── container.ts
├── controller/
│ ├── gateway/
│ │ └── room.repository.ts
│ ├── presenter/
│ │ └── room-presenter.json.ts
│ └── room.controller.ts
└── tests/
		└── update-price.test.ts
```

- `business/` : C'est le cœur de notre application. Toute la logique métier pure vit ici. Elle a zéro dépendance vers le monde extérieur.
- `controller/` : C'est notre couche d'adaptateur d'interface. Elle gère les détails désordonnés de la communication avec le monde extérieur (comme implémenter des passerelles et des présentateurs).
- `container/` : C'est notre usine d'assemblage. C'est là que nous câblons tout ensemble en utilisant l'injection de dépendance.
- `tests/` : Tests qui prouvent que notre logique métier fonctionne.

---

## 1. Les entités : `Floor` & `Room`

Les entités ne sont pas juste des conteneurs de données bêtes. Elles incarnent les règles métier les plus fondamentales, la logique qui reste vraie pour l'entreprise entière, peu importe l'application spécifique qui l'utilise.

```ts
// business/entity/floor.ts
export class Floor {
  constructor(public floor: number) {}

  // C'est une règle métier centrale.
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
import { Floor } from './floor';

export class Room {
  public floor: Floor;
  constructor(
    floorNumber: number,
    public number: number,
    public price: number,
  ) {
    this.floor = new Floor(floorNumber);
  }

  // Une autre règle métier centrale.
  setPrice(basePrice: number) {
    const calculatedPrice = basePrice * this.floor.getFactor();
    this.price = Math.min(Number(calculatedPrice.toFixed(2)), 200);
  }
}
```

**Pourquoi mettre la logique ici ?** Parce que la règle selon laquelle "le prix d'une chambre dépend de son étage" est une vérité fondamentale de notre activité hôtelière. En la mettant dans l'entité, nous nous assurons que cette règle est toujours appliquée, partout. Elle est encapsulée, réutilisable, et suit le Principe de Responsabilité Unique.

---

## 2. La passerelle (Gateway) : `RoomGateway`

La passerelle est une interface, un contrat défini par la couche métier qui dit : "J'ai besoin d'effectuer ces actions avec les chambres, mais je me fiche de _comment_ vous le faites." C'est une promesse que les couches externes doivent remplir.

```ts
// business/gateway/room.gateway.ts
export interface RoomDTO {
  floor: number;
  number: number;
  price: number;
}

// C'est le contrat.
export interface RoomGateway {
  updateRoomPrice(roomNumber: number, newPrice: number): Promise<void>;
  getRooms(): Promise<Array<RoomDTO>>;
}
```

Cette interface vit dans la couche `business`, assurant que la dépendance pointe vers l'intérieur. Les cas d'utilisation dépendront de cette abstraction, pas d'une classe de base de données concrète.

---

## 3. Le cas d'utilisation : `UpdateRoomPrice`

Le cas d'utilisation est la star du spectacle. Il représente une action unique et spécifique que l'application peut effectuer. Il orchestre les entités et utilise les passerelles pour communiquer avec le monde extérieur.

```ts
// business/use-cases/update-room-price.ts
import { Room } from '../entity/room';
import { RoomGateway } from '../gateway/room.gateway';

// Un autre contrat : comment le cas d'utilisation rapporte ses résultats.
export interface Presenter {
  set: (rooms: Array<Room>) => void;
}

// Le cas d'utilisation lui-même.
export type UpdateRoomPrice = (basePrice: number, presenter: Presenter) => Promise<void>;

// Une factory pour créer le cas d'utilisation et injecter ses dépendances.
export const updateRoomPriceFactory = (repository: RoomGateway) => {
  return async (basePrice: number, presenter: Presenter) => {
    if (basePrice < 0) {
      throw new Error('Amount cannot be negative');
    }
    const roomsDto = await repository.getRooms();
    const rooms = roomsDto.map((r) => new Room(r.floor, r.number, r.price));

    for (const room of rooms) {
      room.setPrice(basePrice); // Utilise la logique métier de l'entité.
      await repository.updateRoomPrice(room.number, room.price);
    }

    const updatedRooms = (await repository.getRooms()).map(
      (r) => new Room(r.floor, r.number, r.price),
    );

    // Passe les résultats au présentateur.
    presenter.set(updatedRooms);
  };
};
```

Ce code est de la pure logique métier. Il récupère les chambres, boucle dessus, dit à chaque chambre de mettre à jour son prix (en utilisant la méthode `setPrice` dans l'entité), et puis les sauvegarde. Il ne connaît rien aux bases de données, HTTP, ou JSON. Il parle juste à des abstractions (`RoomGateway`, `Presenter`).

---

## 4. L'implémentation de la passerelle : `RoomRepository`

Maintenant nous bougeons vers les couches externes. Le `RoomRepository` est notre implémentation concrète de l'interface `RoomGateway`. C'est là que vit le vrai code de base de données. Pour cet exemple, j'utilise juste un tableau en mémoire, mais c'est là que votre code `Prisma`, `TypeORM`, ou `node-postgres` irait.

```ts
// controller/gateway/room.repository.ts
import { RoomDTO, RoomGateway } from '../../business/gateway/room.gateway';

export class RoomRepository implements RoomGateway {
  constructor(private rooms: Array<RoomDTO>) {}

  async updateRoomPrice(roomNumber: number, newPrice: number): Promise<void> {
    const room = this.rooms.find((room) => room.number === roomNumber);
    if (!room) {
      throw new Error(`Failed to find room ${roomNumber}`);
    }
    room.price = newPrice;
    return Promise.resolve();
  }

  async getRooms(): Promise<Array<RoomDTO>> {
    return Promise.resolve(this.rooms);
  }
}
```

Cette classe remplit la promesse faite par l'interface `RoomGateway`.

---

## 5. L'implémentation du présentateur : `RoomPresenterJson`

Le job du présentateur est de prendre les objets d'entité purs du cas d'utilisation et de les traduire dans un format pour le monde extérieur. Ici, nous les formatons comme de simples objets JSON.

```ts
// controller/presenter/room-presenter.json.ts
import { Room } from '../../business/entity/room';

export class RoomPresenterJson {
  private r: Array<Room> = [];

  // Le cas d'utilisation appelle cette méthode.
  set(rooms: Array<Room>) {
    this.r = rooms;
  }

  // Le contrôleur appelle cette méthode pour obtenir la sortie finale.
  format() {
    return this.r.map((r) => ({
      floor: r.floor.floor,
      price: r.price,
      number: r.number,
    }));
  }
}
```

Cela crée une belle séparation. Le cas d'utilisation ne connaît pas JSON. Le contrôleur ne connaît pas les entités `Room`. Le présentateur est le pont.

---

## 6. Le contrôleur : `RoomController`

Le contrôleur est le point d'entrée depuis le web. Son seul job est de parser les requêtes entrantes, appeler le bon cas d'utilisation, et renvoyer la réponse formatée. C'est une couche fine et simple.

```ts
// controller/room.controller.ts
import { Request, Response } from 'express';
import { createContainer } from '../container/container';
import { RoomPresenterJson } from './presenter/room-presenter.json';

const express = require('express');
const app = express();

const container = createContainer();

app.put('/rooms', async (req: Request, res: Response) => {
  // 1. Créer un nouveau présentateur pour cette requête.
  const roomPresenterJson = new RoomPresenterJson();
  // 2. Obtenir le cas d'utilisation depuis notre conteneur et l'exécuter.
  await container.UpdateRoomPrice(200, roomPresenterJson);
  // 3. Envoyer le résultat formaté depuis le présentateur.
  res.send(roomPresenterJson.format());
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

Regardez comme c'est propre. Le contrôleur orchestre le flux mais contient zéro logique métier.

---

## 7. Le conteneur de dépendances

C'est là que tout s'assemble. Le conteneur est l'endroit unique où nous construisons nos objets et injectons leurs dépendances. C'est l'Inversion de Contrôle en action.

```ts
// container/container.ts
import { UpdateRoomPrice, updateRoomPriceFactory } from '../business/use-cases/update-room-price';
import { RoomRepository } from '../controller/gateway/room.repository';

interface Container {
  UpdateRoomPrice: UpdateRoomPrice;
}

export const createContainer = (): Container => {
  return {
    // Créer le cas d'utilisation, en injectant le repository concret.
    UpdateRoomPrice: updateRoomPriceFactory(
      new RoomRepository([
        // Données initiales pour notre repo en mémoire.
        { floor: 0, number: 1, price: 0 },
        { floor: 1, number: 2, price: 0 },
        { floor: 2, number: 3, price: 0 },
        { floor: 3, number: 4, price: 0 },
      ]),
    ),
  };
};
```

---

## 8. Le test : là où tout paye

Et maintenant pour la meilleure partie : regardez comme il est facile de tester notre logique métier centrale.

```ts
// tests/update-price.test.ts
import assert from 'assert';
import { describe, test } from 'mocha';
import { createContainer } from '../container/container';
import { RoomPresenterJson } from '../controller/presenter/room-presenter.json';

describe('Update Room Price', () => {
  test('Update all room prices based on a base price of 100', async () => {
    // Étant donné (Given)
    const container = createContainer();
    const presenter = new RoomPresenterJson();

    // Quand nous lançons le cas d'utilisation (When)
    await container.UpdateRoomPrice(100, presenter);

    // Alors nous vérifions la sortie du présentateur (Then)
    const value = presenter.format();
    assert.deepStrictEqual(value, [
      { number: 1, price: 100, floor: 0 }, // 100 * 1
      { number: 2, price: 107, floor: 1 }, // 100 * 1.07
      { number: 3, price: 122, floor: 2 }, // 100 * 1.22
      { number: 4, price: 133, floor: 3 }, // 100 * 1.33
    ]);
  });
});
```

Ce test est rapide comme l'éclair. Il tourne en mémoire. Il n'a pas besoin de base de données ou de serveur web. Il teste notre processus métier entier de bout en bout, prouvant que notre logique est correcte, tout ça parce que nous avons si soigneusement séparé nos préoccupations. C'est la récompense.

---

# Conclusion : construisez pour le métier, pas la tech

La leçon derrière la Clean Architecture est simple mais profonde : **mettez votre logique métier en premier.**

Les frameworks changeront. Les bases de données seront remplacées. Les interfaces utilisateurs seront redesignées. Mais vos règles métier centrales sont ce qui fournit une valeur durable. La Clean Architecture n'est pas juste un pattern ; c'est une philosophie qui vous force à protéger cette valeur.

Elle demande de la discipline et un peu plus de réflexion au début, mais la récompense est un système qui est testable, maintenable, flexible et compréhensible, un qui peut évoluer _avec_ le business, pas le retenir.

Maintenant allez construire quelque chose de grand. 🚀

---

### Lire la suite de cette série

1.  [Conception d'application : construire des logiciels qui durent](https://www.jterrazz.com/articles/9-software-design-0-why-architecture-matters)
2.  [Conception d'application : maîtriser le flux des dépendances](https://www.jterrazz.com/articles/10-software-design-1-mastering-dependencies)
3.  [Conception d'application : séparer le métier de la technologie](https://www.jterrazz.com/articles/11-software-design-2-hexagonal-architecture)
4.  **Conception d'application : un voyage dans la clean architecture**
