'use client';

import { IconDeviceDesktop, IconMoonFilled, IconSunFilled } from '@tabler/icons-react';
import React from 'react';

import { useTheme } from '../../../hooks/use-theme';
import type { Theme } from '../../../theme/theme';
// Utils
import { cn } from '../../../utils';

interface ToggleThemeProps {
    className?: string;
}

// Active-button styles rely on `theme` (from localStorage), which is unknown
// on the server. Defer the active state until after mount so server and
// client render the same neutral HTML and the user can switch cleanly.
export const ToggleTheme: React.FC<ToggleThemeProps> = ({ className }) => {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const options: { icon: React.ReactNode; label: string; value: Theme }[] = [
        { icon: <IconSunFilled size={14} />, label: 'Light', value: 'light' },
        { icon: <IconDeviceDesktop size={14} />, label: 'System', value: 'system' },
        { icon: <IconMoonFilled size={14} />, label: 'Dark', value: 'dark' },
    ];

    return (
        <div
            className={cn(
                'flex items-center gap-1 p-1 rounded-full bg-zinc-100 dark:bg-zinc-800',
                className,
            )}
        >
            {options.map((option) => {
                const isActive = mounted && theme === option.value;
                return (
                    <button
                        aria-label={`Switch to ${option.label} theme`}
                        className={cn(
                            'p-2 rounded-full transition-all duration-200',
                            isActive
                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200',
                        )}
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        type="button"
                    >
                        {option.icon}
                    </button>
                );
            })}
        </div>
    );
};
