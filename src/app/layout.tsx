import React from 'react';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
// Domain
// Google Fonts temporarily disabled due to network restrictions in build environment
// import { Inter } from 'next/font/google';

// Utils
import { cn } from '../presentation/utils';

import { ThemeProvider } from '../presentation/theme/theme-provider';

import './globals.css';

// Using system fonts due to network restrictions
// const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';

export const metadata: Metadata = {
    authors: [{ name: 'Jean-Baptiste Terrazzoni', url: 'https://jterrazz.com' }],
    creator: 'Jean-Baptiste Terrazzoni',
    description:
        'Software engineer specializing in AI agents, clean architecture, and fintech. Explore my projects, technical articles, and open-source contributions.',
    icons: [
        {
            rel: 'icon',
            type: 'image/x-icon',
            url: '/favicon/favicon.ico',
        },
        {
            rel: 'icon',
            type: 'image/svg+xml',
            url: '/favicon/favicon.svg',
        },
        {
            rel: 'icon',
            sizes: '96x96',
            type: 'image/png',
            url: '/favicon/favicon-96x96.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            url: '/favicon/apple-touch-icon.png',
        },
    ],
    manifest: '/site.webmanifest',
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
            'Software engineer specializing in AI agents, clean architecture, and fintech. Explore my projects, technical articles, and open-source contributions.',
        images: [
            {
                height: 630,
                url: '/assets/icons/appicon-jterrazz.png',
                width: 1200,
            },
        ],
        locale: 'en_US',
        siteName: 'Jean-Baptiste Terrazzoni',
        title: 'Jean-Baptiste Terrazzoni | Software Engineer & AI Developer',
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
        default: 'Jean-Baptiste Terrazzoni | Software Engineer & AI Developer',
        template: '%s | Jean-Baptiste Terrazzoni',
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@jterrazz',
        site: '@jterrazz',
        title: 'Jean-Baptiste Terrazzoni',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();

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
        <html lang={locale} suppressHydrationWarning>
            <head>
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required to prevent theme flash before hydration */}
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className={generatedClassName}>
                <ThemeProvider>{children}</ThemeProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
