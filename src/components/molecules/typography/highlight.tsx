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
    const generatedClassName = cn('mb-9 md:mb-20', className);

    return (
        <div className={generatedClassName}>
            <HeadingMain>{title}</HeadingMain>
            <p className="mt-6 font-medium">{description}</p>
            <Link href={button.href} target={button.href.startsWith('/') ? undefined : '_blank'}>
                <button className="mt-6 font-medium underline">
                    {button.text} {'>'}
                </button>
            </Link>
        </div>
    );
};
