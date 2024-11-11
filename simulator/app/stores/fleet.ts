import type { Ship } from "maestrale";

export const useFleetStore = defineStore("fleet", () => {
    const main1 = shallowRef<Ship | null>(null);
    const main2 = shallowRef<Ship | null>(null);
    const main3 = shallowRef<Ship | null>(null);
    const main = computed(() => [
        main1.value,
        main2.value,
        main3.value
    ]);

    const vanguard1 = shallowRef<Ship | null>(null);
    const vanguard2 = shallowRef<Ship | null>(null);
    const vanguard3 = shallowRef<Ship | null>(null);
    const vanguard = computed(() => [
        vanguard1.value,
        vanguard2.value,
        vanguard3.value
    ]);

    const currentShip = shallowRef<Ship | null>(null);
    const attrMode = ref<"equips" | "tech">("equips");
    const infoMode = ref<"details" | "equips">("details");
    const panelTab = ref<"strengthen" | "transform">("strengthen");

    function setCurrentShip(ship: Ship | null) {
        currentShip.value = ship;
        panelTab.value = "strengthen";
    }

    return {
        main1,
        main2,
        main3,
        main,
        vanguard1,
        vanguard2,
        vanguard3,
        vanguard,
        currentShip,
        attrMode,
        infoMode,
        panelTab,
        setCurrentShip
    };
});