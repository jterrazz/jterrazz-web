import React from 'react';

export type TitleMainProps = {
    children: string;
    className?: string;
};

export const HeadingMain: React.FC<TitleMainProps> = ({ children, className = '' }) => {
    const generatedClassName = `text-3xl font-black mb-6 ${className}`;

    return <h1 className={generatedClassName}>{children}</h1>;
};
