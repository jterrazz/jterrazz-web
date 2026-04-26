import React from 'react';

import { cn } from '../../utils';

// Universal minimal tag/pill — filled by default, sans-serif, greyscale.
// Sits next to titles or inline metadata. Three variants for hierarchy.
const VARIANT_STYLES = {
    ghost: 'text-zinc-500 dark:text-zinc-400',
    outline: 'ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 text-zinc-600 dark:text-zinc-400',
    solid: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
} as const;

type TagProps = {
    children: React.ReactNode;
    className?: string;
    variant?: keyof typeof VARIANT_STYLES;
    withDot?: boolean;
};

export const Tag: React.FC<TagProps> = ({
    children,
    className,
    variant = 'solid',
    withDot = false,
}) => (
    <span
        className={cn(
            'inline-flex items-center gap-1.5 font-medium text-xs leading-none tracking-tight px-2.5 py-1.5 rounded-full whitespace-nowrap',
            VARIANT_STYLES[variant],
            className,
        )}
    >
        {withDot && (
            <span
                aria-hidden
                className="w-1 h-1 rounded-full bg-zinc-500 dark:bg-zinc-400 shrink-0"
            />
        )}
        {children}
    </span>
);
