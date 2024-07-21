import React from 'react';

import { mergeClassName } from '../../lib/utils.js';

export type Link = {
    title: string;
    url: string;
};

export type LinkButtonProps = {
    link: Link;
    highlighted?: boolean;
    className?: string;
};

export const LinkButton: React.FC<LinkButtonProps> = ({ link, className }) => {
    // const highlightClassName = highlighted
    //     ? 'text-white bg-storm-cloud-accent border-black'
    //     : 'bg-black-and-white-hover border-black-and-white';
    const generatedClassName = mergeClassName(
        'flex items-center hover:underline', // px-2 py-1 border rounded-lg
        // highlightClassName,
        className,
    );

    return (
        <a key={link.title} href={link.url} target="_blank" className={generatedClassName}>
            <p className="text-xs font-semibold">
                {link.title} {'>'}
            </p>
        </a>
    );
};
