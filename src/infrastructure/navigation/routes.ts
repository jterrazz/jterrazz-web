import { defaultLocale } from '../../i18n/config';

/**
 * Application route definitions
 * @description Centralized, type-safe route configuration for the entire app
 */
export const AppRoutes = {
    // Main pages
    home: '/',
    articles: '/articles',
    experiments: '/experiments',
    photographs: '/photographs',

    // Dynamic routes
    article: (slugId: string) => `/articles/${slugId}` as const,
    experiment: (slug: string) => `/experiments/${slug}` as const,
    experimentPrivacy: (slug: string) => `/experiments/${slug}/privacy` as const,
} as const;

/**
 * External link definitions
 * @description Centralized external URLs to avoid broken links
 */
export const ExternalLinks = {
    // App store links
    n00AppStore: '/link/applications/n00',

    // Social links are handled via userRepository
} as const;

/**
 * Builds a locale-aware URL
 * @param path - The path to navigate to
 * @param locale - Current locale
 * @returns Locale-prefixed path (no prefix for default locale)
 */
export function buildLocalePath(path: string, locale: string): string {
    if (locale === defaultLocale) {
        return path;
    }
    return `/${locale}${path}`;
}

/**
 * Type-safe route builder with locale support
 * @description Use this to build all internal navigation URLs
 */
export function createRouteBuilder(locale: string) {
    const prefix = locale === defaultLocale ? '' : `/${locale}`;

    return {
        // Static routes
        home: () => `${prefix}/`,
        articles: () => `${prefix}/articles`,
        experiments: () => `${prefix}/experiments`,
        photographs: () => `${prefix}/photographs`,

        // Dynamic routes
        article: (slugId: string) => `${prefix}/articles/${slugId}`,
        experiment: (slug: string) => `${prefix}/experiments/${slug}`,
        experimentPrivacy: (slug: string) => `${prefix}/experiments/${slug}/privacy`,
    } as const;
}

/**
 * Route builder type for use in components
 */
export type RouteBuilder = ReturnType<typeof createRouteBuilder>;
