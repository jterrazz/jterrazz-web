![](assets/thumbnail.jpg)

# Programmer des systèmes intelligents

Il arrive un moment où l'IA cesse d'être un simple outil pour devenir votre produit.

Pour moi, c'est arrivé en construisant une API d'actualités. La fonctionnalité semblait simple : dédupliquer les articles entrants pour que les utilisateurs ne voient pas deux fois la même histoire. Approche traditionnelle : comparer les titres, vérifier le chevauchement des mots-clés, peut-être calculer un score de similarité.

C'est là que je me suis heurté au vrai problème : Est-ce que "La Fed augmente les taux" est la même histoire que "La Réserve fédérale relève les taux d'intérêt face aux inquiétudes sur l'inflation" ? Et qu'en est-il de "Powell annonce un changement de politique monétaire" ?

Aucune correspondance de chaînes de caractères ne résout ça. Les histoires sont sémantiquement identiques mais lexicalement différentes. J'avais besoin que le système *comprenne* que ces titres décrivent le même événement sous-jacent.

C'est là que l'architecture a changé. L'IA ne m'aidait plus à construire la fonctionnalité. L'IA *était* la fonctionnalité.

***

## L'architecture hybride

![](assets/bridge-merge.jpg)

L'erreur que je vois les développeurs faire : traiter l'IA soit comme une solution magique, soit comme un passif dangereux. La vérité est plus nuancée.

Le **code pur** est prévisible mais rigide. Un système de déduplication if/else attraperait les correspondances exactes mais raterait les doublons sémantiques. Il échouerait dès que les titres utiliseraient une formulation différente.

L'**IA pure** est flexible mais chaotique. Envoyez chaque article à un LLM et demandez "est-ce un doublon ?". Vous obtiendrez des résultats incohérents, des raisonnements hallucinés, et aucune garantie que la sortie corresponde à votre modèle de données.

La réponse est une **architecture hybride** : du code pour les contraintes, de l'IA pour le raisonnement.

Voici comment je conçois la répartition :

**Le code gère :**
- La récupération et la validation des données
- L'application du schéma
- Les règles métier (limites de débit, permissions)
- La gestion d'état (enregistrements en base de données)
- Les pistes d'audit et les logs

**L'IA gère :**
- La compréhension sémantique
- La classification aux frontières floues
- La génération de contenu
- La reconnaissance de patterns dans les données non structurées

L'objectif est de laisser l'IA faire ce pour quoi elle est douée (raisonner dans l'ambiguïté) tout en laissant le code gérer ce pour quoi il est doué (les garanties déterministes).

***

## Le pattern sandwich

![](assets/layered-cake.jpg)

Chaque appel IA dans mon API d'actualités suit la même structure : **Code → IA → Code**.

Laissez-moi vous montrer avec l'agent de déduplication.

**Couche 1 : Code (Préparation)**

Avant que l'IA ne voie quoi que ce soit, le code s'exécute :

```typescript
// Récupérer les rapports existants depuis la base de données
const existingReports = await this.reportRepository.findRecent({
    country: newReport.country,
    limit: 50,
});

// Formater les données pour le prompt
const formattedReports = existingReports.map(r => ({
    id: r.id,
    core: r.core.value,
    background: r.background.value,
}));
```

L'IA n'interroge pas la base de données. Elle ne décide pas à combien de rapports se comparer. Le code prend ces décisions.

**Couche 2 : IA (Raisonnement)**

L'agent reçoit les données formatées et une instruction claire :

```typescript
// Le prompt concentre l'IA sur la comparaison sémantique
'Determine whether an incoming news report describes the same 
underlying event as any existing report. Focus on the core event, 
not surface-level similarities.'

// L'IA raisonne sur le QUI, QUOI, OÙ, QUAND
// Est-ce que "La Fed augmente les taux" est le même événement que "Powell annonce un changement de politique" ?
```

L'IA fait ce que je ne peux pas coder en dur : comprendre que deux titres formulés différemment décrivent le même événement du monde réel.

**Couche 3 : Code (Validation)**

La sortie de l'IA est contrainte par un schéma :

```typescript
static readonly SCHEMA = z.object({
    duplicateOfReportId: z.string().nullable(),
    reason: z.string(),
});
```

L'IA ne peut pas renvoyer "peut-être" ou "probablement un doublon" ou une structure que je n'ai pas anticipée. Soit elle fournit un ID de rapport valide, soit null. Le schéma Zod impose cela au moment de l'exécution.

Si la validation échoue, le système logue l'erreur et se replie sur le traitement de l'article comme unique. Pas de crash. Pas de comportement indéfini.

***

## De vrais agents, de vraies contraintes

Laissez-moi vous montrer un autre agent du même système — l'agent de fabrication. Oui, je génère de *fausses* actualités. Exprès.

L'application inclut un jeu "trouver l'intrus" où les utilisateurs essaient d'identifier les articles fabriqués parmi les vrais. L'IA génère des histoires convaincantes mais fictives, et les utilisateurs développent leur éducation aux médias en trouvant les indices.

Voici l'architecture des contraintes :

```typescript
static readonly SCHEMA = z.object({
    headline: headlineSchema,      // Format de titre validé
    body: bodySchema,              // Corps à longueur contrainte
    category: categorySchema,      // Doit être un enum de catégorie valide
    clarification: z.string(),     // Explication pour la révélation après devinette
    tone: z.enum(['satirical']),   // Seul ton autorisé pour l'instant
});
```

L'IA peut être créative avec le contenu. Elle ne peut pas inventer de catégories. Elle ne peut pas sauter la clarification. Elle ne peut rien sortir qui ne corresponde pas à mon modèle de domaine.

Le prompt inclut des directives détaillées :

```
**Complete Fabrication**: Story must be 100% fictional—no real events
**Convincing Presentation**: Should fool average reader initially
**Safe Content**: Never risk real-world harm or target vulnerable groups
**Educational Value**: Demonstrate misinformation techniques clearly
```

Mais je ne fais pas *confiance* à l'IA pour suivre ces directives. La couche de validation attrape les violations. La file d'attente de révision humaine existe pour les cas limites. L'architecture suppose que l'IA échouera parfois, et intègre des solutions de repli.

***

## Tester des systèmes probabilistes

![](assets/lab-instruments.jpg)

Voici la vérité inconfortable sur les systèmes IA : ils ne sont pas déterministes. Exécutez la même entrée deux fois, vous pourriez obtenir des sorties différentes.

Cela casse les tests traditionnels. Vous ne pouvez pas affirmer que `deduplicate("La Fed augmente les taux")` renvoie toujours le même ID de rapport. L'IA pourrait formuler son raisonnement différemment. La confiance pourrait varier.

Ma stratégie de test comporte trois couches :

**1. Tests unitaires pour le code**

Les couches de préparation et de validation sont déterministes. Testez-les normalement.

```typescript
test('schema rejects invalid classification', () => {
    const invalid = { classification: 'MAYBE', reason: 'unsure' };
    expect(() => ClassificationSchema.parse(invalid)).toThrow();
});
```

**2. Évaluations (Evals) pour l'IA**

Je maintiens un jeu de données d'environ 100 cas de test avec des réponses correctes connues. L'agent de classification s'exécute contre tous ces cas, et je mesure la précision.

```
Classification accuracy: 94.2% (threshold: 90%)
Deduplication precision: 91.7% (threshold: 85%)
```

Si la précision chute en dessous du seuil après une mise à jour du modèle ou un changement de prompt, le déploiement échoue.

**3. Tests de garde-fou (Guardrail)**

Que se passe-t-il quand l'IA se comporte mal ? Testez les solutions de repli.

```typescript
test('falls back to unique when deduplication fails', async () => {
    // Force the AI to return invalid output
    mockModel.mockReturnValue({ invalid: 'response' });
    
    const result = await pipeline.process(newReport);
    
    // System should treat as unique, not crash
    expect(result.isDuplicate).toBe(false);
    expect(logger.warn).toHaveBeenCalled();
});
```

Le système doit être robuste face aux échecs de l'IA, pas seulement face à ses succès.

***

## L'état d'esprit de l'orchestrateur

Construire des systèmes intelligents nécessite un changement de modèle mental.

Logiciel traditionnel : les composants sont logiques. Étant donné une entrée X, ils produisent une sortie Y. Toujours.

Systèmes intelligents : certains composants sont probabilistes. Étant donné une entrée X, ils produisent une sortie Y *la plupart du temps*. Parfois, ils vous surprennent.

Cela change votre façon d'architecturer :

- **Validation partout** : Ne faites jamais confiance à la sortie de l'IA. Validez toujours contre des schémas.
- **Solutions de repli comme citoyens de première classe** : Que se passe-t-il quand l'IA échoue ? Concevez ce chemin explicitement.
- **Observabilité** : Loguez les entrées et sorties de l'IA. Vous en aurez besoin pour le débogage.
- **Barrières humaines** : Certaines décisions nécessitent une approbation humaine, même si l'IA pourrait les prendre.

Votre rôle évolue de l'écriture de la logique à l'**orchestration de l'intelligence**. Vous êtes le concepteur des frontières — vous assurant que le raisonnement de l'IA crée de la valeur sans créer de chaos.

***

## La série en rétrospective

Nous avons couvert quatre niveaux d'intégration de l'IA :

| Niveau | Ce que fait l'IA | Votre rôle |
|-------|------------------|-----------|
| **1. Assistance** | Prédit votre prochaine frappe | Exécuter avec accélération |
| **2. Délégation** | Implémente votre spécification | Diriger et revoir |
| **3. Autonomie** | Opère sur des déclencheurs sans vous | Architecturer des systèmes et faire confiance |
| **4. Intégration** | Devient partie du produit | Concevoir des architectures hybrides |

La majeure partie de mon travail quotidien vit aux Niveaux 1 et 2. Copilot gère la syntaxe ; Claude gère les fonctionnalités boilerplate. Le Niveau 3 tourne en arrière-plan, gardant mes projets sains. Le Niveau 4 apparaît quand je construis des produits qui ont véritablement besoin de l'intelligence comme fonctionnalité.

Le fantasme de Jarvis du premier article n'était pas faux — c'était juste un point sur un spectre. Le vrai super-pouvoir n'est pas d'avoir un assistant IA. C'est de savoir quel *type* d'assistance IA le moment exige.

La technologie évolue vite. De nouveaux modèles tous les quelques mois. De nouvelles capacités toutes les quelques semaines. Mais les principes fondamentaux — frontières claires, couches de validation, dégradation gracieuse, barrières humaines — restent constants.

Construisez des systèmes qui utilisent les forces de l'IA tout en compensant ses faiblesses. C'est le défi d'ingénierie de notre époque. Et honnêtement ? C'est un défi plutôt excitant à relever.
