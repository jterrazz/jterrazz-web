import { Feature, FeatureRepository } from '../../domain/feature.js';

import { FeaturedId, featuresData } from './data/features.data.js';

export class FeatureInMemoryRepository implements FeatureRepository {
    private readonly featuresData: Feature[];

    constructor() {
        this.featuresData = featuresData;
    }

    getFeatureById(id: FeaturedId): Feature {
        const features = this.featuresData.find((feature) => feature.id === id);

        if (!features) {
            throw new Error(`Feature with id ${id} not found`);
        }

        return features;
    }

    getFeatures(): Feature[] {
        return this.featuresData;
    }
}
