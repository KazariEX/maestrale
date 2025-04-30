import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import consola from "consola";
import { createEquip, createShip, createSPWeapon, ShareCfg, useTechnology } from "../packages/core/src";

interface Item {
    asset: string;
    name: string;
}

const baseDir = resolve(import.meta.dirname, "../simulator/public/assets/artresource/atlas");

const technology = useTechnology();

await ShareCfg.load();
checkShip();
checkEquip();
checkSPWeapon();

async function checkShip() {
    const ids = new Set(
        Object.keys(ShareCfg.ship_data_statistics)
        .map((id) => id.slice(0, -1))
        .filter((id) => !id.startsWith("900")),
    );

    const items: Item[] = [];
    for (const id of ids) {
        const ship = createShip(Number(id), { technology });
        if (!ship) {
            continue;
        }
        const asset = ship.painting.value;

        const path = join(baseDir, "squareicon", asset + ".png");
        if (!existsSync(path)) {
            items.push({
                asset,
                name: ship.name.value,
            });
        }
    }
    print("ships", items);
}

async function checkEquip() {
    const ids = Object.entries(ShareCfg.equip_data_template)
        .filter(([, item]) => item.prev === 0)
        .map(([id]) => id);

    const items: Item[] = [];
    for (const id of ids) {
        const equip = createEquip(Number(id));
        if (!equip) {
            continue;
        }
        const asset = equip.icon;

        const path = join(baseDir, "equips", asset + ".png");
        if (!existsSync(path)) {
            items.push({
                asset,
                name: equip.name,
            });
        }
    }
    print("equips", items);
}

async function checkSPWeapon() {
    const ids = Object.entries(ShareCfg.spweapon_data_statistics)
        .filter(([, item]) => item.name)
        .map(([id]) => id);

    const items: Item[] = [];
    for (const id of ids) {
        const weapon = createSPWeapon(Number(id));
        if (!weapon) {
            continue;
        }
        const asset = weapon.icon;

        const path = join(baseDir, "spweapon", asset + ".png");
        if (!existsSync(path)) {
            items.push({
                asset,
                name: weapon.name,
            });
        }
    }
    print("spweapons", items);
}

function print(name: string, items: Item[]) {
    if (!items.length) {
        return;
    }
    consola.info(`Missing ${name}:`);
    console.table(items);
}
