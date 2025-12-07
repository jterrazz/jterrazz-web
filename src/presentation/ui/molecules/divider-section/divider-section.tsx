import React from 'react';

// Utils
import { cn } from '../../../utils';

export type DividerSectionProps = {
    className?: string;
    title: string;
};

export const DividerSection: React.FC<DividerSectionProps> = ({ className, title }) => {
    return (
        <div className={cn('flex items-center w-full gap-3', className)}>
            <h2 className="text-[13px] font-medium tracking-wide uppercase text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {title}
            </h2>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>
    );
};
