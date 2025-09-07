![](./assets/thumbnail.jpg)

# Utiliser l'IA: Orchestrer l'implémentation

La véritable révolution pour les développeurs n'est pas une IA qui se contente de compléter du code. C'est un changement de posture radical: nous passons de simples exécutants à metteurs en scène techniques d'une IA. C'est la réalité de **l'agent guidé**.

À ce stade, vous n'utilisez plus seulement un outil, vous *dirigez* un agent. Vous devenez le chef d'orchestre, le réalisateur. Le changement fondamental est de passer de celui qui fait à celui qui supervise la réalisation.

Pour un développeur, c'est un changement de paradigme. Je formule une intention—"Construis-moi ce point d'accès d'API à partir du cahier des charges"—et l'IA s'occupe de l'exécution, pilotée par mon expertise. Ma charge mentale est désormais consacrée à l'architecture globale et à la stratégie produit, et non plus à la recherche d'un point-virgule manquant.

Analysons l'état d'esprit et le processus qui façonnent cette nouvelle réalité.

***

![](assets/conductor.jpg)

## **La posture: de l'exécutant au metteur en scène**

Le changement le plus profond n'est pas sur votre écran, mais dans votre tête. Le nouveau mantra est simple: **j'oriente, je guide, je valide. Je n'exécute pas.**

J'aime penser à mon agent IA comme à un développeur junior incroyablement rapide: brillant, mais qui a besoin d'instructions claires. Un bon "prompt" n'est pas une simple commande; c'est un véritable brief, riche en contexte, comme celui que l'on donnerait à un coéquipier.

La puissance de cette approche, c'est que la friction entre une idée et un code fonctionnel disparaît presque. Le temps perdu sur le code répétitif, la recherche de syntaxe ou les erreurs de frappe s'évapore, libérant votre esprit pour opérer à un niveau d'abstraction supérieur. Vous commencez à penser davantage à la pureté de l'architecture, à l'élégance de l'expérience utilisateur et au *sens* derrière le code.

Le piège, bien sûr, est la paresse. Ne vous contentez pas de lancer des instructions vagues en espérant un miracle. Votre maîtrise de la logique reste essentielle pour fournir un retour pertinent. Un grand réalisateur n'a pas besoin de savoir jouer de chaque instrument, mais il a intérêt à savoir précisément quelle mélodie il veut entendre. En passant moins de temps à écrire et plus de temps à superviser, votre attention se déplace naturellement vers ce qui compte vraiment: une logique claire, des tests robustes et une conception simple et élégante.

***

![](assets/editor.jpg)

## **Le processus: le développement piloté par l'intention**

Assez de théorie, passons à la pratique. Pour moi, un éditeur comme **Cursor**—qui est essentiellement un VS Code dopé à l'IA—est l'outil ultime pour piloter un agent. Il fonctionne en indexant l'intégralité de votre base de code, ce qui donne à l'IA le même contexte métier qu'un collaborateur humain.

Cela donne naissance à un nouveau processus de développement que j'appelle le **Développement Piloté par l'Intention (DPI)**. L'idée est de partir non plus d'un test technique, mais d'une intention métier de haut niveau.

Voici comment ça se passe. Imaginons que je veuille créer une nouvelle fonctionnalité: un point d'accès d'API pour l'inscription à une newsletter.

**Étape 1: Énoncer l'intention**
Je commence par créer un nouveau fichier de test, `subscribe.intent.test.ts`. J'y écris un unique test d'intégration qui décrit le résultat métier que je vise:

*"Lorsqu'un utilisateur envoie une requête POST sur `/api/subscribe` avec un e-mail valide, l'API doit retourner un statut 200 avec `{ success: true }`, et la base de données doit contenir l'e-mail du nouvel abonné."*

Ce test échouera, bien sûr. Rien n'a encore été construit.

**Étape 2: Déléguer à l'agent**
C'est le moment clé. Au lieu d'ouvrir un fichier vide et de commencer à coder, je dis simplement à l'agent IA: **"Fais en sorte que ce test passe."**

C'est là qu'en tant que metteur en scène, vous choisissez vos acteurs. Pour cette première étape d'architecture, je demande à l'éditeur d'utiliser un modèle "architecte senior"—une IA puissante et capable de réflexions complexes sur des systèmes distribués.

**Étape 3: Guider et valider**
L'IA se met au travail. Elle me propose un plan d'action:
1. Créer une migration de base de données pour la table `subscribers`.
2. Ajouter une route pour `POST /api/subscribe`.
3. Créer un contrôleur pour gérer la logique de la requête.
4. Implémenter un service pour valider l'e-mail et l'enregistrer en base de données.

Je relis son plan, je suggère une modification ("En fait, mettons la logique de validation dans une fonction utilitaire séparée"), puis je donne mon accord. L'agent génère le code pour chaque partie, et je valide chaque `diff` d'un simple clic. Pour la génération de code plus simple, je peux même demander à l'éditeur de basculer sur un modèle plus rapide et moins coûteux pour optimiser les coûts.

Tout le processus est une conversation. Je n'écris pas de code; je dirige la construction d'une fonctionnalité à la vitesse de la pensée. L'agent gère l'exécution fastidieuse, tandis que je me concentre sur la qualité, la logique et la solidité de l'architecture.

Finalement, l'IA relance le test. Cette fois, il est au vert.

***

![](assets/pyramid.jpg)

## **Le résultat: une nouvelle façon de créer**

En adoptant cette posture de chef d'orchestre, vous devenez plus qu'un simple développeur. Vous devenez un architecte assisté par l'IA. Vous vous déchargez du fardeau cognitif de l'exécution manuelle, libérant votre esprit pour vous concentrer sur ce que l'humain fait de mieux: l'innovation, la créativité et la vision stratégique.

Produire un code de haute qualité, testé et documenté devient la norme, et non plus un luxe. Le résultat est un gain de productivité massif, un code plus propre et plus facile à maintenir, et honnêtement, cela rend le développement à nouveau passionnant.

## **Conclusion: prêt à déléguer?**

L'agent guidé change la donne, et il est déjà là. Savoir formuler une instruction claire, riche en contexte et en intention, est l'une des compétences les plus précieuses pour un développeur aujourd'hui.

Ce nouveau rôle n'est qu'une étape dans le voyage de l'intégration de l'IA, qui commence avec de simples [assistants IA](https://jterrazz.com/articles/20-the-four-levels-of-ai/fr) et mène à des [agents entièrement autonomes](https://jterrazz.com/articles/22-autonomous-ai-agents/fr). Pour les développeurs, l'impact de ce niveau est concret et immédiat. La prochaine étape est d'explorer comment nous pouvons déléguer des processus entiers, et plus seulement des tâches isolées.

---

1. [Utiliser l'IA: Un cadre pratique en quatre niveaux](https://jterrazz.com/articles/20-the-four-levels-of-ai/fr) *Un cadre pratique pour intégrer l'IA dans n'importe quel domaine, de l'assistant à l'intelligence programmable, vous permettant de surcharger votre travail et votre créativité.*
2. [**Utiliser l'IA: Orchestrer l'implémentation**](https://jterrazz.com/articles/21-guided-ai-for-developers/fr) *Un guide pour les développeurs pour diriger l'IA en tant qu'agent guidé, transformant le codage en orchestration de haut niveau avec des outils comme Cursor et le développement piloté par l'intention.*
3. [Utiliser l'IA: Déléguer les processus](https://jterrazz.com/articles/22-autonomous-ai-agents/fr) *Une exploration de la manière dont les développeurs peuvent déléguer des flux de travail entiers à des agents IA autonomes, en exploitant des protocoles centrés sur le modèle et des sandboxes pour des résultats sécurisés et évolutifs.*
4. [Utiliser l'IA: Façonner l'intelligence](https://jterrazz.com/articles/23-programming-intelligence/fr) *Une plongée en profondeur dans la conception de systèmes intelligents qui mélangent du code déterministe avec un raisonnement IA créatif, permettant aux développeurs d'architecturer des solutions auto-optimisantes.*
