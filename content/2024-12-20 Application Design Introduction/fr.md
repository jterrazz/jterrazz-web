![](assets/thumbnail.jpg)

# Construire des logiciels qui durent

## À propos de l'architecture logicielle

J'ai été sur des projets où chaque étape ressemble à une lutte. De simples changements prennent des semaines, et corriger un bug en crée trois autres. La cause racine n'est presque jamais une seule mauvaise ligne de code. C'est plus profond. C'est la fondation, l'architecture.

Pour moi, l'architecture logicielle n'est pas juste un diagramme technique. C'est l'ensemble des décisions critiques qui déterminent le futur d'un projet. Ce n'est pas demander "Où va ce fichier ?". La vraie question est "Comment structure-t-on ce système pour qu'il ne s'effondre pas sous son propre poids dans un an ?".

Ces choix sont l'échafaudage invisible de votre logiciel. Réussissez-les, et vous créez quelque chose qui peut grandir, s'adapter et rester en bonne santé pendant des années. Ratez-les, et vous ne faites que construire de la dette technique. C'est tout le sujet de la **conception d'application** (application design) : l'art pragmatique de construire des logiciels faits pour durer.

Cet article décortique ce que signifie vraiment la conception d'application, pourquoi c'est si critique, et comment nous sommes arrivés aux meilleures pratiques d'aujourd'hui. Nous explorerons les principes qui vous permettent de construire des logiciels qui sont à la fois **maintenables** et **évolutifs**.

---

# Alors, qu'est-ce que la conception d'application exactement ?

## Une solution à un problème auquel nous faisons tous face

Imaginez une équipe de dev, vous y avez probablement été. Quelqu'un demande : "Où dois-je mettre le code de cette nouvelle fonctionnalité ?" ou "Est-ce la bonne façon de construire ça ? Est-ce que ça marchera toujours dans six mois quand on devra le changer ?".

Ce ne sont pas juste des questions quotidiennes ; elles touchent au défi central du développement logiciel. Comment construire quelque chose qui marche maintenant sans créer un cauchemar pour votre futur vous ?

La **conception d'application** est la réponse. C'est la discipline de prendre des **décisions délibérées** sur :

- Comment votre code est structuré.
- Comment les différentes parties sont organisées.
- Comment ces parties se parlent entre elles.

Le but est simple : créer des applications qui sont **maintenables** (faciles à comprendre, réparer et faire évoluer) et **évolutives** (prêtes à gérer la croissance et les nouvelles demandes).

![](assets/application-complexity.jpg)

---

# L'ennemi que nous devons dompter : la complexité

Construire un logiciel est une bataille contre la complexité. La première étape pour gagner est de connaître votre ennemi. Je le vois sous trois formes principales :

1. **La complexité essentielle**
   C'est la complexité que vous ne pouvez pas éviter, la difficulté inhérente au problème que vous résolvez. Si vous construisez une appli bancaire, vous devez gérer les calculs d'intérêts et les règles de transaction. C'est le job. C'est essentiel.

2. **La complexité technique**
   Celle-ci vient de vos outils : les bases de données, les frameworks et les serveurs requis pour faire tourner votre logiciel. C'est une partie nécessaire de l'équation, mais elle doit être gérée pour ne pas détourner le projet.

3. **La complexité accidentelle**
   C'est la blessure auto-infligée, le désordre que nous créons par de mauvais choix de conception. Pensez au code spaghetti, à l'utilisation d'un framework pour tout juste parce qu'on peut, ou à l'absence totale de documentation. Contrairement aux autres, cette complexité est entièrement optionnelle. Nous pouvons, et devons, l'éliminer.

![](assets/complexity-levels.svg)

Une bonne conception d'application consiste à minimiser la complexité accidentelle, garder la complexité technique sous contrôle, et concentrer votre énergie sur la maîtrise de la complexité essentielle.

---

# Comment nous en sommes arrivés là : une brève histoire

Pour comprendre la conception d'application aujourd'hui, il est utile de voir d'où l'on vient. Le voyage a été rapide.

- **Avant 2000 : Le Far West.**
  Le logiciel était souvent construit à l'instinct. Les architectures étaient désordonnées, et la plupart des tests, s'ils existaient, étaient faits à la main. C'était le chaos.
- **Les années 2000 : La structure émerge.**
  Les frameworks, les conceptions en couches et les méthodologies Agiles ont commencé à apporter de l'ordre. La pyramide des tests automatisés a émergé, mettant l'accent sur les tests unitaires. Les équipes ont commencé à reconnaître la valeur d'une approche plus disciplinée.
- **Post-2015 : L'ère moderne.**
  C'est là que les choses ont vraiment cliqué. Des pratiques comme le **Test-Driven Development (TDD)** et le **Domain-Driven Design (DDD)** sont devenues courantes. Des architectures comme l'**hexagonale** et la **clean architecture** nous ont appris à séparer véritablement les responsabilités. Le **déploiement continu** est devenu la norme, intégrant la qualité dans le processus de développement lui-même.

---

# Les principes directeurs

La conception d'application n'est pas apparue de nulle part. Elle repose sur les épaules de deux manifestes fondateurs qui ont changé notre façon de penser la construction de logiciels.

1. **Le Manifeste Agile (2001)**
   Ce fut une révolution. Il nous a rappelé de valoriser :
   - **Des logiciels opérationnels** plus que d'énormes documentations.
   - **L'adaptation au changement** plus que le suivi d'un plan.
   - **Les individus et leurs interactions** plus que les processus rigides.
   - **La collaboration avec les clients** plus que la négociation contractuelle.

2. **Le Manifeste de l'Artisanat Logiciel (Software Craftsmanship)**
   Cela a poussé l'Agile un pas plus loin. C'est une question de fierté professionnelle et de qualité, mettant l'accent sur :
   - **Des logiciels bien conçus**, pas seulement des logiciels qui fonctionnent.
   - **L'ajout constant de valeur** pour les utilisateurs.
   - Une **communauté de professionnels** qui s'entraident pour grandir.
   - **Des partenariats productifs**, pas seulement des obligations contractuelles.

---

À son cœur, la **conception d'application** n'est pas une théorie académique. C'est une collection de principes éprouvés au combat et de choix stratégiques. En comprenant la complexité, en apprenant du passé et en s'engageant envers la qualité, nous pouvons construire des logiciels qui ne font pas que marcher aujourd'hui, mais qui prospèrent demain.

---

## Lire la suite de cette série

1. **Conception d'application : construire des logiciels qui durent**
2. [Conception d'application : maîtriser le flux des dépendances](https://www.jterrazz.com/articles/10-software-design-1-mastering-dependencies)
3. [Conception d'application : séparer le métier de la technologie](https://www.jterrazz.com/articles/11-software-design-2-hexagonal-architecture)
4. [Conception d'application : un voyage dans la clean architecture](https://www.jterrazz.com/articles/12-software-design-3-clean-architecture-in-practice)
