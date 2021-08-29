type People = {
    id: string;
    qid?: string;
    name: string;
    picture: string;
    bornDate: number;
    deathDate: number;
    description?: string;
    wikipedia?: string;
    wikiquote?: string;
};

type TimelineList = {
    id: string;
    name: string;
};

type Category = {
    id: string;
    name: string;
}

type Event = {
    id: string;
    name: string;
    date: number;
}

type GenericTimelineObject = {
    start: number;
    end: number;
    width: number;
    name: string;
    year?: number;
    marginTop?: number;
    left?: number;
}

export type {People, GenericTimelineObject, TimelineList, Category, Event};