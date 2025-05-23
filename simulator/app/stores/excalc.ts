import type { ExcalcBuki, ExcalcInfo } from "~/types/excalc";

export const useExcalcStore = defineStore("excalc", () => {
    const infos = ref<ExcalcInfo[]>([]);

    whenever(() => !infos.value.length, () => {
        infos.value.push(createInfo());
    }, {
        immediate: true,
    });

    const currentIdx = ref(0);
    const currentInfo = computed(() => {
        return infos.value[currentIdx.value]!;
    });

    function createInfo(): ExcalcInfo {
        return {
            name: "空参数",
            main: [0, 0, 0],
            pioneer: [0, 0, 0],
            time: 0,
            health: 0,
            times: 0,
            bukis: [createBuki()],
        };
    }

    function createBuki(): ExcalcBuki {
        return {
            name: "",
            damage: 0,
            hit: 0,
            accuracyRate: 100,
            critRate: 0,
            critDamage: 150,
        };
    }

    function addInfo() {
        infos.value.push(createInfo());
        currentIdx.value = infos.value.length - 1;
    }

    async function removeInfo() {
        if (await requireConfirm(`是否删除参数：${currentInfo.value.name}？`)) {
            infos.value.splice(currentIdx.value, 1);
            currentIdx.value = Math.max(0, currentIdx.value - 1);
        }
    }

    function addBuki() {
        currentInfo.value.bukis.push(createBuki());
    }

    function removeBuki(i: number) {
        currentInfo.value.bukis.splice(i, 1);
    }

    return {
        infos,
        currentIdx,
        currentInfo,
        addInfo,
        removeInfo,
        addBuki,
        removeBuki,
    };
}, {
    persist: true,
});
