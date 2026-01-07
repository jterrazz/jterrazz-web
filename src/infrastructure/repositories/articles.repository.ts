import { parseText } from "@jterrazz/intelligence";
import { readFileSync } from "node:fs";

// Domain
import {
  type Article,
  ArticleCategory,
  type ArticleLanguage,
  createArticle,
  type RawArticleInput,
} from "../../domain/article";

import { getContentUrl } from "../content-url";

// Configuration structure for each article before being transformed into the Article domain model.
type ArticleConfig = {
  filename: string;
  metadata: ArticleMetadataConfig;
  previewImage?: string;
  publicIndex: number;
  published: boolean;
};

// Metadata configuration used only for seeding with already-translated strings.
type ArticleMetadataConfig = {
  category: ArticleCategory;
  dateModified: string;
  datePublished: string;
  description: TranslatedString;
  series?: string;
  tagline: TranslatedString;
  title: TranslatedString;
};

// Utility type for storing translations directly in the seed file.
type TranslatedString = Record<ArticleLanguage, string>;

const DEFAULT_PREVIEW_IMAGE = "thumbnail.jpg";

const ARTICLES_CONFIG: ArticleConfig[] = [
  {
    filename: "2019-06-01 Malloc",
    metadata: {
      category: ArticleCategory.Experiment,
      dateModified: "2025-06-23",
      datePublished: "2019-06-01",
      description: {
        en: "A deep dive into building malloc from scratch in C. Learn mmap, memory buckets, first-fit allocation, block coalescing, and alignment to truly understand dynamic memory.",
        fr: "Plongée dans la création de malloc en C. Apprenez mmap, les buckets mémoire, l'allocation first-fit, la coalescence et l'alignement pour vraiment comprendre la mémoire dynamique.",
      },
      tagline: {
        en: "Building malloc from scratch to understand memory",
        fr: "Construire malloc pour comprendre la mémoire",
      },
      title: {
        en: "Master memory management, I built my own malloc, and you should too",
        fr: "Maîtriser la gestion mémoire en codant son propre malloc",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 1,
    published: true,
  },
  {
    filename: "2019-06-07 Sha256",
    metadata: {
      category: ArticleCategory.Experiment,
      dateModified: "2025-06-24",
      datePublished: "2019-06-07",
      description: {
        en: "Implement SHA-256 and MD5 hash algorithms from scratch in C. Master bitwise operations, message padding, compression loops, and validate with test vectors.",
        fr: "Implémentez les algorithmes SHA-256 et MD5 en C. Maîtrisez les opérations binaires, le padding, les boucles de compression et validez avec des vecteurs de test.",
      },
      tagline: {
        en: "Implementing cryptographic hash functions in C",
        fr: "Implémenter des fonctions de hachage en C",
      },
      title: {
        en: "Hashing in C, a deep dive into SHA-256 and MD5",
        fr: "Le hachage en C, plongée dans SHA-256 et MD5",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 2,
    published: true,
  },
  {
    filename: "2019-07-25 Nm Otool",
    metadata: {
      category: ArticleCategory.Experiment,
      dateModified: "2025-06-25",
      datePublished: "2019-07-25",
      description: {
        en: "Learn Mach-O binary format by building nm and otool in C. Decode symbol tables, parse headers and sections, and understand how macOS executables work.",
        fr: "Apprenez le format binaire Mach-O en construisant nm et otool en C. Décodez les tables de symboles, parsez les en-têtes et comprenez les exécutables macOS.",
      },
      tagline: {
        en: "Reverse engineering macOS binaries in C",
        fr: "Rétro-ingénierie des binaires macOS en C",
      },
      title: {
        en: "Decoding the magic, my journey building nm and otool",
        fr: "Décoder la magie, reconstruire nm et otool de zéro",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 3,
    published: true,
  },
  {
    filename: "2019-08-27 Quine",
    metadata: {
      category: ArticleCategory.Experiment,
      dateModified: "2025-06-26",
      datePublished: "2019-08-27",
      description: {
        en: "Explore the fascinating world of quines, programs that output their own source code. Learn the theory behind self-replicating code and implement quines in multiple languages.",
        fr: "Explorez le monde fascinant des quines, programmes qui affichent leur propre code source. Apprenez la théorie du code auto-répliquant et implémentez des quines en plusieurs langages.",
      },
      tagline: {
        en: "Code that prints its own source",
        fr: "Du code qui affiche son propre code",
      },
      title: {
        en: "Building a program that writes itself (a quine)",
        fr: "Créer un programme qui s'écrit lui-même (un quine)",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 4,
    published: true,
  },
  {
    filename: "2019-08-28 Assembly",
    metadata: {
      category: ArticleCategory.Experiment,
      dateModified: "2025-06-27",
      datePublished: "2019-08-28",
      description: {
        en: "Get started with x86-64 assembly language. Set up your toolchain, understand registers and calling conventions, then write and link your first assembly functions.",
        fr: "Débutez en assembleur x86-64. Configurez vos outils, comprenez les registres et conventions d'appel, puis écrivez et liez vos premières fonctions assembleur.",
      },
      tagline: {
        en: "First steps into x86-64 assembly",
        fr: "Premiers pas en assembleur x86-64",
      },
      title: {
        en: "Let's dive into assembly and build our first functions (Intel x86-64)",
        fr: "Plongeons dans l'assembleur et créons nos premières fonctions (Intel x86-64)",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 5,
    published: true,
  },
  {
    filename: "2019-09-10 Expert System",
    metadata: {
      category: ArticleCategory.Experiment,
      dateModified: "2025-06-28",
      datePublished: "2019-09-10",
      description: {
        en: "Build an expert system from scratch in Python. Implement a backward-chaining inference engine that reasons with rules and facts to solve logical problems.",
        fr: "Construisez un système expert en Python. Implémentez un moteur d'inférence à chaînage arrière qui raisonne avec des règles et des faits pour résoudre des problèmes logiques.",
      },
      tagline: {
        en: "Building an inference engine in Python",
        fr: "Construire un moteur d'inférence en Python",
      },
      title: {
        en: "My journey into expert systems with Python",
        fr: "Mon aventure au cœur des systèmes experts avec Python",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 6,
    published: true,
  },
  {
    filename: "2020-11-03 Koa",
    metadata: {
      category: ArticleCategory.Experiment,
      dateModified: "2025-06-29",
      datePublished: "2020-11-03",
      description: {
        en: "Build a production-ready web server with TypeScript and Koa. Learn to set up routing, middleware chains, and type-safe request handling in a lightweight framework.",
        fr: "Créez un serveur web prêt pour la production avec TypeScript et Koa. Apprenez le routage, les chaînes de middleware et la gestion typée des requêtes.",
      },
      tagline: {
        en: "A lightweight TypeScript web server",
        fr: "Un serveur web léger en TypeScript",
      },
      title: {
        en: "Building my go-to web server with TypeScript and Koa",
        fr: "Créer son serveur web de référence avec TypeScript et Koa",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 7,
    published: true,
  },
  {
    filename: "2023-07-02 Open Market",
    metadata: {
      category: ArticleCategory.Experiment,
      dateModified: "2025-07-01",
      datePublished: "2023-07-02",
      description: {
        en: "A vision for reimagining e-commerce as an open, decentralized protocol. Exploring how to bring back community, transparency, and fair competition to online shopping.",
        fr: "Une vision pour réinventer le e-commerce en protocole ouvert et décentralisé. Explorer comment ramener communauté, transparence et concurrence équitable.",
      },
      tagline: {
        en: "Reimagining e-commerce as open protocol",
        fr: "Réinventer le e-commerce en protocole ouvert",
      },
      title: {
        en: "What if we got online shopping wrong?",
        fr: "Et si nous avions tout faux sur le e-commerce?",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 8,
    published: true,
  },
  {
    filename: "2024-12-20 Application Design Introduction",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-02",
      datePublished: "2024-12-20",
      description: {
        en: "An introduction to building maintainable software. Learn the foundational principles that help applications evolve gracefully over time without accumulating technical debt.",
        fr: "Introduction à la création de logiciels maintenables. Apprenez les principes fondamentaux pour des applications qui évoluent sans accumuler de dette technique.",
      },
      series: "Application Design",
      tagline: {
        en: "Foundations of maintainable software",
        fr: "Fondations du logiciel maintenable",
      },
      title: {
        en: "Building software that lasts",
        fr: "Bâtir des logiciels qui durent",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 9,
    published: true,
  },
  {
    filename: "2024-12-21 Application Design Dependencies",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-03",
      datePublished: "2024-12-21",
      description: {
        en: "Master dependency management in software architecture. Learn how to structure code so dependencies flow in the right direction, keeping your core logic independent.",
        fr: "Maîtrisez la gestion des dépendances en architecture logicielle. Structurez votre code pour que les dépendances circulent correctement, gardant votre logique métier indépendante.",
      },
      series: "Application Design",
      tagline: {
        en: "Structuring code for independence",
        fr: "Structurer le code pour l'indépendance",
      },
      title: {
        en: "Mastering the flow of dependencies",
        fr: "Maîtriser le flux des dépendances",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 10,
    published: true,
  },
  {
    filename: "2024-12-22 Application Design Hexagonal",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-04",
      datePublished: "2024-12-22",
      description: {
        en: "Explore hexagonal architecture and ports & adapters pattern. Learn to isolate your business logic from external concerns like databases, APIs, and frameworks.",
        fr: "Explorez l'architecture hexagonale et le pattern ports & adaptateurs. Apprenez à isoler votre logique métier des préoccupations externes comme les bases de données et APIs.",
      },
      series: "Application Design",
      tagline: {
        en: "Isolating business from infrastructure",
        fr: "Isoler le métier de l'infrastructure",
      },
      title: {
        en: "Separating business from technology",
        fr: "Séparer le métier de la technologie",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 11,
    published: true,
  },
  {
    filename: "2024-12-23 Application Design Clean Architecture",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-05",
      datePublished: "2024-12-23",
      description: {
        en: "Deep dive into Clean Architecture. Organize your code into entities, use cases, adapters, and drivers to create systems where business rules remain untouched by technical changes.",
        fr: "Plongée dans la Clean Architecture. Organisez votre code en entités, cas d'usage, adaptateurs et pilotes pour des systèmes où les règles métier restent intactes.",
      },
      series: "Application Design",
      tagline: {
        en: "Layered architecture for lasting code",
        fr: "Architecture en couches pour du code durable",
      },
      title: {
        en: "A journey into clean architecture",
        fr: "Voyage au cœur de la Clean Architecture",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 12,
    published: true,
  },
  {
    filename: "2025-04-06 Fake News",
    metadata: {
      category: ArticleCategory.Experiment,
      dateModified: "2025-07-06",
      datePublished: "2025-04-06",
      description: {
        en: "Building n00, a mobile game that teaches media literacy through play. Using AI to generate quiz content that challenges players to spot bias and think critically about news.",
        fr: "Création de n00, un jeu mobile qui enseigne la littératie médiatique par le jeu. L'IA génère du contenu quiz défiant les joueurs de repérer les biais dans l'actualité.",
      },
      tagline: {
        en: "A game to spot bias in the news",
        fr: "Un jeu pour repérer les biais médiatiques",
      },
      title: {
        en: "Let's playfully question everything",
        fr: "Remettre en question, c'est jouer",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 13,
    published: true,
  },
  {
    filename: "2025-05-06 Navigating the AI Revolution",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-07",
      datePublished: "2025-05-06",
      description: {
        en: "The execution layer that pays your salary is collapsing. As AI commoditizes knowledge work, discover what actually makes you valuable in an age of abundant intelligence.",
        fr: "La couche d'exécution qui paie votre salaire s'effondre. Alors que l'IA banalise le travail du savoir, découvrez ce qui vous rend vraiment précieux à l'ère de l'intelligence abondante.",
      },
      series: "Abundant Intelligence",
      tagline: {
        en: "What makes you valuable when AI can execute?",
        fr: "Qu'est-ce qui vous rend précieux quand l'IA exécute ?",
      },
      title: {
        en: "Your moat is melting",
        fr: "Votre forteresse s'effondre",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 14,
    published: true,
  },
  {
    filename: "2025-05-07 Applied Intelligence",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-08",
      datePublished: "2025-05-07",
      description: {
        en: "A practical guide to working with AI. Stop treating it as a last resort and start directing it like a team of specialists: researcher, writer, analyst, and strategist on demand.",
        fr: "Guide pratique pour travailler avec l'IA. Cessez de la traiter en dernier recours et dirigez-la comme une équipe de spécialistes : chercheur, rédacteur, analyste et stratège à la demande.",
      },
      series: "Abundant Intelligence",
      tagline: {
        en: "Direct AI like an on-demand team",
        fr: "Dirigez l'IA comme une équipe à la demande",
      },
      title: {
        en: "How to actually use AI",
        fr: "L'IA : Mode d'emploi",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 15,
    published: true,
  },
  {
    filename: "2025-05-08 Architects of Inversion - The Collapse of Execution",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-09",
      datePublished: "2025-05-08",
      description: {
        en: "The comfortable middle layer of knowledge work is evaporating. As execution becomes cheap, value concentrates at the extremes: pure judgment at the top, pure humanity at the bottom.",
        fr: "La couche intermédiaire confortable du travail du savoir s'évapore. L'exécution devenant bon marché, la valeur se concentre aux extrêmes : discernement pur en haut, humanité pure en bas.",
      },
      series: "Abundant Intelligence",
      tagline: {
        en: "Value moves to judgment and humanity",
        fr: "La valeur migre vers le jugement et l'humanité",
      },
      title: {
        en: "The collapse of the middle",
        fr: "L'effondrement du centre",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 16,
    published: true,
  },
  {
    filename: "2025-05-09 Architects of Inversion - The World That Follows",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-10",
      datePublished: "2025-05-09",
      description: {
        en: "When work stops being about survival, it becomes expression. Exploring how AI abundance transforms careers, identity, and what it means to contribute in a post-execution world.",
        fr: "Quand le travail cesse d'être survie, il devient expression. Comment l'abondance de l'IA transforme les carrières, l'identité et le sens de contribuer dans un monde post-exécution.",
      },
      series: "Abundant Intelligence",
      tagline: {
        en: "Work as expression, not survival",
        fr: "Le travail comme expression, pas survie",
      },
      title: {
        en: "What remains when machines handle everything?",
        fr: "Que reste-t-il quand les machines gèrent tout ?",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 17,
    published: true,
  },
  {
    filename: "2025-05-18 Cursor",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-12",
      datePublished: "2025-05-18",
      description: {
        en: "Master Cursor IDE for AI-assisted development. Learn context-aware coding, agent mode, and intent-driven development to compress mechanical work into high-level direction.",
        fr: "Maîtrisez Cursor IDE pour le développement assisté par IA. Apprenez le codage contextuel, le mode agent et le développement piloté par l'intention.",
      },
      tagline: {
        en: "AI-assisted coding with Cursor IDE",
        fr: "Développement assisté par IA avec Cursor",
      },
      title: {
        en: "Cursor: the compression of mechanical work",
        fr: "Cursor: la compression du travail mécanique",
      },
    },
    previewImage: DEFAULT_PREVIEW_IMAGE,
    publicIndex: 19,
    published: true,
  },
  {
    filename: "2025-07-19 Intelligence Levels",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-19",
      datePublished: "2025-07-19",
      description: {
        en: "A framework for understanding AI integration levels in any field. From simple assistants to fully programmable intelligence, map where you are and where you're heading.",
        fr: "Un cadre pour comprendre les niveaux d'intégration de l'IA dans tout domaine. Des assistants simples à l'intelligence programmable, situez-vous et anticipez l'évolution.",
      },
      series: "Using AI",
      tagline: {
        en: "From assistant to programmable intelligence",
        fr: "De l'assistant à l'intelligence programmable",
      },
      title: {
        en: "The four levels of AI integration",
        fr: "Les quatre niveaux d'intégration de l'IA",
      },
    },
    previewImage: "thumbnail.jpg",
    publicIndex: 20,
    published: true,
  },
  {
    filename: "2025-07-20 Directing Agents",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-20",
      datePublished: "2025-07-20",
      description: {
        en: "Learn to direct AI agents as a developer. Transform your workflow from writing code to orchestrating intelligent agents that handle implementation details.",
        fr: "Apprenez à diriger des agents IA en tant que développeur. Transformez votre workflow de l'écriture de code vers l'orchestration d'agents intelligents.",
      },
      series: "Using AI",
      tagline: {
        en: "From coding to orchestrating agents",
        fr: "Du code à l'orchestration d'agents",
      },
      title: {
        en: "Directing AI agents",
        fr: "Diriger les agents IA",
      },
    },
    previewImage: "thumbnail.jpg",
    publicIndex: 21,
    published: true,
  },
  {
    filename: "2025-07-21 Autonomous Agents",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-21",
      datePublished: "2025-07-21",
      description: {
        en: "Explore autonomous AI agents that work independently on complex tasks. Learn when to delegate entire workflows and how to design systems for agent autonomy.",
        fr: "Explorez les agents IA autonomes qui travaillent indépendamment sur des tâches complexes. Apprenez quand déléguer des workflows entiers et concevoir pour l'autonomie.",
      },
      series: "Using AI",
      tagline: {
        en: "Delegating workflows to AI",
        fr: "Déléguer les workflows à l'IA",
      },
      title: {
        en: "Autonomous AI agents",
        fr: "Les agents IA autonomes",
      },
    },
    previewImage: "thumbnail.jpg",
    publicIndex: 22,
    published: true,
  },
  {
    filename: "2025-07-22 Intelligent Systems",
    metadata: {
      category: ArticleCategory.Insight,
      dateModified: "2025-07-22",
      datePublished: "2025-07-22",
      description: {
        en: "Design intelligent systems that blend traditional code with AI reasoning. Learn architectural patterns for building applications where intelligence is a first-class component.",
        fr: "Concevez des systèmes intelligents alliant code traditionnel et raisonnement IA. Apprenez les patterns architecturaux où l'intelligence est un composant de premier ordre.",
      },
      series: "Using AI",
      tagline: {
        en: "Blending code with AI reasoning",
        fr: "Allier code et raisonnement IA",
      },
      title: {
        en: "Programming intelligent systems",
        fr: "Programmer des systèmes intelligents",
      },
    },
    previewImage: "thumbnail.jpg",
    publicIndex: 23,
    published: true,
  },
];

// Helper function to transform relative asset paths in markdown to versioned URLs
const processMarkdownContent = (content: string, filename: string): string => {
  return content.replace(/!\[([^\]]*)\]\((?:\.\/)?assets\/([^)]+)\)/g, (_match, altText, p1) => {
    return `![${altText}](${getContentUrl(`${encodeURIComponent(filename)}/assets/${encodeURIComponent(p1)}`)})`;
  });
};

// Clean AI-generated artifacts from text (before domain sanitization)
// collapseSpaces: false preserves indentation in code blocks
const cleanAiText = (text: string): string => parseText(text, { collapseSpaces: false });

const readMarkdownFileSync = (
  articlesDirectory: string,
  filename: string,
  language: ArticleLanguage,
): string | undefined => {
  try {
    const content = readFileSync(`${articlesDirectory}/${filename}/${language}.md`, "utf8");
    return processMarkdownContent(content, filename);
  } catch {
    return undefined;
  }
};

// Load all articles synchronously at module initialization
const loadArticles = (): Article[] => {
  const articlesDirectory = `${process.cwd()}/content`;

  return ARTICLES_CONFIG.map(({ filename, previewImage, ...articleConfig }) => {
    // Read markdown content for each language
    const enContent = readMarkdownFileSync(articlesDirectory, filename, "en");
    const frContent = readMarkdownFileSync(articlesDirectory, filename, "fr");

    if (!enContent && !frContent) {
      throw new Error(`No content found for article ${filename}`);
    }

    // Build raw input (with AI text cleaning, before domain sanitization)
    const rawInput: RawArticleInput = {
      content: {
        en: enContent ? cleanAiText(enContent) : undefined,
        fr: frContent ? cleanAiText(frContent) : undefined,
      },
      imageUrl: previewImage
        ? getContentUrl(`${encodeURIComponent(filename)}/assets/${previewImage}`)
        : "",
      metadata: {
        category: articleConfig.metadata.category,
        dateModified: articleConfig.metadata.dateModified,
        datePublished: articleConfig.metadata.datePublished,
        description: {
          en: cleanAiText(articleConfig.metadata.description.en),
          fr: cleanAiText(articleConfig.metadata.description.fr),
        },
        series: articleConfig.metadata.series,
        tagline: {
          en: cleanAiText(articleConfig.metadata.tagline.en),
          fr: cleanAiText(articleConfig.metadata.tagline.fr),
        },
        title: {
          en: cleanAiText(articleConfig.metadata.title.en),
          fr: cleanAiText(articleConfig.metadata.title.fr),
        },
      },
      publicIndex: articleConfig.publicIndex,
      published: articleConfig.published,
    };

    // Domain factory handles sanitization
    return createArticle(rawInput);
  });
};

// Singleton: articles loaded once at startup
const articles = loadArticles();

export const articlesRepository = {
  getAll: (): Article[] =>
    [...articles].sort(
      (a, b) =>
        new Date(b.metadata.dateModified).getTime() - new Date(a.metadata.dateModified).getTime(),
    ),
  getByIndex: (index: string, language: ArticleLanguage = "en"): Article | undefined => {
    const article = articles.find((a) => String(a.publicIndex) === index);
    if (!article || !article.content[language]) return undefined;
    return article;
  },
};
