import React from 'react';

import { cn } from '../../../lib/utils.js';

type TableProps = {
    children: React.ReactNode;
    className?: string;
};

export const Table: React.FC<TableProps> = ({ className, children }) => {
    const generatedClassName = cn('flex flex-col select-none', className);

    return <ul className={generatedClassName}>{children}</ul>;
};
