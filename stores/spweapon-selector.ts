import { Ship } from "~/utils/Ship";

export const useSpweaponSelectorStore = defineStore("spweapon-selector", () => {
    const openState = ref(false);
    const curShip = ref<Ship>();
    const resolve = ref();

    function open(ship: Ship) {
        return new Promise((res, rej) => {
            openState.value = true;
            curShip.value = ship;
            resolve.value = res;
        });
    }

    function close() {
        openState.value = false;
    }

    return {
        openState,
        curShip,
        open,
        close,
        resolve
    };
});