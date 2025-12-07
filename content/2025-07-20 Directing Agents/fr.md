![](./assets/thumbnail.jpg)

# Diriger les agents IA

Chaque modification a deux parties : savoir quoi changer, et taper le changement. La première prend des secondes. La seconde prend des minutes. Et si vous pouviez sauter entièrement la seconde partie ?

Sélectionnez une fonction. Cmd+K. "Ajoute la gestion d'erreurs pour les timeouts réseau." Dix secondes plus tard, des blocs try-catch enveloppent les appels fetch, avec une logique de retry appropriée et des messages d'erreur. Le changement que vous avez conçu en cinq secondes existe maintenant en cinq secondes.

C'est ça diriger — des frappes chirurgicales où vous pointez quelque chose de spécifique, décrivez exactement ce que vous voulez, et l'agent exécute. Pas d'ambiguïté. Pas d'exploration. Juste une transformation précise.

Mais il y a un piège. La vitesse sans vérification, c'est de la dette technique déguisée. J'ai livré des bugs en acceptant du code que je n'avais pas lu. L'art n'est pas seulement dans la direction — c'est de savoir comment vérifier, quand faire confiance, et comment exprimer l'intention assez précisément pour que le résultat corresponde à votre vision.

***

## Ce qui est vraiment compressé

![](assets/split-thread.jpg)

Chaque modification a deux parties : savoir quoi changer, et taper le changement.

"Ajoute des vérifications null à cette fonction." Je sais exactement où et comment. Mais le taper — trouver chaque référence, ajouter les conditions, s'assurer que la syntaxe est correcte — prend des minutes. La réflexion a pris des secondes.

"Refactore ce callback en async/await." Je peux voir la forme du résultat dans ma tête. Mais transformer mécaniquement chaque chaîne `.then()`, gérer les cas d'erreur, mettre à jour les appelants — c'est de la transcription fastidieuse.

**Diriger compresse la transcription, pas la réflexion.**

La réflexion reste la vôtre. Vous décidez *ce qui* doit changer et *pourquoi*. Vous comprenez le contexte, les contraintes, les patterns. L'agent gère l'exécution mécanique — la partie qui est fastidieuse mais pas cognitivement exigeante.

Les premières fois que j'ai essayé, j'ai échoué. Mes prompts étaient vagues parce que ma réflexion était vague. "Rends ça meilleur" produisait des déchets. "Ajoute une logique de retry avec backoff exponentiel, max 3 tentatives, délai de base 1s" produisait exactement ce que je voulais.

Précision en entrée, précision en sortie. Vous ne pouvez pas diriger ce que vous n'avez pas pensé.

***

## La précision par la spécification

![](assets/architect-table.jpg)

Plus votre spécification est précise, meilleur est le résultat. J'ai trouvé plusieurs façons d'être précis :

**Les tests comme contrats.** Pour les changements de comportement, écrivez d'abord le test :

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

Puis : "Fais passer ce test." Le test est la spécification. Aucune ambiguïté sur ce à quoi ressemble le succès.

**Les exemples comme patterns.** Pour les changements de style, montrez un exemple :

```typescript
// Avant : "Convertis la gestion d'erreurs pour correspondre à ce pattern"
if (!user) {
    throw new NotFoundError('User not found', { userId });
}

// Puis l'agent l'applique au reste du fichier
```

**Les contraintes comme garde-fous.** Parfois ce que vous *ne voulez pas* compte le plus :
- "N'ajoute aucune dépendance externe"
- "Garde l'API publique inchangée"
- "Pas plus de 50 lignes"

Chaque technique donne moins de marge à l'agent pour deviner. Moins de devinettes signifie de meilleurs résultats.

***

## Révisez chaque diff

Même les changements chirurgicaux nécessitent une vérification. L'agent est rapide, pas infaillible.

Problèmes courants que je repère :
- **Méthodes hallucinées.** Il utilise une fonction de librairie qui n'existe pas, ou utilise la mauvaise signature.
- **Erreurs de logique subtiles.** Le refactoring a changé le comportement, pas juste la forme.
- **Violations de patterns.** Il a résolu le problème différemment du reste du codebase.
- **Cas limites manquants.** Le chemin nominal fonctionne ; le cas null plante.

Ce ne sont pas des cas rares. Ça arrive régulièrement, surtout avec des librairies moins courantes ou des patterns spécifiques au projet.

L'agent est confiant mais pas prudent. Il produira quelque chose qui a l'air correct mais ne l'est pas. Votre travail est de repérer la différence.

***

## Le piège de la vitesse

Le danger de diriger, c'est que c'est *rapide*. Un diff apparaît en quelques secondes. Votre cerveau voit des patterns familiers et fait correspondre à "ça a l'air bien."

Je me suis surpris à accepter des changements sans vraiment les lire. La structure semblait correcte. Les tests passaient. On livre.

Ma règle : **si je ne peux pas expliquer ce qui a changé et pourquoi, je n'accepte pas.**

C'est plus facile avec les changements dirigés qu'avec les grosses fonctionnalités — le scope est petit, le diff est contenu. Mais "plus facile" ne veut pas dire "automatique." Vous devez quand même le lire. La vitesse sans vérification n'est pas de la productivité ; c'est de la dette technique déguisée.

***

## Les compétences de direction

Ce en quoi je me suis amélioré :

**1. Le cadrage.** Savoir ce qui est "dirigeable" versus ce qui nécessite une approche plus large. Refactorer une fonction ? Dirigeable. Ajouter une nouvelle fonctionnalité avec plusieurs composants ? Ça nécessite une itération collaborative.

**2. Le langage de précision.** Dire exactement ce que je veux dire. "Ajoute de la validation" est vague. "Ajoute une validation de schéma zod pour les champs email et password, retourne 400 avec des erreurs spécifiques par champ" est précis.

**3. La reconnaissance de patterns.** Scanner un diff de 20 lignes et repérer rapidement ce qui ne va pas — la méthode hallucinée, le cas limite raté, la violation de style.

**4. La vitesse d'itération.** Quand la première tentative n'est pas bonne, savoir comment ajuster le prompt plutôt que de réécrire manuellement. "C'est proche, mais utilise notre classe AppError au lieu d'une Error brute."

Diriger est une compétence. Plus vous y devenez bon, plus votre journée se compresse en modifications précises, rapides et vérifiées.

***

## Quand diriger ne suffit pas

Diriger fonctionne pour les changements contenus. Mais certaines tâches sont plus grandes.

"Ajoute l'export CSV au tableau de bord analytics, en suivant nos patterns d'export PDF." Ce n'est pas une frappe chirurgicale — c'est une fonctionnalité multi-fichiers qui nécessite de l'exploration, de la prise de décision et de l'itération.

C'est un mode entièrement différent : travailler *avec* l'agent sur des problèmes plus grands. Vous fixez la direction, l'agent explore et implémente, vous corrigez le cap ensemble. Collaboratif plutôt que commandé.

***

*À suivre : Architecturer avec l'IA — comment travailler avec des agents sur des problèmes plus grands, en itérant ensemble vers des solutions.*