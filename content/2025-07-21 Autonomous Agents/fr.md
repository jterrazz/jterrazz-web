![](assets/thumbnail.jpg)

# Collaborer avec l'IA sur des Problèmes d'Envergure

Il y a un moment distinct où vous réalisez que vous ne codez plus. Vous regardez.

J'ai donné une seule invite : *"Ajoute l'export CSV au tableau de bord analytique. Suis nos modèles d'export PDF existants."* Puis je me suis reculé.

L'agent a exploré ma base de code. Il a localisé le service d'export PDF. Il a analysé le modèle—comment nous structurons les exports, où vivent les endpoints, comment nous gérons le streaming pour les gros jeux de données. Puis il a commencé à construire. Route backend. Couche de transformation de données. Composant frontend. Tout cela à partir d'une seule phrase.

Quand il a rencontré une ambiguïté—l'export doit-il inclure les enregistrements archivés ?—il a fait un choix probabiliste. Je l'ai vu défiler et je suis intervenu : *"Non, filtre uniquement les enregistrements actifs, comme pour le PDF."* Il s'est ajusté et a continué.

Vingt minutes plus tard : une fonctionnalité opérationnelle, des tests qui passent, prête pour la revue.

Ce n'est pas de l'autocomplétion. Ce n'est même pas de la "Direction"—donner des ordres et vérifier des diffs. C'est quelque chose de fondamentalement différent : la **Collaboration**. Vous fixez un objectif, l'IA navigue vers lui, et vous intervenez quand la trajectoire dévie. C'est une conversation vers une solution.

La première fois que ça marche, c'est désorientant. La dixième fois, cela devient la façon par défaut de construire des logiciels.

---

## Ce qui rend la Collaboration Différente

La plupart du code assisté par IA est transactionnel. Vous demandez X, vous obtenez X. Vous acceptez ou rejetez.

La Collaboration est itérative. Vous fixez une direction, regardez l'IA travailler, intervenez au besoin, et raffinez à mesure qu'elle progresse. L'IA ne fait pas qu'exécuter des commandes ; elle explore votre base de code, prend des décisions architecturales et construit vers un but que vous avez défini.

Le changement ressemble à ceci :

| Mode | Vous faites | L'IA fait | Interaction |
|------|-------------|-----------|-------------|
| **Autocomplétion** | Taper du code | Prédire les prochains tokens | Accepter/rejeter des suggestions |
| **Direction** | Spécifier des changements | Exécuter des transformations | Revoir des diffs |
| **Collaboration** | Fixer des objectifs | Explorer, décider, construire | Guider, intervenir, itérer |

En collaboration, vous ne revoyez pas chaque ligne—vous revoyez la **direction**. Est-ce que cela va là où je veux ? A-t-elle fait des choix raisonnables ? Qu'a-t-elle manqué ?

La pensée reste vôtre. Mais au lieu de traduire chaque pensée en syntaxe, vous guidez une entité qui construit pendant que vous façonnez.

---

## La Boucle de Collaboration

![](assets/lighthouse-night.jpg)

La collaboration suit un rythme. Une fois que vous le reconnaissez, vous pouvez le manier délibérément.

### 1. Fixer le Cap
Commencez avec un but clair et assez de contexte pour que l'IA fasse des choix probabilistes de haute qualité.

> "Ajoute l'authentification utilisateur avec email/mot de passe et OAuth. Suis nos modèles existants dans le dossier auth. Utilise next-auth—nous l'avons déjà installé."

Plus vous fournissez de contexte en amont, moins vous aurez besoin de corrections plus tard. Nommez les fichiers spécifiques, les librairies ou les modèles que vous voulez voir suivis.

### 2. Observer Activement
Ne partez pas. Regardez où l'IA se dirige.

C'est différent de la revue d'un diff final. Vous observez les décisions *au moment où elles sont prises*. Regarde-t-elle les bons fichiers ? A-t-elle choisi le bon modèle ? Est-elle sur le point de s'engager sur une voie que vous devrez défaire ?

L'observation active vous permet d'intervenir *avant* que l'IA ne construise sur des fondations erronées.

### 3. Intervenir Précisément
Quand vous voyez une déviation, soyez spécifique.

> "Stop—c'est la mauvaise librairie. Nous utilisons `jose` pour la gestion JWT, pas `jsonwebtoken`. Vérifie `auth/utils.ts`."

Les bonnes interventions sont chirurgicales. Vous ne recommencez pas ; vous corrigez le cap. L'IA devrait continuer avec votre correction appliquée, pas redémarrer tout le processus.

### 4. Raffiner Progressivement
À mesure que la fonctionnalité prend forme, vous passez du guidage structurel au polissage.

> "Bien. Maintenant extrais les valeurs de config dans des variables d'environnement."
> "Ajoute la gestion d'erreur pour le callback OAuth—vérifie comment on gère les erreurs auth ailleurs."
> "Les tests semblent corrects, mais ajoute un cas pour les tokens expirés."

Chaque raffinement réduit l'écart entre le brouillon et la production.

### 5. Savoir quand c'est Fini
La collaboration se termine quand :
*   La fonctionnalité marche comme prévu.
*   Les tests passent.
*   Vous avez revu les choix architecturaux.
*   Les cas limites sont couverts.

Ne sur-itérez pas. Si ça marche, livrez.

---

## Apprendre les Limites de votre Partenaire

![](assets/scaffolding.jpg)

Plus vous collaborez, plus vous apprenez le profil de votre IA—où elle excelle, où elle trébuche, et comment mitiger ses angles morts.

### Où la Collaboration Brille
*   **Suivre les Modèles Existants :** Quand votre base de code a des exemples clairs, l'IA extrapole efficacement. *"Suis le modèle du UserService"* fonctionne car l'IA peut voir le modèle.
*   **Changements Multi-Fichiers Fastidieux :** Ajouter une nouvelle entité CRUD touche les modèles, routes, contrôleurs, tests. Fastidieux mais mécanique. Parfait pour la collaboration.
*   **Fonctionnalités Lourdes en Boilerplate :** Composants de formulaires, endpoints API, suites de tests—fonctionnalités où la forme est prévisible et les détails volumineux.
*   **Refactoring à Grande Échelle :** *"Convertis toutes les fonctions basées sur des callbacks en async/await sur cinquante fichiers."* Vous ne feriez jamais ça manuellement. La collaboration le rend faisable.

### Où la Collaboration Échoue
*   **Architecture Véritablement Nouvelle :** Si vous concevez quelque chose qui n'existe pas dans votre base de code, l'IA n'a rien à extrapoler. Elle devinera—souvent avec confiance, souvent à tort.
*   **Exigences Ambiguës :** L'IA ne pose pas de questions de clarification. Elle fait des suppositions. Si votre but est vague, ses suppositions divergeront de votre intention.
*   **Contraintes Invisibles :** Budgets de performance, implications de sécurité, considérations de déploiement—choses que l'IA ne peut pas voir dans les fichiers texte. Elle générera des solutions qui fonctionnent fonctionnellement mais échouent dans la réalité.
*   **Savoir Tribal :** Les conventions non écrites. L'IA ne sait pas que *"nous n'utilisons jamais cette librairie"* ou *"ce service est déprécié"* ou *"ce modèle cause des race conditions en production"*.

### Contourner les Limitations
*   **Morcelez le Travail Nouveau :** Ne demandez pas "un système de cache personnalisé". Demandez "un wrapper Map", puis "ajoute un TTL", puis "ajoute l'éviction LRU". Chaque étape est familière ; la combinaison est nouvelle.
*   **Rendez le Savoir Implicite Explicite :** Énoncez le savoir tribal. *"Nous utilisons toujours des retours anticipés."* *"Les erreurs doivent utiliser notre classe `AppError`."* *"N'importe jamais depuis le dossier legacy."*
*   **Fournissez des Exemples :** Si vous voulez quelque chose que l'IA n'a pas vu, écrivez un exemple manuellement. Puis demandez-lui d'imiter ce modèle.
*   **Interrompez Tôt :** Dès que vous voyez un mauvais vecteur, arrêtez-le. N'attendez pas de voir comment ça se termine. Chaque minute de mauvais travail est une dette que vous paierez en correction.

---

## Revoir le Travail Collaboratif

![](assets/lock-vault.jpg)

La collaboration produit des changements plus larges que les modifications dirigées. Une seule session peut toucher dix fichiers et ajouter des centaines de lignes. Vous ne pouvez pas revoir cela de la même façon qu'un diff chirurgical.

### La Calibration de la Confiance
Les changements dirigés sont assez petits pour être vérifiés ligne par ligne. La collaboration requiert une calibration différente : vous faites plus confiance, donc vous devez vérifier plus intelligemment.

Les questions passent de *"cette ligne est-elle correcte ?"* à :
*   **Est-ce la bonne approche ?** L'architecture a-t-elle du sens ?
*   **Cela suit-il nos modèles ?** Ou a-t-elle inventé quelque chose d'incompatible ?
*   **Les décisions clés sont-elles correctes ?** Les endroits où l'IA a dû choisir entre des options.
*   **Qu'a-t-elle manqué ?** Cas limites, sécurité, performance.

### Mon Processus de Revue

1.  **Structure de Haut Niveau d'Abord :** Quels fichiers ont changé ? Quelle est la forme de la solution ? Avant de regarder le code, comprenez l'architecture.
2.  **Vérifier les Points de Décision :** Localisez les endroits où l'IA a dû faire un choix. Ce sont les vecteurs de risque les plus élevés. A-t-elle choisi la bonne librairie ? Le bon modèle ?
3.  **Scanner les Drapeaux Rouges :** Passage rapide pour les problèmes évidents : dépendances inattendues, mauvais modèles, complexité suspecte, gestion d'erreur manquante, nombres magiques.
4.  **Lancer les Tests :** Si les tests passent, vous pouvez faire plus confiance aux détails d'implémentation. Concentrez votre revue manuelle sur les choix architecturaux plutôt que la syntaxe.
5.  **Vérifier par Sondage les Chemins Critiques :** Ne lisez pas chaque ligne, mais *lisez* les lignes importantes. La logique métier. Les frontières de sécurité. Les endroits où les bugs seraient catastrophiques.

### Le Compromis
Vous acceptez plus de risque en échange de vélocité. Une fonctionnalité de 500 lignes en une heure au lieu d'une journée. La mitigation est les tests—une bonne couverture vous permet de faire confiance à l'implémentation et de concentrer la revue sur les choix que les tests ne peuvent pas vérifier.

Si votre couverture de tests est pauvre, la collaboration est plus risquée. Vous devrez revoir plus soigneusement, érodant les gains de temps. **Investissez d'abord dans les tests.**

---

## Adapter le Mode à la Tâche

Toutes les tâches ne méritent pas la collaboration. Parfois la direction est meilleure. Parfois vous devez coder manuellement.

**Utilisez la Collaboration Quand :**
*   La fonctionnalité couvre plusieurs fichiers.
*   Le chemin d'implémentation est connu mais fastidieux.
*   Votre base de code a des modèles clairs à suivre.
*   Le changement est bien défini mais long à taper.
*   Vous avez une bonne couverture de tests comme filet de sécurité.

**Utilisez la Direction Quand :**
*   Le changement est contenu dans un seul fichier.
*   Vous savez exactement ce que vous voulez, ligne par ligne.
*   Le diff sera assez petit pour être revu complètement.
*   La précision compte plus que la vitesse.

**Restez "Mains sur le Code" Quand :**
*   Le problème est véritablement nouveau et vous devez penser en tapant.
*   La sécurité ou la correction est critique et vous ne pouvez pas vous permettre d'erreurs d'IA.
*   Vous explorez—non pas pour construire, mais pour apprendre *quoi* construire.
*   La tâche requiert une compréhension qui ne vient qu'en faisant.

La majeure partie de ma journée est en direction—frappes chirurgicales, spécifiées précisément, vérifiées soigneusement. Mais les gains de temps massifs viennent de la collaboration. Une fonctionnalité qui prend une journée à construire manuellement peut prendre une heure d'itération guidée.

---

## Le Rythme Quotidien

Après des mois à travailler ainsi, je me suis installé dans un schéma.

**Matin : Collaboration.** Commencer par la fonctionnalité substantielle—l'ajout multi-fichiers, le refactor majeur. Fixer la direction, itérer jusqu'à finition. Revoir l'architecture, lancer les tests, livrer.

**Au long de la journée : Direction.** Refactors rapides, corrections de bugs, petits ajouts. Sélectionner le code, décrire le changement, vérifier le diff. `Cmd+K`, revoir, accepter.

**Quand je suis coincé : Mains sur le Code.** Si je ne suis pas sûr de ce que je veux, j'écris du code moi-même jusqu'à ce que je comprenne. La collaboration requiert de connaître la destination. Vous ne pouvez pas guider quelque chose vers un but que vous n'avez pas défini.

La combinaison est puissante. La collaboration gère les gros morceaux rapidement. La direction gère le travail de précision. Le codage manuel gère la pensée.

Les décisions restent miennes. L'architecture est mon jugement. Le travail mécanique de traduire les décisions en syntaxe—c'est cela qui est partagé.

Ce qui prenait des jours prend maintenant des heures. Non pas parce que l'IA pense pour moi, mais parce qu'elle tape pour moi pendant que je me concentre sur ce qui compte vraiment : **les choix qui façonnent le logiciel.**

