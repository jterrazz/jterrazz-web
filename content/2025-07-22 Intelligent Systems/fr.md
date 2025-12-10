![](assets/thumbnail.jpg)

# Programmer des systèmes intelligents

Il y a un moment où l'IA cesse d'être votre outil pour devenir votre produit.

Pour moi, c'est arrivé en développant une API d'actualités. La feature semblait simple : dédupliquer les articles entrants pour éviter que les utilisateurs voient la même info deux fois. Comparer les titres, vérifier les recoupements de mots-clés, calculer des scores de similarité.

Puis j'ai buté sur le vrai problème : est-ce que « La Fed relève ses taux » et « La Réserve fédérale augmente les taux d'intérêt face à l'inflation », c'est la même actu ? Et « Powell annonce un virage de politique monétaire » ?

Aucune comparaison de chaînes ne résout ça. Ces titres disent la même chose avec des mots différents. Il fallait que le système *comprenne* qu'ils décrivent le même événement.

C'est là que l'architecture a basculé. L'IA ne m'aidait plus à construire la feature. L'IA *était* la feature.

***

## L'architecture hybride

![](assets/bridge-merge.jpg)

L'erreur que je vois souvent chez les développeurs, c'est de traiter l'IA comme magique ou comme dangereuse. Elle n'est ni l'un ni l'autre.

**Le code seul** est prévisible mais rigide. Il repère les correspondances exactes, mais rate les doublons sémantiques.

**L'IA seule** est flexible mais imprévisible. Résultats incohérents, hallucinations, aucune garantie que la sortie colle à votre modèle.

La réponse : l'**architecture hybride**. Le code pour les contraintes, l'IA pour le raisonnement.

Voici comment je répartis les rôles :

**Le code gère :**
- La récupération et la validation des données
- L'application des schémas
- Les règles métier (rate limiting, permissions)
- La gestion d'état (enregistrements en base)
- L'audit et les logs

**L'IA gère :**
- La compréhension sémantique
- La classification aux frontières floues
- La génération de contenu
- La reconnaissance de patterns dans des données non structurées

Laissez l'IA faire ce qu'elle fait bien — gérer l'ambiguïté — pendant que le code fait ce qu'il fait bien — appliquer les règles.

***

## Le pattern sandwich

![](assets/layered-cake.jpg)

Chaque appel IA de mon API d'actus suit la même structure : **Code → IA → Code**.

Illustration avec l'agent de déduplication.

**Couche 1 : Code (Préparation)**

Avant que l'IA ne voie quoi que ce soit, le code s'exécute :

```typescript
// Récupérer les rapports récents en base
const existingReports = await this.reportRepository.findRecent({
    country: newReport.country,
    limit: 50,
});

// Formater pour le prompt
const formattedReports = existingReports.map(r => ({
    id: r.id,
    core: r.core.value,
    background: r.background.value,
}));
```

L'IA n'interroge pas la base. Elle ne décide pas contre combien de rapports comparer. Le code prend ces décisions.

**Couche 2 : IA (Raisonnement)**

L'agent reçoit les données formatées et une instruction claire :

> « Détermine si le rapport entrant décrit le même événement sous-jacent qu'un rapport existant. Concentre-toi sur l'événement central, pas sur les similarités de surface. »

L'IA raisonne sur le QUI, QUOI, OÙ, QUAND. « La Fed relève ses taux », c'est le même événement que « Powell annonce un virage politique » ? C'est ce que je ne peux pas coder en dur.

**Couche 3 : Code (Validation)**

La sortie de l'IA est contrainte par un schéma :

```typescript
static readonly SCHEMA = z.object({
    duplicateOfReportId: z.string().nullable(),
    reason: z.string(),
});
```

L'IA ne peut pas répondre « peut-être » ou « probablement un doublon ». Elle fournit un ID valide ou null. Si la validation échoue, le système considère l'article comme unique. Pas de crash.

***

## Des agents réels, des contraintes réelles

L'application comprend un jeu « trouvez le faux » — les utilisateurs tentent d'identifier des articles fabriqués parmi les vrais. Ils développent leur esprit critique en repérant les indices.

Autrement dit, je dois générer de fausses infos convaincantes. Volontairement. C'est l'agent de fabrication.

Voici l'architecture de contraintes :

```typescript
static readonly SCHEMA = z.object({
    headline: headlineSchema,      // Format de titre validé
    body: bodySchema,              // Longueur encadrée
    category: categorySchema,      // Enum obligatoire
    clarification: z.string(),     // Explication post-réponse
    tone: z.enum(['satirical']),   // Seul ton autorisé pour l'instant
});
```

L'IA peut faire preuve de créativité sur le contenu. Elle ne peut pas inventer de catégories. Elle ne peut pas sauter la clarification. Chaque sortie doit coller à mon modèle.

Le prompt embarque des directives détaillées :

```
**Fabrication totale** : L'histoire doit être 100 % fictive — aucun événement réel
**Crédibilité** : Doit tromper un lecteur lambda au premier abord
**Sans danger** : Ne jamais risquer de nuire dans le monde réel ni cibler de groupes vulnérables
**Valeur pédagogique** : Illustrer clairement les techniques de désinformation
```

Mais je ne *fais pas confiance* à l'IA pour respecter ces consignes. La couche de validation intercepte les violations. Une file de revue humaine traite les cas limites. L'architecture présuppose l'échec et intègre des fallbacks.

***

## Tester des systèmes probabilistes

![](assets/lab-instruments.jpg)

Les systèmes IA ne sont pas déterministes. Exécutez la même entrée deux fois, vous pourriez obtenir des sorties différentes.

Ça casse les tests classiques. Impossible d'affirmer que `deduplicate("La Fed relève ses taux")` retourne toujours le même ID. L'IA peut formuler son raisonnement différemment. Le score de confiance peut varier.

Ma stratégie de test repose sur trois couches :

**1. Tests unitaires pour le code**

Les couches de préparation et de validation sont déterministes. Testez-les normalement.

```typescript
test('schema rejects invalid classification', () => {
    const invalid = { classification: 'MAYBE', reason: 'unsure' };
    expect(() => ClassificationSchema.parse(invalid)).toThrow();
});
```

**2. Évaluations pour l'IA**

Je maintiens un jeu de données d'environ 100 cas avec des réponses connues. L'agent de classification passe dessus, je mesure la précision.

```
Précision classification : 94,2 % (seuil : 90 %)
Précision déduplication : 91,7 % (seuil : 85 %)
```

Si la précision passe sous le seuil après une mise à jour de modèle ou un changement de prompt, le déploiement échoue.

**3. Tests de garde-fous**

Que se passe-t-il quand l'IA déraille ? Testez les fallbacks.

```typescript
test('falls back to unique when deduplication fails', async () => {
    // Forcer l'IA à retourner une sortie invalide
    mockModel.mockReturnValue({ invalid: 'response' });
    
    const result = await pipeline.process(newReport);
    
    // Le système doit traiter comme unique, pas planter
    expect(result.isDuplicate).toBe(false);
    expect(logger.warn).toHaveBeenCalled();
});
```

Le système doit encaisser les échecs de l'IA, pas seulement ses succès.

***

## L'état d'esprit de l'orchestrateur

Construire des systèmes intelligents impose un changement de mentalité.

Logiciel classique : l'entrée X produit la sortie Y. Toujours.

Système intelligent : l'entrée X produit la sortie Y *la plupart du temps*. Parfois, ça surprend.

Ça change la façon de construire :

- **Validez tout** : Ne faites jamais confiance à la sortie brute de l'IA.
- **Prévoyez des fallbacks** : Que se passe-t-il quand l'IA échoue ?
- **Loguez tout** : Indispensable pour le debug.
- **Ajoutez des portes humaines** : Certaines décisions exigent une validation.

Votre rôle passe de l'écriture de logique à l'**orchestration d'intelligence**.

***

## La série en rétrospective

- **Niveau 1 — Assistance** : L'IA prédit → Exécuter plus vite
- **Niveau 2 — Direction** : L'IA implémente → Guider chaque étape
- **Niveau 3 — Collaboration** : L'IA explore → Donner le cap, itérer
- **Niveau 4 — Intégration** : L'IA raisonne → Concevoir des systèmes hybrides

La technologie évolue vite. Mais les principes restent : frontières claires, couches de validation, dégradation gracieuse, portes humaines.

Construisez des systèmes qui exploitent les forces de l'IA tout en palliant ses faiblesses.
