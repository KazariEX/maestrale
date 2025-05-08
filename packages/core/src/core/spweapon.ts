import { type Attributes, ShareCfg } from "@maestrale/data";
import { computed, ref, type Ref } from "@vue/reactivity";

export class SPWeapon {
    private statistics: ShareCfg.SPWeaponDataStatistics[];

    level: Ref<number>;

    constructor(
        public id: number,
    ) {
        this.statistics = [];
        for (let i = id; i !== 0;) {
            const stat = ShareCfg.spweapon_data_statistics[i];
            this.statistics.push(stat);

            if (stat.next - i > 1) break;
            i = stat.next;
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

    // 稀有度
    get rarity() {
        return this.statistics[0].rarity;
    }

    // 最高等级
    get maxLevel() {
        return this.statistics.length - 1;
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
    return new SPWeapon(id);
}
