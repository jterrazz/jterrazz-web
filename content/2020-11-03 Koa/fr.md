![](assets/thumbnail.jpg)

# Comment j'ai créé mon serveur web de référence avec TypeScript et Koa

Cette envie de tout construire de zéro, ça vous parle? C'est précisément le chemin que j'ai emprunté. Je voulais donner vie à mon propre serveur web, quelque chose de solide et de puissant, sans m'encombrer des boîtes noires des frameworks plus imposants. Voici comment je m'y suis pris, et comment vous pouvez faire de même. Ensemble, nous allons bâtir une véritable machine à traiter les requêtes HTTP en nous appuyant sur deux de mes outils fétiches: TypeScript et Koa. Plongeons dans le vif du sujet. 🚀

## Mes choix technologiques: TypeScript et Koa

Avant de plonger dans le code, revenons un instant sur les raisons qui m'ont orienté vers cette stack technologique.

### TypeScript: le gardien de mon code

Pour moi, TypeScript n'est pas une simple option, c'est un pilier. Il transforme le JavaScript que nous connaissons en un langage plus robuste et plus sûr. Voici pourquoi il change la donne:

1. **Une sécurité à toute épreuve**: J'adore livrer du code qui fonctionne. La vérification statique des types de TypeScript agit comme une check-list avant le décollage: elle intercepte les erreurs d'inattention et les bugs potentiels avant même que le code ne soit exécuté.
2. **Une clarté exemplaire en équipe**: Sa nature structurée rend le code incroyablement lisible. Que l'on soit en équipe ou que l'on relise son propre code des mois plus tard, c'est comme laisser derrière soi une carte claire et facile à suivre.
3. **Des IDE sur-vitaminés**: L'autocomplétion et la détection d'erreurs en temps réel offertes par les IDE modernes sont un véritable super-pouvoir. C'est comme avoir un copilote qui vous souffle constamment la bonne direction.

### Koa: la puissance du minimalisme

Développé par la même équipe qu'Express, Koa s'est imposé comme mon choix de prédilection pour sa simplicité assumée. Il est petit, mais redoutablement efficace.

1. **Une logique simple et épurée**: La conception de Koa est d'une simplicité brillante. Sa logique est incroyablement facile à suivre, ce qui permet de structurer une application d'une manière qui tombe sous le sens.
2. **Conçu pour le JavaScript moderne**: Il est entièrement bâti autour de `async/await`, signant la fin du fameux "callback hell". Le code qui en résulte est plus net et bien plus intuitif.
3. **L'apprentissage par la contrainte (positive!)**: Koa n'intègre pas une myriade de fonctionnalités par défaut. Cela peut sonner comme un défaut, mais j'y vois un atout majeur. Il nous force à comprendre les rouages essentiels de Node.js et les véritables mécanismes de construction d'un serveur web.

Prêt à construire quelque chose de génial? Posons les fondations. 💪

## Lancer le projet

Pour commencer, assurez-vous que Node.js et npm sont installés et opérationnels sur votre machine.

1. **Initialisez votre projet**:
		Je démarre systématiquement avec `npm init -y`. Cette commande génère en un clin d'œil un fichier `package.json`. Considérez-le comme le passeport de votre projet: il consigne toutes ses informations vitales et la liste de ses dépendances.

2. **Installez les dépendances essentielles**:
		Une fois le projet initialisé, il est temps d'intégrer nos outils de base. Nous avons besoin des paquets eux-mêmes, ainsi que de leurs définitions de types TypeScript correspondantes.

		```sh

# Installer TypeScript et son compagnon d'exécution

    npm install --save typescript ts-node

# Installer nos outils pour le serveur web

    npm install --save koa @types/koa koa-router @types/koa-router

    ```

		Ces paquets `@types/` sont cruciaux. Ce sont eux qui apprennent à TypeScript à déchiffrer la structure de ces bibliothèques JavaScript, libérant ainsi toute la magie de la vérification des types.

## Faire dialoguer TypeScript et Node.js

Node.js ne comprend pas nativement TypeScript. Pour jeter un pont entre ces deux mondes, j'utilise un paquet très pratique nommé `ts-node`. C'est un outil providentiel qui transpile et exécute notre code TypeScript en une seule étape.

Faisons un rapide " Hello World " pour le voir en action. Créez un fichier à l'emplacement `src/server.ts`:

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

Exécutez `npm start` dans votre terminal. Si " Hello World " s'affiche, félicitations! Vous venez de lancer votre premier fichier TypeScript avec Node.js. Parfait! 🎉

**Petite astuce**: Je crée toujours immédiatement un fichier `.gitignore` pour garder mon historique Git impeccable.

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

Passons au cœur du réacteur. Confions à Koa le rôle de tour de contrôle de notre serveur. C'est lui qui aiguillera les requêtes entrantes vers la logique appropriée avant de formuler et renvoyer les réponses.

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

**Un point essentiel à retenir**: Koa est minimaliste par nature. Pour des fonctionnalités comme le routage (`koa-router`) ou l'analyse du corps des requêtes, vous devez intégrer des paquets supplémentaires. J'adore cette approche, car elle m'offre un contrôle total et une compréhension plus fine de la manière dont chaque pièce du puzzle s'assemble.

### La puissance des middlewares

L'une de mes fonctionnalités préférées dans Koa est `app.use()`. Elle permet de créer une chaîne de fonctions appelées "middlewares".

J'aime voir les middlewares comme une série de points de contrôle. Une requête arrive et traverse chaque maillon de la chaîne. Chacun peut inspecter, voire modifier, l'objet "contexte" (`ctx`) avant de passer le relais au suivant, jusqu'à atteindre la destination finale: votre contrôleur.

```typescript
// Un middleware simple qui ajoute de l'argent au contexte
function addMoneyMiddleware(ctx, next) {
  ctx.money = (ctx.money || 0) + 1;
  return next(); // C'est crucial ! Cela passe le relais au middleware suivant.
}

// L'utiliser pour TOUTES les routes
app.use(addMoneyMiddleware); // ctx.money vaut maintenant 1
app.use(addMoneyMiddleware); // ctx.money vaut maintenant 2

// L'utiliser uniquement pour un groupe de routes spécifique
router
  .use('/rich', addMoneyMiddleware) // ctx.money vaut maintenant 3 pour cette route
  .get('/rich', (ctx) => {
    ctx.body = `You have ${ctx.money} dollars.`; // Renvoie "You have 3 dollars."
  });

router.get('/not-rich', (ctx) => {
  ctx.body = `You have ${ctx.money} dollars.`; // Renvoie "You have 2 dollars."
});
```

Ce pattern est incroyablement puissant pour séparer les responsabilités, comme l'authentification, la journalisation (logging), et bien plus encore.

## L'objet contexte (`ctx`): le chef d'orchestre de Koa

L'objet contexte de Koa, universellement nommé `ctx`, est un petit bijou de conception d'API. Il fusionne les objets `request` et `response` de Node en un seul ensemble cohérent et pratique, nous simplifiant considérablement la vie.

Voici un aperçu de ce que l'on peut faire avec `ctx`:

```typescript
import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
    // Accéder aux données de la requête
    console.log(ctx.request.url);      // L'URL demandée
    console.log(ctx.request.query);    // Les paramètres de la query string parsés
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

En bref, l'objet `ctx` est votre véritable centre de commande pour piloter une requête du début à la fin.

## Structurer une application pour le monde réel

Lorsqu'une application grandit, sa structure devient primordiale. Pour moi, une architecture en couches s'impose comme la seule voie viable pour garantir un code maintenable et facile à tester.

1. **La couche de routage** (Router): Définit les points d'entrée de l'API avec `koa-router`.
2. **La couche des contrôleurs** (Controller): Contient la logique principale pour chaque route.
3. **La couche des services** (Service): Gère la logique métier complexe ou les interactions avec la base de données.
4. **La couche des modèles** (Model): Définit la forme de vos données et les schémas de base de données.

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
    // Suppose qu'un middleware de body-parser est utilisé
    const userData = ctx.request.body;
    ctx.status = 201; // Created
    ctx.body = await userService.createUser(userData);
};

// --- services/userService.ts ---
import { User } from '../models/User';

export const getAllUsers = async () => {
    // Faisons comme si c'était un appel à la base de données
    return User.findAll();
};

export const createUser = async (userData: any) => {
    // Faisons comme si cela sauvegardait en base de données
    return User.create(userData);
};
```

Cette séparation garantit que chaque partie de l'application se concentre sur une seule et même mission.

## N'oublions pas la gestion des erreurs et le logging

Un serveur de production n'est pas complet sans une gestion des erreurs et un logging robustes. Le pattern de middleware de Koa rend cette tâche particulièrement élégante.

```typescript
import Koa from 'koa';
import logger from 'koa-logger';

const app = new Koa();

// Mon middleware générique de gestion des erreurs. Je le place tout en haut.
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
        // On signale aussi l'erreur à l'application
        ctx.app.emit('error', err, ctx);
    }
});

// Middleware de logging pour les requêtes
app.use(logger());

// Écouteur d'erreurs centralisé
app.on('error', (err, ctx) => {
    console.error('Server Error:', err.message, { url: ctx.url });
});

// Vos routes et autres middlewares viendraient ici…

app.listen(3000);
```

Cette configuration garantit qu'aucune erreur ne passe entre les mailles du filet et que je dispose d'un journal de bord clair de tout ce qui se passe sur le serveur.

## Pour conclure

Et voilà le tour d'horizon! Nous avons posé les bases d'un projet, fait collaborer TypeScript et Node, et bâti un serveur avec Koa. Ce n'est bien sûr qu'un point de départ. Le vrai plaisir commence lorsque vous vous lancez dans vos propres expérimentations et donnez corps à vos idées.

Continuez d'apprendre, de créer, et donnez vie à quelque chose d'exceptionnel. 🌟

Bon code.
