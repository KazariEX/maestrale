import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Attributes, ShareCfg } from "maestrale";
import { loadData } from "./utils";

interface FleetTechTemplate {
    add: [number[], number, number][];
}

export async function generateTechnology() {
    const attribute_info_by_type = await loadData<ShareCfg.AttributeInfoByType>("ShareCfg/attribute_info_by_type.json");
    const fleet_tech_ship_template = await loadData<ShareCfg.FleetTechShipTemplate>("ShareCfg/fleet_tech_ship_template.json");
    const fleet_tech_template = await loadData<FleetTechTemplate>("ShareCfg/fleet_tech_template.json");

    const attributes: Record<string, Attributes> = {};
    const skipShipTypes = new Set([20, 21, 23, 24]);

    for (const item of Object.values(fleet_tech_ship_template)) {
        increase(item.add_get_shiptype, item.add_get_attr, item.add_get_value);
        increase(item.add_level_shiptype, item.add_level_attr, item.add_level_value);
    }

    const keys = Object.keys(fleet_tech_template);
    for (let i = 0; i < keys.length; i++) {
        const key = Number(keys[i]);
        const nextKey = Number(keys[i + 1] ?? Infinity);
        if (Math.floor(nextKey / 1000) <= Math.floor(key / 1000)) {
            continue;
        }
        for (const [types, attr, value] of fleet_tech_template[key].add) {
            increase(types, attr, value);
        }
    }

    const path = resolve(import.meta.dirname, "../generated/fleet_tech_attributes.json");
    await writeFile(path, JSON.stringify(attributes));

    function increase(types: number[], attr: number, value: number) {
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
        antisub: 0,
    };
}
