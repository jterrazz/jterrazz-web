'use client';

import React from 'react';
import { Circle } from 'react-feather';
import { motion } from 'framer-motion';

import { UserExperience } from '../../../domain/user.js';

import { mergeClassName } from '../../../lib/utils.js';

import { LinkButton } from '../../atoms/link-button.js';
import { DotPulse, DotPulseColor } from '../../atoms/status/dot-pulse.js';

import { useTimelineContext } from './timeline-context.js';

export type TimelineEventProps = {
    experience: UserExperience;
    index: number;
    className?: string;
};

export const TimelineExperience: React.FC<TimelineEventProps> = ({
    experience,
    index,
    className,
}) => {
    const { activeIndex } = useTimelineContext();
    const isActive = activeIndex === index;
    const generatedClassName = mergeClassName('flex flex-col', className);

    return (
        <motion.div
            key={experience.year}
            className={generatedClassName}
            animate={{
                opacity: isActive ? 1 : 0.2,
            }}
            transition={{
                duration: 0.3,
                ease: 'easeInOut',
            }}
        >
            <div className="flex items-center">
                <DotPulse color={index === 0 ? DotPulseColor.Green : DotPulseColor.Black} />
                <motion.h3
                    className="font-semibold ml-4 my-2 text-md"
                    animate={{
                        color: isActive ? '#000000' : '#666666',
                    }}
                >
                    {experience.year} ~ {experience.title}
                </motion.h3>
            </div>
            <div className="flex items-stretch">
                <div
                    className="border-storm-cloud border-l transition-colors duration-300"
                    style={{
                        marginLeft: 3,
                    }}
                />
                <motion.div
                    className="ml-4 flex flex-col items-start"
                    transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                    }}
                >
                    <div className="flex items-center space-x-3 pt-2">
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

                    {experience.type !== 'School' && (
                        <div className="pb-3">
                            <motion.p
                                className="text-sm text-storm-cloud"
                                animate={{
                                    paddingBottom: isActive ? '1.5rem' : '0.8rem',
                                    paddingTop: isActive ? '1.5rem' : '0.8rem',
                                }}
                            >
                                {experience.description}
                            </motion.p>

                            <div className="flex items-center space-x-3">
                                <p className="text-xs text-storm-cloud">{experience.location}</p>
                                <Circle size={4} color="gray" fill="gray" />
                                <p className="text-xs text-storm-cloud">{experience.timeframe}</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};
