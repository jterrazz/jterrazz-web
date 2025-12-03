import React from 'react';

import { cn } from '../../utils';

export const HighlightedText = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <span
            className={cn(
                'relative inline-block leading-relaxed rounded-lg',
                'bg-gradient-to-b from-transparent via-zinc-300/50 to-transparent',
                'dark:via-zinc-700/50',
                'transition-transform duration-300 ease-out',
                'hover:scale-[1.02]',
                className,
            )}
        >
            {/* Decorative background layers */}
            <span
                aria-hidden="true"
                className={cn(
                    'absolute inset-0 -left-2 -right-2 -z-10',
                    'bg-zinc-300/40 dark:bg-zinc-700/40',
                    'rounded-lg blur-[1px]',
                    'transform -skew-y-1',
                    'transition-all duration-300',
                    'group-hover:scale-105',
                )}
            />
            <span
                aria-hidden="true"
                className={cn(
                    'absolute bottom-0 left-0 right-0 h-1/2 -z-10',
                    'bg-zinc-300/30 dark:bg-zinc-700/30',
                    'rounded-lg blur-[1px]',
                    'transform skew-y-1',
                    'transition-all duration-300',
                )}
            />
            {children}
        </span>
    );
};
