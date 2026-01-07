![](assets/thumbnail.jpg)

# Quand l'IA devient le produit

Il y a un moment où l'IA cesse d'être votre assistant pour devenir votre architecture.

Pour moi, c'est arrivé en construisant une API d'agrégation de nouvelles. La fonctionnalité semblait simple : dédoublonner les articles entrants. Comparer les titres, vérifier le chevauchement des mots-clés. De l'ingénierie standard.

Puis j'ai touché le mur. Est-ce que *"La Fed monte les taux"* est la même histoire que *"La Réserve Fédérale augmente les taux d'intérêt sur fond d'inflation"* ? Et *"Powell signale une position monétaire stricte"* ?

Les titres ne partagent presque aucun mot, pourtant ils décrivent la même réalité sous-jacente. Aucune quantité de correspondance de chaînes ne résout cela. Le problème exige de la *compréhension*.

C'est là que l'architecture a changé. L'IA ne m'aidait plus à construire la fonctionnalité. **L'IA était la fonctionnalité.**

Ce changement—de l'IA comme outil à l'IA comme composant—nécessite une façon différente de penser. Les intuitions d'ingénierie traditionnelles s'effondrent. De nouveaux modèles émergent.

---

## Le piège des approches pures

La plupart des développeurs tombent dans l'un de ces deux pièges en intégrant l'IA :

1.  **Le Piège Magique :** Traiter l'IA comme une boîte noire qui résout tout. Entrer des données, obtenir des réponses. Cela fonctionne jusqu'à ce que le modèle hallucine ou retourne du JSON non parsable.
2.  **Le Piège de la Peur :** Traiter l'IA comme trop peu fiable pour lui faire confiance. L'envelopper dans tellement de couches qu'elle s'exécute rarement.

Les deux pièges viennent du fait de traiter l'IA comme absolue. La réalité est nuancée. L'IA est **fiablement bonne pour certaines choses** (compréhension sémantique, classification floue) et **non-fiablement mauvaise pour d'autres** (précision, mathématiques, respect strict des règles).

---

## Le principe hybride

![](assets/bridge-merge.jpg)

La solution est l'**Architecture Hybride** : du code pour les contraintes, de l'IA pour le raisonnement.

*   **Le Code** est déterministe, vérifiable, rapide et précis.
*   **L'IA** est flexible, sémantique, créative et floue.

La division du travail devient claire :
*   **Donner au Code :** Récupération de données, validation de schéma, règles métier, gestion d'état.
*   **Donner à l'IA :** Compréhension sémantique, classification floue, génération de contenu, résumé.

**Le code protège les invariants. L'IA gère l'ambiguïté.**

---

## Le pattern sandwich

![](assets/layered-cake.jpg)

Chaque appel IA dans mon système suit la même structure : **Code → IA → Code**.

J'appelle cela le **Pattern Sandwich**. Le code prépare l'entrée, l'IA raisonne dessus, le code valide la sortie. La flexibilité de l'IA est entièrement contenue dans les contraintes du code.

### Couche 1 : préparation (code)
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

Le code contrôle **quelles** données l'IA voit, **combien**, et dans **quel format**. L'IA reçoit une vue curatée.

### Couche 2 : raisonnement (IA)
L'IA reçoit les données formatées et une instruction claire :
> "Détermine si le rapport d'actualité entrant décrit le même événement sous-jacent que n'importe quel rapport existant. Concentre-toi sur l'événement central—qui a fait quoi, quand, où."

C'est la tâche que je ne peux pas coder en dur. L'IA raisonne sur l'équivalence sémantique.

### Couche 3 : validation (code)
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

L'IA ne peut pas retourner "peut-être" ou inventer de nouveaux états. Si la validation échoue, le système se replie gracieusement. Le sandwich garantit que la flexibilité de l'IA opère strictement à l'intérieur des contraintes du code.

---

## Un exemple réel : l'agent de fabrication

Mon app de nouvelles inclut un jeu "trouvez le faux". J'ai besoin d'un agent pour générer de fausses nouvelles convaincantes.

**Préparation :** Le code sélectionne un vrai article pour l'inspiration stylistique et définit le niveau de difficulté.
```typescript
const prompt = buildFabricationPrompt({
    inspiration: realArticle,
    targetCategory: 'technology',
    difficulty: 'medium',
});
```

**Raisonnement :** L'IA génère le faux article.

**Validation :**
```typescript
const FabricatedArticle = z.object({
    headline: z.string().min(10).max(100),
    body: z.string().min(200).max(2000),
    tone: z.enum(['satirical']),
});
```
Mais la validation de schéma ne suffit pas pour la sécurité du contenu.
```typescript
const safetyResult = await this.safetyChecker.analyze(article);
if (safetyResult.flagged) {
    return this.sendToHumanReview(article);
}
```
Certains contenus vont dans une file de revue humaine. L'architecture suppose que l'IA produira occasionnellement quelque chose de problématique et intègre la barrière.

---

## Tester les systèmes probabilistes

![](assets/lab-instruments.jpg)

Les tests traditionnels supposent le déterminisme : donnée l'entrée X, attendre la sortie Y. L'IA brise cela.

Cela nécessite une stratégie de test à trois couches :

1.  **Tests Unitaires pour le Code :** Les couches de préparation et de validation sont déterministes. Testez-les normalement.
2.  **Évaluations (Evals) pour l'IA :** Maintenez un jeu de données de cas de test avec des réponses correctes connues. Lancez l'IA contre tous et mesurez la précision. Si la précision tombe sous un seuil (ex: 90%), le déploiement échoue.
3.  **Tests de Garde-fous :** Testez ce qui se passe quand l'IA se comporte mal.
    ```typescript
    test('gère gracieusement une réponse IA malformée', async () => {
        mockModel.mockReturnValue({ invalid: 'garbage' });
        const result = await pipeline.process(newReport);
        expect(result.fallbackUsed).toBe(true);
    });
    ```

Le système doit être robuste aux échecs de l'IA, pas seulement à ses succès.

---

## L'état d'esprit de l'orchestrateur

Construire des systèmes avec des composants IA nécessite un changement mental de l'écriture de logique à l'**orchestration de comportement**.

Vous définissez des contraintes et des objectifs. L'IA trouve comment les atteindre. Votre travail est de vous assurer qu'elle reste dans les limites.

**Principes de l'Orchestrateur :**
1.  **Tout Valider :** Ne jamais faire confiance à la sortie de l'IA.
2.  **Concevoir des Replis :** Chaque appel IA devrait avoir un chemin de dégradation gracieuse.
3.  **Loguer Intensivement :** Les logs sont votre seule fenêtre dans la "boîte noire".
4.  **S'attendre à la Dérive :** Le comportement de l'IA change avec le temps. Surveillez continuellement.

L'IA vous donne des capacités qui étaient impossibles auparavant. Compréhension sémantique. Classification floue. Le compromis est l'imprévisibilité.

Une bonne architecture rend ce compromis valable. Vous obtenez les capacités. Vous contenez l'imprévisibilité. Laissez le code faire le travail du code. Laissez l'IA faire le travail de l'IA. Concevez les frontières avec soin.

