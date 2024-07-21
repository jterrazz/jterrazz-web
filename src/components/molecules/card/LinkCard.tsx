import React from 'react';

export type Link = {
    title: string;
    url: string;
};

export type LinkCardProps = {
    link: Link;
    highlighted?: boolean;
};

export const LinkCard: React.FC<LinkCardProps> = ({ link, highlighted }) => {
    const generatedClassName = `px-4 py-3 border mr-4 rounded-lg ${highlighted ? 'text-white bg-storm-cloud-accent border-black' : 'bg-black-and-white-hover border-black-and-white'}`;

    return (
        <a key={link.title} href={link.url} target="_blank" className={generatedClassName}>
            <p className="text-xs font-semibold">{link.title}</p>
        </a>
    );
};
