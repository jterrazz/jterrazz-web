![](assets/thumbnail.jpg)

# Le Concept De Dépendances - Chapitre 1

Les dépendances sont au cœur de l'architecture logicielle. Elles déterminent la manière dont les différents morceaux de code interagissent et se connectent les uns aux autres. Bien comprendre et maîtriser ces dépendances est crucial pour construire des applications robustes, maintenables et évolutives.

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

## Comprendre Une Dépendance

Une dépendance existe lorsqu'un morceau de code (A) est directement affecté par les changements d'un autre morceau de code (B). En d'autres termes, **A dépend de B si, lorsque B change, A doit également changer**.

Prenons un exemple concret en TypeScript:

```ts
function hello() {
  const instance = new Something(); // Alors la dépendance existe
  // ...
}
```

Dans cet exemple, la fonction `hello` dépend de la classe `Something`. Si `Something` change (par exemple, si son constructeur nécessite de nouveaux paramètres), `hello` devra aussi être modifiée.

### La Direction De la Dépendance

Le **sens** de la dépendance est fondamental à comprendre. Posez-vous cette question: **Si on coupe le lien entre deux fichiers, quel fichier ne fonctionne plus?** Dans l'exemple précédent, si l'on coupe `Something`, alors `hello` ne peut plus s'exécuter correctement. On dit donc que `hello` dépend de `Something`.

---

## Les Concepts De Doublures Pour Gérer Les Dépendances Dans Les Tests

Lors de la création de tests, les dépendances peuvent compliquer la validation du code. Imaginez une fonction qui dépend d'une base de données. Si la base est inaccessible, votre test échoue, même si le problème vient de l'environnement et non de votre code.

Martin Fowler propose plusieurs concepts pour gérer ces dépendances grâce à des **doublures**. Voici un aperçu:

### Catégorie 1: Les Doublures Pour Les Retours (`DENOUEMENT`)

1. **Dummy**:<br/>
	 Un objet qui n'a aucune importance dans le test. On l'utilise simplement pour satisfaire une exigence.<br/>

	 *Exemple:*

```ts
function greet(user: User) {
  console.log(`Hello, ${user.name}`);
}
greet(new DummyUser());
```

2. **Fake**:
	 Un objet avec un faux comportement qui n'est pas utilisé en production.<br/>

	 *Exemple: une base de données en mémoire pour des tests unitaires.*

3. **Stub**:
	 Un objet qui retourne des valeurs prédéfinies pour permettre au test de fonctionner.<br/>

	 *Exemple:*

```ts
class StubUserService {
  getUser() {
    return { id: 1, name: "Test User" };
  }
}
const userService = new StubUserService();
```

### Catégorie 2: Les Doublures Pour la `COLLABORATION`

1. **Spy**:
	 Les espions enregistrent les interactions pour les vérifier après le test.<br/>
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
	 Un mock vérifie qu'il a été appelé d'une manière spécifique.<br/>
	 *Exemple:*

```ts
const mockLogger = { log: jest.fn() };
mockLogger.log("Test log");
```

---

## Le Principe D'inversion Des Dépendances (Dependency Inversion Principle)

Le principe d'inversion des dépendances (le "D" de **SOLID**) préconise que les modules de haut niveau ne doivent pas dépendre des modules de bas niveau. **Les deux doivent dépendre d'abstractions.**

### Les Principes SOLID En Bref

1. **S - Single Responsibility Principle (SRP)**:

Une classe ou un module doit avoir une seule responsabilité, c'est-à-dire une seule raison de changer. Cela permet de garder le code simple et clair.

*Exemple: Une classe ne devrait pas à la fois gérer les calculs métier et écrire dans une base de données.*

2. **O - Open/Closed Principle (OCP)**:

Les entités logicielles (classes, modules, fonctions) doivent être **ouvertes à l'extension** mais **fermées à la modification**. Cela signifie que vous pouvez ajouter de nouvelles fonctionnalités sans modifier le code existant.

*Exemple: Utiliser des interfaces ou des classes abstraites pour ajouter de nouvelles implémentations sans toucher au reste du code.*

3. **L - Liskov Substitution Principle (LSP)**:

Les classes dérivées doivent pouvoir être utilisées à la place des classes parentes sans modifier le comportement attendu. Ce principe garantit que l'héritage reste logique.

*Exemple: Si vous remplacez une classe "Rectangle" par une classe "Carré", votre programme ne devrait pas planter.*

4. **I - Interface Segregation Principle (ISP)**:

Les clients ne doivent pas être obligés de dépendre d'interfaces qu'ils n'utilisent pas. Il vaut mieux créer plusieurs petites interfaces spécifiques plutôt qu'une grosse interface générale.

*Exemple: Au lieu d'une interface `Animal` avec des méthodes `voler()` et `nager()`, vous pourriez avoir des interfaces séparées `Oiseau` et `Poisson`.*

5. **D - Dependency Inversion Principle (DIP)**:

**Les modules de haut niveau (qui contiennent la logique principale) ne doivent pas dépendre des modules de bas niveau (qui implémentent des détails techniques).** Les deux doivent dépendre d'abstractions (interfaces). Cela réduit le couplage et facilite les tests.

---

## Gestion Des Dépendances Avec L'inversion De Contrôle (IoC)

L'**inversion de contrôle** permet de déléguer la responsabilité de gérer les dépendances à une autre entité (comme un conteneur d'injection de dépendances). Cela favorise un couplage faible.

### Exemples De Mise En Œuvre En TypeScript

#### Avant: Couplage Fort

```ts
class HelloService {
  private db: Database;

  constructor() {
    this.db = new Database(); // Couplage fort
  }

  sayHello() {
    return this.db.getGreeting();
  }
}
```

#### Après: Couplage Faible Avec IoC

```ts
class HelloService {
  private db: Database;

  constructor(db: Database) { // Injection de dépendance
    this.db = db;
  }

  sayHello() {
    return this.db.getGreeting();
  }
}
```

---

La maîtrise des dépendances est une compétence essentielle pour tout développeur. En réduisant le couplage fort et en adoptant des principes comme l'inversion des dépendances et l'injection de dépendances, on peut concevoir des systèmes robustes, évolutifs et faciles à tester. Les concepts de doublures et les principes SOLID sont des outils précieux pour y parvenir. Passons maintenant à un nouveau concept: les architectures hexagonales.
