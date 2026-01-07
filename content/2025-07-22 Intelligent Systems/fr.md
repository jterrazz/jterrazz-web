![](assets/thumbnail.jpg)

# Quand l'IA Devient le Produit

Il y a un moment où l'IA cesse d'être votre assistant et commence à être votre architecture.

Pour moi, c'est arrivé en construisant une API d'agrégation de nouvelles. La fonctionnalité semblait simple : dédupliquer les articles entrants. Les utilisateurs ne devraient pas voir la même histoire deux fois. Comparer les titres, vérifier le chevauchement des mots-clés, calculer des scores de similarité. De l'ingénierie standard.

Puis j'ai heurté un mur.

*"La Fed augmente les taux"* est-elle la même histoire que *"La Réserve Fédérale relève les taux d'intérêt face à l'inflation"* ? Quid de *"Powell annonce un virage monétaire restrictif"* ?

Les titres ne partagent presque aucun mot, et pourtant ils décrivent la même réalité sous-jacente.

Aucune correspondance de chaînes de caractères ne résout cela. Aucun calcul de distance d'édition. Le problème exige de la *compréhension*.

C'est là que l'architecture a changé. L'IA ne m'aidait plus à construire la fonctionnalité. **L'IA était la fonctionnalité.**

Ce basculement—de l'IA comme outil à l'IA comme composant—exige une nouvelle façon de penser le logiciel. Les intuitions traditionnelles de l'ingénierie s'effondrent. De nouveaux modèles émergent. Cet article parle de ces modèles.

---

## Le Piège des Approches Pures

La plupart des développeurs avec qui je parle tombent dans l'un de ces deux pièges en intégrant l'IA.

**Le Piège Magique**
Traiter l'IA comme une boîte noire qui résout tout. On y injecte des données, on obtient des réponses. Ne vous souciez pas des cas limites—le modèle trouvera. Cela fonctionne jusqu'à ce que le modèle hallucine une catégorie qui n'existe pas dans votre base de données, retourne du JSON inanalysable, ou produise avec confiance de fausses informations.

**Le Piège de la Peur**
Traiter l'IA comme trop peu fiable pour lui faire confiance. L'envelopper dans tant de couches de validation que la latence devient inutilisable. Ajouter tant de solutions de repli (fallbacks) que le chemin de l'IA ne s'exécute que rarement. Construire une complexité immense pour se couvrir contre un problème qu'une architecture réfléchie pourrait prévenir.

Les deux pièges proviennent du même malentendu : traiter l'IA comme soit fiable, soit non fiable en termes absolus.

La réalité est nuancée. L'IA est **fiablement bonne pour certaines choses** et **fiablement mauvaise pour d'autres**. L'architecture doit refléter ce profil.

---

## Le Principe Hybride

![](assets/bridge-merge.jpg)

La solution est l'**Architecture Hybride** : du code pour les contraintes, de l'IA pour le raisonnement.

Ce n'est pas un compromis—c'est jouer sur les forces de chaque système.

**Le Code est :**
*   **Déterministe :** Même entrée, même sortie.
*   **Vérifiable :** Vous pouvez prouver sa correction.
*   **Rapide :** Nanosecondes, pas secondes.
*   **Précis :** Règles exactes, application exacte.

**L'IA est :**
*   **Flexible :** Gère des cas que vous n'avez pas anticipés.
*   **Sémantique :** Comprend le sens, pas juste la syntaxe.
*   **Créative :** Génère du contenu, trouve des motifs.
*   **Floue (Fuzzy) :** Prospère dans l'ambiguïté.

La division du travail devient claire :

| Donnez au Code | Donnez à l'IA |
|----------------|---------------|
| Récupération de données | Compréhension sémantique |
| Validation de schéma | Classification floue |
| Règles métier | Génération de contenu |
| Gestion d'état | Reconnaissance de motifs |
| Limites de taux (Rate limiting) | Résumé |
| Pistes d'audit | Analyse de sentiment |

**Le code protège les invariants. L'IA gère l'ambiguïté.**

Quand vous laissez le code faire ce que le code fait de mieux et l'IA faire ce que l'IA fait de mieux, le système devient à la fois fiable et capable—plus que ce que l'un ou l'autre pourrait accomplir seul.

---

## Le Pattern Sandwich

![](assets/layered-cake.jpg)

Chaque appel IA dans mon système suit la même structure : **Code → IA → Code**.

J'appelle cela le **Pattern Sandwich**. Le code prépare l'entrée, l'IA raisonne dessus, le code valide la sortie. La flexibilité de l'IA est contenue entièrement à l'intérieur des contraintes du code.

### Couche 1 : Préparation (Code)
Avant que l'IA ne voie quoi que ce soit, le code s'exécute :

```typescript
const existingReports = await this.reportRepository.findRecent({
    country: newReport.country,
    limit: 50,
});

const formattedReports = existingReports.map(r => ({
    id: r.id,
    core: r.core.value,
    background: r.background.value,
}));

const prompt = buildDeduplicationPrompt(newReport, formattedReports);
```

Notez ce que le code contrôle :
*   **Quelles données l'IA voit :** Il récupère depuis la base de données—l'IA ne touche jamais directement à la persistance.
*   **Combien de données :** La limite `limit: 50` est une décision de code, pas un jugement d'IA.
*   **Le Format :** L'IA reçoit des données structurées et aseptisées.
*   **L'Invite (Prompt) :** Le code la construit, assurant la cohérence.

L'IA ne décide pas quoi regarder. Elle reçoit une vue curatée.

### Couche 2 : Raisonnement (IA)
L'IA reçoit des données formatées et une instruction claire :

> "Détermine si le rapport d'actualité entrant décrit le même événement sous-jacent que n'importe quel rapport existant. Concentre-toi sur l'événement central—qui a fait quoi, quand, où—pas sur les similitudes de surface dans la formulation."

C'est la tâche que je ne peux pas coder en dur. L'IA raisonne sur l'équivalence sémantique, considérant la réalité sous-jacente plutôt que le chevauchement des mots.

### Couche 3 : Validation (Code)
La sortie de l'IA est contrainte par un schéma :

```typescript
const DeduplicationResult = z.object({
    duplicateOfReportId: z.string().uuid().nullable(),
    reason: z.string().max(500),
    confidence: z.enum(['high', 'medium', 'low']),
});

const parsed = DeduplicationResult.safeParse(aiResponse);

if (!parsed.success) {
    logger.warn('AI returned invalid response', { error: parsed.error });
    return { isDuplicate: false, reason: 'Validation failed' };
}
```

L'IA ne peut pas :
*   Retourner "peut-être" ou inventer de nouveaux états.
*   Fournir un format UUID invalide.
*   Sauter des champs requis.
*   Retourner du texte illimité.

Si la validation échoue, le système ne plante pas—il se replie gracieusement. L'article est traité comme unique, un avertissement est logué, et le pipeline continue.

**Le sandwich assure que la flexibilité de l'IA opère strictement à l'intérieur des contraintes du code.**

---

## Un Exemple Réel : L'Agent de Fabrication

La théorie est propre. Laissez-moi vous montrer un exemple plus désordonné.

Mon app d'actualités inclut un jeu "repérez le faux". Les utilisateurs voient des articles—certains vrais, d'autres fabriqués—et essaient d'identifier les faux. Le but est de construire la littératie médiatique.

Cela signifie que j'ai besoin d'un agent IA qui génère de fausses nouvelles convaincantes. À dessein.

Voici comment le pattern sandwich gère cela :

**Préparation :**
```typescript
const realArticle = await this.articleRepository.findRecent({ limit: 1 });

const prompt = buildFabricationPrompt({
    inspiration: realArticle,  // Référence de style, pas contenu à copier
    targetCategory: 'technology',
    difficulty: 'medium',
});
```
Le code contrôle l'inspiration stylistique, la catégorie et le niveau de difficulté.

**Raisonnement :**
L'IA génère un article fabriqué avec un titre plausible, un corps de texte convaincant et des indices subtils.

**Validation :**
```typescript
const FabricatedArticle = z.object({
    headline: z.string().min(10).max(100),
    body: z.string().min(200).max(2000),
    category: z.enum(['technology', 'business', 'politics', 'science']),
    tells: z.array(z.string()).min(1).max(5),
    clarification: z.string().min(50),
    tone: z.enum(['satirical']),  // Seul ton autorisé pour l'instant
});
```
Mais la validation de schéma ne suffit pas pour ce cas d'usage. Le contenu pourrait être valide structurellement mais nuisible substantiellement. Il y a donc une couche supplémentaire :

```typescript
// Contrôles de sécurité automatisés
const safetyResult = await this.safetyChecker.analyze(article);
if (safetyResult.flagged) {
    logger.warn('Fabricated article flagged for safety review', { article, flags: safetyResult.flags });
    return this.sendToHumanReview(article);
}
```
Certains contenus vont dans une file d'attente de revue humaine. L'architecture suppose que l'IA produira occasionnellement quelque chose de problématique et intègre la barrière.

---

## Tester des Systèmes Probabilistes

![](assets/lab-instruments.jpg)

Le test traditionnel suppose le déterminisme : donnée l'entrée X, attendez la sortie Y. Toujours.

L'IA brise cela. La même entrée peut produire des sorties différentes selon les exécutions. Le format de sortie est cohérent (nous l'imposons), mais le contenu varie.

Cela requiert une stratégie de test à trois couches :

### Couche 1 : Tests Unitaires pour le Code
Les couches de préparation et de validation sont déterministes. Testez-les normalement.

```typescript
test('schema rejects invalid classification', () => {
    const invalid = { classification: 'MAYBE', reason: 'unsure' };
    expect(() => ClassificationSchema.parse(invalid)).toThrow();
});
```

### Couche 2 : Evals pour l'IA
Maintenez un jeu de données de cas de test avec des réponses correctes connues. Lancez l'IA contre tous et mesurez la précision.

```
Dataset: 100 paires d'articles avec statut de duplicata étiqueté par humain
Précision de déduplication : 94.2%
Rappel de déduplication : 91.8%
Seuil : 90% précision, 85% rappel
```

Si la précision tombe sous le seuil, le déploiement échoue. Cela attrape les régressions avant qu'elles n'atteignent les utilisateurs.

### Couche 3 : Tests de Garde-fous
Testez ce qui se passe quand l'IA se comporte mal.

```typescript
test('gracefully handles malformed AI response', async () => {
    mockModel.mockReturnValue({ invalid: 'garbage' });
    
    const result = await pipeline.process(newReport);
    
    expect(result.isDuplicate).toBe(false);
    expect(result.fallbackUsed).toBe(true);
    expect(logger.warn).toHaveBeenCalled();
});
```

Le système doit être robuste face aux échecs de l'IA, pas seulement à ses succès.

---

## L'État d'Esprit de l'Orchestrateur

Construire des systèmes avec des composants IA exige un basculement mental.

L'ingénierie logicielle traditionnelle consiste à écrire de la logique. Vous définissez des transformations exactes : *si ceci, alors cela*. Le code fait ce que vous lui dites.

Les systèmes intelligents consistent à **orchestrer des comportements**. Vous définissez des contraintes et des objectifs. L'IA trouve comment les atteindre. Votre travail est de vous assurer qu'elle reste dans les limites.

Cela change les questions que vous posez :

| Traditionnel | Intelligent |
|--------------|-------------|
| Que doit retourner cette fonction ? | Quelle gamme de sorties est acceptable ? |
| Comment gérer ce cas limite ? | Quel repli utiliser quand l'IA échoue ? |
| Ce code est-il correct ? | Cette sortie est-elle dans les contraintes ? |
| Quelle est l'assertion de test ? | Quel est le seuil de précision ? |

**Principes de l'Orchestrateur :**
1.  **Tout Valider :** Ne jamais faire confiance à la sortie de l'IA.
2.  **Concevoir des Replis :** Chaque appel IA doit avoir un chemin de dégradation gracieuse.
3.  **Loguer Extensivement :** Les logs sont votre seule fenêtre dans la "boîte noire".
4.  **Ajouter des Barrières Humaines :** Certaines décisions ne devraient pas être entièrement automatisées.
5.  **S'attendre à la Dérive :** Le comportement de l'IA change avec le temps. Surveillez continuellement.

---

## L'Architecture qui Émerge

Après avoir construit plusieurs systèmes intégrés à l'IA, une architecture cohérente a émergé :

```
┌─────────────────────────────────────────────────┐
│                    Requête                      │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Préparation (Code)                 │
│  - Récupérer données                            │
│  - Formater pour IA                             │
│  - Construire l'invite                          │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Raisonnement (IA)                  │
│  - Traiter l'entrée                             │
│  - Générer la sortie                            │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Validation (Code)                  │
│  - Analyser la réponse                          │
│  - Vérifier le schéma                           │
│  - Imposer les contraintes                      │
└─────────────────┬───────────────────────────────┘
                  │
          ┌───────┴───────┐
          │               │
     Valide│          Invalide
          │               │
┌─────────▼─────┐   ┌─────▼─────────┐
│   Continuer   │   │     Repli     │
│   traitement  │   │   + logging   │
└───────────────┘   └───────────────┘
```

L'IA n'est jamais autonome. Elle opère à l'intérieur de garde-fous. Elle est puissante précisément *parce que* nous contraignons là où elle peut échouer.

---

## Le Basculement

Construire des systèmes intelligents n'est pas plus dur que le logiciel traditionnel—c'est différent.

Vous écrivez moins de logique et plus de structure. Moins de *"si ceci alors cela"* et plus de *"à l'intérieur de ces limites, débrouille-toi."*

La compétence n'est pas de faire marcher l'IA. C'est de savoir où la laisser marcher et où la contraindre. Le **Principe Hybride**. Le **Pattern Sandwich**. La **Stratégie de Test à Trois Couches**. L'**État d'Esprit de l'Orchestrateur**.

L'IA vous donne des capacités qu'il était impossible de construire avant. Compréhension sémantique. Classification floue. Génération de contenu. La contrepartie est l'imprévisibilité.

Une bonne architecture rend cette contrepartie valable. Vous obtenez les capacités. Vous contenez l'imprévisibilité. Vous construisez des systèmes qui sont à la fois intelligents et fiables.

C'est le but : exploiter ce pour quoi l'IA est bonne tout en protégeant contre ce pour quoi elle est mauvaise. Laissez le code faire le travail du code. Laissez l'IA faire le travail de l'IA. Concevez les frontières avec soin.

