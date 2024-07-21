import React from 'react';

import { Experience } from '../domain/profile/experience.js';

import { Value } from '../components/molecules/card/ValueCard.jsx';
import { HelloWorldTemplate } from '../components/templates/HelloWorldTemplate.js';

export default function HomePage() {
    // <div>Independant</div>
    // <div>Bridge API</div>
    // <div>Bankin</div>
    // <div>42 school</div>
    const experiences: Experience[] = [
        {
            description:
                'First experience, mobile, website, api. Django, nestjs, startup, do a little of everything',
            title: 'Dalia Delivery - Fullstack Developer',
            year: '2021',
        },
        {
            description: 'Accounting and finance formation / job',
            title: 'Accounting and finance formation / job',
            year: '2019',
        },
    ];
    // TODO Quick links My Articles - My Code - My Apps - My Photos (each with a logo)

    // TODO Values: Bienveillance + empower people through technology, Simple, I search for
    const values: Value[] = [
        {
            description: 'Less is more',
            title: 'Simple & Minimalist',
        },
        {
            description: 'Open, private & decentralized technologies',
            title: 'Power to users',
        },
        {
            description: 'Building a better world with technology',
            title: 'Goodwill',
        },
    ];

    return <HelloWorldTemplate experiences={experiences} values={values} />;
}
