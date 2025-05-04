import type { ShipType } from "maestrale";

export const shipTypeMap: Record<ShipType, string> = {
    1: "驱逐",
    2: "轻巡",
    3: "重巡",
    4: "战巡",
    5: "战列",
    6: "轻航",
    7: "正航",
    8: "潜艇",
    10: "航战",
    12: "维修",
    13: "重炮",
    17: "潜母",
    18: "超巡",
    19: "运输",
    20: "导驱(先锋)",
    21: "导驱(主力)",
    22: "风帆S",
    23: "风帆V",
    24: "风帆M",
};

export const shipTypeOptions = createSelectorOptions(shipTypeMap);

export const shipTypeTechMap = {
    1: "驱逐",
    2: "轻巡",
    3: "重巡",
    4: "战巡",
    5: "战列",
    6: "轻航",
    7: "正航",
    8: "潜艇",
    10: "航战",
    12: "维修",
    13: "重炮",
    17: "潜母",
    18: "超巡",
    19: "运输",
    22: "风帆",
} as Record<ShipType, string>;

export const shipTypeTechOptions = createSelectorOptions(shipTypeTechMap);
