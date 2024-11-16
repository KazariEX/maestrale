import type {
    CommanderAbilityTemplate,
    CommanderDataTemplate,
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

export const ShareCfg = {
    async load() {
        const datas = await Promise.all([
            loadData<CommanderAbilityTemplate>("commander_ability_template"),
            loadData<CommanderDataTemplate>("commander_data_template"),
            loadData<EquipDataStatistics>("equip_data_statistics"),
            loadData<EquipDataTemplate>("equip_data_template"),
            loadData<ShipDataBlueprint>("ship_data_blueprint"),
            loadData<ShipDataBreakout>("ship_data_breakout"),
            loadData<ShipDataStatistics>("ship_data_statistics"),
            loadData<ShipDataStrengthen>("ship_data_strengthen"),
            loadData<ShipDataTemplate>("ship_data_template"),
            loadData<ShipDataTrans>("ship_data_trans"),
            loadData<ShipMetaBreakout>("ship_meta_breakout"),
            loadData<ShipMetaRepair>("ship_meta_repair"),
            loadData<ShipMetaRepairEffect>("ship_meta_repair_effect"),
            loadData<ShipSkinTemplate>("ship_skin_template"),
            loadData<ShipStrengthenBlueprint>("ship_strengthen_blueprint"),
            loadData<ShipStrengthenMeta>("ship_strengthen_meta"),
            loadData<SPWeaponDataStatistics>("spweapon_data_statistics"),
            loadData<SPWeaponType>("spweapon_type"),
            loadData<TransformDataTemplate>("transform_data_template")
        ]);
        for (const [name, data] of datas) {
            Object.defineProperty(ShareCfg, name, {
                value: data,
                configurable: false,
                enumerable: true,
                writable: false
            });
        }
    }
} as {
    load: () => Promise<void>;
    commander_ability_template: Record<string, CommanderAbilityTemplate>;
    commander_data_template: Record<string, CommanderDataTemplate>;
    equip_data_statistics: Record<string, EquipDataStatistics>;
    equip_data_template: Record<string, EquipDataTemplate>;
    ship_data_blueprint: Record<string, ShipDataBlueprint>;
    ship_data_breakout: Record<string, ShipDataBreakout>;
    ship_data_statistics: Record<string, ShipDataStatistics>;
    ship_data_strengthen: Record<string, ShipDataStrengthen>;
    ship_data_template: Record<string, ShipDataTemplate>;
    ship_data_trans: Record<string, ShipDataTrans>;
    ship_meta_breakout: Record<string, ShipMetaBreakout>;
    ship_meta_repair: Record<string, ShipMetaRepair>;
    ship_meta_repair_effect: Record<string, ShipMetaRepairEffect>;
    ship_skin_template: Record<string, ShipSkinTemplate>;
    ship_strengthen_blueprint: Record<string, ShipStrengthenBlueprint>;
    ship_strengthen_meta: Record<string, ShipStrengthenMeta>;
    spweapon_data_statistics: Record<string, SPWeaponDataStatistics>;
    spweapon_type: Record<string, SPWeaponType>;
    transform_data_template: Record<string, TransformDataTemplate>;
};

async function loadData<T>(name: ShareCfgName) {
    const data = await import(`../../../data/ShareCfg(VVVIP)/${name}.json`);
    return [
        name,
        data.default as Record<string, T>
    ] as const;
}