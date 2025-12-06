import React from 'react';

// Utils
import { cn } from '../../../utils';

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
    size?: 'full' | 'medium';
};

export const Container: React.FC<ContainerProps> = ({ children, className, size = 'medium' }) => {
    const generatedClassName = cn(
        'w-full flex flex-col self-center justify-self-center px-5 my-8 md:my-12 mx-auto',
        size === 'medium' ? 'max-w-3xl' : 'max-w-5xl',
        className,
    );

    return <main className={generatedClassName}>{children}</main>;
};
