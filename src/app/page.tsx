import React from 'react';
import { type Metadata } from 'next';
import Script from 'next/script';

import { type Article } from '../domain/article.js';
import { type UserExperience } from '../domain/user.js';

import { ArticleInMemoryRepository } from '../infrastructure/repositories/article-in-memory.repository.js';
import { UserInMemoryRepository } from '../infrastructure/repositories/user-in-memory.repository.js';

import { HelloWorldTemplate } from '../components/templates/hello-world.template.js';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    alternates: {
        canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
    },
    description: 'AI Agent Developer and Fintech Engineer. Building intelligent systems that help humans grow—one commit at a time. Explore my portfolio of AI-powered tools and fintech projects.',
    keywords: [
        'Jean-Baptiste Terrazzoni',
        'AI Agent Developer',
        'Fintech Engineer',
        'intelligent systems',
        'TypeScript',
        'Node.js',
        'Next.js',
        'React',
        'Solidity',
        'self-improvement',
        'personal growth',
        'crypto',
        'blockchain',
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'),
    openGraph: {
        description: 'AI Agent Developer and Fintech Engineer. Building intelligent systems that help humans grow—one commit at a time.',
        images: [
            {
                alt: 'Jean-Baptiste Terrazzoni - Developer Portfolio',
                height: 630,
                url: '/assets/image-florence.webp',
                width: 1200,
            },
        ],
        siteName: 'Jterrazz',
        title: 'Jean-Baptiste Terrazzoni: AI Agent Developer & Fintech Engineer',
        type: 'website',
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
    },
    title: 'Jean-Baptiste Terrazzoni: AI Agent Developer & Fintech Engineer',
};

export default async function HomePage() {
    const userRepository = new UserInMemoryRepository();
    const articlesRepository = new ArticleInMemoryRepository();
    const userExperiences: UserExperience[] = userRepository.getExperiences();
    const topArticles: Article[] = await articlesRepository.getArticles();
    const description =
        'AI Agent Developer • Fintech Engineer. Building intelligent systems that help humans grow—one commit at a time.';

    // Structured data for better SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        alumniOf: {
            '@type': 'Organization',
            name: '42 Paris',
        },
        description: description,
        hasOccupation: {
            '@type': 'Occupation',
            description: 'Building intelligent systems for personal and financial growth',
            name: 'Software Developer',
        },
        image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/assets/image-florence.webp`,
        jobTitle: 'AI Agent Developer, Fintech Engineer',
        knowsAbout: [
            'AI Agent Development',
            'Fintech Engineering',
            'TypeScript',
            'Node.js',
            'Next.js',
            'React',
            'Solidity',
            'Personal Growth',
        ],
        name: 'Jean-Baptiste Terrazzoni',
        sameAs: [
            'https://github.com/jterrazz',
            'https://medium.com/@jterrazz',
            'https://www.pexels.com/@jterrazz',
        ],
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
        worksFor: {
            '@type': 'Organization',
            name: 'Self-Employed',
        },
    };

    return (
        <>
            <Script id="homepage-json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </Script>
            <HelloWorldTemplate
                description={description}
                experiences={userExperiences}
                topArticles={topArticles.map((article) => ({
                    description: article.metadata.description,
                    id: article.publicIndex.toString(),
                    imageUrl: article.imageUrl ?? '/assets/image-computer-table.webp',
                    title: article.metadata.title,
                }))}
            />
        </>
    );
}
