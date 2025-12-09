![](assets/thumbnail.jpg)

# Les quatre niveaux d'intégration de l'IA

Quand on imagine travailler avec une IA, on pense à Tony Stark et Jarvis. Un dialogue fluide avec un assistant omniscient. « Jarvis, fabrique-moi une nouvelle armure. » C'est fait.

J'ai passé deux ans à coder avec l'IA. La réalité n'a rien à voir avec les films.

Ce que j'ai appris : **le fantasme Jarvis n'est pas faux — il est incomplet.**

L'erreur de la plupart des développeurs, c'est de voir l'IA comme un outil binaire. On « utilise l'IA » ou on ne l'utilise pas. Mais la vraie question n'est pas *si* — c'est *comment* et *quand*.

J'en suis venu à voir l'intégration de l'IA comme un spectre à quatre niveaux :

- **1. Assistance** : L'IA anticipe. Vous exécutez.
- **2. Direction** : L'IA implémente. Vous guidez chaque étape.
- **3. Collaboration** : L'IA explore et construit. Vous donnez le cap, intervenez, itérez.
- **4. Intégration** : L'IA fait partie du produit. Vous concevez des systèmes hybrides.

Chaque niveau déplace le goulot d'étranglement. Chacun demande des compétences et un degré de confiance différents. Se tromper de niveau, c'est soit micro-manager ce qui pourrait tourner seul, soit faire aveuglément confiance à ce qui réclamait une supervision.

Cette série cartographie ce territoire — non pas en théorie, mais par l'expérience.

***

## Niveau 1 : L'accélérateur prédictif

![](assets/friction-dissolve.jpg)

C'est par là que la plupart d'entre nous ont commencé. GitHub Copilot, ChatGPT dans un onglet. L'IA observe ce que vous faites et anticipe la suite.

La première fois que Copilot m'a complété une fonction entière à partir d'un commentaire, j'ai cru découvrir un cheat code. Écrire `// validate email format` et voir vingt lignes de regex apparaître. Comme si la machine lisait dans mes pensées.

**Le workflow ne change pas — c'est la friction qui disparaît.** Vous gardez le contrôle. L'IA tape à votre place. L'écart entre l'intention et le code se réduit.

Mais j'y ai laissé des plumes.

**Le syndrome « Tab-Tab-Tab ».** On accepte les suggestions sans les lire. Le code a l'air bon. Les tests passent. On ship. Des semaines plus tard, en déboguant, on réalise qu'on ne comprend plus la moitié de sa codebase — parce qu'on ne l'a pas écrite, on l'a juste validée.

Et les suggestions restent génériques — l'implémentation la plus courante, pas la meilleure pour votre projet.

Le niveau 1 est puissant, mais c'est un piège si vous confondez vitesse et qualité. Le but n'est pas de taper plus vite — c'est de libérer de la bande passante mentale pour les décisions qui comptent.

***

## Niveau 2 : Le metteur en scène

![](assets/blueprint-hand.jpg)

Au niveau 2, vous commencez à dire aux agents exactement quoi faire.

Sélectionnez du code, Cmd+K : « Passe ça en async/await. » « Ajoute du rate limiting à 100 req/min. » « Gère le cas où user est null. » Des frappes chirurgicales. Précis, détaillé, étape par étape.

**Diriger élimine la couche mécanique, pas la réflexion.** C'est toujours vous qui décidez de l'architecture, qui débusquez les cas limites. L'agent tape. Vous construisez.

Au début, mes prompts étaient vagues, mes résultats médiocres. Avec le temps, j'ai appris à connaître l'agent — quand découper les tâches, quand montrer des exemples, quand poser des contraintes (« pas de lib externe »), quand itérer.

La meilleure spec que j'ai trouvée ? Les tests. Écrivez un test qui décrit le comportement attendu, puis dites à l'agent : « Fais passer ce test en suivant nos conventions. » Le test ne laisse aucune place à l'interprétation. L'agent gère la mécanique. Vous validez la logique.

**Le goulot d'étranglement se déplace.** Ce n'est plus « à quelle vitesse je tape ? » mais « avec quelle clarté j'exprime mon intention ? » La clarté de pensée prend le pas sur la vitesse de frappe.

***

## Niveau 3 : Le collaborateur

![](assets/clockwork-night.jpg)

Le niveau 2 vise des modifications précises et contenues. Le niveau 3, c'est travailler *avec* l'IA sur des problèmes plus larges — converger ensemble vers une solution.

> « Ajoute un export CSV au dashboard analytics. Inspire-toi de notre export PDF. »

L'IA explore, propose une approche, commence à implémenter. Mais vous ne restez pas les bras croisés. Vous êtes dans la boucle — vous observez, redirigez, itérez. « C'est pas le bon pattern, regarde comment on a fait le PDF. » « OK, mais gère l'erreur différemment. » « Maintenant, les tests. »

C'est une conversation qui mène à une solution, pas un prompt suivi d'une revue.

**Votre rôle passe de guider les étapes à façonner la direction.** Vous donnez la vision, vous observez la trajectoire, vous corrigez le cap. Vous apprenez ses tics — quand il en fait trop, quand il oublie des cas limites, quand il tape dans le mille. Un rythme s'installe : prompt, observer, ajuster, relancer.

Le compromis : collaborer exige davantage de confiance. On ne vérifie plus « cette ligne est-elle correcte ? » mais « est-ce la bonne approche ? » Il faut du jugement pour sentir quand l'IA s'égare.

La direction pour la précision chirurgicale. La collaboration pour les fonctionnalités où je sais ce que je veux, mais où le chemin est long.

***

## Niveau 4 : L'architecte de systèmes

![](assets/woven-intelligence.jpg)

Les niveaux 1 à 3 traitent l'IA comme un outil qui *vous* aide à construire. Le niveau 4 est différent. L'IA devient une brique du logiciel *lui-même*.

C'est là que ça devient intéressant. Vous n'écrivez plus seulement du code — vous bâtissez des systèmes où logique déterministe et IA imprévisible cohabitent.

Un exemple concret : j'ai développé une API d'actualités qui ingère des articles, les traite, et les sert aux utilisateurs. Le pipeline de traitement, c'est là que vit l'IA.

Le pipeline tourne toutes les deux heures :
1. **Ingestion** — Récupérer les actus, filtrer par importance
2. **Déduplication** — Comparer aux articles récents pour éviter les doublons
3. **Classification** — Attribuer un niveau (Grand public / Niche / Hors-sujet) et des traits
4. **Publication** — Transformer les dépêches en articles lisibles
5. **Challenge** — Générer des questions de quiz et des variantes *fabriquées* pour un jeu « trouvez le faux »

Impossible de gérer la déduplication sémantique avec des if/else — « La Fed relève ses taux », c'est la même actu que « La Réserve fédérale augmente les taux d'intérêt face à l'inflation » ? La classification demande de comprendre un contexte qu'aucun moteur de règles ne capture.

Mais du 100% IA, ce serait le chaos. Que se passe-t-il si elle invente une classification qui n'existe pas ? Si elle génère un quiz sans bonne réponse ?

La solution : l'**architecture hybride**. Le code gère les contraintes ; l'IA gère l'ambiguïté.

Concrètement :

```typescript
// Le code définit les SEULES sorties valides
static readonly SCHEMA = z.object({
    classification: z.enum(['GENERAL', 'NICHE', 'OFF_TOPIC']),
    reason: z.string(),
    traits: z.object({
        essential: z.boolean(),
        positive: z.boolean(),
    }),
});
```

L'IA peut décider si un article est grand public ou de niche. Mais elle *ne peut pas* sortir du schéma. La validation s'assure que sa réponse respecte mes contraintes.

C'est un sandwich : **Code → IA → Code**

- Le code prépare le contexte (récupérer les données, formater le prompt)
- L'IA raisonne (classifier, générer, analyser)
- Le code valide la sortie (schéma, objets métier, persistance)

Le modèle mental change. Certains composants sont désormais imprévisibles. Il faut des couches de validation, des fallbacks, une dégradation gracieuse. On ne débogue plus seulement des erreurs de logique — on débogue des erreurs de *raisonnement*.

Votre rôle évolue : de l'écriture de logique vers l'orchestration d'intelligence.

***

## La carte

Après deux ans à arpenter ce terrain, voici ma grille de lecture :

| Niveau | Mode | Votre rôle |
|--------|------|------------|
| 1. Assistance | L'IA prédit | Exécuter plus vite |
| 2. Direction | L'IA implémente | Guider chaque étape |
| 3. Collaboration | L'IA explore | Donner le cap, itérer |
| 4. Intégration | L'IA raisonne | Concevoir des systèmes hybrides |

Chaque niveau a sa place. La vraie compétence, c'est de reconnaître lequel la situation réclame.

Le fantasme Jarvis n'était pas faux — c'était un point sur un spectre. La vraie compétence, c'est de savoir quel *type* d'assistance le moment demande.

***

*Cet article ouvre une série qui explore chaque niveau en profondeur. Prochain volet : diriger les agents — l'art de la frappe chirurgicale.*
