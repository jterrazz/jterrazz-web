import React from 'react';

import { ArrowLink } from '../../design-system';
import { cn } from '../../../utils';

export type DividerSectionProps = {
    as?: 'h2' | 'h3' | 'h4' | 'span';
    className?: string;
    index?: number;
    link?: {
        href: string;
        text: string;
    };
    title: string;
};

// Section label in mono uppercase with an optional 2-digit index.
// Mirrors the hero Kicker so every section shares the same signature.
export const DividerSection: React.FC<DividerSectionProps> = ({
    as: Tag = 'h2',
    className,
    index,
    link,
    title,
}) => {
    const paddedIndex = index !== undefined ? String(index).padStart(2, '0') : null;
    return (
        <div className={cn('flex items-center w-full gap-4', className)}>
            <Tag className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 whitespace-nowrap flex items-center gap-3">
                {paddedIndex && (
                    <span className="text-zinc-400 dark:text-zinc-600">{paddedIndex}</span>
                )}
                <span>{title}</span>
            </Tag>
            <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent" />
            {link && (
                <ArrowLink
                    className="hidden md:inline-flex whitespace-nowrap"
                    href={link.href}
                    tone="subtle"
                    variant="mono"
                >
                    {link.text}
                </ArrowLink>
            )}
        </div>
    );
};
