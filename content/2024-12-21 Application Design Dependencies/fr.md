![](assets/thumbnail.jpg)

# Les dépendances

## Les fils invisibles de votre code

Les dépendances maintiennent votre application ensemble. Chaque morceau de code qui parle à un autre en crée une. Pour moi, comprendre ces connexions est *la* compétence clé en architecture. Maîtrisez ça, et vous pouvez construire n'importe quoi. Échouez, et c'est un cauchemar garanti.

Maîtriser les dépendances = logiciels flexibles, testables, évolutifs.

---

# C'est quoi une dépendance ?

Simple : une dépendance existe quand un changement dans un code force un changement dans un autre. **A dépend de B si casser B casse A.**

Exemple TypeScript basique :

```ts
function hello() {
    const instance = new Something(); // Juste ici. C'est une dépendance.
    // …
}
```

Dans cet extrait, ma fonction `hello` est directement liée à la classe `Something`. Si je modifie la classe `Something` — disons que son constructeur nécessite maintenant un argument — ma fonction `hello` casse. Elle doit être mise à jour. C'est une dépendance en action.

## Le sens compte

La direction est cruciale. Question clé : **si je supprime la connexion, lequel casse ?**

Dans l'exemple, supprimer `Something` tue `hello`. Donc `hello` dépend de `Something`, pas l'inverse.

---

# Dompter les dépendances dans les tests

Les dépendances rendent les tests galère. Test qui échoue parce qu'il ne peut pas se connecter à la BDD — le problème n'est pas le code, c'est l'environnement. Tests fragiles, inutiles.

Solution : les **doublures de test** (test doubles). Des substituts qui permettent de tester en isolation.

Types principaux :

## Catégorie 1 : Doublures qui **retournent des valeurs**

**Dummy (Fantôme) :**
Un placeholder que vous passez juste pour faire tourner le code. Il n'est pas réellement utilisé.

*Exemple :* Une fonction a besoin d'un objet `User`, mais vous vous fichez duquel.

```ts
function greet(user: User) {
  console.log(`Bonjour, ${user.name}`);
}

// On a juste besoin de *quelque chose* à passer.
greet(new DummyUser());
```

**Fake (Faux) :**
Une implémentation simplifiée mais fonctionnelle d'une dépendance. L'exemple classique est une base de données en mémoire que vous utilisez pour les tests au lieu d'une vraie. Ça fonctionne, mais ce n'est pas pour la production.

**Stub (Bouchon) :**
Un objet qui retourne simplement des valeurs codées en dur. Vous l'utilisez quand votre test a besoin d'une réponse spécifique d'une dépendance pour continuer.

*Exemple :*

```ts
class StubUserService {
    getUser() {
        // Retourne toujours la même chose.
        return { id: 1, name: "Test User" };
    }
}
const userService = new StubUserService();
```

## Catégorie 2 : Doublures qui **vérifient le comportement**

**Spy (Espion) :**
Un spy est un wrapper qui observe comment une dépendance est utilisée. Il enregistre tous les appels pour que vous puissiez les vérifier après l'exécution de votre test. "Est-ce que ma fonction a appelé `logger.log` trois fois ?" Un spy peut vous le dire.

*Exemple :*

```ts
class SpyLogger {
    logs: string[] = [];
    log(message: string) {
        this.logs.push(message);
  }
}
```

**Mock (Simulacre) :**
Un mock est comme un spy, mais plus intelligent. Vous lui dites *à l'avance* ce qu'il doit attendre. Il sait quelles méthodes doivent être appelées, avec quels arguments, et dans quel ordre. Le test ne passe que si les attentes du mock sont satisfaites.

*Exemple :*

```ts
// En utilisant une bibliothèque comme Jest
const mockLogger = { log: jest.fn() };
mockLogger.log("Test log");
// Maintenant vous pouvez vérifier que mockLogger.log a été appelé correctement.
```

---

# L'arme secrète : le principe d'inversion des dépendances (DIP)

C'est le "D" de **SOLID**, et pour moi, c'est l'une des idées les plus puissantes en conception logicielle. Le principe est : les modules de haut niveau ne doivent pas dépendre des modules de bas niveau. **Les deux doivent dépendre d'abstractions.**

En termes simples, votre logique métier centrale ne doit pas dépendre de détails techniques comme une base de données ou un framework spécifique. Au lieu de cela, les deux doivent dépendre d'un contrat (comme une interface). Cela "inverse" le flux de dépendances typique et vous donne une flexibilité incroyable.

## Petit rappel SOLID

Ces cinq principes sont le fondement d'une bonne conception orientée objet.

1. **S - Single Responsibility Principle (SRP) :**
   Une classe ne doit avoir qu'une seule responsabilité, une seule raison de changer. Ne mélangez pas vos règles métier avec votre code de base de données. Gardez les choses propres.

2. **O - Open/Closed Principle (OCP) :**
   Votre code doit être **ouvert à l'extension** mais **fermé à la modification**. Vous devez pouvoir ajouter de nouvelles fonctionnalités sans réécrire du code existant qui fonctionne. Pensez plugins.

3. **L - Liskov Substitution Principle (LSP) :**
   Si vous avez une classe `Carré` qui hérite de `Rectangle`, vous devez pouvoir utiliser `Carré` partout où vous utilisez `Rectangle` sans rien casser. Cela garantit que l'héritage a du sens.

4. **I - Interface Segregation Principle (ISP) :**
   Ne forcez pas les classes à implémenter des méthodes dont elles n'ont pas besoin. Gardez vos interfaces petites et focalisées. Une interface `Oiseau` ne devrait pas avoir de méthode `nager()`.

5. **D - Dependency Inversion Principle (DIP) :**
   Comme nous l'avons vu : dépendez des abstractions, pas des détails concrets de bas niveau. Cela découple votre logique centrale de sa plomberie technique, la rendant bien plus facile à tester et à modifier.

---

# Mettre en pratique avec l'inversion de contrôle (IoC)

Alors comment implémente-t-on concrètement l'inversion des dépendances ? À travers un pattern appelé **inversion de contrôle (IoC)**.

Au lieu qu'une classe crée ses propres dépendances (comme une connexion à la base de données), vous "inversez le contrôle" et faites en sorte que quelque chose d'autre fournisse cette dépendance de l'extérieur. Cela se fait généralement par **injection de dépendances**.

Voyons cela en action.

## Avant : un amas de couplage fort

Ici, mon `HelloService` est directement responsable de créer sa propre instance de `Database`. Cela forge un lien étroit, rendant impossible de tester `HelloService` sans une vraie base de données.

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

## Après : la liberté grâce au couplage faible

Maintenant, `HelloService` demande simplement une `Database` dans son constructeur. Il ne sait pas et ne se soucie pas de comment elle a été créée. Je peux facilement passer une vraie base de données en production ou une fausse pour mes tests. C'est la liberté.

```ts
class HelloService {
    private db: Database;

    // La dépendance est "injectée" de l'extérieur.
    constructor(db: Database) { // Injection de dépendances
        this.db = db;
    }

    sayHello() {
        return this.db.getGreeting();
    }
}
```

---

Maîtriser les dépendances change la donne. Quand vous apprenez à contrôler ce flux, à appliquer des principes comme le DIP, et à utiliser des patterns comme l'IoC, vous commencez à construire des systèmes robustes, testables et prêts à affronter tout ce que l'avenir leur réserve. Comprendre ces principes est le fondement pour construire des architectures logicielles avancées.
