import React from 'react';

import { cn } from '../../utils';

// Small mono uppercase label with an optional leading rule. Pairs above a
// Heading to label a page/section without competing with it visually.
type KickerProps = {
    children: React.ReactNode;
    className?: string;
    rule?: boolean;
};

export const Kicker: React.FC<KickerProps> = ({ children, className, rule = true }) => (
    <div
        className={cn(
            'flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400',
            className,
        )}
    >
        {rule && <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-700" aria-hidden />}
        <span>{children}</span>
    </div>
);

// Unified heading. `size` controls visual weight; `as` controls semantics.
// Default `as` is derived from size but can be overridden for SEO/a11y.
type HeadingSize = 'display' | 'heading' | 'title';

const HEADING_STYLES: Record<HeadingSize, string> = {
    display:
        'text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 text-balance',
    heading:
        'text-2xl md:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50 text-balance',
    title: 'text-sm font-medium tracking-tight text-zinc-900 dark:text-zinc-50',
};

const DEFAULT_TAG: Record<HeadingSize, 'h1' | 'h2' | 'h3'> = {
    display: 'h1',
    heading: 'h2',
    title: 'h3',
};

type HeadingProps = {
    as?: 'h1' | 'h2' | 'h3' | 'h4';
    children: React.ReactNode;
    className?: string;
    size?: HeadingSize;
};

// Inline accent for prose inside a Heading — italic serif, tight tracking.
// Use sparingly on 1–2 words to give an editorial lift.
type AccentProps = {
    children: React.ReactNode;
    className?: string;
};

export const Accent: React.FC<AccentProps> = ({ children, className }) => (
    <span className={cn('font-serif italic font-normal tracking-tight', className)}>
        {children}
    </span>
);

export const Heading: React.FC<HeadingProps> = ({
    as,
    children,
    className,
    size = 'display',
}) => {
    const Tag = as ?? DEFAULT_TAG[size];
    return <Tag className={cn(HEADING_STYLES[size], className)}>{children}</Tag>;
};

// Body paragraph meant to sit below a Heading. Wider than a caption,
// narrower than a full article. Use for hero subtitles and section intros.
type LeadProps = {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
};

const LEAD_STYLES: Record<NonNullable<LeadProps['size']>, string> = {
    lg: 'text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty max-w-2xl',
    md: 'text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty max-w-2xl',
    sm: 'text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed text-pretty',
};

export const Lead: React.FC<LeadProps> = ({ children, className, size = 'lg' }) => (
    <p className={cn(LEAD_STYLES[size], className)}>{children}</p>
);

// Mono caption for auxiliary info — status lines, timestamps, counts.
// Deliberately muted to sit alongside interactive elements without competing.
type MetaProps = {
    children: React.ReactNode;
    className?: string;
};

export const Meta: React.FC<MetaProps> = ({ children, className }) => (
    <span
        className={cn(
            'font-mono text-xs text-zinc-500 dark:text-zinc-500 tracking-tight',
            className,
        )}
    >
        {children}
    </span>
);
