import React from 'react';

// Utils
import { cn } from '../../../lib/utils';

type TableProps = {
    children: React.ReactNode;
    className?: string;
};

export const Table: React.FC<TableProps> = ({ children, className }) => {
    const generatedClassName = cn('flex flex-col select-none', className);

    return <ul className={generatedClassName}>{children}</ul>;
};
