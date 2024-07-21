# Jterrazz Web

> A personal portfolio website showcasing my development projects, photography, and articles. Discover my work in web development, explore my collection of photographs, and read my latest articles all in one place.

## Features

-   **Projects**: Showcase of my development projects with links to the live site and GitHub repository.
-   **Photography**: Collection of my photographs with a lightbox gallery for viewing.
-   **Articles**: Blog posts on web development, photography, and other topics.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Daily Rise - Daily Rise API

Welcome to the Daily Rise API! Our API powers the marketplace that enables customers to discover and transact with their communities.

## About Daily Rise

[Open.MT](https://open.mt) is a marketplace that enable seamless interactions between customers and their communities. We are dedicated to providing a platform that empowers merchants of all backgrounds, from big brands to small businesses and artisans. Our vision is to revolutionize the world of online commerce by leveraging the potential of decentralization and open technologies.

To learn more about our mission, latest updates, and exciting stories from entrepreneurs, visit [our blog](https://blog.open.mt/).

## Get Started 🍋

### Quick Start with Docker

Getting started with our API is simple! We use **docker** to manage the application and its dependencies. If you haven't installed Docker yet, you can follow the [official documentation](https://docs.docker.com/get-docker/) to set it up.

To launch the project, use the following command:

```sh
# Start the project
make start
```

With this quick setup, you'll be ready to explore the power of our Open Market API and build seamless experiences for customers. Happy coding!
To help you **develop**, we provide a few scripts to run the project with hot reload, and run tests.

```sh
# Develop the project with hot reload
make start-dev

# Run tests
make test
```

### Quick start with Node.js

If you want to run the project locally, you will need to install the following dependencies:

-   [Node.js](https://nodejs.org/en/download/)

Since this project requires external services (database, etc), you will need to run them manually.

```sh
make start-infra
```

#### Start the project

```sh
# Install dependencies
npm install

# Start the project
npm run start

# Develop the project with hot reload
npm run start:dev
```

#### Run tests

```sh
npm run test
```

## Code quality 🏗

### Tests

The **`jest` framework** is used to run both **integration** (`/tests/e2e/*.test.ts`) and **unit** tests (`__tests__/*.test.ts`).
The tests are run on **Github Actions** on each push.

### Linting

The **`eslint` framework** is used to lint the code. The rules are defined in the `.eslintrc` file.
