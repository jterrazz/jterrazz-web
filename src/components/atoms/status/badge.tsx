import React from 'react';

import { cn } from '../../../lib/utils.js';

/**
 * Available badge color variants. Order does not matter but keeping a stable
 * enum for exhaustive switch-case fallbacks across the codebase.
 */
export enum BadgeColor {
    Green,
    Yellow,
    Orange,
    Gray,
    Blue,
}

export enum DotPulseSize {
    Small,
    Medium,
}

export type StatusBadgeProps = {
    /**
     * Optional extra classes forwarded by the parent component.
     */
    className?: string;
    /**
     * Badge color variant.
     */
    color: BadgeColor;
    /**
     * When `true` the badge has a filled background, otherwise it falls back to
     * a minimalist outlined style.
     * @default true
     */
    filled?: boolean;
    /**
     * Pre-defined sizing (padding + font-size).
     */
    size?: DotPulseSize;
    /**
     * Rendered text value.
     */
    value: string;
};

// Tailwind colour utilities with good contrast ratios. Keeping the palette
// minimalistic greatly simplifies visual consistency across light / dark
// themes.
const filledColorMap: Record<BadgeColor, string> = {
    [BadgeColor.Green]: 'bg-olive-note text-olive-note-accent',
    [BadgeColor.Yellow]: 'bg-vanilla-punch text-vanilla-punch-accent',
    [BadgeColor.Orange]: 'bg-apricot-sunset text-apricot-sunset-accent',
    [BadgeColor.Gray]: 'bg-storm-cloud text-storm-cloud-accent',
    // Blue palette relies on existing custom utility classes.
    [BadgeColor.Blue]: 'blue-grey blue-grey-accent',
};

const outlineColorMap: Record<BadgeColor, string> = {
    [BadgeColor.Green]: 'text-olive-note border-olive-note',
    [BadgeColor.Yellow]: 'text-vanilla-punch-accent border-vanilla-punch',
    [BadgeColor.Orange]: 'text-apricot-sunset-accent border-apricot-sunset',
    [BadgeColor.Gray]: 'text-storm-cloud-accent border-storm-cloud',
    [BadgeColor.Blue]: 'blue-grey-accent border-blue-grey', // assuming util class exists
};

// More compact spacing to better align with minimalist design.
const sizeMap: Record<DotPulseSize, string> = {
    [DotPulseSize.Small]: 'px-2.5 py-0.5 text-xs',
    [DotPulseSize.Medium]: 'px-3 py-1 text-sm',
};

export const Badge: React.FC<StatusBadgeProps> = ({
    className,
    color,
    filled = true,
    size = DotPulseSize.Medium,
    value,
}) => {
    const classes = cn(
        // base
        'inline-flex items-center rounded-md whitespace-nowrap font-semibold tracking-wide',
        // size
        sizeMap[size],
        // color styles
        filled ? filledColorMap[color] : cn('border', outlineColorMap[color]),
        // consumer overrides
        className,
    );

    return <span className={classes}>{value}</span>;
};
