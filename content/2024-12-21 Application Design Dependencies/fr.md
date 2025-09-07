![](assets/thumbnail.jpg)

# Conception applicative: maîtriser le flux des dépendances

## Les liens qui tissent votre code

Les dépendances sont les fils invisibles qui tissent la toile de votre application. Chaque morceau de code qui en appelle un autre crée une dépendance. Pour moi, la compréhension de ces connexions est la compétence la plus fondamentale en architecture logicielle. Maîtrisez-la, et vous pourrez tout construire. Ignorez-la, et ce sont des lendemains cauchemardesques que vous préparez.

Car c'est bien cette maîtrise qui nous permet de bâtir des logiciels flexibles, simples à tester et prêts à évoluer.

---

# Mais au fait, qu'est-ce qu'une dépendance?

C'est très simple. On parle de dépendance dès qu'un changement dans une partie du code vous oblige à en modifier une autre. Dit autrement: **le code A dépend du code B si casser B, c'est aussi casser A.**

Prenons un exemple ultra-basique en TypeScript:

```ts
function hello() {
	const instance = new Something(); // Juste ici. C'est une dépendance.
	// …
}
```

Dans cet extrait, ma fonction `hello` est directement liée à la classe `Something`. Si je modifie cette dernière–par exemple, si son constructeur exige désormais un argument–ma fonction `hello` ne compilera plus. Je devrai la mettre à jour. Voilà une dépendance en action.

## Le sens de la dépendance

La direction de cette dépendance est un point crucial. Pour y voir clair, je me pose toujours la même question: **si je supprime le lien entre deux éléments, lequel cesse de fonctionner?**

Dans notre exemple, si je supprime la classe `Something`, la fonction `hello` est paralysée, incapable de s'exécuter. Donc, `hello` dépend de `Something`, et non l'inverse.

---

# Dompter les dépendances dans vos tests avec les doublures

Les dépendances sont un véritable casse-tête lorsqu'il s'agit de tester. Nous sommes tous passés par là. Vous écrivez un test pour une fonction simple, mais il échoue parce qu'il ne parvient pas à se connecter à la base de données. Le problème ne vient pas de votre code, mais de l'environnement. C'est précisément là que vos tests deviennent fragiles, voire inutiles.

Pour résoudre ce problème, on utilise ce que Martin Fowler appelle des **test doubles**. Il s'agit de substituts qui prennent la place de vos vraies dépendances, vous permettant de tester votre code en vase clos.

Voici les principaux types:

## Catégorie 1: les doublures qui **retournent des valeurs**

1. **Dummy**:
    Un simple figurant que l'on passe pour que le code s'exécute, mais qui n'est jamais vraiment utilisé.

    *Exemple:* Une fonction a besoin d'un objet `User`, mais peu importe lequel.

    ```ts
    function greet(user: User) {
      console.log(`Hello, ${user.name}`);
    }

    // On a juste besoin de *quelque chose* à passer.
    greet(new DummyUser());
    ```

2. **Fake**:
    Une implémentation fonctionnelle mais simplifiée d'une dépendance. L'exemple-type est la base de données en mémoire utilisée pour les tests à la place d'une vraie. Elle fonctionne, mais n'est pas taillée pour la production.

3. **Stub**:
    Un objet qui se contente de retourner des valeurs prédéfinies. On l'utilise quand un test a besoin d'une réponse spécifique d'une dépendance pour pouvoir continuer.

    *Exemple:*

    ```ts
    class StubUserService {
        getUser() {
            // Retourne toujours la même chose.
            return { id: 1, name: "Test User" };
        }
    }
    const userService = new StubUserService();
    ```

## Catégorie 2: les doublures qui **vérifient un comportement**

1. **Spy**:
    Un *spy* (espion) est un wrapper qui observe comment une dépendance est utilisée. Il enregistre tous les appels pour que vous puissiez les vérifier après coup. " Ma fonction a-t-elle bien appelé `logger.log` trois fois? " Un *spy* peut vous l'affirmer.

    *Exemple:*

    ```ts
    class SpyLogger {
        logs: string[] = [];
        log(message: string) {
            this.logs.push(message);
      }
    }
    ```

2. **Mock**:
    Le *mock* est un espion, mais avec des attentes prédéfinies. Vous lui indiquez *à l'avance* ce que vous attendez de lui: quelles méthodes doivent être appelées, avec quels arguments et dans quel ordre. Le test ne réussit que si ce scénario est parfaitement respecté.

    *Exemple:*

    ```ts
    // Avec une bibliothèque comme Jest
    const mockLogger = { log: jest.fn() };
    mockLogger.log("Test log");
    // Vous pouvez maintenant vérifier que mockLogger.log a été appelé correctement.
    ```

---

# L'arme secrète: le principe d'inversion des dépendances (DIP)

C'est le " D " de **SOLID**, et pour moi, l'une des idées les plus puissantes en conception logicielle. Le principe est le suivant: les modules de haut niveau ne doivent pas dépendre des modules de bas niveau. **Les deux doivent dépendre d'abstractions.**

Pour le dire simplement: votre cœur de métier ne devrait pas être enchaîné à des détails techniques comme une base de données ou un framework spécifique. À la place, tous deux devraient s'appuyer sur un contrat (une interface, par exemple). Cette approche inverse le flux de dépendance traditionnel et vous offre une flexibilité incroyable.

## Petit rappel des principes SOLID

Ces cinq principes constituent le socle d'une bonne conception orientée objet.

1. **S - Single Responsibility Principle (SRP):**
    L'idée: une classe doit avoir une seule et unique raison d'exister, une seule raison de changer. Ne mélangez pas vos règles métier avec votre code d'accès à la base de données. Gardez les choses propres.

2. **O - Open/Closed Principle (OCP):**
    Votre code doit être **ouvert à l'extension**, mais **fermé à la modification**. Vous devriez pouvoir ajouter de nouvelles fonctionnalités sans réécrire le code existant et fonctionnel. Imaginez un système de plugins.

3. **L - Liskov Substitution Principle (LSP):**
    Si une classe `Square` hérite d'une classe `Rectangle`, vous devez pouvoir utiliser une instance de `Square` partout où une instance de `Rectangle` est attendue, sans rien casser. Ce principe garantit un héritage sensé et prévisible.

4. **I - Interface Segregation Principle (ISP):**
    Ne forcez pas une classe à implémenter des méthodes dont elle n'a pas besoin. Gardez vos interfaces petites et ciblées. Une interface `Bird` ne devrait pas imposer une méthode `swim()`.

5. **D - Dependency Inversion Principle (DIP):**
    On l'a déjà dit: faites en sorte que votre logique de haut niveau s'appuie sur des abstractions, et non sur des détails d'implémentation. Cela découple votre code et le rend infiniment plus facile à tester et à faire évoluer.

---

# Mettre tout ça en musique avec l'inversion de contrôle (IoC)

Alors, comment met-on ce principe en pratique? Grâce à un design pattern appelé **Inversion de Contrôle (IoC)**.

Plutôt que de laisser une classe créer ses dépendances, on inverse la charge: c'est une entité extérieure qui les lui fournit. Ce mécanisme prend vie le plus souvent grâce à l'**injection de dépendances** (Dependency Injection).

Voyons cela en action.

## Avant: le piège du couplage fort

Ici, `HelloService` est directement responsable de la création de sa propre instance de `Database`. Cela crée un lien indéfectible, un couplage serré. Impossible de tester `HelloService` sans une véritable base de données.

```ts
class HelloService {
	private db: Database;

	constructor() {
		// Mon service crée lui-même sa dépendance. Mauvaise idée.
		this.db = new Database(); // Couplage fort
	}

	sayHello() {
		return this.db.getGreeting();
	}
}
```

## Après: la liberté du couplage faible

Désormais, `HelloService` se contente de demander une instance de `Database` dans son constructeur. Elle ignore, et n'a pas à savoir, comment cette instance a été créée. Je peux ainsi lui passer une vraie base de données en production, ou une fausse pour mes tests. C'est ça, la liberté.

```ts
class HelloService {
	private db: Database;

	// La dépendance est « injectée » depuis l'extérieur.
	constructor(db: Database) { // Injection de dépendances
		this.db = db;
	}

	sayHello() {
		return this.db.getGreeting();
	}
}
```

---

Au final, prendre le contrôle de ses dépendances change la donne. Lorsque vous apprenez à maîtriser leur flux, à appliquer des principes comme le DIP et à exploiter des patterns comme l'IoC, vous pouvez bâtir des systèmes robustes, testables et prêts à évoluer face à l'imprévu. Comprendre ces principes est le fondement de la construction d'architectures logicielles avancées.

---

### Lire la suite dans cette série

1.  [Conception applicative: bâtir des logiciels conçus pour durer](https://www.jterrazz.com/articles/9-software-design-0-why-architecture-matters/fr)
2.  **Conception applicative: maîtriser le flux des dépendances**
3.  [Conception applicative: séparer le métier de la technique](https://www.jterrazz.com/articles/11-software-design-2-hexagonal-architecture/fr)
4.  [Conception applicative: un voyage au cœur de la clean architecture](https://www.jterrazz.com/articles/12-software-design-3-clean-architecture-in-practice/fr)
