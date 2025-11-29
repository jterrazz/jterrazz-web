'use client';

import React from 'react';

import { Sparkles } from 'lucide-react';

// Utils
import { cn } from '../../lib/utils.js';

export const AIBanner = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2.5 px-4 py-2 rounded-full',
                'bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md',
                'border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm',
                'text-xs font-medium text-zinc-600 dark:text-zinc-300',
                className,
            )}
        >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
                Final text polished by AI for readability. The underlying concepts & architecture
                are my own.
            </span>
        </div>
    );
};
