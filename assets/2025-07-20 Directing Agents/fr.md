![](./assets/thumbnail.jpg)

# L'art de diriger l'IA

Il existe un mode de travail avec l'IA qui se situe entre la passivité de l'autocomplétion et la délégation de l'autonomie totale. Vous sélectionnez du code, décrivez un état souhaité, et l'IA exécute la transformation. Elle ne prédit pas votre prochaine frappe ; elle réécrit la logique en se basant sur votre intention.

J'appelle cela **Diriger**. Vous spécifiez la transformation, l'IA l'exécute, et vous vérifiez le résultat. Ce comportement est typique de modèles comme **Claude Haiku 4.5** ou **Sonnet 4.5**—rapides, précis et optimisés pour le suivi d'instructions à faible latence.

En surface, cela semble trivial. Sélectionner, décrire, accepter. Un rechercher-remplacer glorifié. Mais à mes débuts, "Améliore ça" produisait le chaos. "Ajoute la gestion d'erreur" introduisait les mauvaises abstractions. L'IA faisait exactement ce que je demandais—je ne le demandais simplement pas avec assez de précision.

Diriger est une compétence. Les développeurs qui la maîtrisent compressent des heures de travail en minutes. Ceux qui ne le font pas génèrent simplement des bugs plus vite qu'ils ne peuvent les corriger.

---

## Ce que diriger compresse réellement

![](assets/split-thread.jpg)

Chaque modification de code se compose de deux actes distincts : la **décision** et la **transcription**.

La **décision** est l'étincelle intellectuelle. *"Cette fonction a besoin de vérifications de nullité."* *"Ces callbacks devraient être async/await."* La **transcription** est le labeur mécanique : localiser les références, taper la syntaxe, équilibrer les parenthèses.

**Diriger compresse la transcription. La décision reste la vôtre.**

Cette distinction définit la frontière de la confiance. Vous n'externalisez pas votre jugement ; vous externalisez votre clavier. L'architecture, les cas limites, la question de *"devrions-nous même faire cela ?"*—tout cela reste votre responsabilité.

---

## La hiérarchie de la précision

![](assets/architect-table.jpg)

Une entrée vague produit des déchets. Une entrée précise produit du code prêt pour la production. La précision n'est pas seulement une question de verbosité—c'est choisir le bon *mécanisme* de spécification.

### Niveau 1 : les contraintes
Parfois, l'instruction la plus critique n'est pas ce que vous voulez—c'est ce que vous ne voulez *pas*.

*   "N'ajoute pas de dépendances externes."
*   "Garde l'API publique inchangée."
*   "Ne modifie pas le schéma de base de données."

Les contraintes sont essentielles lorsque vous faites confiance aux détails d'implémentation de l'IA mais avez besoin d'imposer des limites. Elles agissent comme des garde-fous, pas des plans d'architecte.

### Niveau 2 : les modèles (patterns)
Ne décrivez pas le style. Montrez-le.

```typescript
// Gestion d'erreur actuelle :
if (error) {
    console.log(error);
    return null;
}

// Transforme vers ce modèle :
if (error) {
    logger.error('Opération échouée', { error, context: operationName });
    throw new AppError('OPERATION_FAILED', { cause: error });
}

// Instruction : Applique ce modèle à tous les gestionnaires d'erreurs de ce fichier.
```

L'IA n'a pas à deviner vos conventions de codage. Elle les voit. Les invites basées sur des modèles surpassent systématiquement les descriptions abstraites.

### Niveau 3 : les contrats
La forme ultime de précision est une spécification vérifiable par machine : un test.

```typescript
test('retente les requêtes échouées avec un backoff exponentiel', async () => {
    const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce({ ok: true, data: 'success' });
    
    const result = await fetchWithRetry('/api/data', { 
        fetch: mockFetch,
        maxRetries: 3,
        baseDelay: 100 
    });
    
    expect(mockFetch).toHaveBeenCalledTimes(3);
});
```

L'instruction : *"Fais passer ce test."* Il n'y a aucune ambiguïté. L'IA ne peut pas mal interpréter le succès car le succès est défini par le lanceur de tests.

---

## La discipline de vérification

La précision vous amène à 80% du chemin. Les 20% restants sont la vérification.

L'IA est confiante, pas prudente. Elle produit du code qui *semble* juste avec la même fluidité qu'elle produit du code qui *est* juste. Votre travail est de faire la différence.

### Modes d'échec courants

**1. API hallucinées**
L'IA invente des méthodes qui n'existent pas ou utilise les mauvaises signatures. C'est endémique avec les librairies moins courantes.
```typescript
// L'IA a écrit :
await redis.setWithExpiry(key, value, 3600);
// Existe réellement :
await redis.set(key, value, { EX: 3600 });
```

**2. Dérive sémantique**
Le refactoring change le comportement, pas juste la structure. Le code semble équivalent mais gère les cas limites différemment.
```typescript
// Original :
const result = items.find(x => x.id === id) || defaultItem;
// "Refactorisé" :
const result = items.find(x => x.id === id) ?? defaultItem;
```
Ceux-ci se comportent différemment lorsque `find()` retourne un élément falsy.

**3. Violations de modèles**
L'IA résout le problème correctement mais viole les conventions locales (ex: utiliser une `Error` brute au lieu de votre `AppError` personnalisé).

**4. Cas limites manqués**
Le chemin heureux fonctionne parfaitement. Les entrées nulles plantent le système. Les tableaux vides lancent des exceptions. L'IA optimise pour le cas commun.

### La checklist de vérification
Avant d'accepter tout changement dirigé :
1.  **Lisez le Diff :** Chaque ligne. Si c'est trop gros pour être lu, utilisez la collaboration à la place.
2.  **Vérifiez les Limites :** Que se passe-t-il avec null ? Les ensembles vides ?
3.  **Lancez les Tests :** Évident, pourtant facilement sauté.
4.  **Expliquez-le à vous-même :** Si vous ne pouvez pas articuler ce qui a changé et pourquoi, vous ne le comprenez pas assez bien pour le livrer.

---

## Le piège de la vitesse

Diriger est rapide. Dangereusement rapide.

Un diff apparaît en deux secondes. Votre cerveau fait correspondre des motifs familiers. *"Ça ressemble à une gestion d'erreur standard. J'envoie."*

Je l'ai fait. J'ai livré du code qui fonctionnait en dev mais échouait en prod parce que j'avais manqué un cas limite que l'IA avait aussi manqué. J'appelle cela la **Fatigue d'Approbation**. Quand chaque changement prend des secondes, votre discipline de revue s'érode.

Ma règle : **Plus le changement est rapide, plus la revue est lente.**

Une génération de deux secondes mérite une revue de deux minutes. Le coût de trouver des bugs en production dépasse de loin le coût d'une vérification minutieuse maintenant.

---

## Développer l'instinct

Après une année de pratique quotidienne, j'ai développé des instincts pour une direction efficace.

### Cadrage (Scoping)
Toutes les tâches n'appartiennent pas à un changement dirigé.
*   **Bon pour la Direction :** Changements d'une seule fonction, transformations claires, refactoring dans un fichier, diffs <100 lignes.
*   **Mauvais pour la Direction :** Fonctionnalités multi-fichiers, décisions architecturales, exploration.

Si je me surprends à écrire une invite longue et multi-étapes, c'est un signal. La direction est pour les frappes chirurgicales, pas les campagnes militaires.

### Itération de l'invite
La première invite produit rarement le résultat parfait. Savoir *comment* itérer compte plus que de réussir du premier coup.

*   **Rétrécir, ne pas recommencer :** *"C'est proche, mais utilise notre classe `AppError`"* vaut mieux que de réécrire l'invite initiale.
*   **Ajouter des contraintes incrémentalement :** Si la sortie dérive, ajoutez une contrainte pour la fixer. *"La même chose, mais garde la fonction sous 30 lignes."*
*   **Montrer ce qui ne va pas :** *"La logique de réessai semble correcte, mais le calcul du délai est linéaire, pas exponentiel."*

### Reconnaissance de motifs
Après avoir revu des centaines de diffs générés par IA, je scanne pour des signaux d'alarme spécifiques :
*   **Imports Inhabituels :** Dépendances hallucinées possibles.
*   **One-Liners Complexes :** Haut risque de dérive sémantique.
*   **Gestion d'Erreur Manquante :** Cas limites probablement ignorés.
*   **Nombres Magiques :** Constantes qui devraient être configurables.

La vitesse de revue vient de savoir *où* regarder, pas de regarder plus vite.

### L'effet composé

Chaque changement spécifié avec précision affûte votre capacité à articuler votre intention. Chaque erreur attrapée affine votre linter mental.

Après un an de pratique, je dirige des changements en quelques secondes qui auraient pris des minutes à taper—et j'attrape les problèmes avant qu'ils ne partent en prod. Le but n'est pas juste d'accepter les changements plus vite. C'est de développer le jugement qui rend la vérification rapide fiable. Ce jugement est la différence entre une IA qui vous accélère et une IA qui génère de la dette technique.


