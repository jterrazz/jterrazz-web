import { Feature, FeatureState } from '../../../domain/feature.js';

export enum FeaturedId {
    Repository,
    Source,
    Capitaine,
}

export const featuresData: Feature[] = [
    {
        description: 'Code hosted on Github',
        id: FeaturedId.Repository,
        state: FeatureState.Done,
        title: 'Repository',
        url: new URL('https://github.com/jterrazz'),
    },
    {
        description: 'This website code',
        id: FeaturedId.Source,
        state: FeatureState.Done,
        title: 'Source',
        url: new URL('https://github.com/jterrazz/jterrazz-web'),
    },
    {
        description: 'A life assistant',
        id: FeaturedId.Capitaine,
        state: FeatureState.InProgress,
        title: 'Capitaine',
        url: new URL('https://capitaine.io'),
    },
];
