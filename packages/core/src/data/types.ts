import type { Attributes } from "../core/attributes";
import type { Armor, EquipType, Nationality, ShipType } from "../types";

export type ShareCfgName =
    | "equip_data_statistics"
    | "equip_data_template"
    | "ship_data_blueprint"
    | "ship_data_breakout"
    | "ship_data_statistics"
    | "ship_data_strengthen"
    | "ship_data_template"
    | "ship_data_trans"
    | "ship_meta_breakout"
    | "ship_meta_repair"
    | "ship_meta_repair_effect"
    | "ship_skin_template"
    | "ship_strengthen_blueprint"
    | "ship_strengthen_meta"
    | "spweapon_data_statistics"
    | "spweapon_type"
    | "transform_data_template";

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