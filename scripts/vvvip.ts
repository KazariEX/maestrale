import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const resolveData = (...args: string[]) => resolve(import.meta.dirname, "../data", ...args);

const vvvip = {
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
            "weapon_id"
        ]
    },
    equip_data_template: {
        folder: "sharecfgdata",
        props: [
            "next",
            "prev",
            "ship_type_forbidden"
        ]
    },
    ship_data_blueprint: {
        folder: "ShareCfg",
        props: [
            "fate_strengthen",
            "strengthen_effect"
        ]
    },
    ship_data_breakout: {
        folder: "sharecfgdata",
        props: [
            "breakout_id"
        ]
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
            "type"
        ]
    },
    ship_data_strengthen: {
        folder: "ShareCfg",
        props: [
            "durability"
        ]
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
            "oil_at_start"
        ]
    },
    ship_data_trans: {
        folder: "ShareCfg",
        props: [
            "transform_list"
        ]
    },
    ship_meta_breakout: {
        folder: "ShareCfg",
        props: [
            "breakout_id"
        ]
    },
    ship_meta_repair_effect: {
        folder: "ShareCfg",
        props: [
            "effect_attr"
        ]
    },
    ship_meta_repair: {
        folder: "ShareCfg",
        props: [
            "effect_attr"
        ]
    },
    ship_skin_template: {
        folder: "ShareCfg",
        props: [
            "name",
            "painting"
        ]
    },
    ship_strengthen_blueprint: {
        folder: "ShareCfg",
        props: [
            "effect",
            "effect_attr",
            "lv",
            "need_exp"
        ]
    },
    ship_strengthen_meta: {
        folder: "ShareCfg",
        props: [
            "repair_air",
            "repair_cannon",
            "repair_effect",
            "repair_reload",
            "repair_torpedo"
        ]
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
            "value_2_random"
        ]
    },
    spweapon_type: {
        folder: "ShareCfg",
        props: [
            "ship_type"
        ]
    },
    transform_data_template: {
        folder: "ShareCfg",
        props: [
            "condition_id",
            "effect",
            "icon",
            "name",
            "ship_id"
        ]
    }
};

for (const key in vvvip) {
    await pick({
        filename: key,
        folder: vvvip[key].folder,
        props: vvvip[key].props
    });
}

//属性过滤
async function pick({ filename, folder, props }) {
    const inputPath = resolveData(folder, filename + ".json");
    const outputPath = resolveData("ShareCfg(VVVIP)", filename + ".json");

    const file = await readFile(inputPath);
    const j = JSON.parse(file.toString());

    const data = {};
    for (const id in j) {
        data[id] = {};
        for (const key of props) {
            if (key in j[id]) {
                data[id][key] = j[id][key];
            }
        }
    }

    writeFile(outputPath, JSON.stringify(data));
}