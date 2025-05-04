export type Photograph = {
    contentUrl: string;
    index: number;
    metadata: {
        description: string;
        socials: {
            pexels?: string;
        };
    };
};

export interface PhotographRepository {
    getPhotographByIndex(index: string): Photograph | undefined;
    getPhotographs(): Photograph[];
}
