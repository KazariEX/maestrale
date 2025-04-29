import { type Attributes, ShareCfg } from "@maestrale/data";
import { computed, type ComputedRef, ref, type Ref, shallowRef, watch, type WritableComputedRef } from "@vue/reactivity";
import { Favor, StrengthenType } from "../types";
import { entries, nonNullable, ShipFleetKey } from "../utils";
import { createAttributes } from "./attributes";
import { createEquip, type Equip } from "./equip";
import { usePower } from "./power";
import { createSPWeapon, type SPWeapon } from "./spweapon";
import type { Fleet } from "./fleet";
import type { ITechnology } from "./technology";

interface Strengthen {
    attrs: ComputedRef<Attributes>;
}

interface StrengthenGeneral extends Strengthen {
    type: StrengthenType.General | StrengthenType.Meta;
    adjustAttrs: Ref<Attributes>;
    maxAttrs: Attributes;
}

interface StrengthenBlueprint extends Strengthen {
    type: StrengthenType.Blueprint;
    blueprint: Ref<number>;
    blueprint1: WritableComputedRef<number>;
    blueprint2: WritableComputedRef<number>;
    blueprintMax1: number;
    blueprintMax2: number;
    blueprintLevel: WritableComputedRef<number>;
}

export interface TransformMatrixTemplate extends ShareCfg.TransformDataTemplate {
    enable: Ref<boolean>;
    next_id: number[];
}

export interface Transform {
    matrix: [
        TransformMatrixTemplate[],
        TransformMatrixTemplate[],
        TransformMatrixTemplate[]
    ][];
    isModernized: Ref<boolean>;
    modernizedId: Ref<number>;
}

export class Ship {
    breakout: Ref<number>;
    maxBreakout: number;
    strengthen: StrengthenGeneral | StrengthenBlueprint;
    transform?: Transform;

    constructor(
        public id: number,
        public technology: ITechnology
    ) {
        // 最大可突破数
        this.maxBreakout = 0;

        const baseId = id * 10 + 1;
        const data_breakout = (baseId in ShareCfg.ship_meta_breakout) ? ShareCfg.ship_meta_breakout : ShareCfg.ship_data_breakout;
        for (let i = baseId; i !== 0;) {
            this.maxBreakout++;
            i = data_breakout[i].breakout_id;
        }

        if (id in ShareCfg.ship_data_blueprint) {
            const { breakout, ...strengthen } = useStrengthenBlueprint(this);
            this.breakout = breakout;
            this.strengthen = {
                type: StrengthenType.Blueprint,
                ...strengthen
            };
        }
        else if (id in ShareCfg.ship_strengthen_meta) {
            this.breakout = ref(this.maxBreakout);
            this.strengthen = {
                type: StrengthenType.Meta,
                ...useStrengthenMeta(this)
            };
        }
        else {
            this.breakout = ref(this.maxBreakout);
            this.strengthen = {
                type: StrengthenType.General,
                ...useStrengthenGeneral(this)
            };
        }

        if (id in ShareCfg.ship_data_trans) {
            this.transform = useTransform(this);
        }
    }

    private get curStat() {
        return ShareCfg.ship_data_statistics[this.curId.value];
    }

    private get curTemp() {
        return ShareCfg.ship_data_template[this.curId.value];
    }

    private get curSkin() {
        return ShareCfg.ship_skin_template[this.id * 10 + (this.transform?.isModernized.value ? 9 : 0)];
    }

    // 当前 ID
    private curId = computed(() => {
        return this.transform?.isModernized.value
            && this.transform?.modernizedId.value
            || this.id * 10 + this.breakout.value;
    });

    // 等级
    level = ref(125);

    // 好感
    favor = ref(Favor.Love);

    // 名称
    name = computed(() => {
        const name = this.curStat.name;
        if (this.transform?.isModernized.value) {
            const suffixes = [".改", "·改"];
            return (
                name.endsWith(suffixes[0]) || name.endsWith(suffixes[1]) ? name.slice(0, -2) : name
            ) + suffixes[0];
        }
        else return name;
    });

    // 装甲类型
    armor = computed(() => {
        return this.curStat.armor_type;
    });

    // 阵营
    nationality = computed(() => {
        return this.curStat.nationality;
    });

    // 稀有度
    rarity = computed(() => {
        return this.curStat.rarity + (this.transform?.isModernized.value ? 1 : 0);
    });

    // 舰种
    type = computed(() => {
        return this.curStat.type;
    });

    // 素材
    painting = computed(() => {
        return this.curSkin.painting;
    });

    // 星级
    star = computed(() => {
        return this.maxStar.value - this.maxBreakout + this.breakout.value;
    });

    // 最高星级
    maxStar = computed(() => {
        return Math.max(4, this.rarity.value);
    });

    // 获取属性白值
    private getAttr(index: number, attrName: keyof Attributes) {
        const favorRate = 1 + (
            ["speed", "luck"].includes(attrName) ? 0 : getFavorRate(this.favor.value)
        );

        return (
            this.curStat.attrs[index] +
            this.curStat.attrs_growth[index] * (this.level.value - 1) / 1000 +
            this.strengthen.attrs.value[attrName]
        ) * favorRate +
            this.transAttrs.value[attrName];
    }

    // 获取改造总属性
    transAttrs = computed(() => {
        const attrs = createAttributes();

        const templates = this.transform?.matrix.flat(2) ?? [];
        for (const template of templates) {
            if (template.enable.value) {
                for (const effect of template.effect) {
                    for (const [attr, val] of entries(effect)) {
                        attrs[attr] += val;
                    }
                }
            }
        }
        return attrs;
    });

    // 获取装备总属性（含兵装）
    equipAttrs = computed(() => {
        const attrs = createAttributes();

        for (const equip of [...this.equips.value, this.spweapon.value]) {
            if (!equip) {
                continue;
            }
            for (const [attr, val] of entries(equip.attrs.value)) {
                attrs[attr] += val;
            }
        }
        return attrs;
    });

    // 获取科技总属性
    techAttrs = computed(() => {
        const attrs = createAttributes();

        if (this.breakout.value === this.maxBreakout) {
            for (const [key] of entries(attrs)) {
                attrs[key] += this.technology.get(this.type.value, key);
            }
        }
        return attrs;
    });

    // 获取指挥喵总属性
    commanderAttrs = computed(() => {
        const attrs = createAttributes();

        const commanders = this.fleet.value?.commanders.value.filter(nonNullable) ?? [];
        const effects = commanders
            .flatMap((commander) => commander.abilities)
            .filter(nonNullable)
            .flatMap((ability) => ability.effects)
            .filter((effect) => (
                effect.type === 1 &&
                (!effect.nationalities.length || effect.nationalities.includes(this.nationality.value)) &&
                (!effect.shipTypes.length || effect.shipTypes.includes(this.type.value))
            ));

        for (const effect of effects) {
            const key = ShareCfg.attribute_info_by_type[effect.key].name;
            attrs[key] += effect.value;
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

    // 装备
    equip1 = shallowRef<Equip | null>(null);
    equip2 = shallowRef<Equip | null>(null);
    equip3 = shallowRef<Equip | null>(null);
    equip4 = shallowRef<Equip | null>(null);
    equip5 = shallowRef<Equip | null>(null);
    equips = computed(() => [
        this.equip1.value,
        this.equip2.value,
        this.equip3.value,
        this.equip4.value,
        this.equip5.value
    ]);

    // 兵装
    spweapon = shallowRef<SPWeapon | null>(null);

    // 所在编队
    [ShipFleetKey] = shallowRef<Fleet | null>(null);
    fleet = computed(() => this[ShipFleetKey].value);
}

export interface CreateShipOptions {
    equips?: (Equip | number | null)[];
    spweapon?: SPWeapon | number | null;
    technology: ITechnology;
}

export function createShip(id: number, options: CreateShipOptions) {
    if (!(id + "1" in ShareCfg.ship_data_statistics)) {
        return null;
    }

    const {
        equips = [],
        spweapon = null,
        technology
    } = options;

    // 舰船
    const ship = new Ship(id, technology);

    // 装备
    equips.push(...Array.from({ length: 5 - equips.length }, () => null));
    ship.equip1.value = normalizeEquip(equips[0]);
    ship.equip2.value = normalizeEquip(equips[1]);
    ship.equip3.value = normalizeEquip(equips[2]);
    ship.equip4.value = normalizeEquip(equips[3]);
    ship.equip5.value = normalizeEquip(equips[4]);

    // 兵装
    ship.spweapon.value = normalizeSPWeapon(spweapon);

    return ship;
}

function normalizeEquip(equip: Equip | number | null) {
    return typeof equip === "number" ? createEquip(equip) : equip;
}

function normalizeSPWeapon(spweapon: SPWeapon | number | null) {
    return typeof spweapon === "number" ? createSPWeapon(spweapon) : spweapon;
}

// 强化：蓝图
function useStrengthenBlueprint(ship: Ship) {
    const data_blueprint = ShareCfg.ship_data_blueprint[ship.id];
    const data_strengthen = [
        ...data_blueprint.strengthen_effect,
        ...data_blueprint.fate_strengthen
    ].map((i) => ShareCfg.ship_strengthen_blueprint[i]);

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
    const attrs = computed(() => {
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
        attrs,
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
    const maxAttrs = createAttributes();
    for (const attr of ["cannon", "torpedo", "air", "reload"] as const) {
        const repairList = data_strengthen[`repair_${attr}`];

        for (const key of repairList) {
            const [attr, value] = ShareCfg.ship_meta_repair[key].effect_attr;
            maxAttrs[attr] += value;
        }
    }

    // 可调节强化值
    const adjustAttrs = ref({ ...maxAttrs });

    // 最终强化值
    const attrs = computed(() => {
        const res = createAttributes(adjustAttrs.value);

        let acc = 0;
        let total = 0;
        for (const [attr] of entries(res)) {
            acc += res[attr];
            total += maxAttrs[attr];
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
        maxAttrs,
        adjustAttrs,
        attrs
    };
}

// 强化：常规
function useStrengthenGeneral(ship: Ship) {
    const data_strengthen = ShareCfg.ship_data_strengthen[ship.id];

    // 满强化值
    const maxAttrs = createAttributes({
        cannon: data_strengthen.durability[0],
        torpedo: data_strengthen.durability[1],
        air: data_strengthen.durability[3],
        reload: data_strengthen.durability[4]
    });

    // 可调节强化值
    const adjustAttrs = ref({ ...maxAttrs });

    // 最终强化值
    const attrs = computed(() => adjustAttrs.value);

    return {
        maxAttrs,
        adjustAttrs,
        attrs
    };
}

// 改造
function useTransform(ship: Ship) {
    const templates: Record<string, TransformMatrixTemplate> = {};

    const matrix = ShareCfg.ship_data_trans[ship.id].transform_list.map((item) => {
        const column: Transform["matrix"][number] = [[], [], []];

        for (const [index, id] of item) {
            const template = {
                ...ShareCfg.transform_data_template[id],
                enable: ref(true),
                next_id: []
            };
            templates[id] = template;
            column[index - 2].push(template);
        }
        return column;
    });

    // 添加后继节点
    for (const [key, template] of entries(templates)) {
        const stack: [number, TransformMatrixTemplate][] = [
            [Number(key), template]
        ];

        while (stack.length) {
            const [id, { condition_id }] = stack.pop()!;
            for (const prevId of condition_id) {
                const prev = templates[prevId];
                if (prev.edit_trans.includes(id)) {
                    stack.push([id, prev]);
                }
                else {
                    prev.next_id.push(id);
                }
            }
        }
    }

    const isModernized = ref(false);
    const modernizedId = ref<number>(null!);

    // 链式监听
    for (const [, template] of entries(templates)) {
        watch(template.enable, (value) => {
            if (value) {
                updateTemplates(template.condition_id, true);
                updateTemplates(template.edit_trans, false);
            }
            else if (!template.edit_trans.length) {
                updateTemplates(template.next_id, false);
            }
            else if (template.condition_id.every((id) => templates[id].enable.value)) {
                updateTemplates(template.edit_trans, true);
            }

            if (template.name === "近代化改造") {
                isModernized.value = value;
            }

            if (template.ship_id.length) {
                const [from, to] = template.ship_id[0];
                modernizedId.value = value ? to : from;
            }
        }, {
            immediate: true
        });
    }

    function updateTemplates(ids: number[], value: boolean) {
        for (const id of ids) {
            templates[id].enable.value = value;
        }
    }

    return {
        matrix,
        isModernized,
        modernizedId
    };
}

// 获取好感加成
function getFavorRate(favor: number) {
    switch (favor) {
        case 2: return 0.01;
        case 3: return 0.03;
        case 4: return 0.06;
        case 5: return 0.09;
        case 6: return 0.12;
        default: return 0;
    }
}