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
                en: 'Hands-on guide: build your own malloc in C — learn mmap, buckets, first-fit, coalescing, alignment fixes to master dynamic memory.',
                fr: 'Guide pratique : construisez votre propre malloc en C — apprenez mmap, buckets, first-fit, coalescence et correctifs d\'alignement pour maîtriser la mémoire dynamique.',
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
            category: ArticleCategory.Code,
            dateModified: '2025-06-24',
            datePublished: '2019-06-07',
            description: {
                en: 'Implement SHA-256 and MD5 from scratch in C: bitwise ops, message padding, compression loops, test vectors, and performance tips.',
                fr: 'Implémentez SHA-256 et MD5 from scratch en C : opérations binaires, padding de messages, boucles de compression, vecteurs de test et conseils performance.',
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
            category: ArticleCategory.Code,
            dateModified: '2025-06-25',
            datePublished: '2019-07-25',
            description: {
                en: 'Comprehensive guide to Mach-O analysis on macOS: decode symbol tables, headers, sections, and build your own nm/otool utilities in C.',
                fr: 'Guide complet de l\'analyse Mach-O sur macOS : décodez tables de symboles, en-têtes, sections et construisez vos propres utilitaires nm/otool en C.',
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
            category: ArticleCategory.Code,
            dateModified: '2025-06-26',
            datePublished: '2019-08-27',
            description: {
                en: 'Hands-on guide: craft self-replicating quine programs in multiple languages, understand theory, and master code that prints itself.',
                fr: 'Guide pratique : créez des programmes quines auto-répliquants dans plusieurs langages, comprenez la théorie et maîtrisez le code qui s\'imprime lui-même.',
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
            category: ArticleCategory.Code,
            dateModified: '2025-06-27',
            datePublished: '2019-08-28',
            description: {
                en: 'Step-by-step intro to assembly: set up toolchain, grasp registers & calling conventions, and code/link your first assembly functions.',
                fr: 'Introduction pas-à-pas à l\'assembleur : installez la toolchain, maîtrisez registres et conventions d\'appel, codez et linkez vos premières fonctions assembleur.',
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
            category: ArticleCategory.Code,
            dateModified: '2025-06-28',
            datePublished: '2019-09-10',
            description: {
                en: 'Step-by-step guide to expert systems: code a backward-chaining inference engine in Python, with rules, facts, and reasoning examples.',
                fr: 'Guide pas-à-pas des systèmes experts : codez un moteur d\'inférence à chaînage arrière en Python, avec règles, faits et exemples de raisonnement.',
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
            category: ArticleCategory.Code,
            dateModified: '2025-06-29',
            datePublished: '2020-11-03',
            description: {
                en: 'Hands-on tutorial: set up a lightweight web server in TypeScript using Koa — routing, middleware, typing, and testing in minutes.',
                fr: 'Tutoriel pratique : montez un serveur web léger en TypeScript avec Koa — routing, middleware, typage et tests en quelques minutes.',
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
            category: ArticleCategory.Build,
            dateModified: '2025-07-01',
            datePublished: '2023-07-02',
            description: {
                en: 'Reimagine online shopping: open, decentralized platform links local shops to customers, reviving community, transparency & competition.',
                fr: 'Réinventer le e-commerce : une plateforme ouverte et décentralisée qui relie commerces locaux et clients, ravivant communauté, transparence et concurrence.',
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
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2025-07-02',
            datePublished: '2024-12-20',
            description: {
                en: 'Learn application-design essentials: manage dependencies, layer architecture, and craft maintainable, growth-ready code.',
                fr: "Apprenez les essentiels de la conception applicative : gérer les dépendances, architecturer en couches et créer du code maintenable et prêt à grandir.",
            },
            title: {
                en: 'Application design: building software that lasts',
                fr: 'Conception applicative : bâtir des logiciels qui durent',
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
                en: 'Tame complexity with application design — principles for sustainable architecture, maintainable code, and growth-ready scalable apps.',
                fr: "Domptez la complexité avec la conception applicative — principes pour une architecture durable, du code maintenable et des apps évolutives prêtes à grandir.",
            },
            title: {
                en: 'Application design: mastering the flow of dependencies',
                fr: "Conception applicative : maîtriser le flux des dépendances",
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
                en: 'Decode business and technical architectures: align strategy, capabilities, and tech layers to deliver scalable, value-driven systems.',
                fr: "Décodez les architectures métier et techniques : alignez stratégie, capacités et couches tech pour livrer des systèmes évolutifs et créateurs de valeur.",
            },
            title: {
                en: 'Application design: separating business from technology',
                fr: 'Conception applicative : séparer le métier de la technologie',
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
                en: 'Build scalable apps with Clean Architecture: layer entities, use cases, adapters & drivers; decouple business logic from tech details.',
                fr: "Construisez des apps évolutives avec la Clean Architecture : organisez entités, cas d'usage, adaptateurs et drivers ; découplez la logique métier des détails techniques.",
            },
            title: {
                en: 'Application design: a journey into clean architecture',
                fr: 'Conception applicative : voyage au cœur de la Clean Architecture',
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
                en: 'Navigate the AI revolution: practical insights on trends, tools, and mindset shifts to future-proof work, creativity, and careers.',
                fr: "Naviguez dans la révolution IA : insights pratiques sur les tendances, outils et changements de mindset pour sécuriser travail, créativité et carrières.",
            },
            title: {
                en: 'Abundant intelligence: a guide to the revolution',
                fr: "Intelligence abondante : guide de la révolution",
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
                en: 'Practical roadmap to integrate AI tools, delegate cognitive work, and adopt mindsets for balance and future-proof skills.',
                fr: "Feuille de route pratique pour intégrer les outils IA, déléguer le travail cognitif et adopter les bons mindsets pour un équilibre et des compétences d'avenir.",
            },
            title: {
                en: 'Abundant intelligence: a practical playbook',
                fr: "Intelligence abondante : un guide pratique",
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
                en: 'Abundant AI collapses execution costs, inverts value hierarchies, and moves human work up to ideas, taste, and strategic direction.',
                fr: "L'IA abondante effondre les coûts d'exécution, inverse les hiérarchies de valeur et élève le travail humain vers les idées, le goût et la direction stratégique.",
            },
            title: {
                en: 'Abundant intelligence: when execution collapses',
                fr: "Intelligence abondante : quand l'exécution s'effondre",
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
                en: 'Abundant AI collapses execution costs, decentralizes work, and reimagines society into purpose-driven, post-physical communities.',
                fr: "L'IA abondante effondre les coûts d'exécution, décentralise le travail et réimagine la société en communautés post-physiques guidées par le sens.",
            },
            title: {
                en: 'Abundant intelligence: life after the collapse',
                fr: "Intelligence abondante : la vie après l'effondrement",
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
                en: 'Boost dev productivity with Cursor: learn context-aware AI coding, agent mode, intent-driven development & pro tips from daily use.',
                fr: 'Boostez votre productivité de dév avec Cursor : apprenez le coding IA contextuel, le mode agent, le développement intentionnel et les astuces pro d\'usage quotidien.',
            },
            title: {
                en: 'Cursor, a practical guide to AI-powered development',
                fr: "Cursor, mon guide pratique du développement assisté par l'IA",
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
                en: 'Explore a practical framework for AI integration in any field, from assistant to programmable intelligence. Boost productivity & creativity',
                fr: "Explorez un cadre pratique d'intégration de l'IA dans tous les domaines, de l'assistant à l'intelligence programmable. Boostez productivité et créativité.",
            },
            title: {
                en: 'Using AI: A practical four-level framework',
                fr: "Utiliser l'IA : un cadre pratique en quatre niveaux",
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
                en: 'Guide for developers to direct AI as guided agent, transforming coding into orchestration with tools like cursor and intention-driven dev.',
                fr: "Guide pour développeurs : diriger l'IA comme agent guidé, transformer le codage en orchestration avec des outils comme Cursor et le développement intentionnel.",
            },
            title: {
                en: 'Using AI: Prompting the implementation',
                fr: "Utiliser l'IA : guider l'implémentation",
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
                en: 'Explore how developers delegate workflows to autonomous ai agents, using model-centric protocols and sandboxes for secure, scalable…',
                fr: "Explorez comment les développeurs délèguent les flux de travail aux agents IA autonomes, avec protocoles centrés sur les modèles et bacs à sable sécurisés.",
            },
            title: {
                en: 'Using AI: Delegating the workflow',
                fr: "Utiliser l'IA : déléguer le workflow",
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
                en: 'Deep dive into designing intelligent systems blending code and ai reasoning for self-optimizing solutions in software development.',
                fr: "Plongée au cœur de la conception de systèmes intelligents alliant code et raisonnement IA pour des solutions auto-optimisantes en développement logiciel.",
            },
            title: {
                en: 'Using AI: Designing the intelligence',
                fr: "Utiliser l'IA : concevoir l'intelligence",
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
