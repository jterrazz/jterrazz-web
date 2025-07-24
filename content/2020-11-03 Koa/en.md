![](assets/thumbnail.jpg)

# Building my go-to web server with TypeScript and Koa

Ever get that itch to build something from the ground up? That was me. I wanted to create my own web server—something solid and powerful, without the black boxes of bigger frameworks. This is how I did it, and how you can, too. We're going to build an HTTP server, a lean request-handling engine, using two of my favorite tools: TypeScript and Koa. Let's get into it. 🚀

## My tech choices: TypeScript and Koa

Before we start slinging code, let's talk about why I chose this particular stack.

### TypeScript: my code's guardian angel

For me, TypeScript isn't just a "nice-to-have"; it's fundamental. It transforms vanilla JavaScript into a more robust, safer language. Here's why it's a game-changer:

1. **Bulletproof safety**: I love shipping code that works. TypeScript's static type-checking is like a pre-flight check that catches silly mistakes and potential bugs before the code ever runs.
2. **Clarity in collaboration**: Its structured nature makes code incredibly readable. When you're on a team, or even just revisiting your own code months later, it's like leaving a clear, easy-to-read map.
3. **Supercharged IDEs**: The autocompletion and real-time error checking you get in modern IDEs feel like a superpower. It's like having a co-pilot who constantly nudges you in the right direction.

### Koa: the minimalist powerhouse

Koa, made by the same team behind Express, is my choice for its deliberate simplicity. It's small but mighty.

1. **Simple, clean logic**: Koa's design is brilliantly simple. This makes it incredibly easy to follow the server's logic and structure your application in a way that just makes sense.
2. **Built for modern JavaScript**: It's built around `async/await`, which means no more callback hell. The code is cleaner and much more intuitive.
3. **Forced to learn (in a good way!)**: Koa doesn't bundle a ton of features out of the box. This might sound like a negative, but I see it as a huge plus. It forces you to actually understand the core moving parts of Node.js and what it takes to build a web server.

Ready to build something cool? Let's lay the foundation. 💪

## Getting the project off the ground

First, you'll need Node.js and npm ready to go on your machine.

1. **Initialize your project**:
    I always start with `npm init -y`. This command quickly scaffolds a `package.json` file. Think of it as your project's passport—it holds all the vital stats and dependency info.

2. **Install the essentials**:
    With the project initialized, it's time to pull in our core tools. We need the packages themselves and their corresponding TypeScript type definitions.

    ```sh
    # Install TypeScript and its runtime buddy
    npm install --save typescript ts-node
    # Install our web server tools
    npm install --save koa @types/koa koa-router @types/koa-router
    ```

    Those `@types/` packages are crucial. They're what teach TypeScript how to understand the structure of these JavaScript libraries, enabling that sweet, sweet type-checking.

## Making TypeScript and Node.js talk

Node.js doesn't speak TypeScript natively. To bridge this gap, I use a handy package called `ts-node`. It's a lifesaver that transpiles and runs our TypeScript code in one go.

Let's do a quick "Hello World" to see it in action. Create a file at `src/server.ts`:

```typescript
console.log('Hello world');
```

Next, let's wire up a start script in our `package.json`:

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

Run `npm start` in your terminal. If you see "Hello World," you've successfully run your first TypeScript file with Node.js. Awesome! 🎉

**Quick tip**: I always create a `.gitignore` file immediately to keep my git history clean.

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

## Handling requests with Koa

Now for the fun part. We'll put Koa to work managing our server's traffic, directing incoming requests to the right logic and sending back responses.

Here's a basic server that responds to a request at the root URL (`/`):

```typescript
import Koa, { Middleware } from 'koa';
import Router from 'koa-router';

const PORT = 8080;
const app = new Koa();
const router = new Router();

// This is the logic for our route
const helloWorldController: Middleware = async (ctx) => {
    console.log('A request came in!');
    ctx.body = {
        message: 'Hello World!',
    };
};

router.get('/', helloWorldController);

// We tell our app to use the router
app.use(router.routes()).use(router.allowedMethods());

// And finally, we start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
```

**A key takeaway**: Koa is minimalist by design. For things like routing (`koa-router`) or parsing request bodies, you bring in extra packages. I love this because it gives me full control and a deeper understanding of how everything fits together.

### The power of middleware

One of my favorite things about Koa is `app.use()`. This lets you chain together functions called "middleware."

I think of middleware as a series of checkpoints. A request arrives and flows through each piece of middleware. Each one can inspect or even modify the "context" (`ctx`) object before passing it along to the next stop, which is ultimately your controller.

```typescript
// A simple middleware that adds money to the context
function addMoneyMiddleware(ctx, next) {
  ctx.money = (ctx.money || 0) + 1;
  return next(); // This is crucial! It passes control to the next middleware.
}

// Using it for ALL routes
app.use(addMoneyMiddleware); // ctx.money is now 1
app.use(addMoneyMiddleware); // ctx.money is now 2

// Using it only for a specific route group
router
  .use('/rich', addMoneyMiddleware) // ctx.money is now 3 for this route
  .get('/rich', (ctx) => {
    ctx.body = `You have ${ctx.money} dollars.`; // Returns "You have 3 dollars."
  });

router.get('/not-rich', (ctx) => {
  ctx.body = `You have ${ctx.money} dollars.`; // Returns "You have 2 dollars."
});
```

This pattern is incredibly powerful for separating concerns like authentication, logging, and more.

## Let's go deeper: the Koa context object

The Koa context object, `ctx`, is a masterpiece of API design. It bundles the Node `request` and `response` objects into one convenient package, making life so much easier.

Here's a snapshot of what you can do with `ctx`:

```typescript
import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
    // Accessing request data
    console.log(ctx.request.url);      // The URL requested
    console.log(ctx.request.query);    // Parsed query string
    console.log(ctx.request.body);     // Needs a body-parser middleware

    // Setting the response
    ctx.body = 'Hello, World!';        // The response body
    ctx.status = 200;                  // HTTP status code
    ctx.type = 'text/plain';           // Content-Type header

    // Sharing data between middleware
    ctx.state.user = { id: 1, name: 'John Doe' };
});

app.listen(3000);
```

The `ctx` object is your command center for handling a request from start to finish.

## Structuring a real-world app

As an application grows, structure becomes paramount. I'm a firm believer in a layered architecture to keep code maintainable and easy to test.

1. **Router Layer**: Defines the API endpoints using `koa-router`.
2. **Controller Layer**: Holds the core logic for each route.
3. **Service Layer**: Handles complex business logic or database interactions.
4. **Model Layer**: Defines the shape of your data and database schemas.

Here's a sketch of what that looks like:

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
    // Assumes a body parser middleware is used
    const userData = ctx.request.body;
    ctx.status = 201; // Created
    ctx.body = await userService.createUser(userData);
};

// --- services/userService.ts ---
import { User } from '../models/User';

export const getAllUsers = async () => {
    // Pretend this is a database call
    return User.findAll();
};

export const createUser = async (userData: any) => {
    // Pretend this saves to a database
    return User.create(userData);
};
```

This separation keeps each part of the application focused on a single job.

## Don't forget error handling and logging

A production server isn't complete without solid error handling and logging. Koa's middleware pattern makes this elegant.

```typescript
import Koa from 'koa';
import logger from 'koa-logger';

const app = new Koa();

// My generic error handling middleware. I place this at the top.
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            message: err.message,
            // I only show the stack in development
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        };
        // Also log the error to the console
        ctx.app.emit('error', err, ctx);
    }
});

// Logging middleware for requests
app.use(logger());

// Central error listener
app.on('error', (err, ctx) => {
    console.error('Server Error:', err.message, { url: ctx.url });
});

// Your routes and other middleware would go here…

app.listen(3000);
```

This setup ensures that no error slips through the cracks and that I have a clear log of what's happening on the server.

## Wrapping up

And that's the gist of it! We've journeyed from an empty folder to a functional server, wiring up TypeScript with Node and building a solid foundation with Koa. This is just the starting point, of course. The real fun begins when you take these concepts and build out your own ideas.

Keep learning, keep building, and create something amazing. 🌟

Happy coding
