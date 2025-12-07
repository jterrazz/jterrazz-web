![](assets/thumbnail.jpg)

# Architecturer avec l'IA

J'ai donné un seul prompt : "Ajoute l'export CSV au tableau de bord analytics. Suis nos patterns d'export PDF existants."

Puis j'ai regardé l'agent explorer mon codebase, trouver l'export PDF, analyser le pattern, et commencer à implémenter. Endpoint backend, transformation de données, composant frontend — le tout à partir d'une seule phrase. Quand il a rencontré une ambiguïté (toutes les colonnes ou seulement les visibles ?), il a fait un choix. Je l'ai repéré, corrigé. Il s'est ajusté et a continué. Généré des tests, les a exécutés, corrigé un échec, présenté le résultat.

La sensation est étrange. Vous ne codez plus. Vous supervisez. Vous avez une conversation vers une solution, intervenant quand la direction dérive, acceptant quand ça atterrit.

C'est la collaboration architecturale — travailler *avec* l'IA sur des problèmes trop grands pour des frappes chirurgicales. La réflexion reste la vôtre. La vision reste la vôtre. Mais les heures d'implémentation mécanique ? Elles se compriment en minutes d'itération guidée.

***

## La boucle collaborative

![](assets/lighthouse-night.jpg)

Diriger est commande-réponse. Vous dites quoi faire ; il le fait ; vous révisez.

Architecturer est une conversation. Vous fixez un objectif, l'agent explore et implémente, vous observez et intervenez, il s'ajuste, vous affinez, répétez.

La boucle ressemble à ceci :

1. **Fixer la direction.** "Ajoute l'authentification utilisateur avec email/password et OAuth. Suis nos patterns existants."
2. **Observer.** L'agent commence à explorer, prendre des décisions. Vous voyez où il va.
3. **Intervenir.** "C'est la mauvaise librairie d'auth — on utilise `next-auth`, pas `passport`."
4. **Il s'ajuste.** Continue avec la correction appliquée.
5. **Affiner.** "Bien, mais extrais la config dans un fichier séparé."
6. **Répéter.** Jusqu'à ce que la fonctionnalité soit complète.

Vous ne révisez pas ligne par ligne (ça c'est diriger). Vous révisez la *direction* — est-ce que ça va où je veux que ça aille ?

La réflexion reste avec vous. Vous êtes toujours celui qui comprend l'architecture, les contraintes, les objectifs. Mais au lieu de transcrire chaque décision en code, vous guidez quelque chose qui peut maintenir le contexte et exécuter pendant que vous façonnez la direction.

***

## Apprendre à connaître son agent

![](assets/scaffolding.jpg)

Plus vous travaillez avec un agent, plus vous apprenez ses patterns.

**Où il excelle :**
- Suivre les patterns existants dans votre codebase
- Les changements multi-fichiers qui sont fastidieux mais pas nouveaux
- Les fonctionnalités lourdes en boilerplate (endpoints CRUD, composants de formulaire, suites de tests)
- Le refactoring à grande échelle ("convertir tous les callbacks en async/await")

**Où il peine :**
- L'architecture véritablement nouvelle (structures de données custom, patterns inhabituels)
- Les exigences ambiguës (il va deviner, souvent à tort)
- Les préoccupations transversales qu'il ne peut pas voir (implications de performance, subtilités de sécurité)
- Vos conventions non écrites (les choses que vous "savez juste")

Connaître ces patterns vous permet de travailler plus efficacement avec l'agent :

**Découpez le travail nouveau en morceaux familiers.** "Conçois un cache personnalisé" pourrait échouer. "Crée un wrapper Map, puis ajoute l'expiration TTL, puis ajoute l'éviction LRU" lui donne des étapes familières.

**Rendez l'implicite explicite.** Si vous avez des conventions qui ne sont pas dans le code, énoncez-les. "On utilise toujours les retours précoces, jamais les if/else imbriqués."

**Montrez des exemples pour les patterns inhabituels.** Écrivez un cas manuellement, puis demandez à l'agent de suivre ce pattern pour le reste.

**Interrompez tôt.** Si vous le voyez partir dans la mauvaise direction, n'attendez pas qu'il finisse. Arrêtez, corrigez, continuez.

L'agent n'est pas une boîte noire. C'est un collaborateur que vous apprenez à connaître. Mieux vous le connaissez, plus vous pouvez accomplir ensemble.

***

## La confiance au niveau architectural

![](assets/lock-vault.jpg)

Diriger nécessite une révision ligne par ligne. Architecturer nécessite un autre type de confiance.

Vous ne vérifiez pas chaque ligne d'un diff de 500 lignes. Vous vérifiez :

- **Est-ce la bonne approche ?** L'architecture globale a-t-elle du sens ?
- **Est-ce que ça suit nos patterns ?** Ou a-t-il inventé quelque chose d'incompatible ?
- **Les décisions clés sont-elles correctes ?** Les endroits où il a dû choisir.
- **Qu'a-t-il raté ?** Les cas limites, la gestion d'erreurs, les choses qu'il ne pouvait pas savoir.

Cela nécessite plus de jugement architectural que diriger. Vous devez être capable de lire un gros diff et comprendre la forme de la solution, pas juste la syntaxe.

Le compromis est explicite : vous gagnez en vitesse sur les grosses fonctionnalités, mais vous acceptez plus de risque que quelque chose soit passé à travers. L'atténuation, ce sont les tests — si la fonctionnalité a une bonne couverture de tests, vous pouvez faire plus confiance à l'implémentation et concentrer votre révision sur les choix architecturaux.

Mon approche :
1. **Lire d'abord la structure de haut niveau.** Quels fichiers ont été créés ? Quelle est la forme globale ?
2. **Vérifier les points de décision clés.** Où a-t-il dû faire des choix ?
3. **Scanner pour les signaux d'alerte.** Nouvelles dépendances que je n'attendais pas, patterns qui ne correspondent pas aux nôtres, logique suspicieusement complexe.
4. **Exécuter les tests.** S'ils passent et couvrent les cas qui m'importent, faire plus confiance aux détails.
5. **Vérifier ponctuellement des points spécifiques.** Choisir quelques chemins critiques et les tracer.

C'est plus lent que la révision de direction (petits diffs) mais bien plus rapide qu'implémenter la fonctionnalité moi-même.

***

## Quand utiliser chaque mode

Toutes les tâches ne nécessitent pas une collaboration architecturale. La compétence est de faire correspondre l'approche à la tâche.

**Utilisez la direction quand :**
- Le changement est contenu dans un fichier ou une fonction
- Vous savez exactement ce que vous voulez
- Le diff sera assez petit pour être révisé ligne par ligne
- La précision compte plus que la vitesse

**Utilisez l'architecture quand :**
- La fonctionnalité s'étend sur plusieurs fichiers
- Le chemin est connu mais fastidieux (CRUD, boilerplate, patterns que vous avez déjà faits)
- Vous pouvez décrire l'objectif mais pas chaque étape
- Vous êtes à l'aise pour réviser au niveau architectural

**Restez mains dans le cambouis quand :**
- Le problème est véritablement nouveau
- Vous avez besoin de réfléchir en tapant
- L'architecture n'est pas claire et vous devez la découvrir
- La sécurité ou la correction est critique et vous ne pouvez pas faire confiance à une révision de haut niveau

La plupart de mon travail est de la direction — précision chirurgicale. Mais architecturer est là où viennent les plus gros gains de temps. Une fonctionnalité qui prend une journée à implémenter manuellement peut prendre une heure d'itération collaborative.

***

## Le rythme

Après des mois à travailler ainsi, j'ai développé un rythme.

Le matin : s'attaquer à la grosse fonctionnalité par collaboration architecturale. Fixer la direction, itérer avec l'agent jusqu'à ce que ce soit fait. Réviser les choix architecturaux, exécuter les tests, livrer.

Tout au long de la journée : direction pour tout le reste. Refactors rapides, corrections de bugs, petites améliorations. Cmd+K, réviser, accepter.

La combinaison est puissante. Architecturer gère les gros morceaux ; diriger gère le polish. Ensemble, ils compriment des jours de travail en heures.

La réflexion reste la mienne. L'architecture reste la mienne. Les décisions restent les miennes. Mais la transcription — le travail mécanique fastidieux de transformer les décisions en syntaxe — est partagée avec quelque chose qui ne se fatigue jamais.

***

*À suivre : Que se passe-t-il quand l'IA cesse d'être un outil de développement et devient partie du produit lui-même ? Nous explorons les systèmes intelligents — des architectures hybrides où code et IA travaillent ensemble.*