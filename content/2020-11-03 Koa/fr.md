![](assets/thumbnail.jpg)

# Construire mon serveur web de référence avec TypeScript et Koa

Vous avez déjà ressenti cette envie de construire quelque chose de zéro ? C'était mon cas. Je voulais créer mon propre serveur web, quelque chose de solide et puissant, sans les boîtes noires des gros frameworks. Voici comment j'ai procédé, et comment vous pouvez le faire aussi. Nous allons construire un serveur HTTP, un moteur de gestion de requêtes épuré, en utilisant deux de mes outils préférés : TypeScript et Koa. C'est parti ! 🚀

## Mes choix technologiques : TypeScript et Koa

Avant de commencer à coder, parlons de pourquoi j'ai choisi cette stack particulière.

### TypeScript : l'ange gardien de mon code

Pour moi, TypeScript n'est pas un simple "plus" ; c'est fondamental. Il transforme le JavaScript classique en un langage plus robuste et plus sûr. Voici pourquoi c'est un game-changer :

1. **Sécurité à toute épreuve** : J'aime livrer du code qui fonctionne. La vérification de types statique de TypeScript est comme un contrôle pré-vol qui détecte les erreurs bêtes et les bugs potentiels avant même que le code ne s'exécute.
2. **Clarté en collaboration** : Sa nature structurée rend le code incroyablement lisible. Quand vous travaillez en équipe, ou même quand vous revisitez votre propre code des mois plus tard, c'est comme avoir laissé une carte claire et facile à lire.
3. **IDEs survitaminés** : L'autocomplétion et la vérification d'erreurs en temps réel que vous obtenez dans les IDEs modernes ressemblent à un super-pouvoir. C'est comme avoir un copilote qui vous guide constamment dans la bonne direction.

### Koa : le minimaliste puissant

Koa, créé par la même équipe qu'Express, est mon choix pour sa simplicité délibérée. Il est petit mais costaud.

1. **Logique simple et propre** : Le design de Koa est brillamment simple. Cela rend incroyablement facile de suivre la logique du serveur et de structurer votre application d'une manière qui a du sens.
2. **Conçu pour le JavaScript moderne** : Il est construit autour de `async/await`, ce qui signifie fini l'enfer des callbacks. Le code est plus propre et bien plus intuitif.
3. **Obligé d'apprendre (dans le bon sens !)** : Koa n'embarque pas une tonne de fonctionnalités par défaut. Ça peut sembler négatif, mais j'y vois un énorme avantage. Cela vous force à vraiment comprendre les rouages de Node.js et ce qu'il faut pour construire un serveur web.

Prêt à construire quelque chose de cool ? Posons les fondations. 💪

## Lancer le projet

D'abord, vous aurez besoin de Node.js et npm installés sur votre machine.

1. **Initialisez votre projet** :
   Je commence toujours par `npm init -y`. Cette commande crée rapidement un fichier `package.json`. Voyez-le comme le passeport de votre projet : il contient toutes les informations vitales et les dépendances.

2. **Installez les essentiels** :
   Avec le projet initialisé, il est temps d'installer nos outils de base. Nous avons besoin des packages eux-mêmes et de leurs définitions de types TypeScript correspondantes.

   ```sh
   # Installer TypeScript et son compagnon d'exécution
   npm install --save typescript ts-node
   # Installer nos outils de serveur web
   npm install --save koa @types/koa koa-router @types/koa-router
   ```

   Ces packages `@types/` sont cruciaux. Ce sont eux qui enseignent à TypeScript comment comprendre la structure de ces bibliothèques JavaScript, permettant cette vérification de types si précieuse.

## Faire communiquer TypeScript et Node.js

Node.js ne parle pas TypeScript nativement. Pour combler ce fossé, j'utilise un package bien pratique appelé `ts-node`. C'est une bouée de sauvetage qui transpile et exécute notre code TypeScript en une seule opération.

Faisons un petit "Hello World" pour voir ça en action. Créez un fichier `src/server.ts` :

```typescript
console.log('Hello world');
```

Ensuite, configurons un script de démarrage dans notre `package.json` :

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

Lancez `npm start` dans votre terminal. Si vous voyez "Hello World", vous avez réussi à exécuter votre premier fichier TypeScript avec Node.js. Super ! 🎉

**Petite astuce** : Je crée toujours un fichier `.gitignore` immédiatement pour garder mon historique git propre.

```sh
# Dépendances
/node_modules

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Divers
.DS_Store
.env*
```

## Gérer les requêtes avec Koa

Maintenant, la partie fun. Nous allons mettre Koa au travail pour gérer le trafic de notre serveur, diriger les requêtes entrantes vers la bonne logique et renvoyer les réponses.

Voici un serveur basique qui répond à une requête sur l'URL racine (`/`) :

```typescript
import Koa, { Middleware } from 'koa';
import Router from 'koa-router';

const PORT = 8080;
const app = new Koa();
const router = new Router();

// Voici la logique de notre route
const helloWorldController: Middleware = async (ctx) => {
    console.log('Une requête est arrivée !');
    ctx.body = {
        message: 'Hello World!',
    };
};

router.get('/', helloWorldController);

// On dit à notre app d'utiliser le router
app.use(router.routes()).use(router.allowedMethods());

// Et enfin, on démarre le serveur
app.listen(PORT, () => {
    console.log(`🚀 Le serveur tourne sur le port ${PORT}`);
});
```

**Point clé** : Koa est minimaliste par design. Pour des choses comme le routage (`koa-router`) ou le parsing du corps des requêtes, vous importez des packages supplémentaires. J'adore ça car cela me donne un contrôle total et une compréhension plus profonde de comment tout s'assemble.

### La puissance des middlewares

L'une de mes choses préférées chez Koa, c'est `app.use()`. Cela vous permet d'enchaîner des fonctions appelées "middlewares".

Je vois les middlewares comme une série de points de contrôle. Une requête arrive et traverse chaque middleware. Chacun peut inspecter ou même modifier l'objet "context" (`ctx`) avant de le passer à l'étape suivante, qui est finalement votre contrôleur.

```typescript
// Un middleware simple qui ajoute de l'argent au contexte
function addMoneyMiddleware(ctx, next) {
  ctx.money = (ctx.money || 0) + 1;
  return next(); // C'est crucial ! Ça passe le contrôle au middleware suivant.
}

// L'utiliser pour TOUTES les routes
app.use(addMoneyMiddleware); // ctx.money vaut maintenant 1
app.use(addMoneyMiddleware); // ctx.money vaut maintenant 2

// L'utiliser seulement pour un groupe de routes spécifique
router
  .use('/rich', addMoneyMiddleware) // ctx.money vaut maintenant 3 pour cette route
  .get('/rich', (ctx) => {
    ctx.body = `Vous avez ${ctx.money} euros.`; // Retourne "Vous avez 3 euros."
  });

router.get('/not-rich', (ctx) => {
  ctx.body = `Vous avez ${ctx.money} euros.`; // Retourne "Vous avez 2 euros."
});
```

Ce pattern est incroyablement puissant pour séparer les préoccupations comme l'authentification, le logging, et plus encore.

## Allons plus loin : l'objet context de Koa

L'objet context de Koa, `ctx`, est un chef-d'œuvre de design d'API. Il regroupe les objets `request` et `response` de Node en un seul package pratique, simplifiant énormément la vie.

Voici un aperçu de ce que vous pouvez faire avec `ctx` :

```typescript
import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
    // Accéder aux données de la requête
    console.log(ctx.request.url);      // L'URL demandée
    console.log(ctx.request.query);    // La query string parsée
    console.log(ctx.request.body);     // Nécessite un middleware body-parser

    // Définir la réponse
    ctx.body = 'Hello, World!';        // Le corps de la réponse
    ctx.status = 200;                  // Le code de statut HTTP
    ctx.type = 'text/plain';           // L'en-tête Content-Type

    // Partager des données entre middlewares
    ctx.state.user = { id: 1, name: 'John Doe' };
});

app.listen(3000);
```

L'objet `ctx` est votre centre de commandement pour gérer une requête du début à la fin.

## Structurer une application réelle

À mesure qu'une application grandit, la structure devient primordiale. Je suis un fervent défenseur de l'architecture en couches pour garder le code maintenable et facile à tester.

1. **Couche Router** : Définit les endpoints de l'API avec `koa-router`.
2. **Couche Controller** : Contient la logique centrale de chaque route.
3. **Couche Service** : Gère la logique métier complexe ou les interactions avec la base de données.
4. **Couche Model** : Définit la forme de vos données et les schémas de base de données.

Voici un aperçu de ce à quoi cela ressemble :

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
    // Suppose qu'un middleware body parser est utilisé
    const userData = ctx.request.body;
    ctx.status = 201; // Created
    ctx.body = await userService.createUser(userData);
};

// --- services/userService.ts ---
import { User } from '../models/User';

export const getAllUsers = async () => {
    // Imaginons que c'est un appel à la base de données
    return User.findAll();
};

export const createUser = async (userData: any) => {
    // Imaginons que cela sauvegarde en base de données
    return User.create(userData);
};
```

Cette séparation garde chaque partie de l'application concentrée sur une seule tâche.

## N'oubliez pas la gestion d'erreurs et le logging

Un serveur de production n'est pas complet sans une gestion d'erreurs solide et du logging. Le pattern middleware de Koa rend cela élégant.

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
        // Logger aussi l'erreur dans la console
        ctx.app.emit('error', err, ctx);
    }
});

// Middleware de logging pour les requêtes
app.use(logger());

// Écouteur central d'erreurs
app.on('error', (err, ctx) => {
    console.error('Erreur Serveur:', err.message, { url: ctx.url });
});

// Vos routes et autres middlewares iraient ici…

app.listen(3000);
```

Cette configuration garantit qu'aucune erreur ne passe entre les mailles du filet et que j'ai un log clair de ce qui se passe sur le serveur.

## Pour conclure

Et voilà l'essentiel ! Nous avons voyagé d'un dossier vide à un serveur fonctionnel, en connectant TypeScript avec Node et en construisant une base solide avec Koa. Ce n'est bien sûr qu'un point de départ. Le vrai plaisir commence quand vous prenez ces concepts et développez vos propres idées.

Continuez à apprendre, continuez à construire, et créez quelque chose d'incroyable. 🌟

Bon code
