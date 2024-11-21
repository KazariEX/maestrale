import type { SC } from "./types";

export const ShareCfg = {
    async load() {
        const datas = await Promise.all([
            loadData<SC.AttributeInfoByType>("attribute_info_by_type"),
            loadData<SC.CommanderAbilityTemplate>("commander_ability_template"),
            loadData<SC.CommanderDataTemplate>("commander_data_template"),
            loadData<SC.EquipDataStatistics>("equip_data_statistics"),
            loadData<SC.EquipDataTemplate>("equip_data_template"),
            loadData<SC.ShipDataBlueprint>("ship_data_blueprint"),
            loadData<SC.ShipDataBreakout>("ship_data_breakout"),
            loadData<SC.ShipDataStatistics>("ship_data_statistics"),
            loadData<SC.ShipDataStrengthen>("ship_data_strengthen"),
            loadData<SC.ShipDataTemplate>("ship_data_template"),
            loadData<SC.ShipDataTrans>("ship_data_trans"),
            loadData<SC.ShipMetaBreakout>("ship_meta_breakout"),
            loadData<SC.ShipMetaRepair>("ship_meta_repair"),
            loadData<SC.ShipMetaRepairEffect>("ship_meta_repair_effect"),
            loadData<SC.ShipSkinTemplate>("ship_skin_template"),
            loadData<SC.ShipStrengthenBlueprint>("ship_strengthen_blueprint"),
            loadData<SC.ShipStrengthenMeta>("ship_strengthen_meta"),
            loadData<SC.SPWeaponDataStatistics>("spweapon_data_statistics"),
            loadData<SC.SPWeaponType>("spweapon_type"),
            loadData<SC.TransformDataTemplate>("transform_data_template")
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
    attribute_info_by_type: Record<string, SC.AttributeInfoByType>;
    commander_ability_template: Record<string, SC.CommanderAbilityTemplate>;
    commander_data_template: Record<string, SC.CommanderDataTemplate>;
    equip_data_statistics: Record<string, SC.EquipDataStatistics>;
    equip_data_template: Record<string, SC.EquipDataTemplate>;
    ship_data_blueprint: Record<string, SC.ShipDataBlueprint>;
    ship_data_breakout: Record<string, SC.ShipDataBreakout>;
    ship_data_statistics: Record<string, SC.ShipDataStatistics>;
    ship_data_strengthen: Record<string, SC.ShipDataStrengthen>;
    ship_data_template: Record<string, SC.ShipDataTemplate>;
    ship_data_trans: Record<string, SC.ShipDataTrans>;
    ship_meta_breakout: Record<string, SC.ShipMetaBreakout>;
    ship_meta_repair: Record<string, SC.ShipMetaRepair>;
    ship_meta_repair_effect: Record<string, SC.ShipMetaRepairEffect>;
    ship_skin_template: Record<string, SC.ShipSkinTemplate>;
    ship_strengthen_blueprint: Record<string, SC.ShipStrengthenBlueprint>;
    ship_strengthen_meta: Record<string, SC.ShipStrengthenMeta>;
    spweapon_data_statistics: Record<string, SC.SPWeaponDataStatistics>;
    spweapon_type: Record<string, SC.SPWeaponType>;
    transform_data_template: Record<string, SC.TransformDataTemplate>;
};

async function loadData<T>(name: string) {
    const data = await import(`../../../data/ShareCfg(VVVIP)/${name}.json`);
    return [
        name,
        data.default as Record<string, T>
    ] as const;
}