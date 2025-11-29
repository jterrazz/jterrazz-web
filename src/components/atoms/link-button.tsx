import React from 'react';

// Utils
import { cn } from '../../lib/utils.js';

export type Link = {
    title: string;
    url: string;
};

export type LinkButtonProps = {
    className?: string;
    highlighted?: boolean;
    link: Link;
};

export const LinkButton: React.FC<LinkButtonProps> = ({ className, link }) => {
    // const highlightClassName = highlighted
    //     ? 'text-white bg-storm-cloud-accent border-black'
    //     : 'bg-black-and-white-hover border-black-and-white';
    const generatedClassName = cn(
        'flex items-center hover:underline', // px-2 py-1 border rounded-lg
        // highlightClassName,
        className,
    );

    return (
        <a
            className={generatedClassName}
            href={link.url}
            key={link.title}
            rel="noreferrer"
            target="_blank"
        >
            <p className="text-xs font-semibold">
                {link.title} {'>'}
            </p>
        </a>
    );
};
