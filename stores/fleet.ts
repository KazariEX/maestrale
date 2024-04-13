import { Ship } from "~/utils/Ship";

export const useFleetStore = defineStore("fleet", () => {
    //主力舰队
    const main = ref<Ship[]>([null, null, null]);

    //先锋舰队
    const vanguard = ref<Ship[]>([null, null, null]);

    //当前选中的舰船
    const curShip: Ref<Ship> = ref();

    //舰船详情显示模式
    const displayMode = ref(true);

    //属性加成显示模式
    const attrExtraMode = ref(false);

    return {
        main,
        vanguard,
        curShip,
        displayMode,
        attrExtraMode
    };
});