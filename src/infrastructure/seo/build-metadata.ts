import type { Metadata } from 'next';

import { SITE_CONFIG } from '../../config/site';
import { buildSeoTitle } from './seo-utils';

/**
 * Options for building page metadata
 */
export interface BuildMetadataOptions {
    /** Alternate language versions for the page */
    alternateLanguages?: Record<string, string>;
    /** Article-specific OpenGraph fields (only used when type is 'article') */
    article?: {
        authors?: string[];
        modifiedTime?: string;
        publishedTime?: string;
        section?: string;
        tags?: string[];
    };
    /** Page description - used for meta description and social sharing */
    description: string;
    /** Optional image for social sharing - defaults to site default */
    image?: {
        alt: string;
        height?: number;
        /** Path or full URL to the image */
        path: string;
        width?: number;
    };
    /** Include Twitter creator/site attribution */
    includeTwitterAttribution?: boolean;
    /** Whether this content is related to 42 Paris school (adds "| 42" to title) */
    is42Related?: boolean;
    /** Optional keywords for SEO */
    keywords?: string[];
    /** OpenGraph locale (e.g., 'en', 'fr') */
    locale?: string;
    /** Alternate locales for OpenGraph */
    localeAlternates?: string[];
    /** Path relative to base URL (e.g., '/articles', '/experiments/my-app') */
    path?: string;
    /** Page title - will be suffixed with author name for social sharing */
    title: string;
    /** OpenGraph type - defaults to 'website' */
    type?: 'article' | 'website';
}

// Map short locales to OpenGraph territory format
const OG_LOCALES: Record<string, string> = {
    en: 'en_US',
    fr: 'fr_FR',
};

const toOgLocale = (locale: string): string => OG_LOCALES[locale] ?? locale;

// Resolve image URL - support both paths and full URLs
const resolveImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return imagePath;
};

/**
 * Builds Next.js Metadata object with consistent SEO structure
 * @description Eliminates duplication of description, title, and URL across metadata fields
 * @param options - Page-specific metadata options
 * @returns Complete Metadata object for Next.js
 */
export function buildMetadata(options: BuildMetadataOptions): Metadata {
    const {
        alternateLanguages,
        article,
        description,
        image,
        includeTwitterAttribution = false,
        is42Related = false,
        keywords,
        locale,
        localeAlternates,
        path = '',
        title,
        type = 'website',
    } = options;

    const url = `${SITE_CONFIG.baseUrl}${path}`;
    const fullTitle = buildSeoTitle(title, is42Related);

    // Hreflang best practice: always declare x-default (English is the fallback)
    const languages =
        alternateLanguages && alternateLanguages['en'] && !alternateLanguages['x-default']
            ? { ...alternateLanguages, 'x-default': alternateLanguages['en'] }
            : alternateLanguages;

    const ogImage = image
        ? {
              alt: image.alt,
              height: image.height ?? SITE_CONFIG.defaultImage.height,
              url: resolveImageUrl(image.path),
              width: image.width ?? SITE_CONFIG.defaultImage.width,
          }
        : {
              alt: SITE_CONFIG.defaultImage.alt,
              height: SITE_CONFIG.defaultImage.height,
              url: SITE_CONFIG.defaultImage.path,
              width: SITE_CONFIG.defaultImage.width,
          };

    return {
        alternates: {
            canonical: url,
            languages,
            // Re-declared here because a page-level `alternates` object fully
            // Replaces the root layout's — without this the RSS link vanishes.
            types: {
                'application/rss+xml': [
                    { title: `Articles by ${SITE_CONFIG.author.name}`, url: '/feed.xml' },
                ],
            },
        },
        description,
        keywords,
        metadataBase: new URL(SITE_CONFIG.baseUrl),
        openGraph: {
            alternateLocale: localeAlternates?.map(toOgLocale),
            description,
            images: [ogImage],
            locale: locale ? toOgLocale(locale) : undefined,
            siteName: SITE_CONFIG.author.name,
            title: fullTitle,
            type,
            url,
            ...(type === 'article' && article
                ? {
                      authors: article.authors,
                      modifiedTime: article.modifiedTime,
                      publishedTime: article.publishedTime,
                      section: article.section,
                      tags: article.tags,
                  }
                : {}),
        },
        title,
        twitter: {
            card: 'summary_large_image',
            creator: includeTwitterAttribution ? SITE_CONFIG.social.twitter : undefined,
            description,
            images: [ogImage.url],
            site: includeTwitterAttribution ? SITE_CONFIG.social.twitter : undefined,
            title: fullTitle,
        },
    };
}
