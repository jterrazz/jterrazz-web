![](assets/thumbnail.jpg)

# Cursor: Guide Pratique Pour Développeurs à l'Ère De l'IA

**La manière dont nous développons des logiciels est en pleine révolution. L'IA n'est plus un simple *buzzword*; elle devient un copilote, un allié indispensable au quotidien. Après avoir exploré en profondeur le développement assisté par IA, un outil a particulièrement et fondamentalement changé mon *workflow*: Cursor. Plus qu'un simple éditeur de code " intelligent ", c'est une véritable porte d'entrée vers ce que j'appelle le Dev 2.0.**

Pendant des années, le débat a fait rage: IDE complets comme WebStorm ou éditeurs ultra-personnalisables comme VS Code? L'idée a toujours été d'optimiser notre propre poste de travail. Cursor pousse le concept bien plus loin. Imaginez une centaine de développeurs chevronnés, avec un budget conséquent, qui auraient passé des mois à préconfigurer un environnement pour que l'IA saisisse parfaitement les subtilités de *votre* projet et de *vos* intentions. C'est ce niveau de puissance que Cursor met à votre disposition, prêt à l'emploi.

Les principaux défis rencontrés avec les assistants IA pour le code sont souvent:
* **La Compréhension Contextuelle:** Savoir injecter à l'IA les bonnes informations, au bon niveau de granularité, sur votre projet.
* **Le Timing:** Fournir ces informations précisément quand l'IA en a besoin.
* **L'Interface Utilisateur (UX):** Disposer d'une UX fluide et intuitive pour interagir avec les **suggestions** et les **actions** de l'IA.
* **L'Outillage de Pointe:** Avoir accès aux modèles d'IA et aux fonctionnalités les plus récents.
* **La Gestion des Ressources:** Maîtriser l'**usage** et les **coûts** des différents modèles d'IA.

Cursor s'attaque de front à ces problématiques en proposant une expérience de développement intégrée, intelligente et remarquablement intuitive. Il ne s'agit pas seulement de coder plus vite; il s'agit de **transformer en profondeur votre rôle: vous n'êtes plus un " simple développeur qui écrit du code ", mais un véritable " architecte logiciel "**, un pilote. **Vous vous concentrez sur la vision, l'architecture, la qualité, tandis que l'IA prend en charge une grande partie des tâches répétitives et chronophages.** Le résultat? Productivité décuplée, code plus propre, conventions de nommage rigoureuses, et des tests plus exhaustifs–le tout, avec une charge mentale considérablement réduite.

C'est comme si une équipe de développeurs seniors était intégrée à votre éditeur. Une équipe qui, certes, **a encore besoin d'un cap clair et précis**, surtout face à des contextes métier très vastes ou entièrement nouveaux. Vous passerez moins de temps à taper du code, et plus de temps sur des cycles **" instruction → revue → validation "**.

## Cas d'Usage Concrets: Une Expérience De Développement Réinventée

La force de Cursor réside dans son intégration transparente et sa compréhension fine de votre projet. L'UX est pensée pour que l'interaction entre vous, l'IA et votre code soit d'une fluidité déconcertante. Les propositions de l'IA sont visuellement claires, sans jamais être intrusives.

### 1. Il Connaît Votre Code Source Sur Le Bout Des Doigts

![](assets/indexing.jpg)

C'est sur ce point que Cursor se démarque immédiatement des IA conversationnelles externes.
* **Mise en place immédiate:** Clonez votre dépôt, et Cursor est opérationnel.
* **Indexation Intelligente:** Il analyse et indexe les fichiers de votre projet, se forgeant une véritable carte mentale de la structure et du contenu de votre *codebase*.
* **Conscience Contextuelle:** Il est capable de retrouver des informations pertinentes à travers de multiples fichiers, de lire n'importe quel fichier pour affiner sa compréhension, et même d'exécuter des commandes (lancer vos linters, vos tests unitaires, etc.) pour obtenir de manière autonome plus de contexte. Par exemple, vous pouvez lui dire: " Fais passer `@montest.test.ts` au vert ", et il va tenter de lancer le test, identifier les erreurs, chercher les imports manquants, et vous soumettre des correctifs.

### 2. L'auto-complétion " Tab Tab Tab " Passe à la Vitesse Supérieure

Pensez à GitHub Copilot, mais en version survitaminée.
* **Codage Prédictif:** Il anticipe avec une pertinence bluffante ce que vous vous apprêtez à écrire, complétant souvent des lignes entières ou des blocs de code.

![](assets/single-line.jpg)
*Complétion sur une seule ligne*

![](assets/multi-line.jpg)
*Complétions sur plusieurs lignes*

* **Prédiction du Curseur:** Il peut même deviner où vous allez vouloir positionner votre curseur. Un simple `Tab` et vous naviguez intelligemment.
* **Éditions en un Clic:** Des actions triviales, comme cliquer sur un JSON mal indenté pour qu'il soit instantanément formaté, deviennent une seconde nature. Il peut aussi suggérer des reformulations pour des portions de code ou des commentaires un peu alambiqués.

![](assets/inline-predictions.jpg)
*Modifications basées sur un simple clic (c'est un exemple basique ici, mais sa capacité à prédire des mises à jour complexes est redoutable)*

### 3. Le Chat Intégré: Votre Binôme IA Pour Coder

![](assets/chat.jpg)
*Posez vos questions*

Le chat intégré est bien plus qu'un simple chatbot.
* **Conversations Contextualisées à Votre Code:** Parce qu'il a une connaissance intime de votre projet, ses suggestions sont d'une pertinence redoutable.
* **Référencement Simplifié avec `@`:** Utilisez `@filename` ou `@symbol` pour pointer sans effort l'attention de l'IA sur des fichiers ou des éléments de code spécifiques (fonctions, classes, etc.).

![](assets/include.jpg)
*Référencez manuellement des fichiers avec @*

* **Modifications Chirurgicales:** Le bouton " Apply " insère ou modifie le code intelligemment, aux bons endroits, même si cela implique plusieurs fichiers ou des sections éloignées d'un même fichier.

![](assets/apply.jpg)
*Appliquez le code automatiquement*

* **Support Multi-Modal:** Vous pouvez même lui soumettre des images (par exemple, des maquettes d'interfaces graphiques) pour guider la génération du code correspondant.
* **Connecté au Web:** Cursor peut *parser* des dépôts en ligne, des *issues* GitHub, et d'autres contenus web pour nourrir ses réflexions et ses propositions.
* **Intégration des Documentations Officielles:** Tirez parti de sa connaissance embarquée des *frameworks* et bibliothèques populaires. Taper `@NextJs`, par exemple, injectera le contexte de la documentation Next.js dans votre conversation.

![](assets/context.jpg)
*De nombreux @context variés peuvent alimenter vos prompts*

### 4. Édition En Langage Naturel (Cmd+K / Ctrl+K)

Cette fonctionnalité est une révolution pour le *refactoring* et les modifications rapides.
* **Commandes Intuitives:** Pressez `Cmd+K` (ou `Ctrl+K`), décrivez la modification souhaitée en français courant (par exemple, " refactor this function to be async ", " add error handling for this block ", " explain this code snippet ").
* ***Diff* Visuel Impeccable:** Cursor présente les changements proposés sous forme d'un *diff* visuel, clair et élégant, vous permettant de les valider ou de les rejeter en un clin d'œil.
* **Le Terminal Augmenté:** `Cmd+K` dans le terminal intégré vous permet de formuler vos commandes shell en langage naturel.

![](assets/inline-diff.jpg)
*Prompts en ligne, diffs de code en ligne*

### 5. Mode Agent: Un Développeur IA Autonome Et Polyvalent

Pour les tâches plus complexes ou de plus grande envergure, le Mode Agent confère à l'IA une autonomie d'action accrue.
* **Opérations Autonomes:** L'agent peut décomposer vos requêtes en sous-tâches, explorer la base de code, exécuter des commandes, créer des fichiers, et même s'autocorriger en cas d'erreur.
* **Intégration des Erreurs de Lint:** Il peut se brancher sur les erreurs remontées par votre *linter* et tenter de les corriger en respectant les règles de *linting* de votre projet.
* **Il applique automatiquement les modifications au code et vous présente un *diff* de style " Pull Request " directement dans votre IDE 😍**

*J'utilise ce mode pour 99% de mes interactions.*

![](assets/agent.jpg)
*A cherché sur le web, ajouté les nouvelles marques, créé le nouveau fichier de test*

## Mon Retour d'Expérience: Conseils, Astuces Et Changement De Paradigme

Après un an d'utilisation intensive de Cursor, voici quelques clés qui ont démultiplié ma productivité et radicalement changé ma vision du développement.

### Personnaliser Son Copilote IA

* **Les Règles Cursor (`Cursor Rules`):** C'est là que la magie opère pour façonner Cursor à l'image de votre projet et de vos standards de codage. Par exemple, j'impose un pattern " Given-When-Then " pour toutes mes descriptions de tests via une règle personnalisée dans le répertoire `.cursor/rules`.
		* *Exemple:* [Vous pouvez consulter un exemple de mes règles spécifiques ici](https://github.com/jterrazz/fake-news-api/blob/main/.cursor/rules)

![](assets/rules.jpg)

* **Choix et Compréhension des Modèles:** Il est crucial de saisir la " personnalité " et les points forts de chaque modèle d'IA. Cursor offre souvent le choix ou route intelligemment les requêtes. Un flux simplifié pourrait ressembler à:
		* **Planification/Vision d'ensemble:** Un modèle puissant comme `GPT-4` ou `Claude 3 Opus` pour établir des plans d'action ou des *Product Requirement Documents (PRDs)*.
		* **Génération de Code:** Des modèles optimisés pour le code, comme des versions affûtées de `Gemini Pro` ou un modèle spécialisé type `Claude 3.5/3.7`.
		* **Tests & Débogage:** Une approche hybride, avec des modèles robustes pour la génération de cas de tests, et des modèles plus véloces et agiles pour le débogage itératif.
		* *(Note: Cursor abstrait souvent ces choix, mais comprendre cette logique sous-jacente aide à formuler des prompts plus efficaces).*
* **Exploiter les MCPs (`Model-Capable Plugins/Providers`):** Considérez-les comme des API spécialisées ou des corpus de documentation (par exemple pour AWS, Stripe) que l'agent peut interroger. Cela permet à l'IA de générer du code en se basant sur les spécifications réelles et à jour des services externes.

### *Refactorings* Et Corrections D'un Autre Niveau

* **Réappliquer les Changements d'un Commit:** Un cas d'usage d'une puissance insoupçonnée: " Reapply the changes from commit `[commit_hash]` to this specific file, adapting them as necessary. "
* **" Faire Passer les Tests au Vert ":** Demandez littéralement à Cursor d'exécuter votre suite de tests et de corriger itérativement ceux qui échouent jusqu'à ce que tout soit au vert. Extrêmement puissant pour les *workflows* TDD ou lors de l'intégration de nouvelles *features*.

## Le Basculement Mental: De Pisseur De Code à Architecte Logiciel

Le changement le plus profond n'est pas la vitesse, c'est le *mindset*.
* **Endossez votre Rôle de Pilote:** Votre mission principale est de guider l'IA, de lui fournir des instructions claires, et de vous assurer que le résultat est aligné avec votre vision. L'IA devient une extension de votre pensée, un peu comme un collègue avec qui vous auriez travaillé pendant des années, dont vous anticipez les réactions.
* **Déléguez sans Hésiter (mais avec Discernement):** Plus vous déchargez l'IA de la charge cognitive brute, plus vous pouvez vous élever et vous concentrer sur l'architecture, l'expérience utilisateur, et la résolution de problèmes complexes.
* **Le Piège du " Vibe Coding ":** Le danger principal est de faire une confiance aveugle à la machine, de ne pas avoir une vision claire de la cible, ou de coder " au talent " en mode YOLO. C'est la meilleure façon de perdre du temps et de devoir tout refaire. **Restez maître de la direction, focalisé sur les changements que *vous* voulez initier, comme si vous étiez devenu subitement capable de coder à une vitesse surhumaine.**
* **La Qualité par Défaut:** Paradoxalement, l'assistance de l'IA vous pousse vers un code de meilleure qualité. En passant plus de temps à relire et valider qu'à écrire, vous devenez naturellement plus exigeant sur le nommage, la structure, et la couverture de tests. **Vous finissez par accorder plus de confiance à vos tests qu'au code généré lui-même.**

### L'IDD: Développement Piloté Par l'Intention (Intent-Driven Development)

Ceci m'amène à un concept que j'appelle le **Développement Piloté par l'Intention (IDD)**. De la même manière que le *Test-Driven Development (TDD)* utilise les tests pour guider la conception, l'IDD s'appuie sur une intention claire et de haut niveau pour piloter le développement.
* **La Valeur Avant Tout:** En s'inspirant du raisonnement par " premiers principes ", l'IDD questionne en permanence: " Quelle valeur métier ce développement apporte-t-il concrètement au produit? " Votre rôle est de traduire cette valeur en une intention actionnable pour l'IA.
* **Des " Tests d'Intention " de Haut Niveau:** Vous pourriez définir des tests d'intégration ou de comportement personnalisés, de haut niveau, qui encapsulent un besoin utilisateur fondamental ou une règle métier critique (par exemple, `user_can_complete_purchase.intent.test.ts`). Votre objectif devient alors de mandater l'IA pour faire passer ces " tests d'intention ".

Cette approche assure que chaque ligne de code produite sert un objectif précis et apporte une valeur tangible.

## Se Lancer Avec Cursor

Prêt à franchir le pas?
1. **Considérez l'Offre Pro:** Bien que Cursor propose un *free tier*, les plans payants (autour de $20/mois) donnent accès à des modèles plus performants (comme GPT-4, Claude 3 Opus) et des limites d'usage plus généreuses, indispensables pour une expérience réellement transformatrice.
2. **Personnalisez Votre Agent:** Ne vous contentez pas des réglages par défaut. Plongez dans les paramètres. Configurez vos préférences globales, vos raccourcis clavier, vos modèles d'IA favoris. (Pour l'inspiration, voici mes paramètres globaux: [https://github.com/jterrazz/jterrazz-configuration/tree/main/configurations/cursor](https://github.com/jterrazz/jterrazz-configuration/tree/main/configurations/cursor)).
3. **Explorez Toutes les Facettes de l'Outil:** Ne vous limitez pas au chat. Expérimentez avec les éditions `Cmd+K`, le Mode Agent, le référencement contextuel avec `@`. Apprenez à lui fournir les bons fichiers de contexte.

## Le Guide Indispensable: Votre Valeur Ajoutée Stratégique

Si l'IA excelle sur le " comment ", le " quoi " et le " pourquoi " restent plus que jamais de votre ressort. Le " Vibe coding "–laisser l'IA naviguer à vue sans cap précis–ne fonctionnera pas pour les aspects critiques comme la sécurité, la scalabilité, ou la maintenabilité à long terme de votre projet (sur plusieurs années? 😅). Une IA, aussi avancée soit-elle, n'a pas encore le recul et la compréhension du contexte global de votre entreprise, de vos utilisateurs, de votre vision stratégique.

Vous devenez ce **médiateur crucial** entre le besoin métier et les capacités d'exécution de l'IA. Votre jugement, votre capacité à discerner une bonne solution d'une mauvaise, votre vision pour le produit, sont plus essentiels que jamais. Voyez l'IA comme un consultant ultra-compétent, un expert technique doté d'une expérience considérable. Votre rôle est d'appliquer cette expertise avec pertinence et discernement à *votre* projet spécifique.

L'expérience Cursor par défaut est déjà excellente. Mais sa véritable puissance se déchaîne lorsque vous l'adaptez à vos besoins et que vous vous concentrez sur ce qui compte pour vous. Pour ma part, cela s'est traduit par une simplification des interfaces et une focalisation sur les tâches fondamentales du développeur: explorer le code, chercher, *commiter*, faire des revues de code, et surtout, tester de manière exhaustive et rigoureuse.

Cursor n'est pas un simple outil de plus. C'est un partenaire qui, bien piloté, peut propulser votre pratique du développement vers de nouveaux sommets d'impact stratégique et d'efficacité.

---

## 📚 Série IA

1. [**Naviguer dans la Révolution de l'IA :**](https://www.jterrazz.com/articles/14/fr) *Comprendre comment l'IA transforme le travail, la créativité et l'avenir de chaque profession.*
2. [**Intelligence Appliquée :**](https://www.jterrazz.com/articles/15/fr) *Un guide pratique pour utiliser les outils d'IA, adapter votre état d'esprit et prospérer à l'ère de l'automatisation.*
3. [**Architectes de l'Inversion – L'Effondrement de l'Exécution :**](https://www.jterrazz.com/articles/16/fr) *Explorer comment l'IA redéfinit la valeur, rend l'exécution largement accessible et déplace la valeur humaine vers les idées et la direction.*
4. [**Architectes de l'Inversion–Le Monde qui Suit:**](https://www.jterrazz.com/articles/17/fr) *Une plongée en profondeur dans la manière dont l'intelligence abondante transforme le travail, la société, l'espace et la forme de la civilisation.*
