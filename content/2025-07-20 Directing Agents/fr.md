![](./assets/thumbnail.jpg)

# Diriger les agents IA

Quand une demande de nouvelle fonctionnalité arrive — comme ajouter un endpoint d'abonnement à une newsletter — les exigences sont souvent claires : un gestionnaire de route, une logique de validation, une migration de base de données et des tests.

Dans le flux de travail traditionnel, comprendre ces exigences prend une fraction du temps. La majorité est passée à la **traduction mécanique** de ces exigences en syntaxe — taper du code passe-partout (boilerplate), chercher des spécificités de bibliothèque, et corriger des erreurs mineures.

**Diriger des agents** change fondamentalement ce ratio. En utilisant des agents IA qui peuvent lire votre base de code et comprendre vos patterns, la tâche principale passe de l'écriture de code à la **spécification de l'intention**.

---

## Séparer la décision de la traduction

![](assets/split-thread.jpg)

Le développement logiciel implique deux activités distinctes :

1. **Prise de Décision :** Déterminer comment la fonctionnalité devrait se comporter, quels compromis accepter, et comment elle s'intègre dans l'architecture existante.
2. **Traduction :** Convertir ces décisions en code valide.

Pour les développeurs expérimentés, ces étapes ont historiquement été inséparables. Écrire du code est souvent une forme de pensée — vous écrivez un test qui échoue, implémentez une solution naïve, refactorisez, et découvrez des nuances architecturales à travers l'acte de taper. Le processus d'implémentation lui-même sert de boucle de rétroaction pour votre design.

Les agents dirigés vous obligent à recâbler cette habitude. Vous pouvez maintenant séparer l'intention de la syntaxe, mais cela force un changement dans la façon dont vous "pensez" en code. Au lieu de découvrir le design en luttant avec les détails d'implémentation, vous devez apprendre à penser par la **spécification**.

Vous itérez toujours, mais la boucle change. Vous définissez l'intention, l'agent gère la traduction, et vous révisez le résultat. Cela vous permet de rester dans l'état d'esprit d'"architecte" plus longtemps, évaluant les implications structurelles du code sans être constamment tiré vers le bas dans la mécanique de son écriture.

---

## L'art de la spécification

![](assets/architect-table.jpg)

Pour diriger un agent efficacement, vous devez clairement définir à quoi ressemble "fini". Des instructions vagues donnent du code vague. Des spécifications précises donnent des fonctionnalités prêtes pour la production.

Une des façons les plus efficaces de spécifier l'intention est à travers les **tests**. Un cas de test est une description non ambiguë du comportement.

```typescript
test('newsletter subscription flow', async () => {
  // 1. La requête
  const response = await request(app).post('/api/subscribe').send({ email: 'user@example.com' });

  // 2. Le résultat attendu
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ success: true });

  // 3. L'effet de bord (changement d'état)
  const subscriber = await db.query('SELECT * FROM subscribers WHERE email = ?', [
    'user@example.com',
  ]);
  expect(subscriber).toBeDefined();
});
```

Ce code décrit le _quoi_ sans dicter le _comment_. Il définit l'interface et le changement d'état attendu.

Vous pouvez alors instruire l'agent : _"Implémente la logique pour faire passer ce test, en suivant nos patterns existants pour les contrôleurs et les services."_

L'agent gère le travail mécanique — créer les fichiers, importer les dépendances, écrire le boilerplate — pendant que vous vous concentrez sur la révision de la logique.

---

## Réviser, pas relire

Le processus de révision lors de la direction d'agents est critique. Vous ne vérifiez pas juste les erreurs de syntaxe ; vous vérifiez la **logique et la sécurité**.

- L'agent a-t-il géré les cas limites (ex: emails en double) ?
- La validation des entrées est-elle assez stricte ?
- A-t-il halluciné une méthode de bibliothèque qui n'existe pas ?

L'agent est un travailleur infatigable, mais il manque de jugement. Il écrira joyeusement du code non sécurisé ou inefficace si cela correspond au prompt. Votre valeur réside dans votre capacité à repérer ces défauts architecturaux.

---

## Le piège de la complaisance

Le danger de la génération dirigée est le syndrome du "ça m'a l'air bon". Quand une implémentation complète apparaît en quelques secondes, la tentation de l'accepter sans examen approfondi est forte.

Cependant, le code généré par IA devrait être traité avec le même scepticisme que le code écrit par un développeur junior. Il nécessite une validation. Si vous arrêtez de lire le code que vous committez, vous ne dirigez plus ; vous jouez.

---

## Développer la compétence de direction

Maîtriser ce flux de travail nécessite un changement de compétences :

1. **Clarté :** Pouvez-vous articuler les exigences si clairement qu'une machine peut les exécuter sans deviner ?
2. **Reconnaissance de Patterns :** Pouvez-vous scanner rapidement le code généré pour vous assurer qu'il correspond au style architectural de votre projet ?
3. **Décomposition :** Pouvez-vous décomposer une fonctionnalité complexe en tâches plus petites et isolées qu'un agent peut gérer de manière fiable ?

En déchargeant la couche de traduction, vous gagnez la capacité de vous concentrer sur la conception du système et la qualité. Vous construisez plus vite non pas parce que vous tapez plus vite, mais parce que vous dépensez votre énergie sur les problèmes qui requièrent réellement l'intelligence humaine.

---

_Ensuite : Nous explorons les systèmes autonomes, où nous passons de la direction d'agents en temps réel à la conception de systèmes autonomes qui travaillent en arrière-plan._

---

1. [Les quatre niveaux d'intégration de l'IA](https://jterrazz.com/articles/20-the-four-levels-of-ai)
2. [**Diriger les agents IA**](https://jterrazz.com/articles/21-guided-ai-for-developers)
3. [Agents IA autonomes](https://jterrazz.com/articles/22-autonomous-ai-agents)
4. [Programmer des systèmes intelligents](https://jterrazz.com/articles/23-programming-intelligence)
