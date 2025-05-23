import { type Attributes, ShareCfg } from "@maestrale/data";
import { computed, ref, type Ref, shallowReactive } from "@vue/reactivity";
import { entries } from "../utils";
import { createAttributes } from "./attributes";

export class Commander {
    private template: ShareCfg.CommanderDataTemplate;

    level: Ref<number>;
    name: Ref<string>;

    constructor(
        public id: number,
    ) {
        this.template = ShareCfg.commander_data_template[id];

        // 等级
        this.level = ref(this.maxLevel);

        // 名称
        this.name = ref(this.originalName);
    }

    // 原始名称
    get originalName() {
        return this.template.name;
    }

    // 阵营
    get nationality() {
        return this.template.nationality;
    }

    // 稀有度
    get rarity() {
        return this.template.rarity;
    }

    // 素材
    get painting() {
        return this.template.painting;
    }

    // 最高等级
    get maxLevel() {
        return this.template.max_level;
    }

    private getAbility(baseVal: number) {
        return Math.floor(baseVal * (1 + 3 / 38 * (this.level.value - 1)));
    }

    // 后勤
    support = computed(() => {
        return this.getAbility(this.template.support_value);
    });

    // 指挥
    command = computed(() => {
        return this.getAbility(this.template.command_value);
    });

    // 战术
    tactic = computed(() => {
        return this.getAbility(this.template.tactic_value);
    });

    // 百分比加成
    attrRates = computed(() => {
        const attrs = createAttributes();
        for (const [key] of entries(attrs)) {
            const coefficient = getCoefficient(key);
            const efficiency =
                this.support.value * coefficient[0] +
                this.command.value * coefficient[1] +
                this.tactic.value * coefficient[2];
            const percent = 6 * efficiency / (250 + efficiency) / 100;
            attrs[key] = Math.round(percent * 1000) / 1000;
        }
        return attrs;
    });

    // 天赋
    abilities = shallowReactive<(CommanderAbility | undefined)[]>([]);
}

export function createCommander(id: number) {
    if (!(id in ShareCfg.commander_data_template)) {
        return null;
    }
    return new Commander(id);
}

// 获取加成系数
function getCoefficient(attr: keyof Attributes) {
    switch (attr) {
        case "durability":
            return [0.9, 0, 0];
        case "cannon":
            return [0.3, 0.6, 0];
        case "torpedo":
            return [0, 0.3, 0.6];
        case "antiaircraft":
            return [0, 0, 0.9];
        case "air":
            return [0.6, 0, 0.3];
        case "antisub":
            return [0, 0.9, 0];
        default:
            return [0, 0, 0];
    }
}

export interface CommanderAbilityEffect {
    type: number;
    nationalities: number[];
    shipTypes: number[];
    key: number;
    value: number;
}

export class CommanderAbility {
    private template: ShareCfg.CommanderAbilityTemplate;

    effects: CommanderAbilityEffect[];

    constructor(
        public id: number,
    ) {
        this.template = ShareCfg.commander_ability_template[id];

        this.effects = this.template.add.map(([type, nationalities, shipTypes, key, value]) => ({
            type,
            nationalities,
            shipTypes,
            key,
            value,
        }));
    }

    // 名称
    get name() {
        return this.template.name;
    }

    // 描述
    get desc() {
        return this.template.desc;
    }

    // 图标
    get icon() {
        return this.template.icon;
    }

    // 权重
    get worth() {
        return this.template.worth;
    }
}

export function createCommanderAbility(id: number) {
    if (!(id in ShareCfg.commander_ability_template)) {
        return null;
    }
    return new CommanderAbility(id);
}
