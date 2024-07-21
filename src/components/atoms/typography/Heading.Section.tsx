import React from 'react';

export type TitleSectionProps = {
    title: string;
    className?: string;
    // children: string;
};

export const HeadingSection: React.FC<TitleSectionProps> = ({ title, className }) => {
    const generatedClassName = `text-2xl font-extrabold ${className}`;

    return <h2 className={generatedClassName}>{title}</h2>;
};
