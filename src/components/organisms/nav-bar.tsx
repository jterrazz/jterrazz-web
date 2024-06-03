'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation.js';

import { ButtonOfSection } from '../atoms/button-of-section.jsx';

export const NavBar = (
    props: Readonly<{
        className: string;
        pages: ReadonlyArray<{
            name: string;
            href: string;
        }>;
        contacts: ReadonlyArray<{
            name: string;
            href: string;
        }>;
    }>,
) => {
    const { contacts, pages } = props;
    const currentPathname = usePathname();

    return (
        <nav className={`flex items-center font-medium p-3 ${props.className}`}>
            <h1 className="text-2xl mx-5 text-olive-note-accent font-semibold">JB</h1>
            <div className="flex-1">
                <ul className="flex flex-row">
                    {pages.map((page) => (
                        <li key={page.href} className="ml-1">
                            <Link href={page.href}>
                                <ButtonOfSection
                                    value={page.name}
                                    active={page.href === currentPathname}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <ul className="flex flex-row">
                    {contacts.map((contact) => (
                        <li key={contact.href}>
                            <ButtonOfSection value={contact.name} />
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};
