![](assets/thumbnail.jpg)

# Serveur web de référence avec TypeScript et Koa

L'envie de construire from scratch, sans les boîtes noires des gros frameworks. Un serveur HTTP épuré, avec deux outils que j'adore : TypeScript et Koa. C'est parti ! 🚀

## Pourquoi cette stack ?

### TypeScript : le garde-fou

Pas un "plus", c'est fondamental. JavaScript devient robuste et sûr.

1. **Typage statique** : détecte les erreurs avant l'exécution. Un contrôle pré-vol.
2. **Lisibilité** : code structuré, facile à reprendre des mois plus tard.
3. **IDEs boostés** : autocomplétion, erreurs en temps réel. Un copilote permanent.

### Koa : minimaliste mais costaud

Créé par l'équipe d'Express, mais volontairement simple.

1. **Design épuré** : logique facile à suivre, structure claire.
2. **JavaScript moderne** : `async/await` natif. Fini le callback hell.
3. **Apprentissage forcé** : peu de fonctionnalités embarquées = vous comprenez vraiment ce qui se passe.

Prêt à construire ? 💪

## Démarrage

Node.js et npm requis.

1. **Initialisation** : `npm init -y` crée le `package.json`.

2. **Installation** :

   ```sh
   # TypeScript et exécution
   npm install --save typescript ts-node
   # Serveur web
   npm install --save koa @types/koa koa-router @types/koa-router
   ```

   Les packages `@types/` permettent à TypeScript de comprendre les libs JavaScript.

## TypeScript + Node.js

Node.js ne parle pas TypeScript nativement. `ts-node` fait le pont : transpile et exécute en une seule opération.

Test rapide — créez `src/server.ts` :

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

`npm start` → "Hello World" = ça marche ! 🎉

N'oubliez pas le `.gitignore` :

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

## Gérer les requêtes

La partie fun : Koa gère le trafic, route les requêtes, renvoie les réponses.

Serveur basique répondant sur `/` :

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

**Point clé** : Koa est minimaliste. Routage, body parsing... tout s'importe séparément. Contrôle total.

### Les middlewares

`app.use()` permet d'enchaîner des fonctions. Une requête traverse chaque middleware, qui peut inspecter ou modifier le contexte (`ctx`) avant de passer au suivant.

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

Pattern puissant pour séparer auth, logging, etc.

## L'objet context

`ctx` regroupe `request` et `response` de Node. API élégante :

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

`ctx` = centre de commandement de la requête.

## Structure d'une vraie app

L'architecture en couches garde le code maintenable et testable :

1. **Router** : endpoints de l'API.
2. **Controller** : logique de chaque route.
3. **Service** : logique métier, accès BDD.
4. **Model** : structure des données.

Exemple :

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

Chaque partie fait une seule chose.

## Gestion d'erreurs et logging

Indispensable en production. Le pattern middleware rend ça élégant :

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

Aucune erreur ne passe, logs clairs.

## En résumé

D'un dossier vide à un serveur fonctionnel. TypeScript + Koa = base solide. C'est un point de départ — le vrai plaisir commence quand vous développez vos propres idées.

Bon code ! 🚀
