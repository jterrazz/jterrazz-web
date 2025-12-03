import React from 'react';

import { cn } from '../../../utils';

export type ButtonLinkData = {
    title: string;
    url: string;
};

export type ButtonLinkProps = {
    className?: string;
    highlighted?: boolean;
    link: ButtonLinkData;
};

export const ButtonLink: React.FC<ButtonLinkProps> = ({ className, link }) => {
    const generatedClassName = cn('flex items-center hover:underline', className);

    return (
        <a
            className={generatedClassName}
            href={link.url}
            key={link.title}
            rel="noreferrer"
            target="_blank"
        >
            <p className="text-xs font-semibold">
                {link.title} <span aria-hidden="true">{'>'}</span>
                <span className="sr-only"> (opens in a new tab)</span>
            </p>
        </a>
    );
};
