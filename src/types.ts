type People = {
    id: string;
    name: string;
    picture: string;
    bornDate: number;
    deathDate: number;
};

type GenericTimelineObject = {
    start: number;
    end: number;
    width: number;
    name: string;
    year?: number;
    marginTop?: number;
    left?: number;
}

export type {People, GenericTimelineObject};