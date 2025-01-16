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
        1: {
            durability: 258,
            cannon: 62,
            torpedo: 44,
            antiaircraft: 39,
            air: 0,
            reload: 27,
            hit: 14,
            dodge: 36,
            antisub: 33
        },
        get 20() {
            return this[1];
        },
        get 21() {
            return this[1];
        },
        2: {
            durability: 92,
            cannon: 59,
            torpedo: 36,
            antiaircraft: 38,
            air: 0,
            reload: 26,
            hit: 23,
            dodge: 5,
            antisub: 22
        },
        3: {
            durability: 129,
            cannon: 56,
            torpedo: 37,
            antiaircraft: 13,
            air: 0,
            reload: 16,
            hit: 8,
            dodge: 4,
            antisub: 0
        },
        4: {
            durability: 213,
            cannon: 92,
            torpedo: 0,
            antiaircraft: 20,
            air: 0,
            reload: 17,
            hit: 29,
            dodge: 29,
            antisub: 0
        },
        5: {
            durability: 213,
            cannon: 87,
            torpedo: 0,
            antiaircraft: 20,
            air: 0,
            reload: 17,
            hit: 29,
            dodge: 1,
            antisub: 0
        },
        6: {
            durability: 78,
            cannon: 0,
            torpedo: 0,
            antiaircraft: 7,
            air: 80,
            reload: 44,
            hit: 21,
            dodge: 0,
            antisub: 49
        },
        7: {
            durability: 74,
            cannon: 0,
            torpedo: 0,
            antiaircraft: 7,
            air: 67,
            reload: 41,
            hit: 21,
            dodge: 0,
            antisub: 0
        },
        8: {
            durability: 67,
            cannon: 2,
            torpedo: 64,
            antiaircraft: 0,
            air: 0,
            reload: 0,
            hit: 26,
            dodge: 31,
            antisub: 0
        },
        10: {
            durability: 203,
            cannon: 87,
            torpedo: 0,
            antiaircraft: 17,
            air: 9,
            reload: 17,
            hit: 26,
            dodge: 1,
            antisub: 0
        },
        12: {
            durability: 51,
            cannon: 0,
            torpedo: 0,
            antiaircraft: 15,
            air: 0,
            reload: 0,
            hit: 0,
            dodge: 0,
            antisub: 0
        },
        13: {
            durability: 118,
            cannon: 59,
            torpedo: 14,
            antiaircraft: 13,
            air: 0,
            reload: 16,
            hit: 13,
            dodge: 4,
            antisub: 0
        },
        17: {
            durability: 67,
            cannon: 2,
            torpedo: 64,
            antiaircraft: 0,
            air: 11,
            reload: 0,
            hit: 26,
            dodge: 31,
            antisub: 0
        },
        18: {
            durability: 118,
            cannon: 62,
            torpedo: 24,
            antiaircraft: 13,
            air: 0,
            reload: 19,
            hit: 7,
            dodge: 4,
            antisub: 0
        },
        19: {
            durability: 49,
            cannon: 0,
            torpedo: 0,
            antiaircraft: 15,
            air: 0,
            reload: 0,
            hit: 0,
            dodge: 0,
            antisub: 0
        },
        22: {
            durability: 12,
            cannon: 10,
            torpedo: 0,
            antiaircraft: 0,
            air: 0,
            reload: 0,
            hit: 3,
            dodge: 3,
            antisub: 0
        },
        get 23() {
            return this[22];
        },
        get 24() {
            return this[22];
        }
    };
}