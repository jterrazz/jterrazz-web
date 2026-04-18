import { IconArrowRight } from '@tabler/icons-react';
import React from 'react';

import { Link } from '../../../infrastructure/navigation/navigation';
import { cn } from '../../utils';

// Inline link with an arrow that slides on hover. Replaces pill-style CTAs
// for a lighter, editorial feel. `variant="mono"` matches the kicker/section
// vocabulary and is intended for ancillary links next to mono labels.
type ArrowLinkProps = {
    children: React.ReactNode;
    className?: string;
    href: string;
    tone?: 'primary' | 'muted' | 'subtle';
    variant?: 'default' | 'mono';
};

const TONE_STYLES: Record<NonNullable<ArrowLinkProps['tone']>, string> = {
    muted: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
    primary: 'text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300',
    subtle: 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
};

const VARIANT_STYLES: Record<NonNullable<ArrowLinkProps['variant']>, string> = {
    default: 'text-sm font-medium gap-1.5',
    mono: 'font-mono text-xs uppercase tracking-widest gap-2',
};

const ICON_SIZE: Record<NonNullable<ArrowLinkProps['variant']>, string> = {
    default: 'w-4 h-4',
    mono: 'w-3 h-3',
};

export const ArrowLink: React.FC<ArrowLinkProps> = ({
    children,
    className,
    href,
    tone = 'primary',
    variant = 'default',
}) => {
    const isExternal = /^https?:\/\//.test(href);
    return (
        <Link
            className={cn(
                'group inline-flex items-center transition-colors',
                VARIANT_STYLES[variant],
                TONE_STYLES[tone],
                className,
            )}
            href={href}
            target={isExternal ? '_blank' : undefined}
        >
            {children}
            <IconArrowRight
                className={cn('transition-transform group-hover:translate-x-0.5', ICON_SIZE[variant])}
            />
        </Link>
    );
};
