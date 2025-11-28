<script lang="ts" setup>
    import { ShareCfg, type TechnologyAttributes } from "maestrale";
    import { attributeMap } from "~/data/constants/attribute";
    import { nationalityMap } from "~/data/constants/nationality";
    import type { AchieveAdditional, AchieveItem, AchievePhase } from "~/types/technology";

    interface ClassData extends Omit<ShareCfg.FleetTechShipClass, "ships"> {
        id: string;
        nationality: string;
        ships: ComputedRef<ShipData[]>;
    }

    interface ShipData {
        item: AchieveItem;
        additional: AchieveAdditional;
    }

    const technology = useTechnologyStore();

    const selectedData = ref<ShipData[]>([]);
    const extendedData = computed<ShipData[]>(() => {
        return technology.achieveItems.map((item) => ({
            item,
            additional: technology.getAdditional(item)!,
        }));
    });

    const selectedAttr = ref<keyof TechnologyAttributes>();
    function selectAttr(attr: keyof TechnologyAttributes) {
        if (selectedAttr.value === attr) {
            selectedAttr.value = void 0;
        }
        else {
            selectedAttr.value = attr;
        }
    }

    const totalClasses = Object.entries(ShareCfg.fleet_tech_ship_class)
        .map<ClassData>(([id, item]) => {
            const totalShips = computed(() => {
                return extendedData.value.filter((data) => item.ships.includes(data.item.id));
            });

            const filteredShips = computed(() => {
                const attr = selectedAttr.value;
                return attr !== void 0
                    ? totalShips.value.filter(({ additional }) => (
                        attr === ShareCfg.attribute_info_by_type[additional.template.add_get_attr]!.name ||
                        attr === ShareCfg.attribute_info_by_type[additional.template.add_level_attr]!.name
                    ))
                    : totalShips.value;
            });

            return {
                ...item,
                id,
                nationality: nationalityMap[item.nation],
                ships: filteredShips,
            };
        });

    const expandedClasses = ref<ClassData[]>([]);
    const filteredClasses = computed(() => {
        return totalClasses.filter((item) => (
            item.ships.value.length && item.shiptype === technology.currentShipType
        ));
    });

    watch(() => technology.currentShipType, () => {
        selectedData.value = [];
        selectedAttr.value = void 0;
    });

    const rootEl = useTemplateRef("root");
    const { height } = useElementSize(rootEl);

    const rows = computed(() => {
        return Math.max(Math.floor((height.value - 102) / 57), 0);
    });

    function toggle(id: number, phase: AchievePhase) {
        const item = technology.achieveItems.find((item) => item.id === id)!;
        const value = item[phase];

        if (selectedData.value.some((data) => data.item === item)) {
            for (const { item } of selectedData.value) {
                update(item);
            }
        }
        else {
            update(item);
        }

        function update(item: AchieveItem) {
            item[phase] = !value;
            if (phase === "get") {
                if (value) {
                    item.upgrage = false;
                    item.level = false;
                }
            }
            else if (!value) {
                item.get = true;
            }
        }
    }
</script>

<template>
    <div ref="root" contain="strict" flex="~ items-start gap-4" m="t-4">
        <ul grid="~ gap-4" p="2">
            <technology-numeric
                p="b-4"
                b-b="~ solid border"
                label="科技"
                :value="technology.point"
            />
            <technology-numeric
                v-for="(_, attr) in technology.maxAttrs[1]"
                :label="attributeMap[attr]"
                :value="technology.simulatedAttrs[technology.currentShipType][attr]"
                :selector="!!technology.maxAttrs[technology.currentShipType][attr]"
                :selected="selectedAttr === attr"
                @select="selectAttr(attr)"
            />
        </ul>
        <prime-data-table
            flex="1"
            :value="filteredClasses"
            data-key="id"
            paginator
            :rows
            scrollable
            scroll-height="flex"
            sort-field="t_level"
            :sort-order="-1"
            removable-sort
            v-model:expanded-rows="expandedClasses"
        >
            <prime-column header-style="width: 0;" expander/>
            <prime-column header="舰级" header-style="width: 25%;" field="name" sortable>
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </prime-column>
            <prime-column header="阵营" header-style="width: 20%" field="nation" sortable>
                <template #body="{ data }">
                    {{ data.nationality }}
                </template>
            </prime-column>
            <prime-column header="Tier" field="t_level" sortable>
                <template #body="{ data: { t_level, ships } }: { data: ClassData }">
                    <div flex="~ justify-between items-center">
                        <span>T{{ t_level }}</span>
                        <prime-avatar-group>
                            <prime-avatar
                                v-for="{ additional } in ships.value.slice(0, ships.value.length > 7 ? 6 : 7)"
                                :image="additional.icon"
                                shape="circle"
                            />
                            <prime-avatar
                                v-if="ships.value.length > 7"
                                p="r-1px"
                                text="xs slate"
                                :label="`+${ships.value.length - 6}`"
                                shape="circle"
                            />
                        </prime-avatar-group>
                    </div>
                </template>
            </prime-column>
            <template #expansion="props">
                <prime-data-table
                    m="b-4"
                    :value="props.data.ships.value"
                    data-key="item.id"
                    selection-mode="multiple"
                    v-model:selection="selectedData"
                >
                    <prime-column header="舰船">
                        <template #body="{ data }">
                            <technology-ship v-bind="data"/>
                        </template>
                    </prime-column>
                    <prime-column header="获得" header-style="width: 25%;">
                        <template #body="{ data }">
                            <technology-cell phase="get" v-bind="data" @toggle="toggle"/>
                        </template>
                    </prime-column>
                    <prime-column header="LV.120" header-style="width: 25%;">
                        <template #body="{ data }">
                            <technology-cell phase="level" v-bind="data" @toggle="toggle"/>
                        </template>
                    </prime-column>
                    <prime-column header="满星" header-style="width: 10%;">
                        <template #body="{ data }">
                            <technology-cell phase="upgrage" v-bind="data" @toggle="toggle"/>
                        </template>
                    </prime-column>
                </prime-data-table>
            </template>
        </prime-data-table>
    </div>
</template>
