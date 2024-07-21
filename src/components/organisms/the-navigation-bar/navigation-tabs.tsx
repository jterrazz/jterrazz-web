import React from 'react';
import Link from 'next/link';

import { mergeClassName } from '../../../lib/utils.js';

import AnimatedBackground from '../../molecules/cards/animated-backgrounds.js';

import { NavigationPage } from './navigation-page.js';

export type NavigationTabsProps = {
    pages: NavigationPage[];
    className?: string;
};

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ pages, className }) => {
    const newTab = false;
    // const currentPathname = usePathname();
    const generatedClassName = mergeClassName('flex flex-row', className);

    return (
        <div className={generatedClassName}>
            <AnimatedBackground
                className="rounded-lg bg-zinc-200 dark:bg-zinc-600"
                transition={{
                    bounce: 0.2,
                    duration: 0.3,
                    type: 'spring',
                }}
                enableHover
            >
                {pages.map((page, index) => {
                    // const selected =
                    //     page.href === '/'
                    //         ? currentPathname === page.href
                    //         : currentPathname.startsWith(page.href);
                    const baseClassName = 'rounded-md px-3 py-0.5 text-sm';
                    const selectedClassName = ''; // selected
                    // ? 'bg-storm-cloud-accent text-white'
                    // : 'text-storm-cloud-accent';
                    const generatedClassName = mergeClassName(baseClassName, selectedClassName);
                    const content = <button className={generatedClassName}>{page.name}</button>;

                    return (
                        <div key={index} data-id={page.name}>
                            {newTab ? (
                                <button
                                    onClick={() => window.open(page.href, '_blank')}
                                    className={generatedClassName}
                                >
                                    {page.name}
                                </button>
                            ) : (
                                <Link href={page.href}>{content}</Link>
                            )}
                        </div>
                    );
                })}
            </AnimatedBackground>
        </div>
    );
};
