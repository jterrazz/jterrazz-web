'use client';

import React from 'react';

type TimelineProps = {
    children?: React.ReactNode;
    className?: string;
};

export const Timeline: React.FC<TimelineProps> = ({ children, className }) => {
    return (
        <div className={className}>
            <div className="relative space-y-16 md:space-y-24 pb-12">
                {/* Central Spine (Desktop) */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 -translate-x-1/2" />
                
                {/* Left Spine (Mobile) */}
                <div className="md:hidden absolute left-6 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
                
                {children}
            </div>
        </div>
    );
};
