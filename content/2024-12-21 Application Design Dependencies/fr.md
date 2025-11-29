![](assets/thumbnail.jpg)

# Parlons des dépendances

## Comment votre code est connecté

Les dépendances sont les fils invisibles qui maintiennent toute votre application ensemble. Chaque morceau de code qui parle à un autre crée une dépendance. Pour moi, comprendre ces connexions est la compétence la plus importante en architecture logicielle. Si vous réussissez cela, vous pouvez tout construire. Si vous vous trompez, vous créez juste un futur cauchemar pour vous-même.

Maîtriser les dépendances est ce qui nous permet de construire des logiciels flexibles, faciles à tester et prêts à passer à l'échelle.

---

# Alors, qu'est-ce qu'*est* une dépendance ?

C'est simple : une dépendance existe chaque fois qu'un changement dans un morceau de code force un changement dans un autre. Voyez-le comme ça : **Le code A dépend du code B si casser B casse aussi A.**

Regardons un exemple TypeScript super basique :

```ts
function hello() {
	const instance = new Something(); // Juste ici. C'est une dépendance.
	// …
}
```

Dans cet extrait, ma fonction `hello` est directement liée à la classe `Something`. Si je change la classe `Something`, disons que son constructeur a maintenant besoin d'un argument, ma fonction `hello` casse. Elle doit être mise à jour. C'est une dépendance en action.

## Le flux de dépendance

La direction d'une dépendance est critique. Pour rendre ça parfaitement clair, je me pose toujours une question : **Si je supprime la connexion entre deux choses, laquelle arrête de fonctionner ?**

Dans notre exemple, si je supprime la classe `Something`, la fonction `hello` est coulée. Elle ne peut pas s'exécuter. Donc, `hello` dépend de `Something`, pas l'inverse.

---

# Comment dompter les dépendances dans vos tests avec les doublures de test

Les dépendances sont une énorme douleur quand il s'agit de tester. Nous sommes tous passés par là : vous écrivez un test pour une fonction simple, mais il échoue parce qu'il ne peut pas se connecter à la base de données. Le problème n'est pas votre code ; c'est l'environnement. C'est là que les tests deviennent fragiles et inutiles.

Pour résoudre cela, nous utilisons ce que Martin Fowler appelle des **doublures de test** (test doubles). Ce sont des remplaçants pour les vraies dépendances, vous permettant de tester votre code en isolation.

Voici les principaux types :

## Catégorie 1 : Doublures qui **renvoient des valeurs**

1. **Dummy (Fantôme)** :
		Un espace réservé que vous passez juste pour faire tourner le code. Il n'est pas réellement utilisé.

		*Exemple :* Une fonction a besoin d'un objet `User`, mais vous vous fichez duquel.

```ts
function greet(user: User) {
  console.log(`Hello, ${user.name}`);
}

// On a juste besoin de passer *quelque chose*.
greet(new DummyUser());
```

2. **Fake (Faux)** :
		Une implémentation simplifiée et fonctionnelle d'une dépendance. L'exemple classique est une base de données en mémoire que vous utilisez pour les tests au lieu d'une vraie. Ça marche, mais ce n'est pas pour la production.

3. **Stub (Bouchon)** :
		Un objet qui renvoie juste des valeurs codées en dur. Vous l'utilisez quand votre test a besoin d'une réponse spécifique d'une dépendance pour continuer.

*Exemple :*

```ts
class StubUserService {
    getUser() {
        // Renvoie toujours la même chose.
        return { id: 1, name: "Test User" };
    }
}
const userService = new StubUserService();
```

## Catégorie 2 : Doublures qui **vérifient le comportement**

1. **Spy (Espion)** :
		Un espion est une enveloppe qui surveille comment une dépendance est utilisée. Il enregistre tous les appels pour que vous puissiez les vérifier après l'exécution de votre test. "Est-ce que ma fonction a appelé `logger.log` trois fois ?" Un espion peut vous le dire.

*Exemple :*

```ts
class SpyLogger {
    logs: string[] = [];
    log(message: string) {
        this.logs.push(message);
  }
}
```

2. **Mock (Simulacre)** :
		Un mock est comme un espion, mais plus intelligent. Vous lui dites *à l'avance* à quoi s'attendre. Il sait quelles méthodes doivent être appelées, avec quels arguments, et dans quel ordre. Le test ne passe que si les attentes du mock sont satisfaites.

*Exemple :*

```ts
// En utilisant une librairie comme Jest
const mockLogger = { log: jest.fn() };
mockLogger.log("Test log");
// Maintenant vous pouvez affirmer que mockLogger.log a été appelé correctement.
```

---

# L'arme secrète : le principe d'inversion des dépendances (DIP)

C'est le "D" dans **SOLID**, et pour moi, c'est l'une des idées les plus puissantes en conception logicielle. Le principe est : les modules de haut niveau ne devraient pas dépendre des modules de bas niveau. **Les deux devraient dépendre d'abstractions.**

En termes simples, votre logique métier centrale ne devrait pas dépendre de détails techniques comme une base de données spécifique ou un framework. Au lieu de cela, les deux devraient dépendre d'un contrat (comme une interface). Cela "inverse" le flux de dépendance typique et vous donne une flexibilité incroyable.

## Un petit rappel SOLID

Ces cinq principes sont la fondation d'une bonne conception orientée objet.

1. **S - Principe de Responsabilité Unique (SRP) :**
		Une classe ne devrait avoir qu'un seul job, une seule raison de changer. Ne mélangez pas vos règles métier avec votre code de base de données. Gardez ça propre.

2. **O - Principe Ouvert/Fermé (OCP) :**
		Votre code devrait être **ouvert à l'extension** mais **fermé à la modification**. Vous devriez pouvoir ajouter de nouvelles fonctionnalités sans réécrire le code existant qui fonctionne. Pensez aux plugins.

3. **L - Principe de Substitution de Liskov (LSP) :**
		Si vous avez une classe `Carré` qui hérite de `Rectangle`, vous devriez pouvoir utiliser `Carré` partout où vous utilisez `Rectangle` sans rien casser. Cela assure que l'héritage a du sens.

4. **I - Principe de Ségrégation des Interfaces (ISP) :**
		Ne forcez pas les classes à implémenter des méthodes dont elles n'ont pas besoin. Gardez vos interfaces petites et focalisées. Une interface `Oiseau` ne devrait pas avoir une méthode `nager()`.

5. **D - Principe d'Inversion des Dépendances (DIP) :**
		Comme nous l'avons couvert : dépendez d'abstractions, pas de détails concrets et bas niveau. Cela découple votre logique centrale de sa tuyauterie technique, rendant le tout bien plus facile à tester et à changer.

---

# Faire en sorte que ça arrive avec l'inversion de contrôle (IoC)

Alors comment implémentez-vous réellement l'inversion des dépendances ? À travers un pattern appelé **inversion de contrôle (IoC)**.

Au lieu qu'une classe crée ses propres dépendances (comme une connexion à la base de données), vous "inversez le contrôle" et faites en sorte que quelque chose d'autre fournisse cette dépendance depuis l'extérieur. C'est généralement fait avec l'**injection de dépendance**.

Voyons cela en action.

## Avant : un désordre de couplage fort

Ici, mon `HelloService` est directement responsable de la création de sa propre instance `Database`. Cela forge un lien étroit, rendant impossible le test de `HelloService` sans une vraie base de données.

```ts
class HelloService {
	private db: Database;

	constructor() {
		// Mon service crée sa propre dépendance. Mauvaise idée.
		this.db = new Database(); // Couplage fort
	}

	sayHello() {
		return this.db.getGreeting();
	}
}
```

## Après : la liberté par le couplage faible

Maintenant, `HelloService` demande juste une `Database` dans son constructeur. Il ne sait pas et ne se soucie pas de comment elle a été créée. Je peux facilement passer une vraie base de données en production ou une fausse pour mes tests. C'est la liberté.

```ts
class HelloService {
	private db: Database;

	// La dépendance est "injectée" depuis l'extérieur.
	constructor(db: Database) { // Injection de dépendance
		this.db = db;
	}

	sayHello() {
		return this.db.getGreeting();
	}
}
```

---

Avoir une prise sur les dépendances change la donne. Quand vous apprenez à contrôler ce flux, appliquez des principes comme le DIP, et utilisez des patterns comme l'IoC, vous commencez à construire des systèmes qui sont robustes, testables, et prêts pour tout ce que le futur leur réserve. Comprendre ces principes est la fondation pour construire des architectures logicielles avancées.


