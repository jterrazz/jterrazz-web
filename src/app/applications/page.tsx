import React from 'react';
import { type Metadata } from 'next';

import { ApplicationsListTemplate } from '../../components/templates/applications-list.template.js';

import { type Project } from '../../domain/project.js';

import { FeaturedId } from '../../infrastructure/repositories/data/features.data.js';
import { FeatureInMemoryRepository } from '../../infrastructure/repositories/feature-in-memory.repository.js';
import { ProjectInMemoryRepository } from '../../infrastructure/repositories/project-in-memory.repository.js';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    description: 'The best of my development projects, showcasing my skills and experience.',
    title: 'Applications - Jterrazz',
};

export default async function ApplicationsPage() {
    const projectRepository = new ProjectInMemoryRepository();
    const featureRepository = new FeatureInMemoryRepository();

    const projects: Project[] = projectRepository.getProjects();
    const features = [
        featureRepository.getFeatureById(FeaturedId.Repository),
        featureRepository.getFeatureById(FeaturedId.Capitaine),
        featureRepository.getFeatureById(FeaturedId.Source),
    ];

    const highlightTitle = 'Applications';
    const highlightDescription =
        'Welcome to my personal collection of projects. My focus is on creating tools that help you grow.';

    return (
        <ApplicationsListTemplate
            features={features}
            highlightDescription={highlightDescription}
            highlightTitle={highlightTitle}
            projects={projects}
        />
    );
}
