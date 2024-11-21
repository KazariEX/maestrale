import { ref, type Ref } from "@vue/reactivity";
import type { Attributes } from "./attributes";

export type TechnologyAttributes = Omit<Attributes, "speed" | "luck">;

export interface ITechnology {
    attrs: Ref<Record<string, Record<keyof TechnologyAttributes, number>>>;
    get: (type: number, attr: keyof Attributes) => number;
}

export function useTechnology(): ITechnology {
    const attrs = ref(createTechnologyAttributes());

    function get(type: number, attr: keyof Attributes) {
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

export function createTechnologyAttributes(): Record<string, TechnologyAttributes> {
    return {
        1: {
            durability: 234,
            cannon: 53,
            torpedo: 36,
            antiaircraft: 38,
            air: 0,
            reload: 27,
            hit: 14,
            dodge: 30,
            antisub: 31
        },
        get 20() {
            return this[1];
        },
        get 21() {
            return this[1];
        },
        2: {
            durability: 86,
            cannon: 54,
            torpedo: 34,
            antiaircraft: 36,
            air: 0,
            reload: 25,
            hit: 18,
            dodge: 4,
            antisub: 22
        },
        3: {
            durability: 117,
            cannon: 50,
            torpedo: 35,
            antiaircraft: 11,
            air: 0,
            reload: 15,
            hit: 6,
            dodge: 3,
            antisub: 0
        },
        4: {
            durability: 194,
            cannon: 82,
            torpedo: 0,
            antiaircraft: 18,
            air: 0,
            reload: 28,
            hit: 17,
            dodge: 26,
            antisub: 0
        },
        5: {
            durability: 194,
            cannon: 79,
            torpedo: 0,
            antiaircraft: 18,
            air: 0,
            reload: 28,
            hit: 17,
            dodge: 0,
            antisub: 0
        },
        6: {
            durability: 71,
            cannon: 0,
            torpedo: 0,
            antiaircraft: 7,
            air: 73,
            reload: 43,
            hit: 18,
            dodge: 0,
            antisub: 46
        },
        7: {
            durability: 67,
            cannon: 0,
            torpedo: 0,
            antiaircraft: 7,
            air: 60,
            reload: 40,
            hit: 18,
            dodge: 0,
            antisub: 0
        },
        8: {
            durability: 67,
            cannon: 2,
            torpedo: 60,
            antiaircraft: 0,
            air: 0,
            reload: 0,
            hit: 24,
            dodge: 29,
            antisub: 0
        },
        10: {
            durability: 184,
            cannon: 79,
            torpedo: 0,
            antiaircraft: 15,
            air: 9,
            reload: 17,
            hit: 25,
            dodge: 0,
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
            durability: 107,
            cannon: 53,
            torpedo: 12,
            antiaircraft: 11,
            air: 0,
            reload: 12,
            hit: 15,
            dodge: 3,
            antisub: 0
        },
        17: {
            durability: 67,
            cannon: 2,
            torpedo: 60,
            antiaircraft: 0,
            air: 11,
            reload: 0,
            hit: 24,
            dodge: 29,
            antisub: 0
        },
        18: {
            durability: 107,
            cannon: 56,
            torpedo: 22,
            antiaircraft: 11,
            air: 0,
            reload: 18,
            hit: 6,
            dodge: 3,
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
            durability: 7,
            cannon: 5,
            torpedo: 0,
            antiaircraft: 0,
            air: 0,
            reload: 0,
            hit: 3,
            dodge: 1,
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