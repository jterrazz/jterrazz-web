import { SITE_CONFIG } from '../../config/site';

/**
 * JSON-LD structured data builders for SEO
 * @description Provides type-safe builders for Schema.org structured data
 */

// ============================================================================
// Shared Types & Builders
// ============================================================================

/**
 * Stable entity ids — the same Person/WebSite must resolve to one node across
 * every page so engines consolidate the entity instead of seeing variants.
 */
export const PERSON_ID = `${SITE_CONFIG.baseUrl}/#person`;
export const WEBSITE_ID = `${SITE_CONFIG.baseUrl}/#website`;

/**
 * Schema.org Person reference for authored content — resolves to the
 * canonical Person entity via @id.
 */
export function buildAuthorJsonLd() {
    return {
        '@id': PERSON_ID,
        '@type': 'Person' as const,
        name: SITE_CONFIG.author.name,
        url: SITE_CONFIG.author.url,
    };
}

/**
 * The canonical Person entity — one definition, referenced everywhere by @id
 */
export interface PersonJsonLdOptions {
    description?: string;
}

export function buildPersonJsonLd(options: PersonJsonLdOptions = {}) {
    const description = options.description ?? SITE_CONFIG.description;
    return {
        '@id': PERSON_ID,
        '@type': 'Person',
        alumniOf: {
            '@type': 'Organization',
            name: SITE_CONFIG.author.alumniOf,
        },
        description,
        email: `mailto:${SITE_CONFIG.author.email}`,
        hasOccupation: {
            '@type': 'Occupation',
            description,
            name: SITE_CONFIG.author.jobTitle,
        },
        image: `${SITE_CONFIG.baseUrl}${SITE_CONFIG.author.image}`,
        jobTitle: SITE_CONFIG.author.jobTitle,
        knowsAbout: SITE_CONFIG.author.skills,
        name: SITE_CONFIG.author.name,
        sameAs: [
            SITE_CONFIG.social.github,
            SITE_CONFIG.social.linkedin,
            SITE_CONFIG.social.medium,
            SITE_CONFIG.social.pexels,
            SITE_CONFIG.social.x,
        ],
        url: SITE_CONFIG.baseUrl,
    };
}

/**
 * The WebSite entity, published by the canonical Person
 */
export function buildWebSiteJsonLd() {
    return {
        '@id': WEBSITE_ID,
        '@type': 'WebSite',
        description: SITE_CONFIG.description,
        inLanguage: ['en', 'fr'],
        name: SITE_CONFIG.author.name,
        publisher: { '@id': PERSON_ID },
        url: SITE_CONFIG.baseUrl,
    };
}

/**
 * Site-wide identity graph (WebSite + Person), rendered once in the root
 * layout so every page carries the same canonical entities.
 */
export function buildSiteIdentityJsonLd(options: PersonJsonLdOptions = {}) {
    return {
        '@context': 'https://schema.org',
        '@graph': [buildWebSiteJsonLd(), buildPersonJsonLd(options)],
    };
}

// ============================================================================
// Breadcrumbs
// ============================================================================

export interface BreadcrumbJsonLdOptions {
    /** Ordered trail from root to current page */
    items: Array<{ name: string; url: string }>;
}

export function buildBreadcrumbJsonLd(options: BreadcrumbJsonLdOptions) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: options.items.map((item, index) => ({
            '@type': 'ListItem',
            item: item.url,
            name: item.name,
            position: index + 1,
        })),
    };
}

// ============================================================================
// Article Detail Page (full BlogPosting)
// ============================================================================

export interface ArticleJsonLdOptions {
    dateModified: string;
    datePublished: string;
    description: string;
    headline: string;
    /** Absolute URL of the article cover image */
    imageUrl?: string;
    inLanguage: string | string[];
    /** Reading time in minutes, mapped to ISO-8601 timeRequired */
    readingTimeMinutes?: number;
    /** Canonical absolute URL of the article */
    url: string;
    wordCount?: number;
}

export function buildArticleJsonLd(options: ArticleJsonLdOptions) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        author: buildAuthorJsonLd(),
        dateModified: options.dateModified,
        datePublished: options.datePublished,
        description: options.description,
        headline: options.headline,
        ...(options.imageUrl && { image: [options.imageUrl] }),
        inLanguage: options.inLanguage,
        isAccessibleForFree: true,
        mainEntityOfPage: {
            '@id': options.url,
            '@type': 'WebPage',
        },
        publisher: buildAuthorJsonLd(),
        ...(options.readingTimeMinutes && { timeRequired: `PT${options.readingTimeMinutes}M` }),
        url: options.url,
        ...(options.wordCount && { wordCount: options.wordCount }),
    };
}

// ============================================================================
// Collection Page (Articles, Experiments, Photographs)
// ============================================================================

export interface CollectionPageJsonLdOptions {
    /** Page description */
    description: string;
    /** Items in the collection */
    items: Array<Record<string, unknown>>;
    /** Collection name/title */
    name: string;
    /** Full URL of the page */
    url: string;
}

export function buildCollectionPageJsonLd(options: CollectionPageJsonLdOptions) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description: options.description,
        hasPart: options.items,
        name: options.name,
        url: options.url,
    };
}

// ============================================================================
// Blog Posting (Article items)
// ============================================================================

export interface BlogPostingJsonLdOptions {
    dateModified: string;
    datePublished: string;
    description: string;
    languages: string[];
    title: string;
    url: string;
}

export function buildBlogPostingJsonLd(options: BlogPostingJsonLdOptions) {
    return {
        '@type': 'BlogPosting',
        author: buildAuthorJsonLd(),
        dateModified: options.dateModified,
        datePublished: options.datePublished,
        description: options.description,
        inLanguage: options.languages,
        name: options.title,
        url: options.url,
    };
}

// ============================================================================
// Software Application (Experiment items)
// ============================================================================

export interface SoftwareApplicationJsonLdOptions {
    description: string;
    name: string;
    url: string;
}

export function buildSoftwareApplicationJsonLd(options: SoftwareApplicationJsonLdOptions) {
    return {
        '@type': 'SoftwareApplication',
        applicationCategory: 'ProductivityApplication',
        author: buildAuthorJsonLd(),
        description: options.description,
        name: options.name,
        url: options.url,
    };
}

// ============================================================================
// Image Object (Photograph items)
// ============================================================================

export interface ImageObjectJsonLdOptions {
    contentUrl: string;
    description: string;
}

export function buildImageObjectJsonLd(options: ImageObjectJsonLdOptions) {
    return {
        '@type': 'ImageObject',
        author: buildAuthorJsonLd(),
        contentUrl: options.contentUrl,
        copyrightNotice: `© ${SITE_CONFIG.author.name}`,
        creator: buildAuthorJsonLd(),
        creditText: SITE_CONFIG.author.name,
        description: options.description,
        name: options.description,
        thumbnailUrl: options.contentUrl,
    };
}

// ============================================================================
// Experiment Detail Page (SoftwareSourceCode with optional LearningResource)
// ============================================================================

export interface ExperimentDetailJsonLdOptions {
    /** Code repository URL (e.g., GitHub) */
    codeRepository?: string;
    /** Experiment description */
    description: string;
    /** Whether this is a 42 Paris school project */
    is42Project: boolean;
    /** Experiment name */
    name: string;
    /** Full URL of the experiment page */
    url: string;
    /** Year the experiment was created */
    year: number;
}

export function buildExperimentDetailJsonLd(options: ExperimentDetailJsonLdOptions) {
    const base = {
        '@context': 'https://schema.org',
        '@type': options.is42Project
            ? ['SoftwareSourceCode', 'LearningResource']
            : 'SoftwareSourceCode',
        author: buildAuthorJsonLd(),
        codeRepository: options.codeRepository,
        dateCreated: `${options.year}-01-01`,
        description: options.description,
        name: options.name,
        url: options.url,
    };

    // Add educational organization for 42 projects
    if (options.is42Project) {
        return {
            ...base,
            educationalLevel: 'Advanced',
            provider: {
                '@type': 'EducationalOrganization',
                name: '42 Paris',
                url: 'https://42.fr',
            },
        };
    }

    return base;
}
