// Domain
import { type UserExperience } from '../../../domain/user';

const PARIS = 'Paris, France';
export const userExperiencesData: UserExperience[] = [
    {
        description:
            'Released my first mobile app, "AI News", to the App Store. A playful tool to challenge critical thinking by spotting AI-generated headlines.',
        location: 'Personal Project',
        organization: 'AI News',
        organizationUrl: 'https://apps.apple.com/us/app/ai-news-smart-world-news/id6742116038',
        experimentUrl: '/experiments/ai-news',
        timeframe: 'April 2025',
        title: 'Mobile App Release',
        type: 'Job',
        year: '2025',
    },
    {
        description:
            'Engineering secure core banking infrastructure. Modernizing legacy systems with Node.js, TypeScript, and rigorous TDD practices.',
        location: 'France',
        organization: 'Bankin / BridgeApi',
        organizationUrl: 'https://bankin.com/',
        timeframe: 'Avril 2020 - Present',
        title: 'Backend Developer',
        type: 'Job',
        year: '2020',
    },
    {
        description:
            'Built a synthetic asset platform using Chainlink oracles for real-time pricing. Secured 4 bounties for innovation in DeFi.',
        location: 'Waterloo, Ontario, Canada',
        organization: 'ETHWaterloo',
        organizationUrl: 'https://ethwaterloo.com/',
        experimentUrl: '/experiments/defy-dy',
        timeframe: 'Nov 2019',
        title: 'Hackathon Winner',
        type: 'Hackathon',
        year: '2019',
    },
    {
        description:
            'Developed a blockchain crowdfunding platform powered by CVT tokens. Awarded a bounty for smart contract implementation.',
        location: PARIS,
        organization: 'ETHParis',
        organizationUrl: 'https://ethparis.com/',
        experimentUrl: '/experiments/cvt-crowdfunding',
        timeframe: 'Mar 2019',
        title: 'Hackathon Winner',
        type: 'Hackathon',
        year: '2019',
    },
    {
        description:
            'Optimized B2B products with NuxtJS and Stripe integrations. Enhanced API performance and led SEO improvements.',
        location: PARIS,
        organization: 'Dalia Solutions',
        organizationUrl: 'https://www.linkedin.com/company/dalia-solutions/',
        timeframe: 'Aug 2018 - Jan 2019',
        title: 'Fullstack Developer',
        type: 'Job',
        year: '2018',
    },
    {
        description:
            'Studied C, C++, Assembly, and system architecture through peer-to-peer learning.',
        location: PARIS,
        organization: '42',
        organizationUrl: 'https://www.42.fr/',
        timeframe: 'Mars 2017 - Mar 2020',
        title: '42 Paris School',
        type: 'School',
        year: '2017',
    },
    {
        description:
            'Assisted with legal and social auditing missions, gaining practical insight into corporate accounting.',
        location: 'Ajaccio, France',
        organization: "Cabinet d'expertise comptable Mazzoni",
        organizationUrl: 'https://fr.kompass.com/c/m-francois-mazzoni/fr0599365/',
        timeframe: 'Apr 2016',
        title: 'Accounting Intern',
        type: 'Internship',
        year: '2016',
    },
    {
        description: 'Specialization in Economics and Management.',
        location: 'Aix en Provence, France',
        organization: 'Aix Marseille University',
        organizationUrl: 'https://www.univ-amu.fr/',
        timeframe: 'Septembre 2013 - Juin 2016',
        title: 'Bachelor of Economics',
        type: 'School',
        year: '2013',
    },
];
