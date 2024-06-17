import equip_data_statistics from "~~/data/ShareCfg(VVVIP)/equip_data_statistics.json";
import equip_data_template from "~~/data/ShareCfg(VVVIP)/equip_data_template.json";

export class Equip {
    level: Ref<number>;

    private data_statistics: any[];
    private data_template: any[];

    constructor(
        public id: number
    ) {
        this.data_statistics = [];
        this.data_template = [];
        for (let i = id; i !== 0; ) {
            const stat = equip_data_statistics[i];
            const temp = equip_data_template[i];
            this.data_statistics.push(stat);
            this.data_template.push(temp);
            i = temp.next;
        }

        //等级
        this.level = ref(this.levelMax);
    }

    //名称
    get name() {
        return this.data_statistics[0].name;
    }

    //图标
    get icon() {
        return this.data_statistics[0].icon;
    }

    //稀有度
    get rarity() {
        return this.data_statistics[0].rarity;
    }

    //最高等级
    get levelMax() {
        return this.data_statistics.length - 1;
    }

    private statistics = computed(() => {
        return {
            ...this.data_statistics[0],
            ...this.data_statistics[this.level.value]
        };
    });

    //属性
    attrs = computed(() => {
        const res = {};
        for (let i = 1; i <= 3; i++) {
            const a = `attribute_${i}`;
            const v = `value_${i}`;
            if (a in this.statistics.value) {
                res[this.statistics.value[a]] = Number(this.statistics.value[v]);
            }
        }
        return res;
    });
}

export function createEquip(id: number) {
    if (id % 10 !== 0 || !Reflect.has(equip_data_template, id)) {
        return null;
    }

    //类型收束
    id = Number(id);

    return new Equip(id);
}