import React from 'react';

import { ArrowRight } from 'lucide-react';

import { Link } from '../../../../infrastructure/navigation/navigation';

// Utils
import { cn } from '../../../utils';

export type SectionHeroProps = {
    button?: {
        href: string;
        text: string;
    };
    className?: string;
    description: string;
    title: string;
};

export const SectionHero: React.FC<SectionHeroProps> = ({
    button,
    className,
    description,
    title,
}) => {
    const generatedClassName = cn(
        'relative py-16 md:py-24 flex flex-col items-center text-center',
        className,
    );

    return (
        <div className={generatedClassName}>
            {/* Decorative Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[150%] -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                {title}
            </h1>

            <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                {description}
            </p>

            {button && (
                <Link
                    className="mt-8 group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    href={button.href}
                    target={button.href.startsWith('/') ? undefined : '_blank'}
                >
                    {button.text}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
        </div>
    );
};
