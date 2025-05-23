export interface ExcalcInfo {
    name: string;
    main: number[];
    pioneer: number[];
    time: number;
    health: number;
    times: number;
    bukis: ExcalcBuki[];
}

export interface ExcalcBuki {
    name: string;
    damage: number;
    hit: number;
    accuracyRate: number;
    critRate: number;
    critDamage: number;
}
