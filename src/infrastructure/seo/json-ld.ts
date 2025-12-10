import { SITE_CONFIG } from '../../config/site';

/**
 * JSON-LD structured data builders for SEO
 * @description Provides type-safe builders for Schema.org structured data
 */

// ============================================================================
// Shared Types & Builders
// ============================================================================

/**
 * Schema.org Person object for the site author
 */
export function buildAuthorJsonLd() {
    return {
        '@type': 'Person' as const,
        name: SITE_CONFIG.author.name,
        url: SITE_CONFIG.author.url,
    };
}

/**
 * Full Person schema for homepage/about pages
 */
export interface PersonJsonLdOptions {
    description: string;
}

export function buildPersonJsonLd(options: PersonJsonLdOptions) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        alumniOf: {
            '@type': 'Organization',
            name: SITE_CONFIG.author.alumniOf,
        },
        description: options.description,
        hasOccupation: {
            '@type': 'Occupation',
            description: options.description,
            name: SITE_CONFIG.author.jobTitle,
        },
        image: `${SITE_CONFIG.baseUrl}${SITE_CONFIG.defaultImage.path}`,
        jobTitle: SITE_CONFIG.author.jobTitle,
        knowsAbout: SITE_CONFIG.author.skills,
        name: SITE_CONFIG.author.name,
        sameAs: [SITE_CONFIG.social.github, SITE_CONFIG.social.medium, SITE_CONFIG.social.pexels],
        url: SITE_CONFIG.baseUrl,
        worksFor: {
            '@type': 'Organization',
            name: 'Self-Employed',
        },
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
        description: options.description,
        name: options.description,
        thumbnailUrl: options.contentUrl,
    };
}
