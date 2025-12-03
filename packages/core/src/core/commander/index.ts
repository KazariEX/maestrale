import { type Attributes, ShareCfg } from "@maestrale/data";
import { computed, ref, type Ref, shallowReactive } from "@vue/reactivity";
import { objectKeys } from "../../utils";
import { createAttributes } from "../attributes";
import type { CommanderAbility } from "./ability";

export class Commander {
    private template: ShareCfg.CommanderDataTemplate;

    constructor(
        public id: number,
    ) {
        this.template = ShareCfg.commander_data_template[id];
        this.level = ref(this.maxLevel);
        this.name = ref(this.originalName);
    }

    // 等级
    level: Ref<number>;

    // 名称
    name: Ref<string>;

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
        for (const attr of objectKeys(attrs)) {
            const coefficient = getCoefficient(attr);
            const efficiency =
                this.support.value * coefficient[0] +
                this.command.value * coefficient[1] +
                this.tactic.value * coefficient[2];
            const percent = 6 * efficiency / (250 + efficiency) / 100;
            attrs[attr] = Math.round(percent * 1000) / 1000;
        }
        return attrs;
    });

    // 天赋
    abilities = shallowReactive<(CommanderAbility | undefined)[]>([]);
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
