import React from 'react';

import type { Metadata } from 'next';
// Google Fonts temporarily disabled due to network restrictions in build environment
// import { Inter } from 'next/font/google';

import { userRepository } from '../infrastructure/repositories/user.repository';
import { UserContactType } from '../domain/user';
import { cn } from '../presentation/utils';

import { ClientLayoutWrapper } from '../presentation/client-layout-wrapper';
import { Footer } from '../presentation/ui/organisms/footer';
import { NavigationBar } from '../presentation/ui/organisms/navigation-bar/navigation-bar';

import './globals.css';

// Using system fonts due to network restrictions
// const inter = Inter({ subsets: ['latin'] });

const APPLE_TOUCH_ICON = 'apple-touch-icon';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

export const metadata: Metadata = {
    authors: [{ name: 'Jean-Baptiste Terrazzoni', url: 'https://jterrazz.com' }],
    creator: 'Jean-Baptiste Terrazzoni',
    description:
        'The engineering portfolio of Jean-Baptiste Terrazzoni. Building, learning, and sharing my journey through software engineering and intelligent systems.',
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
    keywords: [
        'Software Engineering',
        'Full Stack Development',
        'React',
        'Next.js',
        'TypeScript',
        'AI Agents',
        'Clean Architecture',
        'Mobile Apps',
    ],
    metadataBase: new URL(baseUrl),
    openGraph: {
        description:
            'The engineering portfolio of Jean-Baptiste Terrazzoni. Building, learning, and sharing my journey through software engineering and intelligent systems.',
        images: [
            {
                height: 630,
                url: '/assets/icons/app-icon.jterrazz.png', // Fallback image
                width: 1200,
            },
        ],
        locale: 'en_US',
        siteName: 'Jean-Baptiste Terrazzoni',
        title: 'Jean-Baptiste Terrazzoni: Engineering AI Agents & Fintech Solutions',
        type: 'website',
        url: baseUrl,
    },
    robots: {
        follow: true,
        googleBot: {
            follow: true,
            index: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
        index: true,
    },
    title: {
        default: 'Jean-Baptiste Terrazzoni: Building & Learning',
        template: '%s | Jean-Baptiste Terrazzoni',
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@jterrazz',
        site: '@jterrazz',
        title: 'Jean-Baptiste Terrazzoni',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Convert `URL` instances to plain strings to safely pass to the client navigation bar.
    const contacts = [
        userRepository.getContact(UserContactType.GitHub),
        userRepository.getContact(UserContactType.Medium),
    ].map((contact) => ({
        name: contact.type,
        type: contact.type,
        url: contact.url.toString(),
        value: contact.value,
    }));
    const pages = [
        {
            href: '/',
            name: 'Hello',
        },
        {
            href: '/experiments',
            name: 'Experiments',
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

    const generatedClassName = cn(
        'min-h-screen flex flex-col text-zinc-900 dark:text-zinc-100 font-sans antialiased',
        // inter.className, // Commented out due to network restrictions
    );

    // Inline script to prevent flash of wrong theme
    const themeScript = `
        (function() {
            const stored = localStorage.getItem('theme');
            const theme = stored === 'dark' || stored === 'light' ? stored : 
                (stored === 'system' || !stored) && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.classList.add(theme);
        })();
    `;

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required to prevent theme flash before hydration */}
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className={generatedClassName}>
                <ClientLayoutWrapper>
                    <div className="sticky top-0 z-[50] pointer-events-none">
                        <NavigationBar contacts={contacts} pages={pages} />
                    </div>
                    <main className="flex-1 flex flex-col overflow-x-hidden w-full">
                        {children}
                    </main>
                    <Footer />
                </ClientLayoutWrapper>
            </body>
        </html>
    );
}
