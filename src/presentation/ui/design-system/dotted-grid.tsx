import React from 'react';

import { cn } from '../../utils';

// Decorative dotted-grid backdrop, masked with a radial fade so it
// Disappears at the edges. Sits behind hero content. Purely aesthetic —
// Always `aria-hidden`.
type DottedGridProps = {
    className?: string;
    intensity?: 'low' | 'medium';
    origin?: 'center' | 'top-left' | 'top-right';
};

const ORIGIN_MASKS: Record<NonNullable<DottedGridProps['origin']>, string> = {
    center: 'radial-gradient(ellipse 70% 55% at 50% 40%, black 25%, transparent 80%)',
    'top-left': 'radial-gradient(ellipse 70% 55% at 20% 40%, black 25%, transparent 80%)',
    'top-right': 'radial-gradient(ellipse 70% 55% at 80% 40%, black 25%, transparent 80%)',
};

const INTENSITY_OPACITY: Record<NonNullable<DottedGridProps['intensity']>, string> = {
    low: 'opacity-[0.12] dark:opacity-[0.08]',
    medium: 'opacity-[0.18] dark:opacity-[0.12]',
};

export const DottedGrid: React.FC<DottedGridProps> = ({
    className,
    intensity = 'medium',
    origin = 'top-left',
}) => {
    const mask = ORIGIN_MASKS[origin];
    return (
        <div
            aria-hidden
            className={cn(
                'pointer-events-none absolute inset-0 -z-10 text-zinc-400 dark:text-zinc-600',
                INTENSITY_OPACITY[intensity],
                className,
            )}
            style={{
                backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                backgroundSize: '22px 22px',
                maskImage: mask,
                WebkitMaskImage: mask,
            }}
        />
    );
};
