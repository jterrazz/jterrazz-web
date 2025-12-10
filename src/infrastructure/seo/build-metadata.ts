import type { Metadata } from 'next';

import { SITE_CONFIG } from '../../config/site';

/**
 * Options for building page metadata
 */
export interface BuildMetadataOptions {
    /** Alternate language versions for the page */
    alternateLanguages?: Record<string, string>;
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

/**
 * Builds Next.js Metadata object with consistent SEO structure
 * @description Eliminates duplication of description, title, and URL across metadata fields
 * @param options - Page-specific metadata options
 * @returns Complete Metadata object for Next.js
 */
export function buildMetadata(options: BuildMetadataOptions): Metadata {
    const {
        alternateLanguages,
        description,
        image,
        includeTwitterAttribution = false,
        keywords,
        locale,
        localeAlternates,
        path = '',
        title,
        type = 'website',
    } = options;

    const url = `${SITE_CONFIG.baseUrl}${path}`;
    const fullTitle = `${title} | ${SITE_CONFIG.author.name}`;

    // Resolve image URL - support both paths and full URLs
    const resolveImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        return imagePath;
    };

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
            languages: alternateLanguages,
        },
        description,
        keywords,
        metadataBase: new URL(SITE_CONFIG.baseUrl),
        openGraph: {
            alternateLocale: localeAlternates,
            description,
            images: [ogImage],
            locale,
            siteName: SITE_CONFIG.author.name,
            title: fullTitle,
            type,
            url,
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
