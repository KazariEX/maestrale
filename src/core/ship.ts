import { computed, type ComputedRef, ref, type Ref, toRaw, watch, type WritableComputedRef } from "@vue/reactivity";
import { ShareCfg } from "../data";
import { type Attributes, Favor, StrengthenType } from "../types";
import { createAttributes, walkAttributes } from "./attributes";
import { createEquip, type Equip } from "./equip";
import { usePower } from "./power";
import { createSPWeapon, type SPWeapon } from "./spweapon";
import type { TransformDataTemplate } from "../data/types";
import type { ITechnology } from "./technology";

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
    transformTable?: [number, number, number][];
    transformTemplate?: Record<string, TransformDataTemplate & {
        enable: Ref<boolean>;
        next_id: number[];
    }>;

    isModernized?: Ref<boolean>;
    modernizedId?: Ref<number>;

    equips: Ref<(Equip | null)[]>;
    spweapon: Ref<SPWeapon | null>;

    constructor(
        public id: number,
        public technology: ITechnology
    ) {
        // 等级
        this.level = ref(125);

        // 好感
        this.favor = ref(Favor.Love);

        // 最大可突破数
        this.breakoutMax = 0;

        const baseId = id * 10 + 1;
        const data_breakout = (baseId in ShareCfg.ship_meta_breakout) ? ShareCfg.ship_meta_breakout : ShareCfg.ship_data_breakout;
        for (let i = baseId; i !== 0;) {
            this.breakoutMax++;
            i = data_breakout[i].breakout_id;
        }

        if (id in ShareCfg.ship_data_blueprint) {
            const {
                blueprintMax1,
                blueprintMax2,
                blueprint,
                blueprint1,
                blueprint2,
                blueprintLevel,
                strengthen,
                breakout
            } = useStrengthenBlueprint(this);

            this.strengthenType = StrengthenType.Blueprint;
            this.blueprintMax1 = blueprintMax1;
            this.blueprintMax2 = blueprintMax2;
            this.blueprint = blueprint;
            this.blueprint1 = blueprint1;
            this.blueprint2 = blueprint2;
            this.blueprintLevel = blueprintLevel;
            this.strengthen = strengthen;
            this.breakout = breakout;
        }
        else {
            const {
                strengthenMax,
                strengthenAdjust,
                strengthen
            } = id in ShareCfg.ship_strengthen_meta ? useStrengthenMeta(this) : useStrengthenNormal(this);

            this.strengthenType = StrengthenType.Meta;
            this.strengthenMax = strengthenMax;
            this.strengthenAdjust = strengthenAdjust;
            this.strengthen = strengthen;
            this.breakout = ref(this.breakoutMax);
        }

        // 是否可改造
        this.canTransform = id in ShareCfg.ship_data_trans;

        if (this.canTransform) {
            const {
                transformTable,
                transformTemplate,
                isModernized,
                modernizedId
            } = useTransform(this);

            this.transformTable = transformTable;
            this.transformTemplate = transformTemplate;
            this.isModernized = isModernized;
            this.modernizedId = modernizedId;
        }

        // 装备列表
        this.equips = ref([]);

        // 兵装
        this.spweapon = ref(null);
    }

    private get curStat() {
        return ShareCfg.ship_data_statistics[this.curId.value];
    }

    private get curTemp() {
        return ShareCfg.ship_data_template[this.curId.value];
    }

    private get curSkin() {
        return ShareCfg.ship_skin_template[this.id * 10 + (this.isModernized?.value ? 9 : 0)];
    }

    // 当前 ID
    private curId = computed(() => {
        if (this.isModernized?.value && this.modernizedId?.value) {
            return this.modernizedId.value;
        }
        else {
            return this.id * 10 + this.breakout.value;
        }
    });

    // 名称
    name = computed(() => {
        const name = this.curStat.name;
        if (this.isModernized?.value) {
            const suffix = ".改";
            return name.replace(suffix, "") + suffix;
        }
        else return name;
    });

    // 装甲类型
    armor = computed(() => {
        return this.curStat.armor_type;
    });

    // 稀有度
    rarity = computed(() => {
        return this.curStat.rarity + (this.isModernized?.value ? 1 : 0);
    });

    // 舰种
    type = computed(() => {
        return this.curStat.type;
    });

    // 素材
    painting = computed(() => {
        return this.curSkin.painting;
    });

    // 可携带装备类型
    equipSlotTypes = computed(() => {
        return [
            this.curTemp.equip_1,
            this.curTemp.equip_2,
            this.curTemp.equip_3,
            this.curTemp.equip_4,
            this.curTemp.equip_5
        ] as const;
    });

    // 获取属性白值
    private getAttr(index: number, attrName: keyof Attributes) {
        const favorRate = ["speed", "luck"].includes(attrName) ? 1 : getFavorRate(this.favor.value);

        return (
            this.curStat.attrs[index] +
            this.curStat.attrs_growth[index] * (this.level.value - 1) / 1000 +
            this.strengthen.value[attrName]
        ) * favorRate +
            this.transAttrs.value[attrName];
    }

    // 获取改造总属性
    transAttrs = computed(() => {
        const attrs = createAttributes();

        if (this.canTransform) {
            for (const key in this.transformTemplate) {
                const temp = this.transformTemplate[key];

                if (temp.enable.value) {
                    for (const effect of temp.effect) {
                        walkAttributes(effect, (attr, val) => {
                            attrs[attr] += val;
                        });
                    }
                }
            }
        }
        return attrs;
    });

    // 获取装备总属性（含兵装）
    equipAttrs = computed(() => {
        const attrs = createAttributes();

        for (const _equip of [...this.equips.value, this.spweapon.value]) {
            if (!_equip) continue;

            const equip = toRaw(_equip);
            walkAttributes(equip.attrs.value, (attr, val) => {
                attrs[attr] += val;
            });
        }
        return attrs;
    });

    // 获取科技总属性
    techAttrs = computed(() => {
        const attrs = createAttributes();

        if (this.breakout.value === this.breakoutMax) {
            walkAttributes(attrs, (key) => {
                attrs[key] += this.technology.get(this.type.value, key);
            });
        }
        return attrs;
    });

    // 耐久
    durability = computed(() => {
        return this.getAttr(0, "durability");
    });

    // 炮击
    cannon = computed(() => {
        return this.getAttr(1, "cannon");
    });

    // 雷击
    torpedo = computed(() => {
        return this.getAttr(2, "torpedo");
    });

    // 防空
    antiaircraft = computed(() => {
        return this.getAttr(3, "antiaircraft");
    });

    // 航空
    air = computed(() => {
        return this.getAttr(4, "air");
    });

    // 装填
    reload = computed(() => {
        return this.getAttr(5, "reload");
    });

    // 命中
    hit = computed(() => {
        return this.getAttr(7, "hit");
    });

    // 机动
    dodge = computed(() => {
        return this.getAttr(8, "dodge");
    });

    // 航速
    speed = computed(() => {
        return this.getAttr(9, "speed");
    });

    // 幸运
    luck = computed(() => {
        return this.getAttr(10, "luck");
    });

    // 反潜
    antisub = computed(() => {
        return this.getAttr(11, "antisub");
    });

    // 氧气
    oxy_max = computed(() => {
        return this.curStat.oxy_max;
    });

    // 弹药量
    ammo = computed(() => {
        return this.curStat.ammo;
    });

    // 油耗
    oil = computed(() => {
        const levelRate = 0.5 + 0.005 * Math.min(99, this.level.value);
        return Math.floor((([8, 17, 22].includes(this.type.value) ? 0 : 1) + this.curTemp.oil_at_end * levelRate));
    });

    // 战力
    power = usePower(this);
}

export interface CreateShipOptions {
    equips?: (number | null)[];
    spweapon?: number | null;
    technology: ITechnology;
}

export function createShip(id: number, options: CreateShipOptions) {
    if (!(id + "1" in ShareCfg.ship_data_statistics)) {
        return null;
    }

    const {
        equips: equipIds = [],
        spweapon: spweaponId = null,
        technology
    } = options;

    // 类型收束
    id = Number(id);

    // 舰船
    const ship = new Ship(id, technology);

    // 装备
    for (let i = 0; i < 5; i++) {
        const id = equipIds[i];
        ship.equips.value.push(id ? createEquip(id) : null);
    }

    // 兵装
    ship.spweapon.value = spweaponId ? createSPWeapon(spweaponId) : null;

    return ship;
}

// 强化：蓝图
function useStrengthenBlueprint(ship: Ship) {
    const data_blueprint = ShareCfg.ship_data_blueprint[ship.id];
    const data_strengthen = [
        ...data_blueprint.strengthen_effect,
        ...data_blueprint.fate_strengthen
    ].map((i: number) => {
        return (ShareCfg.ship_strengthen_blueprint)[i];
    });

    // 最大蓝图数量（常规）
    const blueprintMax1 = data_strengthen.slice(0, 30).reduce((res, item) => {
        return res + item.need_exp;
    }, 0) / 10;

    // 最大蓝图数量（天运）
    const blueprintMax2 = data_strengthen.slice(30).reduce((res, item) => {
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
        }
    });

    // 蓝图数量（天运）
    const blueprint2 = computed({
        get: () => {
            return Math.max(0, blueprint.value - blueprintMax1);
        },
        set: (value) => {
            blueprint.value = value + blueprintMax1;
        }
    });

    // 蓝图等级
    const blueprintLevel = computed({
        get: () => {
            let level = 0;
            let exp = 0;
            for (const item of data_strengthen) {
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
                exp += data_strengthen[i].need_exp;
            }
            blueprint.value = exp / 10;
        }
    });

    // 强化
    const strengthen = computed(() => {
        const res = createAttributes();

        for (let i = 0; i < blueprintLevel.value; i++) {
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
                4: 30
            }[value] ?? 0;
        }
    });

    return {
        blueprintMax1,
        blueprintMax2,
        blueprint,
        blueprint1,
        blueprint2,
        blueprintLevel,
        strengthen,
        breakout
    };
}

// 强化：Meta
function useStrengthenMeta(ship: Ship) {
    const data_strengthen = ShareCfg.ship_strengthen_meta[ship.id];
    const repair_effect = data_strengthen.repair_effect.map(([per, key]) => {
        return {
            per,
            ...ShareCfg.ship_meta_repair_effect[key]
        };
    });

    // 满强化值
    const strengthenMax = createAttributes();
    for (const attr of ["cannon", "torpedo", "air", "reload"] as const) {
        const repairList = data_strengthen[`repair_${attr}`];

        for (const key of repairList) {
            const [attr, value] = ShareCfg.ship_meta_repair[key].effect_attr;
            strengthenMax[attr] += value;
        }
    }

    // 可调节强化值
    const strengthenAdjust = ref({ ...strengthenMax });

    // 最终强化值
    const strengthen = computed(() => {
        const res = createAttributes(strengthenAdjust.value);

        let acc = 0;
        let total = 0;
        for (const attr in res) {
            acc += res[attr as keyof Attributes];
            total += strengthenMax[attr as keyof Attributes];
        }
        const rate = acc / total * 100;

        for (const effect of repair_effect) {
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
        strengthenMax,
        strengthenAdjust,
        strengthen
    };
}

// 强化：常规
function useStrengthenNormal(ship: Ship) {
    const data_strengthen = ShareCfg.ship_data_strengthen[ship.id];

    // 满强化值
    const strengthenMax = createAttributes({
        cannon: data_strengthen.durability[0],
        torpedo: data_strengthen.durability[1],
        air: data_strengthen.durability[3],
        reload: data_strengthen.durability[4]
    });

    // 可调节强化值
    const strengthenAdjust = ref({ ...strengthenMax });

    // 最终强化值
    const strengthen = computed(() => strengthenAdjust.value);

    return {
        strengthenMax,
        strengthenAdjust,
        strengthen
    };
}

// 改造
function useTransform(ship: Ship) {
    const transformTable: Ship["transformTable"] = [];
    const transformTemplate: Ship["transformTemplate"] = {};

    for (const item of ShareCfg.ship_data_trans[ship.id].transform_list) {
        const table = [...new Array(3)] as [number, number, number];

        for (const [index, key] of item) {
            transformTemplate[key] = {
                ...ShareCfg.transform_data_template[key],
                enable: ref(true),
                next_id: []
            };
            table[index - 2] = key;
        }
        transformTable.push(table);
    }

    // 添加后继节点
    Object.entries(transformTemplate).forEach(([key, temp]) => {
        for (const i of temp.condition_id) {
            transformTemplate[i].next_id.push(Number(key));
        }
    });

    const isModernized = ref(false);
    const modernizedId = ref<number>(null!);

    // 链式监听
    for (const key in transformTemplate) {
        const temp = transformTemplate[key];
        watch(temp.enable, (value) => {
            if (value) {
                for (const i of temp.condition_id) {
                    transformTemplate[i].enable.value = true;
                }
            }
            else {
                for (const i of temp.next_id) {
                    transformTemplate[i].enable.value = false;
                }
            }

            if (temp.name === "近代化改造") {
                isModernized.value = value;
            }

            const ship_id = temp.ship_id[0];
            if (ship_id?.length > 0) {
                modernizedId.value = ship_id[value ? 1 : 0];
            }
        }, {
            immediate: true
        });
    }

    return {
        transformTable,
        transformTemplate,
        isModernized,
        modernizedId
    };
}

// 获取好感加成
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