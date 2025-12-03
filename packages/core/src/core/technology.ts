import { ShareCfg, type ShipType, type TechnologyAttributes } from "@maestrale/data";
import { reactive } from "@vue/reactivity";

export interface ITechnology {
    attrs: Record<ShipType, TechnologyAttributes>;
}

export function createTechnology(): ITechnology {
    const attrs = reactive(createTechnologyAttributes());

    return {
        attrs,
    };
}

export function createTechnologyAttributes(): Record<ShipType, TechnologyAttributes> {
    return {
        ...structuredClone(ShareCfg.fleet_tech_attributes),
        get 20() {
            return this[1];
        },
        get 21() {
            return this[1];
        },
        get 23() {
            return this[22];
        },
        get 24() {
            return this[22];
        },
    };
}
