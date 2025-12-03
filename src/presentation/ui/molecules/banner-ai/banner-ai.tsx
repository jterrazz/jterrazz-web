'use client';

import { Sparkles } from 'lucide-react';

import { cn } from '../../../utils';

export const BannerAi = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl',
                'bg-zinc-50 dark:bg-zinc-900/50',
                'border border-zinc-200/60 dark:border-zinc-800',
                'text-sm text-zinc-500 dark:text-zinc-400',
                className,
            )}
        >
            <div className="shrink-0 p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm text-amber-500">
                <Sparkles className="w-4 h-4" />
            </div>
            <span className="leading-relaxed">
                Final text polished by AI for readability. The underlying concepts & architecture
                are my own.
            </span>
        </div>
    );
};
