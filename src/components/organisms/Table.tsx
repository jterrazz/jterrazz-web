import React from 'react';

type TableProps = {
    children: React.ReactNode;
    className?: string;
};

export const Table: React.FC<TableProps> = ({ className, children }) => {
    const generatedClassName = 'flex flex-col select-none' + (className ? ' ' + className : '');

    return <ul className={generatedClassName}>{children}</ul>;
};
