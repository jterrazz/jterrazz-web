'use client';
import React from 'react';

// Domain
import { type Project } from '../../../domain/project.js';

// Utils
import { cn } from '../../../lib/utils.js';

import { Badge } from '../../atoms/status/badge.js';

import { TableRowProjectComponent } from './table-row-project-component.js';
import { projectStatusToStatusBadgeState } from './table-row-project.view-model.js';

export type TableRowProjectHeaderProps = {
    className?: string;
    project: Project;
};

export const TableRowProject: React.FC<TableRowProjectHeaderProps> = ({ className, project }) => {
    const year =
        project.createdAt &&
        (typeof project.createdAt === 'string'
            ? new Date(project.createdAt).getFullYear()
            : project.createdAt.getFullYear());

    const activeComponents =
        project.components?.filter((component) => component.status !== 'archived') || [];

    return (
        <section className={cn('group', className)}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                {/* Left Column: Project Info (Sticky) */}
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-32 space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge
                                    color={projectStatusToStatusBadgeState(project.status)}
                                    value={project.status}
                                />
                                {year && (
                                    <span className="text-sm font-medium text-zinc-400 dark:text-zinc-600 font-mono">
                                        {year}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {project.name}
                            </h2>

                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Components Grid */}
                <div className="lg:col-span-8">
                    {activeComponents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {activeComponents.map((component) => (
                                <TableRowProjectComponent
                                    component={component}
                                    key={component.name}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                            <p className="text-zinc-500 dark:text-zinc-500">
                                No active components visible.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
