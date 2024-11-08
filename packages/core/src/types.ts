export interface Attributes {
    durability: number;
    cannon: number;
    torpedo: number;
    antiaircraft: number;
    air: number;
    reload: number;
    hit: number;
    dodge: number;
    speed: number;
    luck: number;
    antisub: number;
}

export type TechnologyAttributes = Omit<Attributes, "speed" | "luck">;

export enum Favor {
    Disappointed,
    Stranger,
    Friendly,
    Like,
    Love,
    Pledge,
    PledgePlus
}

export enum StrengthenType {
    General,
    Meta,
    Blueprint
}