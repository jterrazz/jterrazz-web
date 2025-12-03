import React from 'react';

import { ChevronRight, Layers } from 'lucide-react';

import { type ExperimentComponent } from '../../../../domain/experiment';

import { cn } from '../../../utils';

import { Badge, BadgeColor, DotPulseSize } from '../../atoms/badge/badge';

import { experimentStatusToDescription } from './experiment-table-row-component-view-model';

export type ExperimentTableRowDetailsProps = {
    className?: string;
    component: ExperimentComponent;
};

export const ExperimentTableRowDetails: React.FC<ExperimentTableRowDetailsProps> = ({
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
                <a
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    href={component.sourceUrl.toString()}
                    rel="noreferrer"
                    target="_blank"
                >
                    <ChevronRight size={14} />
                    {experimentStatusToDescription(component.status)}
                </a>
            </div>
        </div>
    );
};
