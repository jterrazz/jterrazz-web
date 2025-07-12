![](assets/thumbnail.jpg)

# Design Applicatif: Parlons Dépendances

## Au Cœur Du Réacteur De Votre Code

Pour moi, si vous ne deviez maîtriser qu'un seul concept en architecture logicielle, ce serait celui-là: les dépendances. Ce sont les fils invisibles qui relient tout votre code. C'est ce qui détermine comment les différentes parties de votre application interagissent. Maîtrisez-les, et vous pouvez construire n'importe quoi. Ratez-vous, et vous ne faites que préparer un futur cauchemar.

Comprendre et dompter ces dépendances est la clé pour bâtir des applications solides, faciles à maintenir et prêtes à évoluer.

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

## C'est Quoi, Une Dépendance?

C'est simple. Une dépendance existe quand un changement dans un bout de code (B) vous force à changer un autre bout de code (A). Autrement dit, **A dépend de B si, en cassant B, vous cassez aussi A.**

Regardons un exemple tout bête en TypeScript:

```ts
function hello() {
  const instance = new Something(); // Ici, on a une dépendance.
  // …
}
```

Dans ce code, ma fonction `hello` est directement liée à la classe `Something`. Si je modifie `Something` (par exemple, son constructeur demande un nouveau paramètre), ma fonction `hello` est cassée. Je suis obligé de la mettre à jour. Voilà une dépendance en action.

### Le Sens De la Dépendance

Le sens de cette dépendance est crucial. Pour que ce soit limpide, je me pose toujours une seule question: **Si je coupe le fil entre deux fichiers, lequel arrête de fonctionner?**

Dans notre exemple, si je supprime la classe `Something`, la fonction `hello` est bonne pour la poubelle. Elle ne peut plus tourner. Donc, `hello` dépend de `Something`, et pas l'inverse.

---

## Comment Dompter Les Dépendances Dans Vos Tests Avec Les Doublures

Les dépendances, c'est l'enfer pour les tests. On a tous connu ça. Vous écrivez un test pour une fonction simple, mais il échoue parce qu'il n'arrive pas à se connecter à la base de données. Le problème, ce n'est pas votre code, c'est l'environnement. C'est là que vos tests deviennent fragiles et inutiles.

Pour régler ça, on utilise ce que Martin Fowler appelle des **doublures de test** (*test doubles*). Ce sont des remplaçants pour vos vraies dépendances, qui vous permettent de tester votre code en isolation.

Voici les principaux types:

### Catégorie 1: Les Doublures Qui **retournent Des valeurs**

1. **Dummy (Le Figurant)**:
		Un objet factice que vous passez juste pour que le code tourne. Il n'est pas vraiment utilisé.

*Exemple*: Une fonction a besoin d'un objet `User`, mais on se fiche de savoir lequel. On lui passe un `DummyUser` juste pour qu'elle soit contente.

```ts
function greet(user: User) {
    console.log(`Hello, ${user.name}`);
}
greet(new DummyUser());
```

2. **Fake (Le Trucage)**:
		Une fausse implémentation qui fonctionne, mais qui est simplifiée. L'exemple classique, c'est la base de données en mémoire que vous utilisez pour les tests au lieu d'une vraie BDD. Ça marche, mais ce n'est pas pour la prod.

3. **Stub (La Réponse Automatique)**:
		Un objet qui renvoie des réponses codées en dur. Vous l'utilisez quand votre test a besoin d'une réponse spécifique d'une dépendance pour continuer.

*Exemple*:

```ts
class StubUserService {
	getUser() {
		// Renvoie toujours la même chose.
		return { id: 1, name: "Test User" };
	}
}
const userService = new StubUserService();
```

### Catégorie 2: Les Doublures Qui **vérifient Un comportement**

1. **Spy (L'Espion)**:
		Un espion, c'est un mouchard. Il observe comment une dépendance est utilisée et prend des notes. Après le test, vous pouvez vérifier ses notes. "Est-ce que ma fonction a bien appelé `logger.log` trois fois?". L'espion vous le dira.

*Exemple*:

```ts
class SpyLogger {
	logs: string[] = [];
	log(message: string) {
		this.logs.push(message);
	}
}
```

2. **Mock (L'Exigeant)**:
		Le mock, c'est un espion avec des attentes. Vous lui dites *à l'avance* ce qu'il doit voir. Il sait quelles méthodes doivent être appelées, avec quels arguments, et dans quel ordre. Le test ne passe que si toutes ses attentes sont satisfaites.

*Exemple*:

```ts
// Avec une librairie comme Jest
const mockLogger = { log: jest.fn() };
mockLogger.log("Test log");
// On peut maintenant vérifier que mockLogger.log a été appelé correctement.
```

---

## L'Arme Secrète: Le Principe d'Inversion Des Dépendances (DIP)

C'est le "D" de **SOLID**, et pour moi, c'est l'une des idées les plus puissantes en design logiciel. Le principe est le suivant: les modules de haut niveau ne doivent pas dépendre des modules de bas niveau. **Les deux doivent dépendre d'abstractions.**

En clair: votre logique métier principale ne devrait pas dépendre de détails techniques comme une base de données ou un framework spécifique. Au lieu de ça, les deux dépendent d'un contrat (une interface). Ça "inverse" le flux de dépendance habituel et ça vous donne une flexibilité incroyable.

### Petit Rappel Des Principes SOLID

Ces cinq principes sont les piliers d'une bonne conception orientée objet.

1. **S - Single Responsibility Principle (SRP)**:
		Une classe ne doit avoir qu'une seule raison de changer. Ne mélangez pas vos règles métier avec votre code de base de données. Gardez les choses simples.

2. **O - Open/Closed Principle (OCP)**:
		Votre code doit être **ouvert à l'extension**, mais **fermé à la modification**. Vous devriez pouvoir ajouter des fonctionnalités sans réécrire le code qui fonctionne déjà. Pensez "plugins".

3. **L - Liskov Substitution Principle (LSP)**:
		Si une classe `Carré` hérite de `Rectangle`, vous devez pouvoir utiliser `Carré` partout où vous utilisiez `Rectangle` sans que ça explose. Ça garantit que votre héritage a du sens.

4. **I - Interface Segregation Principle (ISP)**:
		Ne forcez pas une classe à implémenter des méthodes dont elle n'a pas besoin. Préférez des petites interfaces spécifiques. Une interface `Oiseau` ne devrait pas avoir de méthode `nager()`.

5. **D - Dependency Inversion Principle (DIP)**:
		On vient de le dire: faites dépendre votre logique de haut niveau d'abstractions, pas de détails concrets de bas niveau. Ça découple votre code et le rend beaucoup plus facile à tester et à faire évoluer.

---

## Comment Mettre Ça En Pratique Avec l'Inversion De Contrôle (IoC)

Alors, comment on applique ce fameux principe d'inversion? Avec un pattern appelé **Inversion de Contrôle (IoC)**.

Au lieu qu'une classe crée ses propres dépendances (comme sa connexion à la base de données), on "inverse le contrôle" et on laisse quelqu'un d'autre lui fournir cette dépendance de l'extérieur. C'est ce qu'on fait généralement avec l'**Injection de Dépendances**.

Voyons ça en action.

### Avant: Le Couplage Fort

Ici, ma classe `HelloService` est directement responsable de créer sa propre instance de `Database`. C'est un lien très fort. Je ne peux pas tester `HelloService` sans une vraie base de données.

```ts
class HelloService {
  private db: Database;

  constructor() {
    // Ma classe crée sa propre dépendance. Mauvaise idée.
    this.db = new Database(); // Couplage fort
  }

  sayHello() {
    return this.db.getGreeting();
  }
}
```

### Après: La Liberté Avec Le Couplage Faible

Maintenant, `HelloService` demande simplement une `Database` dans son constructeur. Elle ne sait pas comment elle a été créée et elle s'en moque. Je peux lui passer une vraie BDD en production ou une fausse pour mes tests. C'est la liberté!

```ts
class HelloService {
  private db: Database;

  // La dépendance est "injectée" de l'extérieur.
  constructor(db: Database) { // Injection de dépendance
    this.db = db;
  }

  sayHello() {
    return this.db.getGreeting();
  }
}
```

---

Maîtriser les dépendances, c'est un vrai *game-changer*. Quand vous apprenez à contrôler le flux, à utiliser des principes comme le DIP et des patterns comme l'IoC, vous pouvez construire des systèmes robustes, testables et prêts pour l'avenir.

Dans le prochain chapitre, on verra comment ces idées s'assemblent dans une architecture complète, comme l'architecture hexagonale.

[Prochain Article](https://www.jterrazz.com/articles/11-software-design-2-hexagonal-architecture)
