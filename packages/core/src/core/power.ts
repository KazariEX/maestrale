import { computed } from "@vue/reactivity";
import { entries } from "../utils";
import { createAttributes } from "./attributes";
import type { Ship } from "./ship";

export function usePower(ship: Ship) {
    // 合计属性战力
    const attrsPower = computed(() => {
        const attrs = createAttributes();

        for (const [key] of entries(attrs)) {
            const baseAttr = Math.floor(ship[key].value);
            const equipAttr = ship.equipAttrs.value[key];
            const techAttr = ship.techAttrs.value[key];

            attrs[key] = baseAttr + equipAttr + techAttr;
        }

        return (
            attrs.durability * 0.2 +
            attrs.cannon +
            attrs.torpedo +
            attrs.antiaircraft +
            attrs.air +
            attrs.reload +
            attrs.hit * 2 +
            attrs.dodge * 2 +
            attrs.speed +
            attrs.antisub
        );
    });

    // 装备品质战力
    const equipPower = computed(() => {
        return ship.equips.value.reduce((res, equip) => {
            if (equip) {
                const [base, strengthen] = getEquipPower(equip.rarity)!;
                res += base + strengthen * (1 + equip.level.value);
            }
            return res;
        }, 0);
    });

    // 改造技能战力
    const transPower = computed(() => {
        let res = 0;
        if (ship.canTransform()) {
            for (let i = 0; i < 6; i++) {
                const list = ship.transformTable[i];

                for (const key of list) {
                    if (key) {
                        const temp = ship.transformTemplate[key];
                        if (temp.enable.value) {
                            res += getTransPower(i)!;
                        }
                    }
                }
            }
        }
        return res;
    });

    // 综合战力
    const power = computed(() => {
        return (
            attrsPower.value +
            equipPower.value +
            transPower.value
        );
    });

    return power;
}

// 获取装备战力
function getEquipPower(rarity: number) {
    switch (rarity) {
        case 1: return [30, 5];
        case 2: return [50, 8];
        case 3: return [80, 10];
        case 4: return [120, 12];
        case 5: return [180, 15];
        case 6: return [300, 20];
    }
}

// 获取改造战力
function getTransPower(index: number) {
    switch (index) {
        case 0: return 10;
        case 1: return 15;
        case 2: return 20;
        case 3: return 25;
        case 4: return 30;
        case 5: return 50;
    }
}