// Domain
import {
    DEFAULT_THEME,
    type ResolvedTheme,
    type Theme,
    THEME_STORAGE_KEY,
} from '../../presentation/theme/theme';

export interface ThemeRepository {
    getStoredTheme(): Theme;
    getSystemTheme(): ResolvedTheme;
    setStoredTheme(theme: Theme): void;
}

export class ThemeLocalStorageRepository implements ThemeRepository {
    getStoredTheme(): Theme {
        if (typeof window === 'undefined') {
            return DEFAULT_THEME;
        }

        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored;
        }

        return DEFAULT_THEME;
    }

    getSystemTheme(): ResolvedTheme {
        if (typeof window === 'undefined') {
            return 'light';
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setStoredTheme(theme: Theme): void {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
}
