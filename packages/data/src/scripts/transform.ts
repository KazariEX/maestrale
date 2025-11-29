import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { ShareCfg } from "maestrale";
import { loadData } from "./utils";

export async function generateTransform() {
    const [
        ship_data_trans,
        transform_data_template,
    ] = await Promise.all([
        loadData<ShareCfg.ShipDataTrans>("ship_data_trans.json", true),
        loadData<ShareCfg.TransformDataTemplate>("ShareCfg/transform_data_template.json"),
    ]);

    for (const [id, { transform_list }] of Object.entries(ship_data_trans)) {
        const ids = transform_list
            .flat(1)
            .map(([, id]) => transform_data_template[id].ship_id)
            .flat(2)
            .filter((target) => String(target).slice(0, -1) !== id);

        if (ids.length) {
            ship_data_trans[id].ship_id = ids;
        }
    }

    const path = resolve(import.meta.dirname, "../generated/ship_data_trans.json");
    await writeFile(path, JSON.stringify(ship_data_trans));
}
