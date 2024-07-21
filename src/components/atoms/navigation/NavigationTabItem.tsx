import React from 'react';
import Link from 'next/link';

export type TabItemNavigationProps = {
    className?: string;
    value: string;
    href: string;
    newTab?: boolean;
    selected?: boolean;
};

export const NavigationTabItem: React.FC<TabItemNavigationProps> = ({
    className = '',
    value,
    href,
    newTab = false,
    selected = false,
}) => {
    let generatedClassName = `rounded-md px-3 py-0.5 text-sm bg-storm-cloud-hover hover:text-white ${className}`;

    if (selected) {
        generatedClassName += ' bg-storm-cloud-accent text-white';
    } else {
        generatedClassName += ' text-storm-cloud-accent';
    }

    return (
        <li key={href} className="ml-1">
            {newTab ? (
                <button onClick={() => window.open(href, '_blank')} className={generatedClassName}>
                    {value}
                </button>
            ) : (
                <Link href={href}>
                    <button className={generatedClassName}>{value}</button>
                </Link>
            )}
        </li>
    );
};
