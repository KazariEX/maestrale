<script lang="ts" setup>
    import { type Attributes, ShareCfg, type ShipType } from "maestrale";
    import { TechnologyNationality } from "#components";
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

    const dialogStore = useDialogStore();
    const technology = useTechnologyStore();

    const { open: openNationalityPanel } = dialogStore.use(() => h(TechnologyNationality));

    const selectedData = ref<ShipData[]>([]);
    const extendedData = computed<ShipData[]>(() => {
        return technology.achieveItems.map((item) => ({
            item,
            additional: technology.getAdditional(item)!,
        }));
    });

    const selectedAttrs = ref<(keyof Attributes)[]>([]);
    const totalClasses = Object.entries(ShareCfg.fleet_tech_ship_class)
        .reverse()
        .sort(([, a], [, b]) => b.t_level - a.t_level || b.t_level_1 - a.t_level_1)
        .map<ClassData>(([id, item]) => {
            const totalShips = computed(() => {
                return extendedData.value.filter((data) => item.ships.includes(data.item.id));
            });

            const filteredShips = computed(() => {
                const attrs = selectedAttrs.value;
                return attrs.length !== 0
                    ? totalShips.value.filter(({ additional }) => (
                        attrs.includes(ShareCfg.attribute_info_by_type[additional.template.add_get_attr]!.name) ||
                        attrs.includes(ShareCfg.attribute_info_by_type[additional.template.add_level_attr]!.name)
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
        const isShipTypeMatched: (type: ShipType) => boolean = technology.currentShipType === 22
            ? (type) => type === 22 || type === 23 || type === 24
            : (type) => type === technology.currentShipType;

        return totalClasses.filter((data) => (
            data.ships.value.length && isShipTypeMatched(data.shiptype)
        ));
    });

    watch(() => technology.currentShipType, () => {
        selectedData.value = [];
        selectedAttrs.value = [];
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
    <div ref="root" contain="strict" flex="~ items-start gap-6" m="t-4">
        <prime-checkbox-group grid="~ gap-4" w="40" p="2" v-model="selectedAttrs">
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
                :attr
                :disabled="!technology.maxAttrs[technology.currentShipType][attr]"
            />
            <prime-button
                size="small"
                severity="help"
                variant="outlined"
                @click="openNationalityPanel"
            >阵营科技</prime-button>
        </prime-checkbox-group>
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
            <prime-column field="name" header="舰级" header-style="width: 25%;" sortable>
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </prime-column>
            <prime-column field="nation" header="阵营" header-style="width: 20%" sortable>
                <template #body="{ data }">
                    {{ data.nationality }}
                </template>
            </prime-column>
            <prime-column field="t_level" header="Tier" sortable>
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
                    <prime-column header-class="w-0" body-class="pr-0">
                        <template #body="{ data }">
                            <rarity-icon
                                size="14"
                                :icon="data.additional.icon"
                                :rarity="data.additional.rarity"
                            />
                        </template>
                    </prime-column>
                    <prime-column header="舰船" header-style="width: 33%">
                        <template #body="{ data }">
                            <span>{{ data.additional.name }}</span>
                        </template>
                    </prime-column>
                    <prime-column header="获得">
                        <template #body="{ data }">
                            <technology-cell phase="get" v-bind="data" @toggle="toggle"/>
                        </template>
                    </prime-column>
                    <prime-column header="LV.120">
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
