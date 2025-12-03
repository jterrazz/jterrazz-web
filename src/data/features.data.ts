import { type Feature, FeatureState } from '../domain/feature';

export enum FeatureId {
    Repository = 0,
    Source = 1,
    Capitaine = 2,
}

const features: Feature[] = [
    {
        description: 'Code hosted on Github',
        id: FeatureId.Repository,
        state: FeatureState.Done,
        title: 'Repository',
        url: new URL('https://github.com/jterrazz'),
    },
    {
        description: 'This website code',
        id: FeatureId.Source,
        state: FeatureState.Done,
        title: 'Source',
        url: new URL('https://github.com/jterrazz/jterrazz-web'),
    },
    {
        description: 'A life assistant',
        id: FeatureId.Capitaine,
        state: FeatureState.InProgress,
        title: 'Capitaine',
        url: new URL('https://capitaine.io'),
    },
];

export const featuresDataAccess = {
    getAll: (): Feature[] => features,
    getById: (id: FeatureId): Feature => {
        const feature = features.find((f) => f.id === id);
        if (!feature) {
            throw new Error(`Feature with id ${id} not found`);
        }
        return feature;
    },
};
