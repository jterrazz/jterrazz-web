![](assets/thumbnail.jpg)

# Programmer les systèmes intelligents

Imaginez que vous développez une plateforme éducative. Des étudiants y posent des questions en langage naturel, et le système doit leur fournir des explications sur mesure, adaptées à leur niveau et à leur style d'apprentissage.

Les agents autonomes (niveau 3) sont ici inefficaces. On ne peut pas simplement donner à un agent l'objectif « enseigner la physique » et le laisser opérer sans supervision. L'enseignement impose de respecter des programmes, de garantir l'exactitude factuelle, de suivre la progression de chaque étudiant par rapport à des objectifs précis. Tout cela exige un contrôle déterministe.

Mais un système de règles pures ne suffit pas non plus. Une règle du type « si l'étudiant interroge sur la quantité de mouvement, renvoyer l'explication B » ne produit que des réponses rigides et impersonnelles. Enseigner, c'est aussi s'adapter au niveau de lecture, moduler le ton selon les signaux de confiance, choisir des exemples qui parlent à chacun. Tout cela requiert une capacité de raisonnement créatif.

Il faut donc allier les deux. Des systèmes déterministes pour la structure, la fiabilité et la conformité. Un raisonnement IA pour l'adaptation, la créativité et le jugement. Le véritable défi est d'architecturer des systèmes où ces deux modes collaborent en parfaite harmonie.

C'est le niveau 4 : la programmation de systèmes intelligents. Vous n'utilisez plus l'IA comme un simple outil, ni ne la supervisez comme un agent. Vous concevez des architectures hybrides où logique déterministe et raisonnement IA excellent chacun dans leur domaine, communiquant via des interfaces soigneusement définies.

Voici comment de tels systèmes sont construits.

***

![](assets/bricks.jpg)

## Concevoir une architecture hybride

La décision clé est d'identifier ce qui relève du code déterministe par rapport au raisonnement de l'IA. La frontière est essentielle car chacun a des modes de défaillance, des coûts et des exigences de test différents.

**Responsabilités de la couche déterministe :**
-   Appliquer les contraintes qui ne doivent jamais être violées (prérequis du programme, contenu adapté à l'âge)
-   Gérer l'état qui exige une fiabilité parfaite (progression de l'étudiant, suivi de l'achèvement)
-   Gérer les opérations à haut volume et faible complexité (journalisation, authentification, validation des données)
-   Fournir un contexte structuré aux composants d'IA (historique de l'étudiant, objectifs d'apprentissage actuels)

**Responsabilités de la couche de raisonnement IA :**
-   Générer du contenu créatif (explications, analogies, exemples)
-   Adapter le style de communication (niveau de lecture, ton, approche d'engagement)
-   Prendre des décisions éclairées avec des informations incomplètes (l'étudiant est-il confus ou simplement en train de réfléchir ?)
-   Gérer des situations nouvelles non couvertes par les règles (questions inhabituelles, conceptions erronées créatives)

L'architecture définit des interfaces claires entre les couches. Le code déterministe appelle le raisonnement de l'IA avec des entrées structurées et attend des sorties structurées. L'IA ne modifie jamais directement l'état — elle renvoie des recommandations que le code déterministe valide et exécute.

## Construire le tuteur adaptatif

Architecturons le système de tutorat en physique avec cette approche hybride.

### Composant 1 : le graphe de connaissances (déterministe)

Une implémentation traditionnelle de graphe de connaissances. Les nœuds représentent des concepts (première loi de Newton, quantité de mouvement, énergie cinétique). Les arêtes représentent les dépendances et les séquences d'apprentissage recommandées.

```typescript
interface CurriculumNode {
  conceptId: string;
  prerequisites: string[];
  assessmentCriteria: TestCase[];
  difficultyLevel: number;
}

function getNextConcept(
  masteredConcepts: Set<string>,
  currentLevel: number
): CurriculumNode | null {
  return curriculum.nodes.find(node => 
    node.difficultyLevel === currentLevel &&
    node.prerequisites.every(prereq => masteredConcepts.has(prereq))
  );
}
```

Ceci est déterministe par conception. Les étudiants ne peuvent pas sauter les prérequis. Le système impose des séquences d'apprentissage basées sur des règles explicites.

### Composant 2 : le modèle étudiant (état déterministe + analyse ia)

La progression de l'étudiant est stockée dans une base de données — une gestion d'état déterministe. Mais comprendre *comment* un étudiant apprend nécessite une analyse par l'IA de ses interactions.

```typescript
interface StudentProfile {
  studentId: string;
  masteredConcepts: Set<string>;
  currentConcept: string;
  interactionHistory: Interaction[];
  // Deterministic state above
  
  // AI-generated insights below (regenerated periodically)
  comprehensionLevel: 'struggling' | 'progressing' | 'confident';
  preferredExplanationStyle: 'visual' | 'analogy' | 'mathematical';
  commonMisconceptions: string[];
  engagementPatterns: string;
}
```

La couche déterministe suit les faits : quels concepts sont maîtrisés, quand les questions ont été posées, combien de temps les réponses ont pris. Périodiquement, un modèle d'IA analyse cet historique pour générer des aperçus sur le style d'apprentissage et les schémas de compréhension.

Ces aperçus sont mis en cache et versionnés. Si l'analyse de l'IA échoue, le système se rabat sur les aperçus précédents ou sur des valeurs par défaut génériques. La couche déterministe ne dépend jamais de la génération d'IA en temps réel pour les décisions critiques.

### Composant 3 : le générateur d'explications adaptatives (raisonnement ia)

Lorsqu'un étudiant pose une question, la couche déterministe assemble le contexte et appelle le composant d'IA :

```typescript
interface ExplanationRequest {
  question: string;
  targetConcept: string;
  studentProfile: StudentProfile;
  constraints: {
    maxReadingLevel: number;
    prohibitedTerms: string[];  // Too advanced or inappropriate
    requiredCoverage: string[];  // Must explain these aspects
  };
}

async function generateExplanation(
  request: ExplanationRequest
): Promise<Explanation> {
  const prompt = buildPrompt(request);
  const aiResponse = await callLLM(prompt);
  
  // Deterministic validation before returning
  if (!meetsConstraints(aiResponse, request.constraints)) {
    return fallbackExplanation(request.targetConcept);
  }
  
  return aiResponse;
}
```

L'IA dispose d'une liberté créative encadrée. Elle peut choisir des exemples, adapter le ton, utiliser des analogies — mais la couche déterministe impose des contraintes. Si l'IA enfreint les limites de niveau de lecture ou ne couvre pas les concepts requis, le système rejette la réponse et utilise une solution de repli pré-validée.

### Composant 4 : le générateur de questions socratiques (créativité ia avec un cadre déterministe)

Au lieu d'expliquer directement, le système guide souvent les étudiants pour qu'ils découvrent les réponses. Cela nécessite une génération de questions créative :

```typescript
interface QuestionGenerationRequest {
  studentQuestion: string;
  correctAnswer: string;
  currentUnderstanding: string;  // From student's attempt
  guidanceStrategy: 'leading_question' | 'analogy_prompt' | 'worked_example';
  prohibitedHints: string[];  // Don't give away these key insights yet
}
```

La couche déterministe choisit la stratégie de guidage en fonction de règles (les étudiants en difficulté reçoivent plus d'accompagnement, les étudiants confiants reçoivent des défis plus difficiles). L'IA génère la question réelle dans le cadre de cette stratégie, en s'assurant qu'elle est appropriée au niveau de l'étudiant et qu'elle ne révélera pas les réponses prématurément.

### L'optimisation des coûts par couches

Faire appel à des modèles d'IA coûteux pour chaque interaction n'est pas viable. L'architecture hybride permet une gestion intelligente des coûts :

**Niveau 1 - Routage déterministe (gratuit) :** si la question correspond exactement à une FAQ courante, renvoyer la réponse en cache. Pas d'invocation de l'IA.

**Niveau 2 - Modèle d'IA bon marché (quelques centimes) :** utiliser un modèle petit et rapide pour des adaptations simples. « Réécris cette explication pour un niveau de lecture de 4ème. » Les transformations simples ne nécessitent pas de modèles de pointe.

**Niveau 3 - Modèle d'IA coûteux (quelques dollars) :** utiliser les modèles de pointe uniquement pour le raisonnement complexe : générer des analogies inédites, analyser des conceptions erronées inhabituelles, créer des séries de problèmes personnalisés.

La couche déterministe décide quel niveau invoquer en fonction d'heuristiques de complexité. 80 % des requêtes sont traitées aux niveaux 1 et 2, ce qui permet de maîtriser les coûts tout en réservant l'intelligence coûteuse aux cas qui en ont réellement besoin.

***

## Tester les systèmes hybrides

Les tests logiciels traditionnels valident un comportement déterministe : pour une entrée X, on attend une sortie Y. Les systèmes hybrides nécessitent des approches différentes car les composants d'IA sont explicitement conçus pour être créatifs.

**Test de la couche déterministe :** tests unitaires et d'intégration standards. Le graphe de connaissances doit toujours faire respecter les prérequis. La progression de l'étudiant ne doit jamais régresser de manière inattendue. La gestion de l'état doit être à toute épreuve.

**Test de la couche IA :** vous évaluez la qualité, pas le déterminisme. Générez 100 explications pour le même concept et faites-les évaluer par des experts du domaine. Mesurez : l'exactitude factuelle (doit être de 100 %), la pertinence du niveau de lecture (95 %+ dans la cible), la qualité de l'engagement (subjective mais mesurable). Fixez des seuils de qualité et faites échouer les `builds` qui ne les respectent pas.

**Tests d'intégration :** testez les frontières. Que se passe-t-il lorsque l'IA génère une explication qui viole les contraintes ? La couche déterministe doit la détecter et la gérer. Que se passe-t-il lorsque les appels au modèle d'IA échouent ? Le système doit se dégrader gracieusement vers des solutions de repli.

**Tests A/B en production :** le seul véritable test de l'efficacité de la personnalisation réside dans les résultats des étudiants. Le parcours personnalisé par l'IA conduit-il à une meilleure maîtrise des concepts que le contenu générique ? Vous avez besoin d'instrumentation et de déploiements contrôlés pour mesurer l'impact réel.

## Ce que cela rend possible

Le modèle d'architecture hybride s'étend au-delà de l'éducation à tout domaine nécessitant à la fois fiabilité et adaptation :

**Le diagnostic de santé :** les règles déterministes font respecter les normes médicales et les exigences légales. Le raisonnement de l'IA interprète des combinaisons de symptômes inédites et suggère des pistes de diagnostic qu'un système purement algorithmique aurait manquées.

**L'analyse financière :** le code déterministe assure la conformité réglementaire et l'exactitude comptable. Le raisonnement de l'IA identifie des schémas dans le comportement du marché, génère des hypothèses d'investissement et adapte les stratégies aux conditions changeantes.

**Les outils de création :** les systèmes déterministes gèrent les formats de fichiers, les pipelines de rendu et le stockage des ressources. Le raisonnement de l'IA suggère des améliorations de conception, génère des variations et aide les créateurs à explorer des possibilités qu'ils n'auraient pas envisagées.

**L'analyse de documents juridiques :** l'analyse déterministe extrait des données structurées des contrats. Le raisonnement de l'IA identifie les clauses inhabituelles, évalue le risque en contexte et signale les problèmes potentiels qui ne correspondent pas aux modèles standards.

Chaque domaine exige la même réflexion architecturale : identifier ce qui demande une fiabilité parfaite, identifier ce qui bénéficie d'un raisonnement créatif, concevoir des interfaces propres entre eux et construire une gestion complète des solutions de repli.

## De l'utilisateur d'outils à l'architecte de systèmes

Vous avez commencé cette série en vous demandant comment intégrer l'IA dans votre travail. La progression se révèle d'elle-même :

Le niveau 1 a intégré l'IA dans les outils que vous utilisez déjà. Le niveau 2 vous a appris à diriger des agents IA pour des tâches complètes. Le niveau 3 a permis des systèmes autonomes qui exécutent des workflows en continu. Le niveau 4 vous montre comment architecturer l'intelligence elle-même — en construisant des systèmes où la fiabilité déterministe et la créativité de l'IA se complètent.

Ce dernier niveau est le plus exigeant sur le plan technique. Vous avez besoin de solides compétences en architecture logicielle, d'une compréhension approfondie des capacités et des limites de l'IA, d'une expertise du domaine pour savoir où chaque élément a sa place, et d'une pensée systémique pour gérer les inévitables cas limites.

**Commencez petit.** N'architecturez pas une plateforme de tutorat complète dès le premier jour. Construisez un composant : un générateur d'explications par IA, encapsulé dans des contraintes déterministes. Déployez-le, mesurez la qualité, apprenez des échecs. Ajoutez le composant suivant. Construisez la complexité de manière incrémentielle.

**Investissez dans l'observabilité.** Les systèmes hybrides échouent de manière inédite. Vous avez besoin d'une journalisation complète des prises de décision, tant déterministes que celles de l'IA, de métriques de qualité pour les sorties de l'IA, d'un suivi des coûts par opération et d'alertes claires lorsque l'une ou l'autre couche se comporte de manière inattendue.

**Planifiez l'évolution de l'IA.** Les modèles d'IA disponibles aujourd'hui seront obsolètes dans quelques mois. Concevez votre architecture de manière à pouvoir changer de modèle sans réécrire le système. Les interfaces entre les couches déterministe et IA constituent votre couche de stabilité.

Les développeurs qui maîtriseront cela ne se contenteront pas de livrer des fonctionnalités plus rapidement. Ils construiront des produits qui étaient impossibles auparavant — des systèmes qui combinent la fiabilité conçue par l'homme avec l'adaptation pilotée par l'IA, offrant une intelligence personnalisée à des millions d'utilisateurs.

La plateforme éducative que nous avons conçue ne se contente pas de délivrer du contenu plus vite. Elle enseigne de manière à s'adapter à l'esprit de chaque étudiant, offrant une attention personnalisée à une échelle qu'aucun nombre de tuteurs humains ne pourrait égaler.

C'est là toute la transformation.

***

*Cet article explore le niveau 4 de l'intégration de l'IA : la programmation de systèmes intelligents qui allient contrôle déterministe et raisonnement IA. Chaque niveau du cadre représente une intégration plus profonde, de l'assistance intégrée à la conception d'intelligence sur mesure, en passant par l'opération autonome.*
