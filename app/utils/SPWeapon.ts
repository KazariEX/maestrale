import spweapon_data_statistics from "~~/data/ShareCfg(VVVIP)/spweapon_data_statistics.json";

export class SPWeapon {
    level: Ref<number>;

    private data_statistics: any[];

    constructor(
        public id: number
    ) {
        this.data_statistics = [];
        for (let i = id; i !== 0; ) {
            const stat = spweapon_data_statistics[i];
            this.data_statistics.push(stat);

            if (stat.next - i > 1) break;
            i = stat.next;
        }

        //等级
        this.level = ref(10);
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

    private statistics = computed(() => {
        return {
            ...this.data_statistics[0],
            ...this.data_statistics[this.level.value]
        };
    });

    //属性
    attrs = computed(() => {
        const res = {};
        for (let i = 1; i <= 2; i++) {
            const a = `attribute_${i}`;
            const v = `value_${i}`;
            const vr = `value_${i}_random`;
            if (a in this.statistics.value) {
                res[this.statistics.value[a]] = this.statistics.value[v] + this.statistics.value[vr];
            }
        }
        return res;
    });
}

export function createSPWeapon(id: number) {
    if (id % 10 !== 0 || !Reflect.has(spweapon_data_statistics, id)) {
        return null;
    }

    //类型收束
    id = Number(id);

    return new SPWeapon(id);
}