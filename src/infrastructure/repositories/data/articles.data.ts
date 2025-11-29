import { sanitizeAiText } from 'ai-text-sanitizer';
import { promises as fs } from 'node:fs';

// Domain
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
    series?: string;
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
            category: ArticleCategory.Project,
            dateModified: '2025-06-23',
            datePublished: '2019-06-01',
            description: {
                en: 'Build your own malloc in C, learn mmap, buckets, first-fit, coalescing, alignment fixes to master dynamic memory.',
                fr: 'Construisez votre propre malloc en C, apprenez mmap, buckets, first-fit, coalescence et correctifs d\'alignement pour maîtriser la mémoire dynamique.',
            },
            title: {
                en: 'Master memory management, I built my own malloc, and you should too',
                fr: "Maîtriser la gestion de la mémoire, le jour où j'ai codé mon `malloc`",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 1,
        published: true,
    },
    {
        filename: '2019-06-07 Sha256',
        metadata: {
            category: ArticleCategory.Project,
            dateModified: '2025-06-24',
            datePublished: '2019-06-07',
            description: {
                en: 'Implement SHA-256 and MD5 from scratch in C: bitwise ops, message padding, compression loops and test vectors.',
                fr: 'Implémentez SHA-256 et MD5 from scratch en C : opérations binaires, padding de messages, boucles de compression et vecteurs de test.',
            },
            title: {
                en: 'Hashing in C, a deep dive into SHA-256 and MD5',
                fr: "L'art du hachage en C, un duel entre MD5 et SHA-256",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 2,
        published: true,
    },
    {
        filename: '2019-07-25 Nm Otool',
        metadata: {
            category: ArticleCategory.Project,
            dateModified: '2025-06-25',
            datePublished: '2019-07-25',
            description: {
                en: 'A guide to Mach-O analysis: decode symbol tables, headers, sections, and build your own nm/otool utilities in C.',
                fr: 'Guide de l\'analyse Mach-O : décodez tables de symboles, en-têtes, sections et construisez vos propres utilitaires nm/otool en C.',
            },
            title: {
                en: 'Decoding the magic, my journey building nm and otool',
                fr: 'Décoder la magie, mon voyage dans la construction de nm et otool',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 3,
        published: true,
    },
    {
        filename: '2019-08-27 Quine',
        metadata: {
            category: ArticleCategory.Project,
            dateModified: '2025-06-26',
            datePublished: '2019-08-27',
            description: {
                en: 'Craft self-replicating quine programs in multiple languages, understand theory, and master code that prints itself.',
                fr: 'Créez des programmes quines auto-répliquants dans plusieurs langages, comprenez la théorie et maîtrisez le code qui s\'imprime lui-même.',
            },
            title: {
                en: 'Building a program that writes itself (a quine)',
                fr: "Le paradoxe du code, à la découverte du quine, le programme qui s'écrit lui-même",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 4,
        published: true,
    },
    {
        filename: '2019-08-28 Assembly',
        metadata: {
            category: ArticleCategory.Project,
            dateModified: '2025-06-27',
            datePublished: '2019-08-28',
            description: {
                en: 'Set up toolchain, grasp registers & calling conventions, and code/link your first assembly functions.',
                fr: 'Installez la toolchain, maîtrisez registres et conventions d\'appel, codez et linkez vos premières fonctions assembleur.',
            },
            title: {
                en: "Let's dive into assembly and build our first functions (Intel x86-64)",
                fr: "Plongeon dans l'assembleur, nos premières fonctions (Intel x86-64)",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 5,
        published: true,
    },
    {
        filename: '2019-09-10 Expert System',
        metadata: {
            category: ArticleCategory.Project,
            dateModified: '2025-06-28',
            datePublished: '2019-09-10',
            description: {
                en: 'Guide to expert systems: code a backward-chaining inference engine in Python, with rules and facts.',
                fr: 'Guide des systèmes experts : codez un moteur d\'inférence à chaînage arrière en Python, avec règles et faits.',
            },
            title: {
                en: 'My journey into expert systems with Python',
                fr: 'Mon aventure au cœur des systèmes experts avec Python',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 6,
        published: true,
    },
    {
        filename: '2020-11-03 Koa',
        metadata: {
            category: ArticleCategory.Project,
            dateModified: '2025-06-29',
            datePublished: '2020-11-03',
            description: {
                en: 'Set up a lightweight web server in TypeScript using Koa, routing, middleware and typing in minutes.',
                fr: 'Montez un serveur web léger en TypeScript avec Koa, routing, middleware et typage en quelques minutes.',
            },
            title: {
                en: 'Building my go-to web server with TypeScript and Koa',
                fr: "Comment j'ai créé mon serveur web de référence avec TypeScript et Koa",
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 7,
        published: true,
    },
    {
        filename: '2023-07-02 Open Market',
        metadata: {
            category: ArticleCategory.Project,
            dateModified: '2025-07-01',
            datePublished: '2023-07-02',
            description: {
                en: 'Reimagine online shopping: open and decentralized. Reviving community, transparency & competition.',
                fr: 'Réinventer le e-commerce : ouvert et décentralisé. Raviver communauté, transparence et concurrence.',
            },
            title: {
                en: 'What if we got online shopping wrong?',
                fr: 'Et si nous avions tout faux sur le e-commerce?',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 8,
        published: true,
    },
    {
        filename: '2024-12-20 Application Design Introduction',
        metadata: {
            category: ArticleCategory.Architecture,
            dateModified: '2025-07-02',
            datePublished: '2024-12-20',
            description: {
                en: 'Learn application design essentials.',
                fr: 'Apprenez les essentiels de la conception applicative.',
            },
            series: 'Application Design',
            title: {
                en: 'Building software that lasts',
                fr: 'Bâtir des logiciels qui durent',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 9,
        published: true,
    },
    {
        filename: '2024-12-21 Application Design Dependencies',
        metadata: {
            category: ArticleCategory.Architecture,
            dateModified: '2025-07-03',
            datePublished: '2024-12-21',
            description: {
                en: 'Principles for sustainable architecture, maintainable code, and growth-ready scalable apps.',
                fr: 'Principes pour une architecture durable, du code maintenable et des apps évolutives.',
            },
            series: 'Application Design',
            title: {
                en: 'Mastering the flow of dependencies',
                fr: 'Maîtriser le flux des dépendances',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 10,
        published: true,
    },
    {
        filename: '2024-12-22 Application Design Hexagonal',
        metadata: {
            category: ArticleCategory.Architecture,
            dateModified: '2025-07-04',
            datePublished: '2024-12-22',
            description: {
                en: 'Align strategy, capabilities, and tech layers to deliver scalable, value-driven systems.',
                fr: 'Alignez stratégie, capacités et couches tech pour livrer des systèmes évolutifs et créateurs de valeur.',
            },
            series: 'Application Design',
            title: {
                en: 'Separating business from technology',
                fr: 'Séparer le métier de la technologie',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 11,
        published: true,
    },
    {
        filename: '2024-12-23 Application Design Clean Architecture',
        metadata: {
            category: ArticleCategory.Architecture,
            dateModified: '2025-07-05',
            datePublished: '2024-12-23',
            description: {
                en: 'Layer entities, use cases, adapters and drivers; decouple business logic from tech details.',
                fr: 'Organisez entités, cas d\'usage, adaptateurs et drivers ; découplez la logique métier des détails techniques.',
            },
            series: 'Application Design',
            title: {
                en: 'A journey into clean architecture',
                fr: 'Voyage au cœur de la Clean Architecture',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 12,
        published: true,
    },
    {
        filename: '2025-04-06 Fake News',
        metadata: {
            category: ArticleCategory.Project,
            dateModified: '2025-07-06',
            datePublished: '2025-04-06',
            description: {
                en: 'What if we could make questioning news and information bias genuinely fun? An exploration of how AI makes it possible.',
                fr: "Et si remettre en question l'information pouvait devenir vraiment amusant ? Une exploration de comment l'IA rend cela possible.",
            },
            title: {
                en: "Let's playfully question everything",
                fr: "Questionnons tout, en s'amusant",
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
                en: 'Practical insights on trends, tools, and mindset shifts.',
                fr: 'Insights pratiques sur les tendances, outils et changements de mindset.',
            },
            series: 'Using AI',
            title: {
                en: 'A guide to the AI revolution',
                fr: 'Guide de la révolution IA',
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
                en: 'Integrate AI tools, delegate cognitive work, and adopt mindsets for balance and future-proof skills.',
                fr: 'Intégrez les outils IA, déléguez le travail cognitif et adoptez les bons mindsets pour un équilibre et des compétences d\'avenir.',
            },
            series: 'Using AI',
            title: {
                en: 'A practical playbook to AI',
                fr: 'Un guide pratique de l\'IA',
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
                en: 'Abundant AI collapses execution costs, inverts value hierarchies, and moves human work up.',
                fr: 'L\'IA abondante effondre les coûts d\'exécution, inverse les hiérarchies de valeur et élève le travail humain.',
            },
            series: 'Using AI',
            title: {
                en: 'When execution collapses',
                fr: 'Quand l\'exécution s\'effondre',
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
                en: 'Abundant AI reimagines society into purpose-driven, post-physical communities.',
                fr: 'L\'IA abondante réimagine la société en communautés post-physiques guidées par le sens.',
            },
            series: 'Using AI',
            title: {
                en: 'Life after the collapse',
                fr: 'La vie après l\'effondrement',
            },
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 17,
        published: true,
    },
    {
        filename: '2025-05-18 Cursor',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-12',
            datePublished: '2025-05-18',
            description: {
                en: 'Learn context aware AI coding, agent mode, intent driven development.',
                fr: 'Apprenez le coding IA contextuel, le mode agent, le développement intentionnel.',
            },
            title: {
                en: 'Cursor: the compression of mechanical work',
                fr: 'Cursor : la compression du travail mécanique',
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
                en: 'A framework for AI integration in any field, from assistant to programmable intelligence.',
                fr: 'Un cadre d\'intégration de l\'IA dans tous les domaines, de l\'assistant à l\'intelligence programmable.',
            },
            series: 'Abundant Intelligence',
            title: {
                en: 'The four levels of AI integration',
                fr: 'Les quatre niveaux d\'intégration de l\'IA',
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
                en: 'Guide for developers to direct AI as guided agent, transforming coding into orchestration.',
                fr: 'Guide pour développeurs : diriger l\'IA comme agent guidé, transformer le codage en orchestration.',
            },
            series: 'Abundant Intelligence',
            title: {
                en: 'Directing AI agents',
                fr: 'Diriger les agents IA',
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
                en: 'Explore how to delegate workflows to autonomous ai agents.',
                fr: 'Explorez comment déléguer les flux de travail aux agents IA autonomes.',
            },
            series: 'Abundant Intelligence',
            title: {
                en: 'Autonomous AI agents',
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
                en: 'Deep dive into designing intelligent systems blending code and ai reasoning.',
                fr: 'Plongée au cœur de la conception de systèmes intelligents alliant code et raisonnement IA.',
            },
            series: 'Abundant Intelligence',
            title: {
                en: 'Programming intelligent systems',
                fr: 'Programmer des systèmes intelligents',
            },
        },
        previewImage: 'thumbnail.jpg',
        publicIndex: 23,
        published: true,
    },
];

const processMarkdownContent = (content: string, filename: string, cacheKey: string): string => {
    return content.replace(
        /!\[([^\]]*)\]\((?:\.\/)?assets\/([^)]+)\)/g,
        (match, altText, p1) =>
            // Point to the locally-served image so that <Image> receives an internal URL.
            `![${altText}](${CDN_BASE_URL}/${encodeURIComponent(filename)}/assets/${encodeURIComponent(p1)}?v=${cacheKey})`,
    );
};

const sanitizeText = (text: string | undefined): string | undefined =>
    text ? sanitizeAiText(text).cleaned : text;

const readMarkdownFile = async (
    articlesDirectory: string,
    filename: string,
    language: ArticleLanguage,
    cacheKey: string,
): Promise<string | undefined> => {
    try {
        const content = await fs.readFile(
            `${articlesDirectory}/${filename}/${language}.md`,
            'utf8',
        );
        return processMarkdownContent(content, filename, cacheKey);
    } catch {
        return undefined;
    }
};

export const readMarkdownArticles = async (): Promise<Article[]> => {
    const articlesDirectory = `${process.cwd()}/content`;

    return await Promise.all(
        ARTICLES_CONFIG.map(async ({ filename, previewImage, ...articleConfig }) => {
            const content: { [key in ArticleLanguage]?: string } = {};
            const cacheKey = articleConfig.metadata.dateModified.replace(/-/g, '');

            // Try to read both language versions
            const [enContent, frContent] = await Promise.all([
                readMarkdownFile(articlesDirectory, filename, 'en', cacheKey),
                readMarkdownFile(articlesDirectory, filename, 'fr', cacheKey),
            ]);

            if (enContent) content.en = sanitizeText(enContent)!;
            if (frContent) content.fr = sanitizeText(frContent)!;

            // If no content was found, throw error
            if (!Object.keys(content).length) {
                throw new Error(`No content found for article ${filename}`);
            }

            const imageUrl = previewImage
                ? `${CDN_BASE_URL}/${encodeURIComponent(filename)}/assets/${previewImage}?v=${cacheKey}`
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
                    series: articleConfig.metadata.series,
                    title: titleByLang,
                },
                publicIndex: articleConfig.publicIndex,
                published: articleConfig.published,
            } as Article;
        }),
    );
};
