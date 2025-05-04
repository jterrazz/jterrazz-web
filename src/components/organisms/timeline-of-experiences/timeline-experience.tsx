'use client';

import React from 'react';
import { Circle } from 'react-feather';
import { motion } from 'framer-motion';

import { UserExperience } from '../../../domain/user.js';

import { cn } from '../../../lib/utils.js';

import { LinkButton } from '../../atoms/link-button.js';
import { DotPulse, DotPulseColor } from '../../atoms/status/dot-pulse.js';

import { useTimelineContext } from './timeline-context.js';

export type TimelineEventProps = {
    className?: string;
    experience: UserExperience;
    index: number;
};

export const TimelineExperience: React.FC<TimelineEventProps> = ({
    className,
    experience,
    index,
}) => {
    const { activeIndex } = useTimelineContext();
    const isActive = activeIndex === index;
    const generatedClassName = cn('flex flex-col', className);

    return (
        <motion.div
            animate={{
                opacity: isActive ? 1 : 0.2,
            }}
            className={generatedClassName}
            key={experience.year}
            transition={{
                duration: 0.3,
                ease: 'easeInOut',
            }}
        >
            <div className="flex items-center">
                <DotPulse color={index === 0 ? DotPulseColor.Green : DotPulseColor.Black} />
                <motion.h3
                    animate={{
                        color: isActive ? '#000000' : '#666666',
                    }}
                    className="font-semibold ml-4 my-2 text-md"
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

                        <Circle fill="black" size={4} />
                        <LinkButton
                            highlighted={false}
                            link={{
                                title: experience.organization,
                                url: experience.organizationUrl,
                            }}
                        />
                        {experience.projectUrl && (
                            <>
                                <Circle fill="black" size={4} />

                                <LinkButton
                                    highlighted={false}
                                    link={{
                                        title: 'Project',
                                        url: experience.projectUrl,
                                    }}
                                />
                            </>
                        )}
                    </div>

                    {experience.type !== 'School' && (
                        <div className="pb-3">
                            <motion.p
                                animate={{
                                    paddingBottom: isActive ? '1.5rem' : '0.8rem',
                                    paddingTop: isActive ? '1.5rem' : '0.8rem',
                                }}
                                className="text-sm text-storm-cloud"
                            >
                                {experience.description}
                            </motion.p>

                            <div className="flex items-center space-x-3">
                                <p className="text-xs text-storm-cloud">{experience.location}</p>
                                <Circle color="gray" fill="gray" size={4} />
                                <p className="text-xs text-storm-cloud">{experience.timeframe}</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};
