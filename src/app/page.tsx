import { type Metadata } from 'next';
import Script from 'next/script';

// Domain
import { type Article } from '../domain/article.js';
import { type UserExperience } from '../domain/user.js';

// Infrastructure
import { ArticleInMemoryRepository } from '../infrastructure/repositories/article-in-memory.repository.js';
import { UserInMemoryRepository } from '../infrastructure/repositories/user-in-memory.repository.js';

import { HelloWorldTemplate } from '../components/templates/hello-world.template.js';
import { buildArticleSlug } from '../lib/slugify.js';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    alternates: {
        canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
    },
    description:
        "Engineering tomorrow's intelligent systems with AI agents, clean architecture, and decentralized solutions. Building where execution meets direction.",
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
        description:
            "Engineering tomorrow's intelligent systems with AI agents, clean architecture, and decentralized solutions. Building where execution meets direction.",
        images: [
            {
                alt: 'Jean-Baptiste Terrazzoni - Developer Portfolio',
                height: 630,
                url: '/assets/icons/app-icon.jterrazz.png',
                width: 1200,
            },
        ],
        siteName: 'Jterrazz',
        title: 'Jean-Baptiste Terrazzoni: AI, Apps, Learn',
        type: 'website',
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
    },
    title: 'Jean-Baptiste Terrazzoni: AI, Apps, Learn',
};

export default async function HomePage() {
    const userRepository = new UserInMemoryRepository();
    const articlesRepository = new ArticleInMemoryRepository();
    const userExperiences: UserExperience[] = userRepository.getExperiences();
    const topArticles: Article[] = await articlesRepository.getArticles();
    const description =
        'Building, learning, and sharing my journey through software engineering. Exploring the frontiers of AI, architecture, and decentralization.';

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
            description:
                "Engineering tomorrow's intelligent systems with AI agents, clean architecture, and decentralized solutions. Building where execution meets direction.",
            name: 'Software Developer',
        },
        image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/assets/icons/app-icon.jterrazz.png`,
        jobTitle: 'AI, Apps, Learn',
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
                    description: article.metadata.description.en,
                    imageUrl: article.imageUrl ?? '',
                    slug: buildArticleSlug(article.publicIndex, article.metadata.title.en),
                    title: article.metadata.title.en,
                }))}
            />
        </>
    );
}
