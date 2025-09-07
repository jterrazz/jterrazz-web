import React from 'react';

import Link from 'next/link.js';

// Utils
import { cn } from '../../../lib/utils.js';

import { HeadingMain } from '../../atoms/typography/heading-main.js';

export type HighlightProps = {
    button: {
        href: string;
        text: string;
    };
    className?: string;
    description: string;
    title: string;
};

export const Highlight: React.FC<HighlightProps> = ({ button, className, description, title }) => {
    const generatedClassName = cn('mb-8 md:mb-12', className);

    return (
        <div className={generatedClassName}>
            <HeadingMain className="text-5xl md:text-6xl tracking-tight mb-3">{title}</HeadingMain>
            <p className="mt-1.5 text-lg leading-relaxed text-gray-700 max-w-[60ch]">{description}</p>
            <Link href={button.href} target={button.href.startsWith('/') ? undefined : '_blank'}>
                <button className="mt-4 text-gray-700 hover:text-black underline underline-offset-4">
                    {button.text} {'>'}
                </button>
            </Link>
        </div>
    );
};
