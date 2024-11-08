import type {
    EquipDataStatistics,
    EquipDataTemplate,
    ShareCfgName,
    ShipDataBlueprint,
    ShipDataBreakout,
    ShipDataStatistics,
    ShipDataStrengthen,
    ShipDataTemplate,
    ShipDataTrans,
    ShipMetaBreakout,
    ShipMetaRepair,
    ShipMetaRepairEffect,
    ShipSkinTemplate,
    ShipStrengthenBlueprint,
    ShipStrengthenMeta,
    SPWeaponDataStatistics,
    SPWeaponType,
    TransformDataTemplate
} from "./types";

const data = await Promise.all([
    loadEquipDataStatistics(),
    loadEquipDataTemplate(),
    loadShipDataBlueprint(),
    loadShipDataBreakout(),
    loadShipDataStatistics(),
    loadShipDataStrengthen(),
    loadShipDataTemplate(),
    loadShipDataTrans(),
    loadShipMetaBreakout(),
    loadShipMetaRepair(),
    loadShipMetaRepairEffect(),
    loadShipSkinTemplate(),
    loadShipStrengthenBlueprint(),
    loadShipStrengthenMeta(),
    loadSPWeaponDataStatistics(),
    loadSPWeaponType(),
    loadTransformDataTemplate()
]);

export const ShareCfg = {
    equip_data_statistics: data[0],
    equip_data_template: data[1],
    ship_data_blueprint: data[2],
    ship_data_breakout: data[3],
    ship_data_statistics: data[4],
    ship_data_strengthen: data[5],
    ship_data_template: data[6],
    ship_data_trans: data[7],
    ship_meta_breakout: data[8],
    ship_meta_repair: data[9],
    ship_meta_repair_effect: data[10],
    ship_skin_template: data[11],
    ship_strengthen_blueprint: data[12],
    ship_strengthen_meta: data[13],
    spweapon_data_statistics: data[14],
    spweapon_type: data[15],
    transform_data_template: data[16]
};

function loadEquipDataStatistics() {
    return loadData<EquipDataStatistics>("equip_data_statistics");
}

function loadEquipDataTemplate() {
    return loadData<EquipDataTemplate>("equip_data_template");
}

function loadShipDataBlueprint() {
    return loadData<ShipDataBlueprint>("ship_data_blueprint");
}

function loadShipDataBreakout() {
    return loadData<ShipDataBreakout>("ship_data_breakout");
}

function loadShipDataStatistics() {
    return loadData<ShipDataStatistics>("ship_data_statistics");
}

function loadShipDataStrengthen() {
    return loadData<ShipDataStrengthen>("ship_data_strengthen");
}

function loadShipDataTemplate() {
    return loadData<ShipDataTemplate>("ship_data_template");
}

function loadShipDataTrans() {
    return loadData<ShipDataTrans>("ship_data_trans");
}

function loadShipMetaBreakout() {
    return loadData<ShipMetaBreakout>("ship_meta_breakout");
}

function loadShipMetaRepair() {
    return loadData<ShipMetaRepair>("ship_meta_repair");
}

function loadShipMetaRepairEffect() {
    return loadData<ShipMetaRepairEffect>("ship_meta_repair_effect");
}

function loadShipSkinTemplate() {
    return loadData<ShipSkinTemplate>("ship_skin_template");
}

function loadShipStrengthenBlueprint() {
    return loadData<ShipStrengthenBlueprint>("ship_strengthen_blueprint");
}

function loadShipStrengthenMeta() {
    return loadData<ShipStrengthenMeta>("ship_strengthen_meta");
}

function loadSPWeaponDataStatistics() {
    return loadData<SPWeaponDataStatistics>("spweapon_data_statistics");
}

function loadSPWeaponType() {
    return loadData<SPWeaponType>("spweapon_type");
}

function loadTransformDataTemplate() {
    return loadData<TransformDataTemplate>("transform_data_template");
}

async function loadData<T>(name: ShareCfgName) {
    const data = await import(`../../../data/ShareCfg(VVVIP)/${name}.json`);
    return data.default as Record<string, T>;
}