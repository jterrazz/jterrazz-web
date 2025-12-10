import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, isValidLocale } from './config';

/**
 * next-intl request configuration
 * @description Provides locale-specific configuration for each request
 */
export default getRequestConfig(async ({ requestLocale }) => {
    // Get the locale from the request (set by middleware)
    let locale = await requestLocale;

    // Validate and fallback to default
    if (!locale || !isValidLocale(locale)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
