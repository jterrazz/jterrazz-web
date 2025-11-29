// Domain
import { type Experiment, type ExperimentRepository } from '../../domain/experiment';

import { experimentsData } from './data/experiments.data';

export class ExperimentInMemoryRepository implements ExperimentRepository {
    private readonly experimentsData: Experiment[];

    constructor() {
        this.experimentsData = experimentsData;
    }

    getExperimentBySlug(slug: string) {
        return this.experimentsData.find((experiment) => experiment.slug === slug);
    }

    getExperiments() {
        return this.experimentsData;
    }
}
