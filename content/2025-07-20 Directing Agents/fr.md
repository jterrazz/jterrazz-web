![](./assets/thumbnail.jpg)

# Diriger des agents IA

Une demande de fonctionnalité arrive : "Ajouter l'inscription à la newsletter à l'API." La liste des prérequis est claire — gestionnaire de route, validation, migration, tests — et représente environ deux heures de travail. Cependant, l'essentiel de ce temps ne sera pas consacré aux décisions sur le comportement de la fonctionnalité, mais au travail mécanique de transformation de ces décisions en code, ligne par ligne.

**Diriger des agents** change fondamentalement ce ratio. En utilisant des agents IA capables de lire votre codebase et de comprendre vos modèles, la tâche principale passe de l'écriture de code à la **spécification de l'intention**.

***

## Séparer la décision de la traduction

![](assets/split-thread.jpg)

Le développement logiciel implique deux activités distinctes :
1. **Prise de décision :** Déterminer comment la fonctionnalité doit se comporter, quels compromis accepter, et comment elle s'intègre dans l'architecture existante.
2. **Traduction :** Convertir ces décisions en code valide.

Pour les développeurs expérimentés, ces étapes ont historiquement été indissociables. Écrire du code est souvent une forme de pensée — vous écrivez un test qui échoue, implémentez une solution naïve, refactorisez, et découvrez des nuances architecturales par l'acte de taper. Le processus d'implémentation lui-même sert de boucle de rétroaction pour votre conception.

Les agents dirigés vous obligent à recâbler cette habitude. Vous pouvez maintenant séparer l'intention de la syntaxe, mais cela force un changement dans la façon dont vous "pensez" en code. Au lieu de découvrir la conception en luttant avec les détails d'implémentation, vous devez apprendre à penser par la **spécification**.

Vous itérez toujours, mais la boucle change. Vous définissez l'intention, l'agent gère la traduction, et vous révisez le résultat. Cela vous permet de rester dans l'état d'esprit de l'"architecte" plus longtemps, évaluant les implications structurelles du code sans être constamment tiré vers le bas par la mécanique de son écriture.

***

## L'art de la spécification

![](assets/architect-table.jpg)

Pour diriger efficacement un agent, vous devez définir clairement à quoi ressemble le résultat "terminé". Des instructions vagues donnent du code vague. Des spécifications précises donnent des fonctionnalités prêtes pour la production.

L'un des moyens les plus efficaces de spécifier l'intention est par les **tests**. Un cas de test est une description non ambiguë du comportement.

```typescript
test('flux d\'inscription newsletter', async () => {
  // 1. La requête
  const response = await request(app)
    .post('/api/subscribe')
    .send({ email: 'user@example.com' });

  // 2. Le résultat attendu
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ success: true });
  
  // 3. L'effet de bord (changement d'état)
  const subscriber = await db.query(
    'SELECT * FROM subscribers WHERE email = ?',
    ['user@example.com']
  );
  expect(subscriber).toBeDefined();
});
```

Ce code décrit le *quoi* sans dicter le *comment*. Il définit l'interface et le changement d'état attendu.

Vous pouvez ensuite instruire l'agent : *"Implémente la logique pour faire passer ce test, en suivant nos modèles existants pour les contrôleurs et les services."*

L'agent gère le travail mécanique — création des fichiers, import des dépendances, écriture du code répétitif — pendant que vous vous concentrez sur la révision de la logique.

***

## Réviser, pas corriger

Le processus de révision lors de la direction d'agents est critique. Vous ne vérifiez pas seulement les erreurs de syntaxe ; vous vérifiez la **logique et la sécurité**.

- L'agent a-t-il géré les cas limites (ex: emails en doublon) ?
- La validation des entrées est-elle assez stricte ?
- A-t-il halluciné une méthode de bibliothèque qui n'existe pas ?

L'agent est un travailleur infatigable, mais il manque de jugement. Il écrira volontiers du code non sécurisé ou inefficace si cela correspond au prompt. Votre valeur réside dans votre capacité à repérer ces défauts architecturaux.

***

## Le piège de la complaisance

Le danger de la génération dirigée est le syndrome du "ça m'a l'air bon". Quand une implémentation complète apparaît en quelques secondes, la tentation de l'accepter sans examen approfondi est forte.

Cependant, le code généré par l'IA doit être traité avec le même scepticisme que le code écrit par un développeur junior. Il nécessite une validation. Si vous arrêtez de lire le code que vous committez, vous ne dirigez plus ; vous pariez.

***

## Développer la compétence de direction

Maîtriser ce flux de travail nécessite un changement de compétences :

1. **Clarté :** Pouvez-vous articuler les exigences si clairement qu'une machine peut les exécuter sans deviner ?
2. **Reconnaissance de motifs :** Pouvez-vous scanner rapidement le code généré pour vous assurer qu'il correspond au style architectural de votre projet ?
3. **Décomposition :** Pouvez-vous diviser une fonctionnalité complexe en tâches plus petites et isolées qu'un agent peut gérer de manière fiable ?

En déchargeant la couche de traduction, vous gagnez la capacité de vous concentrer sur la conception du système et la qualité. Vous construisez plus vite non pas parce que vous tapez plus vite, mais parce que vous dépensez votre énergie sur les problèmes qui nécessitent réellement l'intelligence humaine.

***

*Ensuite : Nous explorons les systèmes autonomes, où nous passons de la direction d'agents en temps réel à la conception de systèmes autonomes qui travaillent en arrière-plan.*

---

1. [Les quatre niveaux d'intégration de l'IA](https://jterrazz.com/articles/20-the-four-levels-of-ai)
2. [**Diriger des agents IA**](https://jterrazz.com/articles/21-guided-ai-for-developers)
3. [Agents IA autonomes](https://jterrazz.com/articles/22-autonomous-ai-agents)
4. [Programmer des systèmes intelligents](https://jterrazz.com/articles/23-programming-intelligence)

