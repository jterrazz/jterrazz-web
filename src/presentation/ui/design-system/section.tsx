import React from 'react';

import { cn } from '../../utils';

// Vertical rhythm wrapper. Three sizes let hero/section/inline content
// Share a consistent cadence without ad-hoc `py-*` everywhere.
const TONE_STYLES = {
    default: '',
    muted: 'bg-zinc-50 dark:bg-zinc-900/40',
} as const;

const SPACING_STYLES = {
    default: 'py-8 md:py-12',
    hero: 'py-12 md:py-20',
    tight: 'py-6 md:py-8',
} as const;

type SectionProps = {
    as?: 'div' | 'footer' | 'header' | 'section';
    children: React.ReactNode;
    className?: string;
    spacing?: keyof typeof SPACING_STYLES;
    tone?: keyof typeof TONE_STYLES;
};

export const Section: React.FC<SectionProps> = ({
    as: Tag = 'section',
    children,
    className,
    spacing = 'default',
    tone = 'default',
}) => (
    <Tag className={cn('relative', SPACING_STYLES[spacing], TONE_STYLES[tone], className)}>
        {children}
    </Tag>
);
