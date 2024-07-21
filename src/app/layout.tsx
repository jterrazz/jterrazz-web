import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { UserContactType } from '../domain/user.js';

import { UserInMemoryRepository } from '../infrastructure/repositories/user-in-memory.repository.js';

import { mergeClassName } from '../lib/utils.js';

import { TheFooter } from '../components/organisms/the-footer.js';
import { TheNavigationBar } from '../components/organisms/the-navigation-bar/the-navigation-bar.js';

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
    const userRepository = new UserInMemoryRepository();
    const contacts = [
        userRepository.getContact(UserContactType.X),
        userRepository.getContact(UserContactType.GitHub),
        userRepository.getContact(UserContactType.Pexels),
        userRepository.getContact(UserContactType.LinkedIn),
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

    const generatedClassName = mergeClassName(
        'min-h-screen flex flex-col text-storm-cloud-accent',
        inter.className,
    );

    return (
        <html lang="en">
            <SpeedInsights sampleRate={1} />
            <Analytics />
            <body className={generatedClassName}>
                <TheNavigationBar pages={pages} contacts={contacts} />
                <div className="flex-1 flex flex-col">{children}</div>
                <TheFooter />
            </body>
        </html>
    );
}
