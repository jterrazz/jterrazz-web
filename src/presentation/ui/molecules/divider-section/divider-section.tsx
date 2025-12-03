import React from 'react';

import { cn } from '../../../utils';

export type DividerSectionProps = {
    className?: string;
    title: string;
};

export const DividerSection: React.FC<DividerSectionProps> = ({ className, title }) => {
    return (
        <div className={cn('flex items-center w-full', className)}>
            <div className="flex items-center gap-4 pr-6">
                <div className="w-2.5 h-2.5 bg-zinc-900 dark:bg-zinc-100 rotate-45" />
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {title}
                </h2>
            </div>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>
    );
};
