import { type Attributes, ShareCfg } from "@maestrale/data";
import { computed, type ComputedRef, ref, type Ref, type WritableComputedRef } from "@vue/reactivity";
import { objectKeys } from "../../utils";
import { createAttributes } from "../attributes";
import type { StrengthenType } from "../../types";
import type { Ship } from "./index";

export interface Strengthen {
    attrs: ComputedRef<Attributes>;
}

export interface StrengthenGeneral extends Strengthen {
    type: StrengthenType.General | StrengthenType.Meta;
    adjustedAttrs: Ref<Attributes>;
    maxAttrs: Attributes;
}

export interface StrengthenBlueprint extends Strengthen {
    type: StrengthenType.Blueprint;
    blueprint: Ref<number>;
    blueprint1: WritableComputedRef<number>;
    blueprint2: WritableComputedRef<number>;
    blueprintMax1: number;
    blueprintMax2: number;
    blueprintLevel: WritableComputedRef<number>;
}

// 强化：蓝图
export function useStrengthenBlueprint(ship: Ship) {
    const blueprintConfig = ShareCfg.ship_data_blueprint[ship.id];
    const strengthenConfigs = [
        ...blueprintConfig.strengthen_effect,
        ...blueprintConfig.fate_strengthen,
    ].map((i) => ShareCfg.ship_strengthen_blueprint[i]);

    // 最大蓝图数量（常规）
    const blueprintMax1 = strengthenConfigs.slice(0, 30).reduce((res, item) => {
        return res + item.need_exp;
    }, 0) / 10;

    // 最大蓝图数量（天运）
    const blueprintMax2 = strengthenConfigs.slice(30).reduce((res, item) => {
        return res + item.need_exp;
    }, 0) / 10;

    // 蓝图数量
    const blueprint = ref(blueprintMax1 + blueprintMax2);

    // 蓝图数量（常规）
    const blueprint1 = computed({
        get: () => {
            return Math.min(blueprint.value, blueprintMax1);
        },
        set: (value) => {
            blueprint.value = value;
        },
    });

    // 蓝图数量（天运）
    const blueprint2 = computed({
        get: () => {
            return Math.max(0, blueprint.value - blueprintMax1);
        },
        set: (value) => {
            blueprint.value = value + blueprintMax1;
        },
    });

    // 蓝图等级
    const blueprintLevel = computed({
        get: () => {
            let level = 0;
            let exp = 0;
            for (const item of strengthenConfigs) {
                exp += item.need_exp;
                if (blueprint.value >= exp / 10) {
                    level++;
                }
                else break;
            }
            return level;
        },
        set: (level) => {
            let exp = 0;
            for (let i = 0; i < level; i++) {
                exp += strengthenConfigs[i].need_exp;
            }
            blueprint.value = exp / 10;
        },
    });

    // 强化
    const attrs = computed(() => {
        const res = createAttributes();

        for (let i = 0; i < blueprintLevel.value; i++) {
            const item = strengthenConfigs[i];

            for (const attr of item.effect_attr) {
                res[attr[0]] += attr[1];
            }

            res.cannon += item.effect[0] / 100;
            res.torpedo += item.effect[1] / 100;
            res.air += item.effect[3] / 100;
            res.reload += item.effect[4] / 100;
        }
        return res;
    });

    // 突破
    const breakout = computed({
        get: () => {
            const lv = blueprintLevel.value;

            if (lv < 10) return 1;
            else if (lv < 20) return 2;
            else if (lv < 30) return 3;
            else return 4;
        },
        set: (value) => {
            blueprintLevel.value = {
                1: 0,
                2: 10,
                3: 20,
                4: 30,
            }[value] ?? 0;
        },
    });

    return {
        blueprintMax1,
        blueprintMax2,
        blueprint,
        blueprint1,
        blueprint2,
        blueprintLevel,
        attrs,
        breakout,
    };
}

// 强化：Meta
export function useStrengthenMeta(ship: Ship) {
    const strengthenConfig = ShareCfg.ship_strengthen_meta[ship.id];
    const repairEffects = strengthenConfig.repair_effect.map(([per, key]) => {
        return {
            per,
            ...ShareCfg.ship_meta_repair_effect[key],
        };
    });

    // 满强化值
    const maxAttrs = createAttributes();
    for (const attr of ["cannon", "torpedo", "air", "reload"] as const) {
        for (const key of strengthenConfig[`repair_${attr}`]) {
            const [attr, value] = ShareCfg.ship_meta_repair[key].effect_attr;
            maxAttrs[attr] += value;
        }
    }

    // 可调节强化值
    const adjustedAttrs = ref({ ...maxAttrs });

    // 最终强化值
    const attrs = computed(() => {
        const res = createAttributes(adjustedAttrs.value);

        let acc = 0;
        let total = 0;
        for (const attr of objectKeys(res)) {
            acc += res[attr];
            total += maxAttrs[attr];
        }
        const rate = acc / total * 100;

        for (const effect of repairEffects) {
            if (rate >= effect.per) {
                for (const [attr, value] of effect.effect_attr) {
                    res[attr] += value;
                }
            }
            else break;
        }
        return res;
    });

    return {
        maxAttrs,
        adjustedAttrs,
        attrs,
    };
}

// 强化：常规
export function useStrengthenGeneral(ship: Ship) {
    const strengthenConfig = ShareCfg.ship_data_strengthen[ship.id];

    // 满强化值
    const maxAttrs = createAttributes({
        cannon: strengthenConfig.durability[0],
        torpedo: strengthenConfig.durability[1],
        air: strengthenConfig.durability[3],
        reload: strengthenConfig.durability[4],
    });

    // 可调节强化值
    const adjustedAttrs = ref({ ...maxAttrs });

    // 最终强化值
    const attrs = computed(() => adjustedAttrs.value);

    return {
        maxAttrs,
        adjustedAttrs,
        attrs,
    };
}
