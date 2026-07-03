import { IconArrowRight } from '@tabler/icons-react';
import React from 'react';

import { Link } from '../../../infrastructure/navigation/navigation';
import { cn } from '../../utils';

// Inline link with an arrow that slides on hover. Replaces pill-style CTAs
// For a lighter, editorial feel. One voice everywhere: sans, medium weight.
type ArrowLinkProps = {
    children: React.ReactNode;
    className?: string;
    href: string;
    tone?: 'muted' | 'primary' | 'subtle';
};

const TONE_STYLES: Record<NonNullable<ArrowLinkProps['tone']>, string> = {
    muted: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
    primary: 'text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300',
    subtle: 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
};

export const ArrowLink: React.FC<ArrowLinkProps> = ({
    children,
    className,
    href,
    tone = 'primary',
}) => {
    const isExternal = /^https?:\/\//.test(href);
    return (
        <Link
            className={cn(
                'group inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
                TONE_STYLES[tone],
                className,
            )}
            href={href}
            target={isExternal ? '_blank' : undefined}
        >
            {children}
            <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
    );
};
