'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { UserContact } from '../../../domain/user.js';

import { mergeClassName } from '../../../lib/utils.js';

import { NavigationPage } from './navigation-page.js';
import { NavigationTabItem } from './navigation-tab-item.js';
import { NavigationTabs } from './navigation-tabs.js';

type TheNavigationBarProps = {
    className?: string;
    pages: NavigationPage[];
    contacts: UserContact[];
};

export const TheNavigationBar: React.FC<TheNavigationBarProps> = ({
    contacts,
    pages,
    className,
}) => {
    const generatedClassName = mergeClassName(
        'flex items-center font-medium px-5 py-4 w-full border-b sticky top-0 z-50 bg-white/90 backdrop-blur-xl',
        className,
    );

    return (
        <nav className={generatedClassName}>
            <Link href="/">
                <Image
                    src="/assets/navbar-logo.png"
                    alt="Jterrazz"
                    width={36}
                    height={36}
                    className="mr-2"
                />
            </Link>

            <div className="flex-1">
                <NavigationTabs pages={pages} />
            </div>
            <div>
                <ul className="flex flex-row">
                    {contacts.map((contact, index) => (
                        <NavigationTabItem
                            value={contact.name}
                            href={contact.url.toString()}
                            newTab={true}
                            selected={index === 0}
                            className="ml-1"
                        />
                    ))}
                </ul>
            </div>
        </nav>
    );
};
