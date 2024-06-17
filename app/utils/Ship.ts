import type { WritableComputedRef } from "vue";
import { Equip } from "./Equip";
import { SPWeapon } from "./SPWeapon";
import ship_data_blueprint from "~~/data/ShareCfg(VVVIP)/ship_data_blueprint.json";
import ship_data_breakout from "~~/data/ShareCfg(VVVIP)/ship_data_breakout.json";
import ship_data_statistics from "~~/data/ShareCfg(VVVIP)/ship_data_statistics.json";
import ship_data_strengthen from "~~/data/ShareCfg(VVVIP)/ship_data_strengthen.json";
import ship_data_template from "~~/data/ShareCfg(VVVIP)/ship_data_template.json";
import ship_data_trans from "~~/data/ShareCfg(VVVIP)/ship_data_trans.json";
import ship_meta_breakout from "~~/data/ShareCfg(VVVIP)/ship_meta_breakout.json";
import ship_meta_repair_effect from "~~/data/ShareCfg(VVVIP)/ship_meta_repair_effect.json";
import ship_meta_repair from "~~/data/ShareCfg(VVVIP)/ship_meta_repair.json";
import ship_skin_template from "~~/data/ShareCfg(VVVIP)/ship_skin_template.json";
import ship_strengthen_blueprint from "~~/data/ShareCfg(VVVIP)/ship_strengthen_blueprint.json";
import ship_strengthen_meta from "~~/data/ShareCfg(VVVIP)/ship_strengthen_meta.json";
import transform_data_template from "~~/data/ShareCfg(VVVIP)/transform_data_template.json";

export enum StrengthenType {
    normal,
    blueprint,
    meta
};

export class Ship {
    level: Ref<number>;
    favor: Ref<number>;

    breakout: Ref<number> | WritableComputedRef<number>;
    breakoutMax: number;

    strengthen: ComputedRef<Attributes>;
    strengthenAdjust?: Ref<Attributes>;
    strengthenType: StrengthenType;
    strengthenMax?: Attributes;

    blueprint?: Ref<number>;
    blueprint1?: WritableComputedRef<number>;
    blueprint2?: WritableComputedRef<number>;
    blueprintMax1?: number;
    blueprintMax2?: number;
    blueprintLevel?: WritableComputedRef<number>;

    canTransform: boolean;
    transformTable?: Array<Array<number>>;
    transformTemplate?: Record<string, ShipTransformTemplate>;
    isModernized: Ref<boolean>;
    modernizedId?: Ref<number>;

    equips: Ref<Equip[]>;
    spweapon: Ref<SPWeapon>;

    constructor(
        public id: number
    ) {
        //等级
        this.level = ref(125);

        //好感
        this.favor = ref(4);

        //最大可突破数
        this.breakoutMax = 0;

        const baseId = id * 10 + 1;
        const data_breakout = (baseId in ship_meta_breakout) ? ship_meta_breakout : ship_data_breakout;
        for (let i = baseId; i !== 0; ) {
            this.breakoutMax++;
            i = data_breakout[i].breakout_id;
        }

        if (id in ship_data_blueprint) {
            //科研
            this.strengthenType = StrengthenType.blueprint;

            //读取数据
            const data_blueprint = ship_data_blueprint[id];
            const data_strengthen = [
                ...data_blueprint.strengthen_effect,
                ...data_blueprint.fate_strengthen
            ].map((i: number) => {
                return (ship_strengthen_blueprint as any)[i];
            });

            //最大蓝图数量（常规）
            this.blueprintMax1 = data_strengthen.slice(0, 30).reduce((res, item) => {
                return res + item.need_exp;
            }, 0) / 10;

            //最大蓝图数量（天运）
            this.blueprintMax2 = data_strengthen.slice(30).reduce((res, item) => {
                return res + item.need_exp;
            }, 0) / 10;

            //蓝图数量
            this.blueprint = ref(this.blueprintMax1 + this.blueprintMax2);

            //蓝图数量（常规）
            this.blueprint1 = computed({
                get: () => {
                    return Math.min(this.blueprint.value, this.blueprintMax1);
                },
                set: (value) => {
                    this.blueprint.value = value;
                }
            });

            //蓝图数量（天运）
            this.blueprint2 = computed({
                get: () => {
                    return Math.max(0, this.blueprint.value - this.blueprintMax1);
                },
                set: (value) => {
                    this.blueprint.value = value + this.blueprintMax1;
                }
            });

            //蓝图等级
            this.blueprintLevel = computed({
                get: () => {
                    let level = 0;
                    let exp = 0;
                    for (const item of data_strengthen) {
                        exp += item.need_exp;
                        if (this.blueprint.value >= exp / 10) {
                            level++;
                        }
                        else break;
                    }
                    return level;
                },
                set: (level) => {
                    let exp = 0;
                    for (let i = 0; i < level; i++) {
                        exp += data_strengthen[i].need_exp;
                    }
                    this.blueprint.value = exp / 10;
                }
            });

            //强化
            this.strengthen = computed(() => {
                const res = createAttributes();

                for (let i = 0; i < this.blueprintLevel.value; i++) {
                    const item = data_strengthen[i];

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

            //突破
            this.breakout = computed({
                get: () => {
                    const lv = this.blueprintLevel.value;

                    if (lv < 10) return 1;
                    else if (lv < 20) return 2;
                    else if (lv < 30) return 3;
                    else return 4;
                },
                set: (value) => {
                    this.blueprintLevel.value = {
                        1: 0,
                        2: 10,
                        3: 20,
                        4: 30
                    }[value] ?? 0;
                }
            });
        }
        else {
            if (id in ship_strengthen_meta) {
                //META
                this.strengthenType = StrengthenType.meta;

                //读取数据
                const data_strengthen = ship_strengthen_meta[id];
                const meta_repair_effect = data_strengthen.repair_effect.map(([per, key]) => {
                    return {
                        per,
                        ...ship_meta_repair_effect[key]
                    };
                });

                //满强化值
                this.strengthenMax = createAttributes();
                for (const attr of ["cannon", "torpedo", "air", "reload"]) {
                    const repairList = data_strengthen[`repair_${attr}`];

                    for (const key of repairList) {
                        const [attr, value] = ship_meta_repair[key].effect_attr;
                        this.strengthenMax[attr] += value;
                    }
                }

                //可调节强化值
                this.strengthenAdjust = ref({ ...this.strengthenMax });

                //最终强化值
                this.strengthen = computed(() => {
                    const res = createAttributes(this.strengthenAdjust.value);

                    let acc = 0;
                    let total = 0;
                    for (const attr in res) {
                        acc += res[attr];
                        total += this.strengthenMax[attr];
                    }
                    const rate = acc / total * 100;

                    for (const effect of meta_repair_effect) {
                        if (rate >= effect.per) {
                            for (const [attr, value] of effect.effect_attr) {
                                res[attr] += value;
                            }
                        }
                        else break;
                    }
                    return res;
                });
            }
            else {
                //常规
                this.strengthenType = StrengthenType.normal;

                //读取数据
                const data_strengthen = ship_data_strengthen[id];

                //满强化值
                this.strengthenMax = createAttributes({
                    cannon: data_strengthen.durability[0],
                    torpedo: data_strengthen.durability[1],
                    air: data_strengthen.durability[3],
                    reload: data_strengthen.durability[4]
                });

                //可调节强化值
                this.strengthenAdjust = ref({ ...this.strengthenMax });

                //最终强化值
                this.strengthen = computed(() => this.strengthenAdjust.value);
            }

            //突破
            this.breakout = ref(this.breakoutMax);
        }

        //改造
        this.canTransform = id in ship_data_trans;
        this.isModernized = ref(false);

        //可改造
        if (this.canTransform) {
            this.modernizedId = ref(null);

            //读取数据
            this.transformTable = [];
            this.transformTemplate = {};
            for (const item of ship_data_trans[id].transform_list) {
                const table = [ , , , ];

                for (const [index, key] of item) {
                    this.transformTemplate[key] = {
                        ...transform_data_template[key],
                        enable: ref(true),
                        next_id: []
                    };
                    table[index - 2] = key;
                }
                this.transformTable.push(table);
            }

            //添加后继节点
            Object.entries(this.transformTemplate).forEach(([key, temp]) => {
                for (const i of temp.condition_id) {
                    this.transformTemplate[i].next_id.push(Number(key));
                }
            });

            //链式监听
            for (const key in this.transformTemplate) {
                const temp = this.transformTemplate[key];
                watch(() => temp.enable.value, (value) => {
                    if (value) {
                        for (const i of temp.condition_id) {
                            this.transformTemplate[i].enable.value = true;
                        }
                    }
                    else {
                        for (const i of temp.next_id) {
                            this.transformTemplate[i].enable.value = false;
                        }
                    }

                    if (temp.name === "近代化改造") {
                        this.isModernized.value = value;
                    }

                    const ship_id = temp.ship_id[0];
                    if (ship_id?.length > 0) {
                        this.modernizedId.value = ship_id[value ? 1 : 0];
                    }
                }, {
                    immediate: true
                });
            }
        }

        //装备列表
        this.equips = ref([]);

        //兵装
        this.spweapon = ref(null);
    }

    private get curStat(): ShipDataStatistics {
        return ship_data_statistics[this.curId.value];
    }

    private get curTemp(): ShipDataTemplate {
        return ship_data_template[this.curId.value];
    }

    private get curSkin(): ShipSkinTemplate {
        return ship_skin_template[this.id * 10 + (this.isModernized.value ? 9 : 0)];
    }

    //当前ID
    private curId = computed(() => {
        if (this.isModernized.value && this.modernizedId.value) {
            return this.modernizedId.value;
        }
        else {
            return this.id * 10 + this.breakout.value;
        }
    });

    //名称
    name = computed(() => {
        const n = this.curStat.name;
        if (this.isModernized.value) {
            const suffix = ".改";
            return n.replace(suffix, "") + suffix;
        }
        else return n;
    });

    //装甲类型
    armor = computed(() => {
        return this.curStat.armor_type;
    });

    //阵营
    nationality = computed(() => {
        return this.curStat.nationality;
    });

    //稀有度
    rarity = computed(() => {
        return this.curStat.rarity + (this.isModernized.value ? 1 : 0);
    });

    //舰种
    type = computed(() => {
        return this.curStat.type;
    });

    //素材
    painting = computed(() => {
        return this.curSkin.painting;
    });

    //可携带装备类型
    equipSlotTypes = computed(() => {
        return [
            this.curTemp.equip_1,
            this.curTemp.equip_2,
            this.curTemp.equip_3,
            this.curTemp.equip_4,
            this.curTemp.equip_5
        ];
    });

    //获取属性白值
    private getAttr(index: number, attrName: keyof Attributes) {
        const favorRate = ["speed", "luck"].includes(attrName) ? 1 : getFavorRate(this.favor.value);

        return (
            this.curStat.attrs[index] +
            this.curStat.attrs_growth[index] * (this.level.value - 1) / 1000 +
            this.strengthen.value[attrName]
        ) * favorRate +
            this.transAttrs.value[attrName];
    }

    //获取改造总属性
    transAttrs = computed(() => {
        const attrs = createAttributes();

        if (this.canTransform) {
            for (const key in this.transformTemplate) {
                const temp = this.transformTemplate[key];

                if (temp.enable.value) {
                    for (const effect of temp.effect) {
                        for (const attr in effect) {
                            attrs[attr] += effect[attr];
                        }
                    }
                }
            }
        }
        return attrs;
    });

    //获取装备总属性（含兵装）
    equipAttrs = computed(() => {
        const attrs = createAttributes();

        for (const equip of [...this.equips.value, this.spweapon.value]) {
            if (equip === null) continue;

            for (const attr in equip.attrs) {
                attrs[attr] += equip.attrs[attr];
            }
        }
        return attrs;
    });

    //获取科技总属性
    techAttrs = computed(() => {
        const attrs = createAttributes();
        const technologyStore = useTechnologyStore();

        if (this.breakout.value === this.breakoutMax) {
            for (const key in attrs) {
                attrs[key] += technologyStore.get(this.type.value, key);
            }
        }
        return attrs;
    });

    //耐久
    durability = computed(() => {
        return this.getAttr(0, "durability");
    });

    //炮击
    cannon = computed(() => {
        return this.getAttr(1, "cannon");
    });

    //雷击
    torpedo = computed(() => {
        return this.getAttr(2, "torpedo");
    });

    //防空
    antiaircraft = computed(() => {
        return this.getAttr(3, "antiaircraft");
    });

    //航空
    air = computed(() => {
        return this.getAttr(4, "air");
    });

    //装填
    reload = computed(() => {
        return this.getAttr(5, "reload");
    });

    //命中
    hit = computed(() => {
        return this.getAttr(7, "hit");
    });

    //机动
    dodge = computed(() => {
        return this.getAttr(8, "dodge");
    });

    //航速
    speed = computed(() => {
        return this.getAttr(9, "speed");
    });

    //幸运
    luck = computed(() => {
        return this.getAttr(10, "luck");
    });

    //反潜
    antisub = computed(() => {
        return this.getAttr(11, "antisub");
    });

    //氧气
    oxy_max = computed(() => {
        return this.curStat.oxy_max;
    });

    //弹药量
    ammo = computed(() => {
        return this.curStat.ammo;
    });

    //油耗
    oil = computed(() => {
        const levelRate = 0.5 + 0.005 * Math.min(99, this.level.value);

        return Math.floor((([8, 17, 22].includes(this.type.value) ? 0 : 1) + this.curTemp.oil_at_end * levelRate));
    });

    //战力
    private powerCalculator = new PowerCalculator(this);
    power = computed(() => {
        return this.powerCalculator.power.value;
    });
}

export function createShip(id: number, {
    equips = [],
    spweapon = null
} = {}) {
    if (!Reflect.has(ship_data_statistics, id + "1")) {
        return null;
    }

    //类型收束
    id = Number(id);

    //舰娘
    const ship = new Ship(id);

    //装备
    for (let i = 0; i < 5; i++) {
        const equip = createEquip(equips[i]);
        ship.equips.value.push(equip);
    }

    //兵装
    const spw = createSPWeapon(spweapon);
    ship.spweapon.value = spw;

    return ship;
}

export function createAttributes(options: Attributes = {}) {
    return {
        durability: 0,
        cannon: 0,
        torpedo: 0,
        antiaircraft: 0,
        air: 0,
        reload: 0,
        hit: 0,
        dodge: 0,
        speed: 0,
        luck: 0,
        antisub: 0,
        ...options
    };
}

function getFavorRate(favor: number) {
    switch (favor) {
        case 2: return 1.01;
        case 3: return 1.03;
        case 4: return 1.06;
        case 5: return 1.09;
        case 6: return 1.12;
        default: return 1;
    }
}