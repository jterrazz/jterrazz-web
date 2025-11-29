import React from 'react';

import { ChevronRight, Code2, ExternalLink, Layers, Radio } from 'lucide-react';

// Domain
import { type ProjectComponent } from '../../../domain/project.js';

// Utils
import { cn } from '../../../lib/utils.js';

import { Badge, BadgeColor, DotPulseSize } from '../../atoms/status/badge.js';

import { projectStatusToDescription } from './table-row-project-component-view-model.js';

export type TableRowProjectDetailsProps = {
    className?: string;
    component: ProjectComponent;
};

export const TableRowProjectDetails: React.FC<TableRowProjectDetailsProps> = ({
    className,
    component,
}) => {
    const generalClassName = cn(
        'mt-4 mb-6 ml-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden',
        className,
    );

    return (
        <div className={generalClassName}>
            <div className="p-5">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {component.description}
                </p>

                <div className="mt-6 flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                        <Code2 className="w-4 h-4 text-zinc-400 mt-0.5" />
                        <div className="flex flex-wrap gap-2">
                            {component.technologies.map((technology) => (
                                <Badge
                                    color={BadgeColor.Gray}
                                    key={technology}
                                    size={DotPulseSize.Small}
                                    value={technology}
                                />
                            ))}
                        </div>
                    </div>

                    {component.architectures.length > 0 && (
                        <div className="flex items-start gap-3">
                            <Layers className="w-4 h-4 text-zinc-400 mt-0.5" />
                            <div className="flex flex-wrap gap-2">
                                {component.architectures.map((architecture) => (
                                    <Badge
                                        color={BadgeColor.Gray}
                                        key={architecture}
                                        size={DotPulseSize.Small}
                                        value={architecture}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex border-t border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800">
                {component.articleUrl && (
                    <a
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        href={component.articleUrl.toString()}
                        target="_blank"
                    >
                        <ExternalLink size={14} />
                        Read Article
                    </a>
                )}
                <a
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    href={component.sourceUrl.toString()}
                    target="_blank"
                >
                    <ChevronRight size={14} />
                    {projectStatusToDescription(component.status)}
                </a>
            </div>
        </div>
    );
};
