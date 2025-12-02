import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import consola from "consola";
import { createEquip, createShip, createSPWeapon, Equip, ShareCfg, Ship, SPWeapon, useTechnology } from "../packages/core/src";

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

function checkShip() {
    const items: Item[] = [];
    for (const id of Ship.ids) {
        const ship = createShip(id, { technology });
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

function checkEquip() {
    const items: Item[] = [];
    for (const id of Equip.ids) {
        const equip = createEquip(id);
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

function checkSPWeapon() {
    const items: Item[] = [];
    for (const id of SPWeapon.ids) {
        const weapon = createSPWeapon(id);
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
    console.table(items.toSorted((a, b) => a.asset.localeCompare(b.asset)));
}
