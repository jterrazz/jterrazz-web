import React from 'react';
import { Circle } from 'react-feather';

import { UserExperience } from '../../../domain/user.js';

import { mergeClassName } from '../../../lib/utils.js';

import { LinkButton } from '../../atoms/link-button.js';
import { DotPulse, DotPulseColor } from '../../atoms/status/dot-pulse.js';

export type TimelineEventProps = {
    experience: UserExperience;
    active?: boolean;
    className?: string;
};

export const TimelineExperience: React.FC<TimelineEventProps> = ({
    experience,
    active = false,
    className,
}) => {
    const generatedClassName = mergeClassName('flex flex-col', className);

    return (
        <div key={experience.year} className={generatedClassName}>
            <div className="flex items-center">
                <DotPulse color={active ? DotPulseColor.Green : DotPulseColor.Black} />
                <h3 className="font-semibold ml-4 my-2 text-md">
                    {experience.year} ~ {experience.title}
                </h3>
            </div>
            <div className="flex items-stretch">
                <div className="border-storm-cloud border-l" style={{ marginLeft: 3 }} />
                <div
                    className="ml-4 flex flex-col items-start pt-2 pb-4 space-y-4"
                    style={{ paddingLeft: 3 }}
                >
                    <div className="flex items-center space-x-3">
                        <p className="text-xs font-semibold">{experience.type}</p>

                        <Circle size={4} fill="black" />
                        <LinkButton
                            link={{
                                title: experience.organization,
                                url: experience.organizationUrl,
                            }}
                            highlighted={false}
                        />
                        {experience.projectUrl && (
                            <>
                                <Circle size={4} fill="black" />

                                <LinkButton
                                    link={{
                                        title: 'Project',
                                        url: experience.projectUrl,
                                    }}
                                    highlighted={false}
                                />
                            </>
                        )}
                    </div>

                    <p className="text-sm text-storm-cloud">{experience.description}</p>

                    <div className="flex items-center space-x-3">
                        <p className="text-xs text-storm-cloud">{experience.location}</p>
                        <Circle size={4} color="gray" fill="gray" />
                        <p className="text-xs text-storm-cloud">{experience.timeframe}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
