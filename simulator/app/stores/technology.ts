import { type Attributes, createTechnologyAttributes } from "maestrale";

export const useTechnologyStore = defineStore("technology", () => {
    const maxAttrs = createTechnologyAttributes();
    const attrs = ref(createTechnologyAttributes());

    function get(type: number, attr: keyof Attributes) {
        if (attr === "speed" || attr === "luck") {
            return 0;
        }
        return attrs.value[type]?.[attr] ?? 0;
    }

    return {
        maxAttrs,
        attrs,
        get
    };
}, {
    persist: true
});

export function useTechnology() {
    const technologyStore = useTechnologyStore();
    return {
        maxAttrs: technologyStore.maxAttrs,
        attrs: storeToRefs(technologyStore).attrs,
        get: technologyStore.get
    };
}