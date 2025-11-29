![](assets/thumbnail.jpg)

# Construire mon serveur web de référence avec TypeScript et Koa

Vous avez déjà eu cette envie de construire quelque chose de zéro ? C'était mon cas. Je voulais créer mon propre serveur web, quelque chose de solide et puissant, sans les boîtes noires des gros frameworks. Voici comment j'ai fait, et comment vous le pouvez aussi. Nous allons construire un serveur HTTP, un moteur de traitement de requêtes léger, en utilisant deux de mes outils préférés : TypeScript et Koa. C'est parti. 🚀

## Mes choix techniques : TypeScript et Koa

Avant de commencer à pisser du code, parlons de pourquoi j'ai choisi cette stack particulière.

### TypeScript : l'ange gardien de mon code

Pour moi, TypeScript n'est pas juste un "plus" ; c'est fondamental. Il transforme le JavaScript vanilla en un langage plus robuste et plus sûr. Voici pourquoi ça change la donne :

1. **Sécurité à toute épreuve** : J'adore livrer du code qui marche. La vérification de type statique de TypeScript est comme une vérification pré-vol qui attrape les erreurs bêtes et les bugs potentiels avant même que le code ne tourne.
2. **Clarté dans la collaboration** : Sa nature structurée rend le code incroyablement lisible. Quand vous êtes dans une équipe, ou même juste quand vous revisitez votre propre code des mois plus tard, c'est comme laisser une carte claire et facile à lire.
3. **IDE superchargés** : L'autocomplétion et la vérification d'erreur en temps réel que vous obtenez dans les IDE modernes ressemblent à un super-pouvoir. C'est comme avoir un copilote qui vous pousse constamment dans la bonne direction.

### Koa : la puissance minimaliste

Koa, fait par la même équipe derrière Express, est mon choix pour sa simplicité délibérée. C'est petit mais costaud.

1. **Logique simple et propre** : Le design de Koa est brillamment simple. Cela rend incroyablement facile de suivre la logique du serveur et de structurer votre application d'une manière qui fait sens.
2. **Construit pour le JavaScript moderne** : Il est construit autour de `async/await`, ce qui signifie la fin de l'enfer des callbacks. Le code est plus propre et bien plus intuitif.
3. **Forcé d'apprendre (dans le bon sens !)** : Koa n'embarque pas une tonne de fonctionnalités par défaut. Cela peut sembler être un point négatif, mais je le vois comme un énorme plus. Cela vous force à vraiment comprendre les pièces mobiles centrales de Node.js et ce qu'il faut pour construire un serveur web.

Prêt à construire quelque chose de cool ? Posons les fondations. 💪

## Faire décoller le projet

D'abord, vous aurez besoin de Node.js et npm prêts à l'emploi sur votre machine.

1. **Initialisez votre projet** :
   Je commence toujours par `npm init -y`. Cette commande échafaude rapidement un fichier `package.json`. Voyez-le comme le passeport de votre projet, il contient toutes les statistiques vitales et les infos de dépendances.

2. **Installez les essentiels** :
   Avec le projet initialisé, il est temps de récupérer nos outils principaux. Nous avons besoin des paquets eux-mêmes et de leurs définitions de type TypeScript correspondantes.

   ```sh
   # Installer TypeScript et son compagnon d'exécution
   npm install --save typescript ts-node
   # Installer nos outils de serveur web
   npm install --save koa @types/koa koa-router @types/koa-router
   ```

   Ces paquets `@types/` sont cruciaux. C'est ce qui apprend à TypeScript comment comprendre la structure de ces bibliothèques JavaScript, permettant cette douce, douce vérification de type.

## Faire parler TypeScript et Node.js

Node.js ne parle pas TypeScript nativement. Pour combler ce fossé, j'utilise un paquet pratique appelé `ts-node`. C'est un sauveur qui transpile et exécute notre code TypeScript d'un coup.

Faisons un rapide "Hello World" pour le voir en action. Créez un fichier à `src/server.ts` :

```typescript
console.log('Hello world');
```

Ensuite, câblons un script de démarrage dans notre `package.json` :

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

Lancez `npm start` dans votre terminal. Si vous voyez "Hello World", vous avez exécuté avec succès votre premier fichier TypeScript avec Node.js. Génial ! 🎉

**Petite astuce** : Je crée toujours un fichier `.gitignore` immédiatement pour garder mon historique git propre.

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

## Gérer les requêtes avec Koa

Maintenant, la partie amusante. Nous allons mettre Koa au travail pour gérer le trafic de notre serveur, dirigeant les requêtes entrantes vers la bonne logique et renvoyant des réponses.

Voici un serveur basique qui répond à une requête à l'URL racine (`/`) :

```typescript
import Koa, { Middleware } from 'koa';
import Router from 'koa-router';

const PORT = 8080;
const app = new Koa();
const router = new Router();

// C'est la logique pour notre route
const helloWorldController: Middleware = async (ctx) => {
  console.log('A request came in!');
  ctx.body = {
    message: 'Hello World!',
  };
};

router.get('/', helloWorldController);

// Nous disons à notre app d'utiliser le routeur
app.use(router.routes()).use(router.allowedMethods());

// Et enfin, nous démarrons le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
```

**Un point clé** : Koa est minimaliste par design. Pour des choses comme le routage (`koa-router`) ou le parsing du corps des requêtes, vous importez des paquets supplémentaires. J'adore ça car cela me donne un contrôle total et une compréhension plus profonde de comment tout s'assemble.

### La puissance du middleware

Une de mes choses préférées à propos de Koa est `app.use()`. Cela vous permet de chaîner des fonctions appelées "middleware".

Je vois les middlewares comme une série de points de contrôle. Une requête arrive et traverse chaque morceau de middleware. Chacun peut inspecter ou même modifier l'objet "contexte" (`ctx`) avant de le passer à l'arrêt suivant, qui est ultimement votre contrôleur.

```typescript
// Un middleware simple qui ajoute de l'argent au contexte
function addMoneyMiddleware(ctx, next) {
  ctx.money = (ctx.money || 0) + 1;
  return next(); // C'est crucial ! Cela passe le contrôle au middleware suivant.
}

// L'utiliser pour TOUTES les routes
app.use(addMoneyMiddleware); // ctx.money vaut maintenant 1
app.use(addMoneyMiddleware); // ctx.money vaut maintenant 2

// L'utiliser seulement pour un groupe de routes spécifique
router
  .use('/rich', addMoneyMiddleware) // ctx.money vaut maintenant 3 pour cette route
  .get('/rich', (ctx) => {
    ctx.body = `You have ${ctx.money} dollars.`; // Renvoie "You have 3 dollars."
  });

router.get('/not-rich', (ctx) => {
  ctx.body = `You have ${ctx.money} dollars.`; // Renvoie "You have 2 dollars."
});
```

Ce pattern est incroyablement puissant pour séparer les responsabilités comme l'authentification, le logging, et plus encore.

## Allons plus loin : l'objet context Koa

L'objet contexte de Koa, `ctx`, est un chef-d'œuvre de design d'API. Il regroupe les objets Node `request` et `response` en un paquet pratique, rendant la vie tellement plus facile.

Voici un aperçu de ce que vous pouvez faire avec `ctx` :

```typescript
import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
  // Accéder aux données de la requête
  console.log(ctx.request.url); // L'URL demandée
  console.log(ctx.request.query); // Query string parsée
  console.log(ctx.request.body); // Nécessite un middleware body-parser

  // Définir la réponse
  ctx.body = 'Hello, World!'; // Le corps de la réponse
  ctx.status = 200; // Code de statut HTTP
  ctx.type = 'text/plain'; // Header Content-Type

  // Partager des données entre middlewares
  ctx.state.user = { id: 1, name: 'John Doe' };
});

app.listen(3000);
```

L'objet `ctx` est votre centre de commande pour gérer une requête du début à la fin.

## Structurer une application du monde réel

À mesure qu'une application grandit, la structure devient primordiale. Je suis un fervent partisan d'une architecture en couches pour garder le code maintenable et facile à tester.

1. **Couche Routeur (Router Layer)** : Définit les endpoints de l'API avec `koa-router`.
2. **Couche Contrôleur (Controller Layer)** : Contient la logique centrale pour chaque route.
3. **Couche Service (Service Layer)** : Gère la logique métier complexe ou les interactions base de données.
4. **Couche Modèle (Model Layer)** : Définit la forme de vos données et les schémas de base de données.

Voici une esquisse de ce à quoi ça ressemble :

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
  // Imaginez que c'est un appel base de données
  return User.findAll();
};

export const createUser = async (userData: any) => {
  // Imaginez que cela sauvegarde dans une base de données
  return User.create(userData);
};
```

Cette séparation garde chaque partie de l'application concentrée sur un seul travail.

## N'oubliez pas la gestion d'erreurs et les logs

Un serveur de production n'est pas complet sans une gestion d'erreurs solide et des logs. Le pattern de middleware de Koa rend cela élégant.

```typescript
import Koa from 'koa';
import logger from 'koa-logger';

const app = new Koa();

// Mon middleware de gestion d'erreurs générique. Je le place tout en haut.
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message,
      // Je montre la stack seulement en développement
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    };
    // Logguer aussi l'erreur dans la console
    ctx.app.emit('error', err, ctx);
  }
});

// Middleware de logging pour les requêtes
app.use(logger());

// Écouteur d'erreur central
app.on('error', (err, ctx) => {
  console.error('Server Error:', err.message, { url: ctx.url });
});

// Vos routes et autres middlewares iraient ici...

app.listen(3000);
```

Cette configuration assure qu'aucune erreur ne passe à travers les mailles du filet et que j'ai un log clair de ce qui se passe sur le serveur.

## Pour conclure

Et voilà l'essentiel ! Nous avons voyagé d'un dossier vide à un serveur fonctionnel, câblant TypeScript avec Node et construisant une fondation solide avec Koa. C'est juste le point de départ, bien sûr. Le vrai fun commence quand vous prenez ces concepts et construisez vos propres idées.

Continuez d'apprendre, continuez de construire, et créez quelque chose d'incroyable. 🌟

Bon code !
