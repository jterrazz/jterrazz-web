![](./assets/thumbnail.jpg)

# Diriger les agents ia

Une demande de fonctionnalité arrive : ajouter l'abonnement à la newsletter à l'API. Vous savez ce qui doit être fait — une nouvelle table dans la base de données, un endpoint POST, une logique de validation, la gestion des erreurs, des tests. La checklist mentale se forme automatiquement.

Dans l'ancien workflow, vous ouvririez un fichier vierge et commenceriez à taper. Où devrait résider le `route handler` ? Quelle est déjà la bonne bibliothèque de validation ? Vous consulteriez des endpoints similaires, copieriez du code standard, l'ajusteriez, lanceriez les tests, débogueriez la faute de frappe à la ligne 47. Deux heures plus tard, vous auriez du code fonctionnel.

Mais quelque chose de fondamental a changé. Vous pouvez maintenant énoncer votre intention et laisser un agent IA la construire.

Pas l'autocomplétion qui termine votre ligne. Pas un copilote qui suggère la prochaine fonction. Un agent qui prend une spécification et produit du code fonctionnel et testé pendant que vous supervisez et guidez. Votre rôle se transforme d'exécutant à évaluateur, de dactylographe à architecte.

C'est le niveau 2 de l'intégration de l'IA pour les développeurs. Voici comment cela fonctionne concrètement.

***

![](assets/conductor.jpg)

## L'intention au cœur du développement

Le cycle de développement traditionnel commence par les tests. Vous écrivez un test unitaire qui échoue, implémentez le code pour le faire passer, puis refactorisez. Cela fonctionne, mais suppose toujours que vous taperez l'implémentation vous-même.

Les agents IA permettent un point de départ différent : **l'intention**. Au lieu d'écrire des tests unitaires de bas niveau, vous écrivez des tests d'intégration de haut niveau qui décrivent les résultats métier. Ensuite, vous confiez l'implémentation à un agent.

Voici la fonctionnalité d'abonnement à la newsletter, du début à la fin.

***

![](assets/editor.jpg)

### Étape 1 : définir le résultat

Je crée `subscribe.intent.test.ts` et j'écris un unique test d'intégration qui décrit à quoi ressemble le succès :

```typescript
test('newsletter subscription', async () => {
  const response = await request(app)
    .post('/api/subscribe')
    .send({ email: 'user@example.com' });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ success: true });
  
  const subscriber = await db.query(
    'SELECT * FROM subscribers WHERE email = ?',
    ['user@example.com']
  );
  expect(subscriber).toBeDefined();
});
```

Ce test échoue immédiatement. Rien n'existe encore. C'est le but.

### Étape 2 : déléguer l'implémentation

J'ouvre mon éditeur assisté par IA (Cursor dans mon cas — essentiellement VS Code avec le contexte complet du codebase). Au lieu de créer des fichiers et de taper des implémentations, je sélectionne le test qui échoue et donne à l'agent une seule instruction :

**« Make this test pass. Follow our existing API patterns for validation and error handling. »**

L'agent dispose du contexte complet : la structure de mon projet, les schémas de base de données existants, les conventions d'API actuelles, les approches de validation. Il ne devine pas — il comprend le codebase de la même manière qu'un coéquipier après une intégration approfondie.

### Étape 3 : examiner le plan

L'agent répond avec une approche proposée :

1.  Créer une migration de base de données pour la table `subscribers` (email, created_at, contrainte d'unicité)
2.  Ajouter une route POST sur `/api/subscribe`
3.  Construire un contrôleur avec validation de l'email (regex + vérification DNS)
4.  Implémenter une couche de service pour gérer l'insertion en base de données et la détection des doublons
5.  Ajouter la gestion des erreurs pour les emails invalides et les échecs de base de données

J'examine cette architecture. Elle est solide, mais je veux un changement : « Move the DNS validation to an async job—don't block the request on it. » L'agent ajuste le plan immédiatement.

### Étape 4 : examiner le code

L'agent génère chaque pièce. Je vois des diffs pour chaque fichier :
- Fichier de migration avec le schéma approprié
- Enregistrement de la route suivant nos conventions
- Contrôleur avec validation de la requête
- Service avec une séparation nette des responsabilités
- Réponses d'erreur correspondant à nos standards d'API

Chaque diff apparaît pour examen. Je peux accepter, rejeter ou demander des modifications. L'expression régulière de validation semble trop permissive — je demande des règles plus strictes pour les caractères spéciaux. L'agent la met à jour instantanément. J'accepte le reste.

Pour une partie du code répétitif (comme la structure du fichier de migration), je peux même passer à un modèle plus rapide et moins cher pour réduire les coûts. La logique complexe est confiée au puissant modèle « architecte ». La génération de code de routine est assurée par le modèle « exécutant ».

### Étape 5 : vérifier

L'agent exécute le test. Il passe. L'ensemble de la fonctionnalité — schéma de base de données, endpoint d'API, validation, gestion des erreurs, intégration testée — a pris quinze minutes. La majorité de ce temps a été consacrée à ma revue et à mes décisions architecturales.

Je n'ai tapé aucun code d'implémentation. J'ai défini le résultat, guidé l'architecture et vérifié la qualité.

***

![](assets/pyramid.jpg)

## Ce que cela change

**Compression du temps.** La fonctionnalité de newsletter aurait traditionnellement pris deux heures : mise en place du schéma, écriture de l'endpoint, débogage des cas limites de validation, écriture des tests. Avec une IA dirigée, quinze minutes. Plus important encore, ces quinze minutes sont consacrées à des décisions à haute valeur ajoutée (choix architecturaux, standards de qualité) plutôt qu'à une exécution à faible valeur (saisie de code standard, recherche de syntaxe).

**La qualité par défaut.** Lorsque vous n'êtes pas en train de vous débattre avec les détails de l'implémentation, il vous reste de l'attention pour la qualité. Chaque fonctionnalité bénéficie de tests appropriés car écrire du code de test n'est plus fastidieux. La documentation se fait car la générer est trivial. La gestion des erreurs est complète car vous examinez au lieu de vous précipiter.

**L'exploration devient peu coûteuse.** Vous voulez essayer une approche de validation différente ? Demandez à l'agent de l'implémenter. Comparez les deux. Choisissez la meilleure. Le coût cognitif de l'exploration d'alternatives passe de quelques heures à quelques minutes, alors vous le faites vraiment. De meilleures décisions s'ensuivent.

**Le travail qui subsiste est différent.** Vous ne tapez pas — vous définissez des résultats, prenez des décisions architecturales, examinez des implémentations, assurez la qualité. C'est un travail à plus fort effet de levier. L'effet cumulé est important : lorsque chaque développeur d'une équipe opère de cette manière, la production de toute l'organisation se transforme.

**Le piège est l'abdication.** Vous devez toujours comprendre ce que vous construisez. Un agent IA implémentera sans faille une mauvaise architecture si vous le lui demandez. Il manquera les cas limites que vous ne mentionnez pas. Il suivra les conventions qu'il déduit de votre codebase, même si ces conventions sont imparfaites. La qualité du résultat dépend entièrement de la qualité de votre direction et de votre revue.

Imaginez la situation ainsi : vous gérez un développeur junior exceptionnellement rapide qui ne se fatigue jamais, ne fait jamais de fautes de frappe et a une mémoire parfaite de tout votre codebase. Mais il n'a aucune intuition, aucun sens du produit, et ne peut pas juger si la fonctionnalité qu'il construit résout réellement le problème de l'utilisateur. Ce jugement reste votre responsabilité.

## Le nouveau workflow de développement

Vous vous souvenez de la demande de fonctionnalité du début — l'abonnement à la newsletter ? Dans le workflow traditionnel, vous seriez encore en train de taper. Peut-être de déboguer la logique de validation. Probablement de chercher sur Stack Overflow le bon motif d'expression régulière.

Avec les agents IA dirigés, vous êtes passé à autre chose. La fonctionnalité est terminée, testée et fusionnée. Vous pensez déjà au prochain problème : comment gérer les flux de désabonnement, ou si le modèle d'abonnement devrait supporter des préférences et des segments.

C'est là toute la transformation. Pas une saisie plus rapide — une pensée plus rapide. Pas plus de code — une meilleure architecture. Pas l'automatisation de votre travail — l'élévation de votre rôle là où il aurait toujours dû être.

**Commencez petit cette semaine.** Choisissez une fonctionnalité que vous construiriez normalement manuellement. Écrivez le test d'intégration qui décrit le résultat que vous souhaitez. Puis entraînez-vous à diriger un agent IA pour le faire passer. Prêtez attention à ce qui se passe : pas seulement le temps gagné, mais où va votre attention lorsque vous n'êtes pas en train de taper les détails de l'implémentation.

La compétence que vous développez n'est pas le *prompt engineering* — c'est le jugement architectural en mode accéléré. Les développeurs qui maîtrisent cela livreront plus, apprendront plus vite et construiront de meilleurs systèmes qu'il n'était possible de l'imaginer il y a un an.

Le fichier vierge a disparu. La question est de savoir ce que vous allez construire avec le temps que vous avez regagné.

***

*Cet article explore le niveau 2 de l'intégration de l'IA pour les développeurs. Le cadre plus large s'étend de l'assistance intégrée à l'intelligence programmable, chaque niveau représentant une intégration plus profonde entre le jugement humain et la capacité de l'IA.*

---

1. [Les quatre niveaux de l'intégration de l'ia](https://jterrazz.com/articles/20-the-four-levels-of-ai) *Un cadre pratique pour intégrer l'IA dans n'importe quel domaine, de l'assistant à l'intelligence programmable, vous permettant de décupler votre travail et votre créativité.*
2. [**Diriger les agents ia**](https://jterrazz.com/articles/21-guided-ai-for-developers) *Un guide pour les développeurs pour diriger l'IA en tant qu'agent guidé, transformant le codage en une orchestration de haut niveau avec des outils comme Cursor et le développement piloté par l'intention.*
3. [Les agents ia autonomes](https://jterrazz.com/articles/22-autonomous-ai-agents) *Explorer comment les développeurs peuvent déléguer des workflows entiers à des agents IA autonomes, en tirant parti des protocoles centrés sur le modèle et des sandboxes pour des résultats sécurisés et évolutifs.*
4. [Programmer les systèmes intelligents](https://jterrazz.com/articles/23-programming-intelligence) *Une plongée en profondeur dans la conception de systèmes intelligents qui mêlent code déterministe et raisonnement IA créatif, permettant aux développeurs d'architecturer des solutions auto-optimisées.*
