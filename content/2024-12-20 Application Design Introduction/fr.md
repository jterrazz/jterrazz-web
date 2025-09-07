![](assets/thumbnail.jpg)

# Conception applicative: bâtir des logiciels conçus pour durer

## L'architecture logicielle

J'ai participé à des projets où chaque tâche relevait du combat. Des changements simples prenaient des semaines, et corriger un bug en créait trois autres. La cause profonde n'est pratiquement jamais une simple ligne de code. Elle plonge ses racines bien plus profond. Elle réside dans les fondations mêmes du projet: son architecture.

Pour moi, l'architecture logicielle n'est pas un simple schéma technique. C'est l'ensemble des décisions critiques qui scellent l'avenir d'un projet. Il ne s'agit pas de se demander: " Où dois-je mettre ce fichier? ". La vraie question, celle qui compte, est: " Comment structurer ce système pour qu'il ne s'effondre pas sous son propre poids d'ici un an? "

Ces choix constituent l'ossature invisible de votre logiciel. Maîtrisez-les, et vous créerez un système capable de grandir, de s'adapter et de rester sain pour des années. Négligez-les, et vous ne ferez qu'accumuler de la dette technique. C'est tout l'enjeu de la **conception applicative** (*application design*): l'art pragmatique de bâtir des logiciels faits pour durer.

Cet article décortique ce que signifie réellement la conception applicative, pourquoi elle est si cruciale et comment nous en sommes arrivés là. Nous explorerons les principes et les pratiques qui permettent de construire des logiciels à la fois **maintenables** et **évolutifs** (*scalable*).

---

# Qu'est-ce que la conception applicative?

## Une réponse à un défi que nous connaissons tous

Imaginez une équipe de développeurs. Vous êtes sans doute déjà passé par là. Quelqu'un demande: " Où est-ce que je devrais mettre le code de cette nouvelle fonctionnalité? " ou " Est-ce la bonne façon de faire? Est-ce que ça tiendra la route dans six mois, quand il faudra tout modifier? "

Ces questions, loin d'être anodines, touchent au cœur du développement logiciel. Comment concevoir une fonctionnalité aujourd'hui sans semer les graines d'un cauchemar pour notre " nous " du futur?

La **conception applicative** est la réponse. C'est la discipline qui consiste à prendre des **décisions délibérées** sur:

- La structure de votre code.
- L'organisation des différents composants.
- La manière dont ces composants communiquent entre eux.

L'objectif est simple: créer des applications **maintenables** (faciles à comprendre, à corriger et à faire évoluer) et **évolutives** (prêtes à supporter la croissance et les nouvelles exigences).

![](assets/application-complexity.jpg)

---

# L'ennemi à dompter: la complexité

Développer un logiciel, c'est mener une bataille incessante contre la complexité. La première étape pour l'emporter est de connaître son ennemi. Je distingue trois grandes formes de complexité:

1. **La complexité essentielle**
    C'est la part irréductible, inhérente au problème que vous essayez de résoudre. Si vous développez une application bancaire, vous devez gérer les calculs d'intérêts et les règles de transaction. C'est le cœur du métier. C'est inévitable.

2. **La complexité technique**
    Celle-ci provient de vos outils: bases de données, frameworks, serveurs et toute la technologie nécessaire pour faire fonctionner le logiciel. C'est une composante inévitable de l'équation, mais elle doit être maîtrisée pour ne pas phagocyter l'ensemble du projet.

3. **La complexité accidentelle**
    Celle-ci, c'est la blessure que l'on s'inflige à soi-même. C'est la complexité que nous créons par de mauvais choix de conception. Pensez au code spaghetti, à l'utilisation abusive d'un framework juste parce que c'est possible, ou à une documentation inexistante. Contrairement aux autres, cette forme de complexité est évitable. Nous pouvons—et devons—l'éliminer.

![](assets/complexity-levels.svg)

Une bonne conception applicative vise donc à minimiser la complexité accidentelle, à garder la complexité technique sous contrôle et à concentrer toute votre énergie sur la maîtrise de la complexité essentielle.

---

# D'où venons-nous? Une brève histoire

Pour comprendre où en est la conception applicative aujourd'hui, un bref retour en arrière s'impose. Le chemin parcouru a été fulgurant.

- **Avant 2000: le Far West.**
    Le développement se faisait souvent à l'instinct. Les architectures étaient désordonnées et la plupart des tests, s'ils existaient, étaient manuels. C'était le chaos.
- **Les années 2000: l'émergence d'une structure.**
    Les frameworks, les architectures en couches et les méthodologies Agiles ont commencé à mettre de l'ordre. La pyramide des tests automatisés est apparue, avec un accent mis sur les tests unitaires. Les équipes ont commencé à percevoir la valeur d'une approche plus disciplinée.
- **Après 2015: l'ère moderne.**
    C'est là que tout s'est accéléré. Des pratiques comme le **Test-Driven Development (TDD)** et le **Domain-Driven Design (DDD)** se sont généralisées. Des architectures comme l'**hexagonale** et la **clean architecture** nous ont appris à véritablement séparer les préoccupations. Le **déploiement continu** est devenu la norme, intégrant la qualité au cœur même du processus de développement.

---

# Les piliers fondateurs

La conception applicative n'est pas née de rien. Elle repose sur deux manifestes qui ont redéfini notre manière de concevoir les logiciels.

1. **Le Manifeste Agile (2001)**
    Ce fut une révolution. Il nous a rappelé de valoriser:
    - **Un logiciel opérationnel** plutôt qu'une documentation exhaustive.
    - **L'adaptation au changement** plutôt que le suivi d'un plan.
    - **Les individus et leurs interactions** plutôt que les processus et les outils.
    - **La collaboration avec les clients** plutôt que la négociation contractuelle.

2. **Le Manifeste pour le Software Craftsmanship**
    Ce manifeste a poussé la démarche Agile encore plus loin. Il met l'accent sur la fierté professionnelle et la qualité, en soulignant l'importance:
    - **De logiciels remarquablement conçus**, et pas seulement fonctionnels.
    - **De l'ajout constant de valeur** pour les utilisateurs.
    - **D'une communauté de professionnels** qui s'entraident pour progresser.
    - **De partenariats productifs**, et pas seulement d'obligations contractuelles.

---

Au fond, la **conception applicative** n'est pas une théorie académique. C'est un ensemble de principes rodés sur le terrain et de choix stratégiques. En domptant la complexité, en tirant les leçons du passé et en nous engageant pour la qualité, nous pouvons bâtir des logiciels qui ne se contentent pas de fonctionner aujourd'hui, mais qui s'épanouissent demain.

---

### Lire la suite dans cette série

1.  **Conception applicative: bâtir des logiciels conçus pour durer**
2.  [Conception applicative: maîtriser le flux des dépendances](https://www.jterrazz.com/articles/10-software-design-1-mastering-dependencies/fr)
3.  [Conception applicative: séparer le métier de la technique](https://www.jterrazz.com/articles/11-software-design-2-hexagonal-architecture/fr)
4.  [Conception applicative: un voyage au cœur de la clean architecture](https://www.jterrazz.com/articles/12-software-design-3-clean-architecture-in-practice/fr)
