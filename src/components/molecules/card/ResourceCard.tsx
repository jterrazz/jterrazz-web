import React from 'react';
import Image from 'next/image';

import { DotPulseState } from '../../atoms/status/DotPulse.jsx';
import { HeadingSubSection } from '../../atoms/typography/Heading.SubSection.jsx';

export type Resource = {
    description: string;
    state: DotPulseState;
    title: string;
    url: string;
};

export type ResourceCardProps = {
    resource: Resource;
    highlighted?: boolean;
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, highlighted }) => {
    const generatedClassName = `px-4 py-3 border mr-4 rounded-lg w-64 flex items-center justify-between ${highlighted ? 'text-white bg-storm-cloud-accent border-black' : 'bg-black-and-white-hover border-black-and-white'}`;

    return (
        <a key={resource.title} href={resource.url} target="_blank">
            <div className={generatedClassName}>
                <div>
                    <HeadingSubSection title={resource.title} />
                    <p className="text-xs text-storm-cloud">{resource.description}</p>
                </div>
                <Image
                    src={
                        highlighted
                            ? '/assets/icons/arrow-right.light.svg'
                            : '/assets/icons/arrow-right.dark.svg'
                    }
                    className=""
                    alt=""
                    width="14"
                    height="14"
                    color="white"
                />
            </div>
        </a>
    );
};
