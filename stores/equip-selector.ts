import { Ship } from "~/utils/Ship";

export const useEquipSelectorStore = defineStore("equip-selector", () => {
    const openState = ref(false);
    const curShip = ref<Ship>();
    const curSlot = ref(0);
    const resolve = ref();

    function open(ship: Ship, slot: number) {
        return new Promise((res, rej) => {
            openState.value = true;
            curShip.value = ship;
            curSlot.value = slot;
            resolve.value = res;
        });
    }

    function close() {
        openState.value = false;
    }

    return {
        openState,
        curShip,
        curSlot,
        open,
        close,
        resolve
    };
});