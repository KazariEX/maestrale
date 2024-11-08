import { ref, type Ref } from "@vue/reactivity";
import technologyTable from "../data/constraint/technology";
import type { Attributes, TechnologyAttributes } from "../types";

export interface ITechnology {
    attrs: Ref<Record<string, Record<keyof TechnologyAttributes, number>>>;
    get: (type: number, attr: keyof Attributes) => number;
}

export function useTechnology(): ITechnology {
    const attrs = ref(structuredClone(technologyTable));

    function get(type: number, attr: keyof Attributes) {
        if (attr === "speed" || attr === "luck") {
            return 0;
        }
        const t = getTechnolagyType(type);
        return attrs.value[t][attr] ?? 0;
    }

    return {
        attrs,
        get
    };
}

function getTechnolagyType(type: number) {
    switch (type) {
        case 20:
        case 21:
            return 1;
        case 23:
        case 24:
            return 22;
        default:
            return type;
    }
}