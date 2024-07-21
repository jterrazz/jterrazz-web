'use client'; // TODO Only for component ?
import React from 'react';

import { Project } from '../../../domain/project/project.js';

import { Badge } from '../../atoms/status/Badge.jsx';

import { projectStatusToStatusBadgeState } from './TableRow.Project.ViewModel.js';
import { TableRowProjectComponent } from './TableRow.ProjectComponent.js';

export type TableRowProjectHeaderProps = {
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
                value={project.status}
                state={projectStatusToStatusBadgeState(project.status)}
            />
        </div>
    );
};

export const TableRowProject: React.FC<TableRowProjectHeaderProps> = ({ project }) => {
    return (
        <li key={project.name} className="flex flex-col py-4">
            <ProjectHeader project={project} />

            <p className="text-xs text-storm-cloud mt-2 italic">{project.description}</p>

            {project.components.length > 0 && (
                <div className="mt-2">
                    {project.components?.map((component) => (
                        <TableRowProjectComponent key={component.name} component={component} />
                    ))}
                </div>
            )}
        </li>
    );
};
