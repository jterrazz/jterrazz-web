![](assets/thumbnail.jpg)

# Programmer des systèmes intelligents

Les **systèmes intelligents** représentent un changement fondamental. Dans les approches précédentes, l'IA est un outil qui vous aide à construire des logiciels. Ici, l'IA devient une composante du logiciel *lui-même*.

Vous n'écrivez plus seulement du code ; vous architecturez des systèmes qui combinent la **logique déterministe** (code traditionnel) avec le **raisonnement probabiliste** (IA).

Considérez un bot de support client moderne.
- Une approche **purement code** (instructions if/else) est sûre mais rigide. Elle casse dès qu'un utilisateur pose une question qui ne correspond pas au script prédéfini.
- Une approche **purement IA** est flexible mais risquée. Elle pourrait inventer une politique de remboursement qui n'existe pas ou promettre des choses qu'elle ne peut pas livrer.

L'**architecture hybride** résout ce problème. Elle utilise le code pour les contraintes et l'IA pour la flexibilité.

***

## L'architecture hybride

![](assets/bridge-merge.jpg)

Le principe central est la **Séparation des Responsabilités**.

**Le code gère les contraintes :**
- Logique métier (prix, remboursements).
- Permissions et sécurité (qui peut voir quoi).
- Gestion de l'état (enregistrements en base de données).
- Pistes d'audit.

**L'IA gère l'ambiguïté :**
- Comprendre l'intention de l'utilisateur à partir du langage naturel.
- Résumer des données complexes.
- Générer des explications personnalisées.
- Transformer des données non structurées (emails, images) en données structurées.

L'objectif est de construire un "sandwich" : le Code prépare le contexte, l'IA effectue la tâche de raisonnement, et le Code valide la sortie.

***

## Le modèle "Sandwich"

![](assets/layered-cake.jpg)

Appliquons cela à l'exemple du bot de support.

**Couche 1 : Code (Préparation)**
Quand un utilisateur pose une question sur un remboursement, le système n'envoie pas simplement la requête à un LLM. D'abord, le code traditionnel s'exécute :
- L'utilisateur est-il connecté ?
- Récupérer ses commandes récentes depuis la base de données.
- Récupérer le document officiel de politique de remboursement.
- *Construire un prompt* qui inclut ces données spécifiques.

**Couche 2 : IA (Raisonnement)**
Le modèle reçoit la question de l'utilisateur ainsi que les *faits* fournis par la Couche 1. Il est instruit : "Réponds à l'utilisateur en te basant *uniquement* sur la politique fournie et l'historique des commandes." L'IA génère une réponse.

**Couche 3 : Code (Validation)**
Avant de montrer la réponse à l'utilisateur, le code traditionnel s'exécute à nouveau :
- La réponse contient-elle des mots interdits ?
- Tente-t-elle d'exécuter un appel d'outil (comme `rembourser_utilisateur`) ? Si oui, appliquer les limites (ex : "Remboursement max 50 $ sans approbation humaine").

Cette architecture permet au système d'être conversationnel et utile (IA) tout en restant sûr et conforme (Code).

***

## Tester les systèmes probabilistes

![](assets/lab-instruments.jpg)

Tester les systèmes hybrides nécessite un changement d'état d'esprit. Le logiciel traditionnel est binaire : un test passe ou échoue. Les systèmes IA sont probabilistes : ils ont "généralement raison".

La stratégie de test implique :
1. **Tests unitaires pour le Code :** Les contraintes et la logique de récupération de données doivent être 100% correctes.
2. **Évaluations pour l'IA :** Vous exécutez le modèle contre un jeu de données de 100 questions exemples et notez les réponses. Vous acceptez le système s'il obtient un score supérieur à un seuil (ex : 95% de précision).
3. **Garde-fous :** Vous testez les mécanismes de sécurité. Que se passe-t-il si l'IA essaie d'halluciner ? La couche de validation doit l'intercepter.

***

## Le futur du logiciel

Nous nous dirigeons vers un monde où la plupart des applications complexes seront hybrides.

- Les applications juridiques utiliseront l'IA pour lire les contrats, mais le code pour calculer les délais.
- Les applications médicales utiliseront l'IA pour analyser les symptômes, mais le code pour vérifier les interactions médicamenteuses.
- Les applications financières utiliseront l'IA pour résumer les nouvelles du marché, mais le code pour exécuter les transactions.

Le rôle de l'ingénieur évolue de l'écriture de logique à l'**orchestration de l'intelligence**. Vous devenez le concepteur des frontières, assurant que la "magie" de l'IA crée de la valeur sans créer le chaos.

***

Ceci conclut notre série sur les Quatre Niveaux d'Intégration de l'IA. De l'**Accélérateur Prédictif**, au **Directeur**, à l'**Architecte** d'agents autonomes, et enfin au **Concepteur de Systèmes** d'applications hybrides.

La technologie évolue vite, mais les principes d'ingénierie fondamentaux — modularité, sécurité et spécification claire — restent plus importants que jamais.

---

1. [Les quatre niveaux d'intégration de l'IA](https://jterrazz.com/articles/20-the-four-levels-of-ai)
2. [Diriger des agents IA](https://jterrazz.com/articles/21-guided-ai-for-developers)
3. [Agents IA autonomes](https://jterrazz.com/articles/22-autonomous-ai-agents)
4. [**Programmer des systèmes intelligents**](https://jterrazz.com/articles/23-programming-intelligence)

