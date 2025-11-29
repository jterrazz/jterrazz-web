// Domain
import { type UserExperience } from '../../../domain/user';

const PARIS = 'Paris, France';
export const userExperiencesData: UserExperience[] = [
    {
        description:
            'Innovated core banking services with a strong focus on security and user privacy. ' +
            'Mastered Node.js & TypeScript, and led legacy system modernization with TDD, Docker, and integration tests.',
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
            'Built a synthetic asset platform leveraging Chainlink oracles and smart contracts for real-time pricing. ' +
            'Enhanced my skills in blockchain integration and decentralized finance (DeFi).',
        location: 'Waterloo, Ontario, Canada',
        organization: 'ETHWaterloo',
        organizationUrl: 'https://ethwaterloo.com/',
        experimentUrl: 'https://devpost.com/software/defy-dy',
        timeframe: 'Nov 2019',
        title: 'Recipient of 4 bounties for the ETHWaterloo hackathon',
        type: 'Hackathon',
        year: '2019',
    },
    {
        description:
            'Co-created a blockchain-based crowdfunding platform using CVT tokens. ' +
            'Strengthened my expertise in smart contracts and decentralized applications.',
        location: PARIS,
        organization: 'ETHParis',
        organizationUrl: 'https://ethparis.com/',
        experimentUrl: 'https://devpost.com/software/ethparis',
        timeframe: 'Mar 2019',
        title: 'Recipient of 1 bounty for the ETHParis hackathon',
        type: 'Hackathon',
        year: '2019',
    },
    {
        description:
            'Refined APIs and optimized a NuxtJS site, boosting SEO and third-party integrations like Stripe. ' +
            'Developed a customizable B2B product, focusing on secure and scalable development.',
        location: PARIS,
        organization: 'Dalia Solutions',
        organizationUrl: 'https://www.linkedin.com/company/dalia-solutions/',
        timeframe: 'Aug 2018 - Jan 2019',
        title: 'Fullstack developer',
        type: 'Job',
        year: '2018',
    },
    {
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
            'Deepened my understanding of accounting principles, with hands-on experience in legal and social missions.',
        location: 'Ajaccio, France',
        organization: "Cabinet d'expertise comptable Mazzoni",
        organizationUrl: 'https://fr.kompass.com/c/m-francois-mazzoni/fr0599365/',
        timeframe: 'Apr 2016',
        title: 'Chartered accountant',
        type: 'Internship',
        year: '2016',
    },
    {
        location: 'Aix en Provence, France',
        organization: 'Aix Marseille University',
        organizationUrl: 'https://www.univ-amu.fr/',
        timeframe: 'Septembre 2013 - Juin 2016',
        title: 'Bachelor of Economics',
        type: 'School',
        year: '2013',
    },
];
