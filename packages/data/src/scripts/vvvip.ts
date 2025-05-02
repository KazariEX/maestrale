export interface VVVIP {
    folder: string;
    props: string[];
}

export const vvvip: Record<string, VVVIP> = {
    attribute_info_by_type: {
        folder: "ShareCfg",
        props: [
            "name",
        ],
    },
    commander_ability_template: {
        folder: "ShareCfg",
        props: [
            "add",
            "desc",
            "icon",
            "name",
            "worth",
        ],
    },
    commander_data_template: {
        folder: "ShareCfg",
        props: [
            "command_value",
            "max_level",
            "name",
            "nationality",
            "painting",
            "rarity",
            "support_value",
            "tactic_value",
        ],
    },
    equip_data_statistics: {
        folder: "sharecfgdata",
        props: [
            "attribute_1",
            "attribute_2",
            "attribute_3",
            "icon",
            "name",
            "nationality",
            "rarity",
            "tech",
            "type",
            "value_1",
            "value_2",
            "value_3",
            "weapon_id",
        ],
    },
    equip_data_template: {
        folder: "sharecfgdata",
        props: [
            "next",
            "prev",
            "ship_type_forbidden",
        ],
    },
    fleet_tech_ship_class: {
        folder: "ShareCfg",
        props: [
            "name",
            "nation",
            "shiptype",
            "ships",
            "t_level",
        ],
    },
    fleet_tech_ship_template: {
        folder: "ShareCfg",
        props: [
            "add_get_attr",
            "add_get_shiptype",
            "add_get_value",
            "add_level_attr",
            "add_level_shiptype",
            "add_level_value",
            "pt_get",
            "pt_level",
            "pt_upgrage",
        ],
    },
    fleet_tech_template: {
        folder: "ShareCfg",
        props: [],
    },
    ship_data_blueprint: {
        folder: "ShareCfg",
        props: [
            "fate_strengthen",
            "strengthen_effect",
        ],
    },
    ship_data_breakout: {
        folder: "sharecfgdata",
        props: [
            "breakout_id",
        ],
    },
    ship_data_statistics: {
        folder: "sharecfgdata",
        props: [
            "ammo",
            "armor_type",
            "attrs",
            "attrs_growth",
            "name",
            "nationality",
            "oxy_max",
            "rarity",
            "star",
            "type",
        ],
    },
    ship_data_strengthen: {
        folder: "ShareCfg",
        props: [
            "durability",
        ],
    },
    ship_data_template: {
        folder: "sharecfgdata",
        props: [
            "equip_1",
            "equip_2",
            "equip_3",
            "equip_4",
            "equip_5",
            "oil_at_end",
            "oil_at_start",
        ],
    },
    ship_data_trans: {
        folder: "ShareCfg",
        props: [
            "transform_list",
        ],
    },
    ship_meta_breakout: {
        folder: "ShareCfg",
        props: [
            "breakout_id",
        ],
    },
    ship_meta_repair_effect: {
        folder: "ShareCfg",
        props: [
            "effect_attr",
        ],
    },
    ship_meta_repair: {
        folder: "ShareCfg",
        props: [
            "effect_attr",
        ],
    },
    ship_skin_template: {
        folder: "ShareCfg",
        props: [
            "name",
            "painting",
        ],
    },
    ship_strengthen_blueprint: {
        folder: "ShareCfg",
        props: [
            "effect",
            "effect_attr",
            "lv",
            "need_exp",
        ],
    },
    ship_strengthen_meta: {
        folder: "ShareCfg",
        props: [
            "repair_air",
            "repair_cannon",
            "repair_effect",
            "repair_reload",
            "repair_torpedo",
        ],
    },
    spweapon_data_statistics: {
        folder: "sharecfgdata",
        props: [
            "attribute_1",
            "attribute_2",
            "icon",
            "name",
            "next",
            "prev",
            "rarity",
            "type",
            "unique",
            "value_1",
            "value_1_random",
            "value_2",
            "value_2_random",
        ],
    },
    spweapon_type: {
        folder: "ShareCfg",
        props: [
            "ship_type",
        ],
    },
    transform_data_template: {
        folder: "ShareCfg",
        props: [
            "condition_id",
            "edit_trans",
            "effect",
            "icon",
            "name",
            "ship_id",
        ],
    },
};
