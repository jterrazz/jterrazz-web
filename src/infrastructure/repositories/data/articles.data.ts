import { sanitizeAiText } from 'ai-text-sanitizer';
import { promises as fs } from 'node:fs';

import { type Article, ArticleCategory, type ArticleLanguage } from '../../../domain/article.js';

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
    title: TranslatedString;
};

// Utility type for storing translations directly in the seed file.
type TranslatedString = Record<ArticleLanguage, string>;

// Serve images directly from the local content route exposed by `src/app/content/[...path]/route.ts`.
// This avoids relying on an external CDN and allows Next.js to optimise the files via its built-in <Image> component.
const CDN_BASE_URL = '/content';
const DEFAULT_PREVIEW_IMAGE_JPG = 'thumbnail.jpg';

const ARTICLES_CONFIG: ArticleConfig[] = [
    {
        filename: '2019-06-01 Malloc',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-23',
            datePublished: '2019-06-01',
            description: {
                en: 'Step-by-step guide to implement malloc, free and realloc with mmap, understanding heap management, alignment and performance pitfalls.',
                fr: "Guide pas à pas pour implémenter malloc, free et realloc avec mmap, comprendre la gestion du tas, l'alignement et les pièges de performance.",
            },
            title: {
                en: 'Build Your Own malloc in C',
                fr: 'Construisez votre propre malloc en C',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 1,
        published: true,
    },
    {
        filename: '2019-06-07 Sha256',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-24',
            datePublished: '2019-06-07',
            description: {
                en: 'Code cryptographic hashes from scratch, explore message padding, processing rounds and why SHA-256 replaces MD5 in secure systems.',
                fr: 'Programmez des fonctions de hachage cryptographique depuis zéro, explorez le bourrage de messages, les tours de traitement et pourquoi SHA-256 remplace MD5 dans les systèmes sécurisés.',
            },
            title: {
                en: 'SHA-256 & MD5 in C – Complete Hashing Guide',
                fr: 'SHA-256 & MD5 en C – Guide complet de hachage',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 2,
        published: true,
    },
    {
        filename: '2019-07-25 Nm Otool',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-25',
            datePublished: '2019-07-25',
            description: {
                en: 'Build your own nm/otool clones to inspect Mach-O symbol tables and learn low-level binary analysis on macOS.',
                fr: "Créez vos propres clones de nm/otool pour inspecter les tables de symboles Mach-O et apprenez l'analyse binaire bas niveau sur macOS.",
            },
            title: {
                en: 'Reverse-Engineer Binaries with nm and otool',
                fr: 'Inverser-ingénierie de binaires avec nm et otool',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 3,
        published: true,
    },
    {
        filename: '2019-08-27 Quine',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-26',
            datePublished: '2019-08-27',
            description: {
                en: 'Challenge yourself to create a program that prints its own source while grasping strings, I/O and compiler quirks.',
                fr: "Relevez le défi de créer un programme qui affiche son propre code source tout en maîtrisant les chaînes, l'E/S et les subtilités du compilateur.",
            },
            title: {
                en: 'Write a Self-Replicating Quine in C',
                fr: 'Écrivez un Quine auto-réplicant en C',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 4,
        published: true,
    },
    {
        filename: '2019-08-28 Assembly',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-27',
            datePublished: '2019-08-28',
            description: {
                en: 'Hands-on intro to registers, calling conventions and optimisation by coding small assembly functions.',
                fr: "Introduction pratique aux registres, conventions d'appel et optimisation en codant de petites fonctions assembleur.",
            },
            title: {
                en: 'Your First x86-64 Assembly Routines',
                fr: 'Votre première routine x86-64 en assemblage',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 5,
        published: true,
    },
    {
        filename: '2019-09-10 Expert System',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-28',
            datePublished: '2019-09-10',
            description: {
                en: 'Create an AI reasoning engine in Python that derives conclusions from rules using classic backward chaining.',
                fr: 'Créez un moteur de raisonnement IA en Python qui déduit des conclusions à partir de règles grâce au chaînage arrière classique.',
            },
            title: {
                en: 'Build a Backward-Chaining Expert System',
                fr: 'Construisez un système expert de chaînage arrière',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 6,
        published: true,
    },
    {
        filename: '2020-11-03 Koa',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-29',
            datePublished: '2020-11-03',
            description: {
                en: 'Architect a modern Node backend using Koa middleware, routing, validation and testing in TypeScript.',
                fr: 'Créez un backend Node moderne en utilisant le middleware Koa, le routage, la validation et les tests en TypeScript.',
            },
            title: {
                en: 'TypeScript REST API with Koa.js',
                fr: 'API REST TypeScript avec Koa.js',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 7,
        published: true,
    },
    {
        filename: '2023-07-02 Open Market',
        metadata: {
            category: ArticleCategory.Build,
            dateModified: '2025-07-01',
            datePublished: '2023-07-02',
            description: {
                en: 'Architecture, tech stack and decentralised commerce concepts behind the Open.MT marketplace project.',
                fr: 'Architecture, pile technologique et concepts de commerce décentralisé derrière le projet Open.MT.',
            },
            title: {
                en: 'Inside Open.MT – Building an Open-Source Marketplace',
                fr: "À l'intérieur d'Open.MT – Construction d'une marketplace open-source",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 8,
        published: true,
    },
    {
        filename: '2024-12-20 Application Design Introduction',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2025-07-02',
            datePublished: '2024-12-20',
            description: {
                en: 'Kick-off to the Application Design series covering principles for sustainable, scalable software.',
                fr: "Introduction à la série Design d'application couvrant les principes d'un logiciel durable et évolutif.",
            },
            title: {
                en: 'Software Design 0 – Why Architecture Matters',
                fr: "Design d'application 0 – Pourquoi l'architecture est importante",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 9,
        published: true,
    },
    {
        filename: '2024-12-21 Application Design Dependencies',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2025-07-03',
            datePublished: '2024-12-21',
            description: {
                en: 'Learn dependency inversion & injection to keep codebases flexible, testable and maintainable.',
                fr: "Apprenez l'inversion et l'injection de dépendances pour garder des bases de code flexibles, testables et maintenables.",
            },
            title: {
                en: 'Software Design 1 – Mastering Dependencies',
                fr: "Design d'application 1 – Maîtrise des dépendances",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 10,
        published: true,
    },
    {
        filename: '2024-12-22 Application Design Hexagonal',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2025-07-04',
            datePublished: '2024-12-22',
            description: {
                en: 'Implement ports-and-adapters to isolate domain logic from frameworks, UIs and databases.',
                fr: 'Implémentez le modèle ports et adaptateurs pour isoler la logique métier des frameworks, interfaces et bases de données.',
            },
            title: {
                en: 'Software Design 2 – Hexagonal Architecture',
                fr: "Design d'application 2 – Architecture hexagonale",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 11,
        published: true,
    },
    {
        filename: '2024-12-23 Application Design Clean Architecture',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2025-07-05',
            datePublished: '2024-12-23',
            description: {
                en: 'Apply SOLID and layer boundaries to craft maintainable, decoupled systems that scale.',
                fr: "Appliquez SOLID et des limites de couche pour créer des systèmes découplés et maintenables à l'échelle.",
            },
            title: {
                en: 'Software Design 3 – Clean Architecture in Practice',
                fr: "Design d'application 3 – Architecture propre en pratique",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 12,
        published: true,
    },
    {
        filename: '2025-04-06 Fake News',
        metadata: {
            category: ArticleCategory.Build,
            dateModified: '2025-07-06',
            datePublished: '2025-04-06',
            description: {
                en: 'Discover a mobile game that gamifies media literacy and helps users detect misinformation.',
                fr: "Découvrez un jeu mobile qui gamifie l'éducation aux médias et aide les utilisateurs à détecter la désinformation.",
            },
            title: {
                en: 'Fake News App – Playful Critical Thinking',
                fr: 'Application de Fake News – Pensée critique ludique',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 13,
        published: true,
    },
    {
        filename: '2025-05-06 Navigating the AI Revolution',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-07',
            datePublished: '2025-05-06',
            description: {
                en: 'Practical roadmap to thrive amid accelerating AI adoption, disruption and new opportunities.',
                fr: "Feuille de route pratique pour prospérer face à l'adoption accélérée de l'IA, ses disruptions et ses nouvelles opportunités.",
            },
            title: {
                en: 'AI Series 0 – Navigating the AI Revolution',
                fr: "Série d'IA 0 – Navigation de la révolution IA",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 14,
        published: true,
    },
    {
        filename: '2025-05-07 Applied Intelligence',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-08',
            datePublished: '2025-05-07',
            description: {
                en: 'Tactics, workflows and tools to integrate AI into daily productivity and decision-making.',
                fr: "Tactiques, flux de travail et outils pour intégrer l'IA dans la productivité et la prise de décision quotidiennes.",
            },
            title: {
                en: 'AI Series 1 – Applied Intelligence for Everyday Work',
                fr: "Série d'IA 1 – Intelligence appliquée pour le travail quotidien",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 15,
        published: true,
    },
    {
        filename: '2025-05-08 Architects of Inversion - The Collapse of Execution',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-09',
            datePublished: '2025-05-08',
            description: {
                en: 'How AI flips traditional execution models and reshapes creative and operational roles.',
                fr: "Comment l'IA bouleverse les modèles d'exécution traditionnels et redéfinit les rôles créatifs et opérationnels.",
            },
            title: {
                en: 'AI Series 2 – The Collapse of Execution',
                fr: "Série d'IA 2 – Collapse de l'exécution",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 16,
        published: true,
    },
    {
        filename: '2025-05-09 Architects of Inversion - The World That Follows',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-10',
            datePublished: '2025-05-09',
            description: {
                en: 'Envision societal, economic and personal changes in a post-automation world.',
                fr: 'Envisagez les changements sociétaux, économiques et personnels dans un monde post-automatisation.',
            },
            title: {
                en: 'AI Series 3 – Life After the Execution Collapse',
                fr: "Série d'IA 3 – Vie après la chute de l'exécution",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 17,
        published: true,
    },
    {
        filename: '2025-05-18 AI Cheatsheet 2025',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-11',
            datePublished: '2025-05-18',
            description: {
                en: 'A concise reference of key AI concepts, frameworks and resources to stay current this year.',
                fr: "Une référence concise des concepts, frameworks et ressources clés de l'IA pour rester à jour cette année.",
            },
            title: {
                en: 'AI Cheatsheet 2025',
                fr: "Fiche d'aide IA 2025",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 18,
        published: true,
    },
    {
        filename: '2025-05-18 Cursor',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-12',
            datePublished: '2025-05-18',
            description: {
                en: 'Master Cursor features to boost development with inline AI suggestions, context and automation.',
                fr: "Maîtrisez les fonctionnalités de Cursor pour accélérer le développement avec des suggestions IA en ligne, du contexte et de l'automatisation.",
            },
            title: {
                en: 'Cursor Editor – AI-Powered Coding Workflow',
                fr: 'Éditeur Cursor – Workflow de codage IA-Powered',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 19,
        published: true,
    },
    {
        filename: '2025-07-19 Intelligence Levels',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-19',
            datePublished: '2025-07-19',
            description: {
                en: 'A practical framework for understanding and leveraging the four levels of AI integration in your work and life.',
                fr: "Un cadre pratique pour comprendre et exploiter les quatre niveaux d'intégration de l'IA dans votre travail et votre vie.",
            },
            title: {
                en: 'The Four Levels of AI',
                fr: 'Les quatre niveaux de l’IA',
            },
        },
        previewImage: 'thumbnail.jpg',
        publicIndex: 20,
        published: true,
    },
    {
        filename: '2025-07-20 Directing Agents',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-20',
            datePublished: '2025-07-20',
            description: {
                en: 'How developers can leverage guided AI agents to shift from manual coding to intention-driven development.',
                fr: "Comment les développeurs peuvent exploiter les agents IA guidés pour passer du codage manuel au développement guidé par l'intention.",
            },
            title: {
                en: 'Guided AI for Developers',
                fr: 'L’IA guidée pour développeurs',
            },
        },
        previewImage: 'thumbnail.jpg',
        publicIndex: 21,
        published: true,
    },
    {
        filename: '2025-07-21 Autonomous Agents',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-21',
            datePublished: '2025-07-21',
            description: {
                en: 'Exploring the transition from guided to autonomous AI agents in software development and the new role of the developer as supervisor.',
                fr: 'Explorer la transition des agents IA guidés vers les agents autonomes en développement logiciel et le nouveau rôle du développeur comme superviseur.',
            },
            title: {
                en: 'Autonomous AI Agents',
                fr: 'Agents IA autonomes',
            },
        },
        previewImage: 'thumbnail.jpg',
        publicIndex: 22,
        published: true,
    },
    {
        filename: '2025-07-22 Intelligent Systems',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-22',
            datePublished: '2025-07-22',
            description: {
                en: 'How to design and orchestrate intelligent systems that combine deterministic code and creative AI reasoning.',
                fr: "Comment concevoir et orchestrer des systèmes intelligents alliant code déterministe et raisonnement créatif de l'IA.",
            },
            title: {
                en: 'Programming Intelligence',
                fr: 'Programmer l’intelligence',
            },
        },
        previewImage: 'thumbnail.jpg',
        publicIndex: 23,
        published: true,
    },
];

const processMarkdownContent = (content: string, filename: string): string => {
    return content.replace(
        /!\[([^\]]*)\]\((?:\.\/)?assets\/([^)]+)\)/g,
        (match, altText, p1) =>
            // Point to the locally-served image so that <Image> receives an internal URL.
            `![${altText}](${CDN_BASE_URL}/${encodeURIComponent(filename)}/assets/${encodeURIComponent(p1)})`,
    );
};

const sanitizeText = (text: string | undefined): string | undefined =>
    text ? sanitizeAiText(text).cleaned : text;

const readMarkdownFile = async (
    articlesDirectory: string,
    filename: string,
    language: ArticleLanguage,
): Promise<string | undefined> => {
    try {
        const content = await fs.readFile(
            `${articlesDirectory}/${filename}/${language}.md`,
            'utf8',
        );
        return processMarkdownContent(content, filename);
    } catch {
        return undefined;
    }
};

export const readMarkdownArticles = async (): Promise<Article[]> => {
    const articlesDirectory = `${process.cwd()}/content`;

    return await Promise.all(
        ARTICLES_CONFIG.map(async ({ filename, previewImage, ...articleConfig }) => {
            const content: { [key in ArticleLanguage]?: string } = {};

            // Try to read both language versions
            const [enContent, frContent] = await Promise.all([
                readMarkdownFile(articlesDirectory, filename, 'en'),
                readMarkdownFile(articlesDirectory, filename, 'fr'),
            ]);

            if (enContent) content.en = sanitizeText(enContent)!;
            if (frContent) content.fr = sanitizeText(frContent)!;

            // If no content was found, throw error
            if (!Object.keys(content).length) {
                throw new Error(`No content found for article ${filename}`);
            }

            const imageUrl = previewImage
                ? `${CDN_BASE_URL}/${encodeURIComponent(filename)}/assets/${previewImage}`
                : '';

            // Localise title and description for each available language (defaulting to English if none provided)
            const sanitizeRecord = (record: TranslatedString): TranslatedString => ({
                en: sanitizeText(record.en) ?? '',
                fr: sanitizeText(record.fr) ?? '',
            });

            const descriptionByLang = sanitizeRecord(articleConfig.metadata.description);
            const titleByLang = sanitizeRecord(articleConfig.metadata.title);

            return {
                content,
                imageUrl,
                metadata: {
                    category: articleConfig.metadata.category,
                    dateModified: articleConfig.metadata.dateModified,
                    datePublished: articleConfig.metadata.datePublished,
                    description: descriptionByLang,
                    title: titleByLang,
                },
                publicIndex: articleConfig.publicIndex,
                published: articleConfig.published,
            } as Article;
        }),
    );
};
