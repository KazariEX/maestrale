import { ShareCfg, type ShipDataStatistics } from "maestrale";
import { LibSelector } from "#components";
import { type Fleet, fleetMap } from "~/data/constraint/fleet";
import { nationalityOptions } from "~/data/constraint/nationality";
import { rarityOptions } from "~/data/constraint/rarity";
import { shipTypeOptions } from "~/data/constraint/ship-type";

export function selectShip(fleet: Fleet, canClear: boolean) {
    const modalStore = useModalStore();

    const ids = new Set(
        Object.keys(ShareCfg.ship_data_statistics)
        .map((id) => id.slice(0, id.length - 1))
        .filter((id) => !id.startsWith("900"))
    );

    const data: (Partial<ShipDataStatistics> & {
        id: number;
        name: string;
        icon: string;
        rarity: number;
    })[] = [];
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