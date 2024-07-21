'use client';

import React from 'react';

import { Feature } from '../../domain/feature.js';
import { Project } from '../../domain/project.js';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.js';
import { Highlight } from '../molecules/typography/highlight.js';
import { MainContainer } from '../organisms/main-container.jsx';
import { Table } from '../organisms/table-of-projects/table.js';
import { TableRowProject } from '../organisms/table-of-projects/table-row-project.js';

type ApplicationsListTemplateProps = {
    highlightTitle: string;
    highlightDescription: string;
    projects: readonly Project[];
    features: readonly Feature[];
};

export const ApplicationsListTemplate: React.FC<ApplicationsListTemplateProps> = ({
    highlightTitle,
    highlightDescription,
    projects,
}) => {
    return (
        <MainContainer>
            <Highlight title={highlightTitle} description={highlightDescription} />
            <HeadingSection>
                <HighlightedText className="pr-2">Projects</HighlightedText>
            </HeadingSection>
            <Table>
                {projects.map((project) => (
                    <TableRowProject key={project.name} project={project} />
                ))}
            </Table>
        </MainContainer>
    );
};
