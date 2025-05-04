'use client';
import React from 'react';

import { type Project } from '../../../domain/project.js';

import { cn } from '../../../lib/utils.js';

import { Badge } from '../../atoms/status/badge.js';

import { projectStatusToStatusBadgeState } from './table-row-project.view-model.js';
import { TableRowProjectComponent } from './table-row-project-component.js';

export type TableRowProjectHeaderProps = {
    className?: string;
    project: Project;
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
                color={projectStatusToStatusBadgeState(project.status)}
                value={project.status}
            />
        </div>
    );
};

export const TableRowProject: React.FC<TableRowProjectHeaderProps> = ({ className, project }) => {
    const generatedClassName = cn('flex flex-col my-3', className);

    return (
        <li className={generatedClassName} key={project.name}>
            <ProjectHeader project={project} />

            <p className="text-xs text-storm-cloud mt-2 italic">{project.description}</p>

            {project.components.length > 0 && (
                <div className="mt-3">
                    {project.components
                        ?.filter((component) => component.status !== 'archived') // TODO Move to view model
                        .map((component) => (
                            <TableRowProjectComponent component={component} key={component.name} />
                        ))}
                </div>
            )}
        </li>
    );
};
