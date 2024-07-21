import React from 'react';

import { Experience } from '../../domain/profile/experience.js';

import { TimelineEvent } from '../molecules/timeline/TimelineEvent.jsx';

type TimelineProps = {
    experiences: Experience[];
    className?: string;
};

export const Timeline: React.FC<TimelineProps> = ({ experiences, className }) => {
    return (
        <div className={className}>
            {experiences.map((experience) => (
                <TimelineEvent
                    key={experience.title}
                    event={{
                        ...experience,
                        active: true, // TODO
                    }}
                />
            ))}
        </div>
    );
};
