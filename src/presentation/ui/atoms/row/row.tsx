import React from 'react';

import { cn } from '../../../utils';

export type RowProps = {
    children: React.ReactNode;
    className?: string;
};

export const Row: React.FC<RowProps> = ({ children, className }) => {
    const generatedClassName = cn('flex flex-row space-x-12', className);

    return <ul className={generatedClassName}>{children}</ul>;
};
