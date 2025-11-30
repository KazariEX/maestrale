import type { ShareCfg, ShipType } from "maestrale";

export type TechnologyMode = "controller" | "simulator";

export type AchievePhase = "get" | "upgrade" | "level";

export interface AchieveItem {
    id: number;
    get: boolean;
    upgrade: boolean;
    level: boolean;
}

export interface AchieveAdditional {
    name: string;
    icon: string;
    rarity: number;
    type: ShipType;
    template: ShareCfg.FleetTechShipTemplate;
}
