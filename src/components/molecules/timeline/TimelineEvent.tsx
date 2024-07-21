import React from 'react';

import { DotPulse, DotPulseState } from '../../atoms/status/DotPulse.jsx';
import { HeadingSubSection } from '../../atoms/typography/Heading.SubSection.jsx';
import { LinkCard } from '../card/LinkCard.jsx';

export type Event = {
    year: string;
    title: string;
    description: string;
    active: boolean;
};

export type TimelineEventProps = {
    event: Event;
};

export const TimelineEvent: React.FC<TimelineEventProps> = ({ event }) => {
    return (
        <div key={event.year} className="flex flex-row px-3">
            <div className="flex flex-col items-center">
                <DotPulse
                    state={event.active ? DotPulseState.Success : DotPulseState.Disabled}
                    className="my-3"
                />
                <div className="w-0.5 bg-storm-cloud-accent flex-1" />
            </div>
            <div className="flex flex-col ml-4 text pb-4 items-start">
                {/*Add sub sub section*/}
                <HeadingSubSection title={event.title} size="large" className="mt-1 mb-0" />
                <span className="text-sm text-storm-cloud">{event.year}</span>

                <p className="text-sm text-storm-cloud my-4">{event.description}</p>

                <LinkCard
                    link={{
                        title: 'Read more',
                        url: 'http://localhost:8080',
                    }}
                    highlighted={false}
                />
            </div>
        </div>
    );
};
