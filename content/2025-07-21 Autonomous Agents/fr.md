![](assets/thumbnail.jpg)

# Architecturer avec l'IA

Une seule instruction a suffi : "Ajoute l'export CSV au tableau de bord analytique. Inspire-toi de nos patterns d'export PDF existants."

J'ai ensuite observé l'agent parcourir ma codebase, repérer l'export PDF, analyser le pattern et commencer l'implémentation. Endpoint backend, transformation des données, composant frontend — tout cela généré à partir d'une simple phrase. Face à une ambiguïté (toutes les colonnes ou seulement les visibles ?), il a tranché. Je l'ai repris, corrigé. Il s'est ajusté et a poursuivi : génération des tests, exécution, correction d'un échec, présentation du résultat.

La sensation est singulière. Vous n'écrivez plus le code, vous le supervisez. Vous engagez un dialogue vers une solution, intervenant lorsque la direction dévie, validant lorsque l'objectif est atteint.

C'est ce que j'appelle l'architecture collaborative : travailler *de concert* avec l'IA sur des problèmes trop vastes pour de simples interventions chirurgicales. La réflexion reste la vôtre. La vision reste la vôtre. Mais les heures d'implémentation mécanique ? Elles se condensent désormais en quelques minutes d'itération guidée.

***

## La boucle collaborative

![](assets/lighthouse-night.jpg)

Diriger, c'est commande-réponse. Vous dites quoi faire ; il le fait ; vous vérifiez.

Architecturer est une conversation. Vous fixez un objectif, l'agent explore et implémente, vous observez et intervenez, il s'ajuste, vous raffinez, répétez.

La boucle ressemble à ceci :

1. **Définir la direction.** "Ajoute l'authentification utilisateur avec email/password et OAuth. Suis nos patterns existants."
2. **Observer.** L'agent commence à explorer, prendre des décisions. Vous voyez où il se dirige.
3. **Intervenir.** "C'est la mauvaise librairie d'auth — on utilise `next-auth`, pas `passport`."
4. **Il s'ajuste.** Continue avec la correction appliquée.
5. **Raffiner.** "Bien, mais extrais la config dans un fichier séparé."
6. **Répéter.** Jusqu'à ce que la fonctionnalité soit complète.

Vous ne révisez pas ligne par ligne (ça, c'est diriger). Vous révisez la *direction* — est-ce que ça va là où je le souhaite ?

La réflexion reste vôtre. Vous êtes toujours celui qui comprend l'architecture, les contraintes, les objectifs. Mais au lieu de transcrire chaque décision en code, vous guidez une entité capable de conserver le contexte et d'exécuter pendant que vous façonnez la direction.

***

## Apprendre votre agent

![](assets/scaffolding.jpg)

Plus vous travaillez avec un agent, plus vous assimilez ses patterns.

**Là où il excelle :**
- Suivre les patterns existants dans votre codebase
- Changements multi-fichiers fastidieux mais pas nouveaux
- Fonctionnalités riches en boilerplate (endpoints CRUD, composants de formulaire, suites de tests)
- Refactoring à l'échelle ("convertis tous les callbacks en async/await")

**Là où il lutte :**
- Architecture véritablement nouvelle (structures de données personnalisées, patterns inhabituels)
- Exigences ambiguës (il devinera, souvent mal)
- Préoccupations transversales qu'il ne peut pas voir (implications de performance, subtilités de sécurité)
- Vos conventions implicites (les choses que vous "savez juste")

Connaître ces patterns vous permet de collaborer plus efficacement :

**Découpez le travail nouveau en morceaux familiers.** "Conçois un cache personnalisé" pourrait échouer. "Crée un wrapper Map, puis ajoute une expiration TTL, puis ajoute une éviction LRU" lui fournit des étapes familières.

**Rendez l'implicite explicite.** Si vous avez des conventions non écrites, énoncez-les. "On utilise toujours des retours anticipés (early returns), jamais de if/else imbriqués."

**Montrez des exemples pour les patterns inhabituels.** Écrivez un cas manuellement, puis demandez à l'agent de suivre ce pattern pour le reste.

**Interrompez tôt.** Si vous le voyez partir dans la mauvaise direction, n'attendez pas qu'il finisse. Arrêtez, corrigez, continuez.

L'agent n'est pas une boîte noire. C'est un collaborateur avec lequel vous apprenez à travailler. Mieux vous le connaissez, plus vous accomplirez ensemble.

***

## Confiance au niveau architectural

![](assets/lock-vault.jpg)

Diriger nécessite une revue ligne par ligne. Architecturer nécessite un autre type de confiance.

Vous ne vérifiez pas chaque ligne d'un diff de 500 lignes. Vous vérifiez :

- **Est-ce la bonne approche ?** L'architecture globale a-t-elle du sens ?
- **Suit-il nos patterns ?** Ou a-t-il inventé quelque chose d'incompatible ?
- **Les décisions clés sont-elles correctes ?** Les endroits où il a dû faire des choix.
- **Qu'a-t-il manqué ?** Cas limites, gestion d'erreur, les éléments contextuels qu'il ignorait.

Cela requiert plus de jugement architectural que la direction. Vous devez être capable de lire un gros diff et de comprendre la forme de la solution, pas juste la syntaxe.

Le compromis est explicite : vous gagnez de la vitesse sur les grosses fonctionnalités, mais vous acceptez un risque accru que quelque chose passe au travers. L'atténuation, ce sont les tests — si la fonctionnalité a une bonne couverture de tests, vous pouvez davantage faire confiance à l'implémentation et concentrer votre revue sur les choix architecturaux.

Mon approche :
1. **Lire la structure de haut niveau d'abord.** Quels fichiers ont été créés ? Quelle est la forme globale ?
2. **Vérifier les points de décision clés.** Où a-t-il dû faire des choix ?
3. **Scanner les signaux d'alerte.** Nouvelles dépendances inattendues, patterns divergents, logique suspicieusement complexe.
4. **Exécuter les tests.** S'ils passent et couvrent les cas qui m'importent, je fais confiance aux détails.
5. **Vérifier des points spécifiques.** Choisir quelques chemins critiques et les tracer.

C'est plus lent que la revue de direction (petits diffs) mais infiniment plus rapide que d'implémenter la fonctionnalité moi-même.

***

## Quand utiliser chaque mode

Toutes les tâches ne nécessitent pas une collaboration architecturale. La compétence est de faire correspondre l'approche à la tâche.

**Utilisez la direction quand :**
- Le changement est contenu dans un fichier ou une fonction
- Vous savez exactement ce que vous voulez
- Le diff sera assez petit pour être révisé ligne par ligne
- La précision prime sur la vitesse

**Utilisez l'architecture quand :**
- La fonctionnalité s'étend sur plusieurs fichiers
- Le chemin est connu mais fastidieux (CRUD, boilerplate, patterns déjà éprouvés)
- Vous pouvez décrire l'objectif mais pas chaque étape
- Vous êtes à l'aise pour réviser au niveau architectural

**Restez "mains dans le cambouis" (hands-on) quand :**
- Le problème est véritablement nouveau
- Vous avez besoin de penser en tapant
- L'architecture est floue et vous devez la découvrir
- La sécurité ou la correction est critique et vous ne pouvez pas vous fier à une revue de haut niveau

La majeure partie de mon travail est de la direction — précision chirurgicale. Mais l'architecture est là où se trouvent les plus gros gains de temps. Une fonctionnalité qui prend une journée à implémenter manuellement peut prendre une heure d'itération collaborative.

***

## Le rythme

Après des mois de pratique, j'ai trouvé mon rythme.

Matin : s'attaquer à la grosse fonctionnalité via la collaboration architecturale. Définir la direction, itérer avec l'agent jusqu'à l'achèvement. Réviser les choix architecturaux, exécuter les tests, expédier.

Tout au long de la journée : direction pour tout le reste. Refactors rapides, corrections de bugs, petites améliorations. Cmd+K, revue, accepter.

La combinaison est puissante. L'architecture gère les gros blocs ; la direction gère les finitions. Ensemble, ils compressent des jours de travail en heures.

La réflexion est toujours mienne. L'architecture est toujours mienne. Les décisions sont toujours miennes. Mais la transcription — le travail mécanique fastidieux de transformer les décisions en syntaxe — est partagée avec une entité inépuisable.

***

*À suivre : Que se passe-t-il quand l'IA cesse d'être un outil de développement et devient une partie du produit lui-même ? Nous explorons les systèmes intelligents — des architectures hybrides où code et IA travaillent de concert.*
