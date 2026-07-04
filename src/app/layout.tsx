import { OpenPanelComponent } from '@openpanel/nextjs';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import localFont from 'next/font/local';
import React from 'react';

import { SITE_CONFIG } from '../config/site';
import { ThemeProvider } from '../presentation/theme/theme-provider';
import { cn } from '../presentation/utils';

import './globals.css';

/*
 * Self-hosted, free (SIL Open Font License) typefaces standing in for the
 * reference design's proprietary fonts: Hanken Grotesk for body/UI text and
 * Geist for display headings. Loaded locally to avoid the build-time network
 * fetch that next/font/google requires.
 */
const hankenGrotesk = localFont({
    display: 'swap',
    src: [
        {
            path: '../../public/fonts/HankenGrotesk-Variable.woff2',
            style: 'normal',
            weight: '100 900',
        },
        {
            path: '../../public/fonts/HankenGrotesk-Italic-Variable.woff2',
            style: 'italic',
            weight: '100 900',
        },
    ],
    variable: '--font-hanken',
});

const geist = localFont({
    display: 'swap',
    src: [
        {
            path: '../../public/fonts/Geist-Variable.woff2',
            style: 'normal',
            weight: '100 900',
        },
    ],
    variable: '--font-geist',
});

export const metadata: Metadata = {
    alternates: {
        types: {
            'application/rss+xml': [
                { title: `${SITE_CONFIG.author.name} — Articles`, url: '/feed.xml' },
            ],
        },
    },
    applicationName: 'jterrazz.com',
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
    keywords: [...SITE_CONFIG.author.skills],
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
        hankenGrotesk.variable,
        geist.variable,
        'min-h-screen flex flex-col text-zinc-900 dark:text-zinc-100 font-sans antialiased',
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
                {/* Biome-ignore lint/security/noDangerouslySetInnerHtml: Required to prevent theme flash before hydration */}
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className={generatedClassName}>
                <ThemeProvider>{children}</ThemeProvider>
                {SITE_CONFIG.analytics.clientId && (
                    <OpenPanelComponent
                        apiUrl={SITE_CONFIG.analytics.apiUrl}
                        clientId={SITE_CONFIG.analytics.clientId}
                        scriptUrl="/op1.js"
                        trackOutgoingLinks
                        trackScreenViews
                    />
                )}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
