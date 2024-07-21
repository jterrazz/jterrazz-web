'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import { Contact } from '../../domain/profile/contact.js';

import { NavigationTabItem } from '../atoms/navigation/NavigationTabItem.js';
import { NavigationTabs } from '../molecules/navigation/NavigationTabs.js';

// TODO Clean .idea file
export type NavigationBarProps = {
    className: string;
    pages: {
        name: string;
        href: string;
    }[];
    contacts: Contact[];
};

export const TheNavigationBar: React.FC<NavigationBarProps> = (props) => {
    const { contacts, pages } = props;
    const currentPathname = usePathname();

    return (
        <nav className={`flex items-center font-medium p-3 ${props.className}`}>
            <h1 className="text-2xl mx-5 text-olive-note-accent font-semibold">JB</h1>

            <div className="flex-1">
                <NavigationTabs>
                    {pages.map((page) => (
                        <NavigationTabItem
                            value={page.name}
                            href={page.href}
                            selected={
                                page.href === '/'
                                    ? currentPathname === page.href
                                    : currentPathname.startsWith(page.href)
                            }
                        />
                    ))}
                </NavigationTabs>
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
