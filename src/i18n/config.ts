/**
 * i18n configuration
 * @description Defines supported locales and default locale for the application
 */

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

