import {
    personId,
    projectAuthorRef,
    projectIdentityGraph,
    projectPerson,
    projectWebSite,
} from '@jterrazz/reach';

import { site } from '../../../reach.config';
import { SITE_CONFIG } from '../../config/site';

/**
 * JSON-LD structured data builders for SEO
 * @description The identity graph is projected by @jterrazz/reach from
 * reach.config.ts; the content builders below (articles, experiments,
 * photographs) stay app-specific and reference the canonical Person by @id.
 */

// ============================================================================
// Identity (projected from reach.config.ts)
// ============================================================================

export const PERSON_ID = personId(site);

/** Schema.org Person reference for authored content — resolves via @id. */
export function buildAuthorJsonLd() {
    return projectAuthorRef(site);
}

export function buildPersonJsonLd() {
    return projectPerson(site);
}

export function buildWebSiteJsonLd() {
    return projectWebSite(site);
}

/**
 * Site-wide identity graph (WebSite + Person), rendered once in the root
 * layout so every page carries the same canonical entities.
 */
export function buildSiteIdentityJsonLd() {
    return projectIdentityGraph(site);
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
