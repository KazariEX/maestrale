import { Favor } from "maestrale";

export const useSettingStore = defineStore("setting", () => {
    const defaults = ref({
        level: 125,
        breakout: 4,
        favor: Favor.Love,
    });

    return {
        defaults,
    };
}, {
    persist: true,
});
