export enum FeatureState {
    Done = 'Done',
    InProgress = 'In Progress',
    Todo = 'Todo',
}

export type Feature = {
    id: number;
    description: string;
    state: FeatureState;
    title: string;
    url: URL;
};

export interface FeatureRepository {
    getFeatures(): Feature[];
    getFeatureById(id: number): Feature;
}
