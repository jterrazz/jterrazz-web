// Domain
import { type Feature, type FeatureRepository } from '../../domain/feature';

import { type FeaturedId, featuresData } from './data/features.data';

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
