'use client';
import React from 'react';

import { Project } from '../../../domain/project.js';

import { mergeClassName } from '../../../lib/utils.js';

import { Badge } from '../../atoms/status/badge.js';

import { projectStatusToStatusBadgeState } from './table-row-project.view-model.js';
import { TableRowProjectComponent } from './table-row-project-component.js';

export type TableRowProjectHeaderProps = {
    project: Project;
    className?: string;
};

const ProjectHeader: React.FC<TableRowProjectHeaderProps> = ({ project }) => {
    return (
        <div className="flex flex-row items-center">
            <h2 className="font-medium">
                {project.name}{' '}
                <span className="text-storm-cloud">
                    {project.createdAt ? '~ ' + project.createdAt?.getFullYear() : ''}
                </span>
            </h2>

            <div className="border-black-and-white border-t flex-1 w-full mx-5"></div>

            <Badge
                className="ml-2"
                value={project.status}
                color={projectStatusToStatusBadgeState(project.status)}
            />
        </div>
    );
};

export const TableRowProject: React.FC<TableRowProjectHeaderProps> = ({ project, className }) => {
    const generatedClassName = mergeClassName('flex flex-col my-3', className);

    return (
        <li key={project.name} className={generatedClassName}>
            <ProjectHeader project={project} />

            <p className="text-xs text-storm-cloud mt-2 italic">{project.description}</p>

            {project.components.length > 0 && (
                <div className="mt-3">
                    {project.components
                        ?.filter((component) => component.status !== 'archived') // TODO Move to view model
                        .map((component) => (
                            <TableRowProjectComponent key={component.name} component={component} />
                        ))}
                </div>
            )}
        </li>
    );
};
