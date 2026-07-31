import { defaultLocale } from '../../i18n/config';

/**
 * External link definitions
 * @description Centralized external URLs to avoid broken links
 */
export const ExternalLinks = {
    // App smart redirect links (dynamic based on experiment slug)
    appRedirect: (slug: string) => `/go/${slug}` as const,
    signewApp: '/go/signews',

    // Social links are handled via userRepository
} as const;

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
