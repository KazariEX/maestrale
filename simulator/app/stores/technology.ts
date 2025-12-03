import { type Attributes, createAttributes, createTechnologyAttributes, type Nationality, ShareCfg, ShipType } from "maestrale";
import { objectKeys } from "maestrale/utils";
import type { AchieveAdditional, AchieveItem, TechnologyMode } from "~/types/technology";

export const useTechnologyStore = defineStore("technology", () => {
    const mode = ref<TechnologyMode>("controller");
    const currentShipType = ref(ShipType.Destroyer);

    const achieveItems = ref(createAchieveItems());
    const achieveAdditionals = new WeakMap<object, AchieveAdditional>();

    // 在游戏数据更新时修补本地缓存
    watchOnce(achieveItems, (storeItems, initialItems) => {
        if (!initialItems?.length || storeItems.length === initialItems.length) {
            return;
        }
        for (let i = 0; i < initialItems.length; i++) {
            const initialItem = initialItems[i]!;
            const storeItem = storeItems[i];
            if (initialItem.id !== storeItem?.id) {
                achieveItems.value.splice(i, 0, initialItem);
            }
        }
    });

    const nationalityMaxLevels = Object.values(ShareCfg.fleet_tech_template).reduce((res, { groupid }) => {
        res[groupid] ??= 0;
        res[groupid]++;
        return res;
    }, {} as Record<Nationality, number>);
    const nationalityLevels = ref({ ...nationalityMaxLevels });

    const maxAttrs = createTechnologyAttributes();
    const controlledAttrs = reactive(createTechnologyAttributes());
    const simulatedAttrs = useSimulatedAttrs();

    const attrs = computed(() => {
        return mode.value === "controller" ? controlledAttrs : simulatedAttrs;
    });

    const point = computed(() => {
        return achieveItems.value.reduce((res, item) => {
            const { template } = getAdditional(item);
            let point = 0;
            if (item.get) {
                point += template.pt_get;
            }
            if (item.upgrade) {
                point += template.pt_upgrade;
            }
            if (item.level) {
                point += template.pt_level;
            }
            return res + point;
        }, 0);
    });

    function get(type: ShipType, attr: keyof Attributes) {
        if (attr === "speed" || attr === "luck") {
            return 0;
        }
        return attrs.value[type][attr];
    }

    function getAdditional(item: AchieveItem) {
        let additional = achieveAdditionals.get(item);
        if (!additional) {
            const { id } = item;
            const statistics = ShareCfg.ship_data_statistics[id + "1"]!;
            achieveAdditionals.set(item, additional = {
                name: statistics.name,
                icon: getSquareIconAtlas(ShareCfg.ship_skin_template[id + "0"]!.painting),
                rarity: statistics.rarity,
                type: statistics.type,
                template: ShareCfg.fleet_tech_ship_template[id]!,
            });
        }
        return additional;
    }

    return {
        mode,
        currentShipType,
        achieveItems,
        nationalityMaxLevels,
        nationalityLevels,
        maxAttrs,
        controlledAttrs,
        simulatedAttrs,
        attrs,
        point,
        get,
        getAdditional,
    };

    function useSimulatedAttrs() {
        const attrs = createTechnologyAttributes();

        const fleetAdds = computed(() => {
            const result: ShareCfg.FleetTechTemplate["add"] = [];
            for (const [nationality, level] of Object.entries(nationalityLevels.value)) {
                const key = Number(nationality) * 1000 + level;
                const template = ShareCfg.fleet_tech_template[key];
                if (template) {
                    result.push(...template.add);
                }
            }
            return result;
        });

        for (const type of objectKeys(attrs).map<ShipType>(Number)) {
            if (Object.getOwnPropertyDescriptor(attrs, type)?.get) {
                continue;
            }

            const nationalityAttrs = computed(() => {
                const attrs = createAttributes();
                for (const [types, key, value] of fleetAdds.value) {
                    if (types.includes(type)) {
                        const attr = ShareCfg.attribute_info_by_type[key]!.name;
                        attrs[attr] += value;
                    }
                }
                return attrs;
            });

            const archivedAttrs = computed(() => {
                const attrs = createAttributes();
                for (const item of achieveItems.value) {
                    const { template } = getAdditional(item);
                    if (template.add_get_shiptype.includes(type)) {
                        if (item.get) {
                            const attr = ShareCfg.attribute_info_by_type[template.add_get_attr]!.name;
                            attrs[attr] += template.add_get_value;
                        }
                    }
                    if (template.add_level_shiptype.includes(type)) {
                        if (item.level) {
                            const attr = ShareCfg.attribute_info_by_type[template.add_level_attr]!.name;
                            attrs[attr] += template.add_level_value;
                        }
                    }
                }
                return attrs;
            });

            const simulatedAttrs = computed(() => {
                const attrs = {
                    ...nationalityAttrs.value,
                };
                for (const attr of objectKeys(attrs)) {
                    attrs[attr] += archivedAttrs.value[attr];
                }
                return attrs;
            });

            Object.defineProperty(attrs, type, {
                get() {
                    return simulatedAttrs.value;
                },
            });
        }
        return attrs;
    }
}, {
    persist: {
        pick: [
            "mode",
            "achieveItems",
            "nationalityLevels",
            "controlledAttrs",
        ],
    },
});

function createAchieveItems(): AchieveItem[] {
    return Object.keys(ShareCfg.fleet_tech_ship_template).map((id) => ({
        id: Number(id),
        get: true,
        upgrade: true,
        level: true,
    }));
}
