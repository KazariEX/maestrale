import { type Commander, type EquipType, ShareCfg, type ShipType } from "maestrale";
import { DialogSelector } from "#components";
import { equipTypeOptions } from "~/data/constants/equip-type";
import { type FleetType, fleetTypeMap } from "~/data/constants/fleet";
import { nationalityOptions } from "~/data/constants/nationality";
import { rarityOptions } from "~/data/constants/rarity";
import { shipTypeOptions } from "~/data/constants/ship-type";
import { spweaponRarityOptions } from "~/data/constants/spweapon-rarity";

export function getBaseShipIds() {
    const ids: number[] = [];
    for (const id in ShareCfg.ship_data_statistics) {
        if (id.endsWith("1") && !id.startsWith("900")) {
            ids.push(Number(id.slice(0, -1)));
        }
    }
    return ids;
}

function getBaseEquipIds() {
    const ids: number[] = [];
    for (const id in ShareCfg.equip_data_template) {
        const template = ShareCfg.equip_data_template[id]!;
        if (template.prev === 0) {
            ids.push(Number(id));
        }
    }
    return ids;
}

function getBaseSPWeaponIds() {
    const ids: number[] = [];
    for (const id in ShareCfg.spweapon_data_statistics) {
        const statistics = ShareCfg.spweapon_data_statistics[id]!;
        if ("name" in statistics) {
            ids.push(Number(id));
        }
    }
    return ids;
}

export function selectShip(fleetType: FleetType, canClear: boolean) {
    const ids = getBaseShipIds();
    const data = createSelectorData<ShareCfg.ShipDataStatistics>();

    for (const id of ids) {
        const statistics = ShareCfg.ship_data_statistics[id + "1"]!;
        const { rarity, type, nationality, name } = statistics;
        if (fleetTypeMap[type] !== fleetType) {
            continue;
        }

        data.push({
            id,
            name,
            icon: getSquareIconAtlas(ShareCfg.ship_skin_template[id + "0"]!.painting),
            rarity,
            type,
            nationality,
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择舰船",
            selectors: [
                { label: "稀有度", id: "rarity", options: rarityOptions },
                { label: "舰种", id: "type", options: shipTypeOptions },
                { label: "阵营", id: "nationality", options: nationalityOptions },
                { label: "可改造", exec: (item) => item.id in ShareCfg.ship_data_trans },
            ],
            data,
            canClear,
            onClose(id) {
                close();
                resolve(id);
            },
        }), {
            immediate: true,
        });
    });
}

export function selectEquip(allowTypes: EquipType[], shipType: ShipType, canClear: boolean) {
    const ids = getBaseEquipIds();
    const data = createSelectorData<ShareCfg.EquipDataStatistics>();

    for (const id of ids) {
        const statistics = ShareCfg.equip_data_statistics[id]!;
        const template = ShareCfg.equip_data_template[id]!;
        const { name, icon, rarity, type, nationality } = statistics;
        if (!allowTypes.includes(type) || template.ship_type_forbidden.includes(shipType)) {
            continue;
        }

        data.push({
            id,
            name,
            icon: getEquipIconAtlas(icon),
            rarity,
            type,
            nationality,
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择装备",
            selectors: [
                { label: "稀有度", id: "rarity", options: rarityOptions },
                { label: "类型", id: "type", options: equipTypeOptions },
                { label: "阵营", id: "nationality", options: nationalityOptions },
            ],
            data,
            canClear,
            iconPadding: true,
            onClose(id) {
                close();
                resolve(id);
            },
        }), {
            immediate: true,
        });
    });
}

export function selectSPWeapon(shipId: number, shipType: ShipType, canClear: boolean) {
    const ids = getBaseSPWeaponIds();
    const data = createSelectorData<ShareCfg.SPWeaponDataStatistics>();

    for (const id of ids) {
        const statistics = ShareCfg.spweapon_data_statistics[id]!;
        const { name, icon, rarity, type, unique } = statistics;
        if (
            !ShareCfg.spweapon_type[type]?.ship_type.includes(shipType) ||
            unique !== 0 && unique !== shipId
        ) {
            continue;
        }

        data.push({
            id,
            name,
            icon: getSPWeaponIconAtlas(icon),
            rarity,
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择兵装",
            selectors: [
                { label: "稀有度", id: "rarity", options: spweaponRarityOptions },
            ],
            data,
            canClear,
            iconPadding: true,
            rarityMode: "spweapon",
            onClose(id) {
                close();
                resolve(id);
            },
        }), {
            immediate: true,
        });
    });
}

export function selectCommander() {
    const ids = Object.keys(ShareCfg.commander_data_template);

    const data = createSelectorData<ShareCfg.CommanderDataTemplate>();
    for (const id of ids) {
        const template = ShareCfg.commander_data_template[id]!;
        const { name, painting, rarity, nationality } = template;
        data.push({
            id: Number(id),
            name,
            icon: getCommanderIconAtlas(painting),
            rarity,
            nationality,
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择指挥喵",
            selectors: [
                { label: "稀有度", id: "rarity", options: rarityOptions },
                { label: "阵营", id: "nationality", options: nationalityOptions },
            ],
            data,
            rarityMode: "commander",
            onClose(id) {
                close();
                resolve(id);
            },
        }), {
            immediate: true,
        });
    });
}

export function selectNestCommander(current: Commander | null, party: Commander[]) {
    const commanderStore = useCommanderStore();
    const { commanders } = storeToRefs(commanderStore);
    const excludes = getExcludeItems(current, party, commanders.value);

    const data = createSelectorData();
    for (let i = 0; i < commanders.value.length; i++) {
        const commander = commanders.value[i]!;
        if (excludes.has(commander)) {
            continue;
        }
        const { name, painting, rarity } = commander;
        data.push({
            id: i,
            name: name.value,
            icon: getCommanderIconAtlas(painting),
            rarity: rarity,
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择指挥喵",
            selectors: [
                { label: "稀有度", id: "rarity", options: rarityOptions },
                { label: "阵营", id: "nationality", options: nationalityOptions },
            ],
            data,
            canClear: !!current,
            rarityMode: "commander",
            onClose(i) {
                close();
                resolve(i);
            },
        }), {
            immediate: true,
        });
    });
}

function createSelectorData<T>(): (Partial<T> & {
    id: number;
    name: string;
    icon: string;
    rarity: number;
})[] {
    return [];
}

function getExcludeItems<T extends { id: number }>(currentItem: T | null, withinItems: T[], allItems: T[]) {
    const ids = withinItems.map((item) => item.id).filter((id) => id !== currentItem?.id);
    const excludes = new Set<T>(allItems.filter((item) => ids.includes(item.id)));
    if (currentItem) {
        excludes.add(currentItem);
    }
    return excludes;
}
