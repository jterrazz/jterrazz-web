export enum FeatureState {
    Done = 'Done',
    InProgress = 'In Progress',
    Todo = 'Todo',
}

export type Feature = {
    description: string;
    id: number;
    state: FeatureState;
    title: string;
    url: URL;
};
