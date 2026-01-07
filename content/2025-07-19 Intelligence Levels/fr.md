![](assets/thumbnail.jpg)

# Les quatre niveaux de maîtrise de l'IA

Il y a deux ans, j'ai écrit ma première ligne de code sous le regard d'une IA. Copilot m'a suggéré le corps entier d'une fonction avant même que je n'aie fini d'en taper la signature. J'ai accepté sans relire. Les tests sont passés. Je me sentais invincible.

Une semaine plus tard, j'ai passé quatre heures à déboguer ce même code. Je n'avais aucune idée de son fonctionnement car je ne l'avais pas écrit—je l'avais simplement *approuvé*.

Cet échec m'a enseigné une leçon cruciale : **l'assistance par IA n'est pas binaire.** Il n'existe pas une unique "bonne façon" de l'utiliser. Il existe plutôt des niveaux d'engagement distincts, chacun exigeant des compétences, une confiance et une vigilance différentes.

La plupart des développeurs que je rencontre traitent l'IA comme un bloc monolithique—l'embrassant totalement ou la rejetant en bloc. Cette vision binaire manque de nuance. La question n'est pas de savoir *si* l'on doit utiliser l'IA, mais *à quelle profondeur* l'intégrer dans son flux de travail pour une tâche donnée.

Après deux ans à construire des logiciels aux côtés de l'IA—à livrer des fonctionnalités, à gérer des catastrophes et finalement à intégrer l'IA au cœur même des produits—j'ai cartographié ce paysage en quatre modes distincts :

| Niveau | Mode | Rôle de l'IA | Votre rôle |
|-------|------|--------------|-------------|
| **1** | **Assistance** | Prédit votre prochain mouvement | Taper moins, garder le contrôle |
| **2** | **Direction** | Exécute vos commandes | Spécifier précisément, vérifier soigneusement |
| **3** | **Collaboration** | Explore et implémente | Fixer le cap, intervenir, itérer |
| **4** | **Intégration** | Devient le produit | Architecturer des systèmes hybrides |

Chaque niveau déplace le goulot d'étranglement. Chaque niveau requiert de nouveaux réflexes. Se tromper de niveau pour une tâche donnée, c'est risquer de perdre du temps à micro-manager ce qui pourrait être autonome—ou de faire une confiance aveugle à ce qui exige votre expertise.

Voici la carte que j'aurais aimé avoir il y a deux ans.

---

## Niveau 1 : Assistance Prédictive

![](assets/friction-dissolve.jpg)

C'est le point d'entrée pour tout le monde : Copilot dans l'éditeur, ChatGPT dans un onglet du navigateur. L'IA observe votre contexte et suggère l'étape logique suivante.

Je me souviens de la première fois où Copilot a généré une fonction de validation complète à partir d'un simple commentaire. J'ai tapé `// vérifier si l'email est valide`, et vingt lignes de regex se sont matérialisées instantanément. C'était presque de la télépathie.

**Ce qui change :** La friction entre la pensée et le code se dissout. Vous prenez toujours toutes les décisions et possédez l'architecture, mais l'IA gère la traduction mécanique de l'intention vers la syntaxe.

**Ce qui reste inchangé :** Le flux de travail. Vous êtes toujours au volant.

### Le piège du "Tab-Tab-Tab"

La vitesse est séduisante. Lorsque les suggestions apparaissent plus vite que vous ne pouvez penser, vous commencez à les accepter par réflexe. *Tab. Tab. Tab.* Le code *semble* correct. Les tests passent. Vous livrez.

Trois semaines plus tard, vous contemplez une fonction que vous ne reconnaissez pas. Elle vit dans votre base de code, sous votre historique de commit, et pourtant vous n'avez aucun souvenir de sa logique—parce que vous ne l'avez pas écrite. Vous l'avez approuvée en pilote automatique.

J'appelle cela le **Paradoxe de l'Approbation** : à mesure que la vitesse de génération de l'IA augmente, votre compréhension du code diminue, rendant ce code progressivement plus dangereux.

L'antidote est une friction délibérée : traitez les suggestions de l'IA comme une revue de code (code review). Si vous ne fusionneriez pas la PR d'un collègue sans la lire, n'acceptez pas non plus une suggestion d'IA sans la lire.

### Quand utiliser le Niveau 1
*   **Le Boilerplate :** Du code que vous avez écrit cent fois.
*   **Le Rappel Syntaxique :** Quand vous savez *quoi* écrire mais avez oublié *comment*.
*   **Les Modèles Évidents :** Des implémentations où le chemin est unique et clair.

### Quand l'éviter
*   **La Logique Nouvelle :** Du code qui nécessite une compréhension profonde.
*   **Les Cas Limites (Edge Cases) :** Des scénarios probablement absents des données d'entraînement.
*   **Les Chemins Critiques :** Tout ce que vous devrez déboguer sous pression plus tard.

**Le changement d'état d'esprit :** La vitesse n'est pas le but ; la *bande passante mentale* l'est. Utilisez le Niveau 1 pour libérer votre attention pour les décisions qui comptent, pas pour abdiquer toute prise de décision.

---

## Niveau 2 : Exécution Dirigée

![](assets/blueprint-hand.jpg)

Si le Niveau 1 prédit ce que vous allez taper, le Niveau 2 exécute ce que vous commandez.

Sélectionnez un bloc de code. Tapez `Cmd+K`. Écrivez : *"Refactorise ceci pour utiliser async/await."* La transformation se produit en quelques secondes. Chaque chaîne `.then()` se convertit en `await`. La gestion des erreurs s'ajuste. La structure change, mais le comportement reste invariant.

C'est l'**Exécution Dirigée** : vous spécifiez la transformation, l'IA l'exécute, et vous vérifiez le résultat.

**Ce qui change :** L'IA dépasse l'autocomplétion pour entrer dans le *raisonnement*. Elle analyse votre intention et détermine les détails de l'implémentation.

**La nouvelle compétence :** La précision de la spécification. Des commandes vagues comme "améliore ceci" produisent des résultats médiocres. Des instructions précises comme "extrais la logique de validation dans une fonction séparée qui retourne un objet erreur ou null" produisent du code prêt pour la production.

### Trois techniques pour la précision

**1. Les tests comme contrats**
Écrivez d'abord le test, puis instruisez l'IA : "Fais passer ce test."

```typescript
test('retries failed requests up to 3 times', async () => {
    const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce({ ok: true });
    
    await fetchWithRetry('/api/data', { fetch: mockFetch });
    expect(mockFetch).toHaveBeenCalledTimes(3);
});
```
Le test est sans ambiguïté. L'IA ne peut pas mal interpréter le succès.

**2. Les exemples comme modèles**
Démontrez une transformation, puis demandez le reste.
```typescript
// Transforme la gestion d'erreur pour suivre ce modèle :
if (!user) {
    throw new NotFoundError('User not found', { userId });
}
// Applique ce modèle au reste du fichier
```

**3. Les contraintes comme garde-fous**
Ce que vous *excluez* est souvent plus important que ce que vous incluez.
*   "Pas de dépendances externes."
*   "Garde l'interface publique inchangée."
*   "Garde ça sous les 50 lignes."

### L'habitude de vérification
L'exécution dirigée reste une exécution. L'IA est rapide, pas prudente. Les pièges courants incluent :
*   **Les API hallucinées :** Appel de méthodes qui n'existent pas.
*   **Les dérives subtiles de comportement :** Un refactoring qui n'est pas purement structurel.
*   **Les cas limites manqués :** Le chemin heureux fonctionne, mais les entrées nulles font planter le système.

Ma règle est simple : **si je ne peux pas expliquer ce qui a changé et pourquoi, je ne l'accepte pas.**

**Le changement d'état d'esprit :** Le goulot d'étranglement se déplace de "à quelle vitesse je tape" vers "avec quelle précision je peux exprimer mon intention". La clarté de la pensée devient le facteur limitant.

---

## Niveau 3 : Construction Collaborative

![](assets/clockwork-night.jpg)

Le Niveau 2 fonctionne pour des frappes chirurgicales—fonctions uniques, transformations claires. Mais certaines tâches sont structurelles.

*"Ajoute l'export CSV au tableau de bord analytique. Suis nos modèles d'export PDF existants."*

Ce n'est pas une commande unique. C'est une fonctionnalité multi-fichiers nécessitant exploration, décisions architecturales et itération. L'agent doit comprendre votre base de code, faire des choix et s'ajuster quand vous le redirigez.

**Ce qui change :** Vous cessez de commander des transformations spécifiques pour commencer à fixer des objectifs. Vous regardez l'IA naviguer vers eux.

### La boucle collaborative

1.  **Fixer le cap :** "Ajoute l'authentification utilisateur avec next-auth. Suis nos modèles existants."
2.  **Observer :** L'agent explore votre base de code, ébauche un plan et commence l'implémentation.
3.  **Intervenir :** "Mauvaise librairie—nous utilisons `jose` pour les JWT, pas `jsonwebtoken`."
4.  **Continuer :** L'agent ajuste sa course et reprend la construction.
5.  **Raffiner :** "Bien. Maintenant extrais cette config dans des variables d'environnement."
6.  **Répéter :** Itérer jusqu'à ce que la fonctionnalité soit complète.

Vous ne revoyez pas ligne par ligne ; vous revoyez la *trajectoire*. La solution se dirige-t-elle là où elle le doit ?

### Apprendre la nature de votre agent
Plus vous collaborez, plus vous comprenez le profil de votre partenaire IA.

**Forces :**
*   Imiter les modèles existants de la base de code.
*   Changements multi-fichiers fastidieux mais bien compris.
*   Fonctionnalités lourdes en boilerplate (CRUD, formulaires, suites de tests).
*   Refactoring à grande échelle.

**Faiblesses :**
*   Architecture véritablement nouvelle.
*   Exigences ambiguës (elle devine avec confiance, souvent à tort).
*   Conventions implicites (le "savoir tribal" de votre équipe).
*   Implications de sécurité et de performance invisibles pour le modèle.

**Adaptation stratégique :**
*   **Morcelez la nouveauté :** Ne demandez pas "un cache personnalisé". Demandez "un wrapper Map", puis "ajoute un TTL", puis "ajoute l'éviction LRU".
*   **Rendez l'implicite explicite :** "Nous utilisons toujours des retours anticipés (early returns)." "Les erreurs doivent utiliser notre classe `AppError`."
*   **Interrompez tôt :** Si l'agent dévie, arrêtez-le immédiatement. Ne le laissez pas construire sur des fondations bancales.

### La confiance au niveau architectural
La collaboration requiert une autre forme de confiance. Vous ne vérifiez pas chaque ligne d'un diff de 500 lignes. Vous vérifiez :
*   Est-ce la bonne *approche* ?
*   Cela suit-il nos *modèles* ?
*   Qu'est-ce qui a été *manqué* ?

Cela demande du jugement. Vous devez avoir la capacité de scanner un large diff et d'en saisir la forme, pas juste la syntaxe.

**Le changement d'état d'esprit :** Votre rôle évolue de "l'implémenteur qui tape vite" à "l'architecte qui guide vite". La pensée reste vôtre ; la frappe devient partagée.

---

## Niveau 4 : Systèmes Hybrides

![](assets/woven-intelligence.jpg)

Les niveaux 1 à 3 traitent l'IA comme un outil pour *construire* des logiciels. Le Niveau 4 est différent : l'IA devient un composant *du* logiciel lui-même.

C'est là que les intuitions d'ingénierie traditionnelles se brisent.

### Le moment du déclic
Je construisais une API d'agrégation de nouvelles. L'exigence semblait simple : dédupliquer les articles entrants pour que les utilisateurs ne voient pas deux fois la même histoire.

Mon approche initiale était déterministe : comparer les titres, vérifier le chevauchement des mots-clés, calculer des scores de similarité.

Puis j'ai heurté la réalité : *"La Fed augmente les taux"* est-elle la même histoire que *"La Réserve Fédérale relève les taux d'intérêt face à l'inflation"* ? Et *"Powell annonce un virage monétaire restrictif"* ?

Aucune correspondance de chaînes de caractères ne résout cela. Les titres ne partagent aucun mot mais partagent le même sens. J'avais besoin que le système *comprenne* l'équivalence sémantique.

Ce fut le tournant. L'IA ne m'aidait plus à construire la fonctionnalité. **L'IA était la fonctionnalité.**

### Le modèle Hybride
L'erreur des développeurs est de traiter l'IA comme magique ou dangereuse. Elle n'est ni l'un ni l'autre.
*   **Le Code Pur** est prévisible mais rigide. Il capture les correspondances exactes mais manque la nuance.
*   **L'IA Pure** est flexible mais peu fiable. Elle hallucine, varie ses sorties et ignore les modèles de données.

La solution est l'**Architecture Hybride** : du code pour les contraintes, de l'IA pour le raisonnement.

**Le Code gère :**
*   La récupération et la validation des données.
*   L'application des schémas.
*   Les règles métier (permissions, limites de taux).
*   La gestion d'état et les pistes d'audit.

**L'IA gère :**
*   La compréhension sémantique.
*   La classification floue.
*   La génération de contenu.
*   La reconnaissance de motifs dans les données non structurées.

### Le Pattern Sandwich
Chaque appel IA dans mon système suit la même structure :

**Couche 1 : Code (Préparation)**
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
```
Le code décide quelles données l'IA voit et comment elles sont formatées. L'IA ne touche jamais directement à la base de données.

**Couche 2 : IA (Raisonnement)**
L'agent reçoit des données formatées et une instruction claire : *détermine si ces histoires décrivent le même événement sous-jacent.* C'est la tâche que je ne peux pas coder en dur.

**Couche 3 : Code (Validation)**
```typescript
static readonly SCHEMA = z.object({
    duplicateOfReportId: z.string().nullable(),
    reason: z.string(),
});
```
L'IA ne peut pas répondre "peut-être" ou inventer de nouveaux champs. Elle doit fournir un ID de rapport valide ou null. Si la validation échoue, le système se replie gracieusement.

**Code → IA → Code.** Ce sandwich assure que la flexibilité de l'IA opère strictement à l'intérieur des contraintes de votre système.

### Tester des systèmes probabilistes
Les systèmes d'IA sont non-déterministes. Même entrée, sortie différente. Cela brise les stratégies de test traditionnelles. Mon approche comporte trois couches :

1.  **Tests Unitaires pour le Code :** Les couches de préparation et de validation sont déterministes. Testez-les normalement.
2.  **Evals pour l'IA :** Maintenez un jeu de données de cas de test avec des réponses correctes connues. Mesurez la précision. Si elle tombe sous un seuil, le déploiement échoue.
3.  **Tests de Garde-fous :** Que se passe-t-il quand l'IA se comporte mal ?

```typescript
test('falls back to unique when deduplication fails', async () => {
    mockModel.mockReturnValue({ invalid: 'response' });
    
    const result = await pipeline.process(newReport);
    
    expect(result.isDuplicate).toBe(false);
    expect(logger.warn).toHaveBeenCalled();
});
```
Le système doit être robuste face aux échecs de l'IA, pas seulement à ses succès.

**Le changement d'état d'esprit :** Vous n'écrivez plus de logique déterministe. Vous **orchestrez de l'intelligence**—en concevant des systèmes qui exploitent les forces de l'IA tout en compensant ses faiblesses.

---

## Choisir le bon niveau

La compétence n'est pas de maîtriser un seul niveau—c'est de reconnaître quel niveau convient à la tâche.

| Tâche | Niveau | Pourquoi |
|-------|--------|----------|
| Écrire une fonction familière | **1 - Assistance** | Laisser l'autocomplétion gérer la routine. |
| Refactoriser une fonction unique | **2 - Direction** | Précision chirurgicale ; vérifier le diff. |
| Ajouter une fonctionnalité multi-fichiers | **3 - Collaboration** | Fixer le cap, itérer ensemble. |
| Construire une recherche sémantique | **4 - Intégration** | L'IA est la capacité, pas l'assistant. |

La majeure partie de ma journée se passe au Niveau 2—des modifications précises et dirigées. Mais les gains de productivité massifs viennent du Niveau 3, compressant des jours d'implémentation en heures d'itération guidée. Et le Niveau 4 est là où émergent des capacités entièrement nouvelles.

Le fantasme de "Jarvis" n'était pas faux—il était juste incomplet. La vraie maîtrise n'est pas d'avoir un assistant omniscient qui fait tout pour vous. C'est de savoir quand laisser l'IA autocompléter, quand la commander précisément, quand collaborer comme des partenaires, et quand en faire une partie intégrante du produit lui-même.

Voici la carte. Maintenant, le vrai travail commence : développer les instincts pour y naviguer.
