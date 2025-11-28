import { type Attributes, createAttributes, createTechnologyAttributes, ShareCfg, type ShipType, type TechnologyAttributes } from "maestrale";
import { shipTypeTechMap } from "~/data/constants/ship-type";
import type { AchieveAdditional, AchieveItem, TechnologyMode } from "~/types/technology";

export const useTechnologyStore = defineStore("technology", () => {
    const mode = ref<TechnologyMode>("controller");
    const currentShipType = ref<ShipType>(1);

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

    const maxAttrs = createTechnologyAttributes();
    const controlledAttrs = reactive(createTechnologyAttributes());
    const simulatedAttrs = useSimulatedAttrs(achieveItems, getAdditional);

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
            if (item.upgrage) {
                point += template.pt_upgrage;
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
        achieveAdditionals,
        maxAttrs,
        controlledAttrs,
        simulatedAttrs,
        attrs,
        point,
        get,
        getAdditional,
    };
}, {
    persist: {
        pick: [
            "mode",
            "achieveItems",
            "controlledAttrs",
        ],
    },
});

function useSimulatedAttrs(items: Ref<AchieveItem[]>, getAdditional: (item: AchieveItem) => AchieveAdditional) {
    const attrs = {
        get 20() {
            return this[1];
        },
        get 21() {
            return this[1];
        },
        get 23() {
            return this[22];
        },
        get 24() {
            return this[22];
        },
    } as Record<ShipType, TechnologyAttributes>;

    for (const type of Object.keys(shipTypeTechMap).map(Number)) {
        const getter = computed(() => {
            const attrs = createAttributes();
            for (const item of items.value) {
                const { template } = getAdditional(item);
                if (template.add_get_shiptype.includes(type)) {
                    if (item.get) {
                        const key = ShareCfg.attribute_info_by_type[template.add_get_attr]!.name;
                        attrs[key] += template.add_get_value;
                    }
                }
                if (template.add_level_shiptype.includes(type)) {
                    if (item.level) {
                        const key = ShareCfg.attribute_info_by_type[template.add_level_attr]!.name;
                        attrs[key] += template.add_level_value;
                    }
                }
            }
            return attrs;
        });
        Object.defineProperty(attrs, type, {
            get() {
                return getter.value;
            },
        });
    }
    return attrs;
}

function createAchieveItems(): AchieveItem[] {
    const ids: number[] = [];
    for (const id of getBaseShipIds()) {
        if (id in ShareCfg.fleet_tech_ship_template) {
            ids.push(id);
        }
    }
    return ids.map((id) => ({
        id,
        get: true,
        upgrage: true,
        level: true,
    }));
}
