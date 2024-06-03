import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { NavBar } from '../components/organisms/nav-bar.jsx';

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
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen flex flex-col`}>
                <NavBar
                    className="w-full"
                    pages={[
                        {
                            href: '/',
                            name: 'Work',
                        },
                        {
                            href: '/projects',
                            name: 'Projects',
                        },
                        {
                            href: '/blog',
                            name: 'Blog',
                        },
                        {
                            href: '/photos',
                            name: 'Photos',
                        },
                    ]}
                    contacts={[
                        {
                            href: '/',
                            name: 'X',
                        },
                        {
                            href: '/',
                            name: 'GitHub',
                        },
                        {
                            href: '/',
                            name: 'Pexels',
                        },
                        {
                            href: '/',
                            name: 'LinkedIn',
                        },
                    ]}
                />
                <div className="flex flex-col justify-center items-center text-storm-cloud-accent flex-1">
                    {children}
                </div>
            </body>
        </html>
    );
}
