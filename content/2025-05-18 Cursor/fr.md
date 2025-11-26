![](assets/thumbnail.jpg)

# Cursor: la compression du travail mécanique

Le système d'authentification a besoin du support OAuth. Cela implique des modifications dans le service d'auth, les gestionnaires de routes, le schéma de base de données, les fichiers de config et les tests. L'architecture est connue. Le problème n'est pas la complexité—c'est la lourdeur mécanique de mettre à jour chaque fichier de manière cohérente. Trois heures de travail minimum.

Ou quarante-cinq minutes si vous arrêtez de taper pour commencer à diriger.

C'est la promesse de Cursor. Pas une autocomplétion plus rapide, mais une compression fondamentale de l'écart entre la décision architecturale et l'implémentation fonctionnelle. On définit ce qui doit exister, l'IA le fait exister, on révise et on livre.

## Compréhension sémantique à l'échelle

![](assets/indexing.jpg)

L'autocomplétion traditionnelle prédit le prochain token à partir du contexte local. Cursor indexe l'entièreté du codebase et construit un modèle sémantique de la façon dont tout se connecte—modèles, décisions architecturales, conventions de nommage.

La conséquence pratique: référencer n'importe quoi sans copier-coller le contexte. "Refactorise le service utilisateur pour correspondre à la façon dont nous gérons les entités d'organisation" fonctionne parce que l'IA a cartographié les deux systèmes. Elle ne cherche pas des mots-clés—elle raisonne sur la structure.

Cela s'étend au-delà de l'analyse statique. Cursor exécute vos tests, analyse les échecs, propose des corrections. Il invoque le linter, applique des corrections correspondant au style du projet. Le contexte n'est pas juste du code—c'est tout l'environnement de développement.

## Quatre modes d'engagement

### Complétion

![](assets/single-line.jpg)
*Complétion sur une ligne*

![](assets/multi-line.jpg)
*Complétion multi-lignes*

La touche Tab génère des corps de fonctions entiers, des cas de tests, des blocs de config. L'outil reconnaît les motifs à travers le codebase—si vous utilisez async/await, il génère du async. Si vous favorisez la composition fonctionnelle, il suggère ce style.

![](assets/inline-predictions.jpg)

Après acceptation, Tab saute au point d'édition logique suivant. Des suggestions en un clic apparaissent en ligne: les commentaires verbeux reçoivent des alternatives concises, les noms incohérents reçoivent de meilleures options.

### Éditions en ligne

![](assets/inline-diff.jpg)

Sélectionnez du code, `Cmd+K`, décrivez le changement. "Refactorise ceci en async/await." Acceptez ou rejetez. Fonctionne sur des sélections multiples—modifiez dix fonctions similaires avec une seule instruction.

Mode terminal: `Cmd+K` traduit l'anglais en commandes shell. "Trouve tous les fichiers TypeScript modifiés la semaine dernière" devient la bonne incantation.

### Chat

![](assets/chat.jpg)

Conscience complète du codebase. Posez des questions architecturales ("Comment fonctionne notre couche de cache?"), des questions de débogage ("Pourquoi cela provoquerait un timeout?"), des questions d'implémentation ("Meilleure façon d'ajouter un endpoint API étant donné nos modèles?").

Le système de référence par `@` rend cela chirurgical:

![](assets/include.jpg)

`@filename.ts` inclut un fichier, `@symbolName` référence une fonction, `@foldername` inclut un dossier, `@docs` tire la documentation du framework, `@web` cherche sur le web, `@codebase` cherche sémantiquement dans le projet.

![](assets/context.jpg)

Le bouton Apply insère le code directement dans les fichiers, gérant les imports automatiquement:

![](assets/apply.jpg)

Fonctionne à travers plusieurs fichiers—"Ajoute la validation des entrées à toutes les routes API" applique des changements cohérents à des douzaines de fichiers. Révisez, approuvez, terminé.

### Mode Agent

![](assets/agent.jpg)

Pour les tâches en plusieurs étapes nécessitant exploration et itération. Décrivez l'objectif: "Ajoute l'export CSV au tableau de bord analytique. Suis nos modèles d'export PDF existants."

L'agent explore les implémentations existantes, crée la logique backend, met à jour le frontend, génère des tests, les exécute, corrige les échecs, présente un diff complet. Vous voyez son raisonnement, l'interrompez à tout moment, révisez le diff complet avant d'accepter.

Excelle dans les tâches bien définies avec des critères de succès clairs. Peine avec les architectures nouvelles ou les exigences ambiguës.

## Configuration

### Règles

![](assets/rules.jpg)

Définissez les conventions du projet dans `.cursor/rules`—l'IA les suit sans répéter dans chaque prompt:

> Les descriptions de tests suivent Given-When-Then. Les réponses API utilisent le camelCase. Les fonctions publiques nécessitent de la JSDoc. Préférer la composition fonctionnelle.

[Exemple de fichier de règles](https://github.com/jterrazz/fake-news-api/blob/main/.cursor/rules)

### Modèles

**Planification:** GPT-4, Claude Opus pour les décisions architecturales. **Génération de code:** Claude Sonnet, Gemini Pro pour l'implémentation. **Corrections rapides:** Modèles plus rapides pour les éditions simples.

Le niveau Pro (~20$/mois) fournit les modèles de pointe. Le niveau gratuit produit un code notablement plus faible.

### Modèles à connaître

**Réappliquer des commits:** "Réapplique les changements du commit [hash], adaptés pour la nouvelle structure."

**Corrections pilotées par les tests:** "Exécute la suite de tests et corrige tous les échecs." L'agent itère jusqu'à ce que les tests passent.

**Opérations par lots:** Sélectionnez plusieurs fonctions, `Cmd+K`, une instruction. "Ajoute la gestion d'erreurs à tous ces appels API."

## Où ça échoue

**Architectures nouvelles:** Concevoir quelque chose de véritablement nouveau—cache personnalisé, nouvelles structures de données—produit des résultats médiocres. Cursor suit des modèles; il ne peut pas innover.

**Exigences ambiguës:** "Rends ça plus rapide" produit des changements génériques. "Réduis le temps de réponse sous 200ms en implémentant du cache" fonctionne.

**Débogage complexe:** Les bugs nécessitant une connaissance profonde du domaine reçoivent des corrections superficielles. Excellent pour les échecs de tests clairs, faible pour raisonner sur des comportements inattendus.

**Coût:** Le mode Agent accumule les coûts API sur des tâches complexes, surtout les boucles bloquées. Surveillez l'usage et interrompez les agents qui ne progressent pas.

**Limites de contexte:** Les très grandes codebases (100k+ lignes) dépassent les fenêtres de contexte, causant des implémentations incohérentes.

**Le piège du codage "au feeling":** La génération facile encourage à accepter du code sans le comprendre. La dette technique s'accumule. Traitez chaque changement généré comme du code d'un développeur junior: Résout-il le problème? Gère-t-il les cas limites? Est-il maintenable?

## Développement piloté par l'intention

Écrivez des tests de haut niveau décrivant les résultats souhaités, puis dirigez l'IA pour les faire passer. C'est le développement piloté par les tests élevé à un autre niveau.

Créez `user_can_purchase_with_saved_card.intent.test.ts` décrivant le flux de paiement complet, puis: "Fais passer ce test. Suis nos modèles de traitement de paiement existants."

L'IA implémente la logique métier, met à jour l'API, gère les cas limites, écrit les tests de support. Vous révisez l'architecture et la sécurité. Le développement reste concentré sur les résultats, pas la mécanique.

## Comment l'adopter

**Commencez par Pro.** Le niveau gratuit limite l'accès aux modèles suffisamment pour masquer les vraies capacités. 20$/mois est moins cher qu'une seule session de débogage évitée.

**Configurez délibérément.** Trente minutes sur les raccourcis, les modèles, les règles. [Exemple de configuration](https://github.com/jterrazz/jterrazz-configuration/tree/main/configurations/cursor).

**Apprenez progressivement.** Semaine 1: autocomplétion. Semaine 2: éditions en ligne `Cmd+K`. Semaine 3: chat avec références `@`. Semaine 4: mode agent sur de petites fonctionnalités.

**Discipline de révision.** Chaque changement généré doit recevoir la même rigueur que le code d'un junior. La facilité de génération rend le saut tentant. Maintenez la discipline.

## Ce que cela change

Moins taper les détails d'implémentation, plus définir l'architecture. Moins déboguer la syntaxe, plus raisonner sur le comportement. Moins de refactoring mécanique, plus de décisions stratégiques.

Le travail mécanique se compresse de soixante pour cent de votre temps à vingt. L'attention libérée va quelque part—la question est où.

L'IA gère le "comment" exceptionnellement bien. Le "quoi" et le "pourquoi" restent vôtres. Un outil qui génère un code impeccable pour la mauvaise fonctionnalité est pire qu'inutile.

La valeur vient de la vision architecturale, de l'expertise du domaine, du jugement de qualité. Cursor amplifie cela en supprimant les barrières mécaniques. La compression est réelle. Utilisez-la pour construire de meilleurs systèmes, pas juste pour construire plus vite.
