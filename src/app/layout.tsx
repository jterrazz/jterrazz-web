import React from 'react';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import { SITE_CONFIG } from '../config/site';
import { cn } from '../presentation/utils';
import { ThemeProvider } from '../presentation/theme/theme-provider';

import './globals.css';

export const metadata: Metadata = {
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
    creator: SITE_CONFIG.author.name,
    description: SITE_CONFIG.description,
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
    keywords: SITE_CONFIG.author.skills,
    metadataBase: new URL(SITE_CONFIG.baseUrl),
    openGraph: {
        description: SITE_CONFIG.description,
        images: [
            {
                height: SITE_CONFIG.defaultImage.height,
                url: SITE_CONFIG.defaultImage.path,
                width: SITE_CONFIG.defaultImage.width,
            },
        ],
        locale: 'en_US',
        siteName: SITE_CONFIG.author.name,
        title: `${SITE_CONFIG.author.name} | ${SITE_CONFIG.author.jobTitle}`,
        type: 'website',
        url: SITE_CONFIG.baseUrl,
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
        default: `${SITE_CONFIG.author.name} | ${SITE_CONFIG.author.jobTitle}`,
        template: `%s | ${SITE_CONFIG.author.name}`,
    },
    twitter: {
        card: 'summary_large_image',
        creator: SITE_CONFIG.social.twitter,
        site: SITE_CONFIG.social.twitter,
        title: SITE_CONFIG.author.name,
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
