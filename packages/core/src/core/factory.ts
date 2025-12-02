import { ShareCfg } from "@maestrale/data";
import { Commander } from "./commander";
import { CommanderAbility } from "./commander/ability";
import { Equip } from "./equip";
import { Ship } from "./ship";
import { SPWeapon } from "./spweapon";
import type { Favor } from "../types";
import type { ITechnology } from "./technology";

declare module "maestrale" {
    namespace Ship {
        const ids: number[];
    }
    namespace Equip {
        const ids: number[];
    }
    namespace SPWeapon {
        const ids: number[];
    }
    namespace Commander {
        const ids: number[];
    }
}

defineIds(Ship, () => (
    Object.keys(ShareCfg.ship_data_statistics)
        .filter((id) => id.endsWith("1") && !id.startsWith("900"))
        .map((id) => Number(id.slice(0, -1)))
));

defineIds(Equip, () => (
    Object.keys(ShareCfg.equip_data_template).map(Number).filter((id) => id % 20 === 0)
));

defineIds(SPWeapon, () => (
    Object.keys(ShareCfg.spweapon_data_statistics).map(Number).filter((id) => id % 20 === 0)
));

defineIds(Commander, () => (
    Object.keys(ShareCfg.commander_data_template).map(Number)
));

function defineIds(ctor: object, getter: () => number[]) {
    let cache: number[];
    Object.defineProperty(ctor, "ids", {
        get: () => cache ??= getter(),
    });
}

export interface CreateShipOptions {
    level?: number;
    breakout?: number;
    favor?: Favor;
    equips?: (Equip | number | null)[];
    spweapon?: SPWeapon | number | null;
    technology: ITechnology;
}

export function createShip(id: number, options: CreateShipOptions) {
    if (!(id + "1" in ShareCfg.ship_data_statistics)) {
        return null;
    }

    const {
        level,
        breakout,
        favor,
        equips = [],
        spweapon = null,
        technology,
    } = options;

    // 舰船
    const ship = new Ship(id, technology);

    // 等级
    if (level !== void 0) {
        ship.level.value = level;
    }

    // 突破
    if (breakout !== void 0) {
        ship.breakout.value = Math.min(breakout, ship.breakoutLimit);
    }

    // 好感
    if (favor !== void 0) {
        ship.favor.value = favor;
    }

    // 装备
    for (const i of [1, 2, 3, 4, 5] as const) {
        ship[`equip${i}`].value = normalizeEquip(equips[i] ?? null);
    }

    // 兵装
    ship.spweapon.value = normalizeSPWeapon(spweapon);

    return ship;
}

export function createEquip(id: number) {
    if (id % 20 !== 0 || !(id in ShareCfg.equip_data_template)) {
        return null;
    }
    return new Equip(id);
}

export function createSPWeapon(id: number) {
    if (id % 20 !== 0 || !(id in ShareCfg.spweapon_data_statistics)) {
        return null;
    }
    return new SPWeapon(id);
}

export function createCommander(id: number) {
    if (!(id in ShareCfg.commander_data_template)) {
        return null;
    }
    return new Commander(id);
}

export function createCommanderAbility(id: number) {
    if (!(id in ShareCfg.commander_ability_template)) {
        return null;
    }
    return new CommanderAbility(id);
}

function normalizeEquip(equip: Equip | number | null) {
    return typeof equip === "number" ? createEquip(equip) : equip;
}

function normalizeSPWeapon(spweapon: SPWeapon | number | null) {
    return typeof spweapon === "number" ? createSPWeapon(spweapon) : spweapon;
}
