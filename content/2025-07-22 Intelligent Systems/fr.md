![](assets/thumbnail.jpg)

# Programmer des systèmes intelligents

Les **systèmes intelligents** représentent un changement fondamental. Dans les approches précédentes, l'IA est un outil qui vous aide à *construire* du logiciel. Ici, l'IA devient une composante du logiciel *lui-même*.

Vous n'écrivez plus simplement du code ; vous architecturez des systèmes qui combinent **logique déterministe** (code traditionnel) et **raisonnement probabiliste** (IA).

Considérez un bot de support client moderne.
- Une approche **code pur** (instructions if/else) est sûre mais rigide. Elle casse dès qu'un utilisateur pose une question qui ne rentre pas dans le script prédéfini.
- Une approche **IA pure** est flexible mais risquée. Elle pourrait inventer une politique de remboursement qui n'existe pas ou promettre des choses qu'elle ne peut pas livrer.

L'**architecture hybride** adresse cela. Elle utilise le code pour les contraintes et l'IA pour la flexibilité.

***

## L'architecture hybride

![](assets/bridge-merge.jpg)

Le principe central est la **Séparation des Responsabilités**.

**Le code gère les contraintes :**
- Logique métier (prix, remboursements).
- Permissions et sécurité (qui peut voir quoi).
- Gestion d'état (enregistrements en base de données).
- Pistes d'audit.

**L'IA gère l'ambiguïté :**
- Comprendre l'intention utilisateur depuis le langage naturel.
- Résumer des données complexes.
- Générer des explications personnalisées.
- Transformer des données non structurées (emails, images) en données structurées.

Le but est de construire un "sandwich" : le Code prépare le contexte, l'IA effectue la tâche de raisonnement, et le Code valide la sortie.

***

## Le Pattern "Sandwich"

![](assets/layered-cake.jpg)

Appliquons ceci à l'exemple du bot de support.

**Couche 1 : Code (Préparation)**
Quand un utilisateur pose une question sur un remboursement, le système n'envoie pas juste la requête à un LLM. D'abord, du code traditionnel s'exécute :
- L'utilisateur est-il connecté ?
- Récupérer ses commandes récentes depuis la base de données.
- Récupérer le document officiel de politique de remboursement.
- *Construire un prompt* qui inclut ces données spécifiques.

**Couche 2 : IA (Raisonnement)**
Le modèle reçoit la question de l'utilisateur avec les *faits* fournis par la Couche 1. Il est instruit : "Réponds à l'utilisateur basé *uniquement* sur la politique fournie et l'historique de commande." L'IA génère une réponse.

**Couche 3 : Code (Validation)**
Avant de montrer la réponse à l'utilisateur, le code traditionnel s'exécute à nouveau :
- La réponse contient-elle des mots interdits ?
- Tente-t-elle d'exécuter un appel d'outil (comme `rembourser_utilisateur`) ? Si oui, appliquer des limites (ex: "Remboursement max 50$ sans approbation humaine").

Cette architecture permet au système d'être conversationnel et utile (IA) tout en restant sûr et conforme (Code).

***

## Tester des systèmes probabilistes

![](assets/lab-instruments.jpg)

Tester des systèmes hybrides requiert un changement d'état d'esprit. Le logiciel traditionnel est binaire : un test passe ou échoue. Les systèmes IA sont probabilistes : ils sont "plutôt corrects".

La stratégie de test implique :
1. **Tests Unitaires pour le Code :** Les contraintes et la logique de récupération de données doivent être 100% correctes.
2. **Évals pour l'IA :** Vous lancez le modèle contre un jeu de données de 100 exemples de questions et notez les réponses. Vous acceptez le système s'il score au-dessus d'un seuil (ex: 95% de précision).
3. **Garde-fous :** Vous testez les mécanismes de sécurité. Que se passe-t-il si l'IA essaie d'halluciner ? La couche de validation doit l'attraper.

***

## Le futur du logiciel

Nous nous dirigeons vers un monde où la plupart des applications complexes seront hybrides.

- Les applis juridiques utiliseront l'IA pour lire les contrats, mais du code pour calculer les délais.
- Les applis médicales utiliseront l'IA pour analyser les symptômes, mais du code pour vérifier les interactions médicamenteuses.
- Les applis financières utiliseront l'IA pour résumer les nouvelles du marché, mais du code pour exécuter les transactions.

Le rôle de l'ingénieur évolue de l'écriture de logique à l'**orchestration de l'intelligence**. Vous devenez le concepteur des frontières, vous assurant que la "magie" de l'IA crée de la valeur sans créer le chaos.

***

Ceci conclut notre série sur les Quatre Niveaux d'Intégration de l'IA. De l'**Accélérateur Prédictif**, au **Directeur**, à l'**Architecte** d'agents autonomes, et finalement au **Concepteur de Systèmes** d'applications hybrides.

La technologie bouge vite, mais les principes d'ingénierie fondamentaux — modularité, sécurité, et spécification claire — restent plus importants que jamais.

---

1. [Les quatre niveaux d'intégration de l'IA](https://jterrazz.com/articles/20-the-four-levels-of-ai)
2. [Diriger les agents IA](https://jterrazz.com/articles/21-guided-ai-for-developers)
3. [Agents IA autonomes](https://jterrazz.com/articles/22-autonomous-ai-agents)
4. [**Programmer des systèmes intelligents**](https://jterrazz.com/articles/23-programming-intelligence)

