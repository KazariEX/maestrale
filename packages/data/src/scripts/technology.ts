import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Nationality, ShareCfg, TechnologyAttributes } from "maestrale";
import { constants } from "./constants";
import { loadData } from "./utils";

export async function generateTechnology() {
    const [
        attribute_info_by_type,
        fleet_tech_ship_class,
        fleet_tech_ship_template,
        fleet_tech_template,
    ] = await Promise.all([
        loadData<ShareCfg.AttributeInfoByType>("ShareCfg/attribute_info_by_type.json"),
        loadData<ShareCfg.FleetTechShipClass>("ShareCfg/fleet_tech_ship_class.json"),
        loadData<ShareCfg.FleetTechShipTemplate>("ShareCfg/fleet_tech_ship_template.json"),
        loadData<ShareCfg.FleetTechTemplate>("ShareCfg/fleet_tech_template.json"),
    ]);

    await Promise.all([
        generateFleetTechAttributes(),
        generateFleetTechMetaClass(),
    ]);

    async function generateFleetTechAttributes() {
        const attributes: Record<string, TechnologyAttributes> = {};
        const skippedShipTypes = new Set([20, 21, 23, 24]);

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
                if (skippedShipTypes.has(type)) {
                    continue;
                }
                attributes[type] ??= createTechnologyAttributes();
                const name = attribute_info_by_type[attr].name as keyof TechnologyAttributes;
                attributes[type][name] ??= 0;
                attributes[type][name] += value;
            }
        }
    }

    async function generateFleetTechMetaClass() {
        const data: Record<string, ShareCfg.FleetTechMetaClass> = {};

        for (const item of Object.values(fleet_tech_ship_class)) {
            if (item.nation === 97 satisfies Nationality.META) {
                const key = `meta_${item.t_level}`;
                data[key] ??= {
                    name: constants[`meta_class_t_level_${item.t_level}`],
                    nation: item.nation,
                    ships: [],
                    t_level: item.t_level,
                };
                data[key].ships.push(...item.ships);
            }
            else if (item.nation === 96 satisfies Nationality.Tempesta) {
                const key = `tempesta_${item.t_level}`;
                data[key] ??= {
                    name: constants[`tempesta_class_t_level_${item.t_level}`],
                    nation: item.nation,
                    ships: [],
                    t_level: item.t_level,
                };
                data[key].ships.push(...item.ships);
            }
        }

        const path = resolve(import.meta.dirname, "../generated/fleet_tech_meta_class.json");
        await writeFile(path, JSON.stringify(data));
    }
}

function createTechnologyAttributes(): TechnologyAttributes {
    return {
        durability: 0,
        cannon: 0,
        torpedo: 0,
        antiaircraft: 0,
        air: 0,
        reload: 0,
        hit: 0,
        dodge: 0,
        antisub: 0,
    };
}
