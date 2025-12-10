![](assets/thumbnail.jpg)

# Cursor : Quand le code s'écrit tout seul

La tâche : intégrer OAuth. Ajouter la connexion Google à un système d'authentification existant. Couche service, handlers de routes, schéma de base de données, fichiers de configuration, tests — rien de nouveau, mais beaucoup de fichiers à modifier.

Habituellement, c'est trois heures de travail. Pas parce que le problème est complexe — je savais exactement ce qu'il fallait faire. L'architecture était claire dans ma tête en quelques minutes. Ce qui prenait du temps, c'était la partie mécanique : ouvrir les fichiers, taper le boilerplate, câbler les imports, s'assurer que tout reste cohérent entre les couches.

Cursor compresse cette couche mécanique. Vous décrivez ce qui doit exister, l'IA tape, vous relisez. Trois heures deviennent quarante-cinq minutes.

Mais voici l'essentiel : la réflexion reste la vôtre. C'est toujours vous qui décidez quoi construire, comment le structurer, quels patterns suivre. Le processus créatif vous appartient. Cursor supprime simplement la friction entre avoir l'idée et la voir exister.

C'est ça le changement. Pas « l'IA écrit du code à votre place ». Plutôt : vous concevez l'application, l'IA s'occupe de la transcription.

***

## Conscience du codebase

![](assets/indexing.jpg)

L'autocomplétion classique prédit le prochain token en se basant sur le fichier ouvert. Cursor indexe l'intégralité de votre codebase. Il apprend vos patterns, vos conventions de nommage, vos décisions architecturales.

La première fois que j'ai réalisé ça, j'ai tapé :

> « Refactore le service utilisateur pour qu'il ressemble à notre gestion des entités organisation. »

Et ça a *fonctionné*. Il a compris les deux patterns sans que je les montre. Il savait ce que « notre gestion » signifiait dans mon codebase.

Ce n'est pas de la correspondance de mots-clés. C'est du raisonnement sur la structure. Et ça va au-delà du code — Cursor lit vos sorties de tests, vos erreurs de linter, la documentation de vos frameworks. Le contexte n'est pas seulement ce que vous avez écrit ; c'est tout votre environnement de développement.

***

## Les quatre modes

Cursor n'est pas une fonctionnalité unique. C'est un workflow qui s'adapte à la tâche — de la complétion d'une ligne au refactoring multi-fichiers.

### 1. L'état de flow (Tab)

![](assets/single-line.jpg)

![](assets/multi-line.jpg)

La complétion Tab génère des corps de fonctions entiers instantanément. Ce qui la distingue, c'est le *flow* : acceptez une modification, et votre curseur saute au prochain point d'édition. Ajoutez un paramètre à une fonction, et il met en évidence les appels à mettre à jour.

Ça ressemble moins à de l'autocomplétion qu'à du pair programming avec quelqu'un qui a toujours un coup d'avance.

J'ai remarqué qu'il apprenait mes patterns — returns anticipés plutôt que conditionnels imbriqués, composition fonctionnelle plutôt que hiérarchies de classes. Après quelques jours, ses suggestions correspondaient à mon style, pas aux « bonnes pratiques » génériques.

Le risque, c'est la mémoire musculaire. Tab-Tab-Tab sans lire. Les suggestions ont l'air correctes, mais « avoir l'air correct » n'est pas « être correct ».

### 2. Frappes chirurgicales (Cmd+K)

![](assets/inline-diff.jpg)

Pour des modifications précises et localisées, pas besoin d'une fenêtre de chat. Sélectionnez du code, tapez `Cmd+K`, décrivez le changement :

> « Refactore ça en async/await. »
> « Ajoute du rate limiting à 100 req/min. »
> « Gère le cas où user est null. »

Un diff apparaît en ligne. Accepter ou rejeter.

Ce mode excelle pour le refactoring. « Extrais ça dans un hook custom. » « Convertis en TypeScript avec les bons types. » « Ajoute la gestion d'erreurs pour les échecs réseau. » Des modifications qui prendraient cinq minutes d'édition minutieuse se font en quelques secondes de *relecture* minutieuse.

### 3. Questions (Chat)

![](assets/chat.jpg)

Pour les questions plus larges, le Chat offre une conscience complète du codebase. Je l'utilise quand je navigue dans du code que je ne connais pas :

- « Comment notre couche de cache invalide-t-elle les entrées ? »
- « Pourquoi ce test échouerait-il avec notre config d'auth ? »
- « Quel est le flux de données de la requête API jusqu'à l'écriture en base ? »

Le système de références `@` rend ça précis. Taguez `@filename` pour cibler des fichiers spécifiques, `@folder` pour inclure un module, `@docs` pour intégrer la documentation du framework. Il répond avec votre codebase comme contexte, pas avec des connaissances génériques.

### 4. Mode Agent

![](assets/agent.jpg)

Le mode Agent gère les tâches multi-étapes qui nécessitent de l'exploration.

> « Ajoute l'export CSV au dashboard analytics. Suis nos patterns d'export PDF existants. »

Je l'ai regardé travailler : il a exploré le codebase pour trouver l'export PDF, analysé le pattern, implémenté la logique backend, mis à jour le composant frontend, généré les tests, les a lancés, vu un échec, *corrigé son propre échec*, et présenté un diff complet.

C'est déroutant au début. Vous ne codez plus ; vous supervisez. Vous intervenez quand ça dévie. Vous acceptez ou rejetez le résultat final. Mais les heures d'implémentation mécanique ? L'agent s'en est chargé.

***

## Là où ça échoue

Après des mois d'utilisation quotidienne, j'ai appris où lui faire confiance et où rester sceptique.

**La nouveauté le casse.** Il excelle dans la réplication de patterns — faire ce que votre codebase fait déjà, ailleurs. Une nouvelle architecture exige que vous meniez : découpez en étapes familières, fournissez des exemples, posez des limites.

**L'ambiguïté produit du déchet.** « Rends ça plus rapide » ne donne rien d'utile. « Réduis le temps de réponse sous 200ms en implémentant du cache Redis pour la recherche utilisateur » donne du code fonctionnel. Précision en entrée, précision en sortie.

**Accepter sans lire.** C'est le vrai danger. Le code apparaît complet, bien formaté, les tests passent. Ça *a l'air* correct, alors votre doigt survole Accepter.

J'ai livré un bug comme ça. Le code généré avait l'air correct. Les tests passaient. Mais il y avait une race condition subtile qui n'apparaissait que sous charge. Je n'avais pas *compris* le code ; je l'avais *accepté*.

La leçon n'était pas « scrutez tout systématiquement ». C'était : **décidez en amont du niveau de revue que ce code nécessite.**

Comme quand vous déléguez à un collègue, vous faites des choix sur le risque acceptable :
- **Prototype MVP** : Acceptez vite, itérez plus vite. La vitesse compte plus que les cas limites. Vous allez le réécrire de toute façon.
- **Dashboard interne** : Faites confiance à l'UI, mais exigez une gestion d'erreurs et une validation des données correctes. Acceptable de casser occasionnellement.
- **Flux de paiement** : Relisez chaque ligne. Testez les cas limites manuellement. Aucun taux d'échec acceptable.

La question n'est pas « dois-je faire confiance à l'IA ? » C'est « quel taux d'échec puis-je accepter ici ? » Les bugs que j'ai livrés n'étaient pas dus à l'IA — c'est parce que je n'avais pas décidé de ce dont j'avais besoin.

***

## Apprendre à travailler avec votre agent

Ces limitations ne sont pas figées — c'est le point de départ.

Travailler avec Cursor, c'est comme intégrer un nouveau membre dans l'équipe. Au début, vous ne connaissez pas ses forces ni ses angles morts. Mais avec le temps, vous apprenez comment il raisonne — quand lui donner de l'autonomie, quand être directif, quelles tâches il maîtrisera et lesquelles nécessitent plus de supervision.

Après des mois d'itération, j'ai construit un modèle mental de ce qui fonctionne :
- **Quand découper** : Une architecture nouvelle fonctionne si je la décompose en étapes que l'agent reconnaît. « Conçois un cache custom » échoue. « Crée un wrapper de Map avec expiration TTL, puis ajoute l'éviction LRU, puis ajoute la persistance » réussit.
- **Quand montrer des exemples** : Pour les patterns inhabituels, j'écris un cas manuellement, puis je demande à l'agent de suivre ce pattern pour le reste.
- **Quand contraindre** : Parfois je spécifie ce qu'il ne faut *pas* faire. « N'utilise aucune librairie externe. » « Reste sous 50 lignes. » Les contraintes focalisent le résultat.
- **Quand itérer** : La première génération est rarement parfaite. Mais la deuxième, guidée par « corrige ce cas limite » ou « refactore pour correspondre à notre style », l'est souvent.

L'agent n'est pas une boîte noire à laquelle vous lancez des prompts. C'est un collaborateur que vous apprenez à diriger. Mieux vous le connaissez, plus vous pouvez en tirer.

***

## Le développement par l'intention

Une fois que vous savez diriger votre agent, le goulot d'étranglement se déplace. L'agent exécute bien quand il sait *exactement* ce que vous voulez. La question devient : comment exprimer votre intention avec précision ?

Le langage naturel est flou. « Ajoute l'authentification utilisateur » peut signifier une dizaine d'implémentations. Mais un test qui échoue est précis — il définit le comportement exact attendu.

J'ai commencé à écrire les tests *avant* que l'implémentation existe. Le test spécifie le contrat : utilisateur avec carte enregistrée, clique sur acheter, transaction réussie, carte débitée. Puis je dirige l'agent : « Fais passer ce test, en suivant nos patterns de service de paiement. »

L'IA gère la mécanique — la logique service, les appels API, les états d'erreur. Je relis l'architecture et les cas limites.

C'est le TDD adapté à l'ère de l'IA. Vous écrivez la spécification ; la machine écrit l'implémentation ; vous vérifiez le résultat. Le test devient à la fois votre intention et votre validation.

***

## L'attention libérée

Cursor compresse le travail mécanique. Des tâches qui remplissaient la moitié de ma journée prennent maintenant une heure ou deux. Alors, que faire de cette attention libérée ?

L'IA gère le « comment » exceptionnellement bien. Le « quoi » et le « pourquoi » restent les miens. Un outil qui génère du code impeccable pour la mauvaise fonctionnalité est pire qu'inutile.

Ma valeur incluait autrefois la vitesse de frappe et la mémoire de la syntaxe. Maintenant, c'est presque entièrement :
- **Vision architecturale** — savoir quoi construire
- **Expertise métier** — comprendre le problème en profondeur
- **Goût** — distinguer les bonnes solutions des solutions simplement fonctionnelles
- **Clarté** — décrire l'intention assez précisément pour qu'une machine l'exécute

Cursor amplifie ces qualités en supprimant les barrières mécaniques entre la pensée et le logiciel. Les idées qui prenaient un week-end prennent maintenant un après-midi. Les prototypes qui prenaient une semaine prennent maintenant une journée.

Le goulot d'étranglement n'est plus la frappe. C'est de penser clairement à ce qui devrait exister.
