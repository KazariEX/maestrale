import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import consola from "consola";
import { updateTechnology } from "./technology";

const resolveData = (...args: string[]) => resolve(import.meta.dirname, "../packages/data", ...args);

interface VVVIP {
    folder: string;
    props: string[];
}

const vvvip: Record<string, VVVIP> = {
    attribute_info_by_type: {
        folder: "ShareCfg",
        props: [
            "name"
        ]
    },
    commander_ability_template: {
        folder: "ShareCfg",
        props: [
            "add",
            "desc",
            "icon",
            "name",
            "worth"
        ]
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
            "tactic_value"
        ]
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
    fleet_tech_ship_template: {
        folder: "ShareCfg",
        props: []
    },
    fleet_tech_template: {
        folder: "ShareCfg",
        props: []
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
            "edit_trans",
            "effect",
            "icon",
            "name",
            "ship_id"
        ]
    }
};

if (process.argv.includes("--update")) {
    try {
        const { ProxyAgent, setGlobalDispatcher } = await import("undici");
        const dispatcher = new ProxyAgent({ uri: new URL(process.env.HTTPS_PROXY!).toString() });
        setGlobalDispatcher(dispatcher);
    }
    catch {}

    const baseUrl = "https://raw.githubusercontent.com/AzurLaneTools/AzurLaneData/refs/heads/main/";
    let isDataChanged = false;

    //数据
    await Promise.all(Object.entries(vvvip).map(async ([filename, { folder }]) => {
        const uri = `${folder}/${filename}.json`;
        const { href } = new URL(uri, baseUrl + "CN/");

        try {
            const res = await fetch(href);
            if (res.status !== 200) {
                throw 0;
            }
            const data = await res.text();

            const path = resolveData(uri);
            try {
                const file = await readFile(path);
                isDataChanged ||= file.toString() !== data;
            }
            catch {
                isDataChanged = true;
            }

            await writeFile(path, data);
            consola.success(`Fetch "${uri}"`);
        }
        catch (err) {
            consola.error(`Failed to fetch "${uri}"`);
            throw err;
        }
    }));

    if (!isDataChanged) {
        process.exit(0);
    }

    //版本号
    try {
        const uri = "versions/CN.txt";
        const { href } = new URL(uri, baseUrl);
        const res = await fetch(href);
        if (res.status !== 200) {
            throw 0;
        }
        const version = await res.text();

        const path = resolveData("package.json");
        await writeFile(path, `{\n  "version": "${version}",\n  "private": true\n}`);
        consola.success(`Fetch version "${version}"`);
    }
    catch (err) {
        consola.error("Failed to fetch version");
        throw err;
    }

    //舰队科技
    await updateTechnology();
}
else {
    const dir = resolveData("ShareCfg(VVVIP)");
    if (!existsSync(dir)) {
        mkdirSync(dir);
    }

    await Promise.all(Object.entries(vvvip).map(([key, { folder, props }]) => pick(key, {
        folder,
        props
    })));

    // 属性过滤
    async function pick(filename: string, { folder, props }: VVVIP) {
        if (!props.length) {
            return;
        }

        const inputPath = resolveData(folder, filename + ".json");
        const outputPath = resolveData("ShareCfg(VVVIP)", filename + ".json");

        const file = await readFile(inputPath);
        const json = JSON.parse(file.toString());

        const data: Record<string, Record<string, unknown>> = {};
        for (const id in json) {
            if (id === "all") {
                continue;
            }
            data[id] = {};
            for (const key of props) {
                if (key in json[id]) {
                    data[id][key] = json[id][key];
                }
            }
        }
        await writeFile(outputPath, JSON.stringify(data));
    }
}