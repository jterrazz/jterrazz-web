import React from 'react';

// Utils
import { cn } from '../../../lib/utils';

/**
 * Available badge color variants.
 */
export enum BadgeColor {
    Green = 0,
    Yellow = 1,
    Orange = 2,
    Gray = 3,
    Blue = 4,
}

export enum DotPulseSize {
    Small = 0,
    Medium = 1,
}

export type StatusBadgeProps = {
    className?: string;
    color: BadgeColor;
    filled?: boolean;
    size?: DotPulseSize;
    value: string;
};

// Map colors to specific Tailwind classes for the dot
const dotColorMap: Record<BadgeColor, string> = {
    [BadgeColor.Green]: 'bg-emerald-500 dark:bg-emerald-400',
    [BadgeColor.Yellow]: 'bg-amber-500 dark:bg-amber-400',
    [BadgeColor.Orange]: 'bg-orange-500 dark:bg-orange-400',
    [BadgeColor.Gray]: 'bg-zinc-500 dark:bg-zinc-400',
    [BadgeColor.Blue]: 'bg-blue-500 dark:bg-blue-400',
};

// Map colors to specific Tailwind classes for the text
const textColorMap: Record<BadgeColor, string> = {
    [BadgeColor.Green]: 'text-emerald-700 dark:text-emerald-300',
    [BadgeColor.Yellow]: 'text-amber-700 dark:text-amber-300',
    [BadgeColor.Orange]: 'text-orange-700 dark:text-orange-300',
    [BadgeColor.Gray]: 'text-zinc-600 dark:text-zinc-400',
    [BadgeColor.Blue]: 'text-blue-700 dark:text-blue-300',
};

const sizeMap: Record<DotPulseSize, string> = {
    [DotPulseSize.Small]: 'text-[10px] gap-1.5',
    [DotPulseSize.Medium]: 'text-xs gap-2',
};

export const Badge: React.FC<StatusBadgeProps> = ({
    className,
    color,
    size = DotPulseSize.Medium,
    value,
}) => {
    return (
        <span
            className={cn(
                'inline-flex items-center font-semibold tracking-wide uppercase transition-colors',
                sizeMap[size],
                textColorMap[color],
                className,
            )}
        >
            <span className={cn('w-1.5 h-1.5 rounded-full', dotColorMap[color])} />
            {value}
        </span>
    );
};

