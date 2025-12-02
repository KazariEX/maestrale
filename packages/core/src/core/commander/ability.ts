import { ShareCfg } from "@maestrale/data";

export interface CommanderAbilityEffect {
    type: number;
    nationalities: number[];
    shipTypes: number[];
    key: number;
    value: number;
}

export class CommanderAbility {
    private template: ShareCfg.CommanderAbilityTemplate;

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

    // 效果列表
    effects: CommanderAbilityEffect[];

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
