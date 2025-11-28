import { type Attributes, ShareCfg, type ShipType, type TechnologyAttributes } from "@maestrale/data";
import { reactive } from "@vue/reactivity";

export interface ITechnology {
    attrs: Record<ShipType, TechnologyAttributes>;
    get: (type: ShipType, attr: keyof Attributes) => number;
}

export function useTechnology(): ITechnology {
    const attrs = reactive(createTechnologyAttributes());

    function get(type: ShipType, attr: keyof Attributes) {
        if (attr === "speed" || attr === "luck") {
            return 0;
        }
        return attrs[type][attr];
    }

    return {
        attrs,
        get,
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
