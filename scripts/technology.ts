import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { type Edit, Lang, parse } from "@ast-grep/napi";
import type { ShareCfg } from "../packages/core/src";

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
    const attributes = await calcTotalAttributes();

    const path = resolve(import.meta.dirname, "../packages/core/src/core/technology.ts");
    const file = await readFile(path);
    const ast = parse(Lang.TypeScript, file.toString());
    const root = ast.root();

    const pairs = root
        .find("function createTechnologyAttributes(): $TYPE { return $RETURNS; }")
        ?.getMatch("RETURNS")
        ?.children()
        ?.filter((node) => node.kind() === "pair") ?? [];

    const edits: Edit[] = [];
    for (const pair of pairs) {
        const type = pair.field("key")!.text();
        const attrs = attributes[type];

        const attrPairs = pair.field("value")!.children().filter((node) => node.kind() === "pair");
        for (const attrPair of attrPairs) {
            const key = attrPair.field("key")!.text();
            const edit = attrPair.field("value")!.replace(String(attrs[key] ?? 0));
            edits.push(edit);
        }
    }

    const result = root.commitEdits(edits);
    await writeFile(path, result);
}

async function calcTotalAttributes() {
    const attribute_info_by_type = await loadData<ShareCfg.AttributeInfoByType>("ShareCfg/attribute_info_by_type.json");
    const fleet_tech_ship_template = await loadData<FleetTechShipTemplate>("ShareCfg/fleet_tech_ship_template.json");
    const fleet_tech_template = await loadData<FleetTechTemplate>("ShareCfg/fleet_tech_template.json");

    const attributes: Record<string, Record<string, number>> = {};
    const skipShipTypes = new Set([20, 21, 23, 24]);

    for (const item of Object.values(fleet_tech_ship_template)) {
        update(item.add_get_shiptype, item.add_get_attr, item.add_get_value);
        update(item.add_level_shiptype, item.add_level_attr, item.add_level_value);
    }
    for (const { add } of Object.entries(fleet_tech_template).filter(([key]) => key.endsWith("9")).map(([, value]) => value)) {
        for (const [types, attr, value] of add) {
            update(types, attr, value);
        }
    }
    return attributes;

    async function loadData<T>(path: string) {
        const data = (await import(pathToFileURL(
            resolve(import.meta.dirname, "../packages/data", path)
        ).toString())).default as Record<string, T>;
        delete data.all;
        return data;
    }

    function update(types: number[], attr: number, value: number) {
        for (const type of types) {
            if (skipShipTypes.has(type)) {
                continue;
            }
            attributes[type] ??= {};
            const { name } = attribute_info_by_type[attr];
            attributes[type][name] = (attributes[type][name] ?? 0) + value;
        }
    }
}