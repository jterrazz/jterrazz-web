import React from 'react';

import { cn } from '../../../utils';

export type IconHintProps = {
    className?: string;
    /** The glyph itself — sized and coloured by the caller's icon set. */
    icon: React.ReactNode;
    /** What the marker means, revealed on hover. */
    label: string;
};

/**
 * A small marker beside a title that explains itself on hover — "there is an
 * experiment behind this article", "this experiment has a write-up".
 *
 * The bubble is `md:` and up only. It is hover-driven, so it is inert on
 * touch anyway, and it is wider than a phone: keeping it out of the DOM below
 * that breakpoint avoids a tooltip that could never be dismissed.
 */
export const IconHint: React.FC<IconHintProps> = ({ className, icon, label }) => (
    <span className={cn('relative shrink-0 group/hint', className)}>
        <span className="text-zinc-400 dark:text-zinc-500">{icon}</span>
        <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden px-2 py-1 text-xs text-white bg-zinc-900 rounded opacity-0 group-hover/hint:opacity-100 transition-opacity whitespace-nowrap z-10 md:block">
            {label}
        </span>
    </span>
);
