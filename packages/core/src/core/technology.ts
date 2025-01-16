import { ShareCfg } from "@maestrale/data";
import { ref, type Ref } from "@vue/reactivity";
import type { ShipType } from "../types";
import type { Attributes } from "./attributes";

export type TechnologyAttributes = Omit<Attributes, "speed" | "luck">;

export interface ITechnology {
    attrs: Ref<Record<ShipType, TechnologyAttributes>>;
    get: (type: ShipType, attr: keyof Attributes) => number;
}

export function useTechnology(): ITechnology {
    const attrs = ref(createTechnologyAttributes());

    function get(type: ShipType, attr: keyof Attributes) {
        if (attr === "speed" || attr === "luck") {
            return 0;
        }
        return attrs.value[type]?.[attr] ?? 0;
    }

    return {
        attrs,
        get
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
        }
    };
}