![](assets/thumbnail.jpg)

# Programmer des systèmes intelligents

Il y a un moment où l'IA cesse d'être votre outil et devient votre produit.

Pour moi, c'est arrivé en construisant une API d'actualités. La fonctionnalité semblait simple : dédupliquer les articles entrants pour que les utilisateurs ne voient pas la même histoire deux fois. Approche traditionnelle : comparer les titres, vérifier le chevauchement de mots-clés, peut-être calculer un score de similarité.

Puis j'ai rencontré le vrai problème : est-ce que "Fed raises rates" est la même histoire que "Federal Reserve increases interest rates amid inflation concerns" ? Et "Powell announces monetary policy shift" ?

Aucune quantité de correspondance de chaînes ne résout ça. Les histoires sont sémantiquement identiques mais lexicalement différentes. J'avais besoin que le système *comprenne* que ces titres décrivent le même événement sous-jacent.

C'est là que l'architecture a changé. L'IA ne m'aidait plus à construire la fonctionnalité. L'IA *était* la fonctionnalité.

***

## L'architecture hybride

![](assets/bridge-merge.jpg)

L'erreur que je vois les développeurs faire : traiter l'IA comme soit une solution magique, soit un risque dangereux. La vérité est plus nuancée.

**Le code pur** est prévisible mais rigide. Un système de déduplication if/else attraperait les correspondances exactes mais raterait les doublons sémantiques. Il échouerait dès que les titres utiliseraient une formulation différente.

**L'IA pure** est flexible mais chaotique. Envoyez chaque article à un LLM et demandez "est-ce un doublon ?" Vous obtiendrez des résultats incohérents, des raisonnements hallucinés, et aucune garantie que le résultat corresponde à votre modèle de données.

La réponse est **l'architecture hybride** : le code pour les contraintes, l'IA pour le raisonnement.

Voici comment je pense la répartition :

**Le code gère :**
- La récupération et validation des données
- L'enforcement des schémas
- Les règles métier (limites de débit, permissions)
- La gestion d'état (enregistrements en base)
- Les pistes d'audit et le logging

**L'IA gère :**
- La compréhension sémantique
- La classification avec des frontières floues
- La génération de contenu
- La reconnaissance de patterns dans des données non structurées

L'objectif est de laisser l'IA faire ce en quoi elle est bonne (raisonner sous l'ambiguïté) pendant que le code gère ce en quoi il est bon (les garanties déterministes).

***

## Le pattern sandwich

![](assets/layered-cake.jpg)

Chaque appel IA dans mon API d'actualités suit la même structure : **Code → IA → Code**.

Laissez-moi vous montrer avec l'agent de déduplication.

**Couche 1 : Code (Préparation)**

Avant que l'IA voie quoi que ce soit, le code s'exécute :

```typescript
// Récupérer les rapports existants depuis la base
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

L'IA ne requête pas la base de données. Elle ne décide pas contre combien de rapports comparer. Le code prend ces décisions.

**Couche 2 : IA (Raisonnement)**

L'agent reçoit les données formatées et une instruction claire :

```typescript
// Le prompt concentre l'IA sur la comparaison sémantique
'Déterminer si un rapport d'actualité entrant décrit le même 
événement sous-jacent qu'un rapport existant. Se concentrer sur 
l'événement central, pas sur les similarités de surface.'

// L'IA raisonne sur QUI, QUOI, OÙ, QUAND
// Est-ce que "Fed raises rates" est le même événement que "Powell announces policy shift" ?
```

L'IA fait ce que je ne peux pas coder en dur : comprendre que deux titres formulés différemment décrivent le même événement du monde réel.

**Couche 3 : Code (Validation)**

Le résultat de l'IA est contraint par un schéma :

```typescript
static readonly SCHEMA = z.object({
    duplicateOfReportId: z.string().nullable(),
    reason: z.string(),
});
```

L'IA ne peut pas retourner "peut-être" ou "probablement un doublon" ou une structure que je n'avais pas anticipée. Elle fournit soit un ID de rapport valide, soit null. Le schéma Zod l'impose à l'exécution.

Si la validation échoue, le système log l'erreur et se rabat sur traiter l'article comme unique. Pas de crash. Pas de comportement indéfini.

***

## De vrais agents, de vraies contraintes

Laissez-moi vous montrer un autre agent du même système — l'agent de fabrication. Oui, je génère des articles d'actualité *faux*. Volontairement.

L'app inclut un jeu "repérez le faux" où les utilisateurs essaient d'identifier des articles fabriqués parmi les vrais. L'IA génère des histoires convaincantes-mais-fictionnelles, et les utilisateurs développent leur littératie médiatique en trouvant les indices révélateurs.

Voici l'architecture de contraintes :

```typescript
static readonly SCHEMA = z.object({
    headline: headlineSchema,      // Format de titre validé
    body: bodySchema,              // Corps avec contrainte de longueur
    category: categorySchema,      // Doit être une enum de catégorie valide
    clarification: z.string(),     // Explication pour la révélation post-devinette
    tone: z.enum(['satirical']),   // Seul ton autorisé pour l'instant
});
```

L'IA peut être créative avec le contenu. Elle ne peut pas inventer de catégories. Elle ne peut pas sauter la clarification. Elle ne peut rien produire qui ne corresponde pas à mon modèle de domaine.

Le prompt inclut des directives détaillées :

```
**Fabrication Complète** : L'histoire doit être 100% fictionnelle—aucun événement réel
**Présentation Convaincante** : Doit tromper le lecteur moyen initialement
**Contenu Sûr** : Ne jamais risquer de dommage réel ou cibler des groupes vulnérables
**Valeur Éducative** : Démontrer les techniques de désinformation clairement
```

Mais je ne *fais pas confiance* à l'IA pour suivre ces directives. La couche de validation attrape les violations. La file de révision humaine existe pour les cas limites. L'architecture suppose que l'IA échouera parfois, et intègre des solutions de repli.

***

## Tester des systèmes probabilistes

![](assets/lab-instruments.jpg)

Voici la vérité inconfortable sur les systèmes IA : ils ne sont pas déterministes. Exécutez la même entrée deux fois, vous pourriez obtenir des sorties différentes.

Cela casse les tests traditionnels. Vous ne pouvez pas asserter que `deduplicate("Fed raises rates")` retourne toujours le même ID de rapport. L'IA pourrait formuler son raisonnement différemment. La confiance pourrait varier.

Ma stratégie de test a trois couches :

**1. Tests unitaires pour le code**

Les couches de préparation et de validation sont déterministes. Testez-les normalement.

```typescript
test('le schéma rejette une classification invalide', () => {
    const invalid = { classification: 'MAYBE', reason: 'unsure' };
    expect(() => ClassificationSchema.parse(invalid)).toThrow();
});
```

**2. Évaluations pour l'IA**

Je maintiens un jeu de données d'environ 100 cas de test avec des réponses correctes connues. L'agent de classification s'exécute contre tous, et je mesure la précision.

```
Précision de classification : 94.2% (seuil : 90%)
Précision de déduplication : 91.7% (seuil : 85%)
```

Si la précision tombe en dessous du seuil après une mise à jour de modèle ou un changement de prompt, le déploiement échoue.

**3. Tests de garde-fous**

Que se passe-t-il quand l'IA se comporte mal ? Testez les replis.

```typescript
test('se rabat sur unique quand la déduplication échoue', async () => {
    // Forcer l'IA à retourner un résultat invalide
    mockModel.mockReturnValue({ invalid: 'response' });
    
    const result = await pipeline.process(newReport);
    
    // Le système devrait traiter comme unique, pas crasher
    expect(result.isDuplicate).toBe(false);
    expect(logger.warn).toHaveBeenCalled();
});
```

Le système doit être robuste aux échecs de l'IA, pas seulement à ses succès.

***

## L'état d'esprit d'orchestrateur

Construire des systèmes intelligents nécessite un changement de modèle mental.

Logiciel traditionnel : les composants sont logiques. Étant donné l'entrée X, ils produisent la sortie Y. Toujours.

Systèmes intelligents : certains composants sont probabilistes. Étant donné l'entrée X, ils produisent la sortie Y *la plupart du temps*. Parfois ils vous surprennent.

Cela change comment vous architecturez :

- **Validation partout** : Ne jamais faire confiance au résultat de l'IA. Toujours valider contre des schémas.
- **Les replis comme citoyens de première classe** : Que se passe-t-il quand l'IA échoue ? Concevez ce chemin explicitement.
- **Observabilité** : Loggez les entrées et sorties de l'IA. Vous en aurez besoin pour le débogage.
- **Portes humaines** : Certaines décisions nécessitent une approbation humaine, même si l'IA pourrait les prendre.

Votre rôle passe d'écrire de la logique à **orchestrer de l'intelligence**. Vous êtes le concepteur de frontières — garantissant que le raisonnement de l'IA crée de la valeur sans créer le chaos.

***

## La série en rétrospective

Nous avons couvert quatre niveaux d'intégration de l'IA :

- **1. Assistance** : Prédit votre prochaine frappe — Exécuter avec accélération
- **2. Délégation** : Implémente votre spécification — Diriger et réviser
- **3. Autonomie** : Opère sur des déclencheurs sans vous — Architecturer des systèmes et faire confiance
- **4. Intégration** : Devient partie du produit — Concevoir des architectures hybrides

La plupart de mon travail quotidien vit aux Niveaux 1 et 2. Copilot gère la syntaxe ; Claude gère les fonctionnalités boilerplate. Le Niveau 3 tourne en arrière-plan, gardant mes projets en bonne santé. Le Niveau 4 apparaît quand je construis des produits qui ont véritablement besoin de l'intelligence comme fonctionnalité.

Le fantasme Jarvis du premier article n'était pas faux — c'était juste un point sur un spectre. Le vrai superpouvoir n'est pas d'avoir un assistant IA. C'est de savoir quel *type* d'assistance IA le moment requiert.

La technologie avance vite. Nouveaux modèles tous les quelques mois. Nouvelles capacités toutes les quelques semaines. Mais les principes fondamentaux — frontières claires, couches de validation, dégradation gracieuse, portes humaines — restent constants.

Construisez des systèmes qui utilisent les forces de l'IA tout en compensant ses faiblesses. C'est le défi d'ingénierie de cette ère. Et honnêtement ? C'est un défi plutôt excitant à avoir.
