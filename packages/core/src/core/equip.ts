import { type Attributes, ShareCfg } from "@maestrale/data";
import { computed, ref, type Ref } from "@vue/reactivity";

export class Equip {
    private statistics: ShareCfg.EquipDataStatistics[];
    private templates: ShareCfg.EquipDataTemplate[];

    level: Ref<number>;

    constructor(
        public id: number,
    ) {
        this.statistics = [];
        this.templates = [];
        for (let i = id; i !== 0;) {
            const stat = ShareCfg.equip_data_statistics[i];
            const temp = ShareCfg.equip_data_template[i];
            this.statistics.push(stat);
            this.templates.push(temp);
            i = temp.next;
        }

        // 等级
        this.level = ref(this.maxLevel);
    }

    private curStat = computed(() => {
        return {
            ...this.statistics[0],
            ...this.statistics[this.level.value],
        };
    });

    // 名称
    get name() {
        return this.statistics[0].name;
    }

    // 图标
    get icon() {
        return this.statistics[0].icon;
    }

    // 阵营
    get nationality() {
        return this.statistics[0].nationality;
    }

    // 稀有度
    get rarity() {
        return this.statistics[0].rarity;
    }

    // 类型
    get type() {
        return this.statistics[0].type;
    }

    // 最高等级
    get maxLevel() {
        return this.statistics.length - 1;
    }

    // 属性
    attrs = computed(() => {
        const res: Partial<Attributes> = {};
        for (const i of [1, 2, 3] as const) {
            const attrKey = `attribute_${i}` as const;
            const valueKey = `value_${i}` as const;
            if (attrKey in this.curStat.value) {
                const attr = this.curStat.value[attrKey];
                const value = Number(this.curStat.value[valueKey]);
                res[attr] = value;
            }
        }
        return res;
    });
}

export function createEquip(id: number) {
    if (id % 10 !== 0 || !(id in ShareCfg.equip_data_template)) {
        return null;
    }
    return new Equip(id);
}
