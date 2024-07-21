import React from 'react';

import { ProjectComponent } from '../../../domain/project/project.js';

import { Badge, DotPulseSize, StatusBadgeState } from '../../atoms/status/Badge.jsx';
import { HeadingSubSection } from '../../atoms/typography/Heading.SubSection.jsx';

import { projectStatusToDescription } from './TableRow.ProjectComponent.ViewModel.js';

export type TableRowProjectDetailsProps = {
    component: ProjectComponent;
};

export const TableRowProjectDetails: React.FC<TableRowProjectDetailsProps> = ({ component }) => {
    return (
        <div className="my-2 border-black-and-white border mb-4 rounded-lg text-storm-cloud-accent overflow-hidden">
            <div className="px-4 py-4 pb-5 bg-black-and-white">
                <p className="text-sm">{component.description}</p>

                <HeadingSubSection className="mt-6" title={'Technologies'} size="small" />
                <ul className="flex mt-2">
                    {component.technologies.map((technology) => (
                        <Badge
                            key={technology}
                            className="mr-2"
                            value={technology}
                            state={StatusBadgeState.Disabled}
                            size={DotPulseSize.Small}
                            filled={false}
                        />
                    ))}
                </ul>

                {component.architectures.length > 0 && (
                    <>
                        <HeadingSubSection className="mt-6" title={'Architectures'} size="small" />
                        <ul className="flex mt-2">
                            {component.architectures.map((architecture) => (
                                <Badge
                                    key={architecture}
                                    className="mr-2"
                                    value={architecture}
                                    state={StatusBadgeState.Disabled}
                                    size={DotPulseSize.Small}
                                    filled={false}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <a href={component.sourceUrl.toString()} target="_blank" className="text-sm">
                <div className="flex justify-between border-t border-black-and-white px-4 py-3 text-storm-cloud bg-black-and-white bg-black-and-white-hover cursor-pointer">
                    <p className="text-sm">{projectStatusToDescription(component.status)}</p>

                    <span>Check it out</span>
                </div>
            </a>
        </div>
    );
};
