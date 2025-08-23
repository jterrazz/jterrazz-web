import React from 'react';

import { type Metadata } from 'next';
import Script from 'next/script';

// Application
import { ApplicationsListTemplate } from '../../components/templates/applications-list.template.js';

// Domain
import { type Project } from '../../domain/project.js';

// Infrastructure
import { FeaturedId } from '../../infrastructure/repositories/data/features.data.js';
import { FeatureInMemoryRepository } from '../../infrastructure/repositories/feature-in-memory.repository.js';
import { ProjectInMemoryRepository } from '../../infrastructure/repositories/project-in-memory.repository.js';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/applications`,
    },
    description:
        'Discover applications and tools by Jean-Baptiste Terrazzoni—AI Agent Developer and Fintech Engineer. Explore AI-powered personal growth platforms and fintech solutions designed to help you grow.',
    keywords: [
        'AI applications',
        'fintech tools',
        'personal growth',
        'habit formation',
        'intelligent systems',
        'Jean-Baptiste Terrazzoni',
        'AI Agent Developer',
        'Fintech Engineer',
    ],
    openGraph: {
        description:
            'Discover applications and tools by Jean-Baptiste Terrazzoni—AI Agent Developer and Fintech Engineer.',
        title: 'Applications by Jean-Baptiste Terrazzoni: AI & Fintech Tools',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/applications`,
    },
    title: 'Applications by Jean-Baptiste Terrazzoni: AI & Fintech Tools',
};

export default async function ApplicationsPage() {
    const projectRepository = new ProjectInMemoryRepository();
    const featureRepository = new FeatureInMemoryRepository();

    const projectsDomain: Project[] = projectRepository.getProjects();

    // Convert URL and Date instances to plain serialisable values for client components
    const projects = projectsDomain.map((project) => ({
        ...project,
        components: project.components.map((component) => ({
            ...component,
            articleUrl: component.articleUrl ? component.articleUrl.toString() : null,
            sourceUrl: component.sourceUrl.toString(),
        })),
        createdAt: project.createdAt ? project.createdAt.toISOString() : null,
        url: project.url.toString(),
    }));
    const features = [
        featureRepository.getFeatureById(FeaturedId.Repository),
        featureRepository.getFeatureById(FeaturedId.Capitaine),
        featureRepository.getFeatureById(FeaturedId.Source),
    ];

    const highlightTitle = 'Applications';
    const highlightDescription =
        'Welcome to my personal collection of projects. My focus is on creating tools that help you grow.';

    // Structured data for better SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description:
            'Discover applications and tools by Jean-Baptiste Terrazzoni—AI Agent Developer and Fintech Engineer. Explore AI-powered personal growth platforms and fintech solutions designed to help you grow.',
        hasPart: projects.map((project) => ({
            '@type': 'SoftwareApplication',
            applicationCategory: 'ProductivityApplication',
            author: {
                '@type': 'Person',
                name: 'Jean-Baptiste Terrazzoni',
                url: 'https://jterrazz.com',
            },
            description: project.description,
            name: project.name,
            url: project.url.toString(),
            ...(project.components.length > 0 && {
                softwareVersion: project.components
                    .flatMap((component) => component.technologies)
                    .join(', '),
            }),
        })),
        name: 'Applications by Jean-Baptiste Terrazzoni: AI & Fintech Tools',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/applications`,
    };

    return (
        <>
            <Script
                id="applications-json-ld"
                strategy="beforeInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(jsonLd)}
            </Script>
            <ApplicationsListTemplate
                features={features}
                highlightDescription={highlightDescription}
                highlightTitle={highlightTitle}
                projects={projects}
            />
        </>
    );
}
