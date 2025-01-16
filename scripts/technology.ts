import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Attributes, ShareCfg } from "../packages/core/src";

interface FleetTechShipTemplate {
    add_get_attr: number;
    add_get_shiptype: number[];
    add_get_value: number;
    add_level_attr: number;
    add_level_shiptype: number[];
    add_level_value: number;
}

interface FleetTechTemplate {
    add: [number[], number, number][];
}

export async function updateTechnology() {
    const attribute_info_by_type = await loadData<ShareCfg.AttributeInfoByType>("ShareCfg/attribute_info_by_type.json");
    const fleet_tech_ship_template = await loadData<FleetTechShipTemplate>("ShareCfg/fleet_tech_ship_template.json");
    const fleet_tech_template = await loadData<FleetTechTemplate>("ShareCfg/fleet_tech_template.json");

    const attributes: Record<string, Attributes> = {};
    const skipShipTypes = new Set([20, 21, 23, 24]);

    for (const item of Object.values(fleet_tech_ship_template)) {
        update(item.add_get_shiptype, item.add_get_attr, item.add_get_value);
        update(item.add_level_shiptype, item.add_level_attr, item.add_level_value);
    }

    const keys = Object.keys(fleet_tech_template);
    for (let i = 0; i < keys.length; i++) {
        const key = Number(keys[i]);
        const nextKey = Number(keys[i + 1] ?? Infinity);
        if (Math.floor(nextKey / 1000) <= Math.floor(key / 1000)) {
            continue;
        }
        for (const [types, attr, value] of fleet_tech_template[key].add) {
            update(types, attr, value);
        }
    }

    const path = resolve(import.meta.dirname, "../packages/data/generated/fleet_tech_attributes.json");
    await writeFile(path, JSON.stringify(attributes));

    async function loadData<T>(path: string) {
        const data = (await import(pathToFileURL(
            resolve(import.meta.dirname, "../packages/data/resources", path)
        ).toString())).default as Record<string, T>;
        delete data.all;
        return data;
    }

    function update(types: number[], attr: number, value: number) {
        for (const type of types) {
            if (skipShipTypes.has(type)) {
                continue;
            }
            attributes[type] ??= createAttributes();
            const { name } = attribute_info_by_type[attr];
            attributes[type][name] = (attributes[type][name] ?? 0) + value;
        }
    }
}

function createAttributes(): Attributes {
    return {
        durability: 0,
        cannon: 0,
        torpedo: 0,
        antiaircraft: 0,
        air: 0,
        reload: 0,
        hit: 0,
        dodge: 0,
        speed: 0,
        luck: 0,
        antisub: 0
    };
}