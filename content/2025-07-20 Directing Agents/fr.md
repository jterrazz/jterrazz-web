![](./assets/thumbnail.jpg)

# Diriger les agents IA

Chaque modification a deux temps : savoir quoi changer, puis taper le changement. Le premier prend quelques secondes. Le second, plusieurs minutes. Et si on pouvait sauter la frappe ?

Sélectionnez une fonction. Cmd+K. « Ajoute la gestion des timeouts réseau. » Quelques secondes plus tard, des blocs try-catch enveloppent les appels fetch, avec une logique de retry et des messages d'erreur. Ce que vous aviez en tête existe maintenant dans votre éditeur.

C'est ça, diriger — pointer du code, décrire ce qu'on veut, l'agent exécute. Zéro ambiguïté. Une transformation précise.

Mais attention au piège. J'ai livré des bugs en acceptant du code que je n'avais pas lu. L'art ne consiste pas seulement à diriger — il faut aussi vérifier, savoir quand faire confiance, et formuler son intention avec précision.

***

## Ce qui est vraiment compressé

![](assets/split-thread.jpg)

« Ajoute des checks null à cette fonction. » Je sais exactement où et comment. Mais le taper — repérer chaque référence, ajouter les conditions, vérifier la syntaxe — prend des minutes. La réflexion, elle, a pris quelques secondes.

« Refactorise ce callback en async/await. » Je vois le résultat dans ma tête. Mais transformer mécaniquement chaque `.then()`, gérer les erreurs, mettre à jour les appelants — c'est de la transcription fastidieuse.

**Diriger compresse la transcription, pas la réflexion.**

La réflexion reste la vôtre. Vous décidez *quoi* changer et *pourquoi*. L'agent se charge de taper — la partie rébarbative.

Mes premiers essais ont échoué. « Améliore ça » donnait n'importe quoi. « Ajoute une logique de retry avec backoff exponentiel, max 3 tentatives, délai initial 1 s » donnait exactement ce que je voulais. Précision en entrée, précision en sortie.

***

## La précision par la spécification

![](assets/architect-table.jpg)

Plus la spec est précise, meilleur est le résultat. Trois techniques :

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

Puis : « Fais passer ce test. » Le test *est* la spec. Aucune ambiguïté sur ce qu'est le succès.

**Les exemples comme modèles.** Pour les changements de style, montrez un exemple :

```typescript
// "Convertis la gestion d'erreur pour suivre ce pattern"
if (!user) {
    throw new NotFoundError('User not found', { userId });
}

// L'agent applique ensuite ce pattern au reste du fichier
```

**Les contraintes comme garde-fous.** Parfois, ce qu'on *ne veut pas* compte davantage :
- « Pas de dépendance externe »
- « Ne touche pas à l'API publique »
- « Maximum 50 lignes »

Chaque technique réduit la marge d'interprétation. Moins l'agent devine, meilleur est le résultat.

***

## Relire chaque diff

Même les modifications chirurgicales demandent vérification. L'agent est rapide, pas infaillible.

Ce que je repère souvent :
- **Méthodes hallucinées.** Il invoque une fonction de librairie qui n'existe pas, ou utilise la mauvaise signature.
- **Erreurs de logique subtiles.** Le refactoring a changé le comportement, pas seulement la forme.
- **Violations de conventions.** Il a résolu le problème d'une façon qui ne colle pas à la codebase.
- **Cas limites oubliés.** Le cas nominal marche ; le cas null plante.

L'agent est sûr de lui mais pas prudent. Il produit quelque chose qui *semble* correct sans l'être. À vous de faire la différence.

***

## Le piège de la vitesse

Le danger de diriger, c'est que c'est *rapide*. Un diff apparaît en quelques secondes. Votre cerveau voit des patterns familiers et conclut « ça a l'air bon ».

Je me suis surpris à accepter des changements sans les lire. La structure semblait correcte. Les tests passaient. On ship.

Ma règle : **si je ne peux pas expliquer ce qui a changé et pourquoi, je refuse.** La vitesse sans vérification, c'est de la dette technique déguisée.

***

## Les compétences du metteur en scène

Ce que j'ai appris à mieux faire :

**1. Cadrer.** Distinguer ce qui relève de la frappe chirurgicale de ce qui demande une collaboration. Refactoriser une fonction ? Direction. Ajouter une feature multi-fichiers ? Itération.

**2. Parler précis.** Dire exactement ce que je veux. « Ajoute de la validation » est vague. « Ajoute une validation zod sur les champs email et password, retourne 400 avec des erreurs par champ » est précis.

**3. Repérer les patterns.** Scanner un diff de 20 lignes et flasher sur ce qui cloche — la méthode fantôme, le cas limite oublié, la violation de style.

**4. Itérer vite.** Quand le premier jet n'est pas bon, ajuster le prompt plutôt que réécrire à la main. « C'est presque ça, mais utilise notre classe AppError au lieu d'une Error brute. »

Diriger est une compétence. Plus on s'améliore, plus la journée se compresse en modifications précises, rapides et vérifiées.

***

## Quand diriger ne suffit pas

Diriger fonctionne pour les changements contenus. Mais certaines tâches sont plus vastes.

« Ajoute l'export CSV au dashboard analytics, en suivant nos patterns d'export PDF. » Ce n'est pas une frappe chirurgicale — c'est une fonctionnalité multi-fichiers qui demande exploration, décisions et itérations. L'agent doit fouiller la codebase, faire des choix, s'ajuster quand vous intervenez.

C'est la collaboration — travailler *avec* l'agent plutôt que lui donner des ordres.

***

*Prochain article : collaborer avec l'IA sur des problèmes plus vastes — itérer ensemble vers des solutions.*
