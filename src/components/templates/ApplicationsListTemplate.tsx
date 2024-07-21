'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Project } from '../../domain/project/project.js';

import { HeadingSection } from '../atoms/typography/Heading.Section.js';
import { Resource, ResourceCard } from '../molecules/card/ResourceCard.jsx';
import { TableHeaderProject } from '../molecules/table/TableHeader.Project.jsx';
import { TableRowProject } from '../molecules/table/TableRow.Project.jsx';
import { Highlight } from '../molecules/typography/Highlight.js';
import { HorizontalCards } from '../organisms/HorizontalCards.js';
import { Table } from '../organisms/Table.js';

type ProjectOverviewProps = {
    projects: readonly Project[];
    resources: readonly Resource[];
};

// TODO: Add package logger
// TODO Credit image from noun project

export const ApplicationsListTemplate: React.FC<ProjectOverviewProps> = ({
    projects,
    resources,
}) => {
    return (
        <main
            className="w-full flex flex-col self-center justify-self-center"
            style={{
                maxWidth: 740,
            }}
        >
            <div className="flex items-center">
                <Highlight
                    className="my-20"
                    title="Applications"
                    description="Explore my coding projects designed to inspire and empower. I focus on creating tools that liberate and enhance lives. Check out my latest ventures in Self Improvement and Web3 + DeFi, aimed at giving you control and freedom in exciting new ways. Let’s build a brighter future together!"
                />

                <Image
                    src="/assets/canva.png"
                    className="self-center mx-16"
                    alt=""
                    width="164"
                    height="164"
                />
            </div>

            <HeadingSection className="mb-6" title="Projects" />
            <TableHeaderProject className="mb-2" />
            <Table className="mb-16">
                {projects.map((project) => (
                    <TableRowProject key={project.name} project={project} />
                ))}
            </Table>

            <HeadingSection className="mb-6" title="Resources" />
            <div className="-ml-4">
                <HorizontalCards>
                    {resources.map((resource, index) => (
                        <motion.nav
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1 }}
                            transition={{ duration: 0.08 }}
                        >
                            <ResourceCard resource={resource} highlighted={index === 0} />
                        </motion.nav>
                    ))}
                </HorizontalCards>
            </div>
        </main>
    );
};
