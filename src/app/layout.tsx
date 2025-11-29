import React from 'react';

import type { Metadata } from 'next';
// Google Fonts temporarily disabled due to network restrictions in build environment
// import { Inter } from 'next/font/google';

// Domain
import { UserContactType } from '../domain/user.js';

// Infrastructure
import { UserInMemoryRepository } from '../infrastructure/repositories/user-in-memory.repository.js';

// Utils
import { cn } from '../lib/utils.js';

import { ClientLayoutWrapper } from '../components/client-layout-wrapper.js';
import { TheFooter } from '../components/organisms/the-footer.js';
import { TheNavigationBar } from '../components/organisms/the-navigation-bar/the-navigation-bar.js';

import './globals.css';

// Using system fonts due to network restrictions
// const inter = Inter({ subsets: ['latin'] });

const APPLE_TOUCH_ICON = 'apple-touch-icon';
export const metadata: Metadata = {
    description:
        "Discover game-changing apps and coding insights at jterrazz.com! Join a dev's journey crafting useful apps, from self-improvement tools to innovative tech solutions. Level up your skills and find your next big idea! 🚀💻'",
    icons: [
        {
            rel: 'icon',
            type: 'image/x-icon',
            url: '/favicon/favicon.ico?v=6',
        },
        {
            rel: 'icon',
            sizes: '96x96',
            type: 'image/png',
            url: '/favicon/favicon-96x96.png?v=6',
        },
        {
            rel: 'icon',
            sizes: '32x32',
            type: 'image/png',
            url: '/favicon/favicon-32x32.png?v=6',
        },
        {
            rel: 'icon',
            sizes: '16x16',
            type: 'image/png',
            url: '/favicon/favicon-16x16.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            url: '/favicon/apple-icon.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            sizes: '57x57',
            url: '/favicon/apple-icon-57x57.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            sizes: '60x60',
            url: '/favicon/apple-icon-60x60.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            sizes: '72x72',
            url: '/favicon/apple-icon-72x72.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            sizes: '76x76',
            url: '/favicon/apple-icon-76x76.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            sizes: '114x114',
            url: '/favicon/apple-icon-114x114.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            sizes: '120x120',
            url: '/favicon/apple-icon-120x120.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            sizes: '144x144',
            url: '/favicon/apple-icon-144x144.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            sizes: '152x152',
            url: '/favicon/apple-icon-152x152.png?v=6',
        },
        {
            rel: APPLE_TOUCH_ICON,
            sizes: '180x180',
            url: '/favicon/apple-icon-180x180.png?v=6',
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
    // Convert `URL` instances to plain strings to safely pass to the client navigation bar.
    const contacts = [
        userRepository.getContact(UserContactType.GitHub),
        userRepository.getContact(UserContactType.Medium),
    ].map((contact) => ({
        ...contact,
        url: contact.url.toString(),
    }));
    const pages = [
        {
            href: '/',
            name: 'Hello',
        },
        {
            href: '/articles',
            name: 'Articles',
        },
        {
            href: '/projects',
            name: 'Projects',
        },
        {
            href: '/photographs',
            name: 'Photographs',
        },
    ];

    const generatedClassName = cn(
        'min-h-screen flex flex-col text-storm-cloud-accent font-sans',
        // inter.className, // Commented out due to network restrictions
    );

    return (
        <html lang="en">
            <body className={generatedClassName}>
                <ClientLayoutWrapper>
                    <div className="sticky top-0 z-[50] pointer-events-none">
                        <TheNavigationBar contacts={contacts} pages={pages} />
                    </div>
                    <div className="flex-1 flex flex-col overflow-x-hidden w-full">{children}</div>
                    <TheFooter />
                </ClientLayoutWrapper>
            </body>
        </html>
    );
}
