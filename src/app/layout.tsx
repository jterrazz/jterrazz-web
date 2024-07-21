import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ContactType } from '../domain/profile/contact.js';

import { ProfileInMemoryRepository } from '../infrastructure/repositories/profile-in-memory.repository.js';

import { TheFooter } from '../components/organisms/TheFooter.js';
import { TheNavigationBar } from '../components/organisms/TheNavigationBar.js';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    description:
        'A personal portfolio website showcasing my development projects, photography, and articles.',
    title: 'Terrazzoni Jean-Baptiste',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const contactRepository = new ProfileInMemoryRepository();
    const contacts = [
        contactRepository.getOneContact(ContactType.X),
        contactRepository.getOneContact(ContactType.GitHub),
        contactRepository.getOneContact(ContactType.Pexels),
        contactRepository.getOneContact(ContactType.LinkedIn),
    ];

    const pages = [
        {
            href: '/',
            name: 'Hello World',
        },
        {
            href: '/applications',
            name: 'Applications',
        },
        {
            href: '/articles',
            name: 'Articles',
        },
        {
            href: '/photographs',
            name: 'Photographs',
        },
    ];

    return (
        <html lang="en">
            <body
                className={`${inter.className} min-h-screen flex flex-col text-storm-cloud-accent`}
            >
                <TheNavigationBar
                    className="w-full border-b sticky top-0 z-10 bg-white"
                    pages={pages}
                    contacts={contacts}
                />
                <div className="flex-1 flex flex-col">{children}</div>
                <TheFooter />
            </body>
        </html>
    );
}
