![](assets/thumbnail.jpg)

# Cursor : la compression du travail mécanique

La tâche était une intégration OAuth. Ajouter la connexion Google à un système d'authentification existant. Couche service, handlers de routes, schéma de base de données, fichiers de config, tests — rien d'architecturalement novateur, mais beaucoup de fichiers à toucher de manière cohérente.

Traditionnellement, c'est un travail de trois heures. Pas parce que le problème est difficile — je savais exactement ce qu'il fallait faire. L'architecture était claire dans ma tête en quelques minutes. Ce qui prenait une éternité, c'était la partie mécanique : ouvrir des fichiers, taper du boilerplate, câbler les imports, s'assurer que tout reste cohérent entre les couches.

Cursor compresse cette couche mécanique. Vous décrivez ce qui doit exister, l'IA gère la frappe, vous révisez le résultat. Trois heures sont devenues quarante-cinq minutes.

Mais voici ce qui compte vraiment : la réflexion reste avec vous. C'est toujours vous qui décidez quoi construire, comment le structurer, quels patterns suivre. Vous commencez toujours par un test, travaillez vers votre intention, découvrez les cas limites en avançant. Le processus de construction — de conceptualisation de l'application — reste le vôtre. Cursor supprime juste le goulot d'étranglement entre avoir l'idée et la voir exister.

C'est ça le changement. Pas "l'IA écrit du code pour vous". C'est : vous construisez l'application, l'IA gère la transcription.

***

## La compréhension sémantique à grande échelle

![](assets/indexing.jpg)

L'autocomplétion traditionnelle prédit le prochain token basé sur le fichier ouvert. Cursor est différent — il indexe tout votre codebase. Il construit un modèle sémantique de comment votre système se connecte : vos patterns, vos conventions de nommage, vos décisions architecturales.

La première fois que j'ai réalisé cela, j'ai tapé :

> "Refactore le service utilisateur pour correspondre à comment nous gérons les entités organisation."

Et ça a *fonctionné*. Il a compris les deux patterns sans que je les montre. Il savait ce que "comment nous gérons" signifiait dans mon codebase.

Ce type de prompt fonctionne encore mieux aujourd'hui. Des modèles comme Claude Opus 4.5 gèrent le raisonnement cross-codebase presque parfaitement — ils tracent les patterns, identifient les différences, et appliquent les changements de manière cohérente entre les fichiers. Ce qui semblait magique il y a un an est maintenant fiable.

Ce n'est pas du matching de mots-clés. C'est du raisonnement sur la structure. Et ça s'étend au-delà du code — Cursor lit vos sorties de tests, vos erreurs de linter, la documentation de votre framework. Le contexte n'est pas juste ce que vous avez écrit ; c'est tout votre environnement de développement.

***

## Les quatre modes

Cursor n'est pas une fonctionnalité unique. C'est un workflow qui s'adapte à la granularité des tâches. J'utilise différents modes pour différents moments, et savoir lequel atteindre est devenu une compétence en soi.

### 1. L'état de flow (Tab)

![](assets/single-line.jpg)

![](assets/multi-line.jpg)

Au niveau le plus bas, la complétion Tab génère des corps de fonctions entiers instantanément. Mais voici ce qui la différencie des copilotes standards : elle prédit votre *prochaine action*, pas juste votre prochaine ligne.

Acceptez un changement, et votre curseur saute au prochain point d'édition logique. Ajoutez un paramètre à une signature de fonction, et elle surligne les sites d'appel qui nécessitent une mise à jour. Ça ressemble moins à de l'autocomplétion et plus à du pair programming avec quelqu'un qui a toujours une longueur d'avance.

J'ai remarqué qu'elle apprenait mes patterns. Je favorise les retours précoces plutôt que les conditionnels imbriqués. La composition fonctionnelle plutôt que les hiérarchies de classes. Après quelques jours, ses suggestions correspondaient à mon style — pas au style "bonnes pratiques" générique.

Le piège ici est le même qu'avec toute autocomplétion : Tab-Tab-Tab sans lire. Je me surprends à le faire. Les suggestions ont l'air correctes. Mais "avoir l'air correct" n'est pas la même chose qu'"être correct".

### 2. Les frappes chirurgicales (Cmd+K)

![](assets/inline-diff.jpg)

Pour des changements spécifiques et localisés, je n'ai pas besoin d'une fenêtre de chat. Sélectionnez du code, appuyez sur `Cmd+K`, décrivez le changement en français :

> "Refactore ça pour utiliser async/await."
> "Ajoute du rate limiting avec un plafond de 100 req/min."
> "Gère le cas où user est null."

Un diff apparaît inline. Accepter ou rejeter. L'éditeur devient une ligne de commande pour la logique.

Ce mode brille pour le refactoring. "Extrais ça dans un hook personnalisé." "Convertis ça en TypeScript avec des types appropriés." "Ajoute la gestion d'erreurs pour les échecs réseau." Des changements qui prendraient cinq minutes d'édition soignée se font en quelques secondes de *révision* soignée.

### 3. Le dialogue architectural (Chat)

![](assets/chat.jpg)

Pour les questions plus larges, Chat fournit une conscience complète du codebase. Je l'utilise quand je m'oriente dans du code peu familier :

- "Comment notre couche de cache invalide-t-elle les entrées ?"
- "Pourquoi ce test échouerait-il vu notre configuration auth ?"
- "Quel est le flux de données de la requête API à l'écriture en base ?"

Le système de référence `@` rend cela précis. Taguez `@filename` pour vous concentrer sur des fichiers spécifiques, `@folder` pour inclure un module, `@docs` pour intégrer la documentation du framework. Il répond avec votre codebase comme contexte, pas des connaissances génériques.

Le bouton **Apply** insère ensuite le code généré directement dans les fichiers, gérant les imports automatiquement. Il fait le pont entre "voici ce que vous pourriez faire" et "voici le code, déjà en place".

### 4. Le mode Agent

![](assets/agent.jpg)

C'est là que le changement de paradigme se produit. Le mode Agent gère les tâches multi-étapes qui nécessitent de l'exploration.

> "Ajoute l'export CSV au tableau de bord analytics. Suis nos patterns d'export PDF existants."

Je l'ai regardé travailler : il a exploré le codebase pour trouver l'export PDF, analysé le pattern, implémenté la logique backend, mis à jour le composant frontend, généré des tests, les a exécutés, vu un échec, *corrigé son propre échec*, et présenté un diff complet.

La sensation est étrange. Vous ne codez pas ; vous supervisez. Vous interrompez quand ça dévie. Vous acceptez ou rejetez le résultat final. Mais les heures d'implémentation mécanique ? L'agent les a gérées.

***

## Où ça échoue

Après des mois d'utilisation quotidienne, j'ai appris où lui faire confiance et où rester sceptique.

**La nouveauté le casse.** Il excelle dans la réplication de patterns — faire ce que votre codebase fait déjà, dans un nouvel endroit. Il peine avec une architecture véritablement nouvelle. Si elle n'est pas correctement guidée.

**L'ambiguïté produit des déchets.** "Rends ça plus rapide" ne donne rien d'utile. "Réduis le temps de réponse en dessous de 200ms en implémentant du cache Redis pour la recherche utilisateur" donne du code fonctionnel. Précision en entrée, précision en sortie.

**Le piège du "vibe coding".** C'est le vrai danger. Du code apparaît entièrement formé, professionnellement formaté, passant les tests. Votre cerveau le fait correspondre à "bon code" et votre doigt plane au-dessus d'Accepter.

J'ai livré un bug de cette façon. Le code généré avait l'air correct. Les tests passaient. Mais il y avait une condition de concurrence subtile qui n'apparaissait que sous charge. Je n'avais pas *lu* le code ; je l'avais *accepté*.

La leçon n'était pas "scrute toujours tout". C'était : **décide en amont quel niveau de qualité ce contexte exige.**

Comme quand on délègue à un membre d'équipe, vous faites des choix sur le risque acceptable :
- **Prototype MVP** : Vibe code le tout. La vitesse compte plus que les cas limites. Vous le réécrirez de toute façon.
- **Dashboard interne** : Vibe code l'UI, mais exige une gestion d'erreurs appropriée et une validation des données. Acceptable de casser occasionnellement.
- **Flux de paiement** : Révisez chaque ligne. Testez les cas limites manuellement. Aucun taux d'échec acceptable.

La question n'est pas "dois-je faire confiance à l'IA ?" C'est "quelles sont mes exigences ici, et quel taux d'échec puis-je accepter ?" Soyez délibéré à ce sujet. Les bugs que j'ai livrés n'étaient pas parce que l'IA est peu fiable — c'était parce que je n'avais pas décidé ce dont j'avais vraiment besoin.

***

## Apprendre à travailler avec son agent

Voici le truc avec ces limitations : ce ne sont pas des murs fixes. Ce sont des points de départ.

Plus j'ai travaillé avec Cursor, plus j'ai appris à le guider. La nouveauté le casse — sauf si vous décomposez la nouveauté en morceaux familiers. L'ambiguïté produit des déchets — sauf si vous avez appris à quoi ressemble la précision pour *cet* agent.

C'est comme travailler avec un nouveau membre d'équipe. Au début, vous ne connaissez pas ses forces ni ses angles morts. Vous donnez des instructions vagues et obtenez des résultats vagues. Mais avec le temps, vous apprenez comment il pense. Vous savez quand lui donner de l'autonomie et quand être prescriptif. Vous savez quelles tâches il réussira et lesquelles nécessitent une supervision plus étroite.

La même chose s'applique ici. J'ai appris :
- **Quand découper** : L'architecture nouvelle fonctionne si je la décompose en étapes que l'agent reconnaît. "Conçois un cache personnalisé" échoue. "Crée un wrapper Map avec expiration TTL, puis ajoute l'éviction LRU, puis ajoute la persistance" réussit.
- **Quand montrer des exemples** : Pour les patterns inhabituels, j'écris un cas manuellement, puis demande à l'agent de suivre ce pattern pour le reste.
- **Quand contraindre** : Parfois je spécifie ce qu'il ne faut *pas* faire. "N'utilise aucune librairie externe." "Garde ça en dessous de 50 lignes." Les contraintes focalisent le résultat.
- **Quand itérer** : La première génération est rarement parfaite. Mais la seconde, guidée par "corrige ce cas limite" ou "refactore ça pour correspondre à notre style", l'est souvent.

L'agent n'est pas une boîte noire à laquelle vous lancez des prompts. C'est un collaborateur que vous apprenez à diriger. Mieux vous le connaissez, plus loin vous pouvez le pousser.

***

## Le développement guidé par l'intention

Une fois que vous avez appris à travailler avec votre agent, la question devient : quelle est la meilleure façon d'exprimer l'intention ?

J'ai atterri sur les tests. Pas les tests écrits après coup — les tests écrits *avant* que l'implémentation existe :

```
user_can_purchase_with_saved_card.intent.test.ts
```

Le test définit *ce qui* doit se passer : utilisateur avec carte enregistrée, clique sur acheter, transaction réussit, carte est débitée. Puis je dirige l'agent : "Fais passer ce test, en suivant nos patterns de service de paiement."

L'IA gère la mécanique — la logique service, les appels API, les états d'erreur. Je révise l'architecture et la sécurité.

C'est du développement piloté par les tests, mais la partie "piloté" inclut maintenant une IA qui fait l'implémentation. Vous écrivez la spécification ; la machine écrit le code ; vous vérifiez le résultat.

***

## L'attention libérée

Cursor compresse le travail mécanique de peut-être 60% de ma journée à 20%. La question que je ne cesse de me poser : que faire de l'attention libérée ?

L'IA gère le "comment" exceptionnellement bien. Le "quoi" et le "pourquoi" restent les miens. Un outil qui génère du code impeccable pour la mauvaise fonctionnalité est pire qu'inutile.

Ma valeur était autrefois partiellement définie par la vitesse de frappe et la mémoire de syntaxe. Maintenant elle est définie presque entièrement par :
- **La vision architecturale** — savoir quoi construire
- **L'expertise métier** — comprendre le problème en profondeur
- **Le goût** — reconnaître les bonnes solutions des solutions simplement fonctionnelles
- **La clarté de spécification** — décrire l'intention assez précisément pour qu'une machine l'exécute

Cursor amplifie ces qualités en supprimant les barrières mécaniques entre la pensée et le logiciel. Les idées qui prenaient un week-end prennent maintenant un après-midi. Les prototypes qui prenaient une semaine prennent maintenant une journée.

Utilisez-le pour construire de meilleurs systèmes, pas juste pour construire plus vite. Le travail mécanique est compressé. Ce que vous faites des cycles libérés ne dépend que de vous.
