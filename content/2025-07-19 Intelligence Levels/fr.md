![](assets/thumbnail.jpg)

# Les quatre niveaux de maîtrise de l'IA

Il y a deux ans, j'ai écrit ma première ligne de code sous le regard d'une IA. Copilot m'a suggéré le corps entier d'une fonction avant même que j'aie fini d'en taper la signature. J'ai accepté sans lire. Les tests sont passés. Je me sentais invincible.

Une semaine plus tard, j'ai passé quatre heures à déboguer ce même code. Je n'avais aucune idée de son fonctionnement car je ne l'avais pas *écrit*—je l'avais simplement approuvé.

Cet échec m'a enseigné une leçon cruciale : **l'assistance par IA n'est pas binaire.** Il n'y a pas une seule "bonne façon" de l'utiliser. Il existe plutôt des niveaux d'engagement distincts, chacun exigeant des compétences, un niveau de confiance et une vigilance différents.

La plupart des développeurs traitent l'IA comme un bloc monolithique—soit ils l'adoptent aveuglément, soit ils la rejettent en bloc. Cette vision manque de nuance. La question n'est pas de savoir *si* vous devez utiliser l'IA, mais *à quelle profondeur* l'intégrer dans votre flux de travail.

Après deux ans à construire des logiciels avec l'IA, j'ai cartographié ce paysage en quatre modes distincts :

1.  **Assistance :** Elle prédit votre prochain mouvement. Vous tapez moins mais gardez le contrôle.
2.  **Direction :** Elle exécute vos commandes. Vous spécifiez précisément et vérifiez soigneusement.
3.  **Collaboration :** Elle explore et implémente. Vous donnez le cap, intervenez et itérez.
4.  **Intégration :** Elle devient le produit. Vous architecturez des systèmes hybrides.

Chaque niveau déplace le goulot d'étranglement. Jugez mal le niveau requis pour une tâche, et vous risquez de perdre du temps à micro-manager ce qui pourrait être autonome—ou de faire aveuglément confiance à ce qui exige votre expertise.

---

## Niveau 1 : l'assistance prédictive

![](assets/friction-dissolve.jpg)

C'est le point d'entrée : Copilot dans l'éditeur, ChatGPT dans un onglet. L'IA observe votre contexte et suggère l'étape logique suivante.

Je me souviens de la première fois où Copilot a généré une fonction de validation complète à partir d'un simple commentaire. Cela ressemblait à de la télépathie. La friction entre la pensée et le code s'est dissoute. Vous prenez toujours chaque décision et possédez l'architecture, mais l'IA gère la traduction mécanique de l'intention vers la syntaxe.

### Le paradoxe de l'approbation

La vitesse est séduisante. Lorsque les suggestions apparaissent plus vite que vous ne pouvez penser, vous commencez à les accepter par réflexe. *Tab. Tab. Tab.* Le code *semble* correct.

Mais trois semaines plus tard, vous vous retrouvez face à une fonction que vous ne reconnaissez pas. J'appelle cela le **Paradoxe de l'Approbation** : à mesure que la vitesse de génération de l'IA augmente, votre compréhension du code diminue, rendant ce code progressivement plus dangereux.

L'antidote est la friction délibérée : traitez les suggestions de l'IA comme une revue de code. Si vous ne fusionneriez pas la PR d'un collègue sans la lire, n'acceptez pas non plus une suggestion d'IA sans la lire.

**Le changement de mentalité :** La vitesse n'est pas l'objectif ; la *bande passante mentale* l'est. Utilisez le Niveau 1 pour libérer votre attention pour les décisions qui comptent, pas pour abdiquer totalement la prise de décision.

---

## Niveau 2 : l'exécution dirigée

![](assets/blueprint-hand.jpg)

Si le Niveau 1 prédit ce que vous allez taper, le Niveau 2 exécute ce que vous commandez.

Sélectionnez un bloc de code. Tapez `Cmd+K`. Écrivez : *"Refactorise ceci pour utiliser async/await."* La transformation se produit en quelques secondes. La structure change, mais le comportement reste invariant.

C'est l'**Exécution Dirigée** : vous spécifiez la transformation, l'IA l'exécute, et vous vérifiez le résultat. L'IA dépasse l'autocomplétion pour entrer dans le *raisonnement*.

**La nouvelle compétence :** La précision de la spécification. Des commandes vagues produisent des déchets. Des instructions précises produisent du code prêt pour la production.

### Trois techniques pour la précision

1.  **Les tests comme contrats :** Écrivez le test d'abord, puis instruisez l'IA : "Fais passer ce test."

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

2.  **L'exemple comme modèle :** Démontrez une transformation manuellement, puis demandez le reste. "Transforme la gestion d'erreur pour correspondre à ce modèle..."
3.  **Les contraintes comme garde-fous :** Ce que vous *excluez* est souvent plus important. "Pas de dépendances externes," ou "Garde l'interface publique inchangée."

L'exécution dirigée reste de l'exécution. L'IA est rapide, pas prudente. Elle hallucinera des API ou manquera des cas limites. Ma règle est simple : **si je ne peux pas expliquer ce qui a changé et pourquoi, je ne l'accepte pas.**

**Le changement de mentalité :** Le goulot d'étranglement passe de "à quelle vitesse puis-je taper" à "avec quelle précision puis-je exprimer mon intention." La clarté de la pensée devient le facteur limitant.

---

## Niveau 3 : la construction collaborative

![](assets/clockwork-night.jpg)

Le Niveau 2 fonctionne pour des frappes chirurgicales. Mais certaines tâches sont structurelles.

*"Ajoute l'export CSV au tableau de bord analytique. Suis nos modèles d'export PDF existants."*

Ce n'est pas une commande unique. C'est une fonctionnalité multi-fichiers nécessitant exploration, décisions architecturales et itération. L'agent doit comprendre votre base de code, faire des choix et s'ajuster lorsque vous le redirigez.

### La boucle collaborative

1.  **Donner le cap :** "Ajoute l'authentification utilisateur avec next-auth..."
2.  **Observer :** Regardez l'agent explorer et planifier.
3.  **Intervenir :** "Mauvaise librairie—nous utilisons `jose`, pas `jsonwebtoken`."
4.  **Raffiner :** "Bien. Maintenant extrais la config dans des variables d'environnement."

Vous ne revoyez pas ligne par ligne ; vous revoyez la *trajectoire*. La solution se dirige-t-elle là où elle doit aller ?

### La confiance au niveau architectural

La collaboration exige une race de confiance différente. Vous ne vérifiez pas chaque ligne d'un diff de 500 lignes. Vous vérifiez : Est-ce la bonne *approche* ? Cela suit-il nos *modèles* ? Qu'est-ce qu'elle a *manqué* ?

Cela requiert du jugement. Vous avez besoin de la capacité de scanner un large diff et d'en saisir la forme, pas juste la syntaxe.

**Le changement de mentalité :** Votre rôle évolue de "l'implémenteur qui tape vite" à "l'architecte qui guide vite." La pensée reste la vôtre ; la frappe devient partagée.

---

## Niveau 4 : les systèmes hybrides

![](assets/woven-intelligence.jpg)

Les niveaux 1 à 3 traitent l'IA comme un outil pour *construire* du logiciel. Le Niveau 4 est différent : l'IA devient un composant *du* logiciel lui-même.

J'ai réalisé cela en construisant un agrégateur de nouvelles. Je devais dédoublonner les articles. La correspondance de chaînes échouait car des titres comme "La Fed monte les taux" et "Powell annonce un changement de politique" ne partagent aucun mot mais signifient la même chose.

J'avais besoin que le système *comprenne* l'équivalence sémantique. L'IA ne m'aidait plus à construire la fonctionnalité. **L'IA était la fonctionnalité.**

### Le pattern sandwich

L'erreur que font les développeurs est de traiter l'IA comme magique ou dangereuse. La solution est l'**Architecture Hybride** : du code pour les contraintes, de l'IA pour le raisonnement.

Chaque appel IA dans mon système suit le **Pattern Sandwich** :

1.  **Couche 1 : Code (Préparation)**
    Le code décide quelles données l'IA voit et comment elles sont formatées. L'IA ne touche jamais directement à la base de données.

2.  **Couche 2 : IA (Raisonnement)**
    L'agent reçoit des données formatées et une instruction claire : *détermine si ces articles décrivent le même événement sous-jacent.* C'est la tâche que je ne peux pas coder en dur.

3.  **Couche 3 : Code (Validation)**
    La sortie de l'IA est contrainte par un schéma strict (ex: Zod). Elle doit fournir un ID valide ou null. Si la validation échoue, le système se replie gracieusement.

**Code → IA → Code.** Cela garantit que la flexibilité de l'IA opère strictement à l'intérieur des contraintes de votre système.

### Tester les systèmes probabilistes

Les systèmes IA sont non-déterministes. Même entrée, sortie différente. Cela brise les stratégies de test traditionnelles. Mon approche a trois couches :

1.  **Tests Unitaires pour le Code :** Les couches de préparation et de validation sont déterministes. Testez-les normalement.
2.  **Évaluations (Evals) pour l'IA :** Maintenez un jeu de données de cas de test avec des réponses correctes connues. Mesurez la précision (ex: "94% de précision"). Si elle tombe sous un seuil, le déploiement échoue.
3.  **Tests de Garde-fous :** Testez ce qui se passe quand l'IA se comporte mal.
    ```typescript
    test('falls back to unique when deduplication fails', async () => {
        mockModel.mockReturnValue({ invalid: 'response' });
        const result = await pipeline.process(newReport);
        expect(result.fallbackUsed).toBe(true);
    });
    ```
    Le système doit être robuste aux échecs de l'IA, pas seulement à ses succès.

**Le changement de mentalité :** Vous n'écrivez plus de logique déterministe. Vous **orchestrez de l'intelligence**—en concevant des systèmes qui exploitent les forces de l'IA tout en compensant ses faiblesses.

---

## Choisir le bon niveau

La compétence n'est pas de maîtriser un niveau—c'est de reconnaître quel niveau correspond à la tâche.

*   **Écrire une fonction familière ?** Utilisez le **Niveau 1 (Assistance)**. Laissez l'autocomplétion gérer la routine.
*   **Refactoriser une fonction unique ?** Utilisez le **Niveau 2 (Direction)**. Précision chirurgicale ; vérifiez le diff.
*   **Ajouter une fonctionnalité multi-fichiers ?** Utilisez le **Niveau 3 (Collaboration)**. Donnez le cap, itérez ensemble.
*   **Construire une recherche sémantique ?** Utilisez le **Niveau 4 (Intégration)**. L'IA est la capacité, pas l'assistant.

Le fantasme de "Jarvis" n'était pas faux—il était juste incomplet. La vraie maîtrise n'est pas d'avoir un assistant omniscient qui fait tout pour vous. C'est de savoir quand laisser l'IA autocompléter, quand la commander avec précision, quand collaborer comme partenaires, et quand en faire une partie du produit lui-même.

