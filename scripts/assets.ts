import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import consola from "consola";
import { Commander, createCommander, createEquip, createShip, createSPWeapon, Equip, ShareCfg, Ship, SPWeapon, useTechnology } from "../packages/core/src";

interface Item {
    asset: string;
    name: string;
}

const baseDir = resolve(import.meta.dirname, "../simulator/public/assets/artresource/atlas");
const technology = useTechnology();
await ShareCfg.load();

check("ship", "squareicon", () => Ship.ids.map((id) => {
    const ship = createShip(id, { technology })!;
    return {
        asset: ship.painting.value,
        name: ship.name.value,
    };
}));

check("equip", "equips", () => Equip.ids.map((id) => {
    const equip = createEquip(id)!;
    return {
        asset: equip.icon,
        name: equip.name,
    };
}));

check("spweapon", "spweapon", () => SPWeapon.ids.map((id) => {
    const weapon = createSPWeapon(id)!;
    return {
        asset: weapon.icon,
        name: weapon.name,
    };
}));

check("commander", "commandericon", () => Commander.ids.map((id) => {
    const commander = createCommander(id)!;
    return {
        asset: commander.painting,
        name: commander.originalName,
    };
}));

function check(name: string, folder: string, getter: () => Item[]) {
    const items = getter().filter(({ asset }) => {
        const path = join(baseDir, folder, asset + ".png");
        return !existsSync(path);
    });
    if (items.length) {
        consola.info(`Missing ${name}:`);
        console.table(items.toSorted((a, b) => a.asset.localeCompare(b.asset)));
    }
}
