import { computed, ref, type Ref } from "@vue/reactivity";
import { ShareCfg } from "../data";
import type { SPWeaponDataStatistics } from "../data/types";
import type { Attributes } from "./attributes";

export class SPWeapon {
    level: Ref<number>;

    private data_statistics: SPWeaponDataStatistics[];

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
        this.level = ref(10);
    }

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

    private statistics = computed(() => {
        return {
            ...this.data_statistics[0],
            ...this.data_statistics[this.level.value]
        };
    });

    // 属性
    attrs = computed(() => {
        const res: Partial<Attributes> = {};
        for (const i of [1, 2] as const) {
            const a = `attribute_${i}` as const;
            const v = `value_${i}` as const;
            const vr = `value_${i}_random` as const;
            if (a in this.statistics.value) {
                res[this.statistics.value[a]] = this.statistics.value[v] + this.statistics.value[vr];
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