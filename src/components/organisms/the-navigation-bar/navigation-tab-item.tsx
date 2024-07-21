import React from 'react';
import Link from 'next/link';

import { mergeClassName } from '../../../lib/utils.js';

export type NavigationTabItemProps = {
    className?: string;
    value: string;
    href: string;
    newTab?: boolean;
    selected?: boolean;
};

export const NavigationTabItem: React.FC<NavigationTabItemProps> = ({
    className = '',
    value,
    href,
    newTab = false,
    selected = false,
}) => {
    const baseClassName = 'rounded-md px-3 py-0.5 text-sm';
    const selectedClassName = selected
        ? 'bg-storm-cloud-accent text-white'
        : 'text-storm-cloud-accent';
    const generatedClassName = mergeClassName(baseClassName, selectedClassName, className);

    const content = <button className={generatedClassName}>{value}</button>;

    return (
        <div className="ml-1">
            {newTab ? (
                <button onClick={() => window.open(href, '_blank')} className={generatedClassName}>
                    {value}
                </button>
            ) : (
                <Link href={href}>{content}</Link>
            )}
        </div>
    );
};
