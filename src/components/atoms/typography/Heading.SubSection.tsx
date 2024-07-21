import React from 'react';

export type TitleSubSectionProps = {
    title: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
};

export const HeadingSubSection: React.FC<TitleSubSectionProps> = ({
    title,
    size = 'medium',
    className = '',
}) => {
    let generatedClassName = className;

    switch (size) {
        case 'small':
            generatedClassName += ' text-sm font-bold mb-1';
            break;
        case 'medium':
            generatedClassName += ' text-md font-bold mb-2';
            break;
        case 'large':
            generatedClassName += ' text-lg font-bold mb-4';
            break;
    }

    return <h3 className={generatedClassName}>{title}</h3>;
};
