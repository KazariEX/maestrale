import type { Armor, Attributes, EquipType, Nationality, ShipType } from "maestrale";

async function loadData(name: string) {
    const data = await import(`../ShareCfg(VVVIP)/${name}.json`);
    return [
        name,
        data.default
    ] as const;
}

export namespace ShareCfg {
    export async function load() {
        const datas = await Promise.all([
            loadData("attribute_info_by_type"),
            loadData("commander_ability_template"),
            loadData("commander_data_template"),
            loadData("equip_data_statistics"),
            loadData("equip_data_template"),
            loadData("ship_data_blueprint"),
            loadData("ship_data_breakout"),
            loadData("ship_data_statistics"),
            loadData("ship_data_strengthen"),
            loadData("ship_data_template"),
            loadData("ship_data_trans"),
            loadData("ship_meta_breakout"),
            loadData("ship_meta_repair"),
            loadData("ship_meta_repair_effect"),
            loadData("ship_skin_template"),
            loadData("ship_strengthen_blueprint"),
            loadData("ship_strengthen_meta"),
            loadData("spweapon_data_statistics"),
            loadData("spweapon_type"),
            loadData("transform_data_template")
        ]);
        for (const [name, data] of datas) {
            Object.defineProperty(ShareCfg, name, {
                value: data,
                configurable: false,
                enumerable: true,
                writable: false
            });
        }
    }

    export declare const attribute_info_by_type: Record<string, AttributeInfoByType>;
    export declare const commander_ability_template: Record<string, CommanderAbilityTemplate>;
    export declare const commander_data_template: Record<string, CommanderDataTemplate>;
    export declare const equip_data_statistics: Record<string, EquipDataStatistics>;
    export declare const equip_data_template: Record<string, EquipDataTemplate>;
    export declare const ship_data_blueprint: Record<string, ShipDataBlueprint>;
    export declare const ship_data_breakout: Record<string, ShipDataBreakout>;
    export declare const ship_data_statistics: Record<string, ShipDataStatistics>;
    export declare const ship_data_strengthen: Record<string, ShipDataStrengthen>;
    export declare const ship_data_template: Record<string, ShipDataTemplate>;
    export declare const ship_data_trans: Record<string, ShipDataTrans>;
    export declare const ship_meta_breakout: Record<string, ShipMetaBreakout>;
    export declare const ship_meta_repair: Record<string, ShipMetaRepair>;
    export declare const ship_meta_repair_effect: Record<string, ShipMetaRepairEffect>;
    export declare const ship_skin_template: Record<string, ShipSkinTemplate>;
    export declare const ship_strengthen_blueprint: Record<string, ShipStrengthenBlueprint>;
    export declare const ship_strengthen_meta: Record<string, ShipStrengthenMeta>;
    export declare const spweapon_data_statistics: Record<string, SPWeaponDataStatistics>;
    export declare const spweapon_type: Record<string, SPWeaponType>;
    export declare const transform_data_template: Record<string, TransformDataTemplate>;

    export interface AttributeInfoByType {
        name: keyof Attributes;
    }

    export interface CommanderAbilityTemplate {
        add: [
            number,
            Nationality[],
            ShipType[],
            number,
            number
        ][];
        desc: string;
        icon: string;
        name: string;
        worth: number;
    }

    export interface CommanderDataTemplate {
        command_value: number;
        max_level: number;
        name: string;
        nationality: Nationality;
        painting: string;
        rarity: number;
        support_value: number;
        tactic_value: number;
    }

    export interface EquipDataStatistics {
        attribute_1: keyof Attributes;
        attribute_2: keyof Attributes;
        attribute_3: keyof Attributes;
        icon: string;
        name: string;
        nationality: Nationality;
        rarity: number;
        tech: number;
        type: EquipType;
        value_1: string;
        value_2: number;
        value_3: number;
        weapon_id: number[];
    }

    export interface EquipDataTemplate {
        next: number;
        prev: number;
        ship_type_forbidden: ShipType[];
    }

    export interface ShipDataBlueprint {
        fate_strengthen: number[];
        strengthen_effect: number[];
    }

    export interface ShipDataBreakout {
        breakout_id: number;
    }

    export interface ShipDataStatistics {
        ammo: number;
        armor_type: Armor;
        attrs: number[];
        attrs_growth: number[];
        name: string;
        nationality: Nationality;
        oxy_max: number;
        rarity: number;
        star: number;
        type: ShipType;
    }

    export interface ShipDataStrengthen {
        durability: number[];
    }

    export interface ShipDataTemplate {
        equip_1: EquipType[];
        equip_2: EquipType[];
        equip_3: EquipType[];
        equip_4: EquipType[];
        equip_5: EquipType[];
        oil_at_end: number;
        oil_at_start: number;
    }

    export interface ShipDataTrans {
        transform_list: number[][][];
    }

    export interface ShipMetaBreakout {
        breakout_id: number;
    }

    export interface ShipMetaRepairEffect {
        effect_attr: [keyof Attributes, number][];
    }

    export interface ShipMetaRepair {
        effect_attr: [keyof Attributes, number];
    }

    export interface ShipSkinTemplate {
        name: string;
        painting: string;
    }

    export interface ShipStrengthenBlueprint {
        effect: number[];
        effect_attr: [keyof Attributes, number][];
        lv: number;
        need_exp: number;
    }

    export interface ShipStrengthenMeta {
        repair_air: number[];
        repair_cannon: number[];
        repair_effect: [number, number][];
        repair_reload: number[];
        repair_torpedo: number[];
    }

    export interface SPWeaponDataStatistics {
        attribute_1: keyof Attributes;
        attribute_2: keyof Attributes;
        icon: string;
        name: string;
        next: number;
        prev: number;
        rarity: number;
        type: number;
        unique: number;
        value_1: number;
        value_1_random: number;
        value_2: number;
        value_2_random: number;
    }

    export interface SPWeaponType {
        ship_type: ShipType[];
    }

    export interface TransformDataTemplate {
        condition_id: number[];
        edit_trans: number[];
        effect: Record<keyof Attributes, number>[];
        icon: string;
        name: string;
        ship_id: number[][];
    }
}