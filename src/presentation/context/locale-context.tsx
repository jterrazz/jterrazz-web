'use client';

import React, { createContext, useContext } from 'react';

import { defaultLocale, type Locale } from '../../i18n/config';

type LocaleContextValue = {
    locale: Locale;
    /**
     * Builds a locale-aware path
     * @param path - The path to navigate to (e.g., '/articles')
     * @returns The path with locale prefix if needed
     */
    localePath: (path: string) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
    locale: defaultLocale,
    localePath: (path) => path,
});

type LocaleProviderProps = {
    children: React.ReactNode;
    locale: Locale;
};

/**
 * Provider for locale-aware navigation
 * @description Wrap client components that need locale-aware links
 */
export function LocaleProvider({ children, locale }: LocaleProviderProps) {
    const localePath = (path: string): string => {
        if (locale === defaultLocale) {
            return path;
        }
        // Don't double-prefix
        if (path.startsWith(`/${locale}`)) {
            return path;
        }
        return `/${locale}${path}`;
    };

    return (
        <LocaleContext.Provider value={{ locale, localePath }}>{children}</LocaleContext.Provider>
    );
}

/**
 * Hook to access locale and localePath
 */
export function useLocale() {
    return useContext(LocaleContext);
}

