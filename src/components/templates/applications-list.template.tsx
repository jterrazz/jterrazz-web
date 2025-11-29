'use client';

import React from 'react';

import Script from 'next/script';

// Domain
import { type Feature } from '../../domain/feature.js';
import { type Project } from '../../domain/project.js';
import { UserContactType } from '../../domain/user.js';

// Infrastructure
import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository.js';

import { SectionDivider } from '../molecules/section-divider.js';
import { Highlight } from '../molecules/typography/highlight.jsx';
import { TableRowProject } from '../organisms/table-of-projects/table-row-project.js';

type ApplicationsListTemplateProps = {
    features: readonly Feature[];
    highlightDescription: string;
    highlightTitle: string;
    projects: readonly SerializableProject[];
};

type SerializableProject = Omit<Project, 'components' | 'createdAt' | 'url'> & {
    components: Array<
        Omit<Project['components'][number], 'articleUrl' | 'sourceUrl'> & {
            articleUrl: null | string;
            sourceUrl: string;
        }
    >;
    createdAt: null | string;
    url: string;
};

export const ApplicationsListTemplate: React.FC<ApplicationsListTemplateProps> = ({
    highlightDescription,
    highlightTitle,
    projects,
}) => {
    const button = {
        href: new UserInMemoryRepository().getContact(UserContactType.GitHub).url.toString(),
        text: 'View GitHub',
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description: highlightDescription,
        name: highlightTitle,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/applications`,
    };

    const apps = projects.filter((p) => ['Capitaine IO', 'Fake News', 'Jterrazz'].includes(p.name));
    const libs = projects.filter((p) => p.name === 'Typescript Packages');
    const academic = projects.filter((p) => p.name === '42 Projects');

    const renderProjects = (list: typeof projects) => (
        <div className="flex flex-col gap-24 md:gap-32">
            {list.map((project) => (
                <TableRowProject key={project.name} project={project as unknown as Project} />
            ))}
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            <Script
                id="applications-list-json-ld"
                strategy="beforeInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(jsonLd)}
            </Script>

            {/* Hero Section */}
            <div className="w-full border-b border-zinc-100 dark:border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <Highlight
                        button={button}
                        description={highlightDescription}
                        title={highlightTitle}
                    />
                </div>
            </div>

            {/* Projects Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 space-y-32">
                {/* Applications */}
                {apps.length > 0 && (
                    <section>
                        <SectionDivider className="mb-16" title="Applications" />
                        {renderProjects(apps)}
                    </section>
                )}

                {/* Libraries & Tools */}
                {libs.length > 0 && (
                    <section>
                        <SectionDivider className="mb-16" title="Libraries & Tools" />
                        {renderProjects(libs)}
                    </section>
                )}

                {/* Academic */}
                {academic.length > 0 && (
                    <section>
                        <SectionDivider className="mb-16" title="Projects" />
                        {renderProjects(academic)}
                    </section>
                )}
            </div>
        </div>
    );
};
