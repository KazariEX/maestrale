import { type EquipDataStatistics, type EquipType, ShareCfg, type ShipDataStatistics, type ShipType, type SPWeaponDataStatistics } from "maestrale";
import { LibSelector } from "#components";
import { equipTypeOptions } from "~/data/constraint/equip-type";
import { type Fleet, fleetMap } from "~/data/constraint/fleet";
import { nationalityOptions } from "~/data/constraint/nationality";
import { rarityOptions } from "~/data/constraint/rarity";
import { shipTypeOptions } from "~/data/constraint/ship-type";
import { spweaponRarityOptions } from "~/data/constraint/spweapon-rarity";

export function selectShip(fleet: Fleet, canClear: boolean) {
    const ids = new Set(
        Object.keys(ShareCfg.ship_data_statistics)
        .map((id) => id.slice(0, id.length - 1))
        .filter((id) => !id.startsWith("900"))
    );

    const data = createSelectorData<ShipDataStatistics>();
    for (const id of ids) {
        const statistics = ShareCfg.ship_data_statistics[id + "1"];
        if (!statistics) {
            continue;
        }

        const { rarity, type, nationality, name } = statistics;
        if (fleetMap[type] !== fleet) {
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
        const { close } = modalStore.use(() => h(LibSelector, {
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

    const data = createSelectorData<EquipDataStatistics>();
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
        const { close } = modalStore.use(() => h(LibSelector, {
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

    const data = createSelectorData<SPWeaponDataStatistics>();
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
        const { close } = modalStore.use(() => h(LibSelector, {
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

function createSelectorData<T>(): (Partial<T> & {
    id: number;
    name: string;
    icon: string;
    rarity: number;
})[] {
    return [];
}