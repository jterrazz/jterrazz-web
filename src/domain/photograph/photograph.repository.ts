import { Photograph } from './photograph.js';

export interface PhotographRepository {
    getPhotographByIndex(index: number): Promise<Photograph | undefined>;
    getPhotographs(): Promise<Photograph[]>;
}
