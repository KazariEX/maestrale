import type { Commander } from "maestrale";

export const useCommanderStore = defineStore("commander", () => {
    const commanders = shallowReactive<Commander[]>([]);

    const serializeStore = useSerializeStore();

    serializeStore.use("commanders", commanders, (storeValue) => {
        commanders.push(...storeValue);
    });

    const currentIdx = ref<number>();
    const currentCommander = computed(() => {
        return currentIdx.value !== void 0 ? commanders[currentIdx.value] : null;
    });

    function add(commander: Commander) {
        commanders.push(commander);
        currentIdx.value = commanders.length - 1;
    }

    function remove(i: number) {
        commanders.splice(i, 1);
        if (currentIdx.value && commanders.length) {
            currentIdx.value = Math.min(currentIdx.value, commanders.length - 1);
        }
    }

    function toggle(i: number | undefined) {
        if (currentIdx.value === i) {
            currentIdx.value = void 0;
        }
        else {
            currentIdx.value = i;
        }
    }

    return {
        commanders,
        currentIdx,
        currentCommander,
        add,
        remove,
        toggle,
    };
});
