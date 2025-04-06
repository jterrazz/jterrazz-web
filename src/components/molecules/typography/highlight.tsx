import React from 'react';
import Link from 'next/link.js';

import { cn } from '../../../lib/utils.js';

import { HeadingMain } from '../../atoms/typography/heading-main.js';

export type HighlightProps = {
    title: string;
    description: string;
    className?: string;
    button: {
        text: string;
        href: string;
    };
};

export const Highlight: React.FC<HighlightProps> = ({ title, className, description, button }) => {
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
