![](assets/thumbnail.jpg)

# L'IA dans le développement, niveau 2: du codeur au chef d'orchestre

Entrons dans le vif du sujet.

Dans le premier article de cette série, j'ai posé les bases d'un cadre simple en quatre niveaux pour penser le rôle de l'IA dans notre travail. C'est une carte universelle, que vous soyez dans le marketing ou la gestion de projet. Si vous l'avez manqué, je vous invite à le parcourir rapidement: il plante le décor de tout ce que nous allons aborder.

Aujourd'hui, nous allons nous concentrer sur mon univers: le développement logiciel. Nous allons plonger au cœur du **Niveau 2: L'agent guidé**.

Clarifions d'emblée l'idée maîtresse. Au Niveau 2, vous ne vous contentez plus d'*utiliser* un outil; vous *dirigez* un agent. Imaginez-vous en chef d'orchestre ou en manager d'un coéquipier ultra-compétent, quoique parfois naïf. Vous fixez l'objectif, puis vous guidez et affinez le résultat de manière itérative. Le changement fondamental est que vous ne réalisez plus la tâche vous-même, vous en supervisez l'achèvement.

Pour un développeur, ce n'est pas un petit ajustement; c'est un véritable séisme dans sa façon de créer. Vous ne tapez plus simplement du code, vous devenez le directeur technique d'une IA. Je formule une intention–" Refactorise ce module pour améliorer ses performances " ou " Construis ce point de terminaison d'API à partir des spécifications "–et l'IA se charge du travail de fond, pilotée par mon expertise. Pour moi, ce changement a ravivé une sensation de magie, me permettant de construire et d'itérer à une vitesse que je n'aurais jamais crue possible. Ma puissance cérébrale est désormais consacrée à l'architecture de haut niveau et à la stratégie produit, et non plus à la traque d'un point-virgule égaré.

Décortiquons l'état d'esprit, les outils et les flux de travail qui définissent cette nouvelle réalité.

***

![](assets/conductor.jpg)

## La bascule mentale: de l'exécutant au directeur

Le changement le plus profond au Niveau 2 n'est pas sur votre écran, mais dans votre esprit. Le nouveau mantra est simple et direct: **J'instruis, je guide, je valide. Je n'exécute pas.**

J'ai trouvé utile de considérer mon agent IA comme un développeur junior incroyablement rapide: brillant, mais qui a besoin d'une feuille de route claire. Un bon " prompt " n'est pas une simple commande cryptique. C'est un véritable brief, riche en contexte, comme celui que vous donneriez à un coéquipier humain.

- **La puissance:** La friction entre une bonne idée et un code fonctionnel s'évanouit presque entièrement. Tout ce temps passé à taper, à corriger des fautes de frappe et à chercher de la syntaxe sur Stack Overflow fond comme neige au soleil. Cela libère votre RAM mentale pour opérer à un niveau d'abstraction supérieur. Vous commencez à penser davantage à une architecture propre, à des expériences utilisateur élégantes et au *pourquoi* derrière le *quoi*.
- **Le piège:** Il est facile de tomber dans le piège du " YOLO coding "–lancer des prompts vagues à l'IA en espérant un miracle. Ne faites pas ça. La clé est de visualiser la solution comme si vous la codiez vous-même, mais à la vitesse de la pensée. Vous devez toujours avoir une maîtrise parfaite de la logique et du flux de données pour fournir un retour pertinent. Un grand chef d'orchestre n'a pas besoin de jouer de chaque instrument, mais il a sacrément intérêt à savoir comment le morceau doit sonner.

Ce qui m'a le plus surpris? La qualité de mon code a en fait *augmenté*. Quand vous passez moins de temps à taper et plus de temps à superviser depuis une vue d'ensemble, votre attention se porte naturellement sur ce qui compte vraiment: une logique claire, des tests robustes et une conception simple et élégante.

![](assets/pyramid.jpg)

## Choisir ses outils: la bonne IA pour chaque tâche

On n'utilise pas un marteau-piqueur pour accrocher un cadre. Choisir le bon modèle d'IA pour une tâche donnée est tout aussi crucial. Votre choix se résume à un arbitrage entre complexité, vitesse et coût.

Voici une façon simple de voir les différents niveaux de modèles disponibles aujourd'hui:

- **Les architectes seniors (ex.: Claude 4 Sonnet, Grok 4, o3):** Ce sont les poids lourds de la réflexion. Je fais appel à eux pour des opérations complexes en plusieurs étapes: un refactoring majeur, la conception d'un nouveau microservice à partir de zéro, ou la recherche d'un bug logique particulièrement retors. Ils ont une capacité de raisonnement incroyable, mais ce sont aussi les plus coûteux. Utilisez-les à bon escient.
- **Les bêtes de somme (ex.: o3, Claude 4 Opus, Gemini 2.5 Pro):** Ces modèles sont mes outils de prédilection au quotidien. Ils offrent le parfait équilibre entre vitesse, intelligence et coût. Je les utilise pour analyser de larges pans de code, générer du code standard, écrire des tests unitaires et itérer sur de nouvelles fonctionnalités. Ils sont incroyablement performants.
- **Les sprinteurs (modèles plus petits et plus rapides):** Pour les tâches à la volée comme l'autocomplétion d'une ligne de code ou la réponse à une simple question du type " comment faire X en Python? ", ces modèles plus rapides et moins chers sont parfaits.

Mon flux de travail est un mélange fluide des trois. J'utilise une bête de somme pour 80 % de mes tâches et je convoque l'architecte senior quand j'ai besoin d'un éclair de génie. Apprendre à optimiser son usage des modèles est une nouvelle compétence, et à mon sens, une compétence essentielle pour les développeurs.

![](assets/editor.jpg)

## En pratique: guider un agent avec Cursor

La théorie, c'est une chose, mais voyons à quoi cela ressemble concrètement. Pour moi, un éditeur comme **Cursor**–qui est en somme un VS Code doté de super-pouvoirs IA–est l'outil ultime pour l'agent guidé. Il fonctionne en indexant l'intégralité de votre base de code, donnant à l'IA le même contexte profond qu'un coéquipier humain aurait après une semaine d'intégration.

**Pour commencer:**
Le principe est d'une simplicité enfantine. Vous clonez votre dépôt, ouvrez le dossier dans Cursor et le laissez faire son travail. L'éditeur scanne et indexe tout: les fichiers, la structure des dossiers, les dépendances. L'IA *connaît* désormais votre projet.

**La magie du `Cmd + K` (ou `Ctrl + K`):**
Ce raccourci clavier est votre nouveau meilleur ami. Au lieu de taper du code, vous ouvrez une fenêtre de discussion intégrée et vous énoncez votre intention.

- **Cas d'usage 1: Refactoring rapide**
    Je surligne une fonction un peu lourde et j'appuie sur `Cmd + K`: " Refactorise ceci pour utiliser `async/await` et ajoute des commentaires JSDoc pour chaque paramètre. " Cursor génère les modifications sur-le-champ, en me montrant une vue `diff` claire. J'examine, j'accepte, et c'est terminé.
- **Cas d'usage 2: Écraser les bugs**
    Un fichier de test échoue? Je tape simplement `Cmd + K` et je dis: " Lance les tests dans `@monTest.test.ts`. Trouve pourquoi ils échouent et corrige le code sous-jacent jusqu'à ce qu'ils passent tous. " L'IA entame alors un cycle d'analyse, de proposition de correctif et de re-test, pendant que je supervise et approuve les changements.
- **Cas d'usage 3: Migrations ambitieuses**
    Vous pouvez même vous attaquer à des projets massifs. J'ai récemment démarré une migration avec un prompt simple: `Cmd + K`, " Donne-moi un plan étape par étape pour migrer ce projet entier de JavaScript à TypeScript. " L'IA a présenté une stratégie cohérente. À partir de là, j'ai pu lui ordonner d'exécuter chaque étape, une par une, sur des dizaines de fichiers.

Avec des fonctionnalités comme les **Cursor Rules**, vous pouvez même imposer les conventions de codage de votre équipe, par exemple en lui disant de toujours utiliser une structure " Given-When-Then " pour les nouveaux tests. C'est comme si vous donniez à votre IA un guide de style personnalisé.

## Un nouveau paradigme: le développement guidé par l'intention (IDD)

Ce flux de travail guidé m'a conduit à un concept que j'ai commencé à appeler le **développement guidé par l'intention (intention-driven development - IDD)**. C'est une variante du *test-driven development* (TDD), mais qui élève le point de départ d'un simple test unitaire à une intention métier de haut niveau.

Voici comment cela fonctionne en pratique:

- Je crée un nouveau fichier de test, du type `feature-x.intent.test.ts`. J'y écris un unique test d'intégration de haut niveau qui décrit le résultat métier exact que je souhaite obtenir. Par exemple: " Quand un utilisateur fait un POST sur `/api/subscribe` avec un e-mail valide, l'API doit retourner un statut 200 avec `{ success: true }` dans le corps de la réponse, et la réponse entière doit prendre moins de 200ms. "
- Vient alors le moment décisif. Je confie ce " fichier d'intention " à mon agent IA avec une directive simple: " Faites passer ce test. "

L'IA est désormais libre d'implémenter tout ce qui est nécessaire–le contrôleur, la logique de service, l'interaction avec la base de données–tant que le résultat final satisfait mon intention déclarée. Cette approche me permet de rester concentré au laser sur la livraison de valeur produit réelle, et non sur de simples lignes de code.

## Les répercussions positives: une meilleure façon de construire

Lorsque vous endossez pleinement ce rôle de chef d'orchestre, vous devenez plus qu'un simple codeur. Vous devenez un architecte assisté par IA. Vous déléguez le labeur cognitif de l'exécution manuelle, libérant votre esprit pour vous concentrer sur ce que les humains font de mieux: l'innovation, la créativité et la pensée stratégique.

Votre IA devient un partenaire qui apprend à opérer en phase avec votre style et les besoins de votre projet. Un code de haute qualité–testé et documenté–devient la norme, et non plus un luxe. Le résultat est un pic de productivité massif, un code plus propre et plus maintenable, et honnêtement, cela rend le simple fait de construire à nouveau amusant.

## Conclusion: êtes-vous prêt pour l'autonomie?

L'agent guidé n'est pas un concept théorique; il change la donne, et c'est une réalité d'aujourd'hui. Dans mon propre travail, je peux construire et livrer en une seule journée des fonctionnalités qui prenaient autrefois une semaine, simplement en donnant des instructions claires et de haut niveau à une IA comme Claude au sein de Cursor. L'idée selon laquelle le " prompting " serait une compétence anodine est officiellement révolue. Un prompt bien conçu, riche en contexte et en intention, est l'une des compétences à plus fort effet de levier qu'un développeur moderne puisse posséder.

Ce niveau incarne parfaitement le principe de notre premier article: vous gérez un membre d'équipe virtuel. Pour les développeurs, l'impact est concret et immédiat. Je vous encourage vivement à télécharger Cursor ou à essayer un flux de travail similaire dès aujourd'hui. Lancez-vous.

Dans notre prochain article, nous repousserons encore plus loin les limites en explorant le **Niveau 3: L'agent autonome**, où l'IA passe de votre subordonné direct à un membre de votre équipe entièrement indépendant, mais supervisé.

Quelles ont été vos expériences avec les agents IA guidés dans votre travail? J'adorerais lire vos histoires–succès comme frustrations–dans les commentaires ci-dessous.

[**La Suite**](http://localhost:3000/articles/22-autonomous-ai-agents/fr)

---

1. [**Les Quatre Niveaux de l'IA : Comment Surfer la Vague et Amplifier Votre Potentiel**](https://jterrazz.com/articles/20-the-four-levels-of-ai/fr) *Un cadre pratique pour intégrer l'IA dans n'importe quel domaine, de l'assistant à l'intelligence programmable, vous permettant de surcharger votre travail et votre créativité.*
2. [**L'IA en Développement, Niveau 2 : De Codeur à Chef d'Orchestre**](https://jterrazz.com/articles/21-guided-ai-for-developers/fr) *Un guide pour les développeurs pour diriger l'IA en tant qu'agent guidé, transformant le codage en orchestration de haut niveau avec des outils comme Cursor et le développement piloté par l'intention.*
3. [**L'IA en Développement, Niveau 3 : L'Ascension de l'Agent Autonome**](https://jterrazz.com/articles/22-autonomous-ai-agents/fr) *Une exploration de la manière dont les développeurs peuvent déléguer des flux de travail entiers à des agents IA autonomes, en exploitant des protocoles centrés sur le modèle et des sandboxes pour des résultats sécurisés et évolutifs.*
4. [**L'IA en Développement, Niveau 4 : Programmer l'Intelligence Elle-Même**](https://jterrazz.com/articles/23-programming-intelligence/fr) *Une plongée en profondeur dans la conception de systèmes intelligents qui mélangent du code déterministe avec un raisonnement IA créatif, permettant aux développeurs d'architecturer des solutions auto-optimisantes.*
