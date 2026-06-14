import { type Locale } from '../../i18n/config';

const DATE_LOCALE_MAP: Record<Locale, string> = {
    en: 'en-US',
    fr: 'fr-FR',
};

/**
 * Format an ISO date string for display, localized to the given app locale.
 * Defaults to the long, human-readable form (e.g. "Jun 14, 2026").
 */
export function formatDate(
    date: string,
    locale: Locale = 'en',
    options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
    return new Date(date).toLocaleDateString(DATE_LOCALE_MAP[locale] ?? 'en-US', options);
}
