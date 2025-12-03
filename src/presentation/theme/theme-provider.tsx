'use client';

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_THEME, type ResolvedTheme, type Theme } from './theme';

import { ThemeLocalStorageRepository } from '../../infrastructure/repositories/theme-local-storage.repository';

export interface ThemeContextValue {
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    theme: Theme;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
}

// Apply theme class to document - defined outside component to avoid recreation
const applyThemeToDOM = (resolved: ResolvedTheme): void => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
};

// Get system theme preference
const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Resolve theme value to light or dark
const resolveThemeValue = (themeValue: Theme): ResolvedTheme => {
    if (themeValue === 'system') {
        return getSystemTheme();
    }
    return themeValue;
};

// Get initial theme from localStorage
const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
    }
    return DEFAULT_THEME;
};

// Get initial resolved theme from DOM (set by inline script)
const getInitialResolvedTheme = (): ResolvedTheme => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getInitialResolvedTheme);

    const repository = useMemo(() => new ThemeLocalStorageRepository(), []);

    // Set theme function - updates state, localStorage, and DOM
    const setTheme = useCallback(
        (newTheme: Theme) => {
            const resolved = resolveThemeValue(newTheme);

            // Update state
            setThemeState(newTheme);
            setResolvedTheme(resolved);

            // Persist to localStorage
            repository.setStoredTheme(newTheme);

            // Apply to DOM immediately
            applyThemeToDOM(resolved);
        },
        [repository],
    );

    // Listen for system theme changes when in "system" mode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemChange = (): void => {
            if (theme === 'system') {
                const resolved = getSystemTheme();
                setResolvedTheme(resolved);
                applyThemeToDOM(resolved);
            }
        };

        mediaQuery.addEventListener('change', handleSystemChange);
        return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }, [theme]);

    const value = useMemo(
        () => ({
            resolvedTheme,
            setTheme,
            theme,
        }),
        [theme, resolvedTheme, setTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
