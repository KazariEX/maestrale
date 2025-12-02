import { computed } from "@vue/reactivity";
import { objectKeys } from "../../utils";
import { createAttributes } from "../attributes";
import type { Ship } from "./index";

export function usePower(ship: Ship) {
    // 合计属性战力
    const attrsPower = computed(() => {
        const attrs = createAttributes();

        for (const attr of objectKeys(attrs)) {
            attrs[attr] = Math.floor(ship[attr].value) + ship.equipAttrs.value[attr] + ship.techAttrs.value[attr];
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
        if (ship.transform) {
            for (let i = 0; i < 6; i++) {
                for (const items of ship.transform.matrix[i]) {
                    for (const { isEnabled } of items) {
                        if (isEnabled.value) {
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
        return Math.floor(attrsPower.value + equipPower.value + transPower.value);
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
