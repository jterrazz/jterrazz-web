import { Photograph, PhotographRepository } from '../../domain/photograph.js';

import { photographsData } from './data/photographs.data.js';

export class PhotographInMemoryRepository implements PhotographRepository {
    private readonly photographsData: Photograph[];

    constructor() {
        this.photographsData = photographsData;
    }

    getPhotographByIndex(index: string) {
        return this.photographsData.find((photograph) => String(photograph.index) === index);
    }

    getPhotographs() {
        return this.photographsData;
    }
}
