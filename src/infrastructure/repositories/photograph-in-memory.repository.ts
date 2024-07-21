import { Photograph } from '../../domain/photograph/photograph.js';
import { PhotographRepository } from '../../domain/photograph/photograph.repository.js';

import { photographsData } from '../data/photographs/photographs.js';

export class PhotographInMemoryRepository implements PhotographRepository {
    private readonly photographsData: Photograph[];

    constructor() {
        this.photographsData = photographsData;
    }

    async getPhotographs() {
        return this.photographsData;
    }

    async getPhotographByIndex(index: number) {
        return this.photographsData.find((photograph) => photograph.index === index);
    }
}
