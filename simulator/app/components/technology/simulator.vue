<script lang="ts" setup>
    import { type Attributes, Nationality, ShareCfg, type ShipType } from "maestrale";
    import { TechnologyNationality } from "#components";
    import { attributeMap } from "~/data/constants/attribute";
    import { nationalityMap } from "~/data/constants/nationality";
    import type { AchieveAdditional, AchieveItem, AchievePhase } from "~/types/technology";

    interface ClassData {
        id: string;
        name: string;
        nationality: string;
        ships: ComputedRef<ShipData[]>;
        tier?: number;
    }

    interface ShipData {
        item: AchieveItem;
        additional: AchieveAdditional;
    }

    const dialogStore = useDialogStore();
    const technology = useTechnologyStore();

    const { open: openNationalityPanel } = dialogStore.use(() => h(TechnologyNationality));

    const selectedShips = ref<ShipData[]>([]);
    const extendedShips = computed<ShipData[]>(() => {
        return technology.achieveItems.map((item) => ({
            item,
            additional: technology.getAdditional(item)!,
        }));
    });

    const selectedAttrs = ref<(keyof Attributes)[]>([]);

    function isShipTypeMatched(type: ShipType) {
        return technology.currentShipType === 22
            ? type === 22 || type === 23 || type === 24
            : type === technology.currentShipType;
    }

    function useFilteredShips(ships: number[], shipType?: boolean) {
        const totalShips = computed(() => {
            return extendedShips.value.filter((data) => ships.includes(data.item.id));
        });

        const filteredShips = computed(() => {
            const attrs = selectedAttrs.value;
            return totalShips.value.filter(({ additional }) => {
                if (
                    attrs.length && !(
                    attrs.includes(ShareCfg.attribute_info_by_type[additional.template.add_get_attr]!.name) ||
                    attrs.includes(ShareCfg.attribute_info_by_type[additional.template.add_level_attr]!.name)
                )) {
                    return false;
                }
                if (shipType && !isShipTypeMatched(additional.type)) {
                    return false;
                }
                return true;
            });
        });

        return filteredShips;
    }

    const generalClasses = Object.entries(ShareCfg.fleet_tech_ship_class)
        .filter(([, { nation }]) => nation !== Nationality.META && nation !== Nationality.Tempesta)
        .sort(([, a], [, b]) => b.t_level - a.t_level || b.t_level_1 - a.t_level_1)
        .map(([id, data]) => ({
            id,
            name: data.name,
            nationality: nationalityMap[data.nation],
            ships: useFilteredShips(data.ships),
            shipType: data.shiptype,
            tier: data.t_level,
        }));

    const specialClasses = Object.entries(ShareCfg.fleet_tech_meta_class)
        .map(([id, data]) => ({
            id,
            name: data.name,
            nationality: nationalityMap[data.nation],
            ships: useFilteredShips(data.ships, true),
        }));

    const expandedClasses = ref<ClassData[]>([]);
    const filteredClasses = computed<ClassData[]>(() => [
        ...generalClasses.filter((data) => isShipTypeMatched(data.shipType) && data.ships.value.length),
        ...specialClasses.filter((data) => data.ships.value.length),
    ]);

    watch(() => technology.currentShipType, () => {
        selectedShips.value = [];
        selectedAttrs.value = [];
    });

    const tableComp = useTemplateRef("table");
    const { height } = useElementSize(tableComp as any);

    const rows = computed(() => {
        return Math.max(Math.floor((height.value - 102) / 57), 0);
    });

    function toggle(item: AchieveItem, phase: AchievePhase) {
        const value = item[phase];

        if (selectedShips.value.some((data) => data.item === item)) {
            for (const { item } of selectedShips.value) {
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
    <prime-checkbox-group grid="~ self-start gap-4" w="40" p="2" v-model="selectedAttrs">
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
        ref="table"
        contain="strict"
        :value="filteredClasses"
        data-key="id"
        paginator
        :rows
        scrollable
        scroll-height="flex"
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
        <prime-column field="tier" header="Tier" sortable>
            <template #body="{ data: { tier, ships } }: { data: ClassData }">
                <div flex="~ items-center">
                    <span v-if="tier">T{{ tier }}</span>
                    <prime-avatar-group m="l-auto">
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
                v-model:selection="selectedShips"
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
</template>
