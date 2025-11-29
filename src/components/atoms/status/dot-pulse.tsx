import React from 'react';

// Utils
import { cn } from '../../../lib/utils';

export enum DotPulseColor {
    Black = 'black',
    Blue = 'blue',
    Gray = 'gray',
    Green = 'green',
    Orange = 'orange',
    Red = 'red',
}

export type DotPulseProps = {
    className?: string;
    color: DotPulseColor;
};

// Map colors to Tailwind utilities for better theme support and simplicity
const colorMap: Record<DotPulseColor, { bg: string; pulse: string }> = {
    [DotPulseColor.Black]: {
        bg: 'bg-zinc-900 dark:bg-zinc-100',
        pulse: 'bg-zinc-500/30 dark:bg-zinc-400/30',
    },
    [DotPulseColor.Blue]: {
        bg: 'bg-blue-500 dark:bg-blue-400',
        pulse: 'bg-blue-500/30 dark:bg-blue-400/30',
    },
    [DotPulseColor.Gray]: {
        bg: 'bg-zinc-400 dark:bg-zinc-500',
        pulse: 'bg-zinc-400/30 dark:bg-zinc-500/30',
    },
    [DotPulseColor.Green]: {
        bg: 'bg-emerald-500 dark:bg-emerald-400',
        pulse: 'bg-emerald-500/30 dark:bg-emerald-400/30',
    },
    [DotPulseColor.Orange]: {
        bg: 'bg-amber-500 dark:bg-amber-400',
        pulse: 'bg-amber-500/30 dark:bg-amber-400/30',
    },
    [DotPulseColor.Red]: {
        bg: 'bg-red-500 dark:bg-red-400',
        pulse: 'bg-red-500/30 dark:bg-red-400/30',
    },
};

export const DotPulse: React.FC<DotPulseProps> = ({ className, color }) => {
    const styles = colorMap[color];

    return (
        <span className={cn('relative flex h-2.5 w-2.5', className)}>
            <span
                className={cn(
                    'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                    styles.pulse,
                )}
            />
            <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', styles.bg)} />
        </span>
    );
};
