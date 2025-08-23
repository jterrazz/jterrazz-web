import React from 'react';

// Domain
import { type Feature } from '../../domain/feature.js';
import { type Project } from '../../domain/project.js';
import { UserContactType } from '../../domain/user.js';

// Infrastructure
import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository.js';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.js';
import { Highlight } from '../molecules/typography/highlight.js';
import { MainContainer } from '../organisms/main-container.jsx';
import { TableRowProject } from '../organisms/table-of-projects/table-row-project.js';
import { Table } from '../organisms/table-of-projects/table.js';

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
        text: 'Check me on GitHub',
    };

    return (
        <MainContainer>
            <Highlight button={button} description={highlightDescription} title={highlightTitle} />
            <HeadingSection>
                <HighlightedText className="pr-2">Projects</HighlightedText>
            </HeadingSection>
            <Table>
                {projects.map((project) => (
                    <TableRowProject
                        key={project.name}
                        project={project as unknown as Project}
                    />
                ))}
            </Table>
        </MainContainer>
    );
};
