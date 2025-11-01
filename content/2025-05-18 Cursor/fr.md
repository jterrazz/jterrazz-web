![](assets/thumbnail.jpg)

# Cursor : le développement assisté par l'ia

Vous devez refactoriser votre système d'authentification pour supporter des fournisseurs OAuth. La tâche s'étend sur plusieurs fichiers : le service d'authentification, les `route handlers`, les migrations de base de données, la gestion de la configuration et les tests. Vous maîtrisez l'architecture, mais le travail mécanique — mettre à jour chaque fichier de manière cohérente, gérer les cas limites, s'assurer que les tests couvrent les changements — prendra des heures.

L'approche traditionnelle : ouvrir chaque fichier, apporter les modifications, consulter d'autres fichiers pour garantir la cohérence, lancer les tests, déboguer les échecs, et répéter. Trois à quatre heures de travail concentré.

Avec Cursor : rédiger un test de haut niveau décrivant le nouveau flux OAuth. Dire à l'IA : « Fais passer ce test. Suis nos modèles d'authentification existants. » La regarder générer la migration, mettre à jour le service, modifier les routes et écrire des cas de test supplémentaires. Examiner les changements, demander des ajustements si nécessaire. Fusionner. Quarante-cinq minutes, dont la majeure partie a été consacrée à la revue plutôt qu'à la saisie.

C'est cette différence qui rend Cursor digne d'intérêt. Ce n'est pas une autocomplétion sous stéroïdes — c'est un éditeur conçu autour de la capacité de l'IA à comprendre l'intégralité de votre codebase et à exécuter des modifications complexes sur plusieurs fichiers, vous laissant vous concentrer sur l'architecture et la qualité.

Ce guide explore ce que Cursor fait réellement, comment ses fonctionnalités se traduisent en workflows concrets, et où se situent ses limites.

## Le différenciateur clé : la compréhension du codebase

![](assets/indexing.jpg)

Ce qui distingue Cursor des outils d'autocomplétion IA basiques, c'est la manière dont il appréhende l'ensemble de votre projet. Lorsque vous ouvrez un codebase, Cursor l'indexe automatiquement — cartographiant les relations entre les fichiers, suivant les imports, comprenant vos motifs architecturaux. Ce n'est pas une recherche intelligente ; il construit un modèle sémantique de la façon dont votre code s'articule.

L'impact pratique : vous pouvez référencer n'importe quel fichier, n'importe quelle fonction, n'importe quel concept de votre projet sans avoir à copier-coller du contexte. L'IA sait déjà comment fonctionne votre système d'authentification, à quoi ressemble le schéma de votre base de données, quels modèles de test vous suivez. Des requêtes comme « refactor the user service to match how we handle organization entities » fonctionnent parce que l'IA comprend les deux composants et leur relation.

Cette conscience contextuelle s'étend au-delà du code statique. Cursor peut exécuter vos tests, analyser les échecs et proposer des correctifs qui tiennent compte de votre configuration spécifique. Il peut invoquer votre linter, comprendre les règles que vous avez configurées et appliquer des correctifs qui correspondent à votre style de code.

## Des fonctionnalités adaptées aux workflows

### Écrire du nouveau code : la complétion intelligente

![](assets/single-line.jpg)
*Complétion sur une seule ligne*

![](assets/multi-line.jpg)
*Complétion sur plusieurs lignes*

L'autocomplétion va au-delà de la prédiction du prochain token. Appuyez sur tabulation, et Cursor génère souvent le corps entier de la fonction, le cas de test ou le bloc de configuration que vous vous apprêtiez à écrire. Il prédit en se basant sur vos habitudes : si vous utilisez systématiquement async/await, il génère du code asynchrone ; si vous préférez la composition fonctionnelle, il suggère ce style.

Prédiction du curseur : après avoir accepté une complétion, une nouvelle pression sur tabulation déplace souvent votre curseur au prochain point d'édition logique — le paramètre suivant, le cas de test suivant, le bloc similaire suivant qui nécessite une mise à jour.

Suggestions en un clic : de petites améliorations de qualité apparaissent en ligne. Un commentaire verbeux se voit proposer une reformulation concise. Un nom de variable incohérent se voit offrir une meilleure option. Celles-ci ne sont pas intrusives — elles apparaissent lorsqu'elles sont utiles et disparaissent si elles sont ignorées.

![](assets/inline-predictions.jpg)

### Modifier du code existant : les éditions en ligne avec `Cmd+K`

![](assets/inline-diff.jpg)

Faites `Cmd+K` (ou `Ctrl+K`) sur n'importe quelle sélection et décrivez le changement en langage naturel :
- « Refactor this to use async/await instead of promises »
- « Add JSDoc comments with type annotations »
- « Extract this logic into a separate helper function »

Cursor génère un diff montrant les changements proposés. Acceptez, rejetez ou affinez avec une instruction de suivi. Cela fonctionne sur plusieurs sélections simultanément — vous pouvez modifier dix fonctions similaires à la fois avec une seule instruction.

Mode terminal : `Cmd+K` dans le terminal traduit l'anglais en commandes shell. « Find all TypeScript files modified in the last week » devient l'incantation `find` appropriée. Utile pour les commandes dont vous ne vous souvenez plus de la syntaxe exacte.

### Comprendre le code : un chat avec du contexte

![](assets/chat.jpg)

Le panneau de chat fonctionne avec le contexte complet du codebase. Vous pouvez poser des questions d'architecture (« How does our caching layer work? »), de débogage (« Why would this function throw a timeout error? ») ou d'implémentation (« What's the right way to add a new API endpoint given our existing patterns? »).

Le système de référence avec `@` rend cela précis :

![](assets/include.jpg)

- `@filename.ts` inclut un fichier spécifique
- `@symbolName` référence une fonction ou une classe
- `@foldername` inclut un répertoire entier
- `@docs` inclut la documentation officielle des frameworks
- `@web` effectue une recherche sur le web pour des informations actuelles
- `@codebase` recherche dans l'ensemble de votre projet

![](assets/context.jpg)

Le bouton « Apply » insère le code généré par l'IA directement dans vos fichiers, gérant automatiquement les imports et le positionnement :

![](assets/apply.jpg)

Cela fonctionne sur plusieurs fichiers. Demandez « Add input validation to all API routes » et il peut appliquer des changements à des dizaines de fichiers, en maintenant la cohérence entre eux.

### Travail autonome : le mode agent

![](assets/agent.jpg)

Le mode agent gère les tâches en plusieurs étapes qui nécessitent exploration, itération et récupération d'erreurs. Au lieu de diriger chaque action, vous décrivez l'objectif et les contraintes.

Exemple : « Add support for CSV export to the analytics dashboard. Follow our existing export patterns for PDF. »

L'agent :
1. Explore les implémentations d'exportation existantes pour comprendre les motifs
2. Crée l'endpoint et la logique de service backend nécessaires
3. Met à jour le frontend pour ajouter l'option d'exportation CSV
4. Génère des tests couvrant la nouvelle fonctionnalité
5. Exécute les tests, identifie les échecs et les corrige
6. Présente un diff complet de tous les changements

Le processus est visible — vous voyez le raisonnement de l'agent, les fichiers qu'il examine, les commandes qu'il exécute. Vous pouvez l'interrompre, fournir des commentaires ou le laisser continuer. Une fois terminé, vous examinez le diff complet comme une pull request avant d'accepter.

Le mode agent excelle dans les tâches bien définies avec des critères de réussite clairs : implémenter des fonctionnalités qui suivent des modèles établis, corriger des bugs avec des tests complets, refactoriser du code pour correspondre à de nouvelles conventions. Il peine avec les architectures nouvelles ou les exigences ambiguës où le jugement humain est essentiel.

## Configuration pratique

### Les règles de Cursor

![](assets/rules.jpg)

Cursor respecte des règles spécifiques au projet définies dans `.cursor/rules`. Celles-ci appliquent les conventions de votre équipe sans avoir à les répéter dans chaque prompt. Exemples de règles :
- Les descriptions de test suivent le format Given-When-Then
- Les réponses d'API utilisent le camelCase, et non le snake_case
- Toutes les fonctions publiques nécessitent des commentaires JSDoc
- Préférer la composition fonctionnelle à l'héritage de classe

[Fichier de règles d'exemple](https://github.com/jterrazz/fake-news-api/blob/main/.cursor/rules)

### La sélection des modèles

Cursor achemine les requêtes vers différents modèles en fonction de la complexité de la tâche, mais comprendre les caractéristiques des modèles vous aide à rédiger de meilleurs prompts :

- **Planification :** utilisez des modèles de raisonnement puissants (GPT-4, Claude Opus) pour les décisions architecturales et les refactorisations complexes
- **Génération de code :** utilisez des modèles spécialisés pour le code (Claude Sonnet, Gemini Pro) pour l'implémentation
- **Corrections rapides :** utilisez des modèles plus rapides pour les transformations simples et les petites modifications

Le forfait Pro (environ 20 $/mois) donne accès aux modèles de pointe. Le forfait gratuit fonctionne mais vous limite à des modèles moins performants qui produisent un code sensiblement plus faible.

### Quelques approches utiles

**Réappliquer des commits :** « Reapply the changes from commit [hash] to this file, but adapt them for the new structure. » Utile lorsque le même motif doit s'appliquer à du code refactorisé.

**Corrections pilotées par les tests :** « Run the test suite and fix all failures. » Le mode agent exécute les tests de manière itérative, analyse les échecs, implémente des correctifs et répète jusqu'à ce que les tests passent. Cela fonctionne remarquablement bien pour les tests d'intégration avec des messages d'échec clairs.

**Opérations par lots :** sélectionnez plusieurs fonctions similaires et utilisez `Cmd+K` avec une seule instruction. « Add error handling to all these API calls » applique des changements cohérents à toutes les sélections.

## Ce qui ne fonctionne pas bien

**Les architectures nouvelles :** lorsque vous concevez quelque chose de véritablement nouveau — une stratégie de cache personnalisée, une structure de données inédite, un motif architectural que votre codebase n'a jamais vu — Cursor est en difficulté. Il excelle à suivre des modèles établis mais ne peut pas innover en matière d'approches architecturales.

**Les exigences ambiguës :** « Make this faster » ou « improve the UX » produit des changements génériques et souvent malavisés. L'IA a besoin de critères de réussite concrets. « Reduce response time below 200ms by implementing request caching » fonctionne ; les demandes d'amélioration vagues, non.

**Le débogage complexe :** lorsqu'un bug nécessite une connaissance approfondie du domaine ou la compréhension d'interactions subtiles entre plusieurs systèmes, Cursor propose souvent des correctifs superficiels qui ne traitent pas la cause profonde. Il est excellent pour corriger des échecs de test clairs mais faible pour raisonner sur les raisons pour lesquelles un système se comporte de manière inattendue.

**Le coût sans surveillance :** le mode agent peut entraîner des coûts d'API substantiels sur des tâches complexes, surtout s'il reste bloqué dans des boucles. Surveillez l'utilisation, fixez des limites budgétaires et interrompez les agents qui ne progressent pas.

**Les limitations de contexte :** malgré l'indexation, les très grands codebases (plus de 100k lignes) peuvent dépasser les fenêtres de contexte. L'IA pourrait manquer des motifs pertinents dans des parties éloignées du codebase, conduisant à des implémentations incohérentes.

**Le piège du « code au feeling » :** la facilité de génération encourage à accepter du code sans le comprendre. Cela accumule de la dette technique — du code qui fonctionne mais que personne ne comprend. Vous devez examiner minutieusement. L'IA est rapide, pas infaillible.

## L'intent-driven development

Le workflow que Cursor rend possible : rédiger des tests de haut niveau décrivant les résultats souhaités, puis diriger l'IA pour les faire passer. C'est le développement piloté par les tests (TDD) à un niveau supérieur — au lieu d'écrire vous-même les tests unitaires et les implémentations, vous écrivez des tests d'intégration qui capturent la valeur pour l'utilisateur et déléguez les détails de l'implémentation.

Exemple : créer `user_can_purchase_with_saved_card.intent.test.ts` décrivant le flux de paiement complet avec un moyen de paiement enregistré. Dire au mode agent : « Make this test pass. Follow our existing payment processing patterns. »

L'IA implémente la logique de service nécessaire, met à jour l'API, gère les cas limites et écrit des tests de support. Vous examinez pour vous assurer que cela correspond à votre architecture et gère correctement la sécurité.

Cela maintient le développement axé sur les résultats plutôt que sur la mécanique de l'implémentation. Chaque fonctionnalité commence par une déclaration claire de la valeur qui doit être livrée.

## Stratégie d'adoption

**Commencez avec le forfait Pro.** Le forfait gratuit limite suffisamment l'accès aux modèles pour que vous ne puissiez pas expérimenter les véritables capacités de l'outil. À 20 $/mois, le Pro est moins cher que le gain de productivité d'une seule session de débogage évitée.

**Configurez délibérément.** Passez 30 minutes à personnaliser les raccourcis clavier, à définir les modèles préférés et à définir les règles du projet. [Configuration d'exemple](https://github.com/jterrazz/jterrazz-configuration/tree/main/configurations/cursor) pour référence.

**Apprenez les modes d'interaction progressivement :**
1. Semaine 1 : utilisez uniquement l'autocomplétion. Familiarisez-vous avec le flux basé sur la tabulation.
2. Semaine 2 : ajoutez `Cmd+K` pour les modifications en ligne. Entraînez-vous à décrire les changements avec précision.
3. Semaine 3 : utilisez le chat avec les références `@` pour les modifications sur plusieurs fichiers.
4. Semaine 4 : essayez le mode agent sur de petites fonctionnalités bien définies.

**Instaurez une discipline de revue dès le début.** La facilité de génération incite à accepter du code sans le comprendre. Chaque changement généré par l'IA exige la même rigueur de revue que le code d'un développeur junior : résout-il réellement le problème ? Gère-t-il les cas limites ? Est-il maintenable ?

**Surveillez les coûts.** Le mode agent peut consommer des crédits d'API importants sur des tâches complexes. Définissez des alertes budgétaires et interrompez les agents qui ne progressent pas.

## Le changement de rôle

Cursor change ce à quoi vous consacrez votre temps. Moins de saisie de détails d'implémentation, plus de définition d'architecture et de revue de qualité. Moins de débogage d'erreurs de syntaxe, plus de raisonnement sur le comportement du système. Moins de refactorisation mécanique, plus de décisions de conception stratégiques.

Il ne s'agit pas de coder plus vite — il s'agit d'opérer à un niveau d'abstraction supérieur. Le travail mécanique qui consommait 60 % du temps de développement se réduit à 20 %, libérant de l'attention pour les problèmes qui nécessitent réellement un jugement humain : l'architecture, la sécurité, l'expérience utilisateur, les décisions techniques stratégiques.

L'IA gère le « comment » avec une efficacité redoutable. Le « quoi » et le « pourquoi » restent votre responsabilité. Un outil qui génère un code impeccable pour la mauvaise fonctionnalité est pire qu'inutile — c'est une erreur d'aiguillage coûteuse.

Votre valeur en tant que développeur provient de plus en plus de votre vision architecturale, de votre expertise du domaine et de votre jugement sur la qualité. Cursor amplifie ces compétences en supprimant les barrières mécaniques entre l'intention et l'implémentation. Utilisez-le pour construire de meilleurs systèmes, pas seulement pour construire plus vite.
