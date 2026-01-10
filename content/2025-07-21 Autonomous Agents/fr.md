![](assets/thumbnail.jpg)

# Collaborer avec l'IA sur des problèmes plus vastes

Il y a un moment distinct où vous réalisez que vous ne codez plus. Vous regardez.

J'ai donné une seule invite : *"Ajoute l'export CSV au tableau de bord analytique. Suis nos modèles d'export PDF existants."* Puis je me suis reculé.

L'agent a exploré ma base de code, localisé le service d'export PDF, analysé le modèle, et commencé à construire. Route backend, couche de transformation de données, composant frontend. Tout ça à partir d'une phrase.

Lorsqu'il a rencontré une ambiguïté—l'export doit-il inclure les enregistrements archivés ?—il a fait un choix probabiliste. Je l'ai surpris en train de défiler et suis intervenu : *"Non, filtre uniquement les enregistrements actifs."* Il s'est ajusté et a continué.

Vingt minutes plus tard : une fonctionnalité opérationnelle, des tests passants, prête pour la revue.

Ce n'est pas de l'autocomplétion. Ce n'est même pas de la "Direction". C'est quelque chose de fondamentalement différent : la **Collaboration**. Vous fixez un objectif, l'IA navigue vers lui, et vous intervenez quand la trajectoire dérive. C'est une conversation vers une solution, propulsée par des modèles comme **Claude Opus 4.5** capables de maintenir un contexte complexe et de raisonner sur plusieurs étapes.

---

## Ce qui rend la collaboration différente

La plupart du codage assisté par IA est transactionnel. Vous demandez X, vous obtenez X.

La collaboration est itérative. L'IA explore, décide et construit. Le changement ressemble à ceci :

*   **Autocomplétion :** Vous tapez du code. L'IA prédit les jetons.
*   **Direction :** Vous spécifiez des changements. L'IA exécute des transformations.
*   **Collaboration :** Vous fixez des objectifs. L'IA explore et construit. Vous guidez.

En collaboration, vous ne revoyez pas chaque ligne—vous revoyez la **direction**. Est-ce que ça va là où je veux ? A-t-elle fait des choix raisonnables ? Qu'est-ce qu'elle a manqué ?

La réflexion reste avec vous. Mais au lieu de traduire chaque pensée en syntaxe, vous guidez une entité qui construit pendant que vous façonnez.

---

## La boucle collaborative

![](assets/lighthouse-night.jpg)

La collaboration suit un rythme. Une fois que vous le reconnaissez, vous pouvez l'utiliser délibérément.

### 1. Donner le cap
Commencez avec un objectif clair et assez de contexte pour que l'IA fasse des choix probabilistes de haute qualité.

> "Ajoute l'authentification utilisateur avec email/mot de passe et OAuth. Suis nos modèles existants dans le dossier auth. Utilise next-auth—nous l'avons déjà installé."

Plus vous fournissez de contexte au départ (fichiers spécifiques, librairies, modèles), moins vous aurez besoin de corrections plus tard.

### 2. Observer activement
Ne partez pas. Regardez où l'IA se dirige.

C'est différent de revoir un diff final. Vous observez les décisions *au moment où elles sont prises*. Regarde-t-elle les bons fichiers ? A-t-elle choisi le bon modèle ? Est-elle sur le point de s'engager dans une voie que vous devrez défaire ?

L'observation active vous permet d'intervenir *avant* que l'IA ne construise sur une fondation défectueuse.

### 3. Intervenir précisément
Quand vous voyez une déviation, soyez spécifique.

> "Stop—mauvaise librairie. Nous utilisons `jose` pour la gestion JWT, pas `jsonwebtoken`. Vérifie `auth/utils.ts`."

Les bonnes interventions sont chirurgicales. Vous ne recommencez pas ; vous corrigez le cap.

### 4. Raffiner progressivement
À mesure que la fonctionnalité prend forme, vous passez du guidage structurel au polissage.

> "Bien. Maintenant extrais les valeurs de config dans des variables d'environnement."
> "Les tests semblent corrects, mais ajoute un cas pour les jetons expirés."

Chaque raffinement réduit l'écart entre le brouillon et la production.

---

## Apprendre les limites de votre partenaire

![](assets/scaffolding.jpg)

Plus vous collaborez, plus vous apprenez le profil de votre IA—où elle excelle, où elle trébuche.

### Où la collaboration brille
*   **Suivre des modèles existants :** Quand votre base de code a des exemples clairs, l'IA extrapole efficacement.
*   **Changements multi-fichiers fastidieux :** Ajouter une nouvelle entité CRUD touche modèles, routes, contrôleurs, tests. Parfait pour la collaboration.
*   **Refactoring à l'échelle :** *"Convertis toutes les fonctions basées sur des callbacks en async/await à travers cinquante fichiers."*

### Où la collaboration échoue
*   **Architecture réellement nouvelle :** Si vous concevez quelque chose qui n'existe pas dans votre base de code, l'IA n'a rien à partir de quoi extrapoler. Elle peinera à s'aligner avec votre véritable intention, car l'architecture est un processus de décision, pas juste d'implémentation.
*   **Contraintes invisibles :** Budgets de performance, implications de sécurité, savoir tribal. L'IA ne peut pas voir que *"nous n'utilisons jamais cette librairie"* ou *"ce service est déprécié."*

### Le partenariat senior
Travailler avec un agent à fort raisonnement n'est pas une question de "prompting"—c'est du pair programming. Pour en tirer le meilleur, vous devez appliquer la même rigueur qu'avec un partenaire humain.

Cela signifie apporter des compétences de **Développeur Senior** à la conversation :
*   **Anticipation :** Prévoir les goulots d'étranglement architecturaux avant qu'ils ne soient codés.
*   **Autorité de domaine :** Imposer le vrai sens des termes métier pour éviter la dérive sémantique.
*   **Focus stratégique :** Savoir ce qui nécessite des tests rigoureux et ce qui peut être souple, ou exactement ce que l'équipe frontend attend au-delà du contrat JSON.
*   **Contexte business :** Ancrer chaque décision dans le *pourquoi* de la fonctionnalité.

L'agent peut écrire le code, mais il ne peut pas connaître la réalité business. Votre rôle est d'injecter cette réalité dans la boucle collaborative.

---

## Revoir le travail collaboratif

![](assets/lock-vault.jpg)

La collaboration produit des changements plus vastes que les éditions dirigées. Une seule session peut toucher dix fichiers et ajouter des centaines de lignes. Vous ne pouvez pas revoir cela de la même façon que vous revoyez un diff chirurgical.

### La calibration de la confiance
Vous faites plus confiance, donc vous devez vérifier plus intelligemment. Les questions passent de *"est-ce que cette ligne est correcte ?"* à :

1.  **Est-ce la bonne approche ?** L'architecture a-t-elle du sens ?
2.  **Cela suit-il nos modèles ?** Ou a-t-elle inventé quelque chose d'incompatible ?
3.  **Qu'est-ce qu'elle a manqué ?** Cas limites, sécurité, performance.

### Mon processus de revue

1.  **Structure de haut niveau d'abord :** Quels fichiers ont changé ? Quelle est la forme de la solution ?
2.  **Vérifier les points de décision :** Localisez les endroits où l'IA a dû faire un choix. Ce sont les vecteurs à plus haut risque.
3.  **Scanner pour les signaux d'alarme :** Dépendances inattendues, complexité suspecte, gestion d'erreur manquante.
4.  **Interroger l'Agent :** Ne lisez pas juste le diff—demandez à l'agent. *"Pourquoi as-tu choisi ce modèle ?"* *"Quels compromis as-tu faits ?"* Traitez la revue comme un dialogue. Souvent, l'explication de l'agent révèle la faille que vous aviez manquée dans le code.

**Le compromis :** Vous acceptez plus de risque en échange de vélocité. Une fonctionnalité de 500 lignes en une heure au lieu d'un jour. L'atténuation, ce sont les tests—une bonne couverture vous permet de faire confiance aux détails d'implémentation et de concentrer la revue sur les choix que les tests ne peuvent pas vérifier.

---

## La nouvelle norme

Je ne bascule plus entre les modes. Mon état par défaut est la collaboration.

Je commence chaque tâche en fixant une direction pour l'agent. Pendant qu'il construit l'infrastructure, les tests et le boilerplate, je réfléchis déjà au prochain mouvement architectural. Quand il est bloqué, je ne prends pas le relais—je le guide vers la sortie.

La combinaison est puissante non pas parce qu'elle est plus rapide (bien qu'elle le soit), mais parce qu'elle élève la nature du travail. Je ne suis plus payé pour taper de la syntaxe. Je suis payé pour penser, pour concevoir, et pour diriger un partenaire synthétique qui ne dort jamais, ne se plaint jamais, et exécute exactement aussi bien que je peux le diriger.

Les décisions restent les miennes. L'architecture est mon jugement.


