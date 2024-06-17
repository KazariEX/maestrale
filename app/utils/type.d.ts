declare global {
    export type Attributes = Partial<{
        durability: number,
        cannon: number,
        torpedo: number,
        antiaircraft: number,
        air: number,
        reload: number,
        hit: number,
        dodge: number,
        speed: number,
        luck: number,
        antisub: number
    }>;

    export interface ShipDataStatistics {
        ammo: number,
        armor_type: number,
        attrs: number[],
        attrs_growth: number[],
        name: string,
        nationality: number,
        oxy_max: number,
        rarity: number,
        star: number,
        type: number
    }

    export interface ShipDataTemplate {
        equip_1: number[],
        equip_2: number[],
        equip_3: number[],
        equip_4: number[],
        equip_5: number[],
        oil_at_end: number,
        oil_at_start: number
    }

    export interface ShipSkinTemplate {
        name: string,
        painting: string
    }

    export interface ShipTransformTemplate {
        condition_id: number[],
        effect: Attributes[],
        enable: Ref<boolean>,
        name: string,
        next_id: number[],
        ship_id: number[][]
    }
}

export {};