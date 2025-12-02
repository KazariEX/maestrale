import { type Attributes, ShareCfg } from "@maestrale/data";
import { computed, ref, type Ref, shallowRef } from "@vue/reactivity";
import { Favor, StrengthenType } from "../../types";
import { notNullish, objectKeys, ShipFleetKey } from "../../utils";
import { createAttributes } from "../attributes";
import { usePower } from "./power";
import { type StrengthenBlueprint, type StrengthenGeneral, useStrengthenBlueprint, useStrengthenGeneral, useStrengthenMeta } from "./strengthen";
import { type Transform, useTransform } from "./transform";
import type { Equip } from "../equip";
import type { Fleet } from "../fleet";
import type { SPWeapon } from "../spweapon";
import type { ITechnology } from "../technology";

export class Ship {
    constructor(
        public id: number,
        public technology: ITechnology,
    ) {
        const baseId = id * 10 + 1;
        const breakoutConfig = baseId in ShareCfg.ship_meta_breakout
            ? ShareCfg.ship_meta_breakout
            : ShareCfg.ship_data_breakout;
        for (let i = baseId; i !== 0;) {
            this.breakoutLimit++;
            i = breakoutConfig[i].breakout_id;
        }

        if (id in ShareCfg.ship_data_blueprint) {
            const { breakout, ...strengthen } = useStrengthenBlueprint(this);
            this.breakout = breakout;
            this.strengthen = {
                type: StrengthenType.Blueprint,
                ...strengthen,
            };
        }
        else if (id in ShareCfg.ship_strengthen_meta) {
            this.breakout = ref(this.breakoutLimit);
            this.strengthen = {
                type: StrengthenType.Meta,
                ...useStrengthenMeta(this),
            };
        }
        else {
            this.breakout = ref(this.breakoutLimit);
            this.strengthen = {
                type: StrengthenType.General,
                ...useStrengthenGeneral(this),
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

    private curId = computed(() => {
        return this.transform?.isModernized.value
            && this.transform?.modernizedId.value
            || this.id * 10 + this.breakout.value;
    });

    // 突破等级
    breakout: Ref<number>;

    // 突破上限
    breakoutLimit = 0;

    // 强化
    strengthen: StrengthenGeneral | StrengthenBlueprint;

    // 改造
    transform?: Transform;

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
                suffixes.includes(name.slice(-2)) ? name.slice(0, -2) : name
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
        return this.maxStar.value - this.breakoutLimit + this.breakout.value;
    });

    // 最高星级
    maxStar = computed(() => {
        return Math.ceil(this.rarity.value / 2) + 3;
    });

    // 改造总属性
    transAttrs = computed(() => {
        const attrs = createAttributes();

        const items = this.transform?.matrix.flat(2) ?? [];
        for (const item of items) {
            if (item.isEnabled.value) {
                for (const effect of item.template.effect) {
                    for (const attr of objectKeys(effect)) {
                        attrs[attr] += effect[attr];
                    }
                }
            }
        }
        return attrs;
    });

    // 装备属性
    equipAttrs = computed(() => {
        const attrs = createAttributes();

        for (const equip of [...this.equips.value, this.spweapon.value]) {
            if (equip !== null) {
                for (const attr of objectKeys(equip.attrs.value)) {
                    attrs[attr] += equip.attrs.value[attr]!;
                }
            }
        }
        return attrs;
    });

    // 科技属性
    techAttrs = computed(() => {
        const attrs = createAttributes();

        if (this.breakout.value === this.breakoutLimit) {
            for (const attr of objectKeys(attrs)) {
                attrs[attr] += this.technology.get(this.type.value, attr);
            }
        }
        return attrs;
    });

    // 指挥喵属性
    commanderAttrs = computed(() => {
        const attrs = createAttributes();

        const commanders = this.fleet.value?.commanders.value.filter(notNullish) ?? [];
        const effects = commanders
            .flatMap((commander) => commander.abilities)
            .filter(notNullish)
            .flatMap((ability) => ability.effects)
            .filter((effect) => (
                effect.type === 1 &&
                (!effect.nationalities.length || effect.nationalities.includes(this.nationality.value)) &&
                (!effect.shipTypes.length || effect.shipTypes.includes(this.type.value))
            ));

        for (const effect of effects) {
            const attr = ShareCfg.attribute_info_by_type[effect.key].name;
            attrs[attr] += effect.value;
        }
        return attrs;
    });

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
    oxy = computed(() => {
        return this.curStat.oxy_max;
    });

    // 弹药量
    ammo = computed(() => {
        return this.curStat.ammo;
    });

    // 油耗
    oil = computed(() => {
        const levelRate = 0.5 + 0.005 * Math.min(99, this.level.value);
        return Math.floor(+![8, 17, 22].includes(this.type.value) + this.curTemp.oil_at_end * levelRate);
    });

    // 战力
    power = usePower(this);

    // 可携带装备类型
    equipTypes = computed(() => {
        return [
            this.curTemp.equip_1,
            this.curTemp.equip_2,
            this.curTemp.equip_3,
            this.curTemp.equip_4,
            this.curTemp.equip_5,
        ];
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
        this.equip5.value,
    ]);

    // 兵装
    spweapon = shallowRef<SPWeapon | null>(null);

    // 所在编队
    [ShipFleetKey] = shallowRef<Fleet | null>(null);
    fleet = computed(() => this[ShipFleetKey].value);
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
