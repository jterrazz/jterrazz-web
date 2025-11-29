'use client';

import React from 'react';

import { Monitor, Moon, Sun } from 'lucide-react';

// Domain
import type { Theme } from '../../domain/theme';

// Utils
import { cn } from '../../lib/utils';

import { useTheme } from '../../hooks/use-theme';

interface ThemeToggleProps {
    className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
    const { setTheme, theme } = useTheme();

    const options: { icon: React.ReactNode; label: string; value: Theme }[] = [
        { icon: <Sun size={14} />, label: 'Light', value: 'light' },
        { icon: <Monitor size={14} />, label: 'System', value: 'system' },
        { icon: <Moon size={14} />, label: 'Dark', value: 'dark' },
    ];

    return (
        <div
            className={cn(
                'flex items-center gap-1 p-1 rounded-full bg-zinc-100 dark:bg-zinc-800',
                className,
            )}
        >
            {options.map((option) => (
                <button
                    aria-label={`Switch to ${option.label} theme`}
                    className={cn(
                        'p-2 rounded-full transition-all duration-200',
                        theme === option.value
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200',
                    )}
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    type="button"
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
};
