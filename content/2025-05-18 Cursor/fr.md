![](assets/thumbnail.jpg)

# Cursor: Mon Guide Pratique Du Développement à l'Ere De l'IA

**La façon dont on crée du logiciel est en train de basculer. L'IA, ce n'est plus de la science-fiction, c'est devenu mon copilote au quotidien. Je baigne dans le développement assisté par IA depuis un moment, et un outil a complètement changé la donne pour moi: Cursor. C'est bien plus qu'un éditeur de code intelligent, c'est un avant-goût du Dev 2.0.**

Pendant des années, on a débattu: WebStorm ou VS Code? Le but était d'optimiser notre propre environnement. Cursor change complètement les règles du jeu. Imaginez une équipe de 100 développeurs de classe mondiale, avec un budget à neuf chiffres, qui passeraient des mois à vous préparer un environnement parfait. Un setup conçu pour qu'une IA comprenne *votre* projet, *vos* objectifs, et *votre* intention, instantanément. C'est cette puissance que Cursor vous offre, clé en main.

La plupart des outils d'IA pour le code butent sur les mêmes problèmes:
* **Le Contexte:** Comment donner à l'IA les bonnes infos sur votre projet?
* **Le Timing:** Quand lui donner ces infos?
* **L'Interface:** Comment interagir avec l'IA sans casser son flow?
* **La Puissance:** Avez-vous accès aux meilleurs modèles?
* **L'Efficacité:** Comment gérer l'usage et les coûts sans y penser?

Cursor résout ces problèmes. Tout est intégré dans une expérience unique, intelligente et incroyablement intuitive. Le but n'est pas de taper du code plus vite. **Il s'agit de changer de rôle: passer de "celui qui tape le code" à "celui qui l'architecte".** **Vous vous concentrez sur la vision et la qualité, pendant que l'IA se charge des tâches lourdes.** Pour moi, le résultat est clair: je suis plus productif, le code est plus propre, le nommage est meilleur, et mes tests sont plus complets, le tout avec une sensation d'effort moindre.

C'est comme avoir une équipe de développeurs seniors dans son éditeur. Une équipe qui a toujours besoin d'une direction claire, surtout sur des projets complexes ou nouveaux, mais qui vous y amène plus vite. Je me retrouve à passer moins de temps à écrire du code et plus de temps dans une boucle simple: **"instruire -> vérifier".**

## Cas d'Usage: Comment Mon Quotidien a Changé

La vraie magie de Cursor, c'est sa capacité à nous faire travailler en trio—vous, l'IA, et le code—de manière totalement fluide. L'UX est si naturelle qu'elle devient une extension de la pensée.

### 1. Il Comprend Votre Code Sur Le Bout Des Doigts

![](assets/indexing.jpg)

C'est là que j'ai compris que c'était différent. Fini les copier-coller dans une fenêtre de chat externe.
* **Zéro Configuration:** Ouvrez un projet, et Cursor se met au travail.
* **Indexation Intelligente:** Il cartographie tout votre code et comprend comment les pièces s'emboîtent.
* **Contexte Autonome:** Il trouve ce dont il a besoin, où que ce soit dans le projet, lit n'importe quel fichier, et peut même lancer des commandes (comme un linter ou des tests) pour en savoir plus. Vous pouvez littéralement lui dire: "Fais passer `@montest.test.ts`", et le regarder lancer le test, voir l'échec, trouver les bons imports et proposer un correctif.

### 2. "Tab Tab Tab" Sous Stéroïdes

Pensez à GitHub Copilot, mais avec un turbocompresseur.
* **Puissance Prédictive:** Il ne se contente pas de finir votre ligne, il anticipe souvent le bloc de code entier que vous aviez en tête.

![](assets/single-line.jpg)
*Complétion sur une seule ligne*

![](assets/multi-line.jpg)
*Complétions sur plusieurs lignes*

* **Curseur Prédictif:** Il devine même où vous voulez placer votre curseur. Un coup de `Tab`, et vous y êtes.
* **Magie en un Clic:** Les petites choses deviennent sans effort. Cliquez sur un JSON en désordre, et il est instantanément formaté. Il proposera aussi de reformuler un commentaire maladroit ou de corriger une petite erreur d'un seul clic.

![](assets/inline-predictions.jpg)
*Éditions en un clic (exemple simple, mais il gère des mises à jour complexes avec une facilité déconcertante)*

### 3. Le Chat Intégré: Votre Partenaire De Code IA

![](assets/chat.jpg)
*Demandez n'importe quoi*

Le chat n'est pas un simple bot, c'est un collaborateur qui connaît votre projet par cœur.
* **Conversation Contextualisée:** Ses suggestions sont pertinentes parce qu'il comprend le contexte de votre travail.
* **Références Faciles avec `@`:** Ça, c'est énorme. Tapez `@nomdufichier` ou `@nomdusymbole` pour pointer l'IA exactement là où elle doit regarder. Plus d'ambiguïté.

![](assets/include.jpg)
*Référencez des fichiers manuellement avec @*

* **Modifications Chirurgicales:** Le bouton "Apply" est intelligent. Il insère ou modifie le code au bon endroit, même si cela concerne plusieurs fichiers.

![](assets/apply.jpg)
*Appliquez le code automatiquement*

* **Super-pouvoirs:** Vous pouvez lui donner des images (comme une maquette UI) pour générer du code, ou un lien vers une issue GitHub ou une doc en ligne pour qu'il s'en serve. Il connaît même les frameworks populaires. Taper `@NextJs` injecte la doc officielle de Next.js directement dans le chat.

![](assets/context.jpg)
*Une tonne de sources @context pour nourrir vos prompts*

### 4. Éditer En Langage Naturel (Cmd+K / Ctrl+K)

Cette fonctionnalité change la vie pour le refactoring et les modifications rapides.
* **Commandes Intuitives:** Appuyez sur `Cmd+K` et dites-lui ce que vous voulez. "Refactor cette fonction en async." "Ajoute des commentaires JSDoc." "Explique-moi cette regex."
* **Des Diffs Parfaits:** Cursor vous montre les changements proposés dans une interface de diff visuelle, claire et propre. Vous validez, refusez ou demandez une modification en quelques secondes.
* **Terminal Augmenté:** `Cmd+K` dans le terminal vous permet de taper des commandes shell en français. "Trouve tous les fichiers de plus de 1Mo et compresse-les." Et voilà.

![](assets/inline-diff.jpg)
*Prompts en ligne, diffs de code en ligne*

### 5. Mode Agent: Lâcher la Bride à l'IA

Pour les tâches plus importantes, le Mode Agent donne à l'IA la liberté de réfléchir et d'agir seule.
* **Résolution de Problèmes en Autonomie:** L'agent décompose votre demande en un plan, explore le code, crée des fichiers, lance des commandes et se corrige même s'il rencontre une erreur.
* **Correction Auto des Erreurs de Lint:** Il peut se connecter au linter de votre projet et corriger automatiquement les erreurs et les avertissements selon vos règles.
* **Il applique les changements lui-même et vous présente un diff de style "Pull Request" directement dans votre IDE. C'est incroyable. 😍**

*C'est le mode que j'utilise pour 99% de mon travail maintenant.*

![](assets/agent.jpg)
*Il a cherché sur le web, ajouté les nouvelles marques, et créé le nouveau fichier de test, le tout à partir d'un seul prompt.*

## Mon Expérience: Astuces, Conseils Et Nouvelle Mentalité

Après avoir utilisé Cursor tous les jours pendant plus d'un an, j'ai tiré quelques leçons qui ont complètement changé ma façon de développer.

### Faire De l'IA *Votre* Copilote

* **Les Règles Cursor (`Cursor Rules`):** C'est ici que vous pouvez entraîner Cursor à suivre le style de code de votre projet. Je l'utilise pour imposer un format "Given-When-Then" à toutes mes descriptions de test. C'est un simple fichier dans le dossier `.cursor/rules`.
		* *Exemple:* [Vous pouvez voir mes règles spécifiques ici](https://github.com/jterrazz/fake-news-api/blob/main/.cursor/rules).

![](assets/rules.jpg)

* **Connaissez Vos Modèles:** C'est utile de comprendre la "personnalité" de chaque modèle. Cursor est malin pour router vos requêtes, mais y penser vous aide à écrire de meilleurs prompts. Ma vision simplifiée:
		* **Le Stratège:** Un modèle puissant comme `GPT-4` ou `Claude 3 Opus` est parfait pour la stratégie ou pour décomposer une tâche complexe.
		* **Le Codeur:** Un modèle optimisé pour le code, comme un `Gemini Pro` spécialisé ou un `Claude 3.5`, est le meilleur pour générer le code.
		* **Le Débogueur:** Un mix des deux peut être utile. Des modèles robustes pour générer des cas de test, et des plus rapides pour des corrections itératives.
* **Exploitez les MCPs (`Model-Capable Plugins`):** Voyez-les comme des boîtes à outils pour des services externes comme AWS ou Stripe. Ils permettent à l'IA de générer du code en utilisant une documentation API réelle et à jour.

### Refactorings Et Corrections Surhumains

* **Réappliquer un Commit:** Une astuce d'une puissance folle. "Réapplique les changements du commit `[hash]` à ce fichier, mais adapte-les à la nouvelle structure."
* **"Fais passer les tests au vert":** Je dis littéralement à Cursor de lancer mes tests et de réparer ce qui casse jusqu'à ce que tout soit vert. C'est un super-pouvoir pour le TDD ou pour intégrer une nouvelle feature.

## Le Déclic Mental: Vous Êtes Le Metteur En Scène

Le plus grand changement n'est pas la vitesse, c'est l'état d'esprit.
* **Adoptez Votre Rôle de Metteur en Scène:** Votre travail est de guider l'IA. Donnez-lui des instructions claires et assurez-vous que le résultat final correspond à votre vision. L'IA devient une extension de votre intention, comme un collègue brillant avec qui vous travaillez depuis des années.
* **Déléguez Tout ce que Vous Pouvez:** Plus vous confiez de tâches à l'IA, plus vous avez d'énergie mentale pour la vue d'ensemble: l'architecture, l'expérience utilisateur et la résolution des *bons* problèmes.
* **Le Piège du "Code au Feeling":** Le plus grand danger est de faire confiance à la machine aveuglément ou de coder sans but précis. C'est le meilleur moyen de produire du code désordonné et de perdre du temps. **Vous devez rester le pilote.** Vous devez savoir où vous allez et donner des instructions précises, comme si vous étiez soudainement capable de coder à la vitesse de la lumière.
* **La Qualité par Défaut:** C'est le paradoxe: l'IA vous pousse à écrire du code de *meilleure* qualité. Comme vous passez plus de temps à relire qu'à taper, vous devenez naturellement plus attentif au nommage, à la structure et aux tests. **Vous finissez par faire plus confiance aux tests qu'au code lui-même.**

### Le Développement Piloté Par l'Intention (IDD)

Tout cela m'amène à un workflow que j'appelle le **Développement Piloté par l'Intention (IDD)**. De la même manière que le TDD utilise les tests pour guider la conception du code, l'IDD utilise une intention claire et de haut niveau pour guider le développement.
* **La Valeur d'Abord:** En s'inspirant du raisonnement par premiers principes, l'IDD vous oblige à vous demander: "Quelle valeur cette fonctionnalité apporte-t-elle?" Votre rôle est de traduire cette valeur en intention claire pour l'IA.
* **Des "Tests d'Intention" de Haut Niveau:** Parfois, j'écris un test de haut niveau qui capture une *user story* essentielle (par exemple, `l_utilisateur_peut_payer_avec_succes.intent.test.ts`). Mon objectif devient alors simple: dire à l'IA de faire passer ce test au vert.

Cela garantit que chaque ligne de code est liée à un résultat clair et précieux.

## Pour Se Lancer Avec Cursor

Prêt à sauter le pas?
1. **Passez au Pro:** La version gratuite est excellente, mais l'abonnement Pro (environ 20$/mois) vous donne accès aux modèles les plus puissants comme GPT-4 et Claude 3 Opus. C'est là que la vraie magie opère.
2. **Personnalisez-le:** Ne restez pas avec les réglages par défaut. Passez 10 minutes dans les paramètres. Configurez vos raccourcis et choisissez vos modèles préférés. (Pour l'inspiration, voici mes réglages globaux: [https://github.com/jterrazz/jterrazz-configuration/tree/main/configurations/cursor](https://github.com/jterrazz/jterrazz-configuration/tree/main/configurations/cursor)).
3. **Jouez avec Tout:** Ne vous cantonnez pas au chat. Utilisez les éditions `Cmd+K`. Essayez le Mode Agent. Apprenez à lui donner du contexte avec `@`.

## Vous Êtes Le Guide

L'IA peut gérer le "comment", mais le "quoi" et le "pourquoi" restent votre domaine. Coder "au feeling" ne construira pas un produit sécurisé, scalable ou maintenable. L'IA ne connaît pas votre entreprise, vos utilisateurs ou votre vision à long terme. Pas encore, en tout cas.

Vous êtes le **médiateur** essentiel entre un besoin du monde réel et l'incroyable capacité d'exécution de l'IA. Votre jugement, votre goût et votre vision ont plus de valeur que jamais. Voyez l'IA comme le consultant le plus talentueux du monde. Votre travail est d'appliquer son expertise à *votre* projet.

L'expérience Cursor par défaut est incroyable. Mais elle devient un super-pouvoir quand vous l'adaptez à vos besoins et que vous vous concentrez sur ce qui compte vraiment. Pour moi, c'est construire de belles choses, plus vite, en me concentrant sur l'exploration, la recherche, les commits, les revues et des tests en béton.

Cursor n'est pas juste un outil de plus. C'est un partenaire. Et quand vous le guidez bien, il peut élever votre travail à un tout autre niveau.

---

## 📚 Série IA

1. [**Naviguer dans la Révolution de l'IA :**](https://www.jterrazz.com/articles/14/fr) *Comprendre comment l'IA transforme le travail, la créativité et l'avenir de chaque profession.*
2. [**Intelligence Appliquée :**](https://www.jterrazz.com/articles/15/fr) *Un guide pratique pour utiliser les outils d'IA, adapter votre état d'esprit et prospérer à l'ère de l'automatisation.*
3. [**Architectes de l'Inversion – L'Effondrement de l'Exécution :**](https://www.jterrazz.com/articles/16/fr) *Explorer comment l'IA redéfinit la valeur, rend l'exécution largement accessible et déplace la valeur humaine vers les idées et la direction.*
4. [**Architectes de l'Inversion–Le Monde qui Suit:**](https://www.jterrazz.com/articles/17/fr) *Une plongée en profondeur dans la manière dont l'intelligence abondante transforme le travail, la société, l'espace et la forme de la civilisation.*
