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
        "Discover game-changing apps and coding insights at jterrazz.com! Join a dev's journey crafting useful apps, from self-improvement tools to innovative tech solutions. Level up your skills and find your next big idea! 🚀💻'",
    icons: [
        {
            rel: 'icon',
            type: 'image/x-icon',
            url: '/favicon/favicon.ico?v=2',
        },
        {
            rel: 'icon',
            sizes: '96x96',
            type: 'image/png',
            url: '/favicon/favicon-96x96.png?v=2',
        },
        {
            rel: 'icon',
            sizes: '32x32',
            type: 'image/png',
            url: '/favicon/favicon-32x32.png?v=2',
        },
        {
            rel: 'icon',
            sizes: '16x16',
            type: 'image/png',
            url: '/favicon/favicon-16x16.png?v=2',
        },
        {
            rel: 'apple-touch-icon-precomposed',
            url: '/favicon/apple-icon-precomposed.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            url: '/favicon/apple-icon.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '57x57',
            url: '/favicon/apple-icon-57x57.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '60x60',
            url: '/favicon/apple-icon-60x60.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '72x72',
            url: '/favicon/apple-icon-72x72.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '76x76',
            url: '/favicon/apple-icon-76x76.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '114x114',
            url: '/favicon/apple-icon-114x114.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '120x120',
            url: '/favicon/apple-icon-120x120.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '144x144',
            url: '/favicon/apple-icon-144x144.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '152x152',
            url: '/favicon/apple-icon-152x152.png?v=2',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            url: '/favicon/apple-icon-180x180.png?v=2',
        },
    ],
    title: 'Jean-Baptiste Terrazzoni: App Development, Self-Improvement & Tech Insights',
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
        userRepository.getContact(UserContactType.Medium),
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
