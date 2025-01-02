import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import consola from "consola";
import { createEquip, createShip, createSPWeapon, ShareCfg, useTechnology } from "../packages/core/src";

const baseDir = resolve(import.meta.dirname, "../simulator/public/assets/artresource/atlas");

const technology = useTechnology();

await ShareCfg.load();
checkShip();
checkEquip();
checkSPWeapon();

async function checkShip() {
    const ids = new Set(
        Object.keys(ShareCfg.ship_data_statistics)
        .map((id) => id.slice(0, id.length - 1))
        .filter((id) => !id.startsWith("900"))
    );

    const icons = [];
    for (const id of ids) {
        const ship = createShip(Number(id), { technology });
        if (!ship) {
            continue;
        }
        const icon = ship.painting.value;

        const path = join(baseDir, "squareicon", icon + ".png");
        if (!existsSync(path)) {
            icons.push(icon);
        }
    }
    consola.info(`Missing ships:\n${icons.join("\n")}`);
}

async function checkEquip() {
    const ids = Object.entries(ShareCfg.equip_data_template)
        .filter(([, item]) => item.prev === 0)
        .map(([id]) => id);

    const icons = [];
    for (const id of ids) {
        const equip = createEquip(Number(id));
        if (!equip) {
            continue;
        }
        const icon = equip.icon;

        const path = join(baseDir, "equips", icon + ".png");
        if (!existsSync(path)) {
            icons.push(icon);
        }
    }
    consola.info(`Missing equips:\n${icons.join("\n")}`);
}

async function checkSPWeapon() {
    const ids = Object.entries(ShareCfg.spweapon_data_statistics)
        .filter(([, item]) => item.name)
        .map(([id]) => id);

    const icons = [];
    for (const id of ids) {
        const weapon = createSPWeapon(Number(id));
        if (!weapon) {
            continue;
        }
        const icon = weapon.icon;

        const path = join(baseDir, "spweapon", icon + ".png");
        if (!existsSync(path)) {
            icons.push(icon);
        }
    }
    consola.info(`Missing spweapons:\n${icons.join("\n")}`);
}