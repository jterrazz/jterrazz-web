import { type Metadata } from 'next';
import Script from 'next/script';

import { HelloWorldTemplate } from '../presentation/templates/hello-world.template';
import { articlesRepository } from '../infrastructure/repositories/articles.repository';
import { experimentsRepository } from '../infrastructure/repositories/experiments.repository';
import { userRepository } from '../infrastructure/repositories/user.repository';
import { buildArticleSlug } from '../domain/utils/slugify';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    alternates: {
        canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
    },
    description:
        'Software engineer building AI agents, fintech solutions, and clean architecture systems. Discover my projects, articles, and experiments.',
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
            'Software engineer building AI agents, fintech solutions, and clean architecture systems. Discover my projects, articles, and experiments.',
        images: [
            {
                alt: 'Jean-Baptiste Terrazzoni - Software Engineer & AI Developer',
                height: 630,
                url: '/assets/icons/app-icon.jterrazz.png',
                width: 1200,
            },
        ],
        siteName: 'Jean-Baptiste Terrazzoni',
        title: 'Jean-Baptiste Terrazzoni | Software Engineer & AI Developer',
        type: 'website',
        url: process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com',
    },
};

export default function HomePage() {
    const userExperiences = userRepository.getExperiences();
    const topArticles = articlesRepository.getAll();

    // Convert URL instances to plain strings for client components
    const latestExperiments = experimentsRepository
        .getAll()
        .slice(0, 2)
        .map((experiment) => ({
            ...experiment,
            articleUrl: experiment.articleUrl ?? null,
            components: experiment.components.map((component) => ({
                ...component,
                sourceUrl: component.sourceUrl.toString(),
            })),
            url: experiment.url ? experiment.url.toString() : '',
        }));

    const description =
        'Software engineer building AI agents, fintech solutions, and clean architecture systems. Discover my projects, articles, and experiments.';

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
                'Software engineer specializing in AI agents, clean architecture, and fintech solutions.',
            name: 'Software Engineer',
        },
        image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/assets/icons/app-icon.jterrazz.png`,
        jobTitle: 'Software Engineer',
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
                latestExperiments={latestExperiments}
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
