import React from 'react';

import { ProjectComponent } from '../../../domain/project.js';

import { mergeClassName } from '../../../lib/utils.js';

import { Badge, BadgeColor, DotPulseSize } from '../../atoms/status/badge.js';
import { HeadingSubSection } from '../../atoms/typography/heading-sub-section.js';

import { projectStatusToDescription } from './table-row-project-component-view-model.js';

export type TableRowProjectDetailsProps = {
    component: ProjectComponent;
    className?: string;
};

export const TableRowProjectDetails: React.FC<TableRowProjectDetailsProps> = ({
    component,
    className,
}) => {
    const generalClassName = mergeClassName(
        'my-2 border-black-and-white border mb-4 rounded-lg text-storm-cloud-accent overflow-hidden',
        className,
    );

    return (
        <div className={generalClassName}>
            <div className="px-4 py-4 pb-5 bg-black-and-white">
                <p className="text-sm">{component.description}</p>

                <HeadingSubSection className="mt-6" size="small">
                    Technologies
                </HeadingSubSection>
                <ul className="flex mt-2">
                    {component.technologies.map((technology) => (
                        <Badge
                            key={technology}
                            className="mr-2"
                            value={technology}
                            color={BadgeColor.Gray}
                            size={DotPulseSize.Small}
                            filled={false}
                        />
                    ))}
                </ul>

                {component.architectures.length > 0 && (
                    <>
                        <HeadingSubSection className="mt-6" size="small">
                            Architectures
                        </HeadingSubSection>
                        <ul className="flex mt-2">
                            {component.architectures.map((architecture) => (
                                <Badge
                                    key={architecture}
                                    className="mr-2"
                                    value={architecture}
                                    color={BadgeColor.Gray}
                                    size={DotPulseSize.Small}
                                    filled={false}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className="flex flex-col">
                {component.articleUrl && (
                    <a href={component.articleUrl.toString()} target="_blank" className="text-sm">
                        <div className="flex justify-between border-t border-black-and-white px-4 py-3 text-storm-cloud bg-black-and-white bg-black-and-white-hover cursor-pointer">
                            <p className="text-sm">Read the article</p>
                            <span>Learn more</span>
                        </div>
                    </a>
                )}
                <a href={component.sourceUrl.toString()} target="_blank" className="text-sm">
                    <div className="flex justify-between border-t border-black-and-white px-4 py-3 text-storm-cloud bg-black-and-white bg-black-and-white-hover cursor-pointer">
                        <p className="text-sm">{projectStatusToDescription(component.status)}</p>
                        <span>Open source</span>
                    </div>
                </a>
            </div>
        </div>
    );
};
