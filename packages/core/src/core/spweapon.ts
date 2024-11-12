import { computed, ref, type Ref } from "@vue/reactivity";
import { ShareCfg } from "../data";
import type { SPWeaponDataStatistics } from "../data/types";
import type { Attributes } from "./attributes";

export class SPWeapon {
    private data_statistics: SPWeaponDataStatistics[];

    level: Ref<number>;

    constructor(
        public id: number
    ) {
        this.data_statistics = [];
        for (let i = id; i !== 0;) {
            const stat = ShareCfg.spweapon_data_statistics[i];
            this.data_statistics.push(stat);

            if (stat.next - i > 1) break;
            i = stat.next;
        }

        // 等级
        this.level = ref(this.maxLevel);
    }

    private curStat = computed(() => {
        return {
            ...this.data_statistics[0],
            ...this.data_statistics[this.level.value]
        };
    });

    // 名称
    get name() {
        return this.data_statistics[0].name;
    }

    // 图标
    get icon() {
        return this.data_statistics[0].icon;
    }

    // 稀有度
    get rarity() {
        return this.data_statistics[0].rarity;
    }

    // 最高等级
    get maxLevel() {
        return this.data_statistics.length - 1;
    }

    // 属性
    attrs = computed(() => {
        const res: Partial<Attributes> = {};
        for (const i of [1, 2] as const) {
            const attrKey = `attribute_${i}` as const;
            const valueKey = `value_${i}` as const;
            const randomValueKey = `value_${i}_random` as const;
            if (attrKey in this.curStat.value) {
                const attr = this.curStat.value[attrKey];
                const value = this.curStat.value[valueKey];
                const randomValue = this.curStat.value[randomValueKey];
                res[attr] = value + randomValue;
            }
        }
        return res;
    });
}

export function createSPWeapon(id: number) {
    if (id % 10 !== 0 || !(id in ShareCfg.spweapon_data_statistics)) {
        return null;
    }

    // 类型收束
    id = Number(id);

    return new SPWeapon(id);
}