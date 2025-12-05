![](assets/thumbnail.jpg)

# Diriger les agents IA

Diriger, c'est avant tout une question de précision.

Sélectionnez une fonction. Cmd+K. "Ajoute une gestion d'erreur pour les timeouts réseau." Dix secondes plus tard, des blocs try-catch enveloppent les appels fetch, avec une logique de réessai et des messages d'erreur appropriés.

Sélectionnez un composant. "Convertis ça en TypeScript avec des types stricts." Le JavaScript devient typé, les interfaces apparaissent, le compilateur est content.

Sélectionnez un test. "Ajoute des cas pour les conditions limites — tableau vide, entrée null, longueur maximale." Trois nouveaux cas de test se matérialisent, chacun couvrant une frontière.

Des frappes chirurgicales. Vous pointez quelque chose de spécifique, décrivez exactement ce que vous voulez, et l'agent exécute. Pas d'ambiguïté. Pas d'exploration. Juste une transformation précise.

La puissance ici réside dans **la suppression de la friction pour les changements contenus**. Le genre de modifications qui prennent cinq minutes à taper mais seulement cinq secondes à concevoir.

***

## Ce qui est réellement compressé

![](assets/split-thread.jpg)

Chaque modification comporte deux parties : savoir ce qu'il faut changer, et taper le changement.

"Ajoute des vérifications de null à cette fonction." Je sais exactement où et comment. Mais le taper — trouver chaque référence, ajouter les conditions, m'assurer que la syntaxe est bonne — prend des minutes. La réflexion a pris des secondes.

"Refactorise ce callback en async/await." Je peux voir la forme du résultat dans ma tête. Mais transformer mécaniquement chaque chaîne `.then()`, gérer les cas d'erreur, mettre à jour les appelants — c'est de la transcription fastidieuse.

**Diriger compresse la transcription, pas la réflexion.**

La réflexion est toujours la vôtre. Vous décidez *ce qui* doit changer et *pourquoi*. Vous comprenez le contexte, les contraintes, les patterns. L'agent gère l'exécution mécanique — la partie qui est fastidieuse mais pas cognitivement exigeante.

Les premières fois que j'ai essayé, j'ai échoué. Mes prompts étaient vagues parce que ma pensée était vague. "Améliore ça" produisait des déchets. "Ajoute une logique de réessai avec backoff exponentiel, max 3 tentatives, délai de base 1s" produisait exactement ce que je voulais.

Précision en entrée, précision en sortie. Vous ne pouvez pas diriger ce que vous n'avez pas pensé.

***

## La précision par la spécification

![](assets/architect-table.jpg)

Plus votre spécification est précise, meilleure est la sortie. J'ai trouvé plusieurs moyens d'être précis :

**Les tests comme contrats.** Pour les changements de comportement, écrivez le test d'abord :

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

Puis : "Fais passer ce test." Le test est la spécification. Pas d'ambiguïté sur ce à quoi ressemble le succès.

**Les exemples comme modèles.** Pour les changements de style, montrez un exemple :

```typescript
// Avant : "Convertis la gestion d'erreur pour correspondre à ce pattern"
if (!user) {
    throw new NotFoundError('User not found', { userId });
}

// Ensuite l'agent l'applique au reste du fichier
```

**Les contraintes comme garde-fous.** Parfois, ce que vous ne voulez *pas* compte le plus :
- "N'ajoute aucune dépendance externe"
- "Garde l'API publique inchangée"
- "Pas plus de 50 lignes"

Chaque technique laisse moins de place à l'agent pour deviner. Moins de devinettes signifie de meilleurs résultats.

***

## Revoir chaque diff

Même les changements chirurgicaux nécessitent une vérification. L'agent est rapide, pas infaillible.

Problèmes courants que j'attrape :
- **Méthodes hallucinées.** Il utilise une fonction de bibliothèque qui n'existe pas, ou utilise la mauvaise signature.
- **Erreurs de logique subtiles.** Le refactoring a changé le comportement, pas seulement la forme.
- **Violations de pattern.** Il a résolu le problème différemment du reste de la codebase.
- **Cas limites manquants.** Le chemin heureux fonctionne ; le cas null plante.

Ce n'est pas rare. Cela arrive régulièrement, surtout avec des bibliothèques moins courantes ou des patterns spécifiques au projet.

L'agent est confiant mais pas prudent. Il produira quelque chose qui a l'air correct mais qui ne l'est pas. Votre travail est de repérer la différence.

***

## Le piège de la vitesse

Le danger de diriger est que c'est *rapide*. Un diff apparaît en quelques secondes. Votre cerveau voit des motifs familiers et fait correspondre le modèle à "ça a l'air bon."

Je me suis surpris à accepter des changements sans vraiment les lire. La structure semblait bonne. Les tests passaient. On expédie.

Ma règle : **si je ne peux pas expliquer ce qui a changé et pourquoi, je ne l'accepte pas.**

C'est plus facile avec des changements dirigés qu'avec de grosses fonctionnalités — la portée est petite, le diff est contenu. Mais "plus facile" ne veut pas dire "automatique". Vous devez toujours le lire. La vitesse sans vérification n'est pas de la productivité ; c'est de la dette technique déguisée.

***

## La compétence de direction

Ce sur quoi je me suis amélioré :

**1. Le scoping.** Savoir ce qui est "dirigé" vs ce qui nécessite une approche plus large. Refactoriser une fonction ? Dirigé. Ajouter une nouvelle fonctionnalité avec plusieurs composants ? Cela nécessite une itération collaborative.

**2. Langage de précision.** Dire exactement ce que je veux dire. "Ajoute une validation" est vague. "Ajoute une validation de schéma zod pour les champs email et mot de passe, renvoie 400 avec des erreurs spécifiques au champ" est précis.

**3. Reconnaissance de patterns.** Scanner un diff de 20 lignes et repérer rapidement ce qui ne va pas — la méthode hallucinée, le cas limite manqué, la violation de style.

**4. Vitesse d'itération.** Quand la première tentative n'est pas bonne, savoir comment ajuster le prompt plutôt que de réécrire manuellement. "C'est proche, mais utilise notre classe AppError au lieu d'une Error brute."

Diriger est une compétence. Plus vous devenez bon, plus votre journée se compresse en modifications précises, rapides et vérifiées.

***

## Quand diriger ne suffit pas

Diriger fonctionne pour des changements contenus. Mais certaines tâches sont plus grandes.

"Ajoute l'export CSV au tableau de bord analytique, en suivant nos patterns d'export PDF." Ce n'est pas une frappe chirurgicale — c'est une fonctionnalité multi-fichiers qui nécessite exploration, prise de décision et itération.

C'est un mode entièrement différent : travailler *avec* l'agent sur des problèmes plus vastes. Vous définissez la direction, l'agent explore et implémente, vous corrigez le tir ensemble. Collaboratif plutôt que commandé.

***

*À suivre : Architecturer avec l'IA — comment travailler avec des agents sur des problèmes plus vastes, en itérant ensemble vers des solutions.*

