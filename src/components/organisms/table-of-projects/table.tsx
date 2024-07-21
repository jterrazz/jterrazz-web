import React from 'react';

import { mergeClassName } from '../../../lib/utils.js';

type TableProps = {
    children: React.ReactNode;
    className?: string;
};

export const Table: React.FC<TableProps> = ({ className, children }) => {
    const generatedClassName = mergeClassName('flex flex-col select-none', className);

    return <ul className={generatedClassName}>{children}</ul>;
};
