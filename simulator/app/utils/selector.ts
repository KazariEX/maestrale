import { type EquipType, ShareCfg, type ShipType } from "maestrale";
import { DialogSelector } from "#components";
import { equipTypeOptions } from "~/data/constraint/equip-type";
import { type FleetType, fleetTypeMap } from "~/data/constraint/fleet";
import { nationalityOptions } from "~/data/constraint/nationality";
import { rarityOptions } from "~/data/constraint/rarity";
import { shipTypeOptions } from "~/data/constraint/ship-type";
import { spweaponRarityOptions } from "~/data/constraint/spweapon-rarity";

export function selectShip(fleetType: FleetType, canClear: boolean) {
    const ids = new Set(
        Object.keys(ShareCfg.ship_data_statistics)
        .map((id) => id.slice(0, id.length - 1))
        .filter((id) => !id.startsWith("900"))
    );

    const data = createSelectorData<ShareCfg.ShipDataStatistics>();
    for (const id of ids) {
        const statistics = ShareCfg.ship_data_statistics[id + "1"];
        if (!statistics) {
            continue;
        }

        const { rarity, type, nationality, name } = statistics;
        if (fleetTypeMap[type] !== fleetType) {
            continue;
        }

        data.push({
            id: Number(id),
            name,
            icon: `/image/artresource/atlas/squareicon/${ShareCfg.ship_skin_template[`${id}0`]?.painting}.png`,
            rarity,
            type,
            nationality
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择舰船",
            selectors: [
                { label: "稀有度", id: "rarity", options: rarityOptions },
                { label: "舰种", id: "type", options: shipTypeOptions },
                { label: "阵营", id: "nationality", options: nationalityOptions }
            ],
            data,
            canClear,
            onClose(id) {
                close();
                resolve(id);
            }
        }), {
            immediate: true
        });
    });
}

export function selectEquip(allowTypes: EquipType[], shipType: ShipType, canClear: boolean) {
    const ids = Object.entries(ShareCfg.equip_data_template)
        .filter(([, item]) => item.prev === 0)
        .map(([id]) => id);

    const data = createSelectorData<ShareCfg.EquipDataStatistics>();
    for (const id of ids) {
        const statistics = ShareCfg.equip_data_statistics[id];
        const template = ShareCfg.equip_data_template[id];
        if (!statistics || !template) {
            continue;
        }

        const { name, icon, rarity, type, nationality } = statistics;
        if (!allowTypes.includes(type) || template.ship_type_forbidden.includes(shipType)) {
            continue;
        }

        data.push({
            id: Number(id),
            name,
            icon: `/image/artresource/atlas/equips/${icon}.png`,
            rarity,
            type,
            nationality
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择装备",
            selectors: [
                { label: "稀有度", id: "rarity", options: rarityOptions },
                { label: "类型", id: "type", options: equipTypeOptions },
                { label: "阵营", id: "nationality", options: nationalityOptions }
            ],
            data,
            canClear,
            iconPadding: true,
            onClose(id) {
                close();
                resolve(id);
            }
        }), {
            immediate: true
        });
    });
}

export function selectSPWeapon(shipId: number, shipType: ShipType, canClear: boolean) {
    const ids = Object.entries(ShareCfg.spweapon_data_statistics)
        .filter(([, item]) => item.name)
        .map(([id]) => id);

    const data = createSelectorData<ShareCfg.SPWeaponDataStatistics>();
    for (const id of ids) {
        const statistics = ShareCfg.spweapon_data_statistics[id];
        if (!statistics) {
            continue;
        }

        const { name, icon, rarity, type, unique } = statistics;
        if (
            !ShareCfg.spweapon_type[type]?.ship_type.includes(shipType) ||
            unique !== 0 && unique !== shipId
        ) {
            continue;
        }

        data.push({
            id: Number(id),
            name,
            icon: `/image/artresource/atlas/spweapon/${icon}.png`,
            rarity
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择兵装",
            selectors: [
                { label: "稀有度", id: "rarity", options: spweaponRarityOptions }
            ],
            data,
            canClear,
            iconPadding: true,
            rarityMode: "spweapon",
            onClose(id) {
                close();
                resolve(id);
            }
        }), {
            immediate: true
        });
    });
}

export function selectCommander() {
    const ids = Object.keys(ShareCfg.commander_data_template);

    const data = createSelectorData<ShareCfg.CommanderDataTemplate>();
    for (const id of ids) {
        const template = ShareCfg.commander_data_template[id];
        if (!template) {
            continue;
        }

        const { name, painting, rarity, nationality } = template;
        data.push({
            id: Number(id),
            name,
            icon: `/image/artresource/atlas/commandericon/${painting}.png`,
            rarity,
            nationality
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择指挥喵",
            selectors: [
                { label: "稀有度", id: "rarity", options: rarityOptions },
                { label: "阵营", id: "nationality", options: nationalityOptions }
            ],
            data,
            rarityMode: "commander",
            onClose(id) {
                close();
                resolve(id);
            }
        }), {
            immediate: true
        });
    });
}

export function selectNestCommander(excludes: number[], canClear: boolean) {
    const commanderStore = useCommanderStore();
    const { commanders } = storeToRefs(commanderStore);

    const data = createSelectorData();
    for (let i = 0; i < commanders.value.length; i++) {
        if (excludes.includes(i)) {
            continue;
        }
        const { name, painting, rarity } = commanders.value[i]!;
        data.push({
            id: i,
            name: name.value,
            icon: `/image/artresource/atlas/commandericon/${painting}.png`,
            rarity: rarity
        });
    }

    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();
        const { close } = modalStore.use(() => h(DialogSelector, {
            title: "选择指挥喵",
            selectors: [
                { label: "稀有度", id: "rarity", options: rarityOptions },
                { label: "阵营", id: "nationality", options: nationalityOptions }
            ],
            data,
            canClear,
            rarityMode: "commander",
            onClose(i) {
                close();
                resolve(i);
            }
        }), {
            immediate: true
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