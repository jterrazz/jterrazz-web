![](assets/thumbnail.jpg)

# Construire Mon Serveur Web De Référence Avec TypeScript Et Koa

Avez-vous déjà ressenti cette envie irrésistible de construire quelque chose de A à Z? C'était mon cas. Je voulais créer mon propre serveur web, une base solide et puissante, loin des boîtes noires des frameworks plus imposants. Voici comment j'ai procédé, et comment vous pouvez le faire à votre tour. Ensemble, nous allons bâtir une machine à traiter des requêtes HTTP en nous appuyant sur deux de mes outils favoris: TypeScript et Koa. Plongeons dans le vif du sujet. 🚀

## Mes Choix Technologiques: TypeScript Et Koa

Avant de commencer à coder, voyons rapidement pourquoi j'ai jeté mon dévolu sur cette combinaison technologique.

### TypeScript: Le Gardien De Mon Code

Pour moi, TypeScript n'est pas une simple option de confort, c'est un pilier fondamental. Il transforme le JavaScript standard en un langage robuste et plus sûr. Voici pourquoi il change la donne:

1. **Une sécurité à toute épreuve**: J'aime livrer du code qui fonctionne. Le typage statique de TypeScript agit comme une vérification pré-décollage qui intercepte les erreurs triviales et les bugs potentiels avant même que le code ne soit exécuté.
2. **La clarté, un atout pour la collaboration**: Sa nature structurée rend le code incroyablement lisible. Que ce soit au sein d'une équipe ou simplement en relisant votre propre code des mois plus tard, c'est comme si vous aviez laissé une carte claire et facile à déchiffrer.
3. **Des IDEs surpuissants**: L'autocomplétion et la détection d'erreurs en temps réel offertes par les IDEs modernes s'apparentent à un super-pouvoir. C'est comme avoir un copilote qui vous guide constamment dans la bonne direction.

### Koa: la Puissance Minimaliste

Développé par la même équipe que celle derrière Express, Koa est mon choix de prédilection pour sa simplicité délibérée. Il est petit, mais redoutablement efficace.

1. **Une logique simple et épurée**: La conception de Koa est d'une simplicité brillante. Il est ainsi très facile de suivre la logique du serveur et de structurer votre application d'une manière qui tombe sous le sens.
2. **Conçu pour le JavaScript moderne**: Il est bâti autour de `async/await`, ce qui signifie la fin du *callback hell*. Le code est plus propre et beaucoup plus intuitif.
3. **Un apprentissage forcé (mais bénéfique!)**: Koa n'intègre pas une multitude de fonctionnalités par défaut. Cela peut sembler être un inconvénient, mais je le vois comme un avantage majeur. Cela vous force à réellement comprendre les rouages essentiels de Node.js et les mécanismes nécessaires à la construction d'un serveur web.

Prêt à construire quelque chose de remarquable? Posons les fondations. 💪

## Lancer Le Projet

Pour commencer, assurez-vous que Node.js et npm sont installés et prêts à l'emploi sur votre machine.

1. **Initialisez votre projet**:
		Je commence toujours par `npm init -y`. Cette commande génère rapidement un fichier `package.json`. Considérez-le comme la carte d'identité de votre projet: il contient toutes ses informations vitales et la liste de ses dépendances.

2. **Installez les dépendances essentielles**:
		Une fois le projet initialisé, il est temps d'intégrer nos outils principaux. Nous avons besoin des paquets eux-mêmes, ainsi que de leurs définitions de types TypeScript correspondantes.

```sh
# Installation de Typescript et de son environnement d'exécution
npm install --save typescript ts-node

# Installation de nos outils pour le serveur web
npm install --save koa @types/koa koa-router @types/koa-router
```

Les paquets `@types/` sont cruciaux. Ce sont eux qui apprennent à TypeScript à comprendre la structure de ces bibliothèques JavaScript, permettant ainsi ce fameux typage statique si précieux.

## Faire Dialoguer TypeScript Et Node.js

Node.js ne comprend pas nativement TypeScript. Pour combler cette lacune, j'utilise un paquet très pratique nommé `ts-node`. C'est une véritable bouée de sauvetage qui transpile et exécute notre code TypeScript en une seule étape.

Faisons un rapide " Hello World " pour le voir en action. Créez un fichier `src/server.ts`:

```typescript
console.log('Hello world');
```

Ensuite, configurons un script de démarrage dans notre `package.json`:

```json
{
  "name": "the-app-name",
  "version": "1.0.0",
  "description": "",
  "main": "src/server.ts",
  "scripts": {
    "start": "ts-node src/server.ts"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@types/koa": "^2.11.6",
    "@types/koa-router": "^7.4.1",
    "koa": "^2.13.0",
    "koa-router": "^10.0.0",
    "ts-node": "^9.0.0",
    "typescript": "^4.0.5"
  }
}
```

Exécutez `npm start` dans votre terminal. Si vous voyez " Hello World ", vous avez réussi à lancer votre premier fichier TypeScript avec Node.js. Fantastique! 🎉

**Petite astuce**: Je crée toujours immédiatement un fichier `.gitignore` pour garder mon historique Git propre.

```sh
# Dependencies
/node_modules

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
.DS_Store
.env*
```

## Gérer Les Requêtes Avec Koa

Passons maintenant à la partie la plus amusante. Confions à Koa la gestion du trafic de notre serveur. C'est lui qui dirigera les requêtes entrantes vers la bonne logique et qui renverra les réponses.

Voici un serveur de base qui répond à une requête sur l'URL racine (`/`):

```typescript
import Koa, { Middleware } from 'koa';
import Router from 'koa-router';

const PORT = 8080;
const app = new Koa();
const router = new Router();

// Voici la logique de notre route
const helloWorldController: Middleware = async (ctx) => {
    console.log('A request came in!');
    ctx.body = {
        message: 'Hello World!',
    };
};

router.get('/', helloWorldController);

// On indique à notre application d'utiliser le routeur
app.use(router.routes()).use(router.allowedMethods());

// Et enfin, on lance le serveur
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
```

**Un point essentiel**: Koa est minimaliste par conception. Pour des fonctionnalités comme le routage (`koa-router`) ou l'analyse du corps des requêtes, vous devez intégrer des paquets supplémentaires. J'adore cette approche, car elle me donne un contrôle total et une compréhension plus profonde de la manière dont chaque brique s'assemble.

### La Puissance Des Middlewares

L'une de mes fonctionnalités préférées dans Koa est `app.use()`. Elle permet d'enchaîner des fonctions appelées " middlewares ".

Je vois les middlewares comme une série de points de contrôle. Une requête arrive et traverse chaque middleware. Chacun peut inspecter, voire modifier, l'objet " contexte " (`ctx`) avant de le passer au point de contrôle suivant, qui est finalement votre contrôleur.

```typescript
// Un middleware simple qui ajoute de l'argent au contexte
function addMoneyMiddleware(ctx, next) {
  ctx.money = (ctx.money || 0) + 1;
  return next(); // C'est crucial ! Cela passe le contrôle au middleware suivant.
}

// Utilisation pour TOUTES les routes
app.use(addMoneyMiddleware); // ctx.money vaut maintenant 1
app.use(addMoneyMiddleware); // ctx.money vaut maintenant 2

// Utilisation uniquement pour un groupe de routes spécifique
router
  .use('/rich', addMoneyMiddleware) // ctx.money vaut maintenant 3 pour cette route
  .get('/rich', (ctx) => {
    ctx.body = `You have ${ctx.money} dollars.`; // Renvoie "You have 3 dollars."
  });

router.get('/not-rich', (ctx) => {
  ctx.body = `You have ${ctx.money} dollars.`; // Renvoie "You have 2 dollars."
});
```

Ce modèle est incroyablement puissant pour séparer les responsabilités, comme l'authentification, la journalisation, et bien plus encore.

## Allons plus Loin: L'objet Contexte De Koa

L'objet contexte de Koa, `ctx`, est un chef-d'œuvre de conception d'API. Il regroupe les objets `request` et `response` de Node en un seul ensemble pratique, nous simplifiant grandement la vie.

Voici un aperçu de ce que vous pouvez faire avec `ctx`:

```typescript
import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
    // Accéder aux données de la requête
    console.log(ctx.request.url);      // L'URL demandée
    console.log(ctx.request.query);    // Les paramètres de la query string, parsés
    console.log(ctx.request.body);     // Nécessite un middleware de body-parser

    // Définir la réponse
    ctx.body = 'Hello, World!';        // Le corps de la réponse
    ctx.status = 200;                  // Le code de statut HTTP
    ctx.type = 'text/plain';           // L'en-tête Content-Type

    // Partager des données entre les middlewares
    ctx.state.user = { id: 1, name: 'John Doe' };
});

app.listen(3000);
```

L'objet `ctx` est votre centre de commande pour gérer une requête du début à la fin.

## Structurer Une Application Pour Le Monde Réel

Quand une application commence à grandir, sa structure devient primordiale. Pour moi, une architecture en couches est la seule approche viable. Elle garantit un code maintenable et facile à tester.

1. **Couche Routeur**: Définit les points d'accès de l'API avec `koa-router`.
2. **Couche Contrôleur**: Contient la logique principale pour chaque route.
3. **Couche Service**: Gère la logique métier complexe ou les interactions avec la base de données.
4. **Couche Modèle**: Définit la structure de vos données et les schémas de base de données.

Voici une ébauche de ce à quoi cela ressemble:

```typescript
// --- router.ts ---
import Router from 'koa-router';
import { getUsers, createUser } from './controllers/userController';

const router = new Router();

router.get('/users', getUsers);
router.post('/users', createUser);

export default router;

// --- controllers/userController.ts ---
import { Context } from 'koa';
import * as userService from '../services/userService';

export const getUsers = async (ctx: Context) => {
    ctx.body = await userService.getAllUsers();
};

export const createUser = async (ctx: Context) => {
    // Suppose qu'un middleware body-parser est utilisé
    const userData = ctx.request.body;
    ctx.status = 201; // Created
    ctx.body = await userService.createUser(userData);
};

// --- services/userService.ts ---
import { User } from '../models/User';

export const getAllUsers = async () => {
    // Simulons un appel à la base de données
    return User.findAll();
};

export const createUser = async (userData: any) => {
    // Simulons un enregistrement dans la base de données
    return User.create(userData);
};
```

Cette séparation permet à chaque partie de l'application de se concentrer sur une seule tâche.

## N'oubliez Pas la Gestion Des Erreurs Et la Journalisation

Un serveur prêt pour la production ne serait pas complet sans une gestion des erreurs et une journalisation robustes. Le modèle de middleware de Koa rend cette tâche particulièrement élégante.

```typescript
import Koa from 'koa';
import logger from 'koa-logger';

const app = new Koa();

// Mon middleware générique de gestion d'erreurs. Je le place tout en haut.
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            message: err.message,
            // Je n'affiche la stack qu'en développement
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        };
        // J'enregistre aussi l'erreur dans la console
        ctx.app.emit('error', err, ctx);
    }
});

// Middleware de journalisation pour les requêtes
app.use(logger());

// Écouteur d'erreurs centralisé
app.on('error', (err, ctx) => {
    console.error('Server Error:', err.message, { url: ctx.url });
});

// Vos routes et autres middlewares viendraient ici…

app.listen(3000);
```

Cette configuration garantit qu'aucune erreur ne passe entre les mailles du filet et que je dispose d'un journal clair de tout ce qui se passe sur le serveur.

## Pour Conclure

Et voilà l'essentiel! Nous avons parcouru la mise en place d'un projet, fait collaborer TypeScript et Node, et construit un serveur avec Koa. Ce n'est qu'un point de départ. Le vrai plaisir commence lorsque vous vous lancez dans vos propres expérimentations et que vous donnez vie à vos idées.

Continuez d'apprendre, de construire, et créez quelque chose d'exceptionnel. 🌟

Happy coding
