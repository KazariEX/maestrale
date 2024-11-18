import type { ShipType } from "maestrale";

export type FleetType = "main" | "vanguard" | "submarine";

const table: Record<FleetType, ShipType[]> = {
    main: [
        4,
        5,
        6,
        7,
        10,
        12,
        13,
        21,
        24
    ],
    vanguard: [
        1,
        2,
        3,
        18,
        19,
        20,
        23
    ],
    submarine: [
        8,
        17,
        22
    ]
};

export const fleetMap = Object.fromEntries(
    Object.entries(table).flatMap(([fleet, types]) => types.map((type) => [type, fleet]))
) as Record<ShipType, FleetType>;