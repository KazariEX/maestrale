import { computed, ref, type Ref } from "@vue/reactivity";
import { ShareCfg } from "../data";
import type { EquipDataStatistics, EquipDataTemplate } from "../data/types";
import type { Attributes } from "./attributes";

export class Equip {
    private data_statistics: EquipDataStatistics[];
    private data_template: EquipDataTemplate[];

    level: Ref<number>;

    constructor(
        public id: number
    ) {
        this.data_statistics = [];
        this.data_template = [];
        for (let i = id; i !== 0;) {
            const stat = ShareCfg.equip_data_statistics[i];
            const temp = ShareCfg.equip_data_template[i];
            this.data_statistics.push(stat);
            this.data_template.push(temp);
            i = temp.next;
        }

        // 等级
        this.level = ref(this.levelMax);
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

    // 最高等级
    get levelMax() {
        return this.data_statistics.length - 1;
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
        for (const i of [1, 2, 3] as const) {
            const a = `attribute_${i}` as const;
            const v = `value_${i}` as const;
            if (a in this.statistics.value) {
                res[this.statistics.value[a]] = this.statistics.value[v];
            }
        }
        return res;
    });
}

export function createEquip(id: number) {
    if (id % 10 !== 0 || !(id in ShareCfg.equip_data_template)) {
        return null;
    }

    // 类型收束
    id = Number(id);

    return new Equip(id);
}