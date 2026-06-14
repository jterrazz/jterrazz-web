import React from 'react';

// Utils
import { cn } from '../../../utils';

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
    size?: 'full' | 'medium' | 'narrow' | 'wide';
};

const SIZE_CLASSES: Record<NonNullable<ContainerProps['size']>, string> = {
    full: 'max-w-5xl',
    medium: 'max-w-3xl',
    narrow: 'max-w-2xl',
    wide: 'max-w-[90rem]',
};

export const Container: React.FC<ContainerProps> = ({ children, className, size = 'medium' }) => {
    const generatedClassName = cn(
        'w-full flex flex-col self-center justify-self-center px-4 md:px-5 my-6 md:my-12 mx-auto',
        SIZE_CLASSES[size],
        className,
    );

    return <main className={generatedClassName}>{children}</main>;
};
